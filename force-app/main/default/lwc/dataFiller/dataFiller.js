import { LightningElement, wire } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import PASS_DATA_CHANNEL from "@salesforce/messageChannel/Record_Pass__c";

export default class DataFiller extends LightningElement {
  name;
  phone;
  country;

  // Handle changes to the name input field
  handleNameChange(event) {
    this.name = event.target.value;
  }

  // Handle changes to the phone input field
  handlePhoneChange(event) {
    this.phone = event.target.value;
  }

  // Handle changes to the country input field
  handleCountryChange(event) {
    this.country = event.target.value;
  }

  @wire(MessageContext)
  messageContext;

  // Handle button click event, create a new message payload and publish it to the message channel
  handleButtonClick() {
    const messagePayload = {
      id: this.uuidv4(), // Generate a new unique ID for the message
      name: this.name,
      phone: this.phone,
      country: this.country
    };

    // The message payload to be published
    publish(this.messageContext, PASS_DATA_CHANNEL, {
      passData: messagePayload
    });
  }

  // Generate a new unique ID using crypto.getRandomValues()
  uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }
}
