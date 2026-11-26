import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight,HeartHandshake,Target,Users,CalendarDays} from 'lucide-react';
import {foundationPublic,mediaUrl} from '../api';
import '../pages/foundation-site.css';

type Entry={id:string;page_slug:string;title:string;subtitle?:string;image_url?:string;featured?:boolean};
type Data={site:{title:string;tagline?:string;donation_url?:string;pages:{slug:string;title:string;page_data?:Record<string,unknown>}[]};entries:Entry[]};
/** The Foundation overview belongs on the existing website Home, not a duplicate /foundation/home. */
export function FoundationHomeHighlights(){
 const [data,setData]=useState<Data|null>(null);
 useEffect(()=>{let active=true;foundationPublic().then((r:Data)=>{if(active)setData(r)}).catch(()=>{});return()=>{active=false}},[]);
 if(!data)return null;
 const active=new Set(data.site.pages.map(p=>p.slug));
 const featured=data.entries.filter(e=>active.has(e.page_slug)&&e.featured).slice(0,3);
 const choices=[['our-causes','Explore causes'],['our-projects','Our projects'],['events','Upcoming events'],['volunteer','Volunteer']].filter(([slug])=>active.has(slug));
 const impact=data.site.pages.find(p=>p.slug==='our-impact')?.page_data?.impact_metrics;
 const metrics=Array.isArray(impact)?impact.slice(0,3):[];
 return <section className="fo-site fo-home-block"><div className="fo-container fo-home-inner"><div className="fo-home-header"><div><span className="fo-eyebrow">CHARITY & FOUNDATION</span><h2>{data.site.title}</h2><p>{data.site.tagline||'Building stronger communities through shared action.'}</p></div>{active.has('donate')&&<Link className="fo-button" to="/foundation/donate">Support our mission <ArrowRight size={17}/></Link>}</div>
 {metrics.length>0&&<div className="fo-metrics">{metrics.map((item,i)=><div key={i}><Target size={23}/><strong>{String(item)}</strong></div>)}</div>}
 <div className="fo-home-links">{choices.map(([slug,label])=><Link key={slug} to={`/foundation/${slug}`}>{slug==='events'?<CalendarDays size={19}/>:slug==='volunteer'?<Users size={19}/>:<HeartHandshake size={19}/>}<span>{label}</span><ArrowRight size={15}/></Link>)}</div>
 {featured.length>0&&<div className="fo-home-featured"><h3>Featured foundation work</h3><div className="fo-home-featured-grid">{featured.map(e=><Link key={e.id} to={`/foundation/${e.page_slug}/${e.id}`}>{e.image_url?<img loading="lazy" src={mediaUrl(e.image_url)} alt={e.title}/>:<div className="fo-tile-placeholder"><HeartHandshake size={27}/></div>}<span>{e.title}</span><small>{e.subtitle}</small></Link>)}</div></div>}</div></section>;
}
