decide.core.db = {
	votes: function(cb, prop) {
		CT.net.post("/_decide", {
			action: "votes",
			proposal: prop.key,
			user: user.core.get("key")
		}, null, cb);
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