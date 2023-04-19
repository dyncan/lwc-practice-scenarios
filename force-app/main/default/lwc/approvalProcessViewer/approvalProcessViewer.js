import { LightningElement } from "lwc";
import { ACCOUNT_COLUMNS, OPPORTUNITY_COLUMNS, CASE_COLUMNS } from "./utils";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getApprovalHistories from "@salesforce/apex/ApprovalProcessViewerController.getApprovalHistories";

export default class ApprovalProcessViewer extends LightningElement {
  cases; // the list of case records with their respective approval history data
  accounts; // the list of account records with their respective approval history data
  opportunities; // the list of opportunity records with their respective approval history data
  accountColumns = ACCOUNT_COLUMNS;
  oppColumns = OPPORTUNITY_COLUMNS;
  caseColumns = CASE_COLUMNS;

  connectedCallback() {
    // fetch all records and their respective approval history data asynchronously
    Promise.all([
      this.getAccountApprovalHistories(),
      this.getOpportunityApprovalHistories(),
      this.getCaseApprovalHistories()
    ])
      .then(() => this.showToast("success", "Data loaded successfully!"))
      .catch((error) => {
        console.error(error);
        this.showToast("error", "An error occurred while fetching the data");
      });
  }

  // method to fetch and rebuild account records with approval history data
  async getAccountApprovalHistories() {
    const fields = ["Id", "Name", "BillingCity", "Phone"];
    let results = await getApprovalHistories({
      sObjectName: "Account",
      fields
    });
    this.accounts = this.rebuildDataList(results, [
      "Name",
      "Id",
      "BillingCity",
      "Phone"
    ]);
  }

  // method to fetch and rebuild opportunity records with approval history data
  async getOpportunityApprovalHistories() {
    const fields = ["Id", "Name", "StageName", "Amount", "Type"];
    let results = await getApprovalHistories({
      sObjectName: "Opportunity",
      fields
    });
    this.opportunities = this.rebuildDataList(results, [
      "Id",
      "Name",
      "StageName",
      "Amount",
      "Type"
    ]);
  }

  // method to fetch and rebuild case records with approval history data
  async getCaseApprovalHistories() {
    const fields = [
      "Id",
      "AccountId",
      "Account.Name",
      "OwnerId",
      "Owner.Name",
      "CaseNumber",
      "Subject"
    ];
    let results = await getApprovalHistories({
      sObjectName: "Case",
      fields
    });
    this.cases = this.rebuildDataList(results, [
      "Id",
      "AccountId",
      "Owner.Name",
      "CaseNumber",
      "Subject",
      "Account.Name",
      "OwnerId"
    ]);
  }

  // method to rebuild the list of records with their respective approval history data
  rebuildDataList(results, keys) {
    return results.map((result) => {
      const obj = {};
      keys.forEach((key) => {
        if (key.includes(".")) {
          // if the key contains a ".", split it and create nested objects as necessary
          const [parentKey, childKey] = key.split(".");
          obj[key.toLowerCase()] = result.obj[parentKey][childKey];
        } else {
          obj[key.toLowerCase()] = result.obj[key];
        }
      });
      return {
        ...obj,
        _children: result.processSteps
      };
    });
  }

  downloadCSVFile(event) {
    let rowEnd = "\n";
    let csvString = "";
    // this set elminates the duplicates if have any duplicate keys
    let rowData = new Set();

    const dataMap = {
      account: this.accounts,
      opportunity: this.opportunities,
      case: this.cases
    };

    let data = dataMap[event.target.dataset.type];

    // getting keys from data
    data.forEach(function (record) {
      Object.keys(record).forEach(function (key) {
        if (key != "_children") {
          rowData.add(key);
        }
      });
    });

    // Array.from() method returns an Array object from any object with a length property or an iterable object.
    rowData = Array.from(rowData);

    // splitting using ','
    csvString += rowData.join(",");
    csvString += rowEnd;

    // main for loop to get the data based on key value
    for (let i = 0; i < data.length; i++) {
      let colValue = 0;

      // validating keys in data
      for (let key in rowData) {
        if (rowData.hasOwnProperty(key)) {
          // Key value
          // Ex: Id, Name
          let rowKey = rowData[key];
          // add , after every value except the first.
          if (colValue > 0) {
            csvString += ",";
          }
          // If the column is undefined, it as blank in the CSV file.
          let value = data[i][rowKey] === undefined ? "" : data[i][rowKey];
          csvString += '"' + value + '"';
          colValue++;
        }
      }
      csvString += rowEnd;
    }

    // Creating anchor element to download
    let downloadElement = document.createElement("a");

    // This  encodeURI encodes special characters, except: , / ? : @ & = + $ # (Use encodeURIComponent() to encode these characters).
    downloadElement.href =
      "data:text/csv;charset=utf-8," + encodeURI(csvString);
    downloadElement.target = "_self";
    // CSV File Name
    downloadElement.download = `${event.target.dataset.type}.csv`;
    // below statement is required if you are using firefox browser
    document.body.appendChild(downloadElement);
    // click() Javascript function to download CSV file
    downloadElement.click();
  }

  showToast(variant, message) {
    const event = new ShowToastEvent({
      title: "Approval Process Viewer!",
      message: message,
      variant: variant
    });
    this.dispatchEvent(event);
  }
}
