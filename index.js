'use strict';
const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({
    host: 'localhost', 
    port: 3000
});
server.route(require('./routes/items')),
server.route(require('./routes/users'))
server.start((err) => {
    console.log('Server running at:', server.info.uri);
});
