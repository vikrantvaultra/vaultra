const stats = [
  { n: "₹2.5Cr", accent: "+", label: "operational costs saved" },
  { n: "500k", accent: "+", label: "hours automated" },
  { n: "99.9", accent: "%", label: "workflow accuracy" },
];

export function Stats() {
  return (
    <section className="stats" aria-label="Vaultra in numbers">
      <div className="wrap stats__grid" data-reveal>
        {stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <span className="stat__n">
              {stat.n}
              <b>{stat.accent}</b>
            </span>
            <span className="stat__l">{stat.label}</span>
          </div>
        ))}
        <p className="stats__tag">
          <span aria-hidden="true">✦</span> Built for teams who refuse to stay busy
        </p>
      </div>
    </section>
  );
}
