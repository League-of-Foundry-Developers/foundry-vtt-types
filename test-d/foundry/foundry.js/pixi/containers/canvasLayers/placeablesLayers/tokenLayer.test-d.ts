import { expectType } from 'tsd';

expectType<TokenLayer | undefined>(TokenLayer.instance);
expectType<typeof Token>(TokenLayer.layerOptions.objectClass);

const layer = new TokenLayer();
expectType<typeof Token>(layer.options.objectClass);
expectType<TokenLayer.LayerOptions>(layer.options);
expectType<'tokens'>(layer.options.name);
