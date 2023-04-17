import { LightningElement, wire } from "lwc";
import { subscribe, MessageContext } from "lightning/messageService";
import PASS_DATA_CHANNEL from "@salesforce/messageChannel/Record_Pass__c";

const COLUMNS = [
  // Configuration for each column in the table
  { label: "Name", fieldName: "name" },
  { label: "Phone", fieldName: "phone" },
  { label: "Country", fieldName: "country" }
];

export default class PersonTable extends LightningElement {
  data = []; // Data displayed in the table
  columns = COLUMNS; // Column configuration for the table

  @wire(MessageContext)
  messageContext;

  // Subscribe to the message channel and call handleMessage method when a new message arrives
  subscribeToMessageChannel() {
    this.subscription = subscribe(
      this.messageContext,
      PASS_DATA_CHANNEL,
      (message) => {
        this.handleMessage(message);
      }
    );
  }

  // Subscribe to the message channel when the component is connected to the DOM
  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  // Handle the received message from the message channel and update the data displayed in the table
  handleMessage(message) {
    this.data = [...this.data, message.passData];
  }
}
