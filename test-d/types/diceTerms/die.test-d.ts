import '../../../index';

Die.MODIFIERS.testModifier1 = function (this: DiceTerm) {
  return;
};

Die.MODIFIERS.testModifier2 = function (this: DiceTerm) {
  return this;
};

Die.MODIFIERS.testModifier3 = function (this: DiceTerm, modifier: string) {
  return modifier.length > 0 ? undefined : this;
};
