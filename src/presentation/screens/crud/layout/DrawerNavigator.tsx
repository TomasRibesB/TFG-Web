// src/components/DrawerNavigator.tsx
import React, { useEffect } from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import {
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  Inbox as InboxIcon,
  Home as HomeIcon,
  Groups2 as ClientsIcon,
  Logout,
} from "@mui/icons-material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import NexoHealthIcon from "/nexoHealthIcon.svg";
import { User } from "../../../../infrastructure/interfaces/user";
import { StorageAdapter } from "../../../../config/adapters/storage-adapter";
import { Role } from "../../../../infrastructure/enums/roles";
import { useAuth } from "../../../hooks/useAuth";
import { ImageAvatar } from "../../../components/ImageAvatar";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...((open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }) || {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export const DrawerNavigator: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState<Partial<User>>({});

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    const user: Partial<User> = (await StorageAdapter.getItem("user")) || {};
    setUser(user);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const location = useLocation();

  const getSectionTitle = (pathname: string) => {
    switch (pathname) {
      case "/main/profile":
        return "Perfil";
      case "/main/clients":
        return "Clientes";
      case "/main/tickets":
        return "Tickets";
      case "/main":
        return "Home";
      default:
        return "Sección desconocida";
    }
  };

  const menuItems = user?.userTipoProfesionales?.some(
    (tipo) => tipo.isCertified
  )
    ? [
        { text: "Home", icon: <HomeIcon />, path: "/main" },
        { text: "Clientes", icon: <ClientsIcon />, path: "/main/clients" },
        { text: "Tickets", icon: <InboxIcon />, path: "/main/tickets" },
      ]
    : [];
  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        open={open}
        sx={{
          backgroundColor: "background.paper",
          color: "text.primary",
          borderBottom: 1,
          borderColor: "divider",
        }}
        elevation={0}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Izquierda: Menu Icon y location.pathname */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {user?.userTipoProfesionales?.some((tipo) => tipo.isCertified) && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ marginRight: 2, ...(open && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              noWrap
              sx={{ display: { xs: "none", md: "block" } }}
            >
              {getSectionTitle(location.pathname)}
            </Typography>
          </Box>

          {/* Centro: Icono y nombre de la app */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <Box
              component="img"
              src={NexoHealthIcon}
              alt="Nexo Health Icon"
              sx={{
                height: 50,
                width: 50,
                mr: 1,
              }}
            />
            <Typography variant="h6" noWrap>
              NexoHealth
            </Typography>
          </Box>

          {/* Derecha: Botones de notificaciones y logout */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link
              to="/main/profile"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  transition: "transform 0.3s",
                  borderRadius: 1,
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.05)" },
                }}
              >
                <ImageAvatar user={user} flag={new Date()} />
                <Box
                  sx={{
                    display: { xs: "none", sm: "none", md: "flex" },
                    flexDirection: "column",
                    mr: 3,
                  }}
                >
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {(user.firstName?.charAt(0)?.toUpperCase() ?? "") +
                      user.firstName?.slice(1).toLowerCase()}{" "}
                    {(user.lastName?.charAt(0).toUpperCase() ?? "") +
                      user.lastName?.slice(1).toLowerCase()}
                  </Typography>
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    {user.role === Role.Profesional
                      ? "Profesional - " +
                        (user.userTipoProfesionales
                          ?.map((tipo) => tipo.tipoProfesional?.profesion)
                          .filter((profesion) => profesion !== undefined)
                          .join(", ") || "N/E")
                      : (user.role?.charAt(0).toUpperCase() ?? "") +
                        (user.role?.slice(1).toLocaleLowerCase() ?? "")}
                  </Typography>
                </Box>
              </Box>
            </Link>
            <IconButton color="inherit" onClick={useAuth().logout}>
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer variant="permanent" open={open}>
        {/* Drawer Header */}
        <DrawerHeader>
          {/* Close Icon */}
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </DrawerHeader>

        {/* Divider */}
        <Divider />

        {/* Menu Items */}
        <List>
          {menuItems.map(({ text, icon, path }) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                selected={location.pathname === path}
                to={path}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                {/* Icon */}
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: location.pathname === path ? "primary.main" : "",
                  }}
                >
                  {icon}
                </ListItemIcon>

                {/* Text */}
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Necessary for content to be below app bar */}
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
};
