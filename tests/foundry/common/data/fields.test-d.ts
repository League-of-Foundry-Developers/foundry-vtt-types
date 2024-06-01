import { expectTypeOf } from "vitest";

// TypeDataField
declare const JEPCoreTypes: foundry.data.fields.TypeDataField.CoreTypeNames<typeof JournalEntryPage>;
declare const JEPSystemTypes: foundry.data.fields.TypeDataField.SystemTypeNames<typeof JournalEntryPage>;

expectTypeOf(JEPCoreTypes).toEqualTypeOf<"image" | "pdf" | "text" | "video">();
expectTypeOf(JEPSystemTypes).toEqualTypeOf<string>();
