from cantools import db
from ctuser.model import CTUser

class Proposal(db.TimeStampedBase):
  user = db.ForeignKey(kind=CTUser)
  name = db.String()
  description = db.Text()
  final = db.Boolean(default=False)

class Objection(db.TimeStampedBase):
  user = db.ForeignKey(kind=CTUser)
  proposal = db.ForeignKey(kind=Proposal)
  name = db.String()
  description = db.Text()
  closed = db.Boolean(default=False)

class Vote(db.TimeStampedBase):
  user = db.ForeignKey(kind=CTUser)
  proposal = db.ForeignKey(kind=Proposal)
  position = db.Boolean()