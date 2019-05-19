decide.core.util = {
	_: {
		user: user.core.get(),
		newProp: "<b>New Proposal</b>",
		onNew: function() {}
	},
	onNew: function(cb) {
		decide.core.util._.onNew = cb;
	},
	proposer: function(node) {
		var _ = decide.core.util._,
			name = CT.dom.field(null, null, "w1 block"),
			description = CT.dom.textArea(null, null, "w1 block");
		CT.dom.setContent(node || _.content, [
			CT.dom.node("New Proposal", "div", "biggest bold pv10"),
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
						description: description.value,
						user: _.user.key
					};
					CT.net.post("/_decide", CT.merge({
						action: "propose"
					}, props), null, function(key) {
						props.key = key;
						props.label = props.name;
						var tlist = _.list;
							t = CT.panel.trigger(props, decide.core.util.proposal);
						if (tlist.firstChild.nextSibling)
							tlist.insertBefore(t, tlist.firstChild.nextSibling);
						else
							tlist.appendChild(t);
						t.trigger();
						_.onNew(key);
					});
				})
			], "div", "round bordered padded")
		]);
	},
	proposal: function(prop) {
		var _ = decide.core.util._;
		if (prop.label == _.newProp)
			return decide.core.util.proposer();
		var votes = CT.dom.node(), objections = CT.dom.node();
		CT.dom.setContent(_.content, [
			CT.dom.node(prop.name, "div", "biggest bold pv10"),
			prop.description,
			CT.dom.node("Final: " + (prop.final ?
				"Yup" : "Nope"), "div", "bold pv10"),
			votes, objections
		]);
		decide.core.db.objections(function(objs) {
			objs.length && CT.dom.setContent(objections, [
				CT.dom.node("Objections", "div", "bigger bold pv10"),
				objs.map(function(obj) {
					return [
						CT.dom.node(obj.name, "div", "big bold pv10"),
						obj.description
					];
				})
			]);
		}, prop);
		var _countvotes = function(data) {
			var content = [
				CT.dom.node("Votes", "div", "bigger bold pv10"),
				"Yup: " + data.yup,
				"Nope: " + data.nope,
				"Total: " + (data.yup + data.nope)
			];
			if ("user" in data)
				content.push("You: " + (data.user ? "yup" : "nope"));
			else {
				var vnode = CT.dom.node([
					CT.dom.node("Vote", "div", "bigger bold pv10"),
					CT.dom.button("Yup", function() {
						CT.net.post("/_decide", {
							action: "vote",
							user: _.user.key,
							proposal: prop.key,
							position: true
						}, null, function() {
							data.user = true;
							data.yup += 1;
							_countvotes(data);
						});
					}, "yup"),
					CT.dom.button("Nope", function() {
						CT.net.post("/_decide", {
							action: "vote",
							user: _.user.key,
							proposal: prop.key,
							position: false
						}, null, function() {
							data.user = false;
							data.nope += 1;
							_countvotes(data);
						});
					}, "nope")
				]);
				content.push(vnode);
			}
			CT.dom.setContent(votes, content);
		};
		decide.core.db.votes(_countvotes, prop);
	},
	process: function(props) {
		var _ = decide.core.util._;
		props.unshift({
			label: _.newProp
		});
		_.content = CT.dom.node(null, null, "ctcontent");
		_.list = CT.panel.triggerList(props, decide.core.util.proposal);
		_.list.classList.add("ctlist");
		CT.dom.setContent(_.parent, [
			_.list, _.content
		]);
		_.list.firstChild.trigger();
	},
	proposals: function(parent, proposals) {
		decide.core.util._.parent = parent || document.body;
		proposals ? decide.core.util.process(proposals) : decide.core.db.proposals(decide.core.util.process);
	}
};