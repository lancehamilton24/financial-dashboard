import type { SymbolSearchResult } from "@financial-dashboard/api-contracts/market-data";

type Props = { activeIndex: number; results: SymbolSearchResult[]; onActiveIndexChange: (index: number) => void; onSelect: (result: SymbolSearchResult) => void };

export function SearchResults({ activeIndex, results, onActiveIndexChange, onSelect }: Props) {
  return <ul className="search-results" id="symbol-results" role="listbox">
    {results.map((result, index) => <li aria-selected={index === activeIndex} className="search-result" id={`symbol-result-${index}`} key={`${result.symbol}-${result.region}`} role="option">
      <button className="search-result__button" onClick={() => onSelect(result)} onMouseEnter={() => onActiveIndexChange(index)} type="button">
        <span className="search-result__identity"><strong>{result.symbol}</strong><span>{result.name}</span></span>
        <span className="search-result__meta">{result.region} · {result.currency}</span>
      </button>
    </li>)}
  </ul>;
}
