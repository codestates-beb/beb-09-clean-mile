import Head from "next/head";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { UserDNFT } from "src/components/users/user-dnft";
import { UserWallet } from "src/components/users/user-wallet";
import { UserDetails } from "src/components/users/user-details";
import { PostsTable } from "src/components/posts/posts-table";
import { CommentsTable } from "src/components/comments/comments-table";
import { EventsTable } from "src/components/events/events-table";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useState } from "react";

const Page = () => {
  const [tabNum, setTabNum] = useState("1");

  const router = useRouter();
  const { id } = router.query;

  const handleTabChange = (event, value) => {
    setTabNum(value);
  };

  return (
    <>
      <Head>
        <title>User</title>
      </Head>
      <Box
        sx={{
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Stack direction={"row"} justifyContent="space-between" spacing={3}>
              <Typography variant="h4">User</Typography>
              <Stack direction={"row"} spacing={1}>
                <Button variant="contained" color="warning">
                  Delete
                </Button>
                <Button variant="contained" onClick={() => router.back()}>
                  Back
                </Button>
              </Stack>
            </Stack>
            <TabContext value={tabNum}>
              <TabList onChange={handleTabChange}>
                <Tab label="Profile" value="1" />
                <Tab label="Wallet" value="2" />
                <Tab label="DNFT" value="3" />
                <Tab label="Events" value="4" />
                <Tab label="Posts" value="5" />
                <Tab label="Comments" value="6" />
              </TabList>
              <TabPanel value={"1"}>
                <UserDetails />
              </TabPanel>
              <TabPanel value={"2"}>
                <UserWallet />
              </TabPanel>
              <TabPanel value={"3"}>
                <UserDNFT />
              </TabPanel>
              <TabPanel value={"4"}>
                <EventsTable />
              </TabPanel>
              <TabPanel value={"5"}>
                <PostsTable />
              </TabPanel>
              <TabPanel value={"6"}>
                <CommentsTable />
              </TabPanel>
            </TabContext>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
