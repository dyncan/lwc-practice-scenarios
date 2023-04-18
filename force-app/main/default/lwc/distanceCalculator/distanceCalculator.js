import { LightningElement } from "lwc";
import { calculateDistance } from "./calculateDistance";

export default class DistanceCalculator extends LightningElement {
  // Variables to hold input values and distance calculation result
  lat1 = 0;
  lon1 = 0;
  lat2 = 0;
  lon2 = 0;
  distance = 0;

  /**
   * Updates component variables with new input values.
   *
   * @param {Event} event Change event object containing new input value and name.
   */
  handleInputChange(event) {
    const { name, value } = event.target;
    this[name] = value;
  }

  /**
   * Calculates the distance between two points and sets the component's distance variable.
   */
  handleClick() {
    this.distance = calculateDistance(
      {
        latitude: this.lat1,
        longitude: this.lon1
      },
      {
        latitude: this.lat2,
        longitude: this.lon2
      },
      3
    );
  }
}
