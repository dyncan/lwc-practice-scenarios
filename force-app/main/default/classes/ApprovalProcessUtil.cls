public with sharing class ApprovalProcessUtil {
  public static final String STATUS_SUBMITTED = 'Submitted';
  public static final String STATUS_STARTED = 'Started';
  public static final String STATUS_PENDING = 'Pending';
  public static final String STATUS_RECALLED = 'Recalled';
  public static final String STATUS_REMOVED = 'Removed';

  public static ApprovalProcessViewerController.ApprovalHistory populateApprovalHistorySteps(
    List<ProcessInstance> processInstances,
    SObject sobj
  ) {
    List<ApprovalProcessViewerController.ApprovalHistoryStep> steps = new List<ApprovalProcessViewerController.ApprovalHistoryStep>();

    ApprovalProcessViewerController.ApprovalHistory approvalHistoryToReturn = new ApprovalProcessViewerController.ApprovalHistory(
      sobj,
      steps
    );

    for (ProcessInstance pr : processInstances) {
      for (ProcessInstanceHistory step : pr.StepsAndWorkitems) {
        steps.add(
          new ApprovalProcessViewerController.ApprovalHistoryStep(
            step.ProcessNode.Name == null
              ? pr.ProcessDefinition.Name
              : step.ProcessNode.Name,
            step.Id,
            step.CreatedDate,
            step.StepStatus,
            step.Actor.Name,
            step.Actor.Id,
            step.Comments
          )
        );
      }
    }

    return approvalHistoryToReturn;
  }
}
