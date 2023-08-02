import Head from "next/head";
import { Box, Container, Stack, Typography, Button } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";

const Page = () => {
  const router = useRouter();

  const { id } = router.query;

  console.log(id);

  return (
    <>
      <Head>
        <title>Mint Event Badge</title>
      </Head>
      <Box
        sx={{
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Stack direction={"row"} justifyContent="space-between" spacing={3}>
              <Typography variant="h4">Mint Event Badge</Typography>
              <Stack direction={"row"} spacing={1}>
                <Button variant="contained" color="success">
                  Mint
                </Button>
                <Button variant="contained" onClick={() => router.back()}>
                  Back
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
