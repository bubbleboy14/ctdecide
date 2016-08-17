decide.core.db = {
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