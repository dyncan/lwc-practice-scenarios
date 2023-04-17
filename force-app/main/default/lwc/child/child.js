import { LightningElement, api } from "lwc";

export default class Child extends LightningElement {
  @api selectedItem;

  // Getter to show or hide name input based on selected item
  get showNameInput() {
    return this.selectedItem === "name";
  }

  // Getter to show or hide phone input based on selected item
  get showPhoneInput() {
    return this.selectedItem === "phone";
  }

  // Getter to show or hide email input based on selected item
  get showEmailInput() {
    return this.selectedItem === "email";
  }
}
