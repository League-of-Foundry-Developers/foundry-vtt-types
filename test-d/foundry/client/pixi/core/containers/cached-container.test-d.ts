import { expectAssignable, expectType } from "tsd";

const container = new CachedContainer();
expectAssignable<PIXI.Container>(container);
expectType<PIXI.RenderTexture>(container.renderTexture);
expectType<[number, number, number, number]>(container.clearColor);
expectType<boolean>(container.displayed);
expectType<void>(container.destroy());
expectType<void>(
  container.destroy({
    children: false,
    texture: false,
    baseTexture: false
  })
);
expectType<void>(container.render(new PIXI.Renderer()));
