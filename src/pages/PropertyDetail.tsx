import {MediaGalleryGrid} from '../components/MediaGalleryGrid';
import {ListingExtraDetails} from '../components/ListingExtraDetails';
import {useEffect,useMemo,useRef,useState,type FormEvent} from 'react';
import {createPortal} from 'react-dom';
import {Link,useParams} from 'react-router-dom';
import {Bath,BedDouble,Building2,CalendarDays,Car,ChevronLeft,ChevronRight,Compass,Download,ExternalLink,File,FileText,Images,MapPin,Maximize2,MessageSquareText,Pause,Phone,Play,Share2,Sofa,X} from 'lucide-react';
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


// Dialog styling lives here so this update only replaces PropertyDetail.tsx.
const INQUIRY_DIALOG_CSS = `
.property-inquiry-open { width:100%; justify-content:center; cursor:pointer; min-height:48px; }
.property-inquiry-open svg { width:18px; height:18px; }
.property-inquiry-hint { margin:0 !important; font-size:13px; line-height:1.6; color:#536e7b; }
.property-inquiry-backdrop { position:fixed; inset:0; z-index:2000; display:flex; align-items:center; justify-content:center; padding:20px; background:rgba(8,24,38,.72); backdrop-filter:blur(5px); }
.property-inquiry-dialog { width:min(100%,680px); max-height:min(92dvh,850px); background:#fff; border-radius:18px; box-shadow:0 24px 80px rgba(0,0,0,.27); overflow:hidden; display:flex; flex-direction:column; color:#143345; }
.property-inquiry-dialog-header { flex:none; padding:22px 26px 19px; display:flex; justify-content:space-between; align-items:flex-start; gap:16px; border-bottom:1px solid #e3ecef; }
.property-inquiry-dialog-header small { color:#087789; font-weight:800; font-size:11px; text-transform:uppercase; letter-spacing:1px; }
.property-inquiry-dialog-header h2 { font:800 clamp(20px,3vw,26px)/1.2 'Manrope',sans-serif; margin:5px 0 7px; }
.property-inquiry-dialog-header p { margin:0; font-size:13px; line-height:1.5; color:#617888; }
.property-inquiry-close { flex:none; width:38px; height:38px; display:grid; place-items:center; background:#edf3f6; color:#244658; border:0; border-radius:50%; cursor:pointer; }
.property-inquiry-close svg { width:20px; height:20px; }
.property-inquiry-dialog-body { min-height:0; overflow-y:auto; overscroll-behavior:contain; padding:22px 26px 26px; }
.property-inquiry-property { display:flex; align-items:center; flex-wrap:wrap; gap:7px 14px; background:#f1f8fa; border:1px solid #ddecf0; padding:12px 15px; border-radius:10px; margin-bottom:20px; }
.property-inquiry-property strong { font-size:14px; flex:1 1 220px; }
.property-inquiry-property span { color:#0e7490; font-size:14px; font-weight:800; }
.property-inquiry-property small { width:100%; color:#647d8d; }
.property-inquiry-dialog .property-lead-form { padding:0; border:0; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:15px; }
.property-inquiry-dialog .property-lead-form label { min-width:0; display:grid; gap:6px; color:#345266; font-size:13px; font-weight:700; }
.property-inquiry-dialog .property-lead-form input, .property-inquiry-dialog .property-lead-form select, .property-inquiry-dialog .property-lead-form textarea { width:100%; min-width:0; min-height:43px; padding:11px 12px; border:1px solid #cbd9e1; border-radius:9px; background:#fff; color:#143345; font:inherit; }
.property-inquiry-dialog .property-lead-form :is(input,select,textarea):focus-visible { outline:2px solid #0e7490; outline-offset:1px; }
.property-inquiry-dialog .property-lead-form textarea { resize:vertical; min-height:106px; }
.property-inquiry-dialog .property-lead-form .property-inquiry-wide { grid-column:1/-1; }
.property-inquiry-dialog .property-lead-form button[type=submit] { width:100%; justify-content:center; border:0; min-height:46px; cursor:pointer; }
.property-inquiry-dialog .property-lead-form button:disabled { opacity:.65; cursor:not-allowed; }
.property-inquiry-dialog .lead-error { grid-column:1/-1; margin:0; }
.property-inquiry-success { text-align:center; padding:24px 10px 14px; }
.property-inquiry-success h3 { font:800 24px 'Manrope',sans-serif; margin:0 0 12px; color:#14653f; }
.property-inquiry-success p { color:#446575; line-height:1.7; }
.property-inquiry-success button { margin-top:10px; border:0; cursor:pointer; min-width:140px; justify-content:center; }
@media(max-width:620px) {
  .property-inquiry-backdrop { padding:8px; align-items:center; }
  .property-inquiry-dialog { max-height:calc(100dvh - 16px); border-radius:14px; }
  .property-inquiry-dialog-header { padding:17px 18px; }
  .property-inquiry-dialog-body { padding:16px 18px 21px; }
  .property-inquiry-dialog .property-lead-form { grid-template-columns:minmax(0,1fr); gap:12px; }
  .property-inquiry-dialog .property-lead-form .property-inquiry-wide { grid-column:1; }
}
`;


// Full-size image + thumbnail carousel styling is embedded in this page.
// Classes are prefixed to avoid clashes with the site's existing gallery CSS.
const PROPERTY_GALLERY_CSS = String.raw`
.unpd-gallery,.unpd-gallery *{box-sizing:border-box}
.unpd-gallery{position:relative;min-width:0;width:100%;padding:12px;border:1px solid #e3e8ed;border-radius:18px;background:#fff;box-shadow:0 12px 35px rgba(14,36,52,.06);overflow:hidden}
.unpd-gallery__stage{position:relative;width:100%;aspect-ratio:16/9;min-height:260px;max-height:570px;overflow:hidden;border-radius:13px;background:#f3f5f6}
.unpd-gallery__main{display:flex;align-items:center;justify-content:center;width:100%;height:100%;margin:0;padding:0;border:0;border-radius:0;background:transparent;cursor:zoom-in;overflow:hidden}
.unpd-gallery__main img{display:block;width:100%;height:100%;object-fit:contain;object-position:center;animation:unpd-image-fade .35s ease both}
.unpd-gallery__empty{display:grid;place-items:center;width:100%;height:100%;color:#91a4af}
.unpd-gallery__empty svg{width:74px;height:74px;stroke-width:1.4}
.unpd-gallery__badge{position:absolute;bottom:14px;left:14px;display:inline-flex;align-items:center;gap:7px;padding:8px 12px;background:rgba(12,29,41,.78);border:1px solid rgba(255,255,255,.18);border-radius:8px;color:#fff;font-size:12px;font-weight:700;pointer-events:none;backdrop-filter:blur(6px)}
.unpd-gallery__badge svg{width:15px;height:15px}
.unpd-gallery__actions{position:absolute;bottom:14px;right:14px;display:flex;align-items:center;gap:7px}
.unpd-gallery__action{display:inline-flex;align-items:center;justify-content:center;gap:5px;min-width:34px;height:34px;padding:0 9px;border:1px solid rgba(255,255,255,.25);border-radius:8px;background:rgba(12,29,41,.78);color:#fff;font-size:11px;font-weight:700;cursor:pointer;backdrop-filter:blur(6px)}
.unpd-gallery__action svg{width:15px;height:15px}
.unpd-gallery__nav{position:absolute;top:50%;z-index:2;display:grid;place-items:center;width:42px;height:42px;padding:0;border:1px solid rgba(255,255,255,.65);border-radius:50%;background:rgba(255,255,255,.94);color:#113c4b;box-shadow:0 5px 17px rgba(12,30,40,.17);cursor:pointer;transform:translateY(-50%);transition:background .2s ease,box-shadow .2s ease}
.unpd-gallery__nav svg{width:22px;height:22px}
.unpd-gallery__nav:hover{background:#fff;box-shadow:0 9px 24px rgba(12,30,40,.25)}
.unpd-gallery__nav--prev{left:12px}
.unpd-gallery__nav--next{right:12px}
.unpd-gallery__thumbs{position:relative;display:flex;align-items:stretch;gap:10px;width:100%;margin-top:12px;padding:3px 2px 7px;overflow-x:auto;overflow-y:hidden;scrollbar-width:thin;scrollbar-color:#b7cbd0 transparent;overscroll-behavior-x:contain;scroll-snap-type:x proximity}
.unpd-gallery__thumb{position:relative;display:block;flex:0 0 clamp(102px,17%,142px);aspect-ratio:1.58;min-width:0;padding:3px;border:2px solid transparent;border-radius:10px;background:#e8edef;cursor:pointer;scroll-snap-align:center;transition:border-color .2s ease,transform .2s ease;overflow:hidden}
.unpd-gallery__thumb img{width:100%;height:100%;object-fit:cover;display:block;border-radius:5px}
.unpd-gallery__thumb:hover{transform:translateY(-2px)}
.unpd-gallery__thumb[aria-pressed="true"]{border-color:#0b7984;background:#fff;box-shadow:0 0 0 1px rgba(11,121,132,.22)}
.unpd-gallery__thumb-label{position:absolute;right:7px;bottom:7px;padding:3px 6px;background:rgba(10,33,47,.74);color:#fff;border-radius:4px;font-size:10px;font-weight:700;pointer-events:none}
.unpd-gallery__thumbs::-webkit-scrollbar{height:6px}
.unpd-gallery__thumbs::-webkit-scrollbar-thumb{background:#b7cbd0;border-radius:20px}
.unpd-gallery__thumbs::-webkit-scrollbar-track{background:transparent}
.unpd-gallery button:focus-visible{outline:3px solid #0c8194;outline-offset:2px}
@keyframes unpd-image-fade{from{opacity:.55}to{opacity:1}}
@media(max-width:700px){.unpd-gallery{padding:8px;border-radius:12px}.unpd-gallery__stage{min-height:200px;aspect-ratio:4/3;border-radius:9px}.unpd-gallery__nav{height:36px;width:36px}.unpd-gallery__nav svg{width:19px;height:19px}.unpd-gallery__nav--prev{left:8px}.unpd-gallery__nav--next{right:8px}.unpd-gallery__thumbs{gap:7px;margin-top:8px;padding-bottom:5px}.unpd-gallery__thumb{flex-basis:100px}.unpd-gallery__badge{left:8px;bottom:8px;font-size:11px;padding:6px 8px}.unpd-gallery__actions{right:8px;bottom:8px}.unpd-gallery__action{height:30px;min-width:30px;padding:0 7px}}
@media(max-width:410px){.unpd-gallery__stage{min-height:180px}.unpd-gallery__badge{font-size:10px}.unpd-gallery__thumb{flex-basis:86px}.unpd-gallery__action span{display:none}}
@media(prefers-reduced-motion:reduce){.unpd-gallery__main img{animation:none}.unpd-gallery__nav,.unpd-gallery__thumb{transition:none}.unpd-gallery__thumb:hover{transform:none}}
`;

export function PropertyDetail(){
  const {propertyId}=useParams();
  const {organization,properties}=useSite();
  const property=properties.find((item:any)=>item.id===propertyId);
  const propertyMedia=property?.media;
  const media=Array.isArray(propertyMedia)?propertyMedia:[];
  // Stable dependencies prevent the carousel from being reset during state updates.
  const images=useMemo(()=>{
    const uploaded=(Array.isArray(propertyMedia)?propertyMedia:[])
      .filter((item:any)=>item?.media_type==='image'&&item.url);
    if(uploaded.length)return uploaded;
    return property?.image_url?[{id:'cover',url:property.image_url,title:property.title,is_cover:true}]:[];
  },[propertyMedia,property?.image_url,property?.title]);
  const videos=media.filter((item:any)=>item.media_type==='video');
  const files=media.filter((item:any)=>item.media_type==='document'||item.media_type==='file');
  const [active,setActive]=useState('');
  const [lightbox,setLightbox]=useState(false);
  const [autoPlaying,setAutoPlaying]=useState(true);
  const [galleryVisible,setGalleryVisible]=useState(true);
  const [slideReset,setSlideReset]=useState(0);
  const galleryRef=useRef<HTMLDivElement>(null);
  const thumbnailsRef=useRef<HTMLDivElement>(null);
  const [expanded,setExpanded]=useState(false);
  const [lead,setLead]=useState({name:'',phone:'',email:'',requirement_type:'Interested in this property',budget:'',preferred_callback:'',visit_preference:'',message:''});
  const [sending,setSending]=useState(false);
  const sendingRef=useRef(false);
  const [leadResult,setLeadResult]=useState('');
  const [leadError,setLeadError]=useState('');
  const [inquiryOpen,setInquiryOpen]=useState(false);
  const inquiryNameRef=useRef<HTMLInputElement>(null);
  const lastInquiryTriggerRef=useRef<HTMLButtonElement|null>(null);
  const submitLead=async(e:FormEvent)=>{
    e.preventDefault();if(sendingRef.current||!property)return;
    sendingRef.current=true;setSending(true);setLeadResult('');setLeadError('');
    try{const result:any=await sendInquiry({...lead,property_id:property.id});setLeadResult(`Inquiry sent! Reference: ${result.inquiry_id}. Our team can call you back.`);setLead({...lead,name:'',phone:'',email:'',message:'',preferred_callback:'',budget:'',visit_preference:''})}
    catch(error:any){setLeadError(error.message||'Unable to submit inquiry')}
    finally{sendingRef.current=false;setSending(false)}
  };
  const openInquiry=(trigger:HTMLButtonElement)=>{
    lastInquiryTriggerRef.current=trigger;
    setLeadError('');
    setLeadResult('');
    setInquiryOpen(true);
  };
  const closeInquiry=()=>{
    if(sendingRef.current)return;
    setInquiryOpen(false);
    setLeadError('');
    lastInquiryTriggerRef.current?.focus();
  };
  useEffect(()=>{
    if(!inquiryOpen)return;
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    inquiryNameRef.current?.focus();
    const onEscape=(event:KeyboardEvent)=>{
      if(event.key==='Escape' && !sendingRef.current){event.preventDefault();setInquiryOpen(false);lastInquiryTriggerRef.current?.focus();}
    };
    document.addEventListener('keydown',onEscape);
    return ()=>{document.body.style.overflow=previousOverflow;document.removeEventListener('keydown',onEscape);};
  },[inquiryOpen]);
  useEffect(()=>{
    setActive(images.find((item:any)=>item.is_cover)?.url||images[0]?.url||'');
    setAutoPlaying(true);
  },[propertyId,images]);

  // Stop rotating while the carousel is outside the viewport.
  useEffect(()=>{
    const node=galleryRef.current;
    if(!node||typeof IntersectionObserver==='undefined')return;
    const observer=new IntersectionObserver(([entry])=>setGalleryVisible(Boolean(entry?.isIntersecting)),{threshold:0.15});
    observer.observe(node);
    return ()=>observer.disconnect();
  },[propertyId,images.length]);

  // The hero image AND highlighted thumbnail advance together every 2 seconds.
  useEffect(()=>{
    if(images.length<2||!autoPlaying||!galleryVisible||lightbox||inquiryOpen)return;
    if(typeof window==='undefined'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const timer=window.setInterval(()=>{
      if(document.visibilityState==='hidden')return;
      setActive(current=>{
        const index=images.findIndex((image:any)=>image.url===current);
        return images[(index+1+images.length)%images.length]?.url||current;
      });
    },2000);
    return ()=>window.clearInterval(timer);
  },[images,autoPlaying,galleryVisible,lightbox,inquiryOpen,slideReset]);

  // Keep the active thumbnail in view as the gallery advances.
  useEffect(()=>{
    const track=thumbnailsRef.current;
    if(!track||!active)return;
    const selected=Array.from(track.querySelectorAll<HTMLButtonElement>('button'))
      .find(button=>button.dataset.url===active);
    if(!selected)return;
    const left=selected.getBoundingClientRect().left-track.getBoundingClientRect().left
      +track.scrollLeft-(track.clientWidth-selected.clientWidth)/2;
    track.scrollTo({left:Math.max(0,left),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  },[active,images]);

  if(!property)return <section className="state"><h1>Property not found</h1><p>This listing is unavailable or has been removed.</p><Link to="/properties">Return to properties</Link></section>;

  const features=organization.features||{};
  const amenities=String(property.amenities||'').split(/[\n,]/).map((item:string)=>item.trim()).filter(Boolean);
  const activeIndex=Math.max(0,images.findIndex((item:any)=>item.url===active));
  const selectImage=(url:string)=>{setActive(url);setSlideReset(value=>value+1)};
  const changeImage=(direction:number)=>{
    if(!images.length)return;
    const next=(activeIndex+direction+images.length)%images.length;
    selectImage(images[next].url);
  };
  const share=async()=>{const data={title:property.title,text:`${property.title} — ${property.price}`,url:location.href};try{if(navigator.share)await navigator.share(data);else await navigator.clipboard.writeText(location.href)}catch{/* visitor cancelled sharing */}};
  const description=String(property.description||'');
  const visibleDescription=!expanded&&description.length>420?`${description.slice(0,420).trim()}…`:description;

  return <>
    <style>{INQUIRY_DIALOG_CSS}</style>
    <style>{PROPERTY_GALLERY_CSS}</style>
    <section className="property-detail-head">
      <Link to="/properties"><ChevronLeft/> All properties</Link>
      <div><div><span>{property.purpose}</span><small>{property.property_type}</small></div><button onClick={share}><Share2/> Share</button></div>
      <h1>{property.title}</h1>
      <p><MapPin/> {property.full_address||property.location}</p>
    </section>

    <section className="property-price-strip">
      <div><small>Property price</small><strong>{property.price||'Contact for price'}</strong>{property.price_per_sqft&&<span>{property.price_per_sqft}</span>}</div>
      {quickFacts.filter(([key])=>property[key]).slice(0,4).map(([key,label,Icon])=><div key={key}><Icon/><span><small>{label}</small><b>{key==='floor'&&property.total_floors?`${property.floor} of ${property.total_floors}`:property[key]}</b></span></div>)}
    </section>

    <section className="property-detail-layout">
      <div>
        <div
          className="unpd-gallery"
          ref={galleryRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={`${property.title} photo gallery`}
        >
          <div className="unpd-gallery__stage">
            <button type="button" className="unpd-gallery__main" onClick={()=>active&&setLightbox(true)} aria-label="Open current photo full screen" disabled={!active}>
              {active?<img key={active} src={mediaUrl(active)} alt={images[activeIndex]?.title||property.title} decoding="async"/>:<span className="unpd-gallery__empty"><Building2 aria-hidden="true"/></span>}
            </button>
            {images.length>1&&<>
              <button type="button" className="unpd-gallery__nav unpd-gallery__nav--prev" onClick={()=>changeImage(-1)} aria-label="Previous photo"><ChevronLeft aria-hidden="true"/></button>
              <button type="button" className="unpd-gallery__nav unpd-gallery__nav--next" onClick={()=>changeImage(1)} aria-label="Next photo"><ChevronRight aria-hidden="true"/></button>
            </>}
            {images.length>0&&<span className="unpd-gallery__badge"><Images aria-hidden="true"/> {activeIndex+1} / {images.length} photos</span>}
            {images.length>1&&<div className="unpd-gallery__actions">
              <button type="button" className="unpd-gallery__action" onClick={()=>setAutoPlaying(value=>!value)} aria-label={autoPlaying?'Pause automatic slideshow':'Play automatic slideshow'} aria-pressed={!autoPlaying}>
                {autoPlaying?<Pause aria-hidden="true"/>:<Play aria-hidden="true"/>}<span>{autoPlaying?'Pause':'Play'}</span>
              </button>
            </div>}
          </div>
          {images.length>1&&<div className="unpd-gallery__thumbs" ref={thumbnailsRef} aria-label="Choose a property photo">
            {images.map((image:any,index:number)=><button
              type="button"
              className="unpd-gallery__thumb"
              key={image.id??`${image.url}-${index}`}
              data-url={image.url}
              onClick={()=>selectImage(image.url)}
              aria-label={`Show photo ${index+1} of ${images.length}`}
              aria-pressed={active===image.url}
            >
              <img src={mediaUrl(image.url)} alt={image.title||`${property.title} image ${index+1}`} loading="lazy" decoding="async"/>
              {image.is_cover&&<span className="unpd-gallery__thumb-label">Cover</span>}
            </button>)}
          </div>}
        </div>

        <section className="property-section">
          <h2>Property overview</h2>
          <div className="property-specs">{overview.map(([key,label,Icon])=>property[key]&&<div key={key}><Icon/><span><small>{label}</small><b>{key==='floor'&&property.total_floors?`${property.floor} of ${property.total_floors}`:property[key]}</b></span></div>)}</div>
        </section>

        <section className="property-section">
          <h2>More details</h2>
          <div className="more-details">{moreDetails.map(([key,label])=>property[key]&&<div key={key}><span>{label}</span><b>{property[key]}</b></div>)}</div>
        </section>

        {features.property_descriptions&&description&&<section className="property-section"><h2>Description</h2><p className="long-copy">{visibleDescription}</p>{description.length>420&&<button className="read-more" onClick={()=>setExpanded(!expanded)}>{expanded?'Read less':'Read more'}</button>}</section>}
      <ListingExtraDetails fields={property.additional_fields}/>
      <MediaGalleryGrid items={media} title="Photos & videos"/>
        {amenities.length>0&&<section className="property-section"><h2>Amenities</h2><div className="amenity-list">{amenities.map((item:string)=><span key={item}>✓ {item}</span>)}</div></section>}
        {(property.project_name||property.developer_name||property.project_description)&&<section className="property-section project-about"><small>ABOUT PROJECT</small><h2>{property.project_name||'Project information'}</h2>{property.developer_name&&<b>by {property.developer_name}</b>}{property.project_description&&<p className="long-copy">{property.project_description}</p>}</section>}

        {videos.length>0&&<section className="property-section"><h2>Property videos</h2><div className="property-videos">{videos.map((video:any)=><article key={video.id}><video controls preload="metadata" poster={mediaUrl(property.image_url)} src={mediaUrl(video.url)}/><div><Play/><span><b>{video.title}</b>{video.description&&<small>{video.description}</small>}</span></div></article>)}</div></section>}
        {files.length>0&&<section className="property-section"><h2>Documents & downloads</h2><div className="property-documents">{files.map((file:any)=><a href={mediaUrl(file.url)} target="_blank" rel="noreferrer" key={file.id}>{file.media_type==='document'?<FileText/>:<File/>}<span><b>{file.title}</b><small>{file.description||file.original_name}</small></span><Download/></a>)}</div></section>}
      </div>

      <aside className="property-enquiry-card">
        <small>{property.purpose==='Rent'?'Monthly rent':'Property price'}</small><strong>{property.price||'Contact for price'}</strong>{property.price_per_sqft&&<span>{property.price_per_sqft}</span>}
        <p><MapPin/> {property.location}</p><div className="listing-reference">Listing ID <b>{property.id}</b></div>
        {property.contact_phone||organization.phone?<a className="primary" href={`tel:${property.contact_phone||organization.phone}`}><Phone/> Contact property advisor</a>:null}
        {features.contact&&<>
          <button type="button" className="primary property-inquiry-open" onClick={event=>openInquiry(event.currentTarget)}><MessageSquareText/> Make an inquiry</button>
          <p className="property-inquiry-hint">Interested in this listing? Tell us your requirements in a short form. Our team will contact you.</p>
        </>}
        {property.map_url&&<a className="map-link" href={property.map_url} target="_blank" rel="noreferrer"><ExternalLink/> View location on map</a>}
        <small>Verify availability, legal documents and final pricing directly with the organization.</small>
      </aside>
    </section>

    {inquiryOpen&&features.contact&&createPortal(
      <div className="property-inquiry-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)closeInquiry()}}>
        <section className="property-inquiry-dialog" role="dialog" aria-modal="true" aria-labelledby="property-inquiry-title" aria-describedby="property-inquiry-description"
          onKeyDown={event=>{
            if(event.key!=='Tab')return;
            const focusable=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]'));
            if(!focusable.length)return;
            const first=focusable[0],last=focusable[focusable.length-1];
            if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
            else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
          }}>
          <header className="property-inquiry-dialog-header">
            <div><small>Property inquiry</small><h2 id="property-inquiry-title">Request a callback</h2><p id="property-inquiry-description">Share your details and our property advisor will get in touch.</p></div>
            <button type="button" className="property-inquiry-close" onClick={closeInquiry} aria-label="Close inquiry form" disabled={sending}><X/></button>
          </header>
          <div className="property-inquiry-dialog-body">
            <div className="property-inquiry-property">
              <strong>{property.title}</strong><span>{property.price||'Contact for price'}</span>
              <small>{property.location} · Listing ID {property.id}</small>
            </div>
            {leadResult?
              <div className="property-inquiry-success" role="status">
                <h3>Inquiry submitted successfully!</h3>
                <p>{leadResult}</p>
                <button type="button" className="primary" onClick={closeInquiry}>Done</button>
              </div>
            :<form className="property-lead-form" onSubmit={submitLead}>
              <label>Full name *<input ref={inquiryNameRef} autoComplete="name" required minLength={2} maxLength={120} value={lead.name} onChange={event=>setLead({...lead,name:event.target.value})} placeholder="Your full name"/></label>
              <label>Mobile number *<input type="tel" autoComplete="tel" required minLength={7} maxLength={20} value={lead.phone} onChange={event=>setLead({...lead,phone:event.target.value})} placeholder="Mobile / WhatsApp number"/></label>
              <label>Email (optional)<input type="email" autoComplete="email" maxLength={200} value={lead.email} onChange={event=>setLead({...lead,email:event.target.value})} placeholder="you@example.com"/></label>
              <label>What do you need?<select value={lead.requirement_type} onChange={event=>setLead({...lead,requirement_type:event.target.value})}>
                <option>Interested in this property</option><option>Schedule a site visit</option><option>Price negotiation</option><option>Loan / financing information</option><option>Request more information</option>
              </select></label>
              <label>Your budget (optional)<input maxLength={120} value={lead.budget} onChange={event=>setLead({...lead,budget:event.target.value})} placeholder="e.g. ₹80–90 lakh"/></label>
              <label>Preferred callback time<input type="datetime-local" value={lead.preferred_callback} onChange={event=>setLead({...lead,preferred_callback:event.target.value})}/></label>
              <label className="property-inquiry-wide">Preferred site visit time (optional)<input maxLength={120} value={lead.visit_preference} onChange={event=>setLead({...lead,visit_preference:event.target.value})} placeholder="e.g. Sunday morning"/></label>
              <label className="property-inquiry-wide">Additional requirements<textarea maxLength={3000} rows={4} value={lead.message} onChange={event=>setLead({...lead,message:event.target.value})} placeholder="Tell us about your requirements..."/></label>
              {leadError&&<p className="lead-error" role="alert">{leadError}</p>}
              <div className="property-inquiry-wide"><button type="submit" className="primary" disabled={sending}>{sending?'Submitting inquiry...':'Submit inquiry & request callback'}</button></div>
            </form>}
          </div>
        </section>
      </div>,document.body
    )}

    {lightbox&&<div className="property-lightbox" role="dialog" aria-modal="true" aria-label="Property image viewer"><button className="lightbox-close" onClick={()=>setLightbox(false)} aria-label="Close"><X/></button>{images.length>1&&<button className="lightbox-prev" onClick={()=>changeImage(-1)} aria-label="Previous"><ChevronLeft/></button>}<img src={mediaUrl(active)} alt={property.title}/>{images.length>1&&<button className="lightbox-next" onClick={()=>changeImage(1)} aria-label="Next"><ChevronRight/></button>}<span>{activeIndex+1} / {images.length}</span></div>}
  </>;
}
