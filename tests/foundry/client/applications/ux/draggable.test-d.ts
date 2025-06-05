import { expectTypeOf } from "vitest";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import Draggable = foundry.applications.ux.Draggable;

const App = class extends ApplicationV2 {};
const resizableUndefined = new Draggable(new App(), $(), new HTMLElement());
expectTypeOf(resizableUndefined.resizable).toEqualTypeOf<false>();
expectTypeOf(resizableUndefined.handlers).toEqualTypeOf<Draggable.Handlers>();

const maybeResizable = new Draggable(new App(), $(), new HTMLElement(), ((): boolean => false)());
expectTypeOf(maybeResizable.resizable).toEqualTypeOf<boolean>();
expectTypeOf(maybeResizable.handlers).toEqualTypeOf<Draggable.Handlers | Draggable.ResizableHandlers>();

const nonResizable = new Draggable(new App(), $(), new HTMLElement(), false);
expectTypeOf(nonResizable.resizable).toEqualTypeOf<false>();
expectTypeOf(nonResizable.handlers).toEqualTypeOf<Draggable.Handlers>();

const resizable = new Draggable(new App(), $(), new HTMLElement(), true);
expectTypeOf(resizable.resizable).toEqualTypeOf<true>();
expectTypeOf(resizable.handlers).toEqualTypeOf<Draggable.ResizableHandlers>();
