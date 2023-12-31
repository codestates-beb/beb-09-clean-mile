import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export const EventHost = ({ host }) => {
  return (
    <Card sx={{ p: 3 }}>
      <CardHeader title="Host" />
      <CardContent sx={{ pt: 1 }}>
        {host && (
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ID"
                  name="id"
                  value={host._id ? host._id : "N/A"}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={host.name ? host.name : "N/A"}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={host.email ? host.email : "N/A"}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone_number"
                  value={host.phone_number ? host.phone_number : "N/A"}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Wallet Address"
                  name="wallet_address"
                  value={host.wallet_address ? host.wallet_address : "N/A"}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Organization"
                  name="organization"
                  value={host.organization ? host.organization : "N/A"}
                  InputProps={{
                    readOnly: true,
                  }}
                ></TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Created At"
                  name="created_at"
                  value={
                    host.created_at
                      ? format(utcToZonedTime(new Date(host.created_at)), "yyyy-MM-dd HH:mm:ss")
                      : "N/A"
                  }
                  InputProps={{
                    readOnly: true,
                  }}
                ></TextField>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
