export class Point {

	public x: number;

	public y: number;

	public time: number;

	constructor(x: number, y: number, time?: number) {
		this.x = x;
		this.y = y;
		this.time = time || new Date().getTime();
	}

	public velocityFrom(start: Point): number {
		return (this.time !== start.time) ? this.distanceTo(start) / (this.time - start.time) : 1;
	}

	public distanceTo(start: Point): number {
		return Math.sqrt(Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2));
	}
}

export default Point;
