
class Asteroid extends BaseModel {
    constructor(x, y) {
        super(x, y, 100, 100, { radius: 50 });

        this.angle = 0;
        this.radius = 50;

        this.velX = 0;
        this.velY = 0;

        this.image = loader.get(`asteroid${Math.random() > 0.5 ? 1 : 2}`);
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.speed = Math.random();
    }

    hit(power, angle, direction = 1) {
        const radians = angle * Math.PI / 180;
        this.velX += direction * Math.cos(radians) * power;
        this.velY += direction * Math.sin(radians) * power;
    }

    step(dt) {
        this.angle = (this.angle + (this.direction * 1 * this.speed)) % 360;

        this.velX *= 0.98;
        this.velY *= 0.98;

        this.x += this.velX;
        this.y += this.velY;
    }

    render(drawer) {
        drawer.save();
        drawer.rotateModel(this, this.angle, 0, 0);
        //drawer.drawFillCircle(this.x, this.y, this.radius, 'brown');
        drawer.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        drawer.restore();
    }
}
