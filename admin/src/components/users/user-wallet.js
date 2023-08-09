import {
  Box,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";

export const UserWallet = ({ wallet = {} }) => {
  console.log(wallet)
  return <Card sx={{ p: 3 }}>
    <CardHeader title="Wallet" />
    <CardContent sx={{ pt: 0 }}>
      <Box sx={{ m: -1.5 }}>
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={wallet.address ? wallet.address : "N/A"}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              label="Token Amount"
              name="token_amount"
              value={wallet.token_amount ? wallet.token_amount : 0}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              label="Mileage Amount"
              name="mileage_amount"
              value={wallet.mileage_amount ? wallet.mileage_amount : 0}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              label="Badge Amount"
              name="badge_amount"
              value={wallet.badge_amount ? wallet.badge_amount : 0}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              label="Total Badge Score"
              name="total_badge_score"
              value={wallet.total_badge_score ? wallet.total_badge_score : 0}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </CardContent>
  </Card>
};
