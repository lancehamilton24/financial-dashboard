import { useRef, useState } from "react";
import type { CompanyOverview, SymbolSearchResult } from "@financial-dashboard/api-contracts/market-data";
import { ApiError, fetchCompanyOverview, searchSymbols } from "./api/market-data";
import { CompanyOverviewCard } from "./components/CompanyOverviewCard";
import { SearchBox } from "./components/SearchBox";
import { StatusMessage } from "./components/StatusMessage";

export function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SymbolSearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<SymbolSearchResult | null>(null);
  const [overview, setOverview] = useState<CompanyOverview | null>(null);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);
  const searchRequest = useRef<AbortController | null>(null);
  const overviewRequest = useRef<AbortController | null>(null);

  async function handleSearch() {
    const keywords = query.trim();
    if (!keywords || selectedCompany?.name === query || isSearching) {
      return;
    }

    searchRequest.current?.abort();
    const controller = new AbortController();
    searchRequest.current = controller;
    setIsSearching(true); setSearchError(null); setSearched(false);

    try {
      const matches = await searchSymbols(keywords, controller.signal);
      setResults(matches);
      setActiveIndex(matches.length ? 0 : -1);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      if (error instanceof ApiError && error.status === 404) {
        setResults([]);
      } else {
        setSearchError("We couldn't search for companies. Please try again."); setResults([]);
      }
    } finally {
      if (!controller.signal.aborted) { setIsSearching(false); setSearched(true); }
    }
  }

  function handleQueryChange(value: string) {
    setQuery(value); setSelectedCompany(null); setResults([]); setActiveIndex(-1);
    setSearchError(null); setSearched(false);
  }

  async function handleSelect(company: SymbolSearchResult) {
    overviewRequest.current?.abort();
    const controller = new AbortController();
    overviewRequest.current = controller;
    setSelectedCompany(company); setQuery(""); setResults([]); setSearchError(null); setSearched(false);
    setOverviewError(null); setIsLoadingOverview(true);
    try {
      setOverview(await fetchCompanyOverview(company.symbol, controller.signal));
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setOverviewError(error instanceof ApiError && error.status === 404 ? `No overview is available for ${company.symbol}.` : "We couldn't load this company. Please try again.");
    } finally {
      if (!controller.signal.aborted) setIsLoadingOverview(false);
    }
  }

  return <main><div className="page-shell">
    <header className="site-header"><a className="brand" href="/" aria-label="Financial Dashboard home"><span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>Financial Dashboard</a></header>
    <section className="hero" aria-labelledby="page-title">
      <SearchBox activeIndex={activeIndex} error={searchError} isLoading={isSearching} onActiveIndexChange={setActiveIndex} onQueryChange={handleQueryChange} onSearch={handleSearch} onSelect={handleSelect} query={query} results={results} searched={searched} />
    </section>
    <section className="overview-region" aria-live="polite">
      {isLoadingOverview && <div className="overview-loading"><span className="spinner" /> Loading {selectedCompany?.symbol}…</div>}
      {overviewError && <StatusMessage tone="error">{overviewError}</StatusMessage>}
      {!isLoadingOverview && !overviewError && overview && <CompanyOverviewCard overview={overview} />}
    </section>
  </div></main>;
}
