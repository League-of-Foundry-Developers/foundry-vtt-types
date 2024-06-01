const scene = new Scene({ name: "foobar" });

// Creation works but fails validation
new WallDocument();

// Creation works but fails validation
new WallDocument({});

new WallDocument({ c: [0, 0, 0, 0] });
new WallDocument({ c: [0, 0, 0, 0] }, { parent: scene });
