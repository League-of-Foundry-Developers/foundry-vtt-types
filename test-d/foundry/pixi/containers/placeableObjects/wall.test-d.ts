import { expectType } from 'tsd';
import '../../../../../index';

expectType<MouseInteractionManager<Wall, any> | null>(new Wall().mouseInteractionManager);
