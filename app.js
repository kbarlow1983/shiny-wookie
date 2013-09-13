/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
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
app.use(express.bodyParser({uploadDir:'./uploads'}));
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
server.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket) {
	socket.on('routerRequest', function(data) {
		switch (parseInt(data.Id)) {
			case 1:
				socket.emit('bodyRender', 'I love you zhang yi!');
				break;
			case 2:
				socket.emit('bodyRender', 'I want fuck you zhang yi!');
				break;
		}
	});
});