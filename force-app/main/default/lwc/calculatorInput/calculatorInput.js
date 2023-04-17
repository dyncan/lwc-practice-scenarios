import { LightningElement } from "lwc";

export default class CalculatorInput extends LightningElement {
  handleInputChange(event) {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    // Dispatch a custom event to pass the input values to parent component
    this.dispatchEvent(
      new CustomEvent("numberchange", { detail: { [inputName]: inputValue } })
    );
  }
}
