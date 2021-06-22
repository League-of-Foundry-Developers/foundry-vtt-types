import { expectType } from 'tsd';
import '../../../../../../index';
import { BaseTile } from '../../../../../../../src/foundry/common/documents.mjs';

expectType<Tile>(new Tile(new BaseTile()));
