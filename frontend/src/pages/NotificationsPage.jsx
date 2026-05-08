import { CheckCheck } from "lucide-react";
import { useData } from "../context/DataContext.jsx";
import { formatDate } from "../utils/formatters.js";

export function NotificationsPage() {
  const { notifications, markNotificationRead } = useData();

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Notifications</h1>
          <p>Messages, réservations, avis et alertes système.</p>
        </div>
      </div>

      <section className="notification-list">
        {notifications.map((notification) => (
          <article key={notification.id} className={!notification.isRead ? "unread" : ""}>
            <div>
              <span className={`notification-type type-${notification.type}`}>{notification.type}</span>
              <h2>{notification.title}</h2>
              <p>{notification.body}</p>
              <small>{formatDate(notification.createdAt)}</small>
            </div>
            {!notification.isRead && (
              <button className="btn btn-stoon-outline" onClick={() => markNotificationRead(notification.id)}>
                <CheckCheck size={18} />
                Lu
              </button>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
