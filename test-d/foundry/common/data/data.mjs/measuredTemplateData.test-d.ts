import { expectType } from 'tsd';

expectType<foundry.data.MeasuredTemplateData>(new foundry.data.MeasuredTemplateData());
expectType<foundry.data.MeasuredTemplateData>(
  new foundry.data.MeasuredTemplateData({ name: 'My template', data: { x: 100, y: 100 } })
);
