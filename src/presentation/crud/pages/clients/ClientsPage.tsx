import { Grid2 } from "@mui/material";

export const ClientsPage = () => {
  return (
    <Grid2
      container
      spacing={2}
      direction="row"
      sx={{ minHeight: "90vh", backgroundColor: "primary.paper", pb: 4 }}
    >
      <Grid2
        className="card-shadow"
        size={4}
        sx={{
          backgroundColor: "background.paper",
          padding: 2,
        }}
      ></Grid2>
      <Grid2
        className="card-shadow"
        size={8}
        sx={{
          backgroundColor: "background.paper",
          padding: 2,
        }}
      ></Grid2>
    </Grid2>
  );
};
