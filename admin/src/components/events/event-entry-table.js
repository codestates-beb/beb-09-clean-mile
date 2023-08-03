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
  Chip,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { useRouter } from "next/router";

export const EventEntryTable = ({ items = [], pageCount, page, handlePageChange }) => {
  const router = useRouter();

  return (
    <Stack spacing={3}>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Wallet Address</TableCell>

                  <TableCell>Badge</TableCell>
                  <TableCell>Token</TableCell>
                  <TableCell>Entry In</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((entry) => {
                  return (
                    <TableRow hover key={entry._id}>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Typography variant="subtitle2">{entry.user_id.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{entry.user_id.email}</TableCell>
                      <TableCell>{`${
                        entry.user_id.wallet.address.slice(0, 6) +
                        "..." +
                        entry.user_id.wallet.address.slice(-4)
                      }`}</TableCell>
                      <TableCell>
                        {entry.is_nft_issued ? (
                          <Chip label="Issued" color="success" />
                        ) : (
                          <Chip label="Pending" color="error" />
                        )}
                      </TableCell>
                      <TableCell>
                        {entry.is_token_rewarded ? (
                          <Chip label="Issued" color="success" />
                        ) : (
                          <Chip label="Pending" color="error" />
                        )}
                      </TableCell>
                      <TableCell>{new Date(entry.created_at).toLocaleString()}</TableCell>
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

EventEntryTable.propTypes = {
  items: PropTypes.array,
};
