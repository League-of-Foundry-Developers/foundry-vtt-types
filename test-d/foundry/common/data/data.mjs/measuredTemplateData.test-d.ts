import { expectError, expectType } from 'tsd';

expectError<foundry.data.MeasuredTemplateData>(new foundry.data.MeasuredTemplateData());
expectError<foundry.data.MeasuredTemplateData>(new foundry.data.MeasuredTemplateData({ x: 100, y: 100 }));
expectType<foundry.data.MeasuredTemplateData>(
  new foundry.data.MeasuredTemplateData({ x: 100, y: 100 }, game.scenes?.active)
);
expectType<foundry.data.MeasuredTemplateData>(new foundry.data.MeasuredTemplateData({}, game.scenes?.active));
expectType<foundry.data.MeasuredTemplateData>(new foundry.data.MeasuredTemplateData(undefined, game.scenes?.active));
