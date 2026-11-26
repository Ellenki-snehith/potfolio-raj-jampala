import { Link } from 'react-router-dom';
import { ArrowRight, Paintbrush, Hammer, Wrench, Zap, HardHat } from 'lucide-react';
import type { ComponentType } from 'react';
import painterImage from '../assets/s-painter.jpg';
import carpenterImage from '../assets/s-carpenter.jpg';
import plumberImage from '../assets/s-plumber.jpg';
import electricianImage from '../assets/s-electrician.jpg';
import constructionImage from '../assets/p3.jpg';
import { mediaUrl } from '../api';

const CSS = String.raw`
.uncivil,.uncivil *{box-sizing:border-box}
.uncivil{padding:94px 0 100px;background:#102b3d;color:#fff}
.uncivil__wrap{width:min(100% - 48px,1240px);margin-inline:auto}
.uncivil__head{display:flex;align-items:end;justify-content:space-between;gap:32px;margin-bottom:43px}
.uncivil__intro{max-width:660px}
.uncivil__eyebrow{color:#84e6d6;font-size:12px;font-weight:800;letter-spacing:.24em}
.uncivil__title{margin:14px 0 0;color:#fff;font-size:clamp(31px,3.6vw,48px);font-weight:800;line-height:1.15;letter-spacing:-.032em}
.uncivil__desc{max-width:355px;margin:0;color:#ffffffba;font-size:15px;line-height:1.8}
.uncivil__grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px}
.uncivil__card{position:relative;display:flex;align-items:flex-end;min-height:425px;overflow:hidden;border-radius:17px;background:#254457;text-decoration:none;color:#fff;isolation:isolate}
.uncivil__image{position:absolute;z-index:-2;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .7s ease}
.uncivil__card:hover .uncivil__image{transform:scale(1.08)}
.uncivil__scrim{position:absolute;z-index:-1;inset:0;background:linear-gradient(0deg,#0c2538 0%,#0c2538cb 40%,#0c253834 100%)}
.uncivil__body{width:100%;padding:23px;transition:transform .3s}
.uncivil__card:hover .uncivil__body{transform:translateY(-4px)}
.uncivil__icon{display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:12px;background:#0e786f;color:white}
.uncivil__icon svg{height:24px;width:24px}
.uncivil__name{margin:18px 0 0;font-size:23px;line-height:1.2;font-weight:800;overflow-wrap:anywhere}
.uncivil__text{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden;margin:8px 0 0;color:#fffde9;font-size:13px;line-height:1.6;opacity:.87}
.uncivil__more{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:19px;padding-top:14px;border-top:1px solid #ffffff50;color:#84e6d6;font-size:13px;font-weight:800}
.uncivil__more svg{width:16px;height:16px}
.uncivil__footer{margin-top:33px;text-align:center}
.uncivil__all{display:inline-flex;gap:8px;align-items:center;color:#84e6d6;text-decoration:none;font-size:14px;font-weight:800}
.uncivil__all svg{width:16px;height:16px}
.uncivil__empty{padding:28px;border:1px solid #ffffff4d;border-radius:12px;color:#fff9;text-align:center}
@media(max-width:1100px){.uncivil__grid{grid-template-columns:repeat(2,minmax(0,1fr))}.uncivil__card{min-height:390px}}
@media(max-width:700px){.uncivil{padding:70px 0}.uncivil__wrap{width:min(100% - 32px,1240px)}.uncivil__head{display:block}.uncivil__desc{margin-top:18px;max-width:580px}.uncivil__grid{gap:14px}.uncivil__card{min-height:350px}}
@media(max-width:500px){.uncivil__grid{grid-template-columns:1fr}.uncivil__card{min-height:350px}.uncivil__body{padding:25px}}
@media(prefers-reduced-motion:reduce){.uncivil__image,.uncivil__body{transition:none}}
`;

type Trade = { icon: ComponentType<any>; image: string };
function tradeVisual(name?: string): Trade {
  const n = String(name || '').toLowerCase();
  if (/paint|waterproof|texture/.test(n)) return { icon: Paintbrush, image: painterImage };
  if (/carpen|wood|wardrobe|furnitur/.test(n)) return { icon: Hammer, image: carpenterImage };
  if (/plumb|bath|pipe|leak|sanit/.test(n)) return { icon: Wrench, image: plumberImage };
  if (/electr|wiring|light|switch|power/.test(n)) return { icon: Zap, image: electricianImage };
  return { icon: HardHat, image: constructionImage };
}

export default function CivilServicesSection({ services = [] }: { services?: any[] }) {
  const items = (Array.isArray(services) ? services : []).slice(0, 8);
  return <section className="uncivil" id="home-civil-services"><style>{CSS}</style>
    <div className="uncivil__wrap">
      <div className="uncivil__head">
        <div className="uncivil__intro"><span className="uncivil__eyebrow">CIVIL & HOME SERVICES</span><h2 className="uncivil__title">Skilled hands for every corner of your home</h2></div>
        <p className="uncivil__desc">Discover painting, carpentry, plumbing, electrical work and other services offered by our team.</p>
      </div>
      {items.length ? <div className="uncivil__grid">{items.map((x) => {
        const visual = tradeVisual(x.name);
        return <Link className="uncivil__card" to={`/civil-works/${x.id}`} key={x.id}>
          <img className="uncivil__image" src={x.image_url ? mediaUrl(x.image_url) : visual.image} alt={x.name || 'Civil service'} loading="lazy" />
          <span className="uncivil__scrim" aria-hidden="true" />
          <div className="uncivil__body"><span className="uncivil__icon"><visual.icon aria-hidden="true" /></span>
            <h3 className="uncivil__name">{x.name || 'Civil service'}</h3>
            {(x.short_description || x.description) && <p className="uncivil__text">{x.short_description || x.description}</p>}
            <span className="uncivil__more"><span>{x.price || x.starting_price || 'View service'}</span><ArrowRight aria-hidden="true" /></span>
          </div>
        </Link>;
      })}</div> : <p className="uncivil__empty">View our civil services for maintenance and repair options.</p>}
      <div className="uncivil__footer"><Link className="uncivil__all" to="/civil-works">Explore all services <ArrowRight aria-hidden="true" /></Link></div>
    </div>
  </section>;
}
