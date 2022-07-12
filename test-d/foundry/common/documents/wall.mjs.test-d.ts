import { expectError } from 'tsd';

declare const scene: Scene;

expectError(new foundry.documents.BaseWall());
expectError(new foundry.documents.BaseWall({}));

new foundry.documents.BaseWall({ c: [0, 0, 0, 0] });
new foundry.documents.BaseWall({ c: [0, 0, 0, 0] }, { parent: scene });
