public with sharing class TransactionController {
  @SuppressWarnings('PMD.ApexCRUDViolation')
  @AuraEnabled(cacheable=true)
  public static List<Bank_Info__mdt> getSuccessCodeMessages() {
    return [
      SELECT Id, Success_Code__c, Message__c
      FROM Bank_Info__mdt
      WITH USER_MODE
    ];
  }
}
