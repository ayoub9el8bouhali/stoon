import { apiRequest } from "./api.js";
import { escapeHtml, initAccountNav, requireAuth, showFeedback } from "./account.js";

initAccountNav("messages");
const currentUser = await requireAuth();
const conversationsRoot = document.querySelector("#conversations");
const messagesRoot = document.querySelector("#messages");
const heading = document.querySelector("#message-heading");
const form = document.querySelector("#message-form");
const feedback = document.querySelector("#feedback");
const participantId = Number(new URLSearchParams(location.search).get("participantId")) || null;
let activeConversation = null;

const renderMessages = messages => {
  messagesRoot.innerHTML = messages.length ? messages.map(message => `
    <article class="message-bubble ${message.senderId === currentUser.id ? "mine" : ""}">
      <strong>${escapeHtml(message.sender?.firstName || (message.senderId === currentUser.id ? "Vous" : "Membre STOON"))}</strong>
      <p>${escapeHtml(message.body)}</p>
    </article>`).join("") : `<p class="text-secondary">Commencez la conversation.</p>`;
  messagesRoot.scrollTop = messagesRoot.scrollHeight;
};

const openConversation = async (id, title) => {
  activeConversation = id;
  heading.innerHTML = `<h2>${escapeHtml(title)}</h2>`;
  const { data } = await apiRequest(`/messages/conversations/${id}`);
  renderMessages(data);
};

const loadConversations = async () => {
  const { data } = await apiRequest("/messages/conversations");
  conversationsRoot.innerHTML = data.length ? data.map(item => `
    <button class="conversation-item" type="button" data-conversation="${item.id}" data-title="${escapeHtml(item.title || "Conversation STOON")}">
      <strong>${escapeHtml(item.title || "Conversation STOON")}</strong>
      <span>${escapeHtml(item.messages?.[0]?.body || "Ouvrir la conversation")}</span>
    </button>`).join("") : `<p class="text-secondary">Aucune conversation.</p>`;
  if (!participantId && data[0]) await openConversation(data[0].id, data[0].title);
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
      await apiRequest(`/messages/conversations/${activeConversation}`, { method: "POST", body: JSON.stringify({ body }) });
      await openConversation(activeConversation, heading.textContent);
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
    feedback.textContent = "";
  } catch (error) {
    showFeedback(feedback, error.message);
  }
});

try {
  await loadConversations();
} catch (error) {
  conversationsRoot.innerHTML = `<div class="alert alert-warning">${escapeHtml(error.message)}</div>`;
}
