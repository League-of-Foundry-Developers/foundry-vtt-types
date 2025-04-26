import { expectTypeOf } from "vitest";

const invitationLinks = new InvitationLinks({});

expectTypeOf(InvitationLinks.defaultOptions).toEqualTypeOf<Application.Options>();
expectTypeOf(invitationLinks.options).toEqualTypeOf<Application.Options>();
expectTypeOf(invitationLinks.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(invitationLinks.render(true)).toEqualTypeOf<InvitationLinks>();
