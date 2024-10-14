import type { AnyObject } from "../../../src/types/utils.d.mts";

class D20Roll<D extends AnyObject> extends Roll<D> {}

declare global {
  namespace CONFIG {
    interface Dice {
      D20Roll: typeof D20Roll;
    }
  }
}

CONFIG.Dice.D20Roll = D20Roll;

const d20roll = new CONFIG.Dice.D20Roll("1d20");

d20roll.evaluate();
