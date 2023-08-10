import React from "react";
import Head from "next/head";
import cookie from 'cookie';
import axios from "axios";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { EventEditForm } from "src/components/events/event-edit-form";

const Page = ({ event, host }) => {
  return (
    <>
      <Head>
        <title>Edit Event</title>
      </Head>
      <Box
        sx={{
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Stack direction={"row"} justifyContent="space-between" spacing={3}>
              <Typography variant="h4">Edit Event</Typography>
            </Stack>
          </Stack>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <EventEditForm event={event} host={host} />
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

    return {
      props: {
        event,
        host
      },
    };
  } catch (error) {
    console.log(error);

    return {
      props: {
        event: null,
        host: null
      },
    };
  }
};
