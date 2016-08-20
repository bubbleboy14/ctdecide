decide.core.util = {
	_newProp: "<b>New Proposal</b>",
	proposer: function(node) {
		var name = CT.dom.field(null, null, "w1 block"),
			description = CT.dom.textArea(null, null, "w1 block");
		CT.dom.setContent(node || decide.core.util._content, [
			CT.dom.node("New Proposal", "div", "biggest bold padded"),
			CT.dom.node([
				CT.dom.node("name", "div", "bigger"),
				name,
				CT.dom.node("description", "div", "bigger"),
				description,
				CT.dom.button("Submit", function() {
					if (!name.value || !description.value)
						return alert("please provide name and description");
					var props = {
						name: name.value,
						description: description.value
					};
					CT.net.post("/_decide", CT.merge({
						action: "propose"
					}, props), null, function(key) {
						props.key = key;
						props.label = props.name;
						var t = CT.panel.trigger(props, decide.core.util.proposal);
						decide.core.util._list.insertBefore(t,
							decide.core.util._list.firstChild.nextSibling);
						t.trigger();
					});
				})
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
		decide.core.db.objections(function(objs) {
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
		decide.core.db.votes(function(data) {
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
		decide.core.db.proposals(function(props) {
			props.unshift({
				label: decide.core.util._newProp
			});
			decide.core.util._content = CT.dom.node(null, null, "ctdecide_content");
			decide.core.util._list = CT.panel.triggerList(props, decide.core.util.proposal);
			decide.core.util._list.classList.add("ctdecide_list");
			CT.dom.setContent(parent, [
				decide.core.util._list, decide.core.util._content
			]);
		});
	}
};