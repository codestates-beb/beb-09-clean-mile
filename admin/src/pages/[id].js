import Head from "next/head";
import { Box, Container, Stack, Typography, Button } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";
import { EventDetails } from "src/components/events/event-details";
import { EventBadge } from "src/components/events/event-badge";
import { EventHost } from "src/components/events/event-host";

const Page = () => {
  const router = useRouter();
  const { id } = router.query;

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
            <EventDetails />
            <EventBadge badge={data.badge} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
