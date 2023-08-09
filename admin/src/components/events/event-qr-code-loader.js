import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Card, CardContent, CardHeader, Typography, Button } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import Image from "next/image";
import { useState } from "react";

export const EventQRCodeLoader = ({ eventId }) => {
  const [qrCode, setQRCode] = useState("");

  const handleGenerateQRCode = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/events/qrcode/${eventId}`, null, {
        withCredentials: true,
      });

      if (res && res.status === 200) {
        Swal.fire({
          title: "Success!",
          text: res.data.message,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#6BCB77",
        }).then(() => {
          Swal.close();
          setQRCode(res.data.data);
        });
      } else {
        Swal.fire({
          title: "Error",
          text: res.data.message,
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#6BCB77",
        }).then(() => {
          Swal.close();
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response.data.message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#6BCB77",
      }).then(() => {
        Swal.close();
      });
    }
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
        <Image src={qrCode} width={400} height={400} alt="qrcode" />
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
