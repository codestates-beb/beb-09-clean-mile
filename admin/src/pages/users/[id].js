import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, Button } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { UserDNFT } from "src/components/users/user-dnft";
import { UserWallet } from "src/components/users/user-wallet";
import { UserDetails } from "src/components/users/user-details";
import { PostsTable } from "src/components/posts/posts-table";
import { CommentsTable } from "src/components/comments/comments-table";
import { EventsTable } from "src/components/events/events-table";

const Page = () => {
  const router = useRouter();
  const { id } = router.query;

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
            <Grid container wrap={"wrap"} gap={3}>
              <Grid xs={12} sm={6} md={3}>
                <UserDNFT />
              </Grid>

              <Grid xs={12} md={6}>
                <UserWallet />
              </Grid>
            </Grid>
            <UserDetails />
            <EventsTable />
            <PostsTable />
            <CommentsTable />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
