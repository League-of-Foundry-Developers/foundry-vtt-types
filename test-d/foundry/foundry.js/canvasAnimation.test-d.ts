import { expectType } from 'tsd';

expectType<PIXI.Ticker>(CanvasAnimation.ticker);
expectType<Record<string, { fn: (dt: number) => void; context: PIXI.Container; resolve: (value: boolean) => void }>>(
  CanvasAnimation.animations
);
expectType<Promise<boolean>>(
  CanvasAnimation.animateLinear([{ parent: canvas?.stage?.pivot, attribute: 'x', to: 200 }])
);
expectType<Promise<boolean>>(
  CanvasAnimation.animateLinear([{ parent: canvas?.stage?.pivot, attribute: 'x', to: 200 }], {})
);
expectType<Promise<boolean>>(
  CanvasAnimation.animateLinear([{ parent: canvas?.stage?.pivot, attribute: 'x', to: 200 }], {
    context: canvas?.stage,
    name: 'my-animation',
    duration: 1000,
    ontick: () => console.log('ticking')
  })
);

expectType<void>(CanvasAnimation.terminateAnimation('my-animation'));
