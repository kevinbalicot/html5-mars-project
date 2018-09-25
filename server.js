const url = require('url');
const fs = require('fs');
const uuid = require('uuid/v4');
const Validator = require('pxl-json-validator');

const { Server } = require('ws');
const { createApp, createServer } = require('yion');

const app = createApp();
const httpServer = createServer(app);
const validator = new Validator();

app.link('/src', __dirname + '/src');
app.link('/modules', __dirname + '/node_modules');
app.link('/public', __dirname + '/public');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html', 'index.html', 'text/html', false);
});

app.get('/controller', (req, res) => {
    res.sendFile(__dirname + '/controller.html', 'controller.html', 'text/html', false);
});

const wss = new Server({ server: httpServer });

/**
 * Add listener
 * @param {string} name
 * @param {function} callback
 */
wss.subscribe = function(name, callback) {
    const filename = name.replace(/:/g, '-');
    const path = `${__dirname}/config/schemas/${filename}.json`;

    if (fs.existsSync(path)) {
        validator.addSchema(name, require(path));
    }

    this.on(name, callback);
};

/**
 * Return master client
 * @return {Client}
 */
wss.getMaster = function() {
    return Array.from(this.clients).find(client => client.type && client.type === 'master');
};

/**
 * Return all clients except master client
 * @return {Array<Client>}
 */
wss.getClients = function() {
    return Array.from(this.clients).filter(client => !client.type);
};

/**
 * Return all clients of team
 * @return {Array<Client>}
 */
wss.getTeamClients = function(team) {
    return Array.from(this.clients).filter(client => client.team == team);
};

/**
 * Send to client event
 * @param {Client} toClient
 * @param {string} name
 * @param {Object} data
 * @param {Client} [fromClient=null]
 */
wss.sendToClient = function(toClient, name, data, fromClient = null) {
    if (null !== fromClient) {
        const { id, username, job, team } = fromClient;

        data.user = { id, username, job, team };
    }

    const message = JSON.stringify({ name, data });

    toClient.send(message);
};

wss.on('connection', (client, req) => {
    const queries = url.parse(req.url, true).query;

    client.id = uuid();
    for (let key in queries) {
        client[key] = queries[key];
    }

    client.on('message', (message) => {
        const { name, data } = JSON.parse(message);

        try {
            if (validator.hasSchema(name)) {
                validator.validate(data, name);
            }

            wss.emit(name, data, client, wss);
        } catch(e) {
            client.send(JSON.stringify({ name, error: e.message }));
        }
    });
});

wss.subscribe('spaceship:info', (data, client, server) => {
    server.getTeamClients(data.team).forEach(client => {
        server.sendToClient(client, 'spaceship:info', data);
    });
});

// Pilote actions
wss.subscribe('spaceship:move', (data, client, server) => {
    server.sendToClient(server.getMaster(), 'spaceship:move', data, client);
});

wss.subscribe('spaceship:rotate', (data, client, server) => {
    server.sendToClient(server.getMaster(), 'spaceship:rotate', data, client);
});

wss.subscribe('spaceship:turnto', (data, client, server) => {
    server.sendToClient(server.getMaster(), 'spaceship:turnto', data, client);
});

// Gunner actions
wss.subscribe('spaceship:turret:rotate', (data, client, server) => {
    server.sendToClient(server.getMaster(), 'spaceship:turret:rotate', data, client);
});

wss.subscribe('spaceship:turret:turnto', (data, client, server) => {
    server.sendToClient(server.getMaster(), 'spaceship:turret:turnto', data, client);
});

wss.subscribe('spaceship:turret:fire', (data, client, server) => {
    server.sendToClient(server.getMaster(), 'spaceship:turret:fire', data, client);
});

// Engineer
wss.subscribe('spaceship:thruster:power', (data, client, server) => {
    server.sendToClient(server.getMaster(), 'spaceship:thruster:power', data, client);
});

wss.subscribe('spaceship:shield:power', (data, client, server) => {
    server.sendToClient(server.getMaster(), 'spaceship:shield:power', data, client);
});

wss.subscribe('spaceship:system:power', (data, client, server) => {
    server.sendToClient(server.getMaster(), 'spaceship:system:power', data, client);
});

httpServer.listen(8080);
console.log('Server started on port 8080');
