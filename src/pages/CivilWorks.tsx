import {ListingExtraDetails} from '../components/ListingExtraDetails';
import {useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight,CheckCircle2,HardHat,Images,MapPin,Search,Video} from 'lucide-react';
import {mediaUrl} from '../api';
import {useSite} from '../main';
import './civil-portfolio.css';

export function CivilWorks(){
  const {civil_services:items=[]}=useSite();
  const [category,setCategory]=useState('All services');
  const [query,setQuery]=useState('');
  const categories=useMemo(()=>['All services',...Array.from(new Set(items.map((x:any)=>String(x.category||'Other'))))] as string[],[items]);
  const visible=useMemo(()=>items.filter((x:any)=>(category==='All services'||x.category===category)&&
    `${x.name} ${x.category} ${x.description} ${x.location}`.toLowerCase().includes(query.trim().toLowerCase())),[items,query,category]);
  const featured=items.find((x:any)=>x.featured&&x.image_url)||items.find((x:any)=>x.image_url);
  return <div className="civ-site">
    <section className="civ-hero">
      <div className="civ-hero-copy"><span className="civ-kicker"><HardHat size={16}/> THE WORK SPEAKS FOR ITSELF</span>
        <h1>See the craft.<br/><i>Choose your team.</i></h1>
        <p>Discover our civil services through real project galleries and completed work. Find a finish you love, then request a callback or book a visit to discuss your own project.</p>
        <a className="civ-btn-light" href="#civil-portfolio">Explore our work <ArrowRight size={18}/></a>
        <div className="civ-hero-points"><span><CheckCircle2/> Browse past projects</span><span><CheckCircle2/> Request site visits</span></div>
      </div>
      <div className="civ-hero-visual">{featured?.image_url?<img src={mediaUrl(featured.image_url)} alt={featured.name}/>:<div className="civ-image-empty"><HardHat size={64}/></div>}
        <div className="civ-hero-caption"><span>FEATURED WORK</span><b>{featured?.name||'Craftsmanship in every detail'}</b>{featured?.location&&<small>{featured.location}</small>}</div>
      </div>
    </section>
    <section className="civ-portfolio" id="civil-portfolio">
      <div className="civ-section-heading"><div><span className="civ-eyebrow">OUR SERVICES & PAST WORK</span><h2>Explore what we've created</h2><p>Open any service to see photographs, videos, materials, and actual work samples.</p></div><span className="civ-count">{items.length} service{items.length!==1?'s':''}</span></div>
      <div className="civ-tools"><div className="civ-search"><Search size={18}/><input aria-label="Search civil works" placeholder="Search for painting, interiors, plumbing..." value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="civ-categories">{categories.map(c=><button key={c} className={category===c?'is-selected':''} onClick={()=>setCategory(c)}>{c}</button>)}</div></div>
      <div className="civ-work-grid">{visible.map((x:any,index:number)=>{
        const images=(x.media||[]).filter((m:any)=>m.media_type==='image');
        const videos=(x.media||[]).filter((m:any)=>m.media_type==='video');
        return <article className="civ-work-card" key={x.id}>
          <Link to={`/civil-works/${x.id}`} className="civ-work-image" aria-label={`Explore ${x.name}`}>
            {x.image_url?<img src={mediaUrl(x.image_url)} alt={x.name} loading="lazy"/>:<div className="civ-placeholder"><HardHat size={48}/><span>Project images coming soon</span></div>}
            <span className="civ-card-number">{String(index+1).padStart(2,'0')}</span>
            {images.length+videos.length>0&&<span className="civ-card-media"><Images size={15}/>{images.length} photos {videos.length>0&&<><Video size={15}/>{videos.length}</>}</span>}
          </Link>
          <div className="civ-work-info"><small>{x.category||'Civil service'}{x.location&&<> <MapPin size={12}/> {x.location}</>}</small><h3><Link to={`/civil-works/${x.id}`}>{x.name}</Link></h3><p>{x.short_description||x.description||'Explore our methods, materials and completed projects.'}</p><ListingExtraDetails fields={x.additional_fields} card/><Link className="civ-explore" to={`/civil-works/${x.id}`}>See projects & request visit <ArrowRight size={17}/></Link></div>
        </article>
      })}</div>
      {!visible.length&&<div className="civ-empty">No services match your search. Try another category.</div>}
    </section>
    <section className="civ-bottom"><span>INSPIRED BY OUR WORK?</span><h2>Great projects start with a conversation.</h2><p>Select a service above and use its inquiry form to request a callback or project visit. Your request goes directly to the organization team.</p></section>
  </div>;
}
