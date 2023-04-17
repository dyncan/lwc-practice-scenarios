import { LightningElement } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getSuccessCodeMessages from "@salesforce/apex/TransactionController.getSuccessCodeMessages";

export default class TransactionForm extends LightningElement {
  // Transaction object API name
  objectApiName = "Transaction__c";

  successCodeMessages = [];
  message;

  // Fetch all success messages on component initialization
  connectedCallback() {
    this.fetchSuccessMessages();
  }

  // Fetch all success messages from custom metadata and store them in successMessages array
  fetchSuccessMessages() {
    let messages = [];
    getSuccessCodeMessages()
      .then((result) => {
        result.forEach((record) => {
          let message = {
            value: record.Success_Code__c,
            label: record.Message__c
          };
          messages.push(message);
        });
        this.successCodeMessages = messages;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Handle success code change event
  handleSuccessCodeChange(event) {
    let value = event.target.value;
    this.selectedMessage = this.successCodeMessages.find(
      (message) => message.value === value
    );
    this.message = this.selectedMessage?.label;
  }

  // Handle record form submission
  handleSubmit(event) {
    event.preventDefault();
    const fields = event.detail.fields;
    if (this.message) {
      fields.Message__c = this.message;
    }
    this.template.querySelector("lightning-record-edit-form").submit(fields);
  }

  // 创建记录成功后触发
  handleSuccess(event) {
    const transId = event.detail.id;
    this.handleSuccessEvt(transId);
    this.handleReset();
  }

  handleSuccessEvt(data) {
    const event = new ShowToastEvent({
      title: "Success!",
      message: "{0} Record created! See it {1}!",
      variant: "success",
      messageData: [
        "Transaction",
        {
          url: `/${data}`,
          label: "here"
        }
      ]
    });
    this.dispatchEvent(event);
  }

  handleReset() {
    const inputFields = this.template.querySelectorAll("lightning-input-field");
    if (inputFields) {
      inputFields.forEach((field) => {
        field.reset();
      });
    }
  }
}
