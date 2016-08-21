decide.core.db = {
	votes: function(cb, prop) {
		CT.net.post("/_decide", {
			action: "votes",
			proposal: prop.key,
			user: decide.core.util._user.key
		}, null, cb);
	},
	objections: function(cb, prop) {
		CT.db.get("objection", cb, null, null, null, {
			proposal: {
				value: prop.key,
				comparator: "=="
			},
			closed: {
				value: false,
				comparator: "=="
			}
		});
	},
	proposals: function(cb, limit, offset, order, filters, sync) {
		return CT.db.get("proposal", cb, limit, offset, order, filters, sync);
	}
};
CT.db.setLimit(1000);