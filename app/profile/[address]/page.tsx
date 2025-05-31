'use client';

export interface ProfilePageProps {
  params: {
    address: string;
  };
}

import {
  Container,
  Divider,
  HStack,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  theme,
} from '@chakra-ui/react';
import { useState } from 'react';

import Back from 'components/Back';
import ProfileHeader from 'layout/Profile/ProfileHeader';
import ProfileNFTs from 'layout/Profile/ProfileNFTs';
import ProfileTickets from 'layout/Profile/ProfileTickets';

interface ListTabProps {
  key: 'My NFTs' | 'My Tickets';
  panel: JSX.Element;
}

export default ({ params }: ProfilePageProps) => {
  const [tab, setTab] = useState<ListTabProps['key']>('My NFTs');

  const ListTab: ListTabProps[] = [
    {
      key: 'My NFTs',
      panel: <ProfileNFTs params={params} />,
    },
    {
      key: 'My Tickets',
      panel: <ProfileTickets params={params} />,
    },
  ];

  const getPanel = ListTab.find(meta => meta.key === tab);
  const getIndex = ListTab.findIndex(meta => meta.key === tab);

  return (
    <Container maxWidth={theme.breakpoints.xl} my={6}>
      <Stack spacing={8}>
        <Back />

        <ProfileHeader params={params} />

        <Divider bg="shader.a.500" width="full" height="0.0625rem" />

        <Tabs
          index={getIndex}
          tabIndex={getIndex}
          onChange={value => {
            const findKey = ListTab.find((_, index) => index === value);

            if (findKey) setTab(findKey.key);
          }}
        >
          <TabList>
            <HStack>
              {ListTab.map(meta => (
                <Tab
                  key={meta.key}
                  width="fit-content"
                  px={6}
                  borderRadius="lg"
                  height={10}
                  transitionDuration="slow"
                  bg={
                    getPanel?.key === meta.key ? 'shader.a.500' : 'shader.a.800'
                  }
                  _hover={{
                    bg: 'shader.a.500',
                  }}
                >
                  {meta.key}
                </Tab>
              ))}
            </HStack>
          </TabList>

          <TabPanels mt={4}>
            {ListTab.map(meta => (
              <TabPanel key={meta.key}>
                {meta.key === getPanel?.key ? getPanel.panel : null}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  );
};
