import { expectTypeOf } from "vitest";

import DocumentOwnershipConfig = foundry.applications.apps.DocumentOwnershipConfig;

declare const actor: Actor.Implementation;

const ownershipConfig = new DocumentOwnershipConfig<Actor.Implementation>({ document: actor });

expectTypeOf(ownershipConfig.document).toEqualTypeOf<Actor.Implementation>();
expectTypeOf(ownershipConfig.title).toBeString();

declare const context: DocumentOwnershipConfig.RenderContext<Actor.Implementation>;
expectTypeOf(context.isFolder).toEqualTypeOf<boolean>();
expectTypeOf(context.showGM).toEqualTypeOf<boolean>();
expectTypeOf(context.instructions).toBeString();
expectTypeOf(context.playerLevels).toEqualTypeOf<DocumentOwnershipConfig.OwnershipLevelChoice[]>();
expectTypeOf(context.defaultLevels).toEqualTypeOf<DocumentOwnershipConfig.OwnershipLevelChoice[]>();
expectTypeOf(context.users).toEqualTypeOf<DocumentOwnershipConfig.UserOwnershipContext[]>();
expectTypeOf(context.buttons).toEqualTypeOf<foundry.applications.api.ApplicationV2.FormFooterButton[]>();

declare const userContext: DocumentOwnershipConfig.UserOwnershipContext;
expectTypeOf(userContext.user).toEqualTypeOf<User.Stored>();
expectTypeOf(userContext.isAuthor).toEqualTypeOf<boolean>();
expectTypeOf(userContext.level).toEqualTypeOf<
  foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_META_OWNERSHIP_LEVELS | undefined
>();
