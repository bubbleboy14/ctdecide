from cantools import db
from cantools import config
from ctuser.model import CTUser, Conversation
cfg = config.ctdecide

class Proposal(db.TimeStampedBase):
    user = db.ForeignKey()
    conversation = db.ForeignKey(kind=Conversation)
    name = db.String()
    description = db.Text()

    def votership(self):
        return CTUser.query().count()

    def onpass(self):
        pass # do whatever -- email peeps?

    def passed(self):
        total_users = self.votership()
        total_votes = Vote.query(Vote.proposal == self.key).count()
        yes_votes = Vote.query(Vote.proposal == self.key,
            Vote.position == True).count()
        if total_votes / float(total_users) >= cfg.thresholds.participation:
            if cfg.mode == "democracy":
                thresh = cfg.thresholds.majority
            else: # consensus
                thresh = 1
                if Objection.query(Objection.proposal == self.key,
                    Objection.closed == False).count():
                    return False
            return yes_votes / float(total_votes) >= thresh
        return False

    def vote(self, user, position):
        existing = Vote.query(Vote.user == user,
            Vote.proposal == self.key).get()
        if existing:
            from cantools.web import fail
            fail("you already voted!")
        Vote(user=user, proposal=self.key, position=position).put()
        if self.passed():
            self.onpass()

    def count(self, user=None):
        d = {
            "yup": Vote.query(Vote.proposal == self.key,
                Vote.position == True).count(),
            "nope": Vote.query(Vote.proposal == self.key,
                Vote.position == False).count()
        }
        if user:
            uvote = Vote.query(Vote.user == user,
                Vote.proposal == self.key).get()
            if uvote:
                d["user"] = uvote.position
        return d

class Objection(db.TimeStampedBase):
    user = db.ForeignKey()
    proposal = db.ForeignKey(kind=Proposal)
    name = db.String()
    description = db.Text()
    closed = db.Boolean(default=False)

class Vote(db.TimeStampedBase):
    user = db.ForeignKey()
    proposal = db.ForeignKey(kind=Proposal)
    position = db.Boolean()