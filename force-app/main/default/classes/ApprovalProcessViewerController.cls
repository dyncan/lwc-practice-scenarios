public with sharing class ApprovalProcessViewerController {
  private static final String PROCESS_INSTANCE_QUERY = 'SELECT Id, SubmittedById, TargetObjectId, ProcessDefinition.Name, (SELECT ID, ProcessNodeId, StepStatus, Comments, TargetObjectId, ActorId, CreatedById, IsDeleted, IsPending, OriginalActorId, ProcessInstanceId, RemindersSent, CreatedDate, Actor.Name, OriginalActor.Name, ProcessNode.Name FROM StepsAndWorkitems ORDER BY IsPending DESC, CreatedDate DESC) FROM ProcessInstance ORDER BY CreatedDate DESC';

  @AuraEnabled(cacheable=true)
  public static List<ApprovalHistory> getApprovalHistories(
    String sObjectName,
    List<String> fields
  ) {
    List<ApprovalHistory> approvalHistoryLst = new List<ApprovalHistory>();

    List<SObject> records = buildDynamicQuery(sObjectName, fields);

    Map<String, List<ProcessInstance>> processInstanceMap = getProcessInstanceMap();

    for (SObject sobj : records) {
      String recordId = (String) sobj.get('Id');
      if (processInstanceMap.get(recordId) != null) {
        ApprovalHistory approval = ApprovalProcessUtil.populateApprovalHistorySteps(
          processInstanceMap.get(recordId),
          sobj
        );
        approvalHistoryLst.add(approval);
      }
    }
    return approvalHistoryLst;
  }

  private static Map<String, List<ProcessInstance>> getProcessInstanceMap() {
    List<ProcessInstance> processInstances = Database.query(
      PROCESS_INSTANCE_QUERY
    );

    Map<String, List<ProcessInstance>> processInstanceMap = new Map<String, List<ProcessInstance>>();
    for (ProcessInstance pi : processInstances) {
      String targetObjectId = pi.TargetObjectId;
      if (!processInstanceMap.containsKey(targetObjectId)) {
        processInstanceMap.put(targetObjectId, new List<ProcessInstance>());
      }
      processInstanceMap.get(targetObjectId).add(pi);
    }
    return processInstanceMap;
  }

  private static List<SObject> buildDynamicQuery(
    String sObjectName,
    List<String> fieldList
  ) {
    String query =
      'SELECT ' +
      String.join(fieldList, ',') +
      ' FROM ' +
      sObjectName +
      ' WITH USER_MODE';

    return (List<SObject>) Database.query(String.escapeSingleQuotes(query));
  }

  public class ApprovalHistory {
    @AuraEnabled
    public SObject obj { get; set; }
    @AuraEnabled
    public List<ApprovalHistoryStep> processSteps { get; set; }

    public ApprovalHistory(
      SObject obj,
      List<ApprovalHistoryStep> approvalSteps
    ) {
      this.obj = obj;
      this.processSteps = approvalSteps;
    }
  }

  public class ApprovalHistoryStep {
    @AuraEnabled
    public String stepName { get; set; }
    @AuraEnabled
    public String stepUrl { get; set; }
    @AuraEnabled
    public DateTime createdDate { get; set; }
    @AuraEnabled
    public String stepStatus { get; set; }
    @AuraEnabled
    public String assignedTo { get; set; }
    @AuraEnabled
    public String assignedToUrl { get; set; }
    @AuraEnabled
    public String comments { get; set; }

    public ApprovalHistoryStep(
      String stepName,
      String stepId,
      DateTime createdDate,
      String stepStatus,
      String assignedTo,
      String assignedToId,
      String comments
    ) {
      this.stepName = stepName;
      this.stepUrl = '/' + stepId;
      this.createdDate = createdDate;
      this.assignedTo = assignedTo;
      this.assignedToUrl = '/' + assignedToId;
      this.comments = comments;

      if (stepStatus == ApprovalProcessUtil.STATUS_STARTED) {
        this.stepStatus = ApprovalProcessUtil.STATUS_SUBMITTED;
      } else if (stepStatus == ApprovalProcessUtil.STATUS_REMOVED) {
        this.stepStatus = ApprovalProcessUtil.STATUS_RECALLED;
      } else {
        this.stepStatus = stepStatus;
      }
    }
  }
}
