declare class Tile extends PlaceableObject {
  get bounds(): NormalizedRectangle;

  draw(): Promise<PlaceableObject>;

  refresh(): PlaceableObject;
}
