
class Bullet extends BaseModel {
    constructor(x, y, angle, power, team) {
        super(x, y, 10, 10, { radius: 5 });

        this.angle = angle;
        this.thrust = 4;
        this.power = power;
        this.radius = 5;
        this.team = team;
    }

    step(dt) {
        const radians = this.angle * Math.PI / 180;
        this.x += Math.cos(radians) * (this.thrust * this.power);
        this.y += Math.sin(radians) * (this.thrust * this.power);
    }

    render(drawer) {
        drawer.drawFillCircle(this.x, this.y, this.radius, 'yellow');
    }

    clone() {
        return new Bullet(this.x, this.y, this.angle, this.power, this.team);
    }
}
