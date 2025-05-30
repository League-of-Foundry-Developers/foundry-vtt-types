import type { Identity } from "#utils";
import type ApplicationV2 from "./api/application.d.mts";
import type HandlebarsApplicationMixin from "./api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      AppV2QuickStartTemplate: AppV2QuickStartTemplate.Any;
    }
  }
}

/**
 * Application documentation here.
 * @remarks TODO: Stub
 * @remarks This is not actually *imported* anywhere it can be used, it appears to be for internal FVTT use only.
 */
declare class AppV2QuickStartTemplate<
  RenderContext extends AppV2QuickStartTemplate.RenderContext = AppV2QuickStartTemplate.RenderContext,
  Configuration extends AppV2QuickStartTemplate.Configuration = AppV2QuickStartTemplate.Configuration,
  RenderOptions extends AppV2QuickStartTemplate.RenderOptions = AppV2QuickStartTemplate.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace AppV2QuickStartTemplate {
  interface Any extends AnyAppV2QuickStartTemplate {}
  interface AnyConstructor extends Identity<typeof AnyAppV2QuickStartTemplate> {}

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RenderContext {}

  interface Configuration extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration {}
  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyAppV2QuickStartTemplate extends AppV2QuickStartTemplate<
  AppV2QuickStartTemplate.RenderContext,
  AppV2QuickStartTemplate.Configuration,
  AppV2QuickStartTemplate.RenderOptions
> {}

export default AppV2QuickStartTemplate;
