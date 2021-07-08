import { expectType } from 'tsd';

const doc = new MeasuredTemplateDocument();

expectType<User | undefined>(doc.author);
// TODO: Modify to TemplateLayer | null once data can be grabbed from CONFIG
expectType<PlaceablesLayer>(doc.layer);

// TODO: Modify to MeasuredTemplateConfig | null once data can be grabbed from CONFIG
expectType<FormApplication | null>(doc.sheet);
