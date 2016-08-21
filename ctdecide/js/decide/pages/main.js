CT.require("CT.all");
CT.require("user.core");
CT.require("decide");
if (!decide.core.util._user)
	location = "/";

CT.onload(function() {
	decide.core.util.proposals();
});