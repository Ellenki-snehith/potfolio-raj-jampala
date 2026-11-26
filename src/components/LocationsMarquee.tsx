import { useState } from 'react';

/**
 * Premium, accessible locations strip.
 * - No external animation/icon packages.
 * - Shows nothing for fewer than two unique locations.
 * - Two or three locations display as static cards.
 * - Four or more locations scroll on an endlessly looping filmstrip.
 * - Hover/focus and the dedicated control can pause the movement.
 * - Reduced-motion visitors get a static, nonduplicated layout.
 */
const CSS = String.raw`
.unplaces,
.unplaces * { box-sizing: border-box; }

.unplaces {
  --unplaces-ink: #143247;
  --unplaces-blue: #096b8e;
  --unplaces-muted: #748894;
  --unplaces-border: #e4edf0;
  --unplaces-accent: #15a1aa;
  --unplaces-gap: 16px;
  /* EXACT same content gutter as HeroSection (.unhero).
     Keeps section title, dividers, controls and card viewport aligned
     with the site header/hero at ALL desktop viewport widths. */
  --unplaces-page-gutter: max(20px, 3.125%, calc(50% - 835px));
  position: relative;
  isolation: isolate;
  width: 100%;
  max-width: 100%;
  padding: clamp(48px, 5.4vw, 82px) 0 clamp(52px, 5.8vw, 88px);
  overflow: hidden;
  border-block: 1px solid #e9eff2;
  background: #fff;
  color: var(--unplaces-ink);
  font-family: inherit;
}

/* Architectural details stay very subtle so the section remains white. */
.unplaces::before {
  content: "";
  position: absolute;
  z-index: -1;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 38% 68% at 98% -8%, rgba(30, 158, 181, .065), transparent 75%),
    radial-gradient(ellipse 22% 62% at 0% 110%, rgba(10, 92, 127, .035), transparent 75%);
}
.unplaces::after {
  content: "";
  position: absolute;
  z-index: -1;
  right: -95px;
  top: -112px;
  width: 270px;
  aspect-ratio: 1;
  border: 1px solid rgba(11, 107, 142, .075);
  border-radius: 50%;
  box-shadow: 0 0 0 51px rgba(11, 107, 142, .023), 0 0 0 104px rgba(11, 107, 142, .016);
  pointer-events: none;
}

.unplaces__shell {
  /* Do not combine max-width with another gutter: that caused the
     extra ~50-60px inset visible in the previous screenshot. */
  width: 100%;
  min-width: 0;
  margin-inline: auto;
  padding-inline: var(--unplaces-page-gutter);
}
.unplaces__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 26px;
  margin-bottom: 30px;
}
.unplaces__eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 13px;
  color: var(--unplaces-blue);
  font-size: 10px;
  line-height: 1.4;
  font-weight: 850;
  letter-spacing: .19em;
  text-transform: uppercase;
}
.unplaces__eyebrow-dot {
  position: relative;
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #17a0a5;
  box-shadow: 0 0 0 4px rgba(23, 160, 165, .11);
}
.unplaces__title {
  margin: 0;
  font-size: clamp(28px, 3.1vw, 44px);
  line-height: 1.13;
  font-weight: 850;
  letter-spacing: -.045em;
  color: #102d44;
}
.unplaces__title span {
  color: var(--unplaces-blue);
}
.unplaces__description {
  margin: 11px 0 0;
  color: #697f8b;
  font-size: 14px;
  line-height: 1.75;
}

.unplaces__count {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 14px;
  min-width: 160px;
  padding: 13px 17px;
  border: 1px solid #e4edf0;
  border-radius: 16px;
  background: rgba(255, 255, 255, .90);
  box-shadow: 0 8px 26px rgba(20, 55, 70, .035);
}
.unplaces__count-number {
  font-size: 35px;
  font-weight: 850;
  letter-spacing: -.075em;
  line-height: 1;
  color: #0b688b;
  font-variant-numeric: tabular-nums;
}
.unplaces__count-copy {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 10px;
  line-height: 1.4;
  font-weight: 800;
  letter-spacing: .11em;
  text-transform: uppercase;
  color: #536d7b;
}
.unplaces__count-copy small {
  color: #8ca0aa;
  font-size: 10px;
  font-weight: 650;
  letter-spacing: .04em;
  text-transform: none;
}

.unplaces__deck {
  position: relative;
  padding-block: 22px 20px;
  border-top: 1px solid #e7eef1;
  border-bottom: 1px solid #e7eef1;
}
.unplaces__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}
.unplaces__toolbar-caption {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #758d98;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: .17em;
  text-transform: uppercase;
}
.unplaces__toolbar-caption::before {
  content: "";
  width: 24px;
  height: 2px;
  background: #2b9cae;
  border-radius: 2px;
}
.unplaces__control {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 32px;
  padding: 7px 12px;
  border: 1px solid #dfe9ed;
  border-radius: 999px;
  background: #fff;
  color: #426778;
  font: inherit;
  font-size: 11px;
  font-weight: 750;
  cursor: pointer;
  transition: border-color .2s, color .2s, background .2s;
}
.unplaces__control:hover {
  border-color: #9ccdd5;
  color: #0b688b;
  background: #f7fcfd;
}
.unplaces__control:focus-visible {
  outline: 3px solid rgba(11, 104, 139, .28);
  outline-offset: 3px;
}
.unplaces__control svg { width: 13px; height: 13px; }

.unplaces__viewport {
  overflow: hidden;
  width: 100%;
  -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 3%, #000 97%, transparent 100%);
  mask-image: linear-gradient(to right, transparent 0%, #000 3%, #000 97%, transparent 100%);
}
.unplaces__track {
  display: flex;
  align-items: stretch;
  width: max-content;
  animation: unplaces-marquee 50s linear infinite;
  will-change: transform;
}
.unplaces__group {
  display: flex;
  flex: 0 0 auto;
  align-items: stretch;
  gap: var(--unplaces-gap);
  padding-right: var(--unplaces-gap);
}
.unplaces__viewport.is-paused .unplaces__track,
.unplaces__viewport:hover .unplaces__track,
.unplaces__viewport:focus-within .unplaces__track {
  animation-play-state: paused;
}
@keyframes unplaces-marquee {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-50%, 0, 0); }
}

/* Each location is an architectural mini-card, not a fake clickable link. */
.unplaces__item {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 13px;
  width: clamp(192px, 19vw, 238px);
  min-height: 89px;
  padding: 15px 14px;
  border: 1px solid #e2ebef;
  border-radius: 16px;
  background: linear-gradient(135deg, #fff 0%, #fff 62%, #f5fafb 100%);
  box-shadow: 0 6px 23px rgba(14, 48, 69, .048);
  color: var(--unplaces-ink);
  overflow: hidden;
  transition: border-color .25s ease, box-shadow .25s ease, transform .25s ease;
}
.unplaces__item::after {
  content: "";
  position: absolute;
  right: -16px;
  bottom: -30px;
  width: 86px;
  height: 86px;
  border: 1px solid rgba(11, 104, 139, .075);
  border-radius: 50%;
  pointer-events: none;
}
.unplaces__item:hover {
  z-index: 1;
  transform: translateY(-3px);
  border-color: #9cccd6;
  box-shadow: 0 13px 26px rgba(14, 48, 69, .11);
}
.unplaces__pin {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 46px;
  height: 46px;
  border: 1px solid #dceef0;
  border-radius: 14px;
  background: linear-gradient(145deg, #eaf8f8, #f4fafb);
  color: #087d95;
}
.unplaces__pin svg {
  display: block;
  width: 22px;
  height: 22px;
}
.unplaces__copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
}
.unplaces__mini {
  color: #91a1a9;
  font-size: 9px;
  font-weight: 850;
  letter-spacing: .13em;
  text-transform: uppercase;
}
.unplaces__name {
  display: block;
  max-width: 100%;
  overflow: hidden;
  color: #163747;
  font-size: clamp(14px, 1.15vw, 17px);
  font-weight: 825;
  line-height: 1.35;
  letter-spacing: -.02em;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.unplaces__spark {
  position: absolute;
  top: 13px;
  right: 13px;
  width: 6px;
  height: 6px;
  border-radius: 2px;
  transform: rotate(45deg);
  background: #a8d9dc;
}

.unplaces__static {
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--unplaces-gap);
}
/* Accessible nonduplicated copy. Becomes the visible row for reduced motion. */
.unplaces__accessible {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.unplaces__foot {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 18px;
  color: #8397a0;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .025em;
}
.unplaces__foot-mark {
  width: 5px;
  height: 5px;
  background: #17a2ab;
  border-radius: 50%;
}

/* Match the hero's mobile breakpoints as well. */
@media (max-width: 767px) {
  .unplaces { --unplaces-page-gutter: 20px; }
}
@media (max-width: 390px) {
  .unplaces { --unplaces-page-gutter: 16px; }
}

@media (max-width: 740px) {
  .unplaces {
    --unplaces-gap: 11px;
    padding: 45px 0 53px;
  }
  .unplaces__header { align-items: flex-start; gap: 15px; margin-bottom: 23px; }
  .unplaces__title { font-size: clamp(27px, 7vw, 37px); }
  .unplaces__description { font-size: 13px; line-height: 1.65; }
  .unplaces__count { min-width: unset; gap: 8px; padding: 11px; border-radius: 12px; }
  .unplaces__count-number { font-size: 29px; }
  .unplaces__count-copy { font-size: 9px; }
  .unplaces__count-copy small { display: none; }
  .unplaces__deck { padding-block: 17px; }
  .unplaces__item { width: 191px; min-height: 81px; padding: 12px; gap: 10px; border-radius: 13px; }
  .unplaces__pin { width: 40px; height: 40px; border-radius: 11px; }
  .unplaces__pin svg { width: 20px; height: 20px; }
  .unplaces__name { font-size: 14px; }
  .unplaces__track { animation-duration: 39s; }
}
@media (max-width: 480px) {
  .unplaces__header { flex-wrap: wrap; }
  .unplaces__count { padding: 9px 12px; }
  .unplaces__toolbar-caption { font-size: 9px; letter-spacing: .12em; }
  .unplaces__toolbar-caption::before { width: 14px; }
  .unplaces__control { padding-inline: 10px; }
  .unplaces__viewport {
    -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 7%, #000 93%, transparent 100%);
    mask-image: linear-gradient(to right, transparent 0%, #000 7%, #000 93%, transparent 100%);
  }
  .unplaces__foot { font-size: 10px; }
}
@media (prefers-reduced-motion: reduce) {
  .unplaces__viewport { display: none; }
  .unplaces__control { display: none; }
  .unplaces__accessible {
    position: static;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--unplaces-gap);
    width: auto;
    height: auto;
    margin: 0;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }
  .unplaces__item { transition: none; }
  .unplaces__item:hover { transform: none; }
}
`;

function region(location: unknown): string {
  if (typeof location !== 'string') return '';
  return location.split(',')[0].replace(/\s+/g, ' ').trim();
}

type LocationsMarqueeProps = {
  locations?: unknown[];
};

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.75" />
    </svg>
  );
}

function MotionIcon({ paused }: { paused: boolean }) {
  return paused ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m8 5 11 7-11 7V5Z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 5v14M15 5v14" />
    </svg>
  );
}

function LocationItem({ name, index }: { name: string; index: number }) {
  return (
    <div className="unplaces__item" title={name}>
      <span className="unplaces__pin" aria-hidden="true"><PinIcon /></span>
      <span className="unplaces__copy">
        <span className="unplaces__mini">Location {String(index + 1).padStart(2, '0')}</span>
        <span className="unplaces__name">{name}</span>
      </span>
      <span className="unplaces__spark" aria-hidden="true" />
    </div>
  );
}

export default function LocationsMarquee({ locations = [] }: LocationsMarqueeProps) {
  const [paused, setPaused] = useState(false);
  const seen = new Set<string>();
  const unique = (Array.isArray(locations) ? locations : [])
    .map(region)
    .filter((name) => {
      const key = name.toLocaleLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 12);

  // Retain the original behavior: don't show the section with fewer than two areas.
  if (unique.length < 2) return null;

  const scrolling = unique.length > 3;
  // A full cycle is wide enough on large desktops; two identical groups give a seamless loop.
  const repetitions = Math.max(1, Math.ceil(16 / unique.length));
  const cycle = Array.from({ length: repetitions }, () => unique).flat();

  return (
    <section className="unplaces" aria-labelledby="unplaces-title">
      <style>{CSS}</style>
      <div className="unplaces__shell">
        <header className="unplaces__header">
          <div>
            <p className="unplaces__eyebrow">
              <span className="unplaces__eyebrow-dot" aria-hidden="true" />
              Our locations
            </p>
            <h2 id="unplaces-title" className="unplaces__title">
              Find your next <span>address.</span>
            </h2>
            <p className="unplaces__description">
              Explore locations featured across our properties and projects.
            </p>
          </div>
          <div className="unplaces__count" aria-label={`${unique.length} locations featured`}>
            <strong className="unplaces__count-number">{String(unique.length).padStart(2, '0')}</strong>
            <span className="unplaces__count-copy">
              Featured areas
              <small>Explore our presence</small>
            </span>
          </div>
        </header>

        <div className="unplaces__deck">
          <div className="unplaces__toolbar">
            <span className="unplaces__toolbar-caption">Locations in focus</span>
            {scrolling && (
              <button
                type="button"
                className="unplaces__control"
                aria-label={paused ? 'Resume locations scrolling' : 'Pause locations scrolling'}
                aria-pressed={paused}
                onClick={() => setPaused((value) => !value)}
              >
                <MotionIcon paused={paused} />
                {paused ? 'Resume' : 'Pause'}
              </button>
            )}
          </div>

          {scrolling ? (
            <>
              <div className={`unplaces__viewport${paused ? ' is-paused' : ''}`} aria-hidden="true">
                <div className="unplaces__track">
                  {[0, 1].map((copy) => (
                    <div className="unplaces__group" key={copy}>
                      {cycle.map((name, index) => (
                        <LocationItem key={`${copy}-${index}`} name={name} index={index % unique.length} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="unplaces__accessible" role="list" aria-label="All locations">
                {unique.map((name, index) => (
                  <div role="listitem" key={name}><LocationItem name={name} index={index} /></div>
                ))}
              </div>
            </>
          ) : (
            <div className="unplaces__static" role="list" aria-label="All locations">
              {unique.map((name, index) => (
                <div role="listitem" key={name}><LocationItem name={name} index={index} /></div>
              ))}
            </div>
          )}
        </div>
        <div className="unplaces__foot" aria-hidden="true">
          <span className="unplaces__foot-mark" />
          Connecting places with possibilities
          <span className="unplaces__foot-mark" />
        </div>
      </div>
    </section>
  );
}
