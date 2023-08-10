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

export const CommentsTable = ({ items = [], pageCount, page, handlePageChange }) => {
  const router = useRouter();

  return (
    <Stack spacing={3}>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Post Title</TableCell>
                  <TableCell align="center">Post Category</TableCell>
                  <TableCell align="center">Content</TableCell>
                  <TableCell align="center">Writer</TableCell>
                  <TableCell align="center">Likes</TableCell>
                  <TableCell align="center">Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      등록된 댓글이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((comment, i) => {
                    const createdAt = comment.created_at
                      ? format(utcToZonedTime(new Date(comment.created_at)), "MM/dd/yyyy")
                      : "N/A";
                    return (
                      <TableRow
                        hover
                        key={i}
                        onClick={() => router.push(`/comments/${comment._id}`)}
                        sx={{
                          "&:hover": {
                            cursor: "pointer",
                          },
                        }}
                      >
                        <TableCell align="center">
                          <Typography variant="subtitle2">{comment.post_id.title}</Typography>
                        </TableCell>
                        <TableCell align="center">{comment.post_id.category}</TableCell>
                        <TableCell align="center">
                          {comment.content ? `${comment.content.slice(0, 20)}...` : "N/A"}
                        </TableCell>
                        <TableCell align="center">{comment.user_id?.nickname ? comment.user_id.nickname : "Unknown"}</TableCell>
                        <TableCell align="center">{comment.likes.count}</TableCell>
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

CommentsTable.propTypes = {
  items: PropTypes.array,
  pageCount: PropTypes.number,
  page: PropTypes.number,
  handlePageChange: PropTypes.func,
};
