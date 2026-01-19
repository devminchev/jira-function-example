import { AppActionRequest, FunctionEventContext, FunctionEventHandler, FunctionTypeEnum } from "@contentful/node-apps-toolkit";
import { fetchGameDetail, fetchGamesList } from "./apis/externalGameMetadataApi.js";
import { updateRequestGamePayload, updateRequestSiteGamePayload } from "./utils/entryBuilder.js";

export async function fetchGameDetail(host: string, launchCode: string) {
  const res = await fetch(`${host}/api/games/details/${launchCode}`, {
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) {
    const error = await res.json();
    const errMessage = `Game Details Source API : ${res.status}-${error.message}`;
    console.error(errMessage);

    throw new Error(errMessage);
  };
  return res.json();
};

export const fetchJiraBoardActionHandler: FunctionEventHandler<FunctionTypeEnum.AppActionCall> = async (event: AppActionRequest, context: FunctionEventContext) => {
  const { appInstallationParameters } = context;
  const cma = context.cma!;
  const { body: { queryParams, entry } } = event as any;

  // const siteGameEntry = JSON.parse(entry);
  const params = JSON.parse(queryParams);
  const queryString = new URLSearchParams(params).toString();

  console.log('params : ', params);
  console.log('params : ', params);
  console.log('query string : ', queryString);
  try {
    const apiBaseUrl = 'https://' + appInstallationParameters['externalApiBaseUrl'];
    const res = await fetch(`${apiBaseUrl}/api/}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic MTI3ODE3NzE2ODk0OlI7TOl4Ksn9eiEDs4g6aBeF0nTE`
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
