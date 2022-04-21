import { expectError, expectType } from 'tsd';

declare const wall: Wall;

expectError(new DoorControl());

const control = new DoorControl(wall);
expectType<Wall>(control.wall);
expectType<Promise<DoorControl>>(control.draw());
expectType<PIXI.Graphics | undefined>(control.bg);
expectType<PIXI.Sprite | undefined>(control.icon);
expectType<PIXI.Graphics | undefined>(control.border);
expectType<void>(control.reposition());
expectType<boolean>(control.isVisible);
