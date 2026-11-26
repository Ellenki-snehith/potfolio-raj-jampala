import {ListingExtraDetails} from '../components/ListingExtraDetails';
import {useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight,Building2,Image as ImageIcon,MapPin,Search,SlidersHorizontal,Sparkles} from 'lucide-react';
import {mediaUrl} from '../api';
import {useSite} from '../main';
import './lift-design.css';

export function LiftDesigns(){
  const {lift_designs:designs=[]}=useSite();
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('All lift types');
  const [style,setStyle]=useState('All drive systems');
  const categories=['All lift types',...Array.from(new Set(designs.map((d:any)=>d.work_type||d.lift_type).filter(Boolean)))] as string[];
  const styles=['All drive systems',...Array.from(new Set(designs.map((d:any)=>d.drive_system).filter(Boolean)))] as string[];
  const results=useMemo(()=>designs.filter((d:any)=>
    (category==='All lift types'||(d.work_type||d.lift_type)===category)&&
    (style==='All drive systems'||d.drive_system===style)&&
    [d.title,d.location,d.description,d.project_name,d.work_type,d.drive_system,d.lift_type].join(' ').toLowerCase().includes(query.trim().toLowerCase())
  ),[designs,query,category,style]);
  const featured=designs.find((x:any)=>x.featured&&x.image_url)||designs.find((x:any)=>x.image_url);
  return <div className="ld-site">
    <section className="ld-hero">
      <div className="ld-hero-copy">
        <span className="ld-eyebrow"><Sparkles size={16}/> DESIGNED TO MOVE. BUILT TO LAST.</span>
        <h1>Lift solutions built for <em>every journey.</em></h1>
        <p>Explore completed passenger lifts, home elevators, hospital lifts and panoramic glass installations. Review our work and request a tailored design or site survey.</p>
        <a className="ld-hero-button" href="#lift-projects">Explore our lifts <ArrowRight size={19}/></a>
        <div className="ld-hero-meta"><span>Home elevators</span><span>Commercial buildings</span><span>Installation & modernization</span></div>
      </div>
      <div className="ld-hero-photo">{featured?.image_url?<img src={mediaUrl(featured.image_url)} alt={featured.title}/>:<div className="ld-placeholder"><Building2 size={68}/><span>Our lift design portfolio</span></div>}
        {featured&&<Link className="ld-featured-caption" to={`/lift-designs/${featured.id}`}><small>FEATURED LIFT PROJECT</small><strong>{featured.title}</strong><span>Explore this project <ArrowRight size={16}/></span></Link>}
      </div>
    </section>
    <section className="ld-portfolio" id="lift-projects">
      <header className="ld-section-header"><div><span className="ld-eyebrow">OUR PORTFOLIO</span><h2>Lifts we've delivered</h2><p>Explore cabin designs, technical specifications, installation photographs and walkthroughs.</p></div><b>{designs.length} projects</b></header>
      <div className="ld-filters"><div className="ld-search"><Search size={19}/><input aria-label="Search lift projects" placeholder="Search passenger, glass, hospital, location..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
        <label><SlidersHorizontal size={17}/><select value={category} onChange={e=>setCategory(e.target.value)} aria-label="Project type">{categories.map(x=><option key={x}>{x}</option>)}</select></label>
        <label><select value={style} onChange={e=>setStyle(e.target.value)} aria-label="Drive system">{styles.map(x=><option key={x}>{x}</option>)}</select></label>
      </div>
      <div className="ld-grid">{results.map((d:any)=>{const photos=(d.media||[]).filter((m:any)=>m.media_type==='image');return <article className="ld-card" key={d.id}>
        <Link className="ld-card-image" to={`/lift-designs/${d.id}`}>{d.image_url?<img src={mediaUrl(d.image_url)} alt={d.title} loading="lazy"/>:<div className="ld-placeholder"><ImageIcon size={42}/></div>}<span>{d.drive_system||d.work_type||'Lift design'}</span>{photos.length>0&&<small><ImageIcon size={14}/> {photos.length} photos</small>}</Link>
        <div className="ld-card-body"><div className="ld-card-overline">{d.lift_type||d.work_type||'Lift project'} {d.location&&<>· <MapPin size={13}/> {d.location}</>}</div><h3><Link to={`/lift-designs/${d.id}`}>{d.title}</Link></h3><p>{d.description||d.project_description||'Explore the concept, craftsmanship and materials used for this lift project.'}</p>
          <ListingExtraDetails fields={d.additional_fields} card/><div className="ld-card-bottom"><span>{d.price||d.estimated_budget||'Quotation on request'}</span><Link to={`/lift-designs/${d.id}`}>View project <ArrowRight size={16}/></Link></div>
        </div>
      </article>})}</div>
      {!results.length&&<div className="ld-empty">No lift projects match your filters. Try a different search.</div>}
    </section>
    <section className="ld-closing"><span>YOUR SPACE COULD BE NEXT</span><h2>Inspired by one of these lifts?</h2><p>Open a lift project and request a callback or consultation. We’ll use that project as the reference for your requirements.</p></section>
  </div>;
}
