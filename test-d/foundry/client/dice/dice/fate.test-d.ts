import '../../../index';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace FateDie {
    interface Modifiers {
      testModifier1: (this: DiceTerm) => void;
      testModifier2: (this: DiceTerm) => DiceTerm;
      testModifier3: (this: DiceTerm, modifier: string) => undefined | DiceTerm;
    }
  }
}

FateDie.MODIFIERS.testModifier1 = function (this: DiceTerm) {
  return;
};

FateDie.MODIFIERS.testModifier2 = function (this: DiceTerm) {
  return this;
};

FateDie.MODIFIERS.testModifier3 = function (this: DiceTerm, modifier: string) {
  return modifier.length > 0 ? undefined : this;
};
