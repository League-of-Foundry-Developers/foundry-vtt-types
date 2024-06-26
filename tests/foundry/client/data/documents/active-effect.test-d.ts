import { expectTypeOf } from "vitest";

const eff = new ActiveEffect({});

expectTypeOf(eff.img).toEqualTypeOf<string | null | undefined>();
expectTypeOf(eff.updateDuration().seconds).toEqualTypeOf<number | undefined | null>();

// declare global {
//   interface FlagConfig {
//     ActiveEffect: {
//       mySystem?: {
//         importantFlag?: boolean;
//       };
//     };
//   }
// }

// expectTypeOf(eff.getFlag("mySystem", "importantFlag")).toEqualTypeOf<boolean | undefined>();
// expectTypeOf(eff.getFlag("core", "statusId")).toEqualTypeOf<string | undefined>();
// expectTypeOf(eff.getFlag("core", "overlay")).toEqualTypeOf<boolean | undefined>();

// eff.setFlag("core", "statusId", "foo");
// eff.setFlag("core", "overlay", false);

// // @ts-expect-error the setting core.statusId is a string not a number
// eff.setFlag("core", "statusId", 0);

// // @ts-expect-error the setting core.overlay is a boolean not a number
// eff.setFlag("core", "overlay", 0);
