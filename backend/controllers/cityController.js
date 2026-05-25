import { cityModel } from "../models/cityModel.js";

const isMissing = (value) => value === undefined || value === null || value === "";

export const cityController = {
  async list(req, res) {
    try {
      const cities = await cityModel.findAll();
      res.json({ success: true, data: cities });
    } catch (error) {
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },

  async create(req, res) {
    try {
      if (isMissing(req.body.nom)) {
        return res.status(400).json({ success: false, message: "Le champ nom est obligatoire" });
      }

      const city = await cityModel.create(req.body);
      res.status(201).json({ success: true, data: city });
    } catch (error) {
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },

  async update(req, res) {
    try {
      if (isMissing(req.body.nom)) {
        return res.status(400).json({ success: false, message: "Le champ nom est obligatoire" });
      }

      const city = await cityModel.update(req.params.id, req.body);
      if (!city) {
        return res.status(404).json({ success: false, message: "Ville introuvable" });
      }

      res.json({ success: true, data: city });
    } catch (error) {
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await cityModel.remove(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Ville introuvable" });
      }

      res.json({ success: true, message: "Ville supprimée" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }
};

