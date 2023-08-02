import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";

export const NoticeCreateForm = ({ values, handleChange, imageInputRef }) => {
  return (
    <form autoComplete="off" noValidate>
      <Card sx={{ p: 3 }}>
        <CardHeader title="Notice" />
        <CardContent sx={{ pt: 1 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  onChange={handleChange}
                  required
                  value={values.title}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Image"
                  name="image"
                  onChange={handleChange}
                  required
                  type="file"
                  inputRef={imageInputRef}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={12}
                  label="Content"
                  name="content"
                  onChange={handleChange}
                  required
                  value={values.content}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </form>
  );
};
