import { expectError, expectType } from 'tsd';

const scene = new Scene();

expectError<foundry.data.MeasuredTemplateData>(new foundry.data.MeasuredTemplateData());
expectError<foundry.data.MeasuredTemplateData>(new foundry.data.MeasuredTemplateData({ x: 100, y: 100 }));
expectType<foundry.data.MeasuredTemplateData>(new foundry.data.MeasuredTemplateData({ x: 100, y: 100 }, scene));
expectType<foundry.data.MeasuredTemplateData>(new foundry.data.MeasuredTemplateData({}, scene));
expectType<foundry.data.MeasuredTemplateData>(new foundry.data.MeasuredTemplateData(undefined, scene));
expectType<foundry.data.MeasuredTemplateData>(
  new foundry.data.MeasuredTemplateData(
    {
      _id: null,
      t: null,
      x: null,
      y: null,
      distance: null,
      angle: null,
      width: null,
      borderColor: null,
      fillColor: null,
      texture: null,
      flags: null
    },
    scene
  )
);
expectType<foundry.data.MeasuredTemplateData>(
  new foundry.data.MeasuredTemplateData(
    {
      _id: undefined,
      t: undefined,
      x: undefined,
      y: undefined,
      distance: undefined,
      angle: undefined,
      width: undefined,
      borderColor: undefined,
      fillColor: undefined,
      texture: undefined,
      flags: undefined
    },
    scene
  )
);

expectType<foundry.data.MeasuredTemplateData>(
  new foundry.data.MeasuredTemplateData(
    {
      _id: '10',
      t: 'ray',
      x: 0,
      y: 0,
      distance: 10,
      angle: 360,
      width: 10,
      borderColor: '#000000',
      fillColor: '#ffffff',
      texture: 'path/to/a/texture',
      flags: {}
    },
    scene
  )
);
