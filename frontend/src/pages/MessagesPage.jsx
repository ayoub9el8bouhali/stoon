import { useState } from "react";
import { Send } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useData } from "../context/DataContext.jsx";
import { fullName, formatDate } from "../utils/formatters.js";
import { mockUsers } from "../utils/mockData.js";

export function MessagesPage() {
  const { user } = useAuth();
  const { conversations, sendMessage } = useData();
  const [activeId, setActiveId] = useState(conversations[0]?.id);
  const [draft, setDraft] = useState("");
  const active = conversations.find((conversation) => conversation.id === activeId);

  const submit = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    sendMessage(active.id, user.id, draft.trim());
    setDraft("");
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Messagerie</h1>
          <p>Conversations privées avec temps réel simulé.</p>
        </div>
      </div>

      <section className="messages-shell">
        <aside className="conversation-list">
          {conversations.map((conversation) => {
            const otherUserId = conversation.participantIds.find((id) => id !== user?.id) || conversation.participantIds[0];
            const otherUser = mockUsers.find((candidate) => candidate.id === otherUserId);
            const lastMessage = conversation.messages[conversation.messages.length - 1];

            return (
              <button
                key={conversation.id}
                className={conversation.id === activeId ? "active" : ""}
                onClick={() => setActiveId(conversation.id)}
              >
                <span className="avatar-sm">{otherUser?.firstName?.charAt(0)}</span>
                <span>
                  <strong>{conversation.title}</strong>
                  <small>{lastMessage?.body}</small>
                </span>
              </button>
            );
          })}
        </aside>

        <main className="chat-panel">
          {active ? (
            <>
              <div className="chat-header">
                <h2>{active.title}</h2>
                <span>{active.messages.length} message(s)</span>
              </div>
              <div className="chat-stream">
                {active.messages.map((message) => {
                  const sender = mockUsers.find((candidate) => candidate.id === message.senderId);
                  const own = message.senderId === user?.id;
                  return (
                    <div key={message.id} className={`chat-bubble ${own ? "own" : ""}`}>
                      <strong>{fullName(sender)}</strong>
                      <p>{message.body}</p>
                      <small>{formatDate(message.createdAt)}</small>
                    </div>
                  );
                })}
              </div>
              <form className="chat-form" onSubmit={submit}>
                <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Écrire un message..." />
                <button className="btn btn-stoon-primary" type="submit">
                  <Send size={18} />
                  Envoyer
                </button>
              </form>
            </>
          ) : (
            <div className="empty-state">
              <h2>Aucune conversation</h2>
            </div>
          )}
        </main>
      </section>
    </div>
  );
}
