import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Unstable_Grid2 as Grid,
  Typography,
} from "@mui/material";

export const EventQRCodeLoader = ({ eventId }) => {
  return (
    <Card sx={{ p: 3 }}>
      <CardHeader title="QR Code" />
      <CardContent></CardContent>
    </Card>
  );
};
