import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Container, Stack, Typography, Button, Tab } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { UserDNFT } from "src/components/users/user-dnft";
import { UserWallet } from "src/components/users/user-wallet";
import { UserDetails } from "src/components/users/user-details";
import { PostsTable } from "src/components/posts/posts-table";
import { CommentsTable } from "src/components/comments/comments-table";
import { EventsTable } from "src/components/events/events-table";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useState, useEffect } from "react";
import axios from "axios";

const Page = () => {
  const [tabNum, setTabNum] = useState("1");
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [events, setEvents] = useState([]);
  const [dnft, setDNFT] = useState({});

  const router = useRouter();
  const { id } = router.query;

  const handleTabChange = (event, value) => {
    setTabNum(value);
  };

  const searchUser = async (id) => {
    try {
      const res = await axios.get(`http://localhost:7000/admin/users/detail/${id}`, {
        withCredentials: true,
      });

      if (!res || res.status !== 200) {
        throw new Error("Invalid response");
      }

      const data = res.data;

      if (data && data.data) {
        const userData = data.data.user;
        const postsData = data.data.posts;
        const commentsData = data.data.comments;
        const eventsData = data.data.events;
        // const dnftData = data.data.dnft;

        console.log(userData, postsData, commentsData, eventsData);

        if (userData) {
          setUser(userData);
        }

        if (postsData) {
          setPosts(postsData);
        }

        if (commentsData) {
          setComments(commentsData);
        }

        if (eventsData) {
          setEvents(eventsData);
        }

        // TODO: DNFT
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      searchUser(id);
    }
  }, [id]);

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
                <UserDetails user={user} />
              </TabPanel>
              <TabPanel value={"2"}>
                <UserWallet wallet={user.wallet} />
              </TabPanel>
              <TabPanel value={"3"}>
                <UserDNFT dnft={dnft} />
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
