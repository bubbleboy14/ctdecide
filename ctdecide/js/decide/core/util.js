decide.core.util = {
	_newProp: "<b>New Proposal</b>",
	proposer: function(node) {
		CT.dom.setContent(node || decide.core.util._content, [
			CT.dom.node("New Proposal", "div", "biggest bold padded"),
			CT.dom.node([
				CT.dom.node("name", "div", "bigger"),
				CT.dom.field(null, null, "w1 block"),
				CT.dom.node("description", "div", "bigger"),
				CT.dom.textArea(null, null, "w1 block"),
				CT.dom.button("Submit")
			], "div", "round bordered padded")
		]);
	},
	proposal: function(prop) {
		if (prop.label == decide.core.util._newProp)
			return decide.core.util.proposer();
		var votes = CT.dom.node, objections = CT.dom.node();
		CT.dom.setContent(decide.core.util._content, [
			CT.dom.node(prop.name, "div", "biggest bold padded"),
			CT.dom.node(prop.description, "div", "padded"),
			CT.dom.node("Final: " + (prop.final ?
				"Yup" : "Nope"), "div", "bold padded"),
			votes, objections
		]);
		decide.core.util.get.objections(function(objs) {
			objs.length && CT.dom.setContent(objections, [
				CT.dom.node("Objections", "div", "bigger bold padded"),
				objs.map(function(obj) {
					return [
						CT.dom.node(obj.name, "div", "big bold padded"),
						CT.dom.node(obj.description, "div", "padded")
					];
				})
			]);
		}, prop);
		decide.core.util.get.votes(function(data) {
			var vnode = CT.dom.node("replace with yup/nope buttons OR how you voted (requires ctuser integration)");
			CT.dom.setContent(votes, [
				CT.dom.node("Votes", "div", "bigger bold padded"),
				"Yup: " + data.yup,
				"Nope: " + data.nope,
				"Total: " + (data.yup + data.nope),
				vnode
			]);
		}, prop);
	},
	proposals: function(parent) {
		parent = parent || document.body;
		decide.core.util.get.proposals(function(props) {
			props.unshift({
				label: decide.core.util._newProp
			});
			decide.core.util._content = CT.dom.node();
			CT.dom.setContent(parent, [
				CT.panel.triggerList(props, decide.core.util.proposal),
				decide.core.util._content
			]);
		});
	}
};

decide.core.util.get = {
	votes: function(cb, prop) {
		var params = { action: "votes", proposal: prop.key },
			u = user.core.get();
		if (u) params.user = u;
		CT.net.post("/_decide", params, null, cb);
	},
	objections: function(cb, prop) {
		CT.db.get("objection", cb, null, null, null, {
			proposal: prop.key,
			closed: false
		});
	},
	proposals: function(cb, limit, offset, order, filters, sync) {
		return CT.db.get("proposal", cb, limit, offset, order, filters, sync);
	}
};

CT.db.setLimit(1000);