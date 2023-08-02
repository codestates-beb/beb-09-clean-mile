import Head from "next/head";
import { Box, Container, Stack, Typography, Button } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { EventDetails } from "src/components/events/event-details";
import { EventBadge } from "src/components/events/event-badge";
import { EventHost } from "src/components/events/event-host";

const Page = () => {
  const data = {
    host: {
      id: "3Rxv4WLTT5EqiBiVozgy4LZLW6ELRVM8",
      name: "초전도체",
      email: "Presley89@hotmail.com",
      phone_number: "010-1234-5678",
      wallet_address: "0xdefe6c0baf788845b9a59f42fdc1ccc85f3cf2cd",
      organization: "퀀텀에너지 연구소",
      created_at: "2021-10-01T00:00:00.000000Z",
    },
    event: {
      id: "3Rxv4WLTT5EqiBiVozgy4LZLW6ELRVM8",
      title: "플로깅 그랜드마스터 선발전",
      content: "플로깅 100회 이상 달성",
      poster_url:
        "https://plohub-bucket.s3.ap-northeast-2.amazonaws.com/f8b53b11-efd9-461f-963f-6e29e0e3a302_image_0_17b2ad589801389ce.png",
      location: "서울시",
      capacity: 10,
      remaining: 10,
      status: "progressing",
      event_type: "fcfs",
      recruitment_start_at: "2021-10-01T00:00:00.000000Z",
      recruitment_end_at: "2021-10-02T00:00:00.000000Z",
      event_start_at: "2021-10-03T00:00:00.000000Z",
      event_end_at: "2021-10-04T00:00:00.000000Z",
      view: {
        count: 1234,
      },
      created_at: "2021-10-01T00:00:00.000000Z",
    },
    badge: {
      id: "3Rxv4WLTT5EqiBiVozgy4LZLW6ELRVM8",
      image_url: "/assets/avatars/avatar-anika-visser.png",
      badge_id: 1,
      name: "플로깅 그랜드마스터",
      description: "플로깅 100회 이상 달성",
      type: 2,
      token_uri: "https://badge.world/api/v1/badges/1",
      initial_quantity: 10,
      remaining_quantity: 10,
      created_at: "2021-10-01T00:00:00.000000Z",
    },
  };

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
                <Button variant="contained" color="success">
                  Edit
                </Button>
                <Button variant="contained" color="warning">
                  Delete
                </Button>
                <Button variant="contained" onClick={() => router.back()}>
                  Back
                </Button>
              </Stack>
            </Stack>
            <EventHost host={data.host} />
            <EventDetails event={data.event} />
            {data.badge && <EventBadge badge={data.badge} />}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
