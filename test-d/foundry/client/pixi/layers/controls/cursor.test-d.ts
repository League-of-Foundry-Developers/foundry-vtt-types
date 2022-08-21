import { expectType } from "tsd";

declare const user: User;

const cursor = new Cursor(user);
expectType<void>(cursor.draw(user));
expectType<void>(cursor.destroy());
expectType<void>(cursor.destroy({}));
expectType<void>(cursor.destroy({ children: true, texture: true, baseTexture: true }));
