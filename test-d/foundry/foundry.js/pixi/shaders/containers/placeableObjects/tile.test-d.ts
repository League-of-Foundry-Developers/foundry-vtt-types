import { expectType } from 'tsd';
import '../../../../../../index';

expectType<Tile>(new Tile(new TileDocument()));
