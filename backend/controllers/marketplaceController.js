import { MarketplaceItem } from "../models/index.js";
import { createResourceController } from "./resourceController.js";
import { mapMarketplacePayload } from "../services/resourceMapper.js";

export const marketplaceController = createResourceController({
  model: MarketplaceItem,
  resourceType: "marketplace",
  searchableFields: ["title", "description", "city", "school", "category"],
  mapPayload: mapMarketplacePayload
});
