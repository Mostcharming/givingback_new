import axios from "axios";
import db from "../config";

const RATE_API_URL = "https://api.exchangerate-api.com/v4/latest/USD";
const RATE_API_TIMEOUT_MS = 5_000;

/**
 * Resolve the USD to NGN rate only when a conversion needs it.
 *
 * A manually configured rate remains authoritative. In automatic mode, the
 * live rate is fetched directly and is not persisted, so starting the server
 * no longer creates background API or database traffic.
 */
export const getUsdToNgnRate = async (): Promise<number> => {
  const configuredRate = await db("rates")
    .orderBy("updated_at", "desc")
    .first();

  if (configuredRate && configuredRate.mode !== "automatic") {
    const manualRate = Number(configuredRate.rate);

    if (!Number.isFinite(manualRate) || manualRate <= 0) {
      throw new Error("The manually configured USD to NGN rate is invalid.");
    }

    return manualRate;
  }

  const response = await axios.get(RATE_API_URL, {
    timeout: RATE_API_TIMEOUT_MS,
  });
  const liveRate = Number(response.data?.rates?.NGN);

  if (!Number.isFinite(liveRate) || liveRate <= 0) {
    throw new Error("The exchange-rate provider returned an invalid NGN rate.");
  }

  return liveRate;
};
