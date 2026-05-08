import { Housing } from "../models/index.js";
import { createResourceController } from "./resourceController.js";
import { mapHousingPayload } from "../services/resourceMapper.js";

export const housingController = createResourceController({
  model: Housing,
  resourceType: "housing",
  searchableFields: ["title", "description", "city", "school", "address"],
  mapPayload: mapHousingPayload
});
