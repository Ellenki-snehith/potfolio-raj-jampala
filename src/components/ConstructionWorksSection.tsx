import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Camera,
  Clock3,
  HardHat,
  Heart,
  MapPin,
  Ruler,
  ShieldCheck,
} from 'lucide-react';
import { ListingExtraDetails } from './ListingExtraDetails';
import { mediaUrl } from '../api';
import p3 from '../assets/p3.jpg';
import { ShowcaseSection } from './HomeShowcase';

type ConstructionProject = Record<string, any>;

// Construction favorites are stored separately from property favorites.
const CONSTRUCTION_FAVORITES_KEY = 'urbannest:favorite-construction-works';
const CONSTRUCTION_FAVORITES_EVENT = 'urbannest:construction-favorites-changed';

/**
 * Same navy/blue horizontal card design as the Featured Properties cards.
 * The only layout difference on desktop is that the construction PHOTO IS ON THE RIGHT.
 * Cards are intentionally taller/larger than the reference property cards.
 * CSS is fully scoped: it does not change Properties or other Showcase sections.
 */
const CARD_CSS = String.raw`
.ucw-card, .ucw-card * { box-sizing: border-box; }
.ucw-card {
  --ucw-navy: #102b43;
  --ucw-blue: #0b688b;
  --ucw-text: #203246;
  --ucw-muted: #647385;
  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(360px, 27vw, 460px);
  width: 100%;
  min-width: 0;
  min-height: 320px;
  overflow: hidden;
  border: 1px solid #dfe5ec;
  border-radius: 17px;
  background: #fff;
  color: var(--ucw-text);
  box-shadow: 0 3px 13px rgba(16, 43, 67, .035);
  transition: border-color .2s, box-shadow .2s, transform .2s;
}
.ucw-card:hover {
  border-color: #94abba;
  box-shadow: 0 12px 32px rgba(16,43,67,.11);
  transform: translateY(-2px);
}
.ucw-card a { text-decoration: none; }
.ucw-card a:focus-visible,
.ucw-card button:focus-visible { outline: 3px solid var(--ucw-blue); outline-offset: 3px; }

/* LEFT: project details, matching PropertyCard proportions and typography. */
.ucw-card__info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 22px 24px 18px;
}
.ucw-card__top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.ucw-card__price {
  display: block;
  color: var(--ucw-navy);
  font-size: 24px;
  line-height: 1.3;
  font-weight: 850;
  letter-spacing: -.025em;
  overflow-wrap: anywhere;
}
.ucw-card__price--inquiry { font-size: 21px; }
.ucw-card__rate { display: block; margin-top: 2px; color: #718092; font-size: 12px; }
.ucw-card__title {
  display: inline-block;
  align-self: flex-start;
  margin: 9px 0 6px;
  color: var(--ucw-text);
  font-size: 18px;
  line-height: 1.38;
  font-weight: 800;
  overflow-wrap: anywhere;
}
.ucw-card__title:hover { color: var(--ucw-blue); }
.ucw-card__location {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  color: var(--ucw-muted);
  font-size: 13px;
  line-height: 1.45;
}
.ucw-card__location svg { flex-shrink: 0; margin-top: 2px; color: var(--ucw-blue); }
.ucw-card__facts {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 9px 21px;
  margin-top: 15px;
}
.ucw-card__fact {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #374151;
  font-size: 13px;
  line-height: 1.5;
}
.ucw-card__fact svg { flex-shrink: 0; color: #647385; }
.ucw-card__description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin: 13px 0 0;
  color: #68798a;
  font-size: 13px;
  line-height: 1.55;
}
.ucw-card__extras { margin-top: 12px; color: #68798a; font-size: 12px; }
.ucw-card__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 13px;
  border-top: 1px solid #e4e9ef;
  min-height: 37px;
}
.ucw-card__bottom-left {
  display: flex;
  align-items: center;
  gap: 7px 14px;
  flex-wrap: wrap;
  min-width: 0;
}
.ucw-card__verified {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ucw-blue);
  font-size: 12px;
  font-weight: 600;
}
.ucw-card__category {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  color: #657688;
  font-size: 12px;
  font-weight: 600;
  text-align: right;
  margin-left: auto;
}
.ucw-card__category:hover { color: var(--ucw-blue); }

/* RIGHT: full-height image (a mirror of the reference Properties card). */
.ucw-card__visual {
  position: relative;
  min-height: 320px;
  min-width: 0;
  overflow: hidden;
  background: #e8ecf1;
}
.ucw-card__image-link { position: absolute; inset: 0; display: block; overflow: hidden; }
.ucw-card__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .45s ease;
}
.ucw-card:hover .ucw-card__image { transform: scale(1.045); }
.ucw-card__tag {
  position: absolute;
  top: 14px;
  left: 14px;
  max-width: calc(100% - 96px);
  border-radius: 100px;
  padding: 7px 14px;
  background: var(--ucw-blue);
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  box-shadow: 0 2px 7px rgba(0,0,0,.16);
}
.ucw-card__tag--standard { background: var(--ucw-navy); }
.ucw-card__favorite {
  position: absolute;
  right: 14px;
  top: 14px;
  display: grid;
  place-items: center;
  width: 39px;
  height: 39px;
  border: 1px solid rgba(224,232,240,.7);
  border-radius: 50%;
  background: rgba(255,255,255,.96);
  color: #66768a;
  cursor: pointer;
  box-shadow: 0 3px 9px rgba(0,0,0,.13);
  transition: transform .2s, color .2s;
}
.ucw-card__favorite:hover { transform: scale(1.08); color: var(--ucw-blue); }
.ucw-card__favorite[aria-pressed="true"] { color: #bb3750; }
.ucw-card__photo-count {
  position: absolute;
  bottom: 14px;
  right: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: 6px;
  background: rgba(16,43,67,.88);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  pointer-events: none;
}

@media (max-width: 1000px) {
  .ucw-card { grid-template-columns: minmax(0, 1fr) 340px; min-height: 300px; }
  .ucw-card__visual { min-height: 300px; }
  .ucw-card__info { padding: 19px 20px 16px; }
  .ucw-card__facts { gap: 9px 14px; }
}
@media (max-width: 740px) {
  .ucw-card { grid-template-columns: minmax(0, 1fr) 275px; }
  .ucw-card__price { font-size: 21px; }
  .ucw-card__price--inquiry { font-size: 19px; }
  .ucw-card__title { font-size: 16px; }
}
@media (max-width: 640px) {
  .ucw-card { grid-template-columns: minmax(0, 1fr); min-height: 0; border-radius: 15px; }
  .ucw-card__visual { grid-row: 1; height: 255px; min-height: 0; }
  .ucw-card__info { grid-row: 2; min-height: 270px; padding: 16px; }
  .ucw-card__price { font-size: 21px; }
  .ucw-card__title { font-size: 16px; }
  .ucw-card__facts { gap: 9px 14px; }
  .ucw-card__bottom { margin-top: 17px; }
}
@media (max-width: 390px) {
  .ucw-card__visual { height: 220px; }
  .ucw-card__info { padding: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .ucw-card, .ucw-card__image, .ucw-card__favorite { transition: none; }
}
`;

// Exact side-gutter logic and navy/blue theme from the user's #home-properties section.
const SECTION_CSS = String.raw`
#home-construction.unshow {
  --ucw-section-gutter: max(20px, 3.125vw, calc((100vw - 1670px) / 2));
  background: #f6f7f9;
  color: #102b43;
}
#home-construction.unshow .unshow__wrap {
  box-sizing: border-box;
  width: calc(100% - 2 * var(--ucw-section-gutter));
  max-width: none;
  margin-inline: auto;
  padding-inline: 0;
}
#home-construction.unshow .unshow__grid {
  grid-template-columns: minmax(0, 1fr);
  gap: 18px;
}
#home-construction.unshow :is(.unshow__eyebrow, .unshow__kicker, .unshow__overline) { color: #0b688b; }
#home-construction.unshow :is(.unshow__title, .unshow__heading) { color: #102b43; }
#home-construction.unshow :is(.unshow__action, .unshow__more, .unshow__link) { color: #0b688b; }
#home-construction.unshow :is(.unshow__action, .unshow__more, .unshow__link):hover { color: #102b43; }
#home-construction.unshow :is(.unshow__action, .unshow__more, .unshow__link):focus-visible {
  outline: 3px solid #0b688b;
  outline-offset: 3px;
}
@media (max-width: 640px) {
  #home-construction.unshow { --ucw-section-gutter: 20px; }
}
@media (max-width: 390px) {
  #home-construction.unshow { --ucw-section-gutter: 16px; }
}
`;

function text(value: unknown): string {
  return value == null ? '' : String(value).trim();
}

function isTrue(value: unknown): boolean {
  return value === true || value === 1 ||
    (typeof value === 'string' && /^(yes|true|1|featured|verified|approved)$/i.test(value.trim()));
}

function formatPrice(value: unknown): string {
  if (value == null || text(value) === '') return 'Request quotation';
  const raw = text(value);
  const numeric = typeof value === 'number'
    ? value
    : /^\d+(\.\d+)?$/.test(raw) ? Number(raw) : NaN;
  if (!Number.isFinite(numeric)) return raw;
  if (numeric >= 10_000_000) return `₹${(numeric / 10_000_000).toFixed(2)} Cr`;
  if (numeric >= 100_000) return `₹${(numeric / 100_000).toFixed(2).replace(/\.00$/, '')} Lakh`;
  return `₹${numeric.toLocaleString('en-IN')}`;
}

function formatArea(value: unknown): string {
  const area = text(value);
  if (!area) return '';
  return /^\d[\d,.]*$/.test(area)
    ? `${Number(area.replace(/,/g, '')).toLocaleString('en-IN')} sq ft`
    : area;
}

function getPhotos(project: ConstructionProject): string[] {
  const media = Array.isArray(project.media) ? project.media : [];
  const images = Array.isArray(project.images) ? project.images : [];
  const paths = [
    project.image_url,
    ...media.filter((item: any) => {
      if (typeof item === 'string') return true;
      return !['video', 'youtube'].includes(text(item?.media_type ?? item?.type).toLowerCase());
    }).map((item: any) => typeof item === 'string'
      ? item : item?.image_url ?? item?.url ?? item?.file_url),
    ...images.map((item: any) => typeof item === 'string'
      ? item : item?.image_url ?? item?.url ?? item?.file_url),
  ].map(text).filter(Boolean);
  return [...new Set(paths)];
}

function readFavorites(): string[] {
  try {
    const raw: unknown = JSON.parse(window.localStorage.getItem(CONSTRUCTION_FAVORITES_KEY) || '[]');
    return Array.isArray(raw) ? raw.map(String) : [];
  } catch {
    return [];
  }
}

/** Named export retained for use in other pages if necessary. */
export function ConstructionWorkCard({ x }: { x: ConstructionProject }) {
  const id = text(x.id);
  const href = `/construction-works/${encodeURIComponent(id)}`;
  const photos = getPhotos(x);
  const title = text(x.title) || 'Construction project';
  const image = photos.length ? mediaUrl(photos[0]) : p3;
  const photoCount = photos.length;
  const status = text(x.construction_status);
  const workType = text(x.work_type);
  const area = formatArea(x.area ?? x.built_up_area ?? x.plot_area);
  const location = [...new Set([x.location, x.city, x.pincode].map(text).filter(Boolean))].join(' · ');
  const price = formatPrice(x.price);
  const featured = isTrue(x.featured);
  const verified = isTrue(x.verified);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const refresh = () => setFavorite(Boolean(id) && readFavorites().includes(id));
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener(CONSTRUCTION_FAVORITES_EVENT, refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener(CONSTRUCTION_FAVORITES_EVENT, refresh);
    };
  }, [id]);

  function toggleFavorite() {
    if (!id) return;
    const current = readFavorites();
    const next = current.includes(id)
      ? current.filter((value) => value !== id)
      : [...current, id];
    try {
      window.localStorage.setItem(CONSTRUCTION_FAVORITES_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(CONSTRUCTION_FAVORITES_EVENT));
    } catch {
      setFavorite(next.includes(id));
    }
  }

  return <article className="ucw-card">
    {/* LEFT — content. RIGHT — image. The image is first on mobile using CSS grid-row. */}
    <div className="ucw-card__info">
      <div className="ucw-card__top">
        <div>
          <span className={`ucw-card__price ${price === 'Request quotation' ? 'ucw-card__price--inquiry' : ''}`}>
            {price}
          </span>
          {x.price_per_sqft && <span className="ucw-card__rate">{text(x.price_per_sqft)}</span>}
        </div>
      </div>

      <Link className="ucw-card__title" to={href}>{title}</Link>
      {location && <div className="ucw-card__location">
        <MapPin size={14} aria-hidden="true" />
        <span>{location}</span>
      </div>}

      {(workType || area || status) && <div className="ucw-card__facts">
        {workType && <span className="ucw-card__fact"><HardHat size={15} aria-hidden="true" />{workType}</span>}
        {area && <span className="ucw-card__fact"><Ruler size={15} aria-hidden="true" />{area}</span>}
        {status && <span className="ucw-card__fact"><Clock3 size={15} aria-hidden="true" />{status}</span>}
      </div>}

      {x.description && <p className="ucw-card__description">{text(x.description)}</p>}
      {x.additional_fields && <div className="ucw-card__extras">
        <ListingExtraDetails fields={x.additional_fields} card />
      </div>}

      <div className="ucw-card__bottom">
        <div className="ucw-card__bottom-left">
          {verified && <span className="ucw-card__verified"><ShieldCheck size={15} aria-hidden="true" />Verified project</span>}
        </div>
        <Link className="ucw-card__category" to={href} aria-label={`View details of ${title}`}>
          {workType || 'View details'} <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>

    <div className="ucw-card__visual">
      <Link className="ucw-card__image-link" to={href} aria-label={`View ${title}`}>
        <img
          className="ucw-card__image"
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          onError={(event) => {
            const imageElement = event.currentTarget;
            if (imageElement.dataset.fallbackApplied !== 'true') {
              imageElement.dataset.fallbackApplied = 'true';
              imageElement.src = p3;
            }
          }}
        />
      </Link>
      <span className={`ucw-card__tag ${featured ? '' : 'ucw-card__tag--standard'}`}>
        {featured ? 'FEATURED' : status || 'CONSTRUCTION'}
      </span>
      <button
        className="ucw-card__favorite"
        type="button"
        title={favorite ? 'Remove from saved' : 'Save construction project'}
        aria-label={favorite ? 'Remove construction project from saved' : 'Save construction project'}
        aria-pressed={favorite}
        disabled={!id}
        onClick={toggleFavorite}
      >
        <Heart size={18} strokeWidth={1.9} fill={favorite ? 'currentColor' : 'none'} />
      </button>
      {photoCount > 0 && <span className="ucw-card__photo-count">
        <Camera size={13} aria-hidden="true" />
        {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
      </span>}
    </div>
  </article>;
}

/** Drop-in replacement: original export name and props remain unchanged. */
export default function ConstructionWorksSection({ projects = [] }: { projects?: ConstructionProject[] }) {
  const featured = (Array.isArray(projects) ? projects : [])
    .filter((project) => project && isTrue(project.featured))
    .slice(0, 6);

  return <>
    <style>{SECTION_CSS}</style>
    <style>{CARD_CSS}</style>
    <ShowcaseSection
      id="home-construction"
      eyebrow="FEATURED CONSTRUCTION PROJECTS"
      title="From the blueprint to the finishing touch"
      description="Explore construction and civil projects undertaken by our team."
      tone="soft"
      to="/construction-works"
      actionLabel="View all construction works"
      empty={!featured.length}
      emptyText="Browse our construction portfolio for available projects."
    >
      {featured.map((project, index) => <ConstructionWorkCard
        key={project.id ?? index}
        x={project}
      />)}
    </ShowcaseSection>
  </>;
}
