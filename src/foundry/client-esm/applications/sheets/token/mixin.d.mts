import type { FixedInstanceType, Mixin } from "fvtt-types/utils";
import type ApplicationV2 from "../../api/application.d.mts";

/**
 * A mixin for UI shared between TokenDocument and PrototypeToken sheets
 */
declare function TokenApplicationMixin<BaseClass extends TokenApplicationMixin.BaseClass>(
  BaseApplication: BaseClass,
): Mixin<typeof TokenApplicationMixin.TokenApplication, BaseClass>;

declare namespace TokenApplicationMixin {
  type AnyMixedConstructor = ReturnType<typeof TokenApplicationMixin<BaseClass>>;
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = ApplicationV2.Internal.Constructor;

  /**
   * @remarks This does NOT exist at runtime. This is only here to be used as a type when relevant as well as to avoid
   * issues with anonymous mixin classes.
   */
  class TokenApplication {}
}

export default TokenApplicationMixin;
