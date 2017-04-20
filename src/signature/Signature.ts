import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { Point } from './Point';
import { Curve } from './Curve';

const velocityFilterWeight = 0.7;
const minWidth = 0.5;
const maxWidth = 2.5;
const dotSize = 1.5;
const penColor = 'black';
const backgroundColor = 'rgba(0,0,0,0)';

export interface SignatureProperties extends WidgetProperties {}

class Signature extends WidgetBase<SignatureProperties> {

	private _canvas: HTMLCanvasElement;

	private _context: CanvasRenderingContext2D;

	private _mouseButtonDown = false;

	private _points: Point[] = [];

	private _lastVelocity = 0;

	private _lastWidth = 0;

	private _isEmpty = true;

	private _savedUrl: string;

	protected onElementCreated(element: HTMLCanvasElement, key: string) {
		if (key === 'canvas') {
			this._canvas = element;
			const context = this._canvas.getContext('2d');
			if (context) {
				this._context = context;
			}
		}
	}

	protected onClear() {
		this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
		this.reset();
	}

	protected onMouseDown(event: MouseEvent) {
		const touch = ((<any> event).targetTouches || [])[0];
		this._mouseButtonDown = true;
		this.strokeBegin(touch || event);
	}

	protected onMouseMove(event: MouseEvent) {
		const touch = ((<any> event).targetTouches || [])[0];
		if (touch) {
			event.preventDefault();
		}
		if (this._mouseButtonDown) {
			this.strokeUpdate(touch || event);
		}
	}

	protected onMouseUp(event: MouseEvent) {
		this._mouseButtonDown = false;
		this.strokeEnd(event);
	}

	protected strokeUpdate(event: MouseEvent) {
		const point = this.createPoint(event);
		this.addPoint(point);
	}

	protected strokeBegin(event: MouseEvent) {
		this.reset();
		this.strokeUpdate(event);
	}

	protected strokeDraw(point: Point) {
		this._context.beginPath();
		this.drawPoint(point.x, point.y, dotSize);
		this._context.closePath();
		this._context.fill();
	}

	protected strokeEnd(event: MouseEvent) {
		const canDrawCurve = this._points.length > 2;
		const point = this._points[0];

		if (!canDrawCurve && point) {
			this.strokeDraw(point);
		}
	}

	protected createPoint(event: MouseEvent) {
		const rect = this._canvas.getBoundingClientRect();
		return new Point(
			event.clientX - rect.left,
			event.clientY - rect.top
		);
	}

	protected addPoint(point: Point) {
		let c2: Point;
		let c3: Point;
		let curve;
		let tmp: {
			c1: Point;
			c2: Point;
		};
		this._points.push(point);

		if (this._points.length > 2) {
			if (this._points.length === 3) {
				this._points.unshift(this._points[0]);
			}

			tmp = this.calculateCurveControlPoints(this._points[0], this._points[1], this._points[2]);

			c2 = tmp.c2;
			tmp = this.calculateCurveControlPoints(this._points[1], this._points[2], this._points[3]);
			c3 = tmp.c1;
			curve = new Curve(this._points[1], c2, c3, this._points[2]);
			this.addCurve(curve);
			this._points.shift();
		}
	}

	protected addCurve(curve: Curve) {
		const startPoint = curve.startPoint;
		const endPoint = curve.endPoint;
		let velocity;
		let newWidth;
		velocity = endPoint.velocityFrom(startPoint);
		velocity = velocityFilterWeight * velocity
			+ (1 - velocityFilterWeight) * this._lastVelocity;

		newWidth = this.strokeWidth(velocity);
		this.drawCurve(curve, this._lastWidth, newWidth);

		this._lastVelocity = velocity;
		this._lastWidth = newWidth;
	}

	protected calculateCurveControlPoints(s1: Point, s2: Point, s3: Point): { c1: Point, c2: Point } {
		const dx1 = s1.x - s2.x;
		const dy1 = s1.y - s2.y;
		const dx2 = s2.x - s3.x;
		const dy2 = s2.y - s3.y;
		const m1 = {
			x: (s1.x + s2.x) / 2.0,
			y: (s1.y + s2.y) / 2.0
		};
		const m2 = {
			x: (s2.x + s3.x) / 2.0,
			y: (s2.y + s3.y) / 2.0
		};
		const l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
		const l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
		const dxm = (m1.x - m2.x);
		const dym = (m1.y - m2.y);
		const k = l2 / (l1 + l2);
		const cm = {
			x: m2.x + dxm * k,
			y: m2.y + dym * k
		};
		const tx = s2.x - cm.x;
		const ty = s2.y - cm.y;

		return {
			c1: new Point(m1.x + tx, m1.y + ty),
			c2: new Point(m2.x + tx, m2.y + ty)
		};
	}

	protected isEmpty(): boolean {
		return this._isEmpty;
	}

	protected reset() {
		this._points = [];
		this._lastVelocity = 0;
		this._lastWidth = (minWidth + maxWidth) / 2;
		this._isEmpty = true;
		this._context.fillStyle = penColor;
	}

	protected clear() {
		this._context.fillStyle = backgroundColor;
		this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
		this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

		this._points = [];
		this.reset();
		this._isEmpty = true;
	}

	protected drawPoint(x: number, y: number, size: number): void {
		this._context.moveTo(x, y);
		this._context.arc(x, y, size, 0, 2 * Math.PI, false);
		this._isEmpty = false;
	}

	protected drawCurve(curve: Curve, startWidth: number, endWidth: number): void {
		const widthDelta = endWidth - startWidth;
		let drawSteps;
		let width;
		let i;
		let t;
		let tt;
		let ttt;
		let u;
		let uu;
		let uuu;
		let x;
		let y;

		drawSteps = Math.floor(curve.length());
		this._context.beginPath();
		for (i = 0; i < drawSteps; i++) {
			t = i / drawSteps;
			tt = t * t;
			ttt = tt * t;
			u = 1 - t;
			uu = u * u;
			uuu = uu * u;

			x = uuu * curve.startPoint.x;
			x += 3 * uu * t * curve.control1.x;
			x += 3 * u * tt * curve.control2.x;
			x += ttt * curve.endPoint.x;

			y = uuu * curve.startPoint.y;
			y += 3 * uu * t * curve.control1.y;
			y += 3 * u * tt * curve.control2.y;
			y += ttt * curve.endPoint.y;

			width = startWidth + ttt * widthDelta;
			this.drawPoint(x, y, width);
		}
		this._context.closePath();
		this._context.fill();
	}

	protected strokeWidth(velocity: number): number {
		return Math.max(maxWidth / (velocity + 1), minWidth);
	}

	protected toUrl() {
		const url = this._canvas.toDataURL();
		this._savedUrl = url;
	}

	protected fromUrl() {
		const image = new Image();
		console.log(window.devicePixelRatio);
		const ratio = window.devicePixelRatio || 1;
		const width = this._canvas.width / ratio;
		const height = this._canvas.height / ratio;

		this.clear();
		image.src = this._savedUrl;
		image.onload = () => {
			this._context.drawImage(image, 0, 0, width, height);
		};
		this._isEmpty = false;

	}

	protected render(): DNode {
		return v('div', { styles: { 'width': '450px', 'margin': 'auto' } }, [
			v('canvas', {
				key: 'canvas',
				width: 450,
				height: 300,
				styles: {
					'border-style': 'solid'
				},
				onmousedown: this.onMouseDown,
				mousemove: this.onMouseMove,
				onmousemove: this.onMouseMove,
				onmouseup: this.onMouseUp,
				ontouchstart: <any> this.onMouseDown,
				ontouchend: <any> this.onMouseUp,
				ontouchmove: <any> this.onMouseMove
			}),
			v('div', { key: 'footer' }, [
				v('span', [ 'Scribble ^' ]),
				v('button', { onclick: this.toUrl, styles: { 'float': 'right' } }, [ 'Save' ]),
				v('button', { onclick: this.clear, styles: { 'float': 'right' } }, [ 'Clear' ]),
				v('button', { onclick: this.fromUrl, styles: { 'float': 'right' } }, [ 'Load Previous' ])
			])
		]);
	}

}

export default Signature;
