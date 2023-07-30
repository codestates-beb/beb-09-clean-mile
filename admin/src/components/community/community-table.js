import PropTypes from "prop-types";
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

export const CommunityTable = ({ items = [], pageCount, page, handlePageChange }) => {
  const router = useRouter();

  const handlePostSelected = (postId) => {
    router.push(`/community/${postId}`);
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
                  return (
                    <TableRow hover key={post.id} onClick={() => handlePostSelected(post.id)}>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Typography variant="subtitle2">{post.title}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {post.content ? `${post.content.slice(0, 20)}...` : "N/A"}
                      </TableCell>
                      <TableCell>{post.writer}</TableCell>
                      <TableCell>{post.category}</TableCell>
                      <TableCell>{post.view}</TableCell>
                      <TableCell>{post.createdAt}</TableCell>
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

CommunityTable.propTypes = {
  items: PropTypes.array,
  pageCount: PropTypes.number,
  page: PropTypes.number,
  handlePageChange: PropTypes.func,
};
