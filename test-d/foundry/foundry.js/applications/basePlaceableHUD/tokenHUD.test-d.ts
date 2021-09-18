import { expectType } from 'tsd';

declare const token: Token;

const hud = new TokenHUD();
expectType<PlaceablesLayer<any> | undefined>(hud.layer);
expectType<Token | undefined>(hud.object);
hud.bind(token);

expectType<
  ReturnType<foundry.data.TokenData['toJSON']> & {
    id: string;
    classes: string;
    appId: number;
    isGM: boolean;
    icons: typeof CONFIG.controlIcons;
  } & {
    canConfigure: boolean;
    canToggleCombat: boolean;
    displayBar1: boolean;
    bar1Data: ReturnType<TokenDocument['getBarAttribute']>;
    displayBar2: boolean;
    bar2Data: ReturnType<TokenDocument['getBarAttribute']>;
    visibilityClass: string;
    effectsClass: string;
    combatClass: string;
    targetClass: string;
    statusEffects: Partial<
      Record<
        string,
        {
          id: string;
          title: string | null;
          src: string;
          isActive: boolean;
          isOverlay: boolean;
          cssClass: string;
        }
      >
    >;
  }
>(hud.getData());
expectType<void>(hud.setPosition());
