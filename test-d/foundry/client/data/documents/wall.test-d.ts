import { expectError } from 'tsd';

declare const scene: Scene;

expectError(new WallDocument());
expectError(new WallDocument({}));

new WallDocument({ c: [0, 0, 0, 0] });
new WallDocument({ c: [0, 0, 0, 0] }, { parent: scene });
