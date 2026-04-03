import { FACILITIES } from "./facilities";

export const LEASE_OPTIONS = FACILITIES.map((f) => ({
  id: f.id,
  name: f.shortName,
  subtitle: "Dedicated slip access with on-site assistance.",
  acreage: f.acreage,
  price: f.price,
  features: f.features,
}));
