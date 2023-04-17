import { LightningElement } from "lwc";

export default class Parent extends LightningElement {
  // Declare variables
  selectedValue;
  showChildComponent = false;

  get options() {
    return [
      { label: "Show input name", value: "name" },
      { label: "Show input phone", value: "phone" },
      { label: "Show input email", value: "email" }
    ];
  }

  // Handle change event on dropdown selection
  handleChange(event) {
    this.selectedValue = event.target.value;
    // If a value is selected, set showChildComponent to true, otherwise set it to false
    this.showChildComponent = Boolean(this.selectedValue);
  }
}
