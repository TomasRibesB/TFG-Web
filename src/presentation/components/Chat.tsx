import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
  Divider,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { socket, connect, disconnect } from "../../services/socket";
import { v4 as uuidv4 } from "uuid";
import { getTicketByIdRequest } from "../../services/tickets";

interface ChatProps {
  ticketId: number;
  userId: number;
}

export const Chat: React.FC<ChatProps> = ({ ticketId, userId }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHistoricMessages = async () => {
      const ticket = await getTicketByIdRequest(ticketId);
      setMessages(ticket.mensajes || []);
    };

    const initSocket = async () => {
      await connect();
      if (socket) {
        // Recupera mensajes históricos
        await fetchHistoricMessages();
        socket.emit("joinChat", ticketId);
        console.log("Se unió al chat", ticketId);
        socket.on("message", (data: any) => {
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

  const handleSend = () => {
    if (message.trim() === "") return;
    const newMessage = {
      idRef: uuidv4(),
      ticket: { id: ticketId },
      fecha: new Date(),
      emisor: { id: userId },
      mensaje: message,
    };
    // Actualización inmediata (optimista)
    setMessages((prev) => [...prev, newMessage]);
    socket.emit("message", newMessage);
    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        height: "84vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <List sx={{ flex: 1, overflowY: "auto" }}>
        {messages.map((msg) => (
          <ListItem
            key={msg.idRef}
            sx={{
              justifyContent:
                msg.emisor.id === userId ? "flex-end" : "flex-start",
            }}
          >
            <ListItemText
              primary={msg.mensaje}
              secondary={new Date(msg.fecha).toLocaleTimeString()}
            />
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>
      <Divider sx={{ my: 1 }} />
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
    </Paper>
  );
};
