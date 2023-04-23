import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { createRecord } from "lightning/uiRecordApi";
import { reduceErrors } from "c/ldsUtils";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import CONTACT_OBJECT from "@salesforce/schema/Contact";
import NAME_FIELD from "@salesforce/schema/Account.Name";
import WEB_SITE_FIELD from "@salesforce/schema/Account.Website";
import ACCOUNT_ID from "@salesforce/schema/Contact.AccountId";
import PHONE_FIELD from "@salesforce/schema/Contact.Phone";
import FIRST_NAME_FIELD from "@salesforce/schema/Contact.FirstName";
import LAST_NAME_FIELD from "@salesforce/schema/Contact.LastName";
import EMAIL_FIELD from "@salesforce/schema/Contact.Email";
import CONTENT_DOCUMENT_LINK_OBJECT from "@salesforce/schema/ContentDocumentLink";
import LINKED_ENTITY_ID_FIELD from "@salesforce/schema/ContentDocumentLink.LinkedEntityId";
import CONTENT_DOCUMENT_ID_FIELD from "@salesforce/schema/ContentDocumentLink.ContentDocumentId";

export default class AccountCreation extends NavigationMixin(LightningElement) {
  accountName;
  accountWebsite;
  contactFirstName;
  contactLastName;
  contactEmail;
  contactPhoneNumber;
  uploadedFilesContentDocumentIds = [];
  isLoading = false;

  // Define accepted file formats for file upload component
  get acceptedFormats() {
    return [".pdf", ".png", ".jpg", ".xlsx", ".xls", ".csv", ".doc", ".docx"];
  }

  // Handle input field changes
  handleFiledChange(event) {
    this[event.target.name] = event.target.value;
  }

  // Handle file upload
  handleUploadFinished(event) {
    const uploadedFiles = event.detail.files;
    uploadedFiles.forEach((file) => {
      this.uploadedFilesContentDocumentIds.push(file.documentId);
    });
  }

  // Handle save button click
  handleSave(event) {
    const type = event.target.dataset.type;
    this.isLoading = true;

    // Create account record
    const fields = {};
    fields[NAME_FIELD.fieldApiName] = this.accountName;
    fields[WEB_SITE_FIELD.fieldApiName] = this.accountWebsite;
    const accountRecordInput = {
      apiName: ACCOUNT_OBJECT.objectApiName,
      fields
    };
    createRecord(accountRecordInput)
      .then((accountResult) => {
        // Create contact record
        const contactFields = {};
        contactFields[FIRST_NAME_FIELD.fieldApiName] = this.contactFirstName;
        contactFields[LAST_NAME_FIELD.fieldApiName] = this.contactLastName;
        contactFields[EMAIL_FIELD.fieldApiName] = this.contactEmail;
        contactFields[PHONE_FIELD.fieldApiName] = this.contactPhoneNumber;
        contactFields[ACCOUNT_ID.fieldApiName] = accountResult.id;
        const contactRecordInput = {
          apiName: CONTACT_OBJECT.objectApiName,
          fields: contactFields
        };
        createRecord(contactRecordInput)
          .then((contactResult) => {
            // Create ContentDocumentLink records (if any)
            if (this.uploadedFilesContentDocumentIds.length > 0) {
              const promises = this.uploadedFilesContentDocumentIds.map(
                (contentDocumentId) => {
                  const fields = {};
                  fields[LINKED_ENTITY_ID_FIELD.fieldApiName] =
                    contactResult.id;
                  fields[CONTENT_DOCUMENT_ID_FIELD.fieldApiName] =
                    contentDocumentId;
                  const recordInput = {
                    apiName: CONTENT_DOCUMENT_LINK_OBJECT.objectApiName,
                    fields
                  };
                  return createRecord(recordInput);
                }
              );

              Promise.all(promises)
                .then(() => {
                  this._handleNavigationByType(type, contactResult);
                })
                .catch((error) => {
                  this.handleError(error);
                })
                .finally(() => {
                  this._clearForm();
                  this.isLoading = false;
                });
            } else {
              this._handleNavigationByType(type, contactResult);
            }
          })
          .catch((error) => {
            this.handleError(error);
          })
          .finally(() => {
            this._clearForm();
            this.isLoading = false;
          });
      })
      .catch((error) => {
        this.handleError(error);
      })
      .finally(() => {
        this._clearForm();
        this.isLoading = false;
      });
  }

  // Helper method to handle navigation to view newly created record
  _handleNavigationByType(type, data) {
    if (type == "save") {
      this.handleNavigationContact(data);
    }
    if (type == "save-new") {
      this.handleSuccess(data);
    }
  }

  // Handle cancel button click
  handleCancel() {
    this._clearForm();
  }

  // Handle success toast event
  handleSuccess(data) {
    const event = new ShowToastEvent({
      title: "Success!",
      message: "{0} Record created! See it {1}!",
      variant: "success",
      messageData: [
        "",
        {
          url: `/${data.id}`,
          label: "here"
        }
      ]
    });
    this.dispatchEvent(event);
  }

  // Navigate to newly created contact record page
  handleNavigationContact(data) {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: data.id,
        objectApiName: "Contact",
        actionName: "view"
      }
    });
  }

  // Handle error toast event
  handleError(error) {
    const event = new ShowToastEvent({
      title: "An error occurred while creating the data",
      message: "Error: " + reduceErrors(error).join(","),
      variant: "error"
    });
    this.dispatchEvent(event);
  }

  // Helper method to clear form inputs
  _clearForm() {
    this.accountName = "";
    this.accountWebsite = "";
    this.contactFirstName = "";
    this.contactLastName = "";
    this.contactEmail = "";
    this.contactPhoneNumber = "";
  }
}
