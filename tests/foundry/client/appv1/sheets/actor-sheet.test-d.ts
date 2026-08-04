import { expectTypeOf } from "vitest";
import type { AnyObject, MaybePromise } from "fvtt-types/utils";

import ActorSheet = foundry.appv1.sheets.ActorSheet;

declare const actor: Actor.Implementation;
const actorSheet = new ActorSheet(actor);

expectTypeOf(actorSheet.object).toEqualTypeOf<Actor.Implementation>();
expectTypeOf(actorSheet.document).toEqualTypeOf<Actor.Implementation>();
expectTypeOf(ActorSheet.defaultOptions).toEqualTypeOf<ActorSheet.Options>();
expectTypeOf(actorSheet.options).toEqualTypeOf<ActorSheet.Options>();
expectTypeOf(actorSheet.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(actorSheet.render(true)).toEqualTypeOf<ActorSheet>();

expectTypeOf(actorSheet.actor).toEqualTypeOf<Actor.Implementation>();
expectTypeOf(actorSheet.token).toEqualTypeOf<TokenDocument.Implementation | null>();
expectTypeOf(actorSheet.options.token).toEqualTypeOf<TokenDocument.Implementation | null>();

class CustomActorSheet extends ActorSheet {
  testProtected(event: DragEvent, itemData: Item.Implementation["_source"]): void {
    // V14 passes the concluding DragEvent as a second argument.
    expectTypeOf(this._onDropItemCreate(itemData, event)).toEqualTypeOf<Promise<Item.Implementation[]>>();
    expectTypeOf(this._onDropItemCreate([itemData], event)).toEqualTypeOf<Promise<Item.Implementation[]>>();

    expectTypeOf(this._getSubmitData()).toEqualTypeOf<AnyObject>();
  }
}
void CustomActorSheet;
