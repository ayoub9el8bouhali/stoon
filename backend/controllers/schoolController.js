import { schoolModel } from "../models/schoolModel.js";

const isMissing = (value) => value === undefined || value === null || value === "";

const validateSchool = (body) => {
  if (isMissing(body.nom)) return "Le champ nom est obligatoire";
  if (isMissing(body.statut)) return "Le champ statut est obligatoire";
  if (isMissing(body.ville_id)) return "Le champ ville_id est obligatoire";
  return null;
};

export const schoolController = {
  async list(req, res) {
    try {
      const schools = await schoolModel.findAll({ city_id: req.query.city_id });
      res.json({ success: true, data: schools });
    } catch (error) {
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },

  async create(req, res) {
    try {
      const validationError = validateSchool(req.body);
      if (validationError) {
        return res.status(400).json({ success: false, message: validationError });
      }

      const school = await schoolModel.create(req.body);
      res.status(201).json({ success: true, data: school });
    } catch (error) {
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({ success: false, message: "ville_id invalide" });
      }

      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },

  async update(req, res) {
    try {
      const validationError = validateSchool(req.body);
      if (validationError) {
        return res.status(400).json({ success: false, message: validationError });
      }

      const school = await schoolModel.update(req.params.id, req.body);
      if (!school) {
        return res.status(404).json({ success: false, message: "École introuvable" });
      }

      res.json({ success: true, data: school });
    } catch (error) {
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({ success: false, message: "ville_id invalide" });
      }

      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await schoolModel.remove(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "École introuvable" });
      }

      res.json({ success: true, message: "École supprimée" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }
};
