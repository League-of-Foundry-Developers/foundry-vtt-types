Coin.MODIFIERS.testModifier1 = function (this: Coin) {
  return;
};

Coin.MODIFIERS.testModifier2 = function (this: Coin) {
  return this;
};

Coin.MODIFIERS.testModifier3 = function (this: Coin, modifier: string) {
  return modifier.length > 0 ? undefined : this;
};

Coin.MODIFIERS.testModifier4 = function (modifier: string) {
  return modifier.length > 0 ? undefined : this;
};
