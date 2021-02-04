declare class Folders extends Collection<Folder> {}

declare class Folder<EntityType = Entity> extends Entity {
  get entities(): EntityType[];
}
