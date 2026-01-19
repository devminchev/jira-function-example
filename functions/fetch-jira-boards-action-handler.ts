import { AppActionRequest, FunctionEventContext, FunctionEventHandler, FunctionTypeEnum } from "@contentful/node-apps-toolkit";

export const fetchJiraBoardActionHandler: FunctionEventHandler<FunctionTypeEnum.AppActionCall> = async (event: AppActionRequest, context: FunctionEventContext) => {
  const { appInstallationParameters } = context;
  const cma = context.cma!;
  const { body: { bearerToken, entry } } = event as any;

  // const siteGameEntry = JSON.parse(entry);
  // const queryString = new URLSearchParams(params).toString();

  console.log('params bearerToken: ', bearerToken);
  // console.log('query string : ', queryString);
  try {
    const apiBaseUrl = 'https://jira.gamesys.co.uk/rest/api/2/search';
    const res = await fetch(`${apiBaseUrl}/}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`
      }
    });
    if (!res.ok) {
      const error = await res.json();
      const errMessage = `Game Details Source API : ${res.status}-${error.message}`;
      console.error(errMessage);

      throw new Error(errMessage);
    };

    return res.json();

  } catch (error) {
    const errorMsg = `${`ERROR App Action - ${(error as Error).message}`}`;
    console.error(errorMsg);

    return { success: false, error: errorMsg };
  };
};
