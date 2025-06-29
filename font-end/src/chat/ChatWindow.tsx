import React, { useEffect, useState, useRef } from "react";
// SỬA LỖI: Đây là cách import chính xác cho các phiên bản socket.io-client mới
import io, { Socket } from "socket.io-client";
import { useAuthStore } from "../store/authStore"; // <-- Đảm bảo đường dẫn này đúng
import api from "../Api"; // <-- Đảm bảo đường dẫn này đúng
import styles from "./Chat.module.scss";

// --- Giữ nguyên các Interface ---
interface IAuthor {
  _id: string;
  username: string;
  avatar?: string;
}
interface IMessage {
  _id: string;
  content: string;
  author: IAuthor;
  createdAt: string;
  channel_id: string;
}

const ChatWindow: React.FC<{ channelId: string | undefined }> = ({
  channelId,
}) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  // Dòng này bây giờ sẽ hoạt động vì Socket được import đúng
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const token = useAuthStore((state) => state.token);
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!channelId) return;
    setMessages([]);

    const fetchOldMessages = async () => {
      try {
        const response = await api.get(`/message/channel/${channelId}`);
        setMessages((response.data as IMessage[]).reverse());
      } catch (error) {
        console.error("Không thể tải tin nhắn cũ:", error);
      }
    };
    fetchOldMessages();

    const socket = io("http://localhost:9090", { auth: { token } });
    socketRef.current = socket;

    socket.emit("joinRoom", channelId);

    const handleNewMessage = (newMessage: IMessage) => {
      if (newMessage.channel_id === channelId) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.emit("leaveRoom", channelId);
      socket.disconnect();
    };
  }, [channelId, token]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && socketRef.current) {
      socketRef.current.emit("sendMessage", {
        channel_id: channelId,
        content: input,
      });
      setInput("");
    }
  };

  // --- Giữ nguyên toàn bộ JSX giao diện nâng cấp ---
  return (
    <main className={styles.chatWindow}>
      <header className={styles.chatHeader}>
        <span className={styles.headerHashtag}>#</span>
        <h1 className={styles.headerTitle}>{channelId}</h1>
      </header>

      <div className={styles.messagesList}>
        {messages.map((msg, index) => {
          const isFirstMessage =
            index === 0 || messages[index - 1].author._id !== msg.author._id;
          return (
            <div
              key={msg._id}
              className={`${styles.messageItem} ${
                isFirstMessage ? styles.first : ""
              }`}
            >
              {isFirstMessage && (
                <img
                  src={msg.author.avatar || "/default-avatar.png"}
                  alt="avatar"
                  className={styles.avatar}
                />
              )}
              <div className={styles.messageContent}>
                {isFirstMessage && (
                  <div className={styles.authorHeader}>
                    <span className={styles.authorName}>
                      {msg.author.username}
                    </span>
                    <span className={styles.timestamp}>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
                <p className={styles.content}>{msg.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className={styles.messageForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Nhắn vào #${channelId}`}
          autoComplete="off"
        />
      </form>
    </main>
  );
};

export default ChatWindow;
