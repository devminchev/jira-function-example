import { FunctionEventHandler } from '@contentful/node-apps-toolkit';
import { fetchJiraBoardActionHandler } from "./fetch-jira-baoards-action-handler";

export const handler: FunctionEventHandler = async (event, context) => {
  switch (event.type) {
    case 'appaction.call':
      return fetchJiraBoardActionHandler(event, context);
    default:
      throw new Error(`Unsupported event type: ${event.type}`);
  }
};
