import { expectError, expectType } from 'tsd';

const template = new foundry.documents.BaseMeasuredTemplate();
expectType<string | null>(template.data._id);
expectType<'circle' | 'cone' | 'rect' | 'ray'>(template.data.t);
expectType<Scene | null>(template.parent);

const scene = new Scene({ name: 'My scene' });

expectError<foundry.documents.BaseMeasuredTemplate>(new foundry.documents.BaseMeasuredTemplate());
expectError<foundry.documents.BaseMeasuredTemplate>(new foundry.documents.BaseMeasuredTemplate({ x: 100, y: 100 }));
expectType<foundry.documents.BaseMeasuredTemplate>(
  new foundry.documents.BaseMeasuredTemplate({ x: 100, y: 100 }, scene)
);
expectType<foundry.documents.BaseMeasuredTemplate>(new foundry.documents.BaseMeasuredTemplate({}, scene));
expectType<foundry.documents.BaseMeasuredTemplate>(new foundry.documents.BaseMeasuredTemplate(undefined, scene));
expectType<foundry.documents.BaseMeasuredTemplate>(
  new foundry.documents.BaseMeasuredTemplate(
    {
      _id: null,
      user: null,
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
expectType<foundry.documents.BaseMeasuredTemplate>(
  new foundry.documents.BaseMeasuredTemplate(
    {
      _id: undefined,
      user: undefined,
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

expectType<foundry.documents.BaseMeasuredTemplate>(
  new foundry.documents.BaseMeasuredTemplate(
    {
      _id: '10',
      user: '11',
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
