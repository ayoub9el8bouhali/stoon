import { programModel } from "../models/programModel.js";

const validLevels = ["Bac", "Bac+2", "Bac+3", "Bac+5"];
const isMissing = (value) => value === undefined || value === null || value === "";

const validateProgram = (body) => {
  if (isMissing(body.nom)) return "Le champ nom est obligatoire";
  if (body.niveau && !validLevels.includes(body.niveau)) return "Le niveau doit être Bac, Bac+2, Bac+3 ou Bac+5";
  if (isMissing(body.ecole_id)) return "Le champ ecole_id est obligatoire";
  return null;
};

export const programController = {
  async list(req, res) {
    try {
      const programs = await programModel.findAll({ school_id: req.query.school_id });
      res.json({ success: true, data: programs });
    } catch (error) {
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },

  async create(req, res) {
    try {
      const validationError = validateProgram(req.body);
      if (validationError) {
        return res.status(400).json({ success: false, message: validationError });
      }

      const program = await programModel.create(req.body);
      res.status(201).json({ success: true, data: program });
    } catch (error) {
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({ success: false, message: "ecole_id invalide" });
      }

      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },

  async update(req, res) {
    try {
      const validationError = validateProgram(req.body);
      if (validationError) {
        return res.status(400).json({ success: false, message: validationError });
      }

      const program = await programModel.update(req.params.id, req.body);
      if (!program) {
        return res.status(404).json({ success: false, message: "Filière introuvable" });
      }

      res.json({ success: true, data: program });
    } catch (error) {
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({ success: false, message: "ecole_id invalide" });
      }

      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await programModel.remove(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Filière introuvable" });
      }

      res.json({ success: true, message: "Filière supprimée" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }
};
