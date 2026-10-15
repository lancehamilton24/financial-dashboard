import { useEffect, useId, useRef, useState } from "react";
import type { CompanyOverview } from "@financial-dashboard/api-contracts/market-data";

function CompanyDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const paragraph = useRef<HTMLParagraphElement>(null);
  const descriptionId = useId();

  useEffect(() => {
    const element = paragraph.current;
    if (!element) return;
    const measure = () => {
      const lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight);
      setOverflows(element.scrollHeight > lineHeight * 6 + 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <>
    <p ref={paragraph} id={descriptionId} className={expanded ? undefined : "description-collapsed"}>{text}</p>
    {overflows && <button
      type="button"
      className="description-toggle"
      aria-expanded={expanded}
      aria-controls={descriptionId}
      onClick={() => setExpanded((previous) => !previous)}
    >{expanded ? "Show less" : "Show more"}</button>}
  </>;
}

function displayValue(value: string): string {
  const normalized = value.trim();
  return normalized && normalized.toLowerCase() !== "none" ? normalized : "Not available";
}

export function CompanyOverviewCard({ overview }: { overview: CompanyOverview }) {
  const metrics = [["P/E ratio", overview.peRatio], ["Forward P/E", overview.forwardPE], ["EPS", overview.eps]];
  return <article className="overview-card">
    <header className="overview-header"><div><p className="eyebrow">Company overview</p><h2>{displayValue(overview.name)}</h2><p className="overview-location">{[overview.exchange, overview.country].map(displayValue).join(" · ")}</p></div><span className="symbol-badge">{overview.symbol}</span></header>
    <div className="classification"><span>{displayValue(overview.sector)}</span><span>{displayValue(overview.industry)}</span>
    <section className="description"><h3>About</h3><CompanyDescription key={`${overview.symbol}:${overview.description}`} text={displayValue(overview.description)} /></section>
    </div>
    <dl className="metrics">{metrics.map(([label, value]) => <div className="metric" key={label}><dt>{label}</dt><dd>{displayValue(value)}</dd></div>)}</dl>
  </article>;
}
