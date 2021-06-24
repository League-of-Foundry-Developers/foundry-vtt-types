import { expectType } from 'tsd';

expectType<'MeasuredTemplate'>(MeasuredTemplate.embeddedName);

const template = new MeasuredTemplate(new MeasuredTemplateDocument());
expectType<Promise<MeasuredTemplate>>(template.draw());
expectType<never>(template.bounds);
expectType<MeasuredTemplate>(template.refresh());
expectType<foundry.data.MeasuredTemplateData>(template.data);

// TODO: Modify to the configured document sheet once the data can be grabbed from config
expectType<FormApplication>(template.sheet);
