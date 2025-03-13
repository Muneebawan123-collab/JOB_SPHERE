import { useState, useEffect } from "react";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}`);
      fetchNotifications(); // Refresh list
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id} style={{ background: notification.isRead ? "#ddd" : "#fff" }}>
            {notification.message}
            {!notification.isRead && <button onClick={() => markAsRead(notification._id)}>Mark as Read</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
