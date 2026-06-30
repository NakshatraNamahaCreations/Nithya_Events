import "./TrustedBy.css";


export default function TrustedBy({
  title = "Trusted By",
  subtitle = "Make your event planning stress-free with nithyaevent.",
  stats = [
    { number: "12,000+", label: "Events" },
    { number: "100+", label: "Vendors" },
    { number: "1000+", label: "Products" },
    { number: "140+", label: "Clients" },
  ],
}) {
  return (
    <section className="tb-section" aria-labelledby="tb-heading">
      <div className="tb-container">
        <header className="tb-header">
            <div className="tb-star"><img src="/media/star.png"/></div>
            <div className="tb-plus"><img src="/media/plus.png"/></div>
          <h2 id="tb-heading" className="tb-title">{title}</h2>
          <p className="tb-sub">{subtitle}</p>
        </header>

        <ul className="tb-stats" role="list" aria-label="Trusted by statistics">
          {stats.map((s, i) => (
            <li key={i} className="tb-stat">
              <div className="tb-number" aria-hidden="false">{s.number}</div>
              <div className="tb-label">{s.label}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
