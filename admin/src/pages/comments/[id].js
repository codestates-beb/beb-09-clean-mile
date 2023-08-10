import Head from "next/head";
import axios from "axios";
import cookie from "cookie";
import { Box, Container, Stack, Typography, Button } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";
import { CommentDetails } from "src/components/comments/comment-details";

const Page = ({ comment }) => {
  const router = useRouter();

  const deleteComment = async () => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/comments/delete/${comment._id}`,
        {
          withCredentials: true,
        }
      );
      console.log(res);
      if (res && res.status === 200) {
        alert(res.data.message);
        router.push("/comments");
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <Head>
        <title>Comment</title>
      </Head>
      <Box
        sx={{
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Stack direction={"row"} justifyContent="space-between" spacing={3}>
              <Typography variant="h4">Comment</Typography>
              <Stack direction={"row"} spacing={1}>
                <Button variant="contained" color="warning" onClick={deleteComment}>
                  Delete
                </Button>
                <Button variant="contained" onClick={() => router.back()}>
                  Back
                </Button>
              </Stack>
            </Stack>
            <CommentDetails comment={comment} />
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
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/comments/detail/${id}`,
      {
        withCredentials: true,
      }
    );

    console.log(res);

    const comment = res.data.data;

    return {
      props: {
        comment,
      },
    };
  } catch (error) {
    console.log(error);

    return {
      props: {
        comment: null,
      },
    };
  }
};
