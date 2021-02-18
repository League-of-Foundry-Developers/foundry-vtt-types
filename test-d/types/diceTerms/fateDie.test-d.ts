import '../../../index';

FateDie.MODIFIERS.testModifier1 = function (this: DiceTerm) {
  return;
};

FateDie.MODIFIERS.testModifier2 = function (this: DiceTerm) {
  return this;
};

FateDie.MODIFIERS.testModifier3 = function (this: DiceTerm, modifier: string) {
  return modifier.length > 0 ? undefined : this;
};
