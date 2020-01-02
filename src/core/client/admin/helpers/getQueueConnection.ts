import {
  ConnectionHandler,
  RecordProxy,
  RecordSourceProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import {
  GQLCOMMENT_STATUS,
  GQLMODERATION_QUEUE_RL,
} from "coral-framework/schema";

export default function getQueueConnection(
  store: RecordSourceSelectorProxy | RecordSourceProxy,
  queue: GQLMODERATION_QUEUE_RL | "REJECTED",
  storyID?: string | null,
  siteID?: string | null
): RecordProxy | null {
  const root = store.getRoot();
  if (queue === "REJECTED") {
    return ConnectionHandler.getConnection(root, "RejectedQueue_comments", {
      status: GQLCOMMENT_STATUS.REJECTED,
      storyID,
      siteID,
    });
  }
  const queuesRecord = root.getLinkedRecord("moderationQueues", {
    storyID,
    siteID,
  })!;
  if (!queuesRecord) {
    return undefined;
  }

  const queueRecord = queuesRecord.getLinkedRecord(queue.toLowerCase());
  if (!queueRecord) {
    return undefined;
  }
  return ConnectionHandler.getConnection(queueRecord, "Queue_comments");
}
