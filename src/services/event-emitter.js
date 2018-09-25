
class EventEmitter {
    constructor() {
        this.subcribers = [];
    }

    /**
     * @param {string} name
     * @param {Function} callback
     */
    subscribe(name, callback) {
        this.subcribers.push({ name, callback });
    }

    /**
     * @param {string} name
     */
    unsubscribe(name) {
        this.subcribers = this.subcribers.filter(s => s.name !== name);
    }

    /**
     * @param {string} name
     * @param {Object} data
     * @param {Object} spaceship
     */
    emit(name, data, spaceship) {
        this.subcribers.filter(s => s.name === name).forEach(s => s.callback(data, spaceship));
    }
}
