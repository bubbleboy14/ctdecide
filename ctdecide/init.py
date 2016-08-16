import config

copies = {
	"css": ["custom.css"]
}

syms = {
	".": ["_decide.py"],
	"js": ["decide.js", "decide"],
	"css": ["decide.css"],
	"html": ["decide.html"]
}
model = {
	"ctdecide.model": ["*"]
}
routes = {
	"/_decide": "_decide.py"
}
cfg = config.config
requires = ["ctuser"]