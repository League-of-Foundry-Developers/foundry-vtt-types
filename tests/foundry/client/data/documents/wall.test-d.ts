const scene = new Scene({ name: "foobar" });

// @ts-expect-error - A WallDocument requires data.
new WallDocument();

// @ts-expect-error - A WallDocument requires a c (coordinates) property.
new WallDocument({});

new WallDocument({ c: [0, 0, 0, 0] });
new WallDocument({ c: [0, 0, 0, 0] }, { parent: scene });
