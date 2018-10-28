var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const dataFunctions = require('./data');

app.get('/', function(req, res){
  res.send(`I'm working`)
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('get users', function (req) {
    dataFunctions.getUsers(response => socket.emit('send users', response));
  })

  // req keys: name
  socket.on('create user', function (req) {
    dataFunctions.createUser(req.name, response => io.emit('add user', response))
  })

  socket.on('get lists', function (req) {
    dataFunctions.getLists(req.type, response => socket.emit('send lists', response));
  })

  // req keys: type, name, creator
  socket.on('create list', function (req) {
    // All clients should receive the updated list 
    dataFunctions.createList(req, response => io.emit('add list', response));
  })

  socket.on('delete list', function (req) {
    dataFunctions.deleteList(req.id, response => io.emit('remove list', response));  
  })

  socket.on('get items', function (req) {
    dataFunctions.getItems(req.listId, response => socket.emit('send items', response));
  })

  // req keys: listId, name, due (optional)
  socket.on('create item', function (req) {
    dataFunctions.addItem(req, response => io.emit('add item', response));
  })

  socket.on('delete item', function (req) {
    dataFunctions.deleteItem(req.id, response => io.emit('remove item', response));
  })

  socket.on('check item', function (req) {
    dataFunctions.checkItem(req.id, req.checked, response => io.emit('update item', response));
  })

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});