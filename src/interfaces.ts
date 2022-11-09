export interface CanvasSize {
	width: number;
	height: number;
}

export interface TweenObj {
	pos: number;
	duration: number;
	lastPos: number;
	lastDuration: number;
}

export interface animateLineObj {
	startY: number;
	endY: number;
	startX: number;
	endX: number;
	durationTime: number;
	intervalTime: number;
}

export interface PeakTriangle {
	x: number;
	y: number;
}
