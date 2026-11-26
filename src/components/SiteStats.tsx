import { useEffect, useRef, useState } from 'react';
import { Building2, HardHat, Paintbrush, Wrench } from 'lucide-react';

/**
 * Site statistics, styled to match the navy/corporate-blue website theme.
 * Uses the same header-aligned horizontal gutters as HeroSection,
 * BlueprintSection, HomeServicesStrip and SiteContentSections.
 * All CSS lives in this file; no SiteStats.css is needed.
 */
const CSS = String.raw`
.unstats, .unstats * { box-sizing: border-box; }

.unstats {
  --unstats-navy: #102b43;
  --unstats-blue: #0b688b;
  --unstats-ink: #142b3a;
  --unstats-muted: #667584;
  --unstats-border: #e3e8ed;
  /* Same horizontal spacing as the other updated home sections. */
  --unstats-page-gutter: max(20px, 3.125%, calc(50% - 835px));
  position: relative;
  isolation: isolate;
  width: 100%;
  overflow: hidden;
  padding: 46px 0;
  border-block: 1px solid #e7ebef;
  background: #f6f7f9;
  color: var(--unstats-ink);
  font-family: inherit;
}

/* Subtle architectural lines, without teal, green, or light blue. */
.unstats::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  content: '';
  pointer-events: none;
  background-image:
    linear-gradient(rgba(16,43,67,.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16,43,67,.025) 1px, transparent 1px);
  background-size: 42px 42px;
}

.unstats__container {
  position: relative;
  width: 100%;
  margin-inline: auto;
  padding-inline: var(--unstats-page-gutter);
}

.unstats__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(12px, 1.3vw, 20px);
  width: 100%;
  min-width: 0;
}

/* Keep fewer cards aligned LEFT with the header, not centered in the page. */
.unstats__grid[data-count='1'] {
  grid-template-columns: minmax(0, 420px);
}
.unstats__grid[data-count='2'] {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  max-width: 850px;
}
.unstats__grid[data-count='3'] {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  max-width: 1120px;
}

.unstats__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: clamp(12px, 1.3vw, 19px);
  min-width: 0;
  min-height: 128px;
  padding: 23px clamp(15px, 1.5vw, 24px);
  overflow: hidden;
  border: 1px solid var(--unstats-border);
  border-radius: 17px;
  background: #fff;
  box-shadow: 0 7px 25px rgba(16,43,67,.045);
  transition: transform .24s ease, box-shadow .24s ease, border-color .24s ease;
}

.unstats__item::before {
  position: absolute;
  top: 0;
  left: 20px;
  right: 20px;
  height: 3px;
  border-radius: 0 0 4px 4px;
  background: var(--unstats-blue);
  content: '';
  opacity: 0;
  transform: scaleX(.35);
  transform-origin: left center;
  transition: opacity .24s ease, transform .24s ease;
}
.unstats__item:hover {
  transform: translateY(-4px);
  border-color: rgba(11,104,139,.32);
  box-shadow: 0 15px 34px rgba(16,43,67,.1);
}
.unstats__item:hover::before { opacity: 1; transform: scaleX(1); }

.unstats__icon {
  display: grid;
  place-items: center;
  flex: 0 0 58px;
  width: 58px;
  height: 58px;
  border: 1px solid #e6eaf0;
  border-radius: 15px;
  background: #f1f3f6;
  color: var(--unstats-blue);
  transition: color .24s ease, background .24s ease, border-color .24s ease;
}
.unstats__icon svg { display: block; width: 27px; height: 27px; stroke-width: 1.85; }
.unstats__item:hover .unstats__icon {
  background: var(--unstats-navy);
  border-color: var(--unstats-navy);
  color: #fff;
}
.unstats__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  gap: 8px;
}
.unstats__number {
  margin: 0;
  color: var(--unstats-navy);
  font-size: clamp(32px, 3vw, 43px);
  font-weight: 850;
  font-variant-numeric: tabular-nums;
  letter-spacing: -.045em;
  line-height: 1;
}
.unstats__label {
  display: block;
  color: var(--unstats-muted);
  font-size: 13px;
  font-weight: 650;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

@media (max-width: 1080px) {
  .unstats__grid[data-count='4'] {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .unstats__item { min-height: 116px; }
}

@media (max-width: 720px) {
  .unstats { padding-block: 32px; }
  .unstats__grid { gap: 12px; }
  .unstats__grid[data-count='3'] {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .unstats__grid[data-count='3'] .unstats__item:last-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 540px) {
  .unstats {
    --unstats-page-gutter: 16px;
    padding-block: 28px;
  }
  .unstats__grid { gap: 10px; }
  .unstats__grid[data-count='1'] { grid-template-columns: minmax(0, 1fr); }
  .unstats__grid[data-count='2'],
  .unstats__grid[data-count='3'],
  .unstats__grid[data-count='4'] {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .unstats__item {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-height: 158px;
    padding: 20px 11px;
    border-radius: 14px;
    text-align: center;
  }
  .unstats__icon {
    flex: 0 0 47px;
    width: 47px;
    height: 47px;
    border-radius: 12px;
  }
  .unstats__icon svg { width: 23px; height: 23px; }
  .unstats__content { align-items: center; gap: 7px; }
  .unstats__number { font-size: clamp(30px, 8vw, 37px); }
  .unstats__label { font-size: 12px; }
  .unstats__grid[data-count='1'] .unstats__item {
    flex-direction: row;
    justify-content: flex-start;
    min-height: 110px;
    padding: 18px;
    text-align: left;
  }
  .unstats__grid[data-count='1'] .unstats__content { align-items: flex-start; }
}

@media (prefers-reduced-motion: reduce) {
  .unstats__item, .unstats__item::before, .unstats__icon { transition: none; }
  .unstats__item:hover { transform: none; }
}
`;

function Count({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      setCurrent(value);
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const animate = (time: number) => {
        const progress = Math.min((time - start) / 1100, 1);
        setCurrent(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    }, { threshold: 0.3 });

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return <span ref={ref}>{current.toLocaleString('en-IN')}</span>;
}

type SiteStatsProps = {
  properties?: number;
  construction?: number;
  interiors?: number;
  civilServices?: number;
};

export default function SiteStats({
  properties = 0,
  construction = 0,
  interiors = 0,
  civilServices = 0,
}: SiteStatsProps) {
  const items = [
    { label: 'Property listings', value: properties, icon: Building2 },
    { label: 'Construction projects', value: construction, icon: HardHat },
    { label: 'Interior projects', value: interiors, icon: Paintbrush },
    { label: 'Civil services', value: civilServices, icon: Wrench },
  ].filter(({ value }) => Number.isFinite(value) && value > 0);

  if (!items.length) return null;

  return (
    <section className="unstats" aria-label="Current listings and services">
      <style>{CSS}</style>
      <div className="unstats__container">
        <div className="unstats__grid" data-count={items.length}>
          {items.map((item) => (
            <div className="unstats__item" key={item.label}>
              <div className="unstats__icon" aria-hidden="true"><item.icon /></div>
              <div className="unstats__content">
                <div className="unstats__number"><Count value={item.value} /></div>
                <span className="unstats__label">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
