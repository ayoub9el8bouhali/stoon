(() => {
  const root = document.createElement("div");
  root.innerHTML = `
    <button class="stoon-chatbot-toggle" type="button" aria-label="Ouvrir le chatbot STOON">💬</button>
    <section class="stoon-chatbot-panel" aria-label="Chatbot STOON">
      <header class="stoon-chatbot-header">
        <div><strong>Assistant STOON</strong><small>Votre guide étudiant intelligent</small></div>
        <div class="stoon-chatbot-header-actions">
          <button class="stoon-chatbot-reset" type="button" aria-label="Nouvelle conversation">↻</button>
          <button class="stoon-chatbot-close" type="button" aria-label="Fermer">×</button>
        </div>
      </header>
      <div class="stoon-chatbot-stream" aria-live="polite"></div>
      <div class="stoon-chatbot-suggestions"></div>
      <form class="stoon-chatbot-teach">
        <input name="answer" placeholder="Apprenez-moi la bonne réponse..." required>
        <button type="submit">Apprendre</button>
      </form>
      <form class="stoon-chatbot-form">
        <input name="message" placeholder="Posez votre question..." autocomplete="off" required>
        <button type="submit">Envoyer</button>
      </form>
    </section>`;
  document.body.append(root);

  const panel = root.querySelector(".stoon-chatbot-panel");
  const stream = root.querySelector(".stoon-chatbot-stream");
  const form = root.querySelector(".stoon-chatbot-form");
  const teachForm = root.querySelector(".stoon-chatbot-teach");
  const suggestions = root.querySelector(".stoon-chatbot-suggestions");
  let unknownQuestion = "";
  let conversationContext = "";

  const addMessage = (text, type = "bot") => {
    const message = document.createElement("div");
    message.className = `stoon-chatbot-message ${type}`;
    message.textContent = text;
    stream.append(message);
    stream.scrollTop = stream.scrollHeight;
    return message;
  };

  const addItems = (items = []) => {
    items.forEach((item) => {
      const card = document.createElement("a");
      card.href = item.url;
      card.className = "stoon-chatbot-result";
      card.innerHTML = `<strong></strong><span></span><small></small>`;
      card.querySelector("strong").textContent = item.title;
      card.querySelector("span").textContent = item.meta;
      card.querySelector("small").textContent = item.detail;
      stream.append(card);
    });
    stream.scrollTop = stream.scrollHeight;
  };

  const showSuggestions = (values = []) => {
    suggestions.replaceChildren();
    values.forEach((value) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = value;
      button.addEventListener("click", () => {
        if (value === "Nouvelle recherche") {
          resetConversation();
          return;
        }
        if (value === "Voir plus de détails") {
          addMessage("Cliquez sur une carte de résultat pour ouvrir la page correspondante.");
          showSuggestions([]);
          return;
        }
        if (value === "Élargir la recherche") {
          conversationContext = "";
          addMessage("D'accord. Donnez-moi de nouveaux critères, par exemple une autre ville ou un budget différent.");
          showSuggestions([]);
          return;
        }
        form.elements.message.value = value;
        form.requestSubmit();
      });
      suggestions.append(button);
    });
  };

  const setThinking = (active) => {
    root.querySelector(".stoon-chatbot-thinking")?.remove();
    if (active) {
      const thinking = addMessage("STOON réfléchit...", "bot stoon-chatbot-thinking");
      thinking.setAttribute("aria-label", "Assistant en cours de réponse");
    }
  };

  const post = async (url, body) => {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "L'assistant STOON est indisponible.");
        return data;
      } catch {
        if (attempt === 1) {
          throw new Error("Impossible de contacter l'assistant STOON. Veuillez réessayer dans quelques secondes.");
        }
      }
    }
  };

  const resetConversation = () => {
    conversationContext = "";
    unknownQuestion = "";
    teachForm.classList.remove("open");
    stream.replaceChildren();
    addMessage("Bonjour ! Décrivez ce que vous recherchez et je consulterai les informations disponibles sur STOON.");
    showSuggestions(["Je cherche un logement", "Je cherche un covoiturage", "Je cherche un stage", "Je cherche une école"]);
  };

  root.querySelector(".stoon-chatbot-toggle").addEventListener("click", () => {
    panel.classList.toggle("open");
    if (panel.classList.contains("open")) form.elements.message.focus();
  });
  root.querySelector(".stoon-chatbot-close").addEventListener("click", () => panel.classList.remove("open"));
  root.querySelector(".stoon-chatbot-reset").addEventListener("click", resetConversation);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = form.elements.message;
    const question = input.value.trim();
    if (!question) return;
    addMessage(question, "user");
    input.value = "";
    input.disabled = true;
    showSuggestions([]);
    setThinking(true);
    try {
      const result = await post("/api/chatbot/ask", { message: question, context: conversationContext });
      setThinking(false);
      addMessage(result.reply);
      addItems(result.items);
      conversationContext = result.nextContext || "";
      unknownQuestion = result.needsTeaching ? question : "";
      teachForm.classList.toggle("open", result.needsTeaching && !conversationContext);
      showSuggestions(result.suggestions || []);
    } catch (error) {
      setThinking(false);
      addMessage(error.message);
    } finally {
      input.disabled = false;
      input.focus();
    }
  });

  teachForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = teachForm.elements.answer;
    try {
      const result = await post("/api/chatbot/teach", { question: unknownQuestion, answer: input.value.trim() });
      addMessage(result.reply);
      input.value = "";
      unknownQuestion = "";
      teachForm.classList.remove("open");
    } catch (error) {
      addMessage(error.message);
    }
  });

  resetConversation();
})();
