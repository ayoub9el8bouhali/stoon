import json
import os
import random
import re
import sys
import unicodedata
from datetime import datetime
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent

REPONSES_MOTS_CLES = {
    "bonjour": "Bonjour ! Comment puis-je vous aider sur STOON ?",
    "salut": "Salut ! Ravi de discuter avec vous.",
    "hello": "Hello! How can I assist you today?",
    "hi": "Hi! How can I assist you today?",
    "merci": "Avec plaisir !",
    "aide": (
        "Je peux vous aider avec les colocations, covoiturages, écoles, "
        "stages, jobs et l'utilisation de STOON."
    ),
    "nom": "Je m'appelle STOON, votre assistant virtuel.",
    "stoon": (
        "STOON est une plateforme étudiante marocaine pour trouver des "
        "colocations, covoiturages, documents, écoles, stages et jobs."
    ),
    "colocation": (
        "Colocation : ouvrez la rubrique Colocation pour rechercher une "
        "annonce par ville, école et budget."
    ),
    "covoiturage": (
        "Covoiturage : ouvrez la rubrique Covoiturage pour chercher un "
        "trajet selon le départ, la destination et la date."
    ),
    "école": "La rubrique Écoles permet de consulter les établissements et leurs filières.",
    "ecole": "La rubrique Écoles permet de consulter les établissements et leurs filières.",
    "stage": "La rubrique Stages & Jobs regroupe les opportunités destinées aux étudiants.",
    "job": "La rubrique Stages & Jobs regroupe les opportunités destinées aux étudiants.",
    "documents": "La rubrique Documents permet de retrouver des ressources étudiantes.",
    "chatbot": "Je suis votre assistant intelligent STOON.",
    "python": "Je suis votre assistant intelligent STOON, conçu pour vous guider dans la plateforme.",
}

BLAGUES = [
    "Pourquoi les développeurs aiment-ils le mode sombre ? Parce que la lumière attire les bugs.",
    "Un étudiant dit à son code : fonctionne aujourd'hui, la soutenance est demain.",
]

CITIES = ("Rabat", "Casablanca", "Marrakech", "Tanger", "Fès", "Agadir", "Meknès")


def normalize_text(value):
    text = unicodedata.normalize("NFD", str(value).lower())
    text = "".join(character for character in text if unicodedata.category(character) != "Mn")
    typo_fixes = {
        "aparteman": "appartement",
        "apartement": "appartement",
        "covoiturag": "covoiturage",
        "casablancca": "casablanca",
        "ecol": "ecole",
    }
    for typo, replacement in typo_fixes.items():
        text = text.replace(typo, replacement)
    return " ".join(text.split())


def extract_city(message):
    normalized = normalize_text(message)
    return next(
        (
            city
            for city in CITIES
            if re.search(rf"(?<!\w){re.escape(normalize_text(city))}(?!\w)", normalized)
        ),
        "",
    )


def extract_cities(message):
    normalized = normalize_text(message)
    matches = [
        (match.start(), city)
        for city in CITIES
        if (match := re.search(rf"(?<!\w){re.escape(normalize_text(city))}(?!\w)", normalized))
    ]
    return [city for _, city in sorted(matches)]


def extract_budget(message):
    match = re.search(r"(\d{3,5})", message.replace(" ", ""))
    return int(match.group(1)) if match else None


def extract_housing_type(message):
    return next((kind for kind in ("chambre", "studio", "appartement", "colocation") if kind in message), "")


def pack_context(step, *values):
    return "|".join([step, *(str(value) for value in values)])


def unpack_context(context):
    parts = str(context or "").split("|")
    return parts[0], parts[1:]


def detect_intent(message):
    if any(word in message for word in ("appartement", "logement", "louer", "location", "chambre", "studio", "coloc")):
        city = extract_city(message)
        budget = extract_budget(message)
        housing_type = extract_housing_type(message)
        if city and budget:
            return {
                "reply": f"Je recherche les logements disponibles à {city} avec un budget maximal de {budget} MAD.",
                "nextContext": "",
                "search": {"type": "housing", "city": city, "budget": budget, "housingType": housing_type},
            }
        if city:
            return {
                "reply": f"D'accord, vous cherchez à {city}. Quel est votre budget mensuel maximum ?",
                "nextContext": pack_context("housing_budget", city),
            }
        return {
            "reply": (
                "Très bien. Dans quelle ville cherchez-vous votre logement ? "
                "Par exemple : Casablanca, Rabat ou Marrakech."
            ),
            "nextContext": "housing_city",
        }

    if any(word in message for word in ("trajet", "voyager", "voyage", "transport", "voiture", "conducteur", "passager")):
        cities = extract_cities(message)
        if len(cities) >= 2:
            return {
                "reply": f"Je recherche les trajets actifs de {cities[0]} à {cities[1]}.",
                "nextContext": "",
                "search": {"type": "ride", "departureCity": cities[0], "destinationCity": cities[1]},
            }
        return {
            "reply": "Quelle est votre ville de départ et votre destination ?",
            "nextContext": "ride_route",
        }

    if any(word in message for word in ("opportunité", "opportunite", "emploi", "travail", "recrutement", "stage", "job", "pfe")):
        city = extract_city(message)
        opportunity_type = "stage" if "stage" in message or "pfe" in message else ""
        if city or opportunity_type:
            return {
                "reply": "Je recherche les opportunités actives correspondant à votre demande.",
                "nextContext": "",
                "search": {"type": "job", "city": city, "opportunityType": opportunity_type},
            }
        return {
            "reply": "Quel domaine vous intéresse et dans quelle ville cherchez-vous cette opportunité ?",
            "nextContext": "job_details",
        }

    if any(word in message for word in ("école", "ecole", "université", "universite", "filière", "filiere", "formation")):
        city = extract_city(message)
        if city:
            return {
                "reply": f"Je recherche les établissements référencés à {city}.",
                "nextContext": "",
                "search": {"type": "school", "city": city},
            }
        return {
            "reply": "Quel domaine d'études souhaitez-vous suivre et dans quelle ville ?",
            "nextContext": "school_details",
        }

    if any(word in message for word in ("document", "cours", "examen", "résumé", "resume", "support", "pdf")):
        return {
            "reply": "Quelle matière, filière et niveau recherchez-vous ?",
            "nextContext": "document_details",
        }

    if any(word in message for word in ("connexion", "connecter", "compte", "mot de passe", "login")):
        return {
            "reply": "Pour vous connecter, utilisez votre adresse email et votre mot de passe. En cas d'échec, vérifiez leur saisie.",
            "nextContext": "",
        }

    return None


def continue_context(message, context):
    display_message = str(message).strip()
    clean_message = normalize_text(display_message)
    step, values = unpack_context(context)
    if step == "housing_city":
        city = extract_city(clean_message) or display_message.title()
        return {
            "reply": f"D'accord, vous cherchez à {city}. Quel est votre budget mensuel maximum ?",
            "nextContext": pack_context("housing_budget", city),
        }
    if step == "housing_budget":
        city = values[0] if values else ""
        budget = extract_budget(clean_message)
        if not budget:
            return {"reply": "Indiquez votre budget avec un nombre, par exemple 2500 MAD.", "nextContext": context}
        return {
            "reply": f"Budget noté : {budget} MAD. Préférez-vous une chambre, un studio, un appartement ou une colocation ?",
            "nextContext": pack_context("housing_type", city, budget),
        }
    if step == "housing_type":
        city = values[0] if values else ""
        budget = int(values[1]) if len(values) > 1 and values[1].isdigit() else None
        housing_type = extract_housing_type(clean_message)
        return {
            "reply": "Je consulte maintenant les logements actifs correspondant à vos critères.",
            "nextContext": "",
            "search": {"type": "housing", "city": city, "budget": budget, "housingType": housing_type},
        }
    if step == "ride_route":
        cities = extract_cities(clean_message)
        if len(cities) >= 2:
            return {
                "reply": f"Je recherche les trajets actifs de {cities[0]} à {cities[1]}.",
                "nextContext": "",
                "search": {"type": "ride", "departureCity": cities[0], "destinationCity": cities[1]},
            }
        return {"reply": "Indiquez deux villes, par exemple Casablanca vers Rabat.", "nextContext": context}
    if step == "ride_schedule":
        return {"reply": f"Horaire noté : {display_message}. Indiquez maintenant le nombre de places souhaité.", "nextContext": ""}
    if step == "job_details":
        city = extract_city(clean_message)
        opportunity_type = "stage" if "stage" in clean_message or "pfe" in clean_message else ""
        return {
            "reply": "Je recherche les opportunités actives correspondant à ces critères.",
            "nextContext": "",
            "search": {"type": "job", "city": city, "opportunityType": opportunity_type},
        }
    if step == "school_details":
        city = extract_city(clean_message)
        return {
            "reply": "Je recherche les établissements correspondant à ces critères.",
            "nextContext": "",
            "search": {"type": "school", "city": city, "query": "" if city else display_message},
        }
    if step == "document_details":
        return {"reply": f"Recherche notée : {display_message}. Vérifiez le programme, l'année et la fiabilité du document.", "nextContext": ""}
    return None


class ChatbotStoon:
    def __init__(self, knowledge_path=None, history_path=None):
        self.knowledge_path = Path(
            knowledge_path or os.environ.get("STOON_CHATBOT_KNOWLEDGE") or BASE_DIR / "connaissances.json"
        )
        self.history_path = Path(
            history_path or os.environ.get("STOON_CHATBOT_HISTORY") or BASE_DIR / "historique.txt"
        )
        self.knowledge = self.load_knowledge()

    def load_knowledge(self):
        if not self.knowledge_path.exists():
            return {}
        try:
            content = json.loads(self.knowledge_path.read_text(encoding="utf-8"))
            return content if isinstance(content, dict) else {}
        except (json.JSONDecodeError, OSError):
            return {}

    def save_knowledge(self):
        self.knowledge_path.parent.mkdir(parents=True, exist_ok=True)
        self.knowledge_path.write_text(
            json.dumps(self.knowledge, indent=2, ensure_ascii=False),
            encoding="utf-8",
        )

    def save_history(self, user_message, bot_reply):
        self.history_path.parent.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with self.history_path.open("a", encoding="utf-8") as history:
            history.write(f"[{timestamp}]\n")
            history.write(f"Utilisateur : {user_message}\n")
            history.write(f"Bot : {bot_reply}\n")
            history.write("-" * 40 + "\n")

    def respond(self, message, context=""):
        clean_message = normalize_text(message)

        if not clean_message:
            reply = "Écrivez une question pour que je puisse vous aider."
            return {"success": True, "reply": reply, "needsTeaching": False, "nextContext": context}

        contextual_response = continue_context(message, context)
        next_context = ""
        search = None

        if contextual_response:
            reply = contextual_response["reply"]
            next_context = contextual_response["nextContext"]
            search = contextual_response.get("search")
        elif "date" in clean_message:
            reply = "La date d'aujourd'hui est : " + datetime.now().strftime("%d/%m/%Y")
        elif "heure" in clean_message:
            reply = "L'heure actuelle est : " + datetime.now().strftime("%H:%M:%S")
        elif "blague" in clean_message:
            reply = random.choice(BLAGUES)
        elif clean_message in self.knowledge:
            reply = self.knowledge[clean_message]
        else:
            intent = detect_intent(clean_message)
            if intent:
                reply = intent["reply"]
                next_context = intent["nextContext"]
                search = intent.get("search")
            else:
                reply = next(
                    (answer for keyword, answer in REPONSES_MOTS_CLES.items() if keyword in clean_message),
                    None,
                )

        needs_teaching = reply is None
        if needs_teaching:
            reply = "Je ne connais pas encore la réponse à cette question. Voulez-vous me l'apprendre ?"

        self.save_history(message, reply)
        return {
            "success": True,
            "reply": reply,
            "needsTeaching": needs_teaching,
            "nextContext": next_context,
            "search": search,
        }

    def teach(self, question, answer):
        clean_question = normalize_text(question)
        clean_answer = str(answer).strip()
        if not clean_question or not clean_answer:
            raise ValueError("La question et la réponse sont obligatoires.")

        self.knowledge[clean_question] = clean_answer
        self.save_knowledge()
        self.save_history(question, clean_answer)
        return {"success": True, "reply": "Merci ! J'ai appris une nouvelle réponse."}


def run_command(payload):
    bot = ChatbotStoon()
    action = payload.get("action", "ask")
    if action == "teach":
        return bot.teach(payload.get("question", ""), payload.get("answer", ""))
    return bot.respond(payload.get("message", ""), payload.get("context", ""))


if __name__ == "__main__":
    try:
        request = json.loads(sys.stdin.read() or "{}")
        print(json.dumps(run_command(request), ensure_ascii=False))
    except Exception as error:
        print(json.dumps({"success": False, "message": str(error)}, ensure_ascii=False))
        sys.exit(1)
