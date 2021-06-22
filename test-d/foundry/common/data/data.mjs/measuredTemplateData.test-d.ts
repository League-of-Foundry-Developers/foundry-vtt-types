import { expectError, expectType } from 'tsd';

const scene = new Scene();

expectError<foundry.data.MeasuredTemplateData>(new foundry.data.MeasuredTemplateData());
expectError<foundry.data.MeasuredTemplateData>(new foundry.data.MeasuredTemplateData({ x: 100, y: 100 }));
expectType<foundry.data.MeasuredTemplateData>(new foundry.data.MeasuredTemplateData({ x: 100, y: 100 }, scene));
expectType<foundry.data.MeasuredTemplateData>(new foundry.data.MeasuredTemplateData({}, scene));
expectType<foundry.data.MeasuredTemplateData>(new foundry.data.MeasuredTemplateData(undefined, scene));
