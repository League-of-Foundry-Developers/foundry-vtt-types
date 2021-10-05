import { expectError, expectType } from 'tsd';

declare const doc: AmbientLightDocument;
declare const obj: AmbientLight;

expectError(new LightConfig());
expectError(new LightConfig(obj));

const config = new LightConfig(doc);
const data = await config.getData();
expectType<string>(data.submitText);
expectType<Record<'l' | 'g' | 'u', string>>(data.lightTypes);
expectType<
  Record<keyof typeof CONFIG['Canvas']['lightAnimations'], string> & {
    '': 'None';
  }
>(data.lightAnimations);
expectType<number>(data.colorIntensity);
