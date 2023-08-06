import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Unstable_Grid2 as Grid,
  Typography,
} from "@mui/material";

export const PostComments = ({ comments = [] }) => {
  return (
    <Card sx={{ p: 3 }}>
      <CardHeader title="Comments" />
      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ m: -1.5 }}>
          <Grid container spacing={3}>
            {console.log(comments.length)}
            {comments.length === 0 ? (
              <Grid xs={12} md={6} sx={{ margin: '0 auto' }}>
                <Typography variant="body1" sx={{ textAlign: 'center' }}>등록된 댓글이 없습니다.</Typography>
              </Grid>
            ) : (
              comments.map((comment, i) => {
                return (
                  <>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="ID"
                        name="id"
                        value={comment._id}
                        variant="filled"
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="User ID"
                        name="user_id"
                        value={comment.user_id._id}
                        variant="filled"
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="User Nickname"
                        name="user_nickname"
                        value={comment.user_id.nickname}
                        variant="filled"
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Likes"
                        name="likes"
                        value={comment.likes.count}
                        variant="filled"
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Created At"
                        name="created_at"
                        value={`${comment.created_at.split("T")[0]} ${comment.created_at.substring(
                          11,
                          19
                        )}`}
                        variant="filled"
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Updated At"
                        name="updated_at"
                        value={`${comment.updated_at.split("T")[0]} ${comment.updated_at.substring(
                          11,
                          19
                        )}`}
                        variant="filled"
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid xs={12} md={12} sx={{ borderBottom: "1px solid #222" }}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        label="Content"
                        name="content"
                        value={comment.content}
                        variant="filled"
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                  </>
                );
              })
            )}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
