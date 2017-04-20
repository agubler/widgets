import Point from './Point';

export class Curve {
	public startPoint: Point;

	public control1: Point;

	public control2: Point;

	public endPoint: Point;

	constructor(startPoint: Point, control1: Point, control2: Point, endPoint: Point) {
		this.startPoint = startPoint;
		this.control1 = control1;
		this.control2 = control2;
		this.endPoint = endPoint;
	}

	public length() {
		const steps = 10;
		let length = 0;
		let i: number;
		let t: number;
		let cx: number;
		let cy: number;
		let px = 0;
		let py = 0;
		let xdiff: number;
		let ydiff: number;

		for (i = 0; i <= steps; i++) {
			t = i / steps;
			cx = this.point(t, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x);
			cy = this.point(t, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);
			if (i > 0) {
				xdiff = cx - px;
				ydiff = cy - py;
				length += Math.sqrt(xdiff * xdiff + ydiff * ydiff);
			}
			px = cx;
			py = cy;
		}
		return length;
	}

	public point(t: number, start: number, c1: number, c2: number, end: number): number {
		return start * (1.0 - t) * (1.0 - t) * (1.0 - t)
				+ 3.0 * c1 * (1.0 - t) * (1.0 - t) * t
				+ 3.0 * c2 * (1.0 - t) * t * t
				+ end * t * t * t;
	}
}

export default Curve;
