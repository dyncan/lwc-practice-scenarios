const ACCOUNT_COLUMNS = [
  {
    type: "url",
    fieldName: "id",
    label: "Name",
    typeAttributes: {
      label: {
        fieldName: "name"
      }
    }
  },
  {
    type: "text",
    fieldName: "billingcity",
    label: "Billing City"
  },
  {
    type: "text",
    fieldName: "phone",
    label: "Phone"
  },
  {
    label: "Step Name",
    fieldName: "stepUrl",
    type: "url",
    typeAttributes: {
      label: {
        fieldName: "stepName"
      }
    }
  },
  {
    label: "Date",
    fieldName: "createdDate",
    type: "date",
    typeAttributes: {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric"
    }
  },

  { label: "Status", fieldName: "stepStatus" },
  {
    label: "Assigned To",
    fieldName: "assignedToUrl",
    type: "url",
    typeAttributes: {
      label: {
        fieldName: "assignedTo"
      }
    }
  },
  {
    type: "text",
    fieldName: "comments",
    label: "Comments"
  }
];

const OPPORTUNITY_COLUMNS = [
  {
    type: "url",
    fieldName: "id",
    label: "Name",
    typeAttributes: {
      label: {
        fieldName: "name"
      }
    }
  },
  {
    type: "text",
    fieldName: "stagename",
    label: "Stage"
  },
  {
    type: "number",
    fieldName: "amount",
    label: "Amount"
  },
  {
    type: "text",
    fieldName: "type",
    label: "Type"
  },
  {
    label: "Step Name",
    fieldName: "stepUrl",
    type: "url",
    typeAttributes: {
      label: {
        fieldName: "stepName"
      }
    }
  },
  {
    label: "Date",
    fieldName: "createdDate",
    type: "date",
    typeAttributes: {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric"
    }
  },

  { label: "Status", fieldName: "stepStatus" },
  {
    label: "Assigned To",
    fieldName: "assignedToUrl",
    type: "url",
    typeAttributes: {
      label: {
        fieldName: "assignedTo"
      }
    }
  },
  {
    type: "text",
    fieldName: "comments",
    label: "Comments"
  }
];

const CASE_COLUMNS = [
  {
    type: "url",
    fieldName: "id",
    label: "Case Number",
    typeAttributes: {
      label: {
        fieldName: "casenumber"
      }
    }
  },
  {
    type: "text",
    fieldName: "subject",
    label: "Subject"
  },
  {
    type: "url",
    fieldName: "accountid",
    label: "Account",
    typeAttributes: {
      label: {
        fieldName: "account.name"
      }
    }
  },
  {
    type: "url",
    fieldName: "ownerid",
    label: "Owner",
    typeAttributes: {
      label: {
        fieldName: "owner.name"
      }
    }
  },
  {
    label: "Step Name",
    fieldName: "stepUrl",
    type: "url",
    typeAttributes: {
      label: {
        fieldName: "stepName"
      }
    }
  },
  {
    label: "Date",
    fieldName: "createdDate",
    type: "date",
    typeAttributes: {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric"
    }
  },

  { label: "Status", fieldName: "stepStatus" },
  {
    label: "Assigned To",
    fieldName: "assignedToUrl",
    type: "url",
    typeAttributes: {
      label: {
        fieldName: "assignedTo"
      }
    }
  },
  {
    type: "text",
    fieldName: "comments",
    label: "Comments"
  }
];

export { ACCOUNT_COLUMNS, OPPORTUNITY_COLUMNS, CASE_COLUMNS };
