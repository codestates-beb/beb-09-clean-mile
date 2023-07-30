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

export const EventsTable = ({ items = [], pageCount, page, handlePageChange }) => {
  const router = useRouter();

  const handleEventSelected = (eventId) => {
    router.push(`/${eventId}`);
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
                  <TableCell>Type</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Organization</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((event) => {
                  const createdAt = event.createdAt ? event.createdAt : "N/A";

                  return (
                    <TableRow hover key={event.id} onClick={() => handleEventSelected(event.id)}>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Typography variant="subtitle2">{event.title}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{event.type}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>{event.organization}</TableCell>
                      <TableCell>{event.status}</TableCell>
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

EventsTable.propTypes = {
  items: PropTypes.array,
};
