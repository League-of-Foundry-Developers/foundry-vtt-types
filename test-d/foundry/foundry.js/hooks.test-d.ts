import { expectType } from 'tsd';
import '../../../../index';

Hooks.on('canvasInit', (canvas) => {
  expectType<Canvas>(canvas);
});
Hooks.on('fooBar', (baz, bar) => {
  expectType<string>(baz);
  expectType<number>(bar);
  return true;
});
Hooks.on<Hooks.CloseApplication<FormApplication>>('closeFormApplication', (app, jq) => {
  expectType<FormApplication>(app);
  expectType<JQuery>(jq);
});
