import { expectType } from 'tsd';
import '../../../../../index';

declare const doc: WallDocument;

expectType<MouseInteractionManager<Wall, any> | null>(new Wall(doc).mouseInteractionManager);
