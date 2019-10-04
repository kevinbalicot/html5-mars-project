const url = require('url');
const fs = require('fs');
const uuid = require('uuid/v4');
const Validator = require('@beelab/json-validator');

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
wss.getMasters = function() {
    return Array.from(this.clients).filter(client => client.type && client.type === 'master');
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
wss.sendToClients = function(toClients, name, data, fromClient = null) {
    if (null !== fromClient) {
        const { id, username, job, team, avatar } = fromClient;

        data.user = { id, username, job, team, avatar };
    }

    const message = JSON.stringify({ name, data });

    if (!Array.isArray(toClients)) {
        toClients = [toClients];
    }

    toClients.forEach(client => client.send(message));
};

wss.on('connection', (client, req) => {
    const queries = url.parse(req.url, true).query;

    client.id = uuid();
    for (let key in queries) {
        client[key] = queries[key];
    }

    client.on('message', (message) => {
        try {
            JSON.parse(message);
        } catch(e) {
            console.error(e.message);
        }

        const { name, data } = JSON.parse(message);

        if (name !== 'spaceship:info') {
            console.log(`${client.team} ${client.username} : ${name}`, data);
        }

        if (name !== 'spaceship:info' && client.lastMessage && (Date.now() - client.lastMessage) < 0.5) {
            return;
        }

        try {
            if (validator.hasSchema(name)) {
                validator.validate(data, name);
            }

            wss.emit(name, data, client, wss);
            client.lastMessage = Date.now();
        } catch(e) {
            client.send(JSON.stringify({ name, error: e.message }));
        }
    });
});

wss.subscribe('spaceship:info', (data, client, server) => {
    server.getTeamClients(data.team).forEach(client => {
        server.sendToClients(client, 'spaceship:info', data);
    });
});

// User
wss.subscribe('user:avatar', (data, client, server) => {
    client.avatar = data.avatar;
});

// Pilote actions
wss.subscribe('spaceship:move', (data, client, server) => {
    server.sendToClients(server.getMasters(), 'spaceship:move', data, client);
});

wss.subscribe('spaceship:rotate', (data, client, server) => {
    server.sendToClients(server.getMasters(), 'spaceship:rotate', data, client);
});

wss.subscribe('spaceship:turnto', (data, client, server) => {
    server.sendToClients(server.getMasters(), 'spaceship:turnto', data, client);
});

// Gunner actions
wss.subscribe('spaceship:turret:rotate', (data, client, server) => {
    server.sendToClients(server.getMasters(), 'spaceship:turret:rotate', data, client);
});

wss.subscribe('spaceship:turret:turnto', (data, client, server) => {
    server.sendToClients(server.getMasters(), 'spaceship:turret:turnto', data, client);
});

wss.subscribe('spaceship:turret:fire', (data, client, server) => {
    server.sendToClients(server.getMasters(), 'spaceship:turret:fire', data, client);
});

// Engineer
wss.subscribe('spaceship:thruster:power', (data, client, server) => {
    server.sendToClients(server.getMasters(), 'spaceship:thruster:power', data, client);
});

wss.subscribe('spaceship:shield:power', (data, client, server) => {
    server.sendToClients(server.getMasters(), 'spaceship:shield:power', data, client);
});

wss.subscribe('spaceship:system:power', (data, client, server) => {
    server.sendToClients(server.getMasters(), 'spaceship:system:power', data, client);
});

httpServer.listen(8080);
console.log('Server started on port 8080');
