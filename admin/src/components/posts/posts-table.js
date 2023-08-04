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
                  <TableCell>Title</TableCell>
                  <TableCell>Content</TableCell>
                  <TableCell>Writer</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((post) => {
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
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Typography variant="subtitle2">
                            {post.title ? post.title : "N/A"}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {post.content ? `${post.content.slice(0, 20)}...` : "N/A"}
                      </TableCell>
                      <TableCell>
                        {post.user_id
                          ? post.user_id.nickname
                            ? post.user_id.nickname
                            : "N/A"
                          : "N/A"}
                      </TableCell>
                      <TableCell>{post.category ? post.category : "N/A"}</TableCell>
                      <TableCell>
                        {post.view ? (post.view.count ? post.view.count : 0) : 0}
                      </TableCell>
                      <TableCell>{createdAt}</TableCell>
                    </TableRow>
                  );
                })}
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
