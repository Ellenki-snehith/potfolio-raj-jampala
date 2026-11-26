import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Camera,
  HardHat,
  MapPin,
  Maximize,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { ListingExtraDetails } from '../components/ListingExtraDetails';
import { mediaUrl } from '../api';
import { useSite } from '../main';

/**
 * Construction Works – visual companion to the Properties listing page.
 *
 * Replace src/pages/ConstructionWorks.tsx with this file.
 * All styles are embedded and prefixed with "uc-" to avoid affecting other pages.
 * Reads the existing useSite().construction_works data; no API/backend changes.
 * The page gutter, theme, hero, filters and horizontal cards match Properties.tsx.
 */

const CSS = String.raw`
/* Match the Properties page's exact color palette and responsive side gutters. */
.uc-works {
  --uc-navy: #102b43;
  --uc-blue: #0b688b;
  --uc-ink: #142b3a;
  --uc-muted: #677786;
  --uc-border: #e0e6ec;
  --uc-soft: #f6f7f9;
  --uc-page-gutter: max(20px, 3.125%, calc(50% - 835px));
  min-height: 100vh;
  background: #fff;
  color: var(--uc-ink);
  font-family: inherit;
}
.uc-works, .uc-works * { box-sizing: border-box; }
.uc-works a { text-decoration: none; }
.uc-works button, .uc-works input, .uc-works select { font: inherit; }
.uc-works button { cursor: pointer; }

/* Uses the same generous left and right spacing as the reference page. */
.uc-works__container {
  width: 100%;
  margin-inline: auto;
  padding-inline: var(--uc-page-gutter);
}

.uc-works__hero {
  padding: 54px 0 37px;
  background: linear-gradient(115deg, #f4f5f7 0%, #fff 78%);
  border-bottom: 1px solid var(--uc-border);
}
.uc-works__eyebrow {
  display: block;
  color: var(--uc-blue);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .19em;
  text-transform: uppercase;
}
.uc-works__hero h1 {
  margin: 12px 0 10px;
  color: var(--uc-navy);
  font-size: clamp(29px, 3.5vw, 43px);
  line-height: 1.12;
  letter-spacing: -.035em;
  font-weight: 850;
}
.uc-works__hero p {
  max-width: 780px;
  margin: 0;
  color: var(--uc-muted);
  font-size: 15px;
  line-height: 1.6;
}
.uc-works__body { padding: 30px 0 72px; }

/* Search and select controls: same height, borders, gutters and focus treatment. */
.uc-works__toolbar {
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;
}
.uc-works__search {
  display: flex;
  flex: 1 1 300px;
  min-width: 0;
  min-height: 49px;
  align-items: center;
  gap: 11px;
  padding: 0 15px;
  border: 1px solid var(--uc-border);
  border-radius: 12px;
  background: #fff;
  color: var(--uc-blue);
  transition: border-color .2s, box-shadow .2s;
}
.uc-works__search:focus-within,
.uc-works__select-wrap:focus-within {
  border-color: var(--uc-blue);
  box-shadow: 0 0 0 3px rgba(11, 104, 139, .10);
}
.uc-works__search input {
  flex: 1;
  width: 100%;
  min-width: 0;
  height: 47px;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--uc-ink);
  font-size: 14px;
}
.uc-works__search input::placeholder { color: #8994a3; }
.uc-works__clear {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  padding: 4px;
  border: 0;
  background: transparent;
  color: var(--uc-muted);
}
.uc-works__clear:hover { color: var(--uc-navy); }
.uc-works__select-wrap {
  display: flex;
  min-height: 49px;
  align-items: center;
  gap: 9px;
  padding: 0 13px;
  border: 1px solid var(--uc-border);
  border-radius: 12px;
  background: #fff;
  color: var(--uc-blue);
  transition: border-color .2s, box-shadow .2s;
}
.uc-works__select-wrap select {
  max-width: 200px;
  min-width: 0;
  padding: 12px 12px 12px 0;
  border: 0;
  outline: 0;
  background: #fff;
  color: var(--uc-navy);
  font-size: 14px;
  cursor: pointer;
}

.uc-works__heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 19px;
}
.uc-works__heading h2 {
  margin: 6px 0 0;
  color: var(--uc-navy);
  font-size: clamp(23px, 2.5vw, 29px);
  line-height: 1.2;
  letter-spacing: -.035em;
  font-weight: 800;
}
.uc-works__count {
  padding-bottom: 4px;
  color: var(--uc-muted);
  font-size: 13px;
  white-space: nowrap;
}
.uc-works__items { display: grid; gap: 16px; }

/* Horizontal cards: 320px photo column + flexible project information. */
.uc-card {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  min-height: 224px;
  overflow: hidden;
  border: 1px solid var(--uc-border);
  border-radius: 17px;
  background: #fff;
  transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
}
.uc-card:hover {
  border-color: rgba(11, 104, 139, .38);
  box-shadow: 0 12px 32px rgba(16, 43, 67, .09);
  transform: translateY(-2px);
}
.uc-card__visual {
  position: relative;
  min-width: 0;
  min-height: 224px;
  overflow: hidden;
  background: #e7eaee;
}
.uc-card__image-link { display: block; position: absolute; inset: 0; overflow: hidden; }
.uc-card__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .45s ease;
}
.uc-card:hover .uc-card__image { transform: scale(1.045); }
.uc-card__placeholder {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #607c8c;
  background: linear-gradient(140deg, #edf3f5, #dbe7ed);
}
.uc-card__placeholder span { font-size: 12px; font-weight: 700; letter-spacing: .04em; }
.uc-card__tag {
  position: absolute;
  top: 12px;
  left: 12px;
  max-width: calc(100% - 24px);
  overflow: hidden;
  padding: 6px 13px;
  border-radius: 999px;
  background: var(--uc-navy);
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .02em;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-shadow: 0 2px 7px rgba(0, 0, 0, .16);
  pointer-events: none;
}
.uc-card__tag--progress { background: var(--uc-blue); }
.uc-card__photo-count {
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 9px;
  border-radius: 6px;
  background: rgba(16, 43, 67, .82);
  color: #fff;
  font-size: 11px;
  font-weight: 650;
  pointer-events: none;
}

.uc-card__info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 16px 17px 13px;
}
.uc-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.uc-card__price {
  display: block;
  color: var(--uc-blue);
  font-size: 21px;
  font-weight: 850;
  line-height: 1.3;
  letter-spacing: -.025em;
  overflow-wrap: anywhere;
}
.uc-card__rate { display: block; margin-top: 1px; color: #818894; font-size: 12px; }
.uc-card__type {
  color: var(--uc-muted);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: .05em;
  text-align: right;
  text-transform: uppercase;
}
.uc-card__title {
  display: inline-block;
  margin: 7px 0 5px;
  color: var(--uc-navy);
  font-size: 16px;
  font-weight: 800;
  line-height: 1.35;
}
.uc-card__title:hover { color: var(--uc-blue); }
.uc-card__project-name {
  margin: 0 0 6px;
  color: var(--uc-muted);
  font-size: 12.5px;
  line-height: 1.4;
}
.uc-card__location {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  color: var(--uc-muted);
  font-size: 13px;
  line-height: 1.45;
}
.uc-card__location svg { flex: none; margin-top: 1px; color: var(--uc-blue); }
.uc-card__facts {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 19px;
  margin-top: 11px;
}
.uc-card__fact {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #374151;
  font-size: 12.5px;
}
.uc-card__fact svg { flex: none; color: #727e89; }
.uc-card__description {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  margin: 9px 0 0;
  color: var(--uc-muted);
  font-size: 12.5px;
  line-height: 1.45;
}
/* Additional fields remain available on the card, as in the original page. */
.uc-card__extras { min-width: 0; margin-top: 8px; }
.uc-card__extras:empty { display: none; }
.uc-card__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: auto;
  padding-top: 11px;
  border-top: 1px solid #e9eaed;
}
.uc-card__category { color: var(--uc-muted); font-size: 12px; }
.uc-card__view {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-left: auto;
  color: var(--uc-blue);
  font-size: 12.5px;
  font-weight: 800;
  transition: gap .2s, color .2s;
}
.uc-card__view:hover { gap: 11px; color: var(--uc-navy); }
.uc-card__view svg { flex: none; }

.uc-card__empty {
  display: flex;
  min-height: 250px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 35px 16px;
  border: 1px dashed #cbd5dd;
  border-radius: 16px;
  background: var(--uc-soft);
  text-align: center;
}
.uc-card__empty svg { color: var(--uc-blue); }
.uc-card__empty h3 { margin: 4px 0 0; color: var(--uc-navy); font-size: 18px; }
.uc-card__empty p { margin: 0; color: var(--uc-muted); font-size: 14px; }
.uc-card__reset {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 10px 15px;
  border: 0;
  border-radius: 9px;
  background: var(--uc-blue);
  color: #fff;
  font-weight: 750;
}
.uc-card__reset:hover { background: var(--uc-navy); }
.uc-works a:focus-visible,
.uc-works button:focus-visible,
.uc-works select:focus-visible {
  outline: 3px solid var(--uc-blue);
  outline-offset: 3px;
}

@media (max-width: 850px) {
  .uc-card { grid-template-columns: 260px minmax(0, 1fr); }
  .uc-card__visual { min-height: 250px; }
  .uc-card__facts { column-gap: 12px; }
}
@media (max-width: 640px) {
  .uc-works__hero { padding: 36px 0 30px; }
  .uc-works__body { padding: 22px 0 45px; }
  .uc-works__toolbar { gap: 10px; margin-bottom: 24px; }
  .uc-works__search { flex-basis: 100%; }
  .uc-works__select-wrap { flex: 1; min-width: 0; }
  .uc-works__select-wrap select { width: 100%; max-width: none; }
  .uc-works__heading { align-items: center; flex-wrap: wrap; gap: 8px 20px; }
  .uc-works__count { font-size: 12px; white-space: normal; }
  .uc-card { grid-template-columns: 1fr; border-radius: 15px; }
  .uc-card__visual { height: 205px; min-height: 0; }
  .uc-card__info { padding: 15px; }
  .uc-card__title { font-size: 15px; }
  .uc-card__price { font-size: 20px; }
  .uc-card__facts { gap: 8px 13px; }
  .uc-card__bottom { margin-top: 14px; }
}
@media (max-width: 480px) {
  .uc-works { --uc-page-gutter: 16px; }
  .uc-card__top { gap: 8px; }
  .uc-card__type { max-width: 42%; }
}
@media (prefers-reduced-motion: reduce) {
  .uc-card, .uc-card__image, .uc-card__view,
  .uc-works__search, .uc-works__select-wrap { transition: none; }
}
`;

type Work = Record<string, any>;

function asText(value: unknown): string {
  return value === null || value === undefined ? '' : String(value).trim();
}

function displayPrice(value: unknown): string {
  if (value === null || value === undefined || value === '') return 'Request quotation';
  const str = asText(value);
  const numeric = typeof value === 'number'
    ? value
    : /^\d+(\.\d+)?$/.test(str) ? Number(str) : NaN;
  if (!Number.isFinite(numeric)) return str;
  if (numeric >= 10_000_000) return `₹${(numeric / 10_000_000).toFixed(2)} Cr`;
  if (numeric >= 100_000) return `₹${(numeric / 100_000).toFixed(2).replace(/\.00$/, '')} Lakh`;
  return `₹${numeric.toLocaleString('en-IN')}`;
}

function displayArea(raw: unknown): string {
  const area = asText(raw);
  if (!area) return '';
  if (/^\d[\d,.]*$/.test(area)) return `${Number(area.replace(/,/g, '')).toLocaleString('en-IN')} sq ft`;
  return area;
}

function getImage(work: Work): string {
  if (work.image_url) return mediaUrl(work.image_url);
  const media = Array.isArray(work.media) ? work.media : [];
  const firstPhoto = media.find((item: any) => {
    const type = asText(item?.media_type ?? item?.type).toLowerCase();
    return !type || type === 'image' || type === 'photo';
  });
  const imagePath = typeof firstPhoto === 'string'
    ? firstPhoto
    : firstPhoto?.image_url ?? firstPhoto?.url ?? firstPhoto?.file_url;
  if (imagePath) return mediaUrl(imagePath);
  const firstImage = Array.isArray(work.images) ? work.images[0] : undefined;
  const fallbackPath = typeof firstImage === 'string'
    ? firstImage
    : firstImage?.image_url ?? firstImage?.url;
  return fallbackPath ? mediaUrl(fallbackPath) : '';
}

function getMediaCount(work: Work): number {
  if (Array.isArray(work.media) && work.media.length) return work.media.length;
  if (Array.isArray(work.images) && work.images.length) return work.images.length;
  return work.image_url ? 1 : 0;
}

function ConstructionCard({ work }: { work: Work }) {
  const href = `/construction-works/${encodeURIComponent(asText(work.id))}`;
  const image = getImage(work);
  const mediaCount = getMediaCount(work);
  const status = asText(work.construction_status || work.purpose || 'Construction');
  const type = asText(work.work_type || work.category || 'Construction');
  const area = displayArea(work.area);
  const location = asText(work.location || work.full_address);
  const title = asText(work.title) || 'Construction project';
  const projectName = asText(work.project_name);
  const isInProgress = /ongoing|progress|under construction|in[- ]progress|started/i.test(status);

  return <article className="uc-card">
    <div className="uc-card__visual">
      <Link className="uc-card__image-link" to={href} aria-label={`View ${title}`}>
        {image
          ? <img className="uc-card__image" src={image} alt={title} loading="lazy" />
          : <div className="uc-card__placeholder"><Building2 size={52} strokeWidth={1.3} /><span>CONSTRUCTION PROJECT</span></div>}
      </Link>
      <span className={`uc-card__tag ${isInProgress ? 'uc-card__tag--progress' : ''}`}>{status}</span>
      {mediaCount > 0 && <span className="uc-card__photo-count">
        <Camera size={13} aria-hidden="true" />
        {mediaCount} {mediaCount === 1 ? 'media item' : 'media items'}
      </span>}
    </div>

    <div className="uc-card__info">
      <div className="uc-card__top">
        <div>
          <span className="uc-card__price">{displayPrice(work.price)}</span>
          {work.price_per_sqft && <span className="uc-card__rate">{asText(work.price_per_sqft)}</span>}
        </div>
        <span className="uc-card__type">{type}</span>
      </div>

      <Link className="uc-card__title" to={href}>{title}</Link>
      {projectName && projectName.toLowerCase() !== title.toLowerCase() && <p className="uc-card__project-name">{projectName}</p>}
      {location && <div className="uc-card__location">
        <MapPin size={14} aria-hidden="true" />
        <span>{location}</span>
      </div>}
      {area && <div className="uc-card__facts">
        <span className="uc-card__fact"><Maximize size={15} aria-hidden="true" />{area}</span>
      </div>}
      {work.description && <p className="uc-card__description">{asText(work.description)}</p>}
      {work.additional_fields && <div className="uc-card__extras">
        <ListingExtraDetails fields={work.additional_fields} card />
      </div>}

      <div className="uc-card__bottom">
        <span className="uc-card__category"><HardHat size={13} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 5 }} />{type}</span>
        <Link to={href} className="uc-card__view">View construction details <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
    </div>
  </article>;
}

export function ConstructionWorks() {
  const site = useSite();
  const works: Work[] = Array.isArray(site?.construction_works) ? site.construction_works : [];
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('All');
  const [status, setStatus] = useState('All');

  const kinds = useMemo(() => [
    'All', ...new Set(works.map((work) => asText(work.work_type)).filter(Boolean)),
  ], [works]);
  const statuses = useMemo(() => [
    'All', ...new Set(works.map((work) => asText(work.construction_status)).filter(Boolean)),
  ], [works]);

  const visible = useMemo(() => works.filter((work) => {
    const search = query.toLowerCase().trim();
    const matchType = kind === 'All' || asText(work.work_type) === kind;
    const matchStatus = status === 'All' || asText(work.construction_status) === status;
    const text = [
      work.title, work.location, work.full_address, work.project_name,
      work.work_type, work.construction_status, work.description,
    ].map(asText).join(' ').toLowerCase();
    return matchType && matchStatus && (!search || text.includes(search));
  }), [works, query, kind, status]);

  const clearFilters = () => { setQuery(''); setKind('All'); setStatus('All'); };

  return <main className="uc-works">
    <style>{CSS}</style>

    <section className="uc-works__hero">
      <div className="uc-works__container">
        <span className="uc-works__eyebrow">CONSTRUCTION WORKS &amp; HOUSES</span>
        <h1>Explore our construction projects</h1>
        <p>See completed houses, ongoing construction, renovations and civil projects with real photos, specifications and full details.</p>
      </div>
    </section>

    <section className="uc-works__body">
      <div className="uc-works__container">
        <div className="uc-works__toolbar" role="search" aria-label="Filter construction projects">
          <label className="uc-works__search">
            <Search size={18} aria-hidden="true" />
            <input
              aria-label="Search construction works"
              placeholder="Search house, project or location"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && <button className="uc-works__clear" type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={16} /></button>}
          </label>
          <label className="uc-works__select-wrap">
            <SlidersHorizontal size={17} aria-hidden="true" />
            <select aria-label="Construction type" value={kind} onChange={(event) => setKind(event.target.value)}>
              <option value="All">All construction types</option>
              {kinds.filter((item) => item !== 'All').map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="uc-works__select-wrap">
            <Building2 size={17} aria-hidden="true" />
            <select aria-label="Construction status" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="All">All project statuses</option>
              {statuses.filter((item) => item !== 'All').map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <div className="uc-works__heading">
          <div>
            <span className="uc-works__eyebrow">{visible.length} {visible.length === 1 ? 'PROJECT' : 'PROJECTS'}</span>
            <h2>Construction work gallery</h2>
          </div>
          <span className="uc-works__count">Showing {visible.length} of {works.length} projects</span>
        </div>

        <div className="uc-works__items">
          {visible.map((work, index) => <ConstructionCard key={work.id ?? index} work={work} />)}
          {!visible.length && <div className="uc-card__empty">
            <Search size={31} aria-hidden="true" />
            <h3>No matching construction projects</h3>
            <p>Try a different project name, type or construction status.</p>
            <button className="uc-card__reset" type="button" onClick={clearFilters}>Clear filters <ArrowRight size={16} /></button>
          </div>}
        </div>
      </div>
    </section>
  </main>;
}
