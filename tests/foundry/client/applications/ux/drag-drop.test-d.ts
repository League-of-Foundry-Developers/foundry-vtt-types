export {};

declare const element: HTMLElement;

const dragDrop = new foundry.applications.ux.DragDrop({});

dragDrop.bind(element);
