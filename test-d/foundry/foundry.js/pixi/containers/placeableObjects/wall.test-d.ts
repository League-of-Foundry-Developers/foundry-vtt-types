import { expectType } from 'tsd';
import '../../../../../index';
import { BaseWall } from '../../../../../../src/foundry/common/documents.mjs';

expectType<MouseInteractionManager<Wall, any> | null>(new Wall(new BaseWall()).mouseInteractionManager);
