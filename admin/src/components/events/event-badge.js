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
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export const EventBadge = ({ badge }) => (
  <Card sx={{ p: 3 }}>
    <CardHeader title="Badge" />
    <CardContent>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          pb: 3,
        }}
      >
        <Avatar
          src={badge.image_url ? badge.image_url : ""}
          sx={{
            height: 80,
            mb: 2,
            width: 80,
          }}
        />
        <Typography gutterBottom variant="h5">
          {badge.name ? badge.name : "N/A"}
        </Typography>
        <Typography color="text.secondary" variant="body3">
          {badge.description ? badge.description : "N/A"}
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            label="ID"
            name="id"
            value={badge._id ? badge._id : "N/A"}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            label="Badge ID"
            name="badge_id"
            value={badge.badge_id ? badge.badge_id : "N/A"}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            label="Token URI"
            name="token_uri"
            value={badge.token_uri ? badge.token_uri : "N/A"}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            label="Badge Type"
            name="badge_type"
            value={badge.type === 2 ? "Gold" : badge.type === 1 ? "Silver" : "Bronze"}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            value={
              badge.initial_quantity
                ? badge.remain_quantity
                  ? `${badge.remain_quantity} / ${badge.initial_quantity}`
                  : `${badge.initial_quantity} / ${badge.initial_quantity}`
                : "N/A"
            }
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            label="Created At"
            name="created_at"
            value={
              badge.created_at
                ? format(utcToZonedTime(new Date(badge.created_at)), "yyyy-MM-dd HH:mm:ss")
                : "N/A"
            }
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
