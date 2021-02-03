import '../../index';
import { expectType } from 'tsd';

const resizableUndefined = new Draggable(new Application(), $(), new HTMLElement());
expectType<undefined>(resizableUndefined.handlers.resizeDown);
expectType<undefined>(resizableUndefined.handlers.resizeMove);
expectType<undefined>(resizableUndefined.handlers.resizeUp);

const nonResizable = new Draggable(new Application(), $(), new HTMLElement(), false);
expectType<undefined>(nonResizable.handlers.resizeDown);
expectType<undefined>(nonResizable.handlers.resizeMove);
expectType<undefined>(nonResizable.handlers.resizeUp);

const resizable = new Draggable(new Application(), $(), new HTMLElement(), true);
expectType<['mousedown', (e: Event) => void, false]>(resizable.handlers.resizeDown);
expectType<['mousemove', (e: Event) => void, false]>(resizable.handlers.resizeMove);
expectType<['mouseup', (e: Event) => void, false]>(resizable.handlers.resizeUp);
