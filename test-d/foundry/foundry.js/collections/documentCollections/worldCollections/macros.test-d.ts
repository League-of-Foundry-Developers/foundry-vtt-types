import { expectType } from 'tsd';
import { MacroDataProperties } from '../../../../../../src/foundry/common/data/data.mjs/macroData';
import { PropertiesToSource } from '../../../../../../src/types/helperTypes';

const macros = new Macros();
expectType<Macro>(macros.get('', { strict: true }));
expectType<PropertiesToSource<MacroDataProperties>[]>(macros.toJSON());
expectType<MacroDirectory | undefined>(macros.directory);
