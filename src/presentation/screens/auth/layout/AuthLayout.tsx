import { Typography, Box, Grid2 } from "@mui/material";
import NexoHealthIcon from "../../../../../public/nexoHealthIcon.svg";

interface Props {
  children: React.ReactNode;
  title: string;
  isLarger?: boolean;
}

export const AuthLayout = ({ children, title, isLarger = false }: Props) => {
  return (
    <Grid2
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", backgroundColor: "primary.paper", pb: 4 }}
    >
      {/* Agrega el icono aquí */}
      <Box
        component="img"
        src={NexoHealthIcon}
        alt="Nexo Health Icon"
        sx={{
          height: { xs: 300, sm: 450 },
          width: { xs: 300, sm: 450 },
          //le quito 50 pixeles de los margenes
          m: { xs: -7, sm: -10 },
          mb: { xs: -3, sm: -3 },
          mt: { xs: -4, sm: -7 },
        }}
      />
      <Grid2
        className="card-shadow"
        size={11}
        sx={{
          width: isLarger ? { sm: 550 } : { sm: 400 },
          backgroundColor: "background.paper",
          padding: 2,
        }}
      >
        <Typography variant="h4" sx={{ mb: 1 }} align="center">
          {title}
        </Typography>
        {children}
      </Grid2>
    </Grid2>
  );
};
