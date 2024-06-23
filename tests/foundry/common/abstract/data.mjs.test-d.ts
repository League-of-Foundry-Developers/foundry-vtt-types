declare const myItem: foundry.documents.BaseItem;

myItem.updateSource({ img: "newPath" });
//@ts-expect-error foo isn't a valid path
myItem.updateSource({ foo: "bar" });
