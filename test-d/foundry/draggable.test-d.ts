import { expectType } from 'tsd';
import '../../index';

const resizableUndefined = new Draggable(new Application(), $(), new HTMLElement());
expectType<false>(resizableUndefined.resizable);
expectType<Draggable.Handlers>(resizableUndefined.handlers);

const maybeResizable = new Draggable(new Application(), $(), new HTMLElement(), ((): boolean => false)());
expectType<boolean>(maybeResizable.resizable);
expectType<Draggable.Handlers | Draggable.ResizableHandlers>(maybeResizable.handlers);

const nonResizable = new Draggable(new Application(), $(), new HTMLElement(), false);
expectType<false>(nonResizable.resizable);
expectType<Draggable.Handlers>(nonResizable.handlers);

const resizable = new Draggable(new Application(), $(), new HTMLElement(), true);
expectType<true>(resizable.resizable);
expectType<Draggable.ResizableHandlers>(resizable.handlers);
