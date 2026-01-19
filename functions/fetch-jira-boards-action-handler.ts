import { AppActionRequest, FunctionEventContext, FunctionEventHandler, FunctionTypeEnum } from "@contentful/node-apps-toolkit";

// export const fetchJiraBoardActionHandler: FunctionEventHandler<FunctionTypeEnum.AppActionCall> = async (event: AppActionRequest, context: FunctionEventContext) => {
//   const { appInstallationParameters } = context;
//   const cma = context.cma!;
//   const { body: { bearerToken, entry } } = event as any;

//   console.log('params bearerToken: ', bearerToken);
//   const jql = `project = "GRA" AND status = "Game for Review" AND issuetype = "Game"`;
//   const fields = [
//     "summary",
//     "status"
//   ].join(",");
//   const params = new URLSearchParams({
//     maxResults: "1000",
//     jql,
//     fields,
//   });
//   try {
//     const apiBaseUrl = 'https://jira.gamesys.co.uk/rest/api/2/search';
//     const url = `${apiBaseUrl}?${params.toString()}`;
//     console.log('url jira :', url);
//     console.log('URLSearchParams :', params.toString());
//     const res = await fetch(url, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${bearerToken}`,
//       },
//     });


//     if (!res.ok) {
//       const error = await res.json();
//       console.log('NOT OK:', error);
//       const errMessage = `Fetch JIRA API : ${res.status}-${error.message}`;
//       console.error(errMessage);

//       throw new Error(errMessage);
//     };
//     const data = await res.json();
//     console.log('JIRA OK:');
//     console.log('JIRA API data:', data);
//     return {
//       success: true,
//       issues: data,
//     };
//   } catch (error) {
//     console.log('JIRA errr:', error);
//     const errorMsg = `ERROR App Action - ${(error as Error).message}`;
//     console.error(errorMsg);
//     return { success: false, error: errorMsg };
//   };
// };

export const fetchJiraBoardActionHandler: FunctionEventHandler<FunctionTypeEnum.AppActionCall> = async (event: AppActionRequest, context: FunctionEventContext) => {
  const { bearerToken } = event.body ?? {};

  const jql = `project = "GRA" AND status = "Game for Review" AND issuetype = "Game"`;
  const params = new URLSearchParams({
    maxResults: "1000",
    jql,
    fields: "summary,status",
  });

  const url = `https://jira.gamesys.co.uk/rest/api/2/search?${params.toString()}`;
  console.log("jira url:", url);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${bearerToken}`, Accept: "application/json" },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const text = await res.text();
    if (!res.ok) return { success: false, error: `Jira ${res.status}: ${text}` };

    const data = JSON.parse(text);
    return { success: true, total: data.total, count: data.issues?.length ?? 0 };
  } catch (e: any) {
    clearTimeout(timeout);
    return { success: false, error: e?.name === "AbortError" ? "Jira request timed out" : String(e?.message ?? e) };
  }
};
