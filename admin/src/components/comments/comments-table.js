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

export const CommentsTable = ({ items = [], pageCount, page, handlePageChange }) => {
  const router = useRouter();

  const handleCommentSelected = (commentId) => {
    router.push(`/comments/${commentId}`);
  };

  return (
    <Stack spacing={3}>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Post Title</TableCell>
                  <TableCell>Post Category</TableCell>
                  <TableCell>Content</TableCell>
                  <TableCell>Writer</TableCell>
                  <TableCell>Likes</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((comment) => {
                  return (
                    <TableRow
                      hover
                      key={comment.id}
                      onClick={() => handleCommentSelected(comment.id)}
                      sx={{
                        "&:hover": {
                          cursor: "pointer",
                        },
                      }}
                    >
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Typography variant="subtitle2">{comment.title}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{comment.category}</TableCell>
                      <TableCell>
                        {comment.content ? `${comment.content.slice(0, 20)}...` : "N/A"}
                      </TableCell>
                      <TableCell>{comment.writer}</TableCell>

                      <TableCell>{comment.likes}</TableCell>
                      <TableCell>{comment.createdAt}</TableCell>
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

CommentsTable.propTypes = {
  items: PropTypes.array,
  pageCount: PropTypes.number,
  page: PropTypes.number,
  handlePageChange: PropTypes.func,
};
