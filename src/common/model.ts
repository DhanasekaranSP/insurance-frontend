export type PolicyRequest = {
  name?: string;
  minPremium?: number;
  maxPremium?: number;
  types?: string[];
  minCoverage?: number;
};
