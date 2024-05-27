import type { Mixin } from "../../../../types/utils.d.mts";
import type ApplicationV2 from "./application.d.mts";

/**
 * The mixed application class augmented with [Handlebars](https://handlebarsjs.com) template rendering behavior.
 */
declare class HandlebarsApplication {}

/**
 * Augment an Application class with [Handlebars](https://handlebarsjs.com) template rendering behavior.
 */
export default function HandlebarsApplicationMixin<BaseClass extends typeof ApplicationV2>(
  BaseApplication: BaseClass,
): Mixin<typeof HandlebarsApplication, BaseClass>;
