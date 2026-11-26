import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';

// Keep the same image files already present in your project.
import apartmentImage from '../assets/services/apartments.webp';
import villaImage from '../assets/services/villa.webp';
import commercialImage from '../assets/services/skyline.webp';
import constructionImage from '../assets/services/construction.webp';
import interiorImage from '../assets/services/interiors.webp';
import plumbingImage from '../assets/services/plumbing.webp';
import bathroomImage from '../assets/services/bathroom.webp';
import liftImage from '../assets/services/lifts.webp';

/** Component-local CSS. No CSS package, animation package, or icon package needed. */
const CSS = String.raw`
.unstrip,.unstrip *{box-sizing:border-box}
.unstrip{
  --unstrip-blue:#08769b;
  --unstrip-blue-deep:#075a79;
  --unstrip-navy:#132e42;
  --unstrip-ink:#1b3446;
  --unstrip-muted:#617583;
  --unstrip-line:#e2eaf0;
  --unstrip-frame-w:clamp(250px,29vw,408px);
  --unstrip-frame-h:clamp(182px,20vw,267px);
  position:relative;isolation:isolate;overflow:hidden;
  width:100%;padding:clamp(58px,6.3vw,100px) 0 45px;
  color:var(--unstrip-ink);background:#fff;font-family:inherit;
  border-block:1px solid #edf1f5;
}
/* Subtle architectural drafting lines: still a white, bright section. */
.unstrip::before{
  content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;
  background-image:linear-gradient(#0b63860a 1px,transparent 1px),linear-gradient(90deg,#0b63860a 1px,transparent 1px);
  background-size:64px 64px;
  -webkit-mask-image:linear-gradient(to bottom,#000 0%,#0003 55%,transparent 85%);
  mask-image:linear-gradient(to bottom,#000 0%,#0003 55%,transparent 85%);
}
.unstrip::after{
  content:"";position:absolute;z-index:-1;top:-250px;left:50%;width:min(95vw,1150px);height:480px;
  transform:translateX(-50%);border-radius:50%;pointer-events:none;
  background:radial-gradient(ellipse,#d7effa53 0%,#ffffff00 70%);
}
.unstrip__glow{
  position:absolute;width:min(65vw,850px);height:230px;left:50%;top:47%;z-index:-1;
  transform:translate(-50%,-50%);background:#b8e6f4;opacity:.23;
  filter:blur(74px);pointer-events:none;border-radius:50%;
}
.unstrip__shell{width:min(100% - 52px,1500px);margin-inline:auto;position:relative}
.unstrip__header{text-align:center;max-width:1030px;margin:0 auto 6px;position:relative;z-index:5}
.unstrip__eyebrow{
  margin:0 0 16px;color:var(--unstrip-blue);font-size:11px;font-weight:850;
  letter-spacing:.27em;text-transform:uppercase;
}
.unstrip__eyebrow::before,.unstrip__eyebrow::after{
  content:"";display:inline-block;vertical-align:middle;width:26px;height:2px;
  margin:0 13px 3px;background:currentColor;opacity:.58;border-radius:99px;
}
.unstrip__title{
  margin:0;color:var(--unstrip-navy);font-size:clamp(31px,4.5vw,64px);
  font-weight:850;letter-spacing:-.052em;line-height:1.08;text-wrap:balance;
}
.unstrip__title-mark{color:var(--unstrip-blue)}
.unstrip__subtitle{
  margin:16px auto 0;max-width:670px;color:var(--unstrip-muted);
  font-size:clamp(13px,1.24vw,17px);line-height:1.75;
}
.unstrip__stage{
  position:relative;width:100%;height:clamp(325px,36vw,480px);
  overflow:hidden;touch-action:pan-y;
}
.unstrip__stage::before,.unstrip__stage::after{
  content:"";position:absolute;z-index:5;top:0;bottom:0;
  width:min(12vw,160px);pointer-events:none;
}
.unstrip__stage::before{left:0;background:linear-gradient(90deg,#fff 0%,#fff0 100%)}
.unstrip__stage::after{right:0;background:linear-gradient(270deg,#fff 0%,#fff0 100%)}
.unstrip__slope{position:absolute;inset:0;transform:rotate(-4.5deg);transform-origin:center center}
.unstrip__film-band{
  position:absolute;top:50%;left:-15%;width:130%;height:calc(var(--unstrip-frame-h) + 54px);
  transform:translateY(-50%);
  background:linear-gradient(180deg,#dce6ee 0%,#f3f7fa 17%,#fcfdff 31%,#eff5fa 68%,#fafdff 82%,#d7e3eb 100%);
  border:1px solid #cad8e3;box-shadow:0 24px 42px #16384d15,0 9px 22px #16384d10;
}
.unstrip__film-band::before,.unstrip__film-band::after{
  content:"";position:absolute;left:0;right:0;height:17px;
  background:repeating-linear-gradient(90deg,#536d80 0 13px,transparent 13px 22px);
  background-size:35px 100%;border-block:2px solid #d2dde5;
}
.unstrip__film-band::before{top:6px}
.unstrip__film-band::after{bottom:6px}
.unstrip__film-window{
  position:absolute;top:50%;left:50%;width:var(--unstrip-frame-w);height:var(--unstrip-frame-h);
  padding:0;border:0;border-radius:12px;overflow:hidden;background:#dae8ef;cursor:pointer;
  box-shadow:0 4px 14px #14344826;
  transition:transform .85s cubic-bezier(.2,1,.32,1),opacity .65s ease,box-shadow .6s ease,filter .65s ease;
  will-change:transform;isolation:isolate;
}
.unstrip__film-window img{display:block;position:absolute;inset:0;width:100%;height:100%}
.unstrip__film-window .unstrip__image-bg{
  object-fit:cover;filter:blur(17px) brightness(1.08) saturate(.86);
  transform:scale(1.17);opacity:.87;
}
/* object-fit:contain keeps the full photo visible, regardless of its aspect ratio. */
.unstrip__film-window .unstrip__image-main{
  object-fit:contain;object-position:center;
  filter:saturate(.82) brightness(.9);transition:filter .65s ease,transform 1.2s ease;
}
.unstrip__film-window[data-active="true"]{
  box-shadow:0 0 0 3px #fff,0 0 0 7px var(--unstrip-blue),0 16px 42px #16425b34,0 3px 14px #0e7aaf2a;
}
.unstrip__film-window[data-active="true"] .unstrip__image-main{filter:saturate(1.03) brightness(1.01);transform:scale(1.015)}
.unstrip__film-window[data-active="false"]:hover .unstrip__image-main{filter:saturate(1) brightness(.98)}
.unstrip__film-window:focus-visible{outline:3px solid var(--unstrip-blue);outline-offset:10px}
.unstrip__film-window[data-far="true"]{pointer-events:none}
.unstrip__film-window::after{
  content:"";position:absolute;inset:0;pointer-events:none;z-index:0;
  background:linear-gradient(180deg,#ffffff1c,transparent 60%,#06192a19);
}
.unstrip__image-label{
  position:absolute;z-index:2;top:15px;left:15px;max-width:calc(100% - 85px);
  padding:10px 13px;border:1px solid #fff;border-radius:10px;
  background:rgba(255,255,255,.83);color:var(--unstrip-navy);
  -webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);
  text-align:left;box-shadow:0 7px 24px #05121b13;
}
.unstrip__image-label strong{display:block;font-size:clamp(13px,1.35vw,18px);font-weight:850;letter-spacing:-.02em;line-height:1.3;overflow-wrap:anywhere}
.unstrip__image-label small{display:block;margin-bottom:4px;font-size:9px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--unstrip-blue)}
.unstrip__frame-num{
  position:absolute;z-index:2;right:15px;top:15px;display:grid;place-items:center;
  min-width:33px;height:29px;padding-inline:7px;background:rgba(255,255,255,.89);
  border:1px solid #ffffffc7;border-radius:7px;color:var(--unstrip-navy);font-weight:850;font-size:11px;
  line-height:1;letter-spacing:.05em;box-shadow:0 3px 8px #16344817;
}
.unstrip__frame-corner{
  position:absolute;z-index:2;right:14px;bottom:14px;display:flex;align-items:center;
  gap:6px;color:#fff;font-size:9px;font-weight:850;letter-spacing:.13em;
  padding:7px 10px;border-radius:99px;background:#0f3046b8;
  -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);
}
.unstrip__frame-corner i{width:17px;height:3px;border-radius:2px;background:#70dfed}
.unstrip__spotlight{
  position:relative;z-index:8;max-width:1080px;margin:1px auto 0;
  padding:18px 23px;display:flex;justify-content:space-between;
  align-items:center;gap:28px;border:1px solid var(--unstrip-line);
  border-radius:19px;background:#fff;box-shadow:0 14px 36px #112f4610,0 3px 10px #112f4609;
}
.unstrip__details{flex:1;min-width:0}
.unstrip__now{
  margin:0 0 8px;font-size:10px;color:var(--unstrip-blue);
  letter-spacing:.19em;font-weight:850;text-transform:uppercase;
}
.unstrip__now span{
  display:inline-block;width:7px;height:7px;margin:0 8px 1px 0;
  background:var(--unstrip-blue);border-radius:50%;box-shadow:0 0 0 4px #08769b19;
}
.unstrip__service-title{margin:0;color:var(--unstrip-navy);font-size:clamp(21px,2.5vw,31px);font-weight:850;letter-spacing:-.025em;line-height:1.2}
.unstrip__service-description{margin:8px 0 0;max-width:580px;color:var(--unstrip-muted);font-size:13px;line-height:1.7}
.unstrip__info-swap{animation:unstrip-pop .5s ease both}
@keyframes unstrip-pop{from{opacity:.2;transform:translateY(9px)}to{opacity:1;transform:translateY(0)}}
.unstrip__right{display:flex;flex-direction:column;align-items:flex-end;gap:15px;flex-shrink:0}
.unstrip__counter{font-size:12px;font-weight:750;letter-spacing:.08em;color:#567285;font-variant-numeric:tabular-nums}
.unstrip__counter strong{font-size:20px;color:var(--unstrip-navy)}
.unstrip__counter span{color:#9aabb6}
.unstrip__nav{display:flex;align-items:center;gap:10px}
.unstrip__control{
  width:43px;height:43px;padding:0;border-radius:50%;display:grid;place-items:center;
  color:var(--unstrip-navy);background:#fff;border:1px solid #d7e2e9;cursor:pointer;
  transition:background .2s,border-color .2s,transform .2s,box-shadow .2s;
}
.unstrip__control:hover:not(:disabled){background:#e9f6fa;border-color:var(--unstrip-blue);transform:translateY(-2px)}
.unstrip__control:focus-visible,.unstrip__dot:focus-visible{outline:3px solid var(--unstrip-blue);outline-offset:4px}
.unstrip__control:disabled{opacity:.35;cursor:not-allowed}
.unstrip__control svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.unstrip__control--primary{background:var(--unstrip-blue);border-color:var(--unstrip-blue);color:#fff;box-shadow:0 6px 18px #08769b35}
.unstrip__control--primary:hover:not(:disabled){color:#fff;background:var(--unstrip-blue-deep);border-color:var(--unstrip-blue-deep)}
.unstrip__footer{position:relative;z-index:7;display:flex;justify-content:space-between;align-items:center;gap:18px;margin:23px auto 0;max-width:1080px}
.unstrip__dots{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:9px}
.unstrip__dot{width:25px;height:5px;padding:0;border:0;border-radius:999px;background:#d0e0ea;cursor:pointer;transition:background .3s,width .3s,box-shadow .3s}
.unstrip__dot[aria-current="true"]{width:44px;background:var(--unstrip-blue);box-shadow:0 0 0 3px #08769b12}
.unstrip__dot:hover{background:#50adc7}
.unstrip__help{margin:0;color:#8496a2;font-size:11px;letter-spacing:.025em;text-align:right}
.unstrip__fine{margin-top:23px;display:flex;align-items:center;justify-content:center;gap:10px;color:#8ba1ad;font-size:10px;letter-spacing:.13em;text-transform:uppercase}
.unstrip__fine::before,.unstrip__fine::after{content:"";width:28px;height:1px;background:#cddae1}
@media (min-width:1200px){.unstrip__spotlight{padding:21px 26px}}
@media (max-width:850px){
 .unstrip__shell{width:min(100% - 36px,1500px)}
 .unstrip__stage{height:365px}
 .unstrip{--unstrip-frame-w:330px;--unstrip-frame-h:238px}
 .unstrip__spotlight{padding:17px 19px}
}
@media (max-width:600px){
 .unstrip{--unstrip-frame-w:min(73vw,300px);--unstrip-frame-h:205px;padding:49px 0 35px}
 .unstrip__shell{width:calc(100% - 26px)}
 .unstrip__header{padding-inline:8px;margin-bottom:0}
 .unstrip__title{font-size:clamp(29px,7.5vw,41px)}
 .unstrip__subtitle{margin-top:11px;font-size:13px;line-height:1.6}
 .unstrip__eyebrow{font-size:10px;margin-bottom:13px}
 .unstrip__eyebrow::before,.unstrip__eyebrow::after{width:12px;margin-inline:8px}
 .unstrip__stage{height:300px}
 .unstrip__slope{transform:rotate(-5deg)}
 .unstrip__film-band{height:calc(var(--unstrip-frame-h) + 47px)}
 .unstrip__film-band::before,.unstrip__film-band::after{height:13px;background:repeating-linear-gradient(90deg,#536d80 0 10px,transparent 10px 16px);background-size:27px 100%}
 .unstrip__film-band::before{top:5px}
 .unstrip__film-band::after{bottom:5px}
 .unstrip__image-label{top:11px;left:11px;padding:9px 10px;max-width:calc(100% - 62px)}
 .unstrip__image-label strong{font-size:13px}
 .unstrip__frame-num{top:11px;right:10px;min-width:28px;height:25px;font-size:10px}
 .unstrip__spotlight{align-items:flex-start;gap:11px;border-radius:15px;padding:16px}
 .unstrip__service-title{font-size:21px}
 .unstrip__service-description{font-size:12px;line-height:1.55}
 .unstrip__right{gap:12px}
 .unstrip__nav{gap:7px}
 .unstrip__control{width:35px;height:35px}
 .unstrip__control svg{width:17px;height:17px}
 .unstrip__footer{margin-top:19px;justify-content:center;flex-direction:column;gap:13px}
 .unstrip__help{text-align:center;font-size:10px}
 .unstrip__fine{margin-top:19px;text-align:center;font-size:9px;letter-spacing:.075em;line-height:1.5}
 .unstrip__fine::before,.unstrip__fine::after{display:none}
}
@media (max-width:360px){
 .unstrip{--unstrip-frame-h:185px}
 .unstrip__stage{height:280px}
 .unstrip__spotlight{flex-direction:column}
 .unstrip__right{width:100%;align-items:center;flex-direction:row;justify-content:space-between}
}
@media (prefers-reduced-motion:reduce){
 .unstrip *, .unstrip *::before,.unstrip *::after{animation-duration:.01ms!important;transition-duration:.01ms!important;scroll-behavior:auto!important}
}
`;

const DEFAULT_SERVICES: string[] = [];
const DEFAULT_IMAGES: Record<string, string> = {};
const AUTOPLAY_MS = 2000;

type ServiceSlide = {name: string; image: string; description: string};

type Props = {
  services?: string[];
  /** Optional photo overrides keyed by the exact service name from your admin panel. */
  images?: Record<string, string>;
  /** Defaults to true. The pause button also lets visitors stop autoplay. */
  autoplay?: boolean;
  /** Interval in milliseconds; defaults to 2000 (2 seconds). Minimum is 1800ms. */
  intervalMs?: number;
};

function presentService(name: string, index: number): Omit<ServiceSlide, 'name'> {
  const s = name.toLowerCase();
  if (/villa|gated|luxury|bungalow/.test(s)) return {image:villaImage, description:'Distinctive villas and carefully planned communities, built around the way you live.'};
  if (/office|commercial|retail|workspace|shopping/.test(s)) return {image:commercialImage, description:'Future-ready business spaces, offices and retail environments that make a statement.'};
  if (/plot|land|site|development/.test(s)) return {image:constructionImage, description:'Find the right foundation and explore land with lasting potential.'};
  if (/loan|finance|valuation|mortgage/.test(s)) return {image:interiorImage, description:'Clear guidance to help you make more confident property decisions.'};
  if (/rera|legal|document|verify|registration|title check/.test(s)) return {image:apartmentImage, description:'Helpful support for the important details behind your next property.'};
  if (/rent|lease|tenant|letting/.test(s)) return {image:apartmentImage, description:'Spaces that suit today and adapt to your tomorrow.'};
  if (/invest|consult|advis/.test(s)) return {image:villaImage, description:'Thoughtful insights and tailored solutions for your property journey.'};
  if (/bath|sanitary|washroom/.test(s)) return {image:bathroomImage, description:'Elevated bathroom spaces with refined details, fitting and finishes.'};
  if (/plumb|repair|maintain|maintenance|pipe/.test(s)) return {image:plumbingImage, description:'Dependable, practical installations and improvements for every property.'};
  if (/lift|elevator|escalator/.test(s)) return {image:liftImage, description:'Smart vertical mobility for convenient and accessible modern buildings.'};
  if (/interior|decor|furnish|kitchen|design/.test(s)) return {image:interiorImage, description:'Personalized interiors with beautiful materials and considered details.'};
  if (/construct|civil|renovat|build|structural/.test(s)) return {image:constructionImage, description:'From strong foundations to exceptional finishes, bring your vision to life.'};
  if (/paint|finish/.test(s)) return {image:interiorImage, description:'The right finishing touches to make every corner feel complete.'};
  if (/property|properties|home|house|flat|apart|residential|buy|sell/.test(s)) return {image:apartmentImage, description:'Beautiful residential spaces and options for every stage of life.'};
  const alternatives = [apartmentImage, villaImage, interiorImage, commercialImage];
  return {image:alternatives[index % alternatives.length], description:'Explore tailored property solutions designed around your ambitions.'};
}

/** Smallest wrapped distance between two slides. Far slides silently wrap outside the viewport. */
function wrappedOffset(index: number, active: number, total: number): number {
  let offset = (index - active + total) % total;
  if (offset > Math.floor(total / 2)) offset -= total;
  return offset;
}

function Chevron({direction}: {direction: 'left' | 'right'}) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} /></svg>;
}

export default function HomeServicesStrip({
  services = DEFAULT_SERVICES,
  images = DEFAULT_IMAGES,
  autoplay = true,
  intervalMs = AUTOPLAY_MS,
}: Props) {
  const slides = useMemo<ServiceSlide[]>(() => {
    return (Array.isArray(services) ? services : [])
      .filter((name): name is string => typeof name === 'string' && Boolean(name.trim()))
      .map((name, index) => {
        const label = name.trim();
        const fallback = presentService(label, index);
        return {name: label, description: fallback.description, image: images[label] || fallback.image};
      });
  }, [services, images]);

  const signature = slides.map((s) => s.name).join('\u001f');
  const [activeIndex, setActiveIndex] = useState(0);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPageHidden, setIsPageHidden] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const swipeStart = useRef<{x: number; y: number} | null>(null);
  const ignoreNextClick = useRef(false);

  // If the admin changes the services, begin with the first service again.
  useEffect(() => setActiveIndex(0), [signature]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setPrefersReducedMotion(query.matches);
    updateMotion();
    query.addEventListener?.('change', updateMotion);
    return () => query.removeEventListener?.('change', updateMotion);
  }, []);

  useEffect(() => {
    const updateVisibility = () => setIsPageHidden(document.hidden);
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  const count = slides.length;
  const currentIndex = count ? activeIndex % count : 0;
  const stopped = !autoplay || manuallyPaused || isFocused || isPageHidden || prefersReducedMotion;

  useEffect(() => {
    if (stopped || count < 2) return;
    const timer = window.setInterval(() => setActiveIndex((prev) => (prev + 1) % count), Math.max(1800, intervalMs));
    return () => window.clearInterval(timer);
  }, [stopped, count, intervalMs, currentIndex]);

  const move = (amount: number) => {
    if (count > 1) setActiveIndex((prev) => (prev + amount + count) % count);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') return;
    swipeStart.current = {x: event.clientX, y: event.clientY};
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const distanceX = event.clientX - start.x;
    const distanceY = event.clientY - start.y;
    if (Math.abs(distanceX) >= 45 && Math.abs(distanceX) > Math.abs(distanceY) * 1.2) {
      move(distanceX < 0 ? 1 : -1);
      ignoreNextClick.current = true;
      window.setTimeout(() => { ignoreNextClick.current = false; }, 150);
    }
  };

  if (!count) return null;
  const currentSlide = slides[currentIndex];
  const allowsMovement = count > 1;

  return (
    <section
      className="unstrip"
      aria-labelledby="unstrip-title"
      aria-roledescription="carousel"
      aria-label="Our property and construction services"
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsFocused(false);
      }}
    >
      <style>{CSS}</style>
      <span className="unstrip__glow" aria-hidden="true" />
      <div className="unstrip__shell">
        <header className="unstrip__header">
          <p className="unstrip__eyebrow">Built around your vision</p>
          <h2 id="unstrip-title" className="unstrip__title">
            Solutions for every <span className="unstrip__title-mark">property need</span>
          </h2>
          <p className="unstrip__subtitle">From beautiful homes to thoughtful interiors — explore what we build, design and bring to life.</p>
        </header>

        <div
          className="unstrip__stage"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {swipeStart.current = null;}}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') {event.preventDefault(); move(1);}
            if (event.key === 'ArrowLeft') {event.preventDefault(); move(-1);}
          }}
        >
          <div className="unstrip__slope">
            <div className="unstrip__film-band" aria-hidden="true" />
            {slides.map((slide, index) => {
              const offset = wrappedOffset(index, currentIndex, count);
              const isActive = offset === 0;
              const isFar = Math.abs(offset) > 2;
              const style: CSSProperties = {
                transform: `translate(-50%, -50%) translateX(calc(${offset * 100}% + ${offset * 17}px)) scale(${isActive ? 1.045 : 0.976})`,
                zIndex: isActive ? 4 : Math.max(1, 3 - Math.abs(offset)),
                opacity: isFar ? 0 : isActive ? 1 : 0.91,
                filter: isActive ? 'none' : `brightness(${Math.abs(offset) === 1 ? .94 : .86})`,
              };
              return (
                <button
                  key={`${slide.name}-${index}`}
                  type="button"
                  className="unstrip__film-window"
                  data-active={isActive}
                  data-far={isFar}
                  style={style}
                  aria-label={`Show service ${index + 1}: ${slide.name}`}
                  aria-hidden={!isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => {
                    if (ignoreNextClick.current) return;
                    setActiveIndex(index);
                  }}
                >
                  <img className="unstrip__image-bg" src={slide.image} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                  <img className="unstrip__image-main" src={slide.image} alt="" loading={Math.abs(offset) <= 1 ? 'eager' : 'lazy'} decoding="async" />
                  <span className="unstrip__image-label">
                    <small>Our service</small>
                    <strong>{slide.name}</strong>
                  </span>
                  <span className="unstrip__frame-num">{String(index + 1).padStart(2, '0')}</span>
                  {isActive && <span className="unstrip__frame-corner"><i /> IN FOCUS</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="unstrip__spotlight">
          <div className="unstrip__details">
            <p className="unstrip__now"><span aria-hidden="true" />Featured solution</p>
            <div className="unstrip__info-swap" key={`${currentSlide.name}-${currentIndex}`}>
              <h3 className="unstrip__service-title">{currentSlide.name}</h3>
              <p className="unstrip__service-description">{currentSlide.description}</p>
            </div>
          </div>
          <div className="unstrip__right">
            <div className="unstrip__counter"><strong>{String(currentIndex + 1).padStart(2, '0')}</strong> <span>/ {String(count).padStart(2, '0')}</span></div>
            <div className="unstrip__nav" aria-label="Slideshow controls">
              <button className="unstrip__control" type="button" onClick={() => move(-1)} disabled={!allowsMovement} aria-label="Previous service"><Chevron direction="left" /></button>
              <button className="unstrip__control unstrip__control--primary" type="button" onClick={() => move(1)} disabled={!allowsMovement} aria-label="Next service"><Chevron direction="right" /></button>
              {autoplay && !prefersReducedMotion && allowsMovement && (
                <button
                  className="unstrip__control"
                  type="button"
                  onClick={() => setManuallyPaused((prev) => !prev)}
                  aria-label={manuallyPaused ? 'Play slideshow' : 'Pause slideshow'}
                  aria-pressed={manuallyPaused}
                >
                  {manuallyPaused
                    ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z" /></svg>
                    : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14" /></svg>}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="unstrip__footer">
          <div className="unstrip__dots" aria-label="Select service">
            {slides.map((slide, index) => (
              <button
                key={`${slide.name}-dot-${index}`}
                type="button"
                className="unstrip__dot"
                aria-label={`Show ${slide.name}`}
                aria-current={index === currentIndex ? 'true' : undefined}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
          <p className="unstrip__help">Use the arrows or swipe to discover more services</p>
        </div>
        <div className="unstrip__fine" aria-hidden="true">Thoughtfully designed · Beautifully built</div>
      </div>
    </section>
  );
}
