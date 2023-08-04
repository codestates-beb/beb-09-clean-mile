import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Unstable_Grid2 as Grid,
  Typography,
  Button,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";

export const EventQRCodeLoader = ({ eventId }) => {
  const [qrCode, setQRCode] = useState(null);

  const handleGenerateQRCode = async () => {
    console.log("handleGenerateQRCode");
    setQRCode("https://plohub-bucket.s3.ap-northeast-2.amazonaws.com/response.png");
  };

  const QRCodeGenerator = () => {
    return (
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          p: 3,
        }}
      >
        <Button variant="contained" size="large" onClick={handleGenerateQRCode}>
          <Typography variant="body1">Generate QR Code</Typography> <PlusIcon />
        </Button>
      </Box>
    );
  };

  const QRCode = () => {
    return (
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Image src={qrCode} width={300} height={300} />
      </Box>
    );
  };

  return (
    <Card sx={{ p: 3 }}>
      <CardHeader title="QR Code" />
      <CardContent>{qrCode ? <QRCode /> : <QRCodeGenerator />}</CardContent>
    </Card>
  );
};
