import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

const app = new foundry.applications.sidebar.apps.InvitationLinks();

expectTypeOf(
  foundry.applications.sidebar.apps.InvitationLinks.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.sidebar.apps.InvitationLinks.DefaultOptions>();

declare class _TestInvitationLinksSubclass extends foundry.applications.sidebar.apps.InvitationLinks {
  protected override _prepareContext(
    options: DeepPartial<foundry.applications.sidebar.apps.InvitationLinks.RenderOptions>,
  ): Promise<foundry.applications.sidebar.apps.InvitationLinks.RenderContext>;
}

expectTypeOf(app).toEqualTypeOf<foundry.applications.sidebar.apps.InvitationLinks>();
