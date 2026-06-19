import { FACILITIES } from "./facilities";

export const LEASE_OPTIONS = FACILITIES.map((f) => ({
  id: f.id,
  name: f.shortName,
  subtitle: f.region,
  acreage: f.acreage,
  price: f.price,
  features: f.features,
}));
