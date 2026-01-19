import { useState } from 'react';
import { CreateAppActionCallProps, CreateWithResponseParams } from 'contentful-management';
import { useSDK } from '@contentful/react-apps-toolkit';
import { SidebarAppSDK } from '@contentful/app-sdk';

function useSyncAction() {
    const { cma, ids, notifier } = useSDK<SidebarAppSDK>();
    const [actionInProgress, setActionInProgress] = useState(false);

    async function onSyncAction() {
        try {
            setActionInProgress(true);
            const actionCallResponse = await cma.appActionCall.createWithResponse(
                {
                    appActionId: "jiraFetchAction",
                    appDefinitionId: ids.app,
                    retries: 1,
                } as CreateWithResponseParams,
                {
                    parameters: {
                        queryParams: JSON.stringify({
                            basicToken: 'MTI3ODE3NzE2ODk0OlI7TOl4Ksn9eiEDs4g6aBeF0nTE'
                        }),
                    },
                } as CreateAppActionCallProps
            );
            console.log('action call response : ', actionCallResponse);
            const response = JSON.parse(actionCallResponse.response.body);

            console.log('action call parsed response : ', response);
            if (!response.success) {
                throw new Error(response.error);
            };

            switch (response.data.code) {
                case "UPDATE_SYNC_SUCCESS":
                    notifier.success(response.data.message);
                    break;
                case "RESET_SYNC_SUCCESS":
                    notifier.success(response.data.message);
                    break;
                case "SYNC_NOT_REQUIRED_SUCCESS":
                    notifier.warning(response.data.message);
                    break;
                default:
                    notifier.warning(response.data.message);
            };
        } catch (error) {
            console.log(error as any);
            notifier.error((error as any).message);
        } finally {
            setActionInProgress(false);
        };
    };

    return { actionInProgress, onSyncAction };
};

export default useSyncAction;
