import {MediaGalleryGrid} from '../components/MediaGalleryGrid';
import {ListingExtraDetails} from '../components/ListingExtraDetails';
import {useEffect,useMemo,useState,type FormEvent} from 'react';
import {Link,useParams} from 'react-router-dom';
import {Bath,BedDouble,Building2,CalendarDays,Car,ChevronLeft,ChevronRight,Compass,Download,ExternalLink,File,FileText,Images,MapPin,Maximize2,Phone,Play,Share2,Sofa,X} from 'lucide-react';
import {mediaUrl,sendInquiry} from '../api';
import {useSite} from '../main';

const quickFacts=[
  ['area','Super built-up area',Maximize2],['developer_name','Developer',Building2],['project_name','Project',Building2],['floor','Floor',Building2],
  ['transaction_type','Transaction type',CalendarDays],['possession_status','Status',CalendarDays],['facing','Facing',Compass],['furnishing','Furnishing',Sofa]
] as const;
const overview=[
  ['bedrooms','Bedrooms',BedDouble],['bathrooms','Bathrooms',Bath],['balconies','Balconies',Building2],['area','Area',Maximize2],
  ['floor','Floor',Building2],['total_floors','Total floors',Building2],['parking','Parking',Car],['facing','Facing',Compass],
  ['furnishing','Furnishing',Sofa],['availability','Availability',CalendarDays],['year_built','Year built',CalendarDays]
] as const;
const moreDetails=[
  ['price_breakup','Price breakup'],['full_address','Address'],['furnishing','Furnishing'],['ownership_type','Type of ownership'],
  ['overlooking','Overlooking'],['property_age','Age of construction'],['possession_status','Possession status'],['rera_id','RERA ID']
] as const;

export function ConstructionWorkDetail(){
  const {workId}=useParams();
  const propertyId=workId;
  const {organization,construction_works:properties=[]}=useSite();
  const property=properties.find((item:any)=>item.id===propertyId);
  const media=property?.media||[];
  const images=useMemo(()=>{
    const uploaded=media.filter((item:any)=>item.media_type==='image');
    if(uploaded.length)return uploaded;
    return property?.image_url?[{id:'cover',url:property.image_url,title:property.title,is_cover:true}]:[];
  },[property,media]);
  const videos=media.filter((item:any)=>item.media_type==='video');
  const files=media.filter((item:any)=>item.media_type==='document'||item.media_type==='file');
  const [active,setActive]=useState('');
  const [lightbox,setLightbox]=useState(false);
  const [expanded,setExpanded]=useState(false);
  const [lead,setLead]=useState({name:'',phone:'',email:'',requirement_type:'Interested in this construction work',budget:'',preferred_callback:'',visit_preference:'',message:''});
  const [sending,setSending]=useState(false);
  const [leadResult,setLeadResult]=useState('');
  const [leadError,setLeadError]=useState('');
  const submitLead=async(e:FormEvent)=>{
    e.preventDefault();if(sending||!property)return;
    setSending(true);setLeadResult('');setLeadError('');
    try{const result:any=await sendInquiry({...lead,construction_work_id:property.id});setLeadResult(`Inquiry sent! Reference: ${result.inquiry_id}. Our team can call you back.`);setLead({...lead,name:'',phone:'',email:'',message:'',preferred_callback:'',budget:'',visit_preference:''})}
    catch(error:any){setLeadError(error.message||'Unable to submit inquiry')}
    finally{setSending(false)}
  };
  useEffect(()=>{setActive(images.find((item:any)=>item.is_cover)?.url||images[0]?.url||'')},[propertyId,images]);

  if(!property)return <section className="state"><h1>Construction work not found</h1><p>This listing is unavailable or has been removed.</p><Link to="/construction-works">Return to construction works</Link></section>;

  const features=organization.features||{};
  const amenities=String(property.amenities||'').split(/[\n,]/).map((item:string)=>item.trim()).filter(Boolean);
  const activeIndex=Math.max(0,images.findIndex((item:any)=>item.url===active));
  const changeImage=(direction:number)=>{if(!images.length)return;const next=(activeIndex+direction+images.length)%images.length;setActive(images[next].url)};
  const share=async()=>{const data={title:property.title,text:`${property.title} — ${property.price}`,url:location.href};try{if(navigator.share)await navigator.share(data);else await navigator.clipboard.writeText(location.href)}catch{/* visitor cancelled sharing */}};
  const description=String(property.description||'');
  const projectScope=String(property.scope_of_work||'');
  const materials=String(property.materials||'');
  const visibleDescription=!expanded&&description.length>420?`${description.slice(0,420).trim()}…`:description;

  return <>
    <section className="property-detail-head">
      <Link to="/construction-works"><ChevronLeft/> All construction works</Link>
      <div><div><span>{property.construction_status||property.purpose}</span><small>{property.work_type||property.category}</small></div><button onClick={share}><Share2/> Share</button></div>
      <h1>{property.title}</h1>
      <p><MapPin/> {property.full_address||property.location}</p>
    </section>

    <section className="property-price-strip">
      <div><small>Estimated cost</small><strong>{property.price||'Request quotation'}</strong>{property.price_per_sqft&&<span>{property.price_per_sqft}</span>}</div>
      {quickFacts.filter(([key])=>property[key]).slice(0,4).map(([key,label,Icon])=><div key={key}><Icon/><span><small>{label}</small><b>{key==='floor'&&property.total_floors?`${property.floor} of ${property.total_floors}`:property[key]}</b></span></div>)}
    </section>

    <section className="property-detail-layout">
      <div>
        <div className="property-gallery">
          <button className="gallery-main" onClick={()=>active&&setLightbox(true)} aria-label="Open full-size image">
            {active?<img src={mediaUrl(active)} alt={property.title}/>:<Building2/>}
            {images.length>0&&<span><Images/> {images.length} photo{images.length!==1?'s':''}</span>}
          </button>
          {images.length>1&&<><button className="gallery-arrow previous" onClick={()=>changeImage(-1)} aria-label="Previous image"><ChevronLeft/></button><button className="gallery-arrow next" onClick={()=>changeImage(1)} aria-label="Next image"><ChevronRight/></button></>}
          {images.length>1&&<div className="gallery-thumbs">{images.map((image:any,index:number)=><button className={active===image.url?'active':''} key={image.id} onClick={()=>setActive(image.url)}><img src={mediaUrl(image.url)} alt={image.title||`${property.title} ${index+1}`} loading="lazy"/>{image.is_cover&&<span>Cover</span>}</button>)}</div>}
        </div>

        <section className="property-section">
          <h2>Construction overview</h2>
          <div className="property-specs">{overview.map(([key,label,Icon])=>property[key]&&<div key={key}><Icon/><span><small>{label}</small><b>{key==='floor'&&property.total_floors?`${property.floor} of ${property.total_floors}`:property[key]}</b></span></div>)}</div>
        </section>

        <section className="property-section">
          <h2>Building & work details</h2>
          <div className="more-details">{moreDetails.map(([key,label])=>property[key]&&<div key={key}><span>{label}</span><b>{property[key]}</b></div>)}</div>
        </section>

        {features.construction_works&&description&&<section className="property-section"><h2>Description</h2><p className="long-copy">{visibleDescription}</p>{description.length>420&&<button className="read-more" onClick={()=>setExpanded(!expanded)}>{expanded?'Read less':'Read more'}</button>}</section>}
        {(projectScope||materials||property.estimated_duration||property.completion_date||property.construction_status)&&<section className="property-section"><h2>Construction scope & timeline</h2><div className="more-details">
          {property.construction_status&&<div><span>Progress</span><b>{property.construction_status}</b></div>}{property.estimated_duration&&<div><span>Estimated duration</span><b>{property.estimated_duration}</b></div>}{property.completion_date&&<div><span>Completion date</span><b>{property.completion_date}</b></div>}
          </div>{projectScope&&<><h3>Scope of work</h3><p className="long-copy">{projectScope}</p></>}{materials&&<><h3>Materials & specifications</h3><p className="long-copy">{materials}</p></>}</section>}
      <ListingExtraDetails fields={property.additional_fields}/>
      <MediaGalleryGrid items={media} title="Photos & videos"/>
        {amenities.length>0&&<section className="property-section"><h2>Included features & amenities</h2><div className="amenity-list">{amenities.map((item:string)=><span key={item}>✓ {item}</span>)}</div></section>}
        {(property.project_name||property.developer_name||property.project_description)&&<section className="property-section project-about"><small>ABOUT PROJECT</small><h2>{property.project_name||'Project information'}</h2>{property.developer_name&&<b>by {property.developer_name}</b>}{property.project_description&&<p className="long-copy">{property.project_description}</p>}</section>}

        {videos.length>0&&<section className="property-section"><h2>Construction videos</h2><div className="property-videos">{videos.map((video:any)=><article key={video.id}><video controls preload="metadata" poster={mediaUrl(property.image_url)} src={mediaUrl(video.url)}/><div><Play/><span><b>{video.title}</b>{video.description&&<small>{video.description}</small>}</span></div></article>)}</div></section>}
        {files.length>0&&<section className="property-section"><h2>Documents & downloads</h2><div className="property-documents">{files.map((file:any)=><a href={mediaUrl(file.url)} target="_blank" rel="noreferrer" key={file.id}>{file.media_type==='document'?<FileText/>:<File/>}<span><b>{file.title}</b><small>{file.description||file.original_name}</small></span><Download/></a>)}</div></section>}
      </div>

      <aside className="property-enquiry-card">
        <small>{property.purpose==='Rent'?'Estimated cost':'Estimated cost'}</small><strong>{property.price||'Request quotation'}</strong>{property.price_per_sqft&&<span>{property.price_per_sqft}</span>}
        <p><MapPin/> {property.location}</p><div className="listing-reference">Work ID <b>{property.id}</b></div>
        {property.contact_phone||organization.phone?<a className="primary" href={`tel:${property.contact_phone||organization.phone}`}><Phone/> Contact construction advisor</a>:null}
        {features.contact&&<form className="property-lead-form" onSubmit={submitLead}>
          <h3>Interested in this construction work?</h3><p>Share your requirements and request a callback.</p>
          <label>Full name *<input required maxLength={120} value={lead.name} onChange={e=>setLead({...lead,name:e.target.value})} placeholder="Your name"/></label>
          <label>Mobile number *<input required type="tel" minLength={7} maxLength={20} value={lead.phone} onChange={e=>setLead({...lead,phone:e.target.value})} placeholder="Mobile / WhatsApp"/></label>
          <label>Email (optional)<input type="email" value={lead.email} onChange={e=>setLead({...lead,email:e.target.value})} placeholder="you@example.com"/></label>
          <label>What do you need?<select value={lead.requirement_type} onChange={e=>setLead({...lead,requirement_type:e.target.value})}><option>Interested in this construction work</option><option>Request construction quotation</option><option>Schedule a site visit</option><option>Discuss plan & materials</option><option>Request more information</option></select></label>
          <label>Your budget (optional)<input maxLength={120} value={lead.budget} onChange={e=>setLead({...lead,budget:e.target.value})} placeholder="e.g. ₹80–90 lakh"/></label>
          <label>Preferred callback time<input type="datetime-local" value={lead.preferred_callback} onChange={e=>setLead({...lead,preferred_callback:e.target.value})}/></label>
          <label>Visit preference<input maxLength={120} value={lead.visit_preference} onChange={e=>setLead({...lead,visit_preference:e.target.value})} placeholder="e.g. Sunday morning"/></label>
          <label>Additional requirements<textarea maxLength={3000} rows={4} value={lead.message} onChange={e=>setLead({...lead,message:e.target.value})} placeholder="Tell us what matters to you..."/></label>
          <button type="submit" className="primary" disabled={sending}>{sending?'Submitting...':'Send inquiry & request callback'}</button>
          {leadResult&&<p className="lead-success" role="status">{leadResult}</p>}{leadError&&<p className="lead-error" role="alert">{leadError}</p>}
        </form>}
        {property.map_url&&<a className="map-link" href={property.map_url} target="_blank" rel="noreferrer"><ExternalLink/> View location on map</a>}
        <small>Confirm project scope, timelines, applicable approvals and final quotation with the organization.</small>
      </aside>
    </section>

    {lightbox&&<div className="property-lightbox" role="dialog" aria-modal="true" aria-label="Construction image viewer"><button className="lightbox-close" onClick={()=>setLightbox(false)} aria-label="Close"><X/></button>{images.length>1&&<button className="lightbox-prev" onClick={()=>changeImage(-1)} aria-label="Previous"><ChevronLeft/></button>}<img src={mediaUrl(active)} alt={property.title}/>{images.length>1&&<button className="lightbox-next" onClick={()=>changeImage(1)} aria-label="Next"><ChevronRight/></button>}<span>{activeIndex+1} / {images.length}</span></div>}
  </>;
}
