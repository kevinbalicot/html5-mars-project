
class Station extends BaseModel {
    constructor(x, y, width, height, color, team) {
        super(x, y, width, height);

        this.color = color;
        this.team = team;
    }

    render(drawer) {
        drawer.save();
        drawer.ctx.setLineDash([5, 3]);
        drawer.drawRect(this.x, this.y, this.width, this.height, 2, this.color);
        drawer.restore();
    }
}
