Die.MODIFIERS.testModifier1 = function (this: Die) {
  return;
};

Die.MODIFIERS.testModifier2 = function (this: Die) {
  return this;
};

Die.MODIFIERS.testModifier3 = function (this: Die, modifier: string) {
  return modifier.length > 0 ? undefined : this;
};

Die.MODIFIERS.testModifier4 = function () {
  return this;
};
