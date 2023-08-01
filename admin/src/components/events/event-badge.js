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

const badge = {
  id: "3Rxv4WLTT5EqiBiVozgy4LZLW6ELRVM8",
  image_url: "/assets/avatars/avatar-anika-visser.png",
  badge_id: 1,
  name: "플로깅 그랜드마스터",
  description: "플로깅 100회 이상 달성",
  type: 2,
  token_uri: "https://badge.world/api/v1/badges/1",
  initial_quantity: 10,
  remaining_quantity: 10,
  created_at: "2021-10-01T00:00:00.000000Z",
};

export const EventBadge = () => (
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
          src={badge.image_url}
          sx={{
            height: 80,
            mb: 2,
            width: 80,
          }}
        />
        <Typography gutterBottom variant="h5">
          {badge.name}
        </Typography>
        <Typography color="text.secondary" variant="body3">
          {badge.description}
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            label="ID"
            name="id"
            value={badge.id}
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
            value={badge.badge_id}
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
            value={badge.token_uri}
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
            value={`${badge.remaining_quantity} / ${badge.initial_quantity}`}
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
            value={badge.created_at}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
