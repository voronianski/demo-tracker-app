/**
 * Module dependencies
 */

var express = require('express'),
    routes = require('./modules/router'),
    http = require('http'),
    path = require('path'),
    stylus = require('stylus');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(stylus.middleware({ serve: true, src: __dirname + '/', dest: __dirname + '/public', compress: true }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/partials/:name', routes.partials);

app.post('/api/login', routes.signIn);
app.post('/api/logout', routes.signOut);

app.get('/api/active/:login', routes.activeTasks);
app.get('/api/all/:login', routes.allTasks);
app.get('/api/task/:login/:id', routes.oneTask);
app.post('/api/new', routes.addTask);
app.put('/api/update', routes.updateTask);
app.delete('/api/delete/:login/:id', routes.deleteTask);

app.get('*', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
