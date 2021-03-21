import { expectType } from 'tsd';
import '../../../../index';

Hooks.on('applyActiveEffect', (actor, change) => {
  expectType<Actor>(actor);
  expectType<ActiveEffect.Change>(change);
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
