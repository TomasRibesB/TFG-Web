import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
  Divider,
  Paper,
  Fab,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { socket, connect, disconnect } from "../../services/socket";
import { v4 as uuidv4 } from "uuid";
import { getTicketByIdRequest } from "../../services/tickets";
interface Message {
  idRef: string;
  ticket: { id: number };
  fecha: Date | string;
  emisor: { id: number; firstName?: string; lastName?: string };
  mensaje: string;
}

interface ChatProps {
  ticketId: number;
  userId: number;
}

export const Chat: React.FC<ChatProps> = ({ ticketId, userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showFab, setShowFab] = useState(false);

  // Cargar mensajes históricos y configurar el socket
  useEffect(() => {
    const fetchHistoricMessages = async () => {
      const ticket = await getTicketByIdRequest(ticketId);
      setMessages(ticket.mensajes || []);
    };

    const initSocket = async () => {
      await connect();
      if (socket) {
        await fetchHistoricMessages();
        socket.emit("joinChat", ticketId);
        console.log("Se unió al chat", ticketId);
        socket.on("message", (data: Message) => {
          setMessages((prev) =>
            prev.some((msg) => msg.idRef === data.idRef)
              ? prev
              : [...prev, data]
          );
        });
      }
    };

    initSocket();

    return () => {
      if (socket) {
        socket.off("message");
      }
      disconnect();
    };
  }, [ticketId]);

  // Enviar mensaje
  const handleSend = () => {
    if (message.trim() === "") return;
    const newMessage: Message = {
      idRef: uuidv4(),
      ticket: { id: ticketId },
      fecha: new Date(),
      emisor: { id: userId },
      mensaje: message,
    };
    // Actualización optimista de la UI
    setMessages((prev) => [...prev, newMessage]);
    if (socket) {
      socket.emit("message", newMessage);
    }
    setMessage("");
  };

  // Scroll automático al final cuando cambian los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Agrupar mensajes por fecha utilizando un objeto tipado
  const groupedMessages = messages.reduce<Record<string, Message[]>>(
    (groups, msg) => {
      const date = new Date(msg.fecha).toISOString().split("T")[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
      return groups;
    },
    {}
  );

  // Controlar el scroll para mostrar u ocultar el FAB
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    setShowFab(distanceFromBottom > 400);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        height: "84vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.paper",
      }}
    >
      {/* Área de mensajes con scroll y agrupación por fecha */}
      <Box
        ref={scrollContainerRef}
        onScroll={handleScroll}
        sx={{
          flex: 1,
          overflowY: "auto",
          mb: 2,
        }}
      >
        {Object.keys(groupedMessages)
          .sort() // Se ordenan las fechas de forma ascendente
          .map((date) => (
            <Box key={date}>
              <Divider sx={{ my: 2 }} />
              <Typography align="center" variant="subtitle2">
                {date}
              </Typography>
              {groupedMessages[date].map((msg) => (
                <ListItem
                  key={msg.idRef}
                  sx={{
                    justifyContent:
                      msg.emisor.id === userId ? "flex-end" : "flex-start",
                  }}
                >
                  <ListItemText
                    primary={msg.mensaje}
                    secondary={
                      msg.emisor.id === userId
                        ? `Tú - ${new Date(msg.fecha).toLocaleTimeString()}`
                        : `${msg.emisor.firstName} ${
                            msg.emisor.lastName
                          } - ${new Date(msg.fecha).toLocaleTimeString()}`
                    }
                    sx={{
                      backgroundColor:
                        msg.emisor.id === userId
                          ? "primary.main"
                          : "secondary.main",
                      color:
                        msg.emisor.id === userId
                          ? "primary.contrastText"
                          : "secondary.contrastText",
                      p: 1,
                      borderRadius: 1,
                      maxWidth: "80%",
                    }}
                    secondaryTypographyProps={{
                      variant: "caption",
                      color:
                        msg.emisor.id === userId
                          ? "primary.contrastText"
                          : "secondary.contrastText",
                      align: "right",
                    }}
                  />
                </ListItem>
              ))}
            </Box>
          ))}
        <div ref={messagesEndRef} />
      </Box>
      <Divider sx={{ my: 1 }} />
      {/* Área de entrada de mensaje */}
      <Box sx={{ display: "flex" }}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          placeholder="Escribe un mensaje"
          variant="outlined"
          size="small"
        />
        <IconButton color="primary" onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Box>
      {/* Botón flotante para ir al final */}
      {showFab && (
        <Fab
          size="small"
          color="primary"
          onClick={() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTop =
                scrollContainerRef.current.scrollHeight;
            }
          }}
          sx={{ position: "absolute", bottom: 80, right: 16 }}
        >
          <ArrowDownwardIcon />
        </Fab>
      )}
    </Paper>
  );
};
