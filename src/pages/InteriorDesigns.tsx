import {ListingExtraDetails} from '../components/ListingExtraDetails';
import {useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight,Building2,Image as ImageIcon,MapPin,Search,SlidersHorizontal,Sparkles} from 'lucide-react';
import {mediaUrl} from '../api';
import {useSite} from '../main';
import './interior-design.css';

export function InteriorDesigns(){
  const {interior_designs:designs=[]}=useSite();
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('All spaces');
  const [style,setStyle]=useState('All styles');
  const categories=['All spaces',...Array.from(new Set(designs.map((d:any)=>d.work_type||d.room_type).filter(Boolean)))] as string[];
  const styles=['All styles',...Array.from(new Set(designs.map((d:any)=>d.design_style).filter(Boolean)))] as string[];
  const results=useMemo(()=>designs.filter((d:any)=>
    (category==='All spaces'||(d.work_type||d.room_type)===category)&&
    (style==='All styles'||d.design_style===style)&&
    [d.title,d.location,d.description,d.project_name,d.work_type,d.design_style,d.room_type].join(' ').toLowerCase().includes(query.trim().toLowerCase())
  ),[designs,query,category,style]);
  const featured=designs.find((x:any)=>x.featured&&x.image_url)||designs.find((x:any)=>x.image_url);
  return <div className="id-site">
    <section className="id-hero">
      <div className="id-hero-copy">
        <span className="id-eyebrow"><Sparkles size={16}/> REAL SPACES. BEAUTIFUL IDEAS.</span>
        <h1>Interiors designed for <em>living beautifully.</em></h1>
        <p>Browse finished and ongoing interior projects, explore room-by-room details, materials and finishes, and request a similar design for your own space.</p>
        <a className="id-hero-button" href="#interior-projects">Explore our interiors <ArrowRight size={19}/></a>
        <div className="id-hero-meta"><span>Residential interiors</span><span>Commercial spaces</span><span>Custom execution</span></div>
      </div>
      <div className="id-hero-photo">{featured?.image_url?<img src={mediaUrl(featured.image_url)} alt={featured.title}/>:<div className="id-placeholder"><Building2 size={68}/><span>Our interior design portfolio</span></div>}
        {featured&&<Link className="id-featured-caption" to={`/interior-designs/${featured.id}`}><small>FEATURED INTERIOR</small><strong>{featured.title}</strong><span>Explore this project <ArrowRight size={16}/></span></Link>}
      </div>
    </section>
    <section className="id-portfolio" id="interior-projects">
      <header className="id-section-header"><div><span className="id-eyebrow">OUR PORTFOLIO</span><h2>Spaces we've shaped</h2><p>Choose a project to see its gallery, finishes, design concept and full details.</p></div><b>{designs.length} projects</b></header>
      <div className="id-filters"><div className="id-search"><Search size={19}/><input aria-label="Search interior projects" placeholder="Search kitchen, bedroom, location, style..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
        <label><SlidersHorizontal size={17}/><select value={category} onChange={e=>setCategory(e.target.value)} aria-label="Project type">{categories.map(x=><option key={x}>{x}</option>)}</select></label>
        <label><select value={style} onChange={e=>setStyle(e.target.value)} aria-label="Design style">{styles.map(x=><option key={x}>{x}</option>)}</select></label>
      </div>
      <div className="id-grid">{results.map((d:any)=>{const photos=(d.media||[]).filter((m:any)=>m.media_type==='image');return <article className="id-card" key={d.id}>
        <Link className="id-card-image" to={`/interior-designs/${d.id}`}>{d.image_url?<img src={mediaUrl(d.image_url)} alt={d.title} loading="lazy"/>:<div className="id-placeholder"><ImageIcon size={42}/></div>}<span>{d.design_style||d.work_type||'Interior design'}</span>{photos.length>0&&<small><ImageIcon size={14}/> {photos.length} photos</small>}</Link>
        <div className="id-card-body"><div className="id-card-overline">{d.room_type||d.work_type||'Interior project'} {d.location&&<>· <MapPin size={13}/> {d.location}</>}</div><h3><Link to={`/interior-designs/${d.id}`}>{d.title}</Link></h3><p>{d.description||d.project_description||'Explore the concept, craftsmanship and materials used for this interior project.'}</p>
          <ListingExtraDetails fields={d.additional_fields} card/><div className="id-card-bottom"><span>{d.price||d.estimated_budget||'Quotation on request'}</span><Link to={`/interior-designs/${d.id}`}>View project <ArrowRight size={16}/></Link></div>
        </div>
      </article>})}</div>
      {!results.length&&<div className="id-empty">No interior projects match your filters. Try a different search.</div>}
    </section>
    <section className="id-closing"><span>YOUR SPACE COULD BE NEXT</span><h2>See a style you love?</h2><p>Open an interior project and request a callback or consultation. We’ll use that project as the reference for your requirements.</p></section>
  </div>;
}
