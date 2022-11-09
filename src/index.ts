import { CanvasDraw } from './CanvasDraw';

const canvasNode: HTMLCanvasElement | null = document.querySelector('#canvas');

if (canvasNode !== null) {
	new CanvasDraw(canvasNode);
}
