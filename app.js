/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	im = require('imagemagick'),
	path = require('path');
var settings = require('./settings');
//var MongoStore = require('connect-mongodb');
var MongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({uploadDir:'./uploads_tmp'}));
app.use(express.methodOverride());
app.use(express.cookieParser('keyboard cat'));
app.use(express.session({
	cookie: {
		maxAge: 60000
	},
	secret: settings.cookieSecret,
	store: new MongoStore({
		db: settings.db
	})
}));

app.use(flash());

app.use(function(req, res, next) {
	res.locals.user = req.session.user;
	var err = req.flash('error');
	if (err.length)
		res.locals.error = err;
	else
		res.locals.error = null;
	var succ = req.flash('success');
	if (succ.length)
		res.locals.success = succ;
	else
		res.locals.success = null;
	next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

routes(app);

var server = http.createServer(app);
server.listen(80, function() {
	console.log('Express server listening on port ' + 80);
});
im.readMetadata('./404.jpg', function(err, metadata) {
	console.log(metadata);
})