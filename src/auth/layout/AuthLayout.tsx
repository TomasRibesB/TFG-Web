import { Grid2, Typography } from "@mui/material";

interface Props {
  children: React.ReactNode;
  titlle: string;
}

export const AuthLayout = ({ children, titlle }: Props) => {
  return (
    <Grid2
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", backgroundColor: "primary.paper", pb: 4 }}
    >
      <Grid2
        className="card-shadow"
        size={11}
        sx={{
          width: { sm: 350 },
          backgroundColor: "background.paper",
          padding: 2,
        }}
      >
        <Typography variant="h4" sx={{ mb: 1 }} align="center">
          {titlle}
        </Typography>
        {children}
      </Grid2>
    </Grid2>
  );
};
