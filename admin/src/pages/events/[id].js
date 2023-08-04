import Head from "next/head";
import { Box, Container, Stack, Typography, Button, Tab } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";
import { useCallback, useState, useEffect } from "react";
import { EventDetails } from "src/components/events/event-details";
import { EventBadge } from "src/components/events/event-badge";
import { EventHost } from "src/components/events/event-host";
import { EventBadgeMintForm } from "src/components/events/event-badge-mint-form";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { EventEntryTable } from "src/components/events/event-entry-table";
import { EventQRCodeLoader } from "src/components/events/event-qr-code-loader";
import axios from "axios";

const Page = () => {
  const [host, setHost] = useState(null);
  const [event, setEvent] = useState(null);
  const [badge, setBadge] = useState(null);
  const [entries, setEntries] = useState([]);
  const [entryPage, setEntryPage] = useState(1);
  const [entryPageCount, setEntryPageCount] = useState(1);

  const [tabNum, setTabNum] = useState("1");

  const router = useRouter();

  const { id } = router.query;

  const eventDetails = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8080/admin/events/detail/${id}`, {
        withCredentials: true,
      });

      if (res && res.status === 200) {
        const data = res.data;

        if (data && data.data) {
          const eventData = data.data.event;
          const badgeData = data.data.badge;

          if (!eventData) {
            throw new Error("Invalid response");
          }

          const hostData = eventData.host_id;

          if (!hostData) {
            throw new Error("Invalid response");
          }

          console.log(eventData, badgeData, hostData);

          delete eventData.host_id;

          setHost(hostData);
          setEvent(eventData);
          setBadge(badgeData);
        } else {
          throw new Error(data.message ? data.message : "Invalid response");
        }
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.log(error);
      setHost(null);
      setEvent(null);
      setBadge(null);
    }
  }, []);

  const eventEntries = useCallback(async () => {
    try {
      const params = {};
      params.page = entryPage;

      const res = await axios.get(`http://localhost:8080/admin/events/detail/entry/${id}`, {
        withCredentials: true,
      });

      if (res && res.status === 200) {
        const data = res.data;

        if (data && data.data) {
          const entriesData = data.data.data;
          const pagination = data.data.pagination;

          console.log(entriesData, pagination);

          if (!entriesData) {
            setEntries([]);
            setEntryPageCount(1);
            setEntryPage(1);
            return;
          }

          setEntries(entriesData);

          if (pagination) {
            setEntryPageCount(pagination.totalPages);
            setEntryPage(pagination.currentPage);
          }
        } else {
          throw new Error("Invalid response");
        }
      }
    } catch (error) {
      console.log(error);
      setEntries([]);
    }
  }, []);

  const handleEntryPageChange = useCallback((event, value) => {
    setEntryPage(value);
  }, []);

  const handleEntryExport = useCallback(() => {
    console.log("handleEntryExport");
  }, []);

  const handleMintBadge = useCallback((values) => {
    setData((prev) => ({
      ...prev,
      badge: {
        id: "3Rxv4WLTT5EqiBiVozgy4LZLW6ELRVM8",
        image_url: "/assets/avatars/avatar-anika-visser.png",
        badge_id: 1,
        name: values.name,
        description: values.description,
        type: values.type,
        token_uri: "https://badge.world/api/v1/badges/1",
        initial_quantity: 10,
        remaining_quantity: 10,
        created_at: "2021-10-01T00:00:00.000000Z",
        preview: values.preview,
      },
    }));
    setTabNum("3");
  }, []);

  const handleTabChange = (event, value) => {
    setTabNum(value);
  };

  useEffect(() => {
    eventDetails();
  }, [id]);

  useEffect(() => {
    eventEntries();
  }, [entryPage]);

  return (
    <>
      <Head>
        <title>Event</title>
      </Head>
      <Box
        sx={{
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Stack direction={"row"} justifyContent="space-between" spacing={3}>
              <Typography variant="h4">Event</Typography>
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
                <Tab label="Host" value="1" />
                <Tab label="Detail" value="2" />
                {badge ? <Tab label="Badge" value="3" /> : <Tab label="Mint" value="4" />}
                <Tab label="Entry" value="5" />
                <Tab label="QR Code" value="6" />
              </TabList>
              <TabPanel value={"1"}>
                <EventHost host={host} />
              </TabPanel>
              <TabPanel value={"2"}>
                <EventDetails event={event} />
              </TabPanel>
              {badge ? (
                <TabPanel value={"3"}>
                  <EventBadge badge={badge} />
                </TabPanel>
              ) : (
                <TabPanel value={"4"}>
                  <EventBadgeMintForm handleMintBadge={handleMintBadge} />
                </TabPanel>
              )}
              <TabPanel value={"5"}>
                <EventEntryTable
                  page={entryPage}
                  pageCount={entryPageCount}
                  handlePageChange={handleEntryPageChange}
                  handleEntryExport={handleEntryExport}
                  items={entries}
                />
              </TabPanel>
              <TabPanel value={"6"}>
                <EventQRCodeLoader eventId={id} />
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
