import json
import tempfile
import unittest
from pathlib import Path

from chatbot.chatbot import ChatbotStoon


class ChatbotStoonTest(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        root = Path(self.temp_dir.name)
        self.bot = ChatbotStoon(
            knowledge_path=root / "connaissances.json",
            history_path=root / "historique.txt",
        )

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_repond_aux_salutations_sans_tenir_compte_de_la_casse(self):
        response = self.bot.respond("BONJOUR")
        self.assertIn("Bonjour", response["reply"])
        self.assertFalse(response["needsTeaching"])

    def test_repond_aux_questions_stoon(self):
        response = self.bot.respond("Comment trouver une colocation ?")
        self.assertIn("ville", response["reply"])

    def test_comprend_une_demande_naturelle_de_logement(self):
        response = self.bot.respond("je cherche un appartement à louer")
        self.assertIn("ville", response["reply"])
        self.assertEqual("housing_city", response["nextContext"])
        self.assertFalse(response["needsTeaching"])

    def test_continue_une_recherche_de_logement_avec_la_ville(self):
        response = self.bot.respond("Casablanca", context="housing_city")
        self.assertIn("Casablanca", response["reply"])
        self.assertIn("budget", response["reply"])
        self.assertEqual("housing_budget|Casablanca", response["nextContext"])
        self.assertFalse(response["needsTeaching"])

    def test_continue_une_recherche_de_logement_avec_le_budget(self):
        response = self.bot.respond("2500 MAD", context="housing_budget|Casablanca")
        self.assertIn("2500", response["reply"])
        self.assertEqual("housing_type|Casablanca|2500", response["nextContext"])
        self.assertFalse(response["needsTeaching"])

    def test_prepare_une_recherche_reelle_apres_le_type_de_logement(self):
        response = self.bot.respond("une chambre", context="housing_type|Rabat|2000")
        self.assertEqual(
            {"type": "housing", "city": "Rabat", "budget": 2000, "housingType": "chambre"},
            response["search"],
        )

    def test_conserve_l_ordre_des_villes_du_trajet(self):
        response = self.bot.respond("je veux voyager de Casablanca à Rabat")
        self.assertEqual("Casablanca", response["search"]["departureCity"])
        self.assertEqual("Rabat", response["search"]["destinationCity"])

    def test_comprend_les_accents_et_une_faute_courante(self):
        school = self.bot.respond("je cherche une école à Agadir")
        housing = self.bot.respond("je cherche un aparteman à Rabat avec 2000 MAD")
        self.assertEqual("school", school["search"]["type"])
        self.assertEqual("housing", housing["search"]["type"])

    def test_comprend_une_demande_naturelle_de_trajet(self):
        response = self.bot.respond("je veux voyager de Rabat à Casablanca")
        self.assertIn("Rabat", response["reply"])
        self.assertIn("Casablanca", response["reply"])
        self.assertFalse(response["needsTeaching"])

    def test_recherche_un_covoiturage_demande_explicitement(self):
        response = self.bot.respond("je cherche un covoiturage de Marrakech à Casablanca")
        self.assertEqual("ride", response["search"]["type"])
        self.assertEqual("Marrakech", response["search"]["departureCity"])
        self.assertEqual("Casablanca", response["search"]["destinationCity"])

    def test_comprend_une_demande_naturelle_de_stage(self):
        response = self.bot.respond("je cherche une opportunité professionnelle")
        self.assertIn("domaine", response["reply"])
        self.assertFalse(response["needsTeaching"])

    def test_demande_un_apprentissage_si_reponse_inconnue(self):
        response = self.bot.respond("question totalement inconnue")
        self.assertTrue(response["needsTeaching"])

    def test_apprend_et_reutilise_une_reponse(self):
        self.bot.teach("Quelle est la couleur préférée ?", "Le cyan.")
        response = self.bot.respond("Quelle est la couleur préférée ?")
        self.assertEqual("Le cyan.", response["reply"])

        saved = json.loads(self.bot.knowledge_path.read_text(encoding="utf-8"))
        self.assertEqual("Le cyan.", saved["quelle est la couleur preferee ?"])

    def test_enregistre_historique(self):
        self.bot.respond("bonjour")
        history = self.bot.history_path.read_text(encoding="utf-8")
        self.assertIn("Utilisateur : bonjour", history)
        self.assertIn("Bot :", history)


if __name__ == "__main__":
    unittest.main()
