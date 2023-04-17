import { LightningElement } from "lwc";

export default class Calculator extends LightningElement {
  firstNumber;
  secondNumber;
  result;

  // Handle input change event
  handleInputChange(event) {
    const inputName = Object.keys(event.detail)[0];
    const inputValue = event.detail[inputName];

    // Update the corresponding property based on the input name
    if (inputName === "number1") {
      this.firstNumber = inputValue;
    } else if (inputName === "number2") {
      this.secondNumber = inputValue;
    }
  }

  // Handle addition operation
  handleAdd() {
    this.result = parseFloat(this.firstNumber) + parseFloat(this.secondNumber);
  }

  // Handle subtraction operation
  handleSubtract() {
    this.result = parseFloat(this.firstNumber) - parseFloat(this.secondNumber);
  }

  // Handle multiplication operation
  handleMultiply() {
    this.result = parseFloat(this.firstNumber) * parseFloat(this.secondNumber);
  }

  // Handle division operation
  handleDivide() {
    this.result = parseFloat(this.firstNumber) / parseFloat(this.secondNumber);
  }
}
