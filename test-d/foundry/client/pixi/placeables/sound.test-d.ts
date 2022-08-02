import { expectError, expectType } from 'tsd';

declare const doc: AmbientSoundDocument;

expectType<'AmbientSound'>(AmbientSound.embeddedName);

expectError(new AmbientSound());

const sound = new AmbientSound(doc);
expectType<Sound | null>(sound.sound);
expectType<boolean>(sound.isAudible);
expectType<number>(sound.radius);
expectType<void>(sound.sync(true, 10));
expectType<void>(sound.sync(true, 10, {}));
expectType<void>(sound.sync(true, 10, { fade: 250 }));
expectType<AmbientSound>(sound.clear());
expectType<Promise<AmbientSound>>(sound.draw());
expectType<PIXI.Container>(sound.drawField());
expectType<AmbientSound>(sound.refresh());
expectType<void>(sound.refreshControl());
expectType<void>(sound.updateSource());

expectType<foundry.documents.AmbientSound>(new foundry.documents.AmbientSound());
expectType<foundry.documents.AmbientSound>(new foundry.documents.AmbientSound({}));
expectType<foundry.documents.AmbientSound>(
  new foundry.documents.AmbientSound({
    _id: null,
    x: 10,
    y: 10,
    hidden: true,
    radius: 100,
    darkness: { min: 10, max: 90 },
    easing: true,
    path: 'path/to/file',
    repeat: true,
    volume: 100
  })
);
expectType<foundry.documents.AmbientSound>(
  new foundry.documents.AmbientSound({
    _id: null,
    x: null,
    y: null,
    hidden: null,
    radius: null,
    darkness: null,
    easing: null,
    path: null,
    repeat: null,
    volume: null
  })
);
expectType<foundry.documents.AmbientSound>(
  new foundry.documents.AmbientSound({
    _id: undefined,
    x: undefined,
    y: undefined,
    hidden: undefined,
    radius: undefined,
    darkness: undefined,
    easing: undefined,
    path: undefined,
    repeat: undefined,
    volume: undefined
  })
);
