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
