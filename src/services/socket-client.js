class SocketClient extends WebSocket {
    /**
     * @param {string} name
     * @param {Object} data
     */
    sendToServer(name, data) {
        this.send(JSON.stringify({ name, data }));
    }
}
