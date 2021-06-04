import { expectType } from 'tsd';
import '../../../../../../index';

const tileData = {
  height: 1,
  hidden: false,
  img: 'abc.png',
  locked: false,
  rotation: 0,
  scale: 1,
  width: 2,
  x: 1,
  y: 2,
  z: 3
};

expectType<Promise<Tile | void>>(Tile.create(tileData));
expectType<Promise<Tile | Tile[] | void>>(Tile.create([tileData]));
