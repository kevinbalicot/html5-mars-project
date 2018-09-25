
class Spaceship extends BaseModel {
    constructor(team, x = 0, y = 0, width = 120, height = 60) {
        super(x, y, width, height, { x: width / 2, y: height / 2, radius: 50 });

        this.team = team;
        this.image = loader.get(`ship${team}`);

        this.life = 100;
        this.repairLevel = 0;
        this.broken = false;
        this.hitting = false;

        this.isThrusting = false;
        this.thrust = 0.1;
        this.gaz = 1;

        this.reloading = false;
        this.reloaded = true;

        this.angle = 0;
        this.turnTo = 0;
        this.turnSpeed = 1;
        this.turnDirection = 1;

        this.turretAngle = 0;
        this.turretTurnTo = 0;
        this.turretTurnSpeed = 1;
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

        this.inSafeZone = true;
        this.cargo = false;
        this.opacity = 1;
    }

    fire(power) {
        if (!this.inSafeZone && this.reloaded) {
            this.reloading = true;
            this.reloaded = false;

            setTimeout(() => {
                this.reloading = false;
                this.reloaded = true;
            }, 5000 * power);

            return new Bullet(this.x + this.width / 2, this.y + this.height / 2, this.turretAngle, power, this.team);
        }

        return null;
    }

    repair() {
        this.repairLevel += 0.05 * this.systemPower;

        if (this.repairLevel >= 1) {
            this.life++;
            this.repairLevel = 0;
        }

        this.life = Math.round(this.life);
        if (this.life >= 100) {
            this.life = 100;
        }
    }

    hit(model, direction = 1) {
        if (!this.hitting) {
            this.life -= 20 * (1 - this.shieldPower);
            this.hitting = true;

            setTimeout(() => this.hitting = false, 2000);
        }

        const radians = model.angle * Math.PI / 180;
        this.velX += direction * Math.cos(radians) * (model.thrust * model.power);
        this.velY += direction * Math.sin(radians) * (model.thrust * model.power);

        if (this.life <= 0) {
            this.life = 0;
        }
    }

    move(time, gaz = 1) {
        if (!this.isThrusting) {
            this.isThrusting = true;
            this.gaz = gaz;

            setTimeout(() => {
                this.isThrusting = false;
                this.gaz = 1;
            }, time);
        }
    }

    rotate(angle, direction) {
        this.turnTo = angle;
        this.turnDirection = direction;
    }

    rotateTurret(angle, direction) {
        this.turretTurnTo = angle;
        this.turretTurnDirection = direction;
    }

    turn() {
        this.angle += this.turnSpeed * this.turnDirection;
        this.turnTo--;

        this.angle = this.angle < 0 ? (360 + this.angle) : this.angle % 360;
    }

    turnTurret() {
        this.turretAngle += this.turretTurnSpeed * this.turretTurnDirection;
        this.turretTurnTo--;

        this.turretAngle = this.turretAngle % 360;
    }

    setAngle(angle) {
        this.turnTo = (360 - this.angle + angle) % 360;
        this.turnDirection = 1;
    }

    setTurretAngle(angle) {
        this.turretTurnTo = (360 - this.turretAngle + angle) % 360;
        this.turretTurnDirection = 1;
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

    step(dt) {
        this.repair();

        if (this.hitting) {
            this.opacity = (this.opacity + 0.05) % 1;
        } else {
            this.opacity = 1;
        }

        if (this.turnTo > 0) {
            this.turn();
        }

        if (this.turretTurnTo > 0) {
            this.turnTurret();
        }

        this.broken = this.life < 25;

        let radians = this.angle * Math.PI / 180;
        if (this.isThrusting && !this.broken) {
            this.velX += Math.cos(radians) * (this.thrust * this.thrusterPower * this.gaz);
            this.velY += Math.sin(radians) * (this.thrust * this.thrusterPower * this.gaz);
        }

        // apply friction
        this.velX *= 0.98;
        this.velY *= 0.98;

        // apply velocities
        this.x += this.velX;
        this.y += this.velY;

        // calc the point out in front of the ship
        radians = this.turretAngle * Math.PI / 180;
        this.px = this.x - this.pointLength * Math.cos(radians);
        this.py = this.y - this.pointLength * Math.sin(radians);
    }

    render(drawer) {
        drawer.save();
        drawer.rotateModel(this, this.angle);
        drawer.ctx.globalAlpha = this.opacity;
        drawer.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x, this.y, this.width, this.height);
        drawer.restore();

        drawer.save();
        drawer.rotateModel(this, this.turretAngle);
        drawer.ctx.setLineDash([5, 3]);
        drawer.drawLine(this.x + this.width / 2, this.y + this.height / 2, this.x + this.width + 25, this.y + this.height / 2, 1, 'yellow');
        drawer.restore();

        drawer.save();
        drawer.ctx.globalAlpha = this.shieldPower;
        drawer.drawCircle(this.x + this.width / 2, this.y + this.height / 2, this.hitbox.radius, 1, 'cyan');
        drawer.restore();
    }

    info() {
        return {
            team: this.team,
            x: this.x,
            y: this.y,
            life: this.life,
            broken: this.broken,
            inSafeZone: this.inSafeZone,
            cargo: this.cargo,
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
