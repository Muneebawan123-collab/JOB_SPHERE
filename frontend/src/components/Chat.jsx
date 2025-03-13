import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5001");

const Chat = ({ currentUser, selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetchMessages();

    socket.on("receiveMessage", (message) => {
      if (
        (message.senderId === currentUser._id && message.receiverId === selectedUser._id) ||
        (message.senderId === selectedUser._id && message.receiverId === currentUser._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedUser]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/${selectedUser._id}`);
      setMessages(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = { senderId: currentUser._id, receiverId: selectedUser._id, message: newMessage };
    socket.emit("sendMessage", messageData);

    try {
      await axios.post("http://localhost:5000/api/messages", messageData);
      setNewMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Chat with {selectedUser.name}</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index} style={{ textAlign: msg.senderId === currentUser._id ? "right" : "left" }}>
            {msg.message}
          </p>
        ))}
      </div>
      <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
