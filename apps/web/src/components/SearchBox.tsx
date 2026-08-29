import type { KeyboardEvent } from "react";
import type { SymbolSearchResult } from "@financial-dashboard/api-contracts/market-data";
import { SearchResults } from "./SearchResults";
import { StatusMessage } from "./StatusMessage";

type Props = { activeIndex: number; error: string | null; isLoading: boolean; query: string; results: SymbolSearchResult[]; searched: boolean; onActiveIndexChange: (index: number) => void; onQueryChange: (query: string) => void; onSelect: (result: SymbolSearchResult) => void };

export function SearchBox({ activeIndex, error, isLoading, query, results, searched, onActiveIndexChange, onQueryChange, onSelect }: Props) {
  const isOpen = query.trim().length > 0;
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!results.length) return;
    if (event.key === "ArrowDown") { event.preventDefault(); onActiveIndexChange((activeIndex + 1) % results.length); }
    else if (event.key === "ArrowUp") { event.preventDefault(); onActiveIndexChange((activeIndex - 1 + results.length) % results.length); }
    else if (event.key === "Enter" && activeIndex >= 0) { event.preventDefault(); onSelect(results[activeIndex]); }
  }
  return <div className="search">
    <label htmlFor="company-search">Search for a company</label>
    <div className="search-input-wrap"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" /></svg>
      <input aria-activedescendant={activeIndex >= 0 ? `symbol-result-${activeIndex}` : undefined} aria-autocomplete="list" aria-controls="symbol-results" aria-expanded={isOpen && results.length > 0} autoComplete="off" id="company-search" onChange={(event) => onQueryChange(event.target.value)} onKeyDown={handleKeyDown} placeholder="Company name or ticker, such as Apple or AAPL" role="combobox" type="search" value={query} />
      {isLoading && <span className="spinner" aria-label="Searching" />}
    </div>
    {isOpen && results.length > 0 && <SearchResults activeIndex={activeIndex} onActiveIndexChange={onActiveIndexChange} onSelect={onSelect} results={results} />}
    {isOpen && error && <StatusMessage tone="error">{error}</StatusMessage>}
    {isOpen && searched && !isLoading && !error && results.length === 0 && <StatusMessage>No matching companies found.</StatusMessage>}
  </div>;
}
