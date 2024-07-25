declare namespace Coin {
  interface Modifiers {
    testModifier1: (this: DiceTerm) => void;
    testModifier2: (this: DiceTerm) => DiceTerm;
    testModifier3: (this: DiceTerm, modifier: string) => undefined | DiceTerm;
  }
}

Coin.MODIFIERS.testModifier1 = function (this: DiceTerm) {
  return;
};

Coin.MODIFIERS.testModifier2 = function (this: DiceTerm) {
  return this;
};

Coin.MODIFIERS.testModifier3 = function (this: DiceTerm, modifier: string) {
  return modifier.length > 0 ? undefined : this;
};
