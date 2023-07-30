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
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { useRouter } from "next/router";

export const EventsTable = (props) => {
  const { items = [] } = props;

  const router = useRouter();

  const handleEventSelected = (eventId) => {
    router.push(`/${eventId}`);
  };

  return (
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
  );
};

EventsTable.propTypes = {
  items: PropTypes.array,
};
