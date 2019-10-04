
class Chat {
    /**
     * @param {HTMLElement}
     */
    constructor(container) {
        this.items = [];
        this.container = container;
    }

    /**
     * @param {Object} user
     * @param {string} message
     */
    add(user, message) {
        this.items.push({
            username: user.username,
            job: user.job,
            team: user.team,
            avatar: user.avatar,
            message
        });

        setTimeout(() => {
            if (this.items.length) {
                this.items.splice(0, 1);
                this.refreshView();
            }
        }, 2000);

        if (this.items.length > 10) {
            this.items.shift();
        }

        this.refreshView();
    }

    refreshView() {
        this.container.innerHTML = null;
        this.items.forEach(({ username, job, team, avatar, message }) => {
            const card = document.createElement('div');
            card.className = 'card mb-2 ' + message.replace(/:/g, '-');
            card.innerHTML = `
                <div class="card-body">
                    ${!!avatar ? '<img class="float-left avatar" src="' + avatar + '">' : ''}
                    ${username} [${job}]: ${message}
                </div>
            `;

            this.container.appendChild(card);
        });

        this.container.scrollTop = this.container.scrollHeight;
    }
}
