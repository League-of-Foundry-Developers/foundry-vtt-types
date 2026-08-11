import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import InvitationLinks = foundry.applications.sidebar.apps.InvitationLinks;

const links = new InvitationLinks();

expectTypeOf(links).toExtend<ApplicationV2.Any>();

expectTypeOf(InvitationLinks.PARTS).toEqualTypeOf<Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>>();

declare const options: DeepPartial<InvitationLinks.RenderOptions> & { isFirstRender: boolean };
expectTypeOf(links["_prepareContext"](options)).toEqualTypeOf<Promise<InvitationLinks.RenderContext>>();

// The context is `game.data.addresses`, so it carries that shape.
expectTypeOf<InvitationLinks.RenderContext["local"]>().toBeString();
expectTypeOf<InvitationLinks.RenderContext["remote"]>().toEqualTypeOf<string | undefined>();
expectTypeOf<InvitationLinks.RenderContext["remoteIsAccessible"]>().toEqualTypeOf<boolean | null>();

// Annotated onto it only when a public address exists, so every one of these is optional.
expectTypeOf<InvitationLinks.RenderContext["remoteClass"]>().toEqualTypeOf<string | undefined>();
expectTypeOf<InvitationLinks.RenderContext["remoteTitle"]>().toEqualTypeOf<string | undefined>();
expectTypeOf<InvitationLinks.RenderContext["failedCheck"]>().toEqualTypeOf<boolean | undefined>();
expectTypeOf<InvitationLinks.RenderContext["canConnect"]>().toEqualTypeOf<boolean | undefined>();
expectTypeOf<InvitationLinks.RenderContext["rootId"]>().toEqualTypeOf<string | undefined>();
