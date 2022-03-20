import { expectType } from 'tsd';

declare const doc: AmbientLightDocument;

expectType<'AmbientLight'>(AmbientLight.embeddedName);

const light = new AmbientLight(doc);
expectType<LightSource>(light.source);
expectType<ControlIcon | undefined>(light.controlIcon);
expectType<NormalizedRectangle>(light.bounds);
expectType<boolean>(light.global);
expectType<number>(light.radius);
expectType<number>(light.dimRadius);
expectType<number>(light.brightRadius);
expectType<boolean>(light.isVisible);
expectType<Promise<AmbientLight>>(light.draw());
expectType<AmbientLight>(light.refresh());
expectType<void>(light.refreshControl());
expectType<string>(light.sourceId);
