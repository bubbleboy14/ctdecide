CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("decide");
if (!decide.core.util._user)
	location = "/";

CT.onload(function() {
	CT.initCore();
	decide.core.util.proposals("ctmain");
});