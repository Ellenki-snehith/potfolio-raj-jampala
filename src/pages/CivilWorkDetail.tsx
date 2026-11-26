import {MediaGalleryGrid} from '../components/MediaGalleryGrid';
import {ListingExtraDetails} from '../components/ListingExtraDetails';
import {useEffect,useMemo,useState,type FormEvent} from 'react';
import {Link,useParams} from 'react-router-dom';
import {ArrowLeft,ArrowRight,CheckCircle2,ChevronLeft,ChevronRight,Download,FileText,HardHat,Images,MapPin,Share2,X} from 'lucide-react';
import {mediaUrl,sendInquiry} from '../api';
import {useSite} from '../main';
import './civil-portfolio.css';

const init=()=>({name:'',phone:'',email:'',requirement_type:'Book a site visit',budget:'',preferred_callback:'',visit_preference:'',message:''});
function lines(value:any){return String(value||'').split(/[\n,]/).map(x=>x.trim()).filter(Boolean)}
export function CivilWorkDetail(){
  const {serviceId}=useParams();
  const {civil_services:services=[]}=useSite();
  const item=services.find((x:any)=>x.id===serviceId);
  const media=useMemo(()=>item?.media||[],[item]);
  const photos=useMemo(()=>{
    const rows=media.filter((x:any)=>x.media_type==='image');
    return rows.length?rows:(item?.image_url?[{id:'fallback',url:item.image_url,title:item.name}]:[]);
  },[media,item]);
  const videos=media.filter((x:any)=>x.media_type==='video');
  const docs=media.filter((x:any)=>x.media_type==='document'||x.media_type==='file');
  const [active,setActive]=useState(0);
  const [viewing,setViewing]=useState(false);
  const [popup,setPopup]=useState(false);
  const [lead,setLead]=useState(init);
  const [busy,setBusy]=useState(false);
  const [result,setResult]=useState('');
  const [error,setError]=useState('');
  useEffect(()=>{setActive(0);setPopup(false);setViewing(false);setResult('');setError('')},[serviceId]);
  useEffect(()=>{if(!popup&&!viewing)return;const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape'){setPopup(false);setViewing(false)}if(viewing&&e.key==='ArrowRight')setActive(i=>(i+1)%Math.max(photos.length,1));if(viewing&&e.key==='ArrowLeft')setActive(i=>(i-1+photos.length)%Math.max(photos.length,1))};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[popup,viewing,photos.length]);
  if(!item)return <section className="state"><h1>Service unavailable</h1><p>This civil service is not published.</p><Link to="/civil-works">View all services</Link></section>;
  const activePhoto=photos[active]||photos[0];
  const share=async()=>{try{if(navigator.share)await navigator.share({title:item.name,url:location.href});else await navigator.clipboard.writeText(location.href)}catch{}};
  const submit=async(e:FormEvent)=>{e.preventDefault();if(busy)return;setBusy(true);setError('');setResult('');try{const r:any=await sendInquiry({...lead,civil_service_id:item.id});setResult(`Request sent successfully. Reference: ${r.inquiry_id}.`);setLead(init())}catch(e:any){setError(e.message||'Unable to send request')}finally{setBusy(false)}};
  return <div className="civ-site civ-detail">
    <div className="civ-detail-top"><Link to="/civil-works"><ArrowLeft size={18}/> All civil services</Link><button onClick={share}><Share2 size={18}/> Share project</button></div>
    <section className="civ-detail-head"><div><span className="civ-eyebrow">CRAFTSMANSHIP · {item.category||'CIVIL WORK'}</span><h1>{item.name}</h1><p>{item.short_description||item.description||'Discover our quality of work through real project images and case studies.'}</p><div className="civ-chips">{item.location&&<span><MapPin size={15}/>{item.location}</span>}{item.completed_projects&&<span>{item.completed_projects} completed projects</span>}{item.years_experience&&<span>{item.years_experience} years experience</span>}</div></div>
      <div className="civ-head-actions"><button className="civ-btn-dark" onClick={()=>{setPopup(true);setResult('');setError('')}}>Book a site visit <ArrowRight size={18}/></button><small>No direct contact details required</small></div></section>
    <div className="civ-showcase">
      <button className="civ-main-photo" onClick={()=>photos.length&&setViewing(true)} aria-label="Open completed project gallery">
        {activePhoto?<img src={mediaUrl(activePhoto.url)} alt={activePhoto.title||item.name}/>:<div className="civ-placeholder"><HardHat size={70}/> Gallery coming soon</div>}
        <span className="civ-photo-label"><Images size={16}/> Actual work gallery · {photos.length} photo{photos.length!==1?'s':''}</span>
      </button>
      {photos.length>1&&<div className="civ-photo-thumbs">{photos.map((x:any,i:number)=><button key={x.id||i} onClick={()=>setActive(i)} className={i===active?'selected':''} aria-label={`Select project photo ${i+1}`}><img src={mediaUrl(x.url)} alt={x.title||`Project photo ${i+1}`}/></button>)}</div>}
    </div>
    <div className="civ-content-layout"><main className="civ-story"><section className="civ-story-section"><span className="civ-eyebrow">THE SERVICE</span><h2>Crafted with care. Built to last.</h2><p className="civ-long-text">{item.description||'Our focus is quality finishing and dependable workmanship. Explore the gallery for examples of completed work.'}</p></section>
      <ListingExtraDetails fields={item.additional_fields}/>
      <MediaGalleryGrid items={media} title="Photos & videos"/>
      {!!item.scope_of_work&&<section className="civ-story-section"><span className="civ-eyebrow">WHAT WE DO</span><h2>Scope of work</h2><div className="civ-feature-list">{lines(item.scope_of_work).map(x=><div key={x}><CheckCircle2 size={19}/>{x}</div>)}</div></section>}
      {!!item.materials&&<section className="civ-story-section"><span className="civ-eyebrow">QUALITY & FINISHES</span><h2>Materials & workmanship</h2><p className="civ-long-text">{item.materials}</p></section>}
      {!!item.process&&<section className="civ-story-section"><span className="civ-eyebrow">HOW WE WORK</span><h2>Our approach</h2><p className="civ-long-text">{item.process}</p></section>}
      {!!item.highlights&&<section className="civ-story-section"><span className="civ-eyebrow">HIGHLIGHTS</span><h2>Why customers choose this work</h2><div className="civ-feature-list">{lines(item.highlights).map(x=><div key={x}><CheckCircle2 size={19}/>{x}</div>)}</div></section>}
      {videos.length>0&&<section className="civ-story-section"><span className="civ-eyebrow">WATCH THE PROCESS</span><h2>Completed work videos</h2><div className="civ-videos">{videos.map((video:any)=><article key={video.id}><video controls preload="metadata" src={mediaUrl(video.url)}/><b>{video.title}</b>{video.description&&<p>{video.description}</p>}</article>)}</div></section>}
      {docs.length>0&&<section className="civ-story-section"><span className="civ-eyebrow">PROJECT DOCUMENTS</span><h2>Plans & downloads</h2><div className="civ-docs">{docs.map((doc:any)=><a key={doc.id} href={mediaUrl(doc.url)} target="_blank" rel="noreferrer"><FileText size={20}/><span>{doc.title||doc.original_name}</span><Download size={18}/></a>)}</div></section>}
    </main><aside className="civ-inspire"><span className="civ-eyebrow">LIKE WHAT YOU SEE?</span><h2>Let's create something similar for you.</h2><p>Tell us about your location, requirements and budget. We can arrange a callback or a visit to discuss your project.</p>{item.price_label&&<strong>{item.price_label}</strong>}<button className="civ-btn-dark" onClick={()=>{setPopup(true);setResult('');setError('')}}>Request a callback <ArrowRight/></button><small>All requests go to the organization admin.</small></aside></div>
    <section className="civ-next-project"><span>READY TO PLAN YOUR PROJECT?</span><h2>Inspired by this work?</h2><p>Send an inquiry and schedule a time to visit or discuss a similar project.</p><button className="civ-btn-light" onClick={()=>{setPopup(true);setResult('');setError('')}}>Arrange a visit <ArrowRight/></button></section>
    {viewing&&activePhoto&&<div className="civ-overlay civ-viewer" role="dialog" aria-modal="true" aria-label="Completed work photos" onClick={()=>setViewing(false)}><button className="civ-close" onClick={()=>setViewing(false)} aria-label="Close images"><X/></button>{photos.length>1&&<button className="civ-prev" onClick={e=>{e.stopPropagation();setActive(i=>(i-1+photos.length)%photos.length)}} aria-label="Previous image"><ChevronLeft/></button>}<img onClick={e=>e.stopPropagation()} src={mediaUrl(activePhoto.url)} alt={item.name}/>{photos.length>1&&<button className="civ-next" onClick={e=>{e.stopPropagation();setActive(i=>(i+1)%photos.length)}} aria-label="Next image"><ChevronRight/></button>}<span>{active+1} / {photos.length}</span></div>}
    {popup&&<div className="civ-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setPopup(false)}} role="presentation"><div className="civ-modal" role="dialog" aria-modal="true" aria-label={`Request for ${item.name}`}><button type="button" className="civ-close" onClick={()=>setPopup(false)} aria-label="Close inquiry form"><X size={23}/></button><span className="civ-eyebrow">LET'S DISCUSS YOUR PROJECT</span><h2>Request a callback or visit</h2><p>Regarding <b>{item.name}</b> · {item.category}</p>{result?<div className="civ-success" role="status"><CheckCircle2 size={28}/>{result}<button type="button" onClick={()=>setPopup(false)}>Done</button></div>:<form onSubmit={submit}><div className="civ-form-grid"><label>Full name *<input autoFocus required maxLength={120} value={lead.name} onChange={e=>setLead({...lead,name:e.target.value})} placeholder="Your name"/></label><label>Mobile / WhatsApp *<input type="tel" required minLength={7} maxLength={25} value={lead.phone} onChange={e=>setLead({...lead,phone:e.target.value})} placeholder="10-digit mobile"/></label><label>Email (optional)<input type="email" maxLength={200} value={lead.email} onChange={e=>setLead({...lead,email:e.target.value})} placeholder="name@example.com"/></label><label>What do you need?<select value={lead.requirement_type} onChange={e=>setLead({...lead,requirement_type:e.target.value})}><option>Book a site visit</option><option>Request a callback</option><option>Want a similar work done</option><option>Request quotation</option><option>Ask about materials and process</option></select></label><label>Approximate budget<input maxLength={120} value={lead.budget} onChange={e=>setLead({...lead,budget:e.target.value})} placeholder="Optional"/></label><label>Preferred callback<input type="datetime-local" value={lead.preferred_callback} onChange={e=>setLead({...lead,preferred_callback:e.target.value})}/></label><label className="full">Visit preference<input maxLength={120} value={lead.visit_preference} onChange={e=>setLead({...lead,visit_preference:e.target.value})} placeholder="e.g. Saturday, afternoon"/></label><label className="full">Tell us about your work<textarea rows={4} maxLength={3000} value={lead.message} onChange={e=>setLead({...lead,message:e.target.value})} placeholder="Location, scope, reference project, approximate area..."/></label></div>{error&&<p role="alert" className="civ-error">{error}</p>}<button className="civ-btn-dark" disabled={busy} type="submit">{busy?'Sending request...':'Submit inquiry'} <ArrowRight size={18}/></button><small>Your details are shared with the organization for this inquiry only.</small></form>}</div></div>}
  </div>;
}
