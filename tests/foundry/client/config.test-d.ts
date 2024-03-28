class D20Roll extends Roll {}

CONFIG.Dice.D20Roll = D20Roll;

const d20roll = new CONFIG.Dice.D20Roll("1d20");

d20roll.evaluate();
