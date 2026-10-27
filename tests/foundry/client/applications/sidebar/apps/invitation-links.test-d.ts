import { expectTypeOf, test } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import InvitationLinks = foundry.applications.sidebar.apps.InvitationLinks;

declare const options: DeepPartial<InvitationLinks.RenderOptions> & { isFirstRender: boolean };

test("foundry/client/applications/sidebar/apps/invitation-links", () => {
  const links = new InvitationLinks();

  expectTypeOf(links).toExtend<ApplicationV2.Any>();

  expectTypeOf(InvitationLinks.PARTS).toEqualTypeOf<
    Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
  >();
  expectTypeOf(links["_prepareContext"](options)).toEqualTypeOf<Promise<InvitationLinks.RenderContext>>();

  // The context is a copy of `game.data.addresses`, so it carries that shape.
  expectTypeOf<InvitationLinks.RenderContext>().toExtend<foundry.Game.Data.Addresses>();
  expectTypeOf<InvitationLinks.RenderContext["local"]>().toEqualTypeOf<string | null>();
  expectTypeOf<InvitationLinks.RenderContext["remote"]>().toEqualTypeOf<string | null>();
  expectTypeOf<InvitationLinks.RenderContext["remote6"]>().toEqualTypeOf<string | null>();
  expectTypeOf<InvitationLinks.RenderContext["remoteIsAccessible"]>().toEqualTypeOf<boolean | null>();
  expectTypeOf<InvitationLinks.RenderContext["remoteIPv4Accessible"]>().toEqualTypeOf<boolean | null>();
  expectTypeOf<InvitationLinks.RenderContext["remoteIPv6Accessible"]>().toEqualTypeOf<boolean | null>();
  expectTypeOf<InvitationLinks.RenderContext["rootId"]>().toBeString();

  // One status per remote address.
  expectTypeOf<InvitationLinks.RenderContext["remoteStatus"]>().toEqualTypeOf<InvitationLinks.ConnectionStatus>();
  expectTypeOf<InvitationLinks.RenderContext["remote6Status"]>().toEqualTypeOf<InvitationLinks.ConnectionStatus>();
  expectTypeOf<InvitationLinks.ConnectionStatus["cssClass"]>().toEqualTypeOf<
    "connection" | "no-connection" | "unknown-connection"
  >();
  expectTypeOf<InvitationLinks.ConnectionStatus["title"]>().toBeString();
  expectTypeOf<InvitationLinks.ConnectionStatus["canConnect"]>().toBeBoolean();
  expectTypeOf<InvitationLinks.ConnectionStatus["failedCheck"]>().toBeBoolean();

  // Connection state lives only in the per-address statuses.
  expectTypeOf<InvitationLinks.RenderContext>().not.toHaveProperty("remoteClass");
});
