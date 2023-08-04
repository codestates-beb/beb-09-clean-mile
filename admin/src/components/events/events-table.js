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
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Typography variant="subtitle2">
                            {event.title ? event.title : "N/A"}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{event.event_type ? event.event_type : "N/A"}</TableCell>
                      <TableCell>{event.location ? event.location : "N/A"}</TableCell>
                      <TableCell>
                        {event.host_id
                          ? event.host_id.organization
                            ? event.host_id.organization
                            : "N/A"
                          : "N/A"}
                      </TableCell>
                      <TableCell>{event.status ? event.status : "N/A"}</TableCell>
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
