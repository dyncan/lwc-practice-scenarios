import { LightningElement } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class PublicApiCallout extends LightningElement {
  activity; // variable to store the fetched activity
  isLoading = false; // loading flag to indicate if data is being fetched

  // handle any errors that may occur during the fetch request
  handleError() {
    const event = new ShowToastEvent({
      title: "Error",
      message: "An error occurred while fetching the data",
      variant: "error"
    });
    this.dispatchEvent(event);
  }

  // method to fetch a random activity from a public API
  async getRandomActivity() {
    try {
      this.isLoading = true;
      const response = await fetch("https://www.boredapi.com/api/activity");
      // handle the response from the API
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // store the fetched activity
      const data = await response.json();
      this.activity = data;
    } catch (error) {
      this.handleError();
    } finally {
      this.isLoading = false;
    }
  }
}
