const myScene = new Scene({ name: "foobar" });

// @ts-expect-error - A BaseWall requires data.
new foundry.documents.BaseWall();

// @ts-expect-error - A BaseWall requires c (coordinates).
new foundry.documents.BaseWall({});

new foundry.documents.BaseWall({ c: [0, 0, 0, 0] });
new foundry.documents.BaseWall({ c: [0, 0, 0, 0] }, { parent: myScene });
