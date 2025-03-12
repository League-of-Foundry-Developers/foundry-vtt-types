export {};

declare const scene: Scene;

// @ts-expect-error requires 'c'
new WallDocument();

// @ts-expect-error requires 'c'
new WallDocument({});

new WallDocument({ c: [0, 0, 0, 0] });
new WallDocument({ c: [0, 0, 0, 0] }, { parent: scene });
