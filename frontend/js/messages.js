import { apiRequest } from "./api.js";
import { escapeHtml, initAccountNav, requireAuth, showFeedback } from "./account.js";

initAccountNav("messages");
const currentUser = await requireAuth();
const conversationsRoot = document.querySelector("#conversations");
const messagesRoot = document.querySelector("#messages");
const heading = document.querySelector("#message-heading");
const form = document.querySelector("#message-form");
const feedback = document.querySelector("#feedback");
const search = document.querySelector("#conversation-search");
const refresh = document.querySelector("#refresh-conversations");
const messageCount = document.querySelector("#message-count");
const participantId = Number(new URLSearchParams(location.search).get("participantId")) || null;
let activeConversation = null;
let conversations = [];

const formatTime = value => value ? new Date(value).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) : "";
const conversationTitle = item => {
  const other = item.otherParticipants?.[0];
  return other ? `${other.firstName} ${other.lastName}` : item.title || "Conversation STOON";
};

const appendMessage = message => {
  const article = document.createElement("article");
  article.className = `message-bubble ${message.senderId === currentUser.id ? "mine" : ""}`;
  article.innerHTML = `<strong>${escapeHtml(message.sender?.firstName || (message.senderId === currentUser.id ? "Vous" : "Membre STOON"))}</strong>
    <p>${escapeHtml(message.body)}</p><time>${escapeHtml(formatTime(message.createdAt))}</time>`;
  messagesRoot.append(article);
  messagesRoot.scrollTop = messagesRoot.scrollHeight;
};

const renderMessages = messages => {
  messagesRoot.replaceChildren();
  if (messages.length) messages.forEach(appendMessage);
  else messagesRoot.innerHTML = `<p class="text-secondary">Commencez la conversation.</p>`;
};

const openConversation = async (id, title) => {
  activeConversation = id;
  heading.innerHTML = `<h2>${escapeHtml(title)}</h2><button id="refresh-messages" type="button">Actualiser</button>`;
  const { data, meta } = await apiRequest(`/messages/conversations/${id}`);
  renderMessages(data);
  if (meta?.hasOlderMessages) {
    messagesRoot.insertAdjacentHTML("afterbegin", `<p class="message-limit">Les 100 messages les plus récents sont affichés.</p>`);
  }
  const current = conversations.find(item => item.id === Number(id));
  if (current) current.unread = false;
  document.querySelector("#refresh-messages").addEventListener("click", () => openConversation(id, title));
  renderConversations(conversations);
};

const renderConversations = items => {
  conversationsRoot.innerHTML = items.length ? items.map(item => {
    const other = item.otherParticipants?.[0];
    const title = conversationTitle(item);
    return `<button class="conversation-item ${item.unread ? "unread" : ""} ${Number(activeConversation) === item.id ? "active" : ""}" type="button" data-conversation="${item.id}" data-title="${escapeHtml(title)}">
      <span class="conversation-avatar">${escapeHtml(other?.firstName?.[0] || "S")}${escapeHtml(other?.lastName?.[0] || "")}</span>
      <span class="conversation-copy"><strong>${escapeHtml(title)}</strong>
      <small>${escapeHtml(item.messages?.[0]?.body || "Ouvrir la conversation")}</small>
      <time>${escapeHtml(formatTime(item.lastMessageAt))}</time></span>
      ${item.unread ? `<i aria-label="Non lu"></i>` : ""}
    </button>`).join("") : `<p class="text-secondary">Aucune conversation.</p>`;
};

const loadConversations = async () => {
  const { data } = await apiRequest("/messages/conversations");
  conversations = data;
  renderConversations(conversations);
  if (!participantId && !activeConversation && data[0]) await openConversation(data[0].id, conversationTitle(data[0]));
};

conversationsRoot.addEventListener("click", event => {
  const button = event.target.closest("[data-conversation]");
  if (button) openConversation(button.dataset.conversation, button.dataset.title);
});

if (participantId) {
  heading.innerHTML = `<h2>Nouveau message</h2><p>Écrivez un premier message pour démarrer la conversation.</p>`;
  messagesRoot.innerHTML = `<p class="text-secondary">Cette conversation sera créée à l’envoi.</p>`;
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const body = form.elements.body.value.trim();
  if (!body) return;
  try {
    if (activeConversation) {
      const { data } = await apiRequest(`/messages/conversations/${activeConversation}`, { method: "POST", body: JSON.stringify({ body }) });
      if (messagesRoot.querySelector(".text-secondary")) messagesRoot.replaceChildren();
      appendMessage(data);
      loadConversations();
    } else if (participantId) {
      const result = await apiRequest("/messages/conversations", { method: "POST", body: JSON.stringify({ participantId, body }) });
      activeConversation = result.data.id;
      history.replaceState({}, "", `/pages/messages.html?conversation=${activeConversation}`);
      await loadConversations();
      await openConversation(activeConversation, result.data.title);
    } else {
      throw new Error("Sélectionnez une conversation ou contactez un auteur depuis une annonce.");
    }
    form.reset();
    messageCount.textContent = "0 / 4000";
    feedback.textContent = "";
  } catch (error) {
    showFeedback(feedback, error.message);
  }
});

form.elements.body.addEventListener("input", event => {
  messageCount.textContent = `${event.target.value.length} / 4000`;
});
form.elements.body.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});
search.addEventListener("input", event => {
  const query = event.target.value.trim().toLocaleLowerCase("fr");
  renderConversations(query
    ? conversations.filter(item => JSON.stringify(item).toLocaleLowerCase("fr").includes(query))
    : conversations);
});
refresh.addEventListener("click", loadConversations);

try {
  await loadConversations();
} catch (error) {
  conversationsRoot.innerHTML = `<div class="alert alert-warning">${escapeHtml(error.message)}</div>`;
}
