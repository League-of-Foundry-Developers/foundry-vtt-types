declare namespace Die {
  interface Modifiers {
    testModifier1: (this: DiceTerm) => void;
    testModifier2: (this: DiceTerm) => DiceTerm;
    testModifier3: (this: DiceTerm, modifier: string) => undefined | DiceTerm;
  }
}

Die.MODIFIERS.testModifier1 = function (this: DiceTerm) {
  return;
};

Die.MODIFIERS.testModifier2 = function (this: DiceTerm) {
  return this;
};

Die.MODIFIERS.testModifier3 = function (this: DiceTerm, modifier: string) {
  return modifier.length > 0 ? undefined : this;
};
