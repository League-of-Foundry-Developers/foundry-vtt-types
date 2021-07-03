import { expectType } from 'tsd';

expectType<'Token'>(TokenLayer.documentName);
expectType<TokenLayer>(TokenLayer.instance);
expectType<TokenLayer.LayerOptions>(TokenLayer.layerOptions);
expectType<'tokens'>(TokenLayer.layerOptions.name);
expectType<ConstructorOf<Token>>(TokenLayer.layerOptions.objectClass);

const layer = new TokenLayer();
expectType<ConstructorOf<Token>>(layer.options.objectClass);
expectType<TokenLayer.LayerOptions>(layer.options);
expectType<'tokens'>(layer.options.name);

expectType<1>(layer.gridPrecision);

expectType<TokenHUD>(layer.hud);

expectType<Token[]>(layer.ownedTokens);

expectType<Promise<TokenLayer>>(layer.tearDown());

expectType<TokenLayer>(layer.activate());

expectType<TokenLayer>(layer.deactivate());

expectType<boolean>(layer.selectObjects());
expectType<boolean>(layer.selectObjects({}));
expectType<boolean>(
  layer.selectObjects({
    x: 10,
    y: 10,
    width: 100,
    height: 200,
    releaseOptions: { trigger: true },
    controlOptions: { releaseOthers: true }
  })
);

expectType<number>(layer.targetObjects({ x: 100, y: 100, width: 800, height: 600 }));
expectType<number>(layer.targetObjects({ x: 100, y: 100, width: 800, height: 600 }, {}));
expectType<number>(layer.targetObjects({ x: 100, y: 100, width: 800, height: 600 }, { releaseOthers: true }));

expectType<Token | null>(layer.cycleTokens(true, true));

expectType<Promise<Combat | Combatant[] | void>>(layer.toggleCombat());
expectType<Promise<Combat | Combatant[] | void>>(layer.toggleCombat(true));
expectType<Promise<Combat | Combatant[] | void>>(layer.toggleCombat(true, null));
expectType<Promise<Combat | Combatant[] | void>>(layer.toggleCombat(true, new Combat()));
expectType<Promise<Combat | Combatant[] | void>>(layer.toggleCombat(true, new Combat(), {}));
expectType<Promise<Combat | Combatant[] | void>>(
  layer.toggleCombat(true, new Combat(), { token: new Token(new TokenDocument()) })
);

expectType<void>(layer.concludeAnimation());
