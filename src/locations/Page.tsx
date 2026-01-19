import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useSDK } from '@contentful/react-apps-toolkit';
import { Badge, Button, Checkbox, Flex, FormControl, Heading, List, MenuDivider, Select, Stack, Text } from '@contentful/f36-components';
import useSyncAction from '../hooks/useSyncAction';


const Page = () => {
    const { cma: { entry: contentfulClient }, locales: { default: spaceLocale }, notifier, parameters } = useSDK();
    const { actionInProgress, onSyncAction } = useSyncAction();
    const [isLoading, setIsLoading] = useState(false);
    const [queryProgress, setQueryProgress] = useState<number>(0);
    const [siteGamesWithHeadlessJackpot, setSiteGamesWithHeadlessJackpot] = useState<any[]>([]);

    const fetchJiraData = async () => {
        setIsLoading(true);
        try {
            // const { data } = await axios.get(`https://jira.gamesys.co.uk/rest/api/2/search`, {
            //     headers: { Authorization: `Bearer xxx` },
            //     params: { site: siteMap(selectedVenture.name), jackpotId: selectedJackpot.id }
            // });

            // setJiraIssues(data.issues);
            // notifier.success('Jira issues fetched successfully.');
        } catch (error) {
            console.log(JSON.stringify(error));
            console.error('Failed to fetch Jira issues:', error);
            notifier.error('Failed to fetch Jira issues.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // loadVentures();
    }, []);

    useEffect(() => {

    }, []);

    return (
        <>
            <Heading>Bulk Activation Headless Jackpots</Heading>

            <Stack fullWidth justifyContent='center' flexDirection="column">
                <Button variant='primary' isFullWidth onClick={() => onSyncAction()} isDisabled={actionInProgress}>
                    <Text fontColor="colorWhite" fontWeight="fontWeightMedium">Action Fetch JIRA Data</Text>
                </Button>
                <Button variant='secondary' isFullWidth onClick={fetchJiraData} isDisabled={isLoading}>
                    <Text fontColor="colorWhite" fontWeight="fontWeightMedium">UI Fetch JIRA Data</Text>
                </Button>
            </Stack>
        </>
    );
};

export default Page;
