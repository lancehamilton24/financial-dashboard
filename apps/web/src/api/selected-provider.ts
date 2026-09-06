import { useSyncExternalStore } from "react";
import type { MarketDataProvider } from "@financial-dashboard/api-contracts/market-data";

const storageKey = "financial-dashboard.market-data-provider";
const listeners = new Set<() => void>();
let provider: MarketDataProvider = "alpha-vantage";

try {
  const saved = localStorage.getItem(storageKey);
  if (saved === "alpha-vantage" || saved === "financial-modeling-prep") provider = saved;
} catch {
  // The selection still works when browser storage is unavailable.
}

export function getSelectedProvider(): MarketDataProvider {
  return provider;
}

export function setSelectedProvider(value: MarketDataProvider) {
  provider = value;
  try {
    localStorage.setItem(storageKey, value);
  } catch {
    // Keep the in-memory selection when browser storage is unavailable.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function useSelectedProvider() {
  return useSyncExternalStore(subscribe, getSelectedProvider);
}
