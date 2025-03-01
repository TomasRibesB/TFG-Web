import React, { useState } from "react";
import { Avatar, AvatarProps, Dialog } from "@mui/material";
import { User } from "../../infrastructure/interfaces/user";
import { api } from "../../config/apis/api";

interface Props extends AvatarProps {
  user: Partial<User>;
  onClickView?: boolean;
  flag?: Date | null;
}

export const ImageAvatar: React.FC<Props> = ({
  user,
  onClickView,
  flag = null,
  ...avatarProps
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (!user.hasImage) return;
    if (onClickView) setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <Avatar
        alt="Foto de Perfil"
        src={
          user.hasImage
            ? `${api.defaults.baseURL ?? ""}/users/image/${
                user.id
              }?_=${flag?.getTime()}`
            : undefined
        }
        sx={{
          bgcolor: "primary.main",
          cursor: onClickView ? "pointer" : "default",
        }}
        style={{
          borderRadius: 16,
        }}
        onClick={handleOpen}
        {...avatarProps}
      >
        {!user.hasImage && user.firstName?.charAt(0).toUpperCase()}
      </Avatar>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <img
          src={`${api.defaults.baseURL ?? ""}/users/image/${
            user.id
          }?_=${flag?.getTime()}`}
          alt="Imagen Ampliada"
          style={{
            width: "100%",
            height: "auto",
            scrollSnapAlign: "center",
            overflowX: "hidden",
            overflowY: "hidden",
          }}
        />
      </Dialog>
    </>
  );
};
