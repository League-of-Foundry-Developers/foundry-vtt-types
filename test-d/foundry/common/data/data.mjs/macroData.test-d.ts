import { expectError, expectType } from "tsd";

expectError(new foundry.data.MacroData());
expectError(new foundry.data.MacroData({}));
expectType<foundry.data.MacroData>(new foundry.data.MacroData({ name: "foo" }));
