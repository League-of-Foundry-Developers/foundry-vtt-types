import { expectType } from "tsd";

expectType<foundry.data.AmbientSoundData>(new foundry.data.AmbientSoundData());
expectType<foundry.data.AmbientSoundData>(new foundry.data.AmbientSoundData({}));
expectType<foundry.data.AmbientSoundData>(
  new foundry.data.AmbientSoundData({
    _id: null,
    x: 10,
    y: 10,
    hidden: true,
    radius: 100,
    darkness: { min: 10, max: 90 },
    easing: true,
    path: "path/to/file",
    repeat: true,
    volume: 100,
  }),
);
expectType<foundry.data.AmbientSoundData>(
  new foundry.data.AmbientSoundData({
    _id: null,
    x: null,
    y: null,
    hidden: null,
    radius: null,
    darkness: null,
    easing: null,
    path: null,
    repeat: null,
    volume: null,
  }),
);
expectType<foundry.data.AmbientSoundData>(
  new foundry.data.AmbientSoundData({
    _id: undefined,
    x: undefined,
    y: undefined,
    hidden: undefined,
    radius: undefined,
    darkness: undefined,
    easing: undefined,
    path: undefined,
    repeat: undefined,
    volume: undefined,
  }),
);
