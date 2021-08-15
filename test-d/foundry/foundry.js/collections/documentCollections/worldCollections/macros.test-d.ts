import type { MacroDataProperties } from '../../../../../../src/foundry/common/data/data.mjs/macroData';
import type { PropertiesToSource } from '../../../../../../src/types/helperTypes';

import { expectType } from 'tsd';

const macros = new Macros();
expectType<Macro>(macros.get('', { strict: true }));
expectType<PropertiesToSource<MacroDataProperties>[]>(macros.toJSON());
expectType<MacroDirectory | undefined>(macros.directory);
