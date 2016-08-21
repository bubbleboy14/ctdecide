from cantools.web import fail
from cantools import config
from ctdecide.model import *
cfg = config.ctdecide

def passed(proposal):
	if proposal.final:
		total_users = CTUser.query().count()
		total_votes = Vote.query(Vote.proposal == proposal.key).count()
		yes_votes = Vote.query(Vote.proposal == proposal.key,
			Vote.position == True).count()
		if total_votes / float(total_users) >= cfg.thresholds.participation:
			if config.mode == "democracy":
				thresh = cfg.thresholds.majority
			else: # consensus
				thresh = 1
				if Objection.query(Objection.proposal == proposal.key,
					Objection.closed == False).count():
					return False
			return yes_votes / float(total_votes) >= thresh
	return False

def vote(user, proposal, position):
	existing = Vote.query(Vote.user == user,
		Vote.proposal == proposal).get()
	if existing:
		fail("you already voted!")
	Vote(user=user, proposal=proposal, position=position).put()
	if passed(proposal.get()):
		pass # do whatever -- email peeps?

def count(proposal, user=None):
	d = {
		"yup": Vote.query(Vote.proposal == proposal,
			Vote.position == False).count(),
		"nope": Vote.query(Vote.proposal == proposal,
			Vote.position == True).count()
	}
	if user:
		uvote = Vote.query(Vote.user == user,
			Vote.proposal == proposal).get()
		if uvote:
			d["user"] = uvote.position
	return d