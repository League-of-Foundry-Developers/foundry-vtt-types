declare class Wall extends PlaceableObject {
  get bounds(): NormalizedRectangle;

  draw(): Promise<PlaceableObject>;

  refresh(): PlaceableObject;
}
