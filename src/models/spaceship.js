
class Spaceship {
    constructor(team, x = 0, y = 0) {
        this.team = team;
        this.x = x;
        this.y = y;

        this.life = 100;
        this.repair = 0;
        this.broken = false;

        this.isThrusting = false;
        this.thrust = 0.1;
        this.gaz = 1;

        this.reloading = false;
        this.reloaded = true;

        this.angle = 0;
        this.turnTo = 0;
        this.turnSpeed = 0.001;
        this.turnDirection = 1;

        this.turretAngle = 0;
        this.turretTurnTo = 0;
        this.turrentTurnSpeed = 0.005;
        this.turretTurnDirection = 1;

        this.color = "rgb(255,0,0)";

        this.velX = 0;
        this.velY = 0;

        this.thrusterPower = 0.33;
        this.systemPower = 0.33;
        this.shieldPower = 0.33;

        this.pointLength = 20;
        this.px = 0;
        this.py = 0;
    }

    fire() {
        if (!this.reloading) {
            this.reloading = true;
            this.reloaded = false;

            setTimeout(() => {
                this.reloading = false;
                this.reloaded = true;
            }, 1000);
        }
    }

    repair() {
        this.repair += 1 * this.systemPower;

        if (this.repair >= 1) {
            this.life++;
            this.repair = 0;
        }
    }

    hit() {
        this.life -= 5 * (1 - this.shieldPower);

        if (this.life <= 0) {
            this.life = 0;
        }
    }

    move(time, gaz = 1) {
        this.isThrusting = true;
        this.gaz = gaz;

        setTimeout(() => {
            this.isThrusting = false;
            this.gaz = 1;
        }, time);
    }

    rotate(angle, direction) {
        this.turnTo = angle;
        this.turnDirection = direction;
    }

    turn() {
        this.angle += this.turnSpeed * this.turnDirection;
    }

    turnTurret() {
        this.turretAngle += this.turretTurnSpeed * this.turretTurnDirection;
    }

    changeThrusterPower(power) {
        const delta = 1 - power;

        this.thrusterPower = power;
        this.systemPower = delta / 2;
        this.shieldPower = delta / 2;
    }

    changeSystemPower(power) {
        const delta = 1 - power;

        this.systemPower = power;
        this.thrusterPower = delta / 2;
        this.shieldPower = delta / 2;
    }

    changeShieldPower(power) {
        const delta = 1 - power;

        this.shieldPower = power;
        this.thrusterPower = delta / 2;
        this.systemPower = delta / 2;
    }

    step(dl) {
        this.repair();
        if (this.angle !== this.turnTo) {
            this.turn();
        }

        if (this.turrentAngle !== this.turrentTurnTo) {
            this.turnTurret();
        }

        if (this.life < 25) {
            this.broken = true;
        } else {
            this.broken = false;
        }

        const radians = this.angle / Math.PI * 180;
        if (this.isThrusting && !this.broken) {
            this.velX += Math.cos(radians) * (this.thrust * this.thrusterPower * this.gaz);
            this.velY += Math.sin(radians) * (this.thrust * this.thrusterPower * this.gaz);
        }

        // apply friction
        this.velX *= 0.98;
        this.velY *= 0.98;

        // apply velocities
        this.x -= this.velX;
        this.y -= this.velY;

        // calc the point out in front of the ship
        //this.px = this.x - this.pointLength * Math.cos(radians);
        //this.py = this.y - this.pointLength * Math.sin(radians);
    }

    info() {
        return {
            team: this.team,
            x: this.x,
            y: this.y,
            life: this.life,
            broken: this.broken,
            angle: this.angle,
            turnTo: this.turnTo,
            turnDirection: this.turnDirection,
            turretAngle: this.turretAngle,
            turretTurnTo: this.turretTurnTo,
            turretTurnDirection: this.turretTurnDirection,
            thrusterPower: this.thrusterPower,
            systemPower: this.systemPower,
            shieldPower: this.shieldPower,
            reloaded: this.reloaded,
            reloading: this.reloading
        }
    }
}
