CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("edit.core");
CT.require("decide");

CT.onload(function() {
	CT.initCore();
	decide.core.util.proposals("ctmain");
	edit.core.override();
});