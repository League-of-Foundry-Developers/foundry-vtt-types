import type HandlebarsApplicationMixin from "#client/applications/api/handlebars-application.mjs";
import type { PrototypeToken } from "#common/data/data.mjs";
import type { FixedInstanceType, Mixin } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";

/**
 * @remarks This does NOT exist at runtime. This is only here to be used as a type when relevant as well as to avoid
 * issues with anonymous mixin classes.
 * @remarks TODO: Stub
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class TokenApplication {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * The TokenDocument or PrototypeToken
   */
  get token(): TokenDocument.Implementation | PrototypeToken;
}

/**
 * A mixin for UI shared between TokenDocument and PrototypeToken sheets
 */
declare function TokenApplicationMixin<BaseClass extends TokenApplicationMixin.BaseClass>(
  BaseApplication: BaseClass,
): TokenApplicationMixin.Mix<BaseClass>;

declare namespace TokenApplicationMixin {
  type AnyMixedConstructor = ReturnType<typeof TokenApplicationMixin<BaseClass>>;
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = ApplicationV2.Internal.Constructor;
  type Mix<BaseClass extends TokenApplicationMixin.BaseClass> = HandlebarsApplicationMixin.Mix<
    Mixin<typeof TokenApplication, BaseClass>
  >;

  type Token = TokenDocument.Implementation | PrototypeToken;

  interface RenderContext<ConcreteToken extends TokenApplicationMixin.Token> {
    rootId: string;
    source: ConcreteToken["_source"];
    fields: ConcreteToken["schema"]["fields"];
    gridUnits: string;
    isPrototype: boolean;
    displayModes: Record<CONST.TOKEN_DISPLAY_MODES, string>;
    buttons: ApplicationV2.FormFooterButton[];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Configuration {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RenderOptions {}
}

export default TokenApplicationMixin;
