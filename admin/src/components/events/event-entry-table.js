import PropTypes from "prop-types";
import axios from "axios";
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
  Button,
  SvgIcon,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { useRouter } from "next/router";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";

export const EventEntryTable = ({
  items = [],
  // eventId,
  pageCount,
  page,
  handlePageChange,
  handleEntryExport,
}) => {
  const router = useRouter();
  const { id } = router.query;

  const handleUserSelected = (userId) => {
    router.push(`/users/${userId}`);
  };

  const entryUserDownload = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/events/entry/download/${id}`,
        {
          withCredentials: true,
          responseType: "blob",
        }
      );

      if (res.status === 200) {
        const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", "user_list.xlsx"); // 파일 이름 설정
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) {
      console.log(error);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction={"row"} justifyContent="left" spacing={3}>
        <Button
          color="inherit"
          startIcon={
            <SvgIcon fontSize="small">
              <ArrowDownOnSquareIcon />
            </SvgIcon>
          }
          onClick={entryUserDownload}
        >
          Export
        </Button>
      </Stack>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">No.</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Wallet Address</TableCell>
                  <TableCell align="center">Badge</TableCell>
                  <TableCell align="center">Token</TableCell>
                  <TableCell align="center">Entry In</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((entry, i) => {
                  return (
                    <TableRow
                      hover
                      key={entry._id}
                      onClick={() => handleUserSelected(entry._id)}
                      sx={{
                        "&:hover": {
                          cursor: "pointer",
                        },
                      }}
                    >
                      <TableCell align="center">
                        <Typography variant="subtitle2">{i + 1}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2">{entry.user_id.name}</Typography>
                      </TableCell>
                      <TableCell align="center">{entry.user_id.email}</TableCell>
                      <TableCell align="center">{`${
                        entry.user_id.wallet.address.slice(0, 6) +
                        "..." +
                        entry.user_id.wallet.address.slice(-4)
                      }`}</TableCell>
                      <TableCell align="center">
                        {entry.is_nft_issued ? (
                          <Chip label="Issued" color="success" />
                        ) : (
                          <Chip label="Pending" color="error" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {entry.is_token_rewarded ? (
                          <Chip label="Issued" color="success" />
                        ) : (
                          <Chip label="Pending" color="error" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {new Date(entry.created_at).toLocaleString()}
                      </TableCell>
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
