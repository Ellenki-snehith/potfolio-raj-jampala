import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, MapPin } from 'lucide-react';

/** Reusable premium section/card UI, with CSS contained in this TSX file. */
const SHOWCASE_CSS = String.raw`
.unshow, .unshow * { box-sizing: border-box; }
.unshow { --unshow-teal:#0e786f; --unshow-navy:#102b3d; --unshow-ink:#152b39; --unshow-muted:#6b7985; padding:96px 0; color:var(--unshow-ink); background:#fff; }
.unshow--soft { background:#f5f8f8; }
.unshow__wrap { width:min(100% - 48px, 1240px); margin-inline:auto; }
.unshow__head { max-width:850px; margin:0 auto 52px; text-align:center; }
.unshow__eyebrow { display:block; color:var(--unshow-teal); font-size:12px; font-weight:800; letter-spacing:.24em; line-height:1.5; text-transform:uppercase; }
.unshow__title { margin:12px auto 0; max-width:850px; font-size:clamp(31px, 3.6vw, 50px); line-height:1.15; font-weight:800; letter-spacing:-.035em; }
.unshow__description { margin:17px auto 0; max-width:620px; color:var(--unshow-muted); font-size:16px; line-height:1.7; }
.unshow__grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:28px; }
.unshow__card { --unshow-teal:#0e786f; --unshow-navy:#102b3d; --unshow-ink:#152b39; --unshow-muted:#6b7985; display:flex; flex-direction:column; min-width:0; overflow:hidden; border:1px solid #e3ebed; border-radius:17px; background:#fff; box-shadow:0 5px 18px rgba(21,43,57,.05); transition:transform .35s ease, box-shadow .35s ease, border-color .35s ease; }
.unshow__card:hover { transform:translateY(-7px); border-color:#cbdeda; box-shadow:0 20px 40px rgba(21,43,57,.13); }
.unshow__media { position:relative; display:block; height:235px; overflow:hidden; background:#dbe5e7; text-decoration:none; }
.unshow__image { display:block; width:100%; height:100%; object-fit:cover; transition:transform .7s ease; }
.unshow__card:hover .unshow__image { transform:scale(1.08); }
.unshow__placeholder { display:flex; height:100%; align-items:center; justify-content:center; background:linear-gradient(135deg,#dae8e7,#a9c9c3); color:var(--unshow-teal); }
.unshow__placeholder svg { width:64px; height:64px; opacity:.78; }
.unshow__badge { position:absolute; top:16px; left:16px; max-width:calc(100% - 32px); overflow:hidden; padding:7px 11px; border-radius:6px; background:var(--unshow-navy); color:#fff; font-size:11px; font-style:normal; font-weight:800; white-space:nowrap; text-overflow:ellipsis; }
.unshow__media-count { position:absolute; bottom:12px; right:12px; padding:6px 10px; border-radius:6px; background:rgba(16,43,61,.88); color:#fff; font-size:11px; font-weight:700; }
.unshow__body { display:flex; flex:1; flex-direction:column; padding:23px; }
.unshow__kind { display:block; min-height:18px; color:var(--unshow-muted); font-size:12px; line-height:1.5; }
.unshow__name { margin:5px 0 0; font-size:19px; font-weight:800; line-height:1.32; overflow-wrap:anywhere; }
.unshow__price { margin:10px 0 0; color:var(--unshow-teal); font-size:22px; font-weight:800; line-height:1.35; }
.unshow__rate { display:block; margin:5px 0 0; color:#6b7985; font-size:12px; }
.unshow__meta { display:flex; align-items:center; flex-wrap:wrap; gap:10px 17px; margin:17px 0 0; padding-top:14px; border-top:1px solid #e7eeee; color:#617481; font-size:12px; }
.unshow__meta-item { display:inline-flex; align-items:center; gap:6px; min-width:0; }
.unshow__meta-item svg { width:15px; height:15px; color:var(--unshow-teal); flex-shrink:0; }
.unshow__desc { display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; overflow:hidden; margin:14px 0 0; color:var(--unshow-muted); font-size:13px; line-height:1.7; }
.unshow__extras { margin-top:12px; color:var(--unshow-muted); font-size:12px; }
.unshow__link { display:inline-flex; gap:8px; align-items:center; align-self:flex-start; margin-top:auto; padding-top:20px; color:var(--unshow-teal); font-size:13px; font-weight:800; text-decoration:none; }
.unshow__link:hover { text-decoration:underline; }
.unshow__link svg { height:16px; width:16px; transition:transform .2s; }
.unshow__link:hover svg { transform:translateX(4px); }
.unshow__footer { display:flex; justify-content:center; margin-top:38px; }
.unshow__all { display:inline-flex; align-items:center; gap:9px; color:var(--unshow-teal); font-size:14px; font-weight:800; text-decoration:none; }
.unshow__all:hover { text-decoration:underline; }
.unshow__all svg { width:17px; height:17px; }
.unshow__empty { padding:28px; border:1px dashed #c8d8d7; border-radius:12px; text-align:center; color:#60727e; background:rgba(255,255,255,.75); font-size:14px; }
@media(max-width:950px){.unshow__grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}}
@media(max-width:650px){.unshow{padding:66px 0}.unshow__wrap{width:min(100% - 32px,1240px)}.unshow__head{margin-bottom:32px}.unshow__grid{grid-template-columns:1fr;gap:20px}.unshow__media{height:230px}.unshow__body{padding:20px}.unshow__name{font-size:18px}.unshow__title{font-size:32px}}
@media(prefers-reduced-motion:reduce){.unshow__card,.unshow__image,.unshow__link svg{transition:none}}
`;

export type CardMeta = { label: string | number; icon?: ReactNode };
export type ShowcaseCardProps = {
  to: string;
  title: string;
  category?: string;
  image?: string | null;
  badge?: string | null;
  price?: string | number | null;
  priceDetail?: string | null;
  description?: string | null;
  meta?: CardMeta[];
  mediaCount?: number;
  action?: string;
  children?: ReactNode;
};

export function ShowcaseCard({ to, title, category, image, badge, price, priceDetail, description, meta = [], mediaCount, action = 'View details', children }: ShowcaseCardProps) {
  return <article className="unshow__card">
    <style>{SHOWCASE_CSS}</style>
    <Link className="unshow__media" to={to} aria-label={`View ${title}`}>
      {image ? <img className="unshow__image" src={image} alt={title} loading="lazy" decoding="async" /> :
        <span className="unshow__placeholder"><Building2 aria-hidden="true" /></span>}
      {badge && <span className="unshow__badge">{badge}</span>}
      {Boolean(mediaCount) && <span className="unshow__media-count">{mediaCount} media</span>}
    </Link>
    <div className="unshow__body">
      {category && <span className="unshow__kind">{category}</span>}
      <h3 className="unshow__name">{title}</h3>
      <p className="unshow__price">{price || 'Request quotation'}</p>
      {priceDetail && <span className="unshow__rate">{priceDetail}</span>}
      {meta.filter((m) => m.label !== '' && m.label != null).length > 0 &&
        <div className="unshow__meta">
          {meta.filter((m) => m.label !== '' && m.label != null).map((m, index) =>
            <span key={`${String(m.label)}-${index}`} className="unshow__meta-item">{m.icon}{m.label}</span>)}
        </div>}
      {description && <p className="unshow__desc">{description}</p>}
      {children && <div className="unshow__extras">{children}</div>}
      <Link className="unshow__link" to={to}>{action}<ArrowRight aria-hidden="true" /></Link>
    </div>
  </article>;
}

type ShowcaseSectionProps = {
  eyebrow: string;
  title: string;
  description?: string;
  to?: string;
  actionLabel?: string;
  tone?: 'white' | 'soft';
  children: ReactNode;
  empty?: boolean;
  emptyText?: string;
  id?: string;
};

export function ShowcaseSection({ eyebrow, title, description, to, actionLabel, tone = 'white', children, empty, emptyText, id }: ShowcaseSectionProps) {
  return <section id={id} className={`unshow ${tone === 'soft' ? 'unshow--soft' : ''}`}>
    <style>{SHOWCASE_CSS}</style>
    <div className="unshow__wrap">
      <div className="unshow__head"><span className="unshow__eyebrow">{eyebrow}</span><h2 className="unshow__title">{title}</h2>{description && <p className="unshow__description">{description}</p>}</div>
      {empty ? <p className="unshow__empty">{emptyText || 'Explore our available work and services.'}</p> : <div className="unshow__grid">{children}</div>}
      {to && <div className="unshow__footer"><Link className="unshow__all" to={to}>{actionLabel || 'Explore all'}<ArrowRight aria-hidden="true" /></Link></div>}
    </div>
  </section>;
}

/** Kept for consumers of Home.tsx -> Title. */
export function Title({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="section-title"><span>{eyebrow}</span><h2>{title}</h2></div>;
}

/** Helps avoid blank placeholders if incoming API location is missing. */
export function locationMeta(location?: string | null): CardMeta[] {
  return location ? [{ icon: <MapPin aria-hidden="true" />, label: location }] : [];
}
