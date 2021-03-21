import '../../../../index';

Hooks.on('applyActiveEffect', (actor: Actor, change: ActiveEffect.Change) => console.log('foo'));
Hooks.on('fooBar', (baz: string, bar: number) => true);
Hooks.on<Hooks.CloseApplication<FormApplication>>('closeFormApplication', (app: FormApplication, jq: JQuery) =>
  console.log('foo')
);
