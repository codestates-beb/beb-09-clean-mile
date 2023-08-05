import PropTypes from "prop-types";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Pagination,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { useRouter } from "next/router";

export const PostsTable = ({ items = [], pageCount, page, handlePageChange, path }) => {
  const router = useRouter();

  console.log(items);

  const handlePostSelected = (postId) => {
    router.push(`${path}/${postId}`);
  };

  return (
    <Stack spacing={3}>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Title</TableCell>
                  <TableCell align="center">Content</TableCell>
                  <TableCell align="center">Writer</TableCell>
                  <TableCell align="center">Category</TableCell>
                  <TableCell align="center">View</TableCell>
                  <TableCell align="center">Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      등록된 게시글이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((post) => {
                    const createdAt = post.created_at
                      ? format(utcToZonedTime(new Date(post.created_at)), "MM/dd/yyyy")
                      : "N/A";
                    return (
                      <TableRow
                        hover
                        key={post._id}
                        onClick={() => handlePostSelected(post._id)}
                        sx={{
                          "&:hover": {
                            cursor: "pointer",
                          },
                        }}
                      >
                        <TableCell align="center">
                          <Typography variant="subtitle2">
                            {post.title ? post.title : "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {post.content ? `${post.content.slice(0, 20)}...` : "N/A"}
                        </TableCell>
                        <TableCell align="center">{post.user_id.nickname}</TableCell>
                        <TableCell align="center">{post.category ? post.category : "N/A"}</TableCell>
                        <TableCell align="center">
                          {post.view.count}
                        </TableCell>
                        <TableCell align="center">{createdAt}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      </Card>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pagination
          color="primary"
          count={pageCount}
          page={page}
          onChange={handlePageChange}
          size={"medium"}
        />
      </Box>
    </Stack>
  );
};

PostsTable.propTypes = {
  items: PropTypes.array,
  pageCount: PropTypes.number,
  page: PropTypes.number,
  handlePageChange: PropTypes.func,
  path: PropTypes.string,
};
