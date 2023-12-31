import Head from "next/head";
import axios from "axios";
import Swal from "sweetalert2";
import cookie from 'cookie';
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

const Page = ({ event, host, badge }) => {
  const [entries, setEntries] = useState([]);
  const [entryPage, setEntryPage] = useState(1);
  const [entryPageCount, setEntryPageCount] = useState(1);

  const [tabNum, setTabNum] = useState("1");

  const router = useRouter();

  const eventEntries = useCallback(async () => {
    try {
      const params = {};
      params.page = entryPage;

      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/events/detail/entry/${event._id}`, {
        withCredentials: true,
      });

      if (res && res.status === 200) {
        const data = res.data;

        if (data && data.data) {
          const entriesData = data.data.entries;
          const pagination = data.data.pagination;

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

  const deleteEvent = async () => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/events/delete/${event._id}`,
        {
          withCredentials: true,
        }
      );

      if (res && res.status === 200) {
        Swal.fire({
          title: "Success!",
          text: res.data.message,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#6BCB77",
        }).then(() => {
          Swal.close();
          router.push(`/events`);
        });
      } else {
        Swal.fire({
          title: "Error",
          text: res.data.message,
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#6BCB77",
        }).then(() => {
          Swal.close();
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response.data.message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#6BCB77",
      }).then(() => {
        Swal.close();
      });
    }
  };

  const cancelEvent = async () => {
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/events/cancel/${event._id}`,
        null,
        {
          withCredentials: true,
        }
      );

      if (res && res.status === 200) {
        Swal.fire({
          title: "Success!",
          text: res.data.message,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#6BCB77",
        }).then(() => {
          Swal.close();
          router.push(`/events`);
        });
      } else {
        Swal.fire({
          title: "Error",
          text: res.data.message,
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#6BCB77",
        }).then(() => {
          Swal.close();
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response.data.message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#6BCB77",
      }).then(() => {
        Swal.close();
      });
    }
  };

  const handleEntryPageChange = useCallback((event, value) => {
    setEntryPage(value);
  }, []);

  const handleTabChange = (event, value) => {
    setTabNum(value);
  };

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
                <Button variant="contained" color="warning" onClick={deleteEvent}>
                  Delete
                </Button>
                <Button variant="contained" color="error" onClick={cancelEvent}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => router.push(`/events/edit/${event._id}`)}
                >
                  Edit
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
                  <EventBadgeMintForm eventId={event._id} />
                </TabPanel>
              )}
              <TabPanel value={"5"}>
                <EventEntryTable
                  page={entryPage}
                  pageCount={entryPageCount}
                  handlePageChange={handleEntryPageChange}
                  items={entries}
                />
              </TabPanel>
              <TabPanel value={"6"}>
                <EventQRCodeLoader eventId={event._id} />
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

export const getServerSideProps = async (context) => {
  const { id } = context.query;
  const cookiesObj = cookie.parse(context.req.headers.cookie || "");

  let cookiesStr = "";
  if (context.req && cookiesObj) {
    cookiesStr = Object.entries(cookiesObj)
      .map(([key, value]) => `${key}=${value}`)
      .join("; ");
    axios.defaults.headers.Cookie = cookiesStr;
  }
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/events/detail/${id}`,
      {
        withCredentials: true,
      }
    );

    const event = res.data.data.event;
    const host = res.data.data.event.host_id;
    const badge = res.data.data.badge;

    return {
      props: {
        event,
        host,
        badge
      },
    };
  } catch (error) {
    console.log(error);

    return {
      props: {
        event: null,
        host: null,
        badge: null
      },
    };
  }
};
