import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      SceneNavigation: SceneNavigation.Any;
    }
  }
}

/**
 * The Scene Navigation UI element.
 * @remarks TODO: Stub
 */
declare class SceneNavigation<
  RenderContext extends SceneNavigation.RenderContext = SceneNavigation.RenderContext,
  Configuration extends SceneNavigation.Configuration = SceneNavigation.Configuration,
  RenderOptions extends SceneNavigation.RenderOptions = SceneNavigation.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace SceneNavigation {
  interface Any extends AnySceneNavigation {}
  interface AnyConstructor extends Identity<typeof AnySceneNavigation> {}

  interface PreparedScene {
    id: string;
  }

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    scenes: {
      inactive: PreparedScene[];
      active: PreparedScene[];
    };
    canExpand: number;
  }

  interface Configuration<SceneNavigation extends SceneNavigation.Any = SceneNavigation.Any>
    extends HandlebarsApplicationMixin.Configuration,
      ApplicationV2.Configuration<SceneNavigation> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<SceneNavigation extends SceneNavigation.Any = SceneNavigation.Any> = DeepPartial<
    Configuration<SceneNavigation>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnySceneNavigation extends SceneNavigation<
  SceneNavigation.RenderContext,
  SceneNavigation.Configuration,
  SceneNavigation.RenderOptions
> {
  constructor(...args: never);
}

export default SceneNavigation;
