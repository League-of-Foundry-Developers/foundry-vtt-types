Coin.MODIFIERS.testModifier1 = function (this: DiceTerm) {
  return;
};

Coin.MODIFIERS.testModifier2 = function (this: DiceTerm) {
  return this;
};

Coin.MODIFIERS.testModifier3 = function (this: DiceTerm, modifier: string) {
  return modifier.length > 0 ? undefined : this;
};
