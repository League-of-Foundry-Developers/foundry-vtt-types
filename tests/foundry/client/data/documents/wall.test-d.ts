const scene = new Scene({ name: "foobar" });

// @ts-expect-error Creation technically works but fails validation
new WallDocument();

// @ts-expect-error Creation technically works but fails validation
new WallDocument({});

new WallDocument({ c: [0, 0, 0, 0] });
new WallDocument({ c: [0, 0, 0, 0] }, { parent: scene });
