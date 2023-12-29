import type { Tour } from "../core/tour.mts";

declare global {
  class SetupTour extends Tour {
    focusedApp: Application<any>;
    override get canStart(): boolean;
    override get steps(): TourStep[];
    protected override _preStep(): Promise<void>;
    private _installingASystem(): Promise<void>;
    private _creatingAWorld(): Promise<void>;
  }
}
