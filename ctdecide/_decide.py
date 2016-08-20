from cantools.web import respond, succeed, fail, cgi_get
from cantools import config
from ctdecide.util import vote, count
from model import db, Proposal, Objection, Vote

def response():
    action = cgi_get("action", choices=["propose", "object", "vote", "votes"])
    user = cgi_get("user", required=False)
    if action == "propose":
        prop = Proposal(user=user, name=cgi_get("name"),
            description=cgi_get("description"))
        prop.put()
        succeed(prop.key.urlsafe())
    proposal = db.KeyWrapper(cgi_get("proposal"))
    if action == "object":
        obj = Objection(user=user, proposal=proposal,
            name=cgi_get("name"), description=cgi_get("description"))
        obj.put()
        succeed(obj.key.urlsafe())
    elif action == "vote":
        vote(user, proposal, cgi_get("position"))
    elif action == "votes":
        proposal = cgi_get("proposal")
        obj = count(proposal)
        if user:
            v = Vote.query(Vote.user == user,
                Vote.proposal == proposal).get()
            if v:
                obj["user"] = v.position
        succeed(obj)

respond(response)