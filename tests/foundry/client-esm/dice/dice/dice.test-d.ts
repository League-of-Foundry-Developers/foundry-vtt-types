import { expectTypeOf } from "vitest";

declare const diceTerm: foundry.dice.terms.DiceTerm;

expectTypeOf(diceTerm.method).toEqualTypeOf<keyof typeof CONFIG.Dice.fulfillment.methods | undefined>();
expectTypeOf(diceTerm.modifiers).toEqualTypeOf<string[]>();
expectTypeOf(diceTerm.results).toEqualTypeOf<foundry.dice.terms.DiceTerm.Result[]>();
expectTypeOf(diceTerm.number).toEqualTypeOf<number | undefined>();
expectTypeOf(diceTerm.faces).toEqualTypeOf<number | undefined>();
expectTypeOf(diceTerm.denomination).toEqualTypeOf<string>();
expectTypeOf(diceTerm.dice).toEqualTypeOf<foundry.dice.terms.DiceTerm[]>();
expectTypeOf(diceTerm.total).toEqualTypeOf<number | undefined>();
expectTypeOf(diceTerm.values).toEqualTypeOf<number[]>();
expectTypeOf(diceTerm.isDeterministic).toEqualTypeOf<boolean>();
expectTypeOf(diceTerm.alter(3, 2)).toEqualTypeOf<foundry.dice.terms.DiceTerm>();
expectTypeOf(diceTerm.roll()).toEqualTypeOf<Promise<foundry.dice.terms.DiceTerm.Result>>();
expectTypeOf(diceTerm.mapRandomFace(4)).toEqualTypeOf<number>();
expectTypeOf(diceTerm.randomFace()).toEqualTypeOf<number>();

declare const result: foundry.dice.terms.DiceTerm.Result;
expectTypeOf(diceTerm.getResultLabel(result)).toEqualTypeOf<string>();
expectTypeOf(diceTerm.getResultCSS(result)).toEqualTypeOf<(string | null)[]>();
expectTypeOf(diceTerm.getTooltipData()).toEqualTypeOf<foundry.dice.terms.DiceTerm.ToolTipData>();

expectTypeOf(foundry.dice.terms.DiceTerm.DENOMINATION).toEqualTypeOf<string>();
expectTypeOf(foundry.dice.terms.DiceTerm.MODIFIERS).toEqualTypeOf<foundry.dice.terms.DiceTerm.Modifiers>();
expectTypeOf(foundry.dice.terms.DiceTerm.MODIFIERS_REGEXP_STRING).toEqualTypeOf<string>();
expectTypeOf(foundry.dice.terms.DiceTerm.MODIFIER_REGEXP).toEqualTypeOf<RegExp>();
expectTypeOf(foundry.dice.terms.DiceTerm.REGEXP).toEqualTypeOf<RegExp>();
expectTypeOf(foundry.dice.terms.DiceTerm.SERIALIZE_ATTRIBUTES).toEqualTypeOf<string[]>();
expectTypeOf(foundry.dice.terms.DiceTerm.compareResult(3, "", 4)).toEqualTypeOf<boolean>();
expectTypeOf(foundry.dice.terms.DiceTerm.matchTerm("")).toEqualTypeOf<RegExpMatchArray | null>();

declare const rema: RegExpMatchArray;
expectTypeOf(foundry.dice.terms.DiceTerm.fromMatch(rema)).toEqualTypeOf<foundry.dice.terms.DiceTerm>();
