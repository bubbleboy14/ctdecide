# ctdecide
This package provides a framework for group decision making.


# Back (Init Config)

    import config
    
    syms = {
    	".": ["_decide.py"],
    	"js": ["decide.js", "decide"],
    	"css": ["decide.css"],
    	"html": ["decide"]
    }
    model = {
    	"ctdecide.model": ["*"]
    }
    routes = {
    	"/_decide": "_decide.py"
    }
    cfg = config.config
    requires = ["ctuser"]