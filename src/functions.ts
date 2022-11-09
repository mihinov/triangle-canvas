import { TweenObj } from './interfaces';
import { animationFrames, map, takeWhile, endWith, tap, Observable } from 'rxjs';

export function debounce(callee, timeoutMs) {
  // Как результат возвращаем другую функцию.
  // Это нужно, чтобы мы могли не менять другие части кода,
  // чуть позже мы увидим, как это помогает.
  return function perform(...args) {
    // В переменной previousCall мы будем хранить
    // временную метку предыдущего вызова...
    let previousCall = this.lastCall

    // ...а в переменной текущего вызова —
    // временную метку нынешнего момента.
    this.lastCall = Date.now()

    // Нам это будет нужно, чтобы потом сравнить,
    // когда была функция вызвана в этот раз и в предыдущий.
    // Если разница между вызовами меньше, чем указанный интервал,
    // то мы очищаем таймаут...
    if (previousCall && this.lastCall - previousCall <= timeoutMs) {
      clearTimeout(this.lastCallTimer)
    }

    // ...который отвечает за непосредственно вызов функции-аргумента.
    // Обратите внимание, что мы передаём все аргументы ...args,
    // который получаем в функции perform —
    // это тоже нужно, чтобы нам не приходилось менять другие части кода.
    this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs)

    // Если таймаут был очищен, вызова не произойдёт
    // если он очищен не был, то callee вызовется.
    // Таким образом мы как бы «отодвигаем» вызов callee
    // до тех пор, пока «снаружи всё не подуспокоится».
  }
}

export function tween(duration: number, start: number = 0, end: number = 1000): Observable<TweenObj> {
  const diff = end - start;
	let lastPos: number;
	let lastDuration: number = 0;

  return animationFrames().pipe(
    // Figure out what percentage of time has passed
    map(({ elapsed }) => elapsed / duration),
    // Take the vector while less than 100%
    takeWhile(v => v < 1),
    // Finish with 100%
    endWith(1),
		tap(v => {
			const x = v * diff + start;
			lastPos = lastPos ? lastPos : x;
			// lastDuration = lastDuration ? lastDuration : v;
		}),
    // Calculate the distance traveled between start and end
    map(v => ({
			pos: v * diff + start,
			duration: v,
			lastPos: lastPos,
			lastDuration: lastDuration
		})),
		tap(({pos, duration}) => {
			lastPos = pos;
			lastDuration = duration;
		})
  );
}
