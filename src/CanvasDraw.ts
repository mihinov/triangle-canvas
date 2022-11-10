import { CanvasSize, animateLineObj, TweenObj, PeakTriangle } from './interfaces';
import gsap from 'gsap';
import { debounce, tween } from './functions';
import { timeout, of, interval, take, Subscription, tap, filter, Observable, switchMap, iif, takeUntil, timer, takeWhile } from 'rxjs';

export class CanvasDraw {
	private ctx: CanvasRenderingContext2D;
	private bgColor: string;
	private color: string;
	private width: number;
	private height: number;
	private intervaleTimeDraw: number = 0;
	private intervaleTimeMainTriangle: number = 0;
	private durationDrawMainTriangle: number = 1000;
	private intervalResize: number = 100;
	private peaksTriangleRelative: PeakTriangle[] = [
		{ x: 0.5, y: 0.05 },
		{ x: 0.05, y: 0.95 },
		{ x: 0.95, y: 0.95 }
	];
	private peaksTriange: PeakTriangle[] = [];
	private countDraw: number = 0;

	constructor(private canvasNode: HTMLCanvasElement) {
		this.onInit();
	}

	private onInit(): void {
		this.initVars();
		this.addEventListeners();
		this.draw();
	}

	private draw(): void {
		this.countDraw = this.countDraw + 1;
		const currentCountDraw = this.countDraw;

		this.drawBackground();
		timer(this.intervaleTimeDraw)
		.pipe(
			take(1),
			takeWhile(item => this.countDraw === currentCountDraw),
			tap(item => {
				this.drawBackground();
			}),
			switchMap(() =>
				this.drawMainTriangle(this.durationDrawMainTriangle, this.intervaleTimeMainTriangle),
			),
			take(1),
			tap(() => {
				this.drawPoints();
			})
		)
		.subscribe();
	}

	private generateRandomPosPointInTriangle(): PeakTriangle {

		const peaks = this.peaksTriange;
		const a = peaks[0];
		const b = peaks[1];
		const c = peaks[2];

		// console.log(a.x, 'ax', a.y, 'ay');
		// console.log(b.x, 'bx', b.y, 'by');
		// console.log(c.x, 'cx', c.y, 'cy');
		// console.log('');


		// Первый вариант
		let u = Math.random();
		let v = Math.random();

		if (u + v > 1)  {
			u = 1 - u;
			v = 1 - v;
		}

		const random1 = {
			x: a.x + (b.x - a.x) * u + (c.x - a.x) * v,
			y: a.y + (b.y - a.y) * u + (c.y - a.y) * v
		};
		// const x = a.x + (b.x - a.x) * u + (c.x - a.x) * v;
		// const y = a.y + (b.y - a.y) * u + (c.y - a.y) * v;

		// console.log('Первый вариант');
		// console.log(u, 'u');
		// console.log(v, 'v');

		// console.log(random1, 'random1');



		// второй вариант
		const p = Math.sqrt(Math.random());
		const q = Math.random();
		// let x = a.x * (1 - p) + b.x * (1 - q) * p + c.x * p * q;
		// let y = a.y * (1 - p) + b.y * (1 - q) * p + c.y * p * q;
		const random2 = {
			x: a.x * (1 - p) + b.x * (1 - q) * p + c.x * p * q,
			y: a.y * (1 - p) + b.y * (1 - q) * p + c.y * p * q
		}

		// console.log('');

		// console.log('Второй вариант, рисую его');
		// console.log(p, 'p');
		// console.log(q, 'q');


		// console.log(random2, 'random2');

		// console.log('');


		return random2;
	}

	private drawRandomPoint(rndPoint = this.generateRandomPosPointInTriangle()): void {
		this.ctx.beginPath();
		this.ctx.fillStyle = this.color;
		this.ctx.arc(rndPoint.x, rndPoint.y, 1, 0, 2 * Math.PI);
		this.ctx.fill();
		this.ctx.closePath();
	};

	// Нужно нарисовать точки, тут нужно возвращать Observable, но не точно
	private drawPoints() {

		const peaks = this.peaksTriange;
		const a = peaks[0];
		const b = peaks[1];
		const c = peaks[2];

		const rndPoint = this.generateRandomPosPointInTriangle();
		// this.drawRandomPoint(rndPoint);

		let lastPoint = rndPoint;
		// console.log(this.peaksTriange, 'peaksTriangle');

		// console.log(lastPoint, 'lastPoint');

		// const rndPeakId = Math.floor(Math.random() * peaks.length);
		// const rndPeak = peaks[rndPeakId];
		// const newPoint = {
		// 	x: this.createCoord(lastPoint.x, rndPeak.x, 0.5),
		// 	y: this.createCoord(lastPoint.y, rndPeak.y, 0.5)
		// };

		// this.animateLine({
		// 	startX: lastPoint.x,
		// 	startY: lastPoint.y,
		// 	endX: newPoint.x,
		// 	endY: newPoint.y,
		// 	durationTime: 200,
		// 	intervalTime: 0
		// }).subscribe();

		this.countDraw = this.countDraw + 1;
		const currentCountDraw = this.countDraw;

		tween(20000)
		.pipe(
			takeWhile(item => this.countDraw === currentCountDraw),
		)
		.subscribe(({duration}) => {
			// lastPoint = printPointTriangle(lastPoint);
			for (let i = 0; i < 10; i++) {
				lastPoint = printPointTriangle(lastPoint);
			}
		});

		const printPointTriangle = (lastPoint) => {
			const rndPeakId = Math.floor(Math.random() * peaks.length);
			const rndPeak = peaks[rndPeakId];
			const newPoint = {
				x: this.createCoord(lastPoint.x, rndPeak.x, 0.5),
				y: this.createCoord(lastPoint.y, rndPeak.y, 0.5)
			};
			this.drawRandomPoint(newPoint);
			return newPoint;
		};

		// for (let i = 0; i < 10000; i++) {
		// 	const newPoint = printPointTriangle(lastPoint);
		// }


		// console.log(rndPeak, 'rndPeak');
		// for (let i = 0; i < 5000; i++) {
		// 	drawRandomPoint();
		// }

		return tween(1000)
	}

	private drawBackground(): void {
		this.canvasNode.width = this.width;
		this.canvasNode.height = this.height;
		this.ctx.fillStyle = this.bgColor;
		this.ctx.fillRect(0, 0, this.width, this.height);
	}

	private drawMainTriangle(durationTime: number, intervalTime: number): Observable<TweenObj> {

		const peaks = this.peaksTriange;
		const peak1 = peaks[0];
		const peak2 = peaks[1];
		const peak3 = peaks[2];

		return this.animateLine({
			startX: peak1.x,
			startY: peak1.y,
			endX: peak2.x,
			endY: peak2.y,
			durationTime: durationTime / 3,
			intervalTime: intervalTime
		})
		.pipe(
			switchMap(item => (
				this.animateLine({
					startX: peak2.x,
					startY: peak2.y,
					endX: peak3.x,
					endY: peak3.y,
					durationTime: durationTime / 3,
					intervalTime: 0
				})
			)),
			switchMap(item => (
				this.animateLine({
					startX: peak3.x,
					startY: peak3.y,
					endX: peak1.x,
					endY: peak1.y,
					durationTime: durationTime / 3,
					intervalTime: 0
				})
			))
		)
		.pipe(
			filter(({duration}) => duration === 1)
		);
	}

	private getCanvasSizeFromHtml(): CanvasSize {
		const { width, height } = this.canvasNode.getBoundingClientRect();

		return {
			width, height
		};
	}

	private addEventListeners(): void {
		const matchMediaDark = window.matchMedia('(prefers-color-scheme: dark)');

		matchMediaDark.addEventListener('change', this.matchMediaDarkListener);
		window.addEventListener('resize', debounce(this.resizeEvent, this.intervalResize));
		this.canvasNode.addEventListener('click', this.draw.bind(this));
	}

	private initVars(): void {
		const ctx = this.canvasNode.getContext('2d');
		const { width, height } = this.getCanvasSizeFromHtml();

		if (ctx === null) {
			throw new Error('Не удалось получить контекст холста canvas');
		}

		this.ctx = ctx;
		this.width = width;
		this.height = height;
		this.bgColor = (gsap.getProperty(this.canvasNode, '--bgColor') as string);
		this.color = (gsap.getProperty(this.canvasNode, '--color') as string);
		this.setPeaksTriangle();
	}

	private setPeaksTriangle(peaksTriangleRelative = this.peaksTriangleRelative) {

		const peak1 = peaksTriangleRelative[0];
		const peak2 = peaksTriangleRelative[1];
		const peak3 = peaksTriangleRelative[2];

		this.peaksTriange = [
			{ x: this.width * peak1.x, y: this.height * peak1.y },
			{ x: this.width * peak2.x, y: this.height * peak2.y },
			{ x: this.width * peak3.x, y: this.height * peak3.y }
		];
	}

	private matchMediaDarkListener = (event: MediaQueryListEvent): void => {
		this.bgColor = (gsap.getProperty(this.canvasNode, '--bgColor') as string);
		this.color = (gsap.getProperty(this.canvasNode, '--color') as string);
		this.draw();
	}

	private resizeEvent = (event: Event): void => {
		const { width, height } = this.getCanvasSizeFromHtml();

		this.width = width;
		this.height = height;
		this.setPeaksTriangle();

		this.draw();
	}

	private createCoord(startCoord: number, endCoord: number, duration: number): number {
		let coord: number;

		if (endCoord > startCoord) {
			coord = startCoord + (endCoord - startCoord) * duration;
		} else {
			coord = endCoord + (startCoord - endCoord) * (1 - duration);
		}

		return coord;
	}

	private animateLine({startY, endY, startX, endX, durationTime, intervalTime}: animateLineObj): Observable<TweenObj> {

		const currentCountDraw = this.countDraw;

		return interval(intervalTime)
		.pipe(
			take(1),
			switchMap(item => tween(durationTime, 0, 1000)),
			takeWhile(item => this.countDraw === currentCountDraw),
			tap(({lastDuration}) => {
				if (lastDuration === 0) {
					this.ctx.beginPath();
					this.ctx.strokeStyle = this.color;
				}
			}),
			tap(({duration, lastDuration}) => {
				const x = this.createCoord(startX, endX, duration);
				const lastX = this.createCoord(startX, endX, lastDuration);
				const y = this.createCoord(startY, endY, duration);
				const lastY = this.createCoord(startY, endY, lastDuration);

				this.ctx.moveTo(lastX, lastY);
				this.ctx.lineTo(x, y);
				this.ctx.lineWidth = 2;
				this.ctx.stroke();
			}),
			tap(({duration}) => {
				if (duration === 1) {
					this.ctx.closePath();
				}
			})
		);
	}
}
