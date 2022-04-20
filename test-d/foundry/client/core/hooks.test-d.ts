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

Hooks.on('error', (...args) => {
  if (args[0] === 'Canvas#draw') expectType<CanvasLayer>(args[2].layer);
});
Hooks.on('error', (...args) => {
  if (args[0] === 'Game#initializeCanvas') expectType<never>(args[2].foo);
});
Hooks.on('error', (...args) => {
  if (args[0] === 'MyClass#myMethod') expectType<number>(args[2].foo);
});
