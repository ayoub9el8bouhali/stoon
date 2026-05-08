import { Job } from "../models/index.js";
import { createResourceController } from "./resourceController.js";
import { mapJobPayload } from "../services/resourceMapper.js";

export const jobController = createResourceController({
  model: Job,
  resourceType: "job",
  searchableFields: ["title", "company", "description", "city", "fieldOfStudy"],
  mapPayload: mapJobPayload
});
