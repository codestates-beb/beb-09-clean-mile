import Head from "next/head";
import cookie from "cookie";
import axios from "axios";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { NoticeEditForm } from "src/components/notice/notice-edit-form";

const Page = ({ post }) => {
  return (
    <>
      <Head>
        <title>Edit Notice</title>
      </Head>
      <Box
        sx={{
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Stack direction={"row"} justifyContent="space-between" spacing={3}>
              <Typography variant="h4">Edit Notice</Typography>
            </Stack>
          </Stack>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <NoticeEditForm post={post} />
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
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/posts/detail/${id}`, {
      withCredentials: true,
    });

    const post = res.data.data.post;

    return {
      props: {
        post,
      },
    };
  } catch (error) {
    console.log(error);

    return {
      props: {
        post: null,
      },
    };
  }
};
