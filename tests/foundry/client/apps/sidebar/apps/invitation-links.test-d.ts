import { expectTypeOf } from "vitest";

const invitationLinks = new InvitationLinks({});

expectTypeOf(InvitationLinks.defaultOptions).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(invitationLinks.options).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(invitationLinks.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(invitationLinks.render(true)).toEqualTypeOf<InvitationLinks>();
