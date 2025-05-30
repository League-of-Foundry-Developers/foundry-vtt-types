import type { Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ActorSheetV2: ActorSheetV2.Any;
    }
  }
}

/**
 * A base class for providing Actor Sheet behavior using ApplicationV2.
 */
declare class ActorSheetV2<
  RenderContext extends ActorSheetV2.RenderContext = ActorSheetV2.RenderContext,
  Configuration extends ActorSheetV2.Configuration = ActorSheetV2.Configuration,
  RenderOptions extends ActorSheetV2.RenderOptions = ActorSheetV2.RenderOptions,
> extends DocumentSheetV2<Actor.Implementation, RenderContext, Configuration, RenderOptions> {
  /**
   * The Actor document managed by this sheet.
   */
  get actor(): this["document"];

  /**
   * If this sheet manages the ActorDelta of an unlinked Token, reference that Token document.
   */
  get token(): this["document"]["token"];

  protected override _getHeaderControls(): ApplicationV2.HeaderControlsEntry[];

  // The class includes a number of protected static functions for its actions
  static #protected;
}

declare namespace ActorSheetV2 {
  interface Any extends AnyActorSheetV2 {}
  interface AnyConstructor extends Identity<typeof AnyActorSheetV2> {}

  interface RenderContext extends DocumentSheetV2.RenderContext<Actor.Implementation> {}

  interface Configuration extends DocumentSheetV2.Configuration<Actor.Implementation> {}

  interface RenderOptions extends DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyActorSheetV2 extends ActorSheetV2<
  ActorSheetV2.RenderContext,
  ActorSheetV2.Configuration,
  ActorSheetV2.RenderOptions
> {
  constructor(...args: never);
}

export default ActorSheetV2;
