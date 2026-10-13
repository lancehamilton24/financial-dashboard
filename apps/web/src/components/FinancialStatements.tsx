import { useEffect, useState } from "react";
import type {
  FinancialStatement,
  FinancialStatementType,
} from "@financial-dashboard/api-contracts/market-data";
import { ApiError, fetchFinancialStatement } from "../api/market-data";
import { StatusMessage } from "./StatusMessage";

const statements: {
  type: FinancialStatementType;
  label: string;
  metrics: [string, string][];
}[] = [
  {
    type: "income-statement",
    label: "Income statement",
    metrics: [
      ["totalRevenue", "Revenue"],
      ["costOfRevenue", "Cost of revenue"],
      ["grossProfit", "Gross profit"],
      ["researchAndDevelopment", "Research & development"],
      ["sellingGeneralAndAdministrative", "Selling, general & administrative"],
      ["operatingExpenses", "Operating expenses"],
      ["operatingIncome", "Operating income"],
      ["ebitda", "EBITDA"],
      ["interestExpense", "Interest expense"],
      ["incomeBeforeTax", "Income before tax"],
      ["incomeTaxExpense", "Income tax expense"],
      ["netIncome", "Net income"],
    ],
  },
  {
    type: "balance-sheet",
    label: "Balance sheet",
    metrics: [
      ["cashAndCashEquivalentsAtCarryingValue", "Cash & equivalents"],
      ["currentNetReceivables", "Current receivables"],
      ["inventory", "Inventory"],
      ["totalCurrentAssets", "Current assets"],
      ["propertyPlantEquipment", "Property, plant & equipment"],
      ["totalAssets", "Total assets"],
      ["currentAccountsPayable", "Accounts payable"],
      ["totalCurrentLiabilities", "Current liabilities"],
      ["shortLongTermDebtTotal", "Total debt"],
      ["totalLiabilities", "Total liabilities"],
      ["retainedEarnings", "Retained earnings"],
      ["totalShareholderEquity", "Shareholders’ equity"],
    ],
  },
  {
    type: "cash-flow",
    label: "Cash flow",
    metrics: [
      ["netIncome", "Net income"],
      ["depreciationDepletionAndAmortization", "Depreciation & amortization"],
      ["changeInReceivables", "Change in receivables"],
      ["changeInInventory", "Change in inventory"],
      ["operatingCashflow", "Operating cash flow"],
      ["capitalExpenditures", "Capital expenditures"],
      ["cashflowFromInvestment", "Investing cash flow"],
      ["cashflowFromFinancing", "Financing cash flow"],
      ["dividendPayout", "Dividends paid"],
      ["paymentsForRepurchaseOfCommonStock", "Common stock repurchases"],
      ["changeInCashAndCashEquivalents", "Change in cash & equivalents"],
    ],
  },
];

const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});
function amount(value: number | null | undefined) {
  if (value == null) return "—";
  const formatted = numberFormat.format(Math.abs(value) / 1_000_000);
  return value < 0 ? `(${formatted})` : formatted;
}

export function FinancialStatements({ symbol }: { symbol: string }) {
  const [active, setActive] =
    useState<FinancialStatementType>("income-statement");
  const [period, setPeriod] = useState<"annualReports" | "quarterlyReports">(
    "annualReports",
  );
  const [cache, setCache] = useState<
    Partial<Record<FinancialStatementType, FinancialStatement>>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const statement = statements.find((item) => item.type === active)!;
  const data = cache[active];

  useEffect(() => {
    if (data) {
      setLoading(false);
      setError(null);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetchFinancialStatement(symbol, active, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted)
          setCache((previous) => ({ ...previous, [active]: result }));
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setError(
            reason instanceof ApiError
              ? reason.message
              : "We couldn't load this statement. Please try again.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [symbol, active, data, retry]);

  const reports = data?.[period].slice(0, 5) ?? [];
  function selectTab(type: FinancialStatementType) {
    setActive(type);
    setError(null);
    setLoading(!cache[type]);
  }

  return (
    <section
      className="financial-statements"
      aria-label={`${symbol} financial statements`}
    >
      <div
        className="statement-tabs"
        role="tablist"
        aria-label="Financial statements"
      >
        {statements.map((item, index) => (
          <button
            key={item.type}
            id={`tab-${item.type}`}
            type="button"
            role="tab"
            aria-selected={active === item.type}
            aria-controls={`panel-${item.type}`}
            tabIndex={active === item.type ? 0 : -1}
            onClick={() => selectTab(item.type)}
            onKeyDown={(event) => {
              let next: number;
              if (event.key === "ArrowRight")
                next = (index + 1) % statements.length;
              else if (event.key === "ArrowLeft")
                next = (index + statements.length - 1) % statements.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = statements.length - 1;
              else return;
              event.preventDefault();
              selectTab(statements[next].type);
              document.getElementById(`tab-${statements[next].type}`)?.focus();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
        aria-busy={loading}
      >
        <header className="statement-header">
          <div>
            <p className="eyebrow">{symbol} · Financials</p>
            <h2>{statement.label}</h2>
          </div>
          <div
            className="period-toggle"
            role="group"
            aria-label="Reporting period"
          >
            <button
              type="button"
              aria-pressed={period === "annualReports"}
              onClick={() => setPeriod("annualReports")}
            >
              Annual
            </button>
            <button
              type="button"
              aria-pressed={period === "quarterlyReports"}
              onClick={() => setPeriod("quarterlyReports")}
            >
              Quarterly
            </button>
          </div>
        </header>
        {loading && (
          <div className="overview-loading" role="status">
            <span className="spinner" />
            Loading {statement.label.toLowerCase()}…
          </div>
        )}
        {!loading && error && (
          <>
            <StatusMessage tone="error">{error}</StatusMessage>
            <button
              className="statement-retry"
              type="button"
              onClick={() => setRetry((value) => value + 1)}
            >
              Retry
            </button>
          </>
        )}
        {!loading && !error && reports.length === 0 && (
          <StatusMessage>
            No {period === "annualReports" ? "annual" : "quarterly"} reports are
            available for {symbol}.
          </StatusMessage>
        )}
        {!loading && !error && reports.length > 0 && (
          <>
            <p className="statement-note">
              Amounts in millions of the reported currency. Parentheses indicate
              negative values; — means unavailable.
            </p>
            <div
              className="statement-table-wrap"
              tabIndex={0}
              role="region"
              aria-label="Financial report comparison"
            >
              <table className="statement-table">
                <caption className="sr-only">
                  {symbol} {statement.label}, latest {reports.length}{" "}
                  {period === "annualReports" ? "annual" : "quarterly"} periods.
                  Amounts in millions.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Fiscal period ending</th>
                    {reports.map((report) => (
                      <th scope="col" key={report.fiscalDateEnding}>
                        {report.fiscalDateEnding}
                        <span>{report.reportedCurrency}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {statement.metrics.map(([key, label]) => (
                    <tr key={key}>
                      <th scope="row">{label}</th>
                      {reports.map((report) => (
                        <td key={report.fiscalDateEnding}>
                          {amount(report.values[key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="statement-note">
              Source: Alpha Vantage · Latest {reports.length} reported periods
            </p>
          </>
        )}
      </div>
    </section>
  );
}
