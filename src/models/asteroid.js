
class Asteroid extends BaseModel {
    constructor(x, y) {
        super(x, y, 100, 100, { radius: 50 });

        this.angle = 0;
        this.radius = 50;

        this.velX = 0;
        this.velY = 0;
    }

    hit(power, angle, direction = 1) {
        const radians = angle * Math.PI / 180;
        this.velX += direction * Math.cos(radians) * power;
        this.velY += direction * Math.sin(radians) * power;
    }

    step(dt) {
        this.angle = this.angle++ % 360;

        this.velX *= 0.98;
        this.velY *= 0.98;

        this.x += this.velX;
        this.y += this.velY;
    }

    render(drawer) {
        drawer.save();
        drawer.rotateModel(this, this.angle);
        drawer.drawFillCircle(this.x, this.y, this.radius, 'brown');
        drawer.restore();
    }
}
