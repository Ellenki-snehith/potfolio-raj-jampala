import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Camera,
  Clock3,
  DoorOpen,
  Heart,
  MapPin,
  Maximize,
  Palette,
  ShieldCheck,
} from 'lucide-react';
import { ListingExtraDetails } from './ListingExtraDetails';
import { mediaUrl } from '../api';
import int1 from '../assets/int-1.jpg';
import int2 from '../assets/int-2.jpg';
import int3 from '../assets/int-3.jpg';
import { ShowcaseSection } from './HomeShowcase';

/**
 * Drop-in replacement for the homepage InteriorDesignSection.
 * Uses the same spacious, navy/blue card design and gutters as Properties and
 * Construction, but puts the interior project PHOTO ON THE LEFT on desktop.
 * On mobile, the image remains above the information.
 * All styling is scoped to avoid changing unrelated showcase sections.
 */
type InteriorDesign = Record<string, any>;
const fallbackImages = [int1, int2, int3];
const FAVORITES_KEY = 'urbannest:favorite-interior-designs';
const FAVORITES_EVENT = 'urbannest:interior-favorites-changed';

const CARD_CSS = String.raw`
.uid-card, .uid-card * { box-sizing: border-box; }
.uid-card {
  --uid-navy: #102b43;
  --uid-blue: #0b688b;
  --uid-text: #203246;
  --uid-muted: #647385;
  display: grid;
  grid-template-columns: clamp(360px, 27vw, 460px) minmax(0, 1fr);
  width: 100%;
  min-width: 0;
  min-height: 320px;
  overflow: hidden;
  border: 1px solid #dfe5ec;
  border-radius: 17px;
  background: #fff;
  color: var(--uid-text);
  box-shadow: 0 3px 13px rgba(16,43,67,.035);
  transition: border-color .2s, box-shadow .2s, transform .2s;
}
.uid-card:hover {
  border-color: #94abba;
  box-shadow: 0 12px 32px rgba(16,43,67,.11);
  transform: translateY(-2px);
}
.uid-card a { text-decoration: none; }
.uid-card a:focus-visible,
.uid-card button:focus-visible { outline: 3px solid var(--uid-blue); outline-offset: 3px; }

/* LEFT IMAGE — the same enlarged proportions as ConstructionWorksSection. */
.uid-card__visual {
  position: relative;
  min-width: 0;
  min-height: 320px;
  overflow: hidden;
  background: #e8ecf1;
}
.uid-card__image-link { position: absolute; inset: 0; display: block; overflow: hidden; }
.uid-card__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .45s ease;
}
.uid-card:hover .uid-card__image { transform: scale(1.045); }
.uid-card__tag {
  position: absolute;
  top: 14px;
  left: 14px;
  max-width: calc(100% - 96px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 100px;
  padding: 7px 14px;
  background: var(--uid-blue);
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  pointer-events: none;
  box-shadow: 0 2px 7px rgba(0,0,0,.16);
}
.uid-card__tag--standard { background: var(--uid-navy); }
.uid-card__favorite {
  position: absolute;
  top: 14px;
  right: 14px;
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
.uid-card__favorite:hover { transform: scale(1.08); color: var(--uid-blue); }
.uid-card__favorite[aria-pressed="true"] { color: #bb3750; }
.uid-card__favorite:disabled { opacity: .5; cursor: not-allowed; }
.uid-card__photo-count {
  position: absolute;
  bottom: 14px;
  left: 14px;
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

/* RIGHT CONTENT — pricing, title, location, room/style/area/duration, extras. */
.uid-card__info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 22px 24px 18px;
}
.uid-card__top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.uid-card__price {
  display: block;
  color: var(--uid-navy);
  font-size: 24px;
  line-height: 1.3;
  font-weight: 850;
  letter-spacing: -.025em;
  overflow-wrap: anywhere;
}
.uid-card__price--inquiry { font-size: 21px; }
.uid-card__rate { display: block; margin-top: 2px; color: #718092; font-size: 12px; }
.uid-card__title {
  display: inline-block;
  align-self: flex-start;
  margin: 9px 0 6px;
  color: var(--uid-text);
  font-size: 18px;
  line-height: 1.38;
  font-weight: 800;
  overflow-wrap: anywhere;
}
.uid-card__title:hover { color: var(--uid-blue); }
.uid-card__location {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  color: var(--uid-muted);
  font-size: 13px;
  line-height: 1.45;
}
.uid-card__location svg { flex-shrink: 0; margin-top: 2px; color: var(--uid-blue); }
.uid-card__facts { display: flex; align-items: center; flex-wrap: wrap; gap: 9px 21px; margin-top: 15px; }
.uid-card__fact { display: inline-flex; align-items: center; gap: 7px; color: #374151; font-size: 13px; line-height: 1.5; }
.uid-card__fact svg { flex-shrink: 0; color: #647385; }
.uid-card__description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin: 13px 0 0;
  color: #68798a;
  font-size: 13px;
  line-height: 1.55;
}
.uid-card__extras { margin-top: 12px; color: #68798a; font-size: 12px; }
.uid-card__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 13px;
  border-top: 1px solid #e4e9ef;
  min-height: 37px;
}
.uid-card__bottom-left { display: flex; align-items: center; gap: 7px 14px; flex-wrap: wrap; min-width: 0; }
.uid-card__verified { display: inline-flex; align-items: center; gap: 6px; color: var(--uid-blue); font-size: 12px; font-weight: 600; }
.uid-card__category {
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
.uid-card__category:hover { color: var(--uid-blue); }

@media (max-width: 1000px) {
  .uid-card { grid-template-columns: 340px minmax(0, 1fr); min-height: 300px; }
  .uid-card__visual { min-height: 300px; }
  .uid-card__info { padding: 19px 20px 16px; }
  .uid-card__facts { gap: 9px 14px; }
}
@media (max-width: 740px) {
  .uid-card { grid-template-columns: 275px minmax(0, 1fr); }
  .uid-card__price { font-size: 21px; }
  .uid-card__price--inquiry { font-size: 19px; }
  .uid-card__title { font-size: 16px; }
}
@media (max-width: 640px) {
  .uid-card { grid-template-columns: minmax(0, 1fr); min-height: 0; border-radius: 15px; }
  .uid-card__visual { height: 255px; min-height: 0; }
  .uid-card__info { min-height: 270px; padding: 16px; }
  .uid-card__price { font-size: 21px; }
  .uid-card__title { font-size: 16px; }
  .uid-card__facts { gap: 9px 14px; }
  .uid-card__bottom { margin-top: 17px; }
}
@media (max-width: 390px) {
  .uid-card__visual { height: 220px; }
  .uid-card__info { padding: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .uid-card, .uid-card__image, .uid-card__favorite { transition: none; }
}
`;

// Same side gutters as home-properties and home-construction.
const SECTION_CSS = String.raw`
#home-interiors.unshow {
  --uid-section-gutter: max(20px, 3.125vw, calc((100vw - 1670px) / 2));
  background: #f6f7f9;
  color: #102b43;
}
#home-interiors.unshow .unshow__wrap {
  box-sizing: border-box;
  width: calc(100% - 2 * var(--uid-section-gutter));
  max-width: none;
  margin-inline: auto;
  padding-inline: 0;
}
#home-interiors.unshow .unshow__grid {
  grid-template-columns: minmax(0, 1fr);
  gap: 18px;
}
#home-interiors.unshow :is(.unshow__eyebrow, .unshow__kicker, .unshow__overline) { color: #0b688b; }
#home-interiors.unshow :is(.unshow__title, .unshow__heading) { color: #102b43; }
#home-interiors.unshow :is(.unshow__action, .unshow__more, .unshow__link) { color: #0b688b; }
#home-interiors.unshow :is(.unshow__action, .unshow__more, .unshow__link):hover { color: #102b43; }
#home-interiors.unshow :is(.unshow__action, .unshow__more, .unshow__link):focus-visible {
  outline: 3px solid #0b688b;
  outline-offset: 3px;
}
@media (max-width: 640px) {
  #home-interiors.unshow { --uid-section-gutter: 20px; }
}
@media (max-width: 390px) {
  #home-interiors.unshow { --uid-section-gutter: 16px; }
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
  if (value == null || text(value) === '') return 'Get a quotation';
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

function getPhotos(project: InteriorDesign): string[] {
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
    const raw: unknown = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || '[]');
    return Array.isArray(raw) ? raw.map(String) : [];
  } catch {
    return [];
  }
}

/** Individual horizontal interior card: named export if needed elsewhere. */
export function InteriorDesignCard({ x, fallbackImage = int1 }: { x: InteriorDesign; fallbackImage?: string }) {
  const id = text(x.id);
  const href = `/interior-designs/${encodeURIComponent(id)}`;
  const title = text(x.title) || 'Interior project';
  const photos = getPhotos(x);
  const photoCount = photos.length;
  const image = photoCount > 0 ? mediaUrl(photos[0]) : fallbackImage;
  const roomType = text(x.room_type);
  const workType = text(x.work_type);
  const style = text(x.design_style);
  const area = formatArea(x.area ?? x.built_up_area);
  const duration = text(x.duration);
  const location = [...new Set([x.location, x.city, x.pincode].map(text).filter(Boolean))].join(' · ');
  const price = formatPrice(x.price);
  const featured = isTrue(x.featured);
  const verified = isTrue(x.verified);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const refresh = () => setFavorite(Boolean(id) && readFavorites().includes(id));
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener(FAVORITES_EVENT, refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener(FAVORITES_EVENT, refresh);
    };
  }, [id]);

  function toggleFavorite() {
    if (!id) return;
    const current = readFavorites();
    const next = current.includes(id)
      ? current.filter((value) => value !== id)
      : [...current, id];
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(FAVORITES_EVENT));
    } catch {
      setFavorite(next.includes(id));
    }
  }

  return <article className="uid-card">
    <div className="uid-card__visual">
      <Link className="uid-card__image-link" to={href} aria-label={`View ${title}`}>
        <img
          className="uid-card__image"
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          onError={(event) => {
            const target = event.currentTarget;
            if (target.dataset.fallbackApplied !== 'true') {
              target.dataset.fallbackApplied = 'true';
              target.src = fallbackImage;
            }
          }}
        />
      </Link>
      <span className={`uid-card__tag ${featured ? '' : 'uid-card__tag--standard'}`}>
        {featured ? 'FEATURED' : style || workType || 'INTERIOR DESIGN'}
      </span>
      <button
        className="uid-card__favorite"
        type="button"
        title={favorite ? 'Remove from saved' : 'Save interior design'}
        aria-label={favorite ? 'Remove interior design from saved' : 'Save interior design'}
        aria-pressed={favorite}
        disabled={!id}
        onClick={toggleFavorite}
      >
        <Heart size={18} strokeWidth={1.9} fill={favorite ? 'currentColor' : 'none'} />
      </button>
      {photoCount > 0 && <span className="uid-card__photo-count">
        <Camera size={13} aria-hidden="true" />
        {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
      </span>}
    </div>

    <div className="uid-card__info">
      <div className="uid-card__top">
        <div>
          <span className={`uid-card__price ${price === 'Get a quotation' ? 'uid-card__price--inquiry' : ''}`}>
            {price}
          </span>
          {x.price_per_sqft && <span className="uid-card__rate">{text(x.price_per_sqft)}</span>}
        </div>
      </div>

      <Link className="uid-card__title" to={href}>{title}</Link>
      {location && <div className="uid-card__location">
        <MapPin size={14} aria-hidden="true" />
        <span>{location}</span>
      </div>}

      {(roomType || area || duration || style || workType) && <div className="uid-card__facts">
        {roomType && <span className="uid-card__fact"><DoorOpen size={15} aria-hidden="true" />{roomType}</span>}
        {area && <span className="uid-card__fact"><Maximize size={15} aria-hidden="true" />{area}</span>}
        {duration && <span className="uid-card__fact"><Clock3 size={15} aria-hidden="true" />{duration}</span>}
        {style && <span className="uid-card__fact"><Palette size={15} aria-hidden="true" />{style}</span>}
        {workType && workType.toLowerCase() !== roomType.toLowerCase() &&
          <span className="uid-card__fact"><DoorOpen size={15} aria-hidden="true" />{workType}</span>}
      </div>}

      {x.description && <p className="uid-card__description">{text(x.description)}</p>}
      {x.additional_fields && <div className="uid-card__extras">
        <ListingExtraDetails fields={x.additional_fields} card />
      </div>}

      <div className="uid-card__bottom">
        <div className="uid-card__bottom-left">
          {verified && <span className="uid-card__verified"><ShieldCheck size={15} aria-hidden="true" />Verified project</span>}
        </div>
        <Link className="uid-card__category" to={href} aria-label={`View details of ${title}`}>
          {roomType || workType || 'View details'} <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  </article>;
}

/** Original component name and props remain unchanged. */
export default function InteriorDesignSection({ designs = [] }: { designs?: InteriorDesign[] }) {
  const featured = (Array.isArray(designs) ? designs : [])
    .filter((project) => project && isTrue(project.featured))
    .slice(0, 6);

  return <>
    <style>{SECTION_CSS}</style>
    <style>{CARD_CSS}</style>
    <ShowcaseSection
      id="home-interiors"
      eyebrow="INTERIOR DESIGN"
      title="Spaces designed to feel like home"
      description="Interior concepts, material choices and project execution, tailored to the way you live."
      tone="soft"
      to="/interior-designs"
      actionLabel="Explore all interior projects"
      empty={!featured.length}
      emptyText="Explore our interior design portfolio for inspiration."
    >
      {featured.map((project, index) => <InteriorDesignCard
        key={project.id ?? index}
        x={project}
        fallbackImage={fallbackImages[index % fallbackImages.length]}
      />)}
    </ShowcaseSection>
  </>;
}
