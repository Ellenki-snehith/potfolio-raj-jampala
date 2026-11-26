import {FieldImageContent} from './FieldImageContent';
import React from 'react';
import {ExternalLink, CalendarDays, CheckCircle2, TrendingUp} from 'lucide-react';
import type {FoundationField,FoundationFieldValues} from '../admin/FoundationFieldEditor';

type Props={slug:string; values?:FoundationFieldValues;schema?:FoundationField[];variant?:'page'|'record';media?:Record<string,{image_url?:string;image_align?:string;gallery?:import('../admin/FieldImageEditor').FieldGalleryItem[]}>};
const goodUrl=(v:string)=>v.startsWith('/')&&!v.startsWith('//')||/^https?:\/\//i.test(v);
const has=(v:unknown)=>v!==undefined&&v!==null&&v!==''&&(!Array.isArray(v)||v.length>0);
const fmt=(v:unknown)=>typeof v==='boolean'?(v?'Yes':'No'):String(v??'');
const stats=new Set(['highlight_numbers','impact_metrics']);
const headingFor=(slug:string,group:string)=>slug==='about-us'&&group==='Vision & purpose'?'Our mission and vision':group;

/** Shared public renderer for validated, page-specific Foundation information. */
export function FoundationStructuredContent({slug,values={},schema=[],variant='page',media={}}:Props){
 const homeButtonSettings=new Set(['primary_cta_label','primary_cta_url','secondary_cta_label','secondary_cta_url']);
 const fields=schema.filter(f=>(has(values?.[f.key])||(!!media[f.key]?.image_url||!!media[f.key]?.gallery?.length))&&(slug!=='home'||!homeButtonSettings.has(f.key)));
 if(!fields.length)return null;
 const groups=Array.from(new Set(fields.map(f=>f.group||'Details')));
 return <div className={`fo-structured fo-structured-${variant} fo-structured-${slug}`}>
  {groups.map(group=><section className="fo-structured-section" key={group}>
   <div className="fo-structured-heading"><span className="fo-eyebrow">{variant==='page'?'FOUNDATION INFORMATION':'PROJECT DETAILS'}</span><h2>{headingFor(slug,group)}</h2></div>
   <div className="fo-structured-grid">{fields.filter(f=>(f.group||'Details')===group).map(f=>{
    const v=values[f.key];const isStat=stats.has(f.key);const multiline=f.kind==='textarea';
    return <article className={`fo-structured-item ${multiline?'fo-structured-long':''} ${isStat?'fo-structured-stats':''}`} key={f.key}>
     <FieldImageContent imageUrl={media[f.key]?.image_url} imageAlign={media[f.key]?.image_align} gallery={media[f.key]?.gallery} alt={f.label}><div className="fo-structured-label">{f.label}</div>
     {f.kind==='list'?<div className={isStat?'fo-stats-list':'fo-list-values'}>{(Array.isArray(v)?v:[]).map((x,i)=><span key={`${i}-${x}`}>
       {isStat?<TrendingUp size={17}/>:<CheckCircle2 size={14}/>} {x}
      </span>)}</div>
     :f.kind==='boolean'?<strong>{v===true?'Yes':'No'}</strong>
     :f.kind==='url'&&typeof v==='string'&&goodUrl(v)?<a className="fo-structured-link" href={v} rel="noopener noreferrer" target="_blank">{f.key==='map_url'?'Open location on map':f.key==='report_file_url'?'View / download report':f.key.includes('payment')?'Open secure donation page':'Open link'} <ExternalLink size={15}/></a>
     :f.kind==='date'||f.kind==='datetime-local'?<div className="fo-structured-date"><CalendarDays size={16}/>{fmt(v).replace('T',' ')}</div>
     :<p className="fo-structured-text">{fmt(v)}</p>}
     </FieldImageContent></article>})}</div>
  </section>)}
 </div>;
}
