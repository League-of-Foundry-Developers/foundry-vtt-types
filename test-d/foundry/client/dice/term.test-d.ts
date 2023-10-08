import { expectType } from "tsd";
import "../../index";

class CustomRollTerm extends RollTerm {
  someProperty = 42;
}

const r = new CustomRollTerm();

expectType<Promise<CustomRollTerm>>(r.evaluate({ async: true }));
expectType<CustomRollTerm>(r.evaluate({ async: false }));
expectType<CustomRollTerm>(r.evaluate());
expectType<CustomRollTerm>(r.evaluate({ minimize: true, maximize: true }));
expectType<CustomRollTerm | Promise<CustomRollTerm>>(
  r.evaluate({ minimize: true, maximize: true, async: false as boolean }),
);
expectType<CustomRollTerm | Promise<CustomRollTerm>>(
  r.evaluate({ minimize: true, maximize: true, async: false as boolean | undefined }),
);
expectType<CustomRollTerm>(r.evaluate({ minimize: true, maximize: true, async: false as false | undefined }));
expectType<CustomRollTerm | Promise<CustomRollTerm>>(
  r.evaluate({ minimize: true, maximize: true, async: false as true | undefined }),
);
