var express = require("express");
var app = express();

app.use("/app", express.static(__dirname + "/app"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use("/", function(req, res) {
	res.redirect("/app");
});

app.listen(process.env.npm_package_config_port);

/*
app.use("/", function(req, res) {

});
*/