import type { CompanyOverview } from "@financial-dashboard/api-contracts/market-data";

function displayValue(value: string): string {
  const normalized = value.trim();
  return normalized && normalized.toLowerCase() !== "none" ? normalized : "Not available";
}

export function CompanyOverviewCard({ overview }: { overview: CompanyOverview }) {
  const metrics = [["P/E ratio", overview.peRatio], ["Forward P/E", overview.forwardPE], ["EPS", overview.eps]];
  return <article className="overview-card">
    <header className="overview-header"><div><p className="eyebrow">Company overview</p><h2>{displayValue(overview.name)}</h2><p className="overview-location">{[overview.exchange, overview.country].map(displayValue).join(" · ")}</p></div><span className="symbol-badge">{overview.symbol}</span></header>
    <div className="classification"><span>{displayValue(overview.sector)}</span><span>{displayValue(overview.industry)}</span></div>
    <dl className="metrics">{metrics.map(([label, value]) => <div className="metric" key={label}><dt>{label}</dt><dd>{displayValue(value)}</dd></div>)}</dl>
    <section className="description"><h3>About</h3><p>{displayValue(overview.description)}</p></section>
  </article>;
}
