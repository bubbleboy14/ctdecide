from cantools.web import respond, succeed, fail, cgi_get
from cantools import config
from model import db, Proposal, Objection, Vote, Conversation

def response():
    action = cgi_get("action", choices=["propose", "object", "vote", "votes"])
    user = cgi_get("user")
    if action == "propose":
        prop = Proposal(user=user, name=cgi_get("name"),
            description=cgi_get("description"))
        convo = Conversation(topic=prop.name)
        convo.put()
        prop.conversation = convo.key
        prop.put()
        succeed(prop.data())
    proposal = db.get(cgi_get("proposal"))
    if action == "object":
        obj = Objection(user=user, proposal=proposal.key,
            name=cgi_get("name"), description=cgi_get("description"))
        obj.put()
        succeed(obj.key.urlsafe())
    elif action == "vote":
        proposal.vote(user, cgi_get("position"))
    elif action == "votes":
        succeed(proposal.count(user))

respond(response)