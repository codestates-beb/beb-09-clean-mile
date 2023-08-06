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

export const EventsTable = ({ items = [], pageCount, page, handlePageChange }) => {
  const router = useRouter();

  const handleEventSelected = (eventId) => {
    router.push(`/events/${eventId}`);
  };

  return (
    <Stack spacing={3}>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Id</TableCell>
                  <TableCell align="center">Title</TableCell>
                  <TableCell align="center">Type</TableCell>
                  <TableCell align="center">Location</TableCell>
                  <TableCell align="center">Organization</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((event) => {
                  const createdAt = event.created_at
                    ? format(utcToZonedTime(new Date(event.created_at)), "MM/dd/yyyy")
                    : "N/A";

                  return (
                    <TableRow
                      hover
                      key={event._id}
                      onClick={() => handleEventSelected(event._id)}
                      sx={{
                        "&:hover": {
                          cursor: "pointer",
                        },
                      }}
                    >
                      <TableCell align="center">
                        <Typography variant="subtitle2">
                          {event._id.slice(0, 6) + "..." + event._id.slice(-4)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2">
                          {event.title ? event.title : "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {event.event_type ? event.event_type : "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {event.location ? event.location : "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {event.host_id
                          ? event.host_id.organization
                            ? event.host_id.organization
                            : "N/A"
                          : "N/A"}
                      </TableCell>
                      <TableCell align="center">{event.status ? event.status : "N/A"}</TableCell>
                      <TableCell align="center">{createdAt}</TableCell>
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
