import { expectType } from 'tsd';

const doc = new MeasuredTemplateDocument();

expectType<User | undefined>(doc.author);
expectType<TemplateLayer | null>(doc.layer);
expectType<InstanceType<typeof MeasuredTemplateConfig> | null>(doc.sheet);
