import Head from "next/head";
import {
  Box,
  Container,
  Divider,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  Button,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { AccountDnft } from "src/components/account/account-dnft";
import { AccountWallet } from "src/components/account/account-wallet";
import { AccountProfileDetails } from "src/components/account/account-profile-details";
import { useRouter } from "next/router";
import { PostsTable } from "src/components/posts/posts-table";
import { CommentsTable } from "src/components/comments/comments-table";

const Page = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>Account</title>
      </Head>
      <Box
        sx={{
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Stack direction={"row"} justifyContent="space-between" spacing={3}>
              <Typography variant="h4">Account</Typography>
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
                <AccountDnft />
              </Grid>

              <Grid xs={12} md={6}>
                <AccountWallet />
              </Grid>
            </Grid>
            <AccountProfileDetails />

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
