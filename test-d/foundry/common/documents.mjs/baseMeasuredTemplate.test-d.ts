import { expectType } from 'tsd';
import { MeasuredTemplateTypes } from '../../../../src/foundry/common/constants.mjs';
import { ConfiguredDocumentClass } from '../../../../src/types/helperTypes';

const template = new foundry.documents.BaseMeasuredTemplate();
expectType<string | null>(template.data._id);
expectType<ValueOf<MeasuredTemplateTypes>>(template.data.t);
expectType<InstanceType<ConfiguredDocumentClass<typeof Scene>> | null>(template.parent);
