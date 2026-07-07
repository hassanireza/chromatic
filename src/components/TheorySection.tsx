import { THEORY_CARDS } from '../data/theory';
import { PSYCHOLOGY } from '../data/psychology';
import { TIPS } from '../data/tips';

export function TheorySection() {
  return (
    <section className="theory-section" id="theory">
      <div className="section-header">
        <div className="section-eyebrow">Knowledge</div>
        <h2 className="section-title">Color Theory</h2>
      </div>

      <div className="theory-grid">
        {THEORY_CARDS.map((card) => (
          <div className="theory-card" key={card.id}>
            <div className="theory-visual">
              {card.swatches.map((c, i) => (
                <div key={`${c}-${i}`} className="tv-swatch" style={{ background: c }} />
              ))}
            </div>
            <div className="theory-body">
              <h3 className="theory-name">{card.name}</h3>
              <p className="theory-desc-text">{card.description}</p>
              <div className="theory-formula"><span className="mono">{card.formula}</span></div>
            </div>
          </div>
        ))}
      </div>

      <div className="psychology-section">
        <h3 className="subsection-title">Color Psychology Reference</h3>
        <div className="psych-grid">
          {PSYCHOLOGY.map((item) => (
            <div className="psych-card" key={item.name}>
              <div className="psych-color" style={{ background: item.color }} />
              <div className="psych-body">
                <div className="psych-name">{item.name}</div>
                <div className="psych-traits">
                  {item.traits.map((t) => (
                    <span className="trait-tag" key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tips-section">
        <h3 className="subsection-title">Professional Tips + Tricks</h3>
        <div className="tips-grid">
          {TIPS.map((tip, i) => (
            <div className="tip-card" key={tip.title}>
              <span className="tip-num">{String(i + 1).padStart(2, '0')}</span>
              <div className="tip-body">
                <div className="tip-title">{tip.title}</div>
                <p className="tip-text">{tip.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
