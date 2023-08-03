import Head from "next/head";
import { Box, Container, Stack, Typography, Button } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { NoticeCreateForm } from "src/components/notice/notice-create-form";

const Page = () => {
  return (
    <>
      <Head>
        <title>Create Notice</title>
      </Head>
      <Box
        sx={{
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Stack direction={"row"} justifyContent="space-between" spacing={3}>
              <Typography variant="h4">Create Notice</Typography>
            </Stack>
          </Stack>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <NoticeCreateForm />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
