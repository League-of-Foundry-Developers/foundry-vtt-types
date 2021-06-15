import { expectType } from 'tsd';
import '../../index';

const App = class extends Application {};
const resizableUndefined = new Draggable(new App(), $(), new HTMLElement());
expectType<false>(resizableUndefined.resizable);
expectType<Draggable.Handlers>(resizableUndefined.handlers);

const maybeResizable = new Draggable(new App(), $(), new HTMLElement(), ((): boolean => false)());
expectType<boolean>(maybeResizable.resizable);
expectType<Draggable.Handlers | Draggable.ResizableHandlers>(maybeResizable.handlers);

const nonResizable = new Draggable(new App(), $(), new HTMLElement(), false);
expectType<false>(nonResizable.resizable);
expectType<Draggable.Handlers>(nonResizable.handlers);

const resizable = new Draggable(new App(), $(), new HTMLElement(), true);
expectType<true>(resizable.resizable);
expectType<Draggable.ResizableHandlers>(resizable.handlers);
