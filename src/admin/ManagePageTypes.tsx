import './page-builder.css';
import {useEffect,useState,type FormEvent} from 'react';
import {Pencil,Plus,Trash2,ArrowUp,ArrowDown} from 'lucide-react';
import {superCustomPageTypes,createCustomPageType,updateCustomPageType,deleteCustomPageType,setOrganizationPageAccess} from '../api';

const defaultSections=[
 {source:'description',title:'About this service',style:'paragraph',visible:true},
 {source:'custom_details',title:'Our completed work',style:'paragraph',visible:true},
 {source:'scope_of_work',title:'Scope of work',style:'bullets',visible:true},
 {source:'materials',title:'Materials & workmanship',style:'paragraph',visible:true},
 {source:'process',title:'Working process',style:'paragraph',visible:true},
 {source:'highlights',title:'Project highlights',style:'bullets',visible:true}
];
const newForm=()=>({name:'',slug:'',description:'',hero_title:'',hero_description:'',display_order:0,active:true,
 category_options:[] as string[],field_definitions:[] as any[],detail_sections:defaultSections.map(x=>({...x})),
 card_fields:['location','category','price_label'],listing_layout:'grid',detail_layout:'sidebar',show_search:true,show_category_filter:true,
 inquiry_heading:'Interested in this service?',inquiry_fields:{email:true,budget:true,preferred_callback:true,visit_preference:true,message:true}});
const cardOptions=[['location','Location'],['category','Category'],['price_label','Price / estimate'],['completed_projects','Completed projects'],['years_experience','Years of experience']];
const secOptions=[['description','Description'],['custom_details','Completed work'],['scope_of_work','Scope of work'],['materials','Materials'],['process','Working process'],['highlights','Highlights']];
const updList=(list:any[],index:number,field:string,value:any)=>list.map((x,i)=>i===index?{...x,[field]:value}:x);
const reorder=(list:any[],index:number,dir:number)=>{const copy=list.slice();const next=index+dir;if(next<0||next>=copy.length)return copy;[copy[index],copy[next]]=[copy[next],copy[index]];return copy};
export function ManagePageTypes({orgs,reload}:{orgs:any[],reload:()=>Promise<void>}){
 const [items,setItems]=useState<any[]>([]),[form,setForm]=useState<any>(newForm()),[editing,setEditing]=useState(''),[message,setMessage]=useState('');
 const [categoryInput,setCategoryInput]=useState('');
 const load=async()=>setItems(await superCustomPageTypes() as any[]);useEffect(()=>{load().catch(e=>setMessage(e.message))},[]);
 const set=(key:string,value:any)=>setForm((old:any)=>({...old,[key]:value}));
 const save=async(e:FormEvent)=>{e.preventDefault();try{
  const payload={...form,display_order:Number(form.display_order)||0,field_definitions:form.field_definitions.map((x:any)=>({...x,options:x.type==='select'?x.options:[]}))};
  // IDs and timestamps are not writable properties.
  for(const k of ['id','created_at','updated_at'])delete payload[k];
  if(editing)await updateCustomPageType(editing,payload);else await createCustomPageType(payload);
  setForm(newForm());setCategoryInput('');setEditing('');setMessage('Page template saved. Grant organizations access below.');await load();await reload();
 }catch(error:any){setMessage(error.message)}};
 const grant=async(org:any,id:string,enabled:boolean)=>{try{const ids=new Set<string>(org.custom_page_access||[]);if(enabled)ids.add(id);else ids.delete(id);await setOrganizationPageAccess(org.id,[...ids]);await reload();setMessage(`Access updated for ${org.name}.`)}catch(e:any){setMessage(e.message)}};
 const enterEdit=(item:any)=>{setCategoryInput((item.category_options||[]).join('\n'));setEditing(item.id);setForm({...newForm(),...item,category_options:[...(item.category_options||[])],field_definitions:(item.field_definitions||[]).map((x:any)=>({...x,options:[...(x.options||[])]})),detail_sections:(item.detail_sections||defaultSections).map((x:any)=>({...x})),card_fields:[...(item.card_fields||[])]});window.scrollTo({top:0,behavior:'smooth'})};
 return <section style={{marginTop:36}}><div className="admin-title"><span>MASTER ADMIN · DYNAMIC PAGE BUILDER</span><h1>Build categories, listing pages & detail pages</h1><p>Configure each page like Properties: create a category, choose the fields organizations must fill, design listing cards and arrange detail sections. Existing Civil Services and Properties are unchanged.</p></div>
 <div className="admin-grid"><form className="panel admin-form" onSubmit={save}>
 <h2>{editing?'Edit page template':'Create a customizable page type'}</h2>
 <label>Public page name *<input required value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Solar Installation"/></label>
 <label>Public URL slug<input value={form.slug} onChange={e=>set('slug',e.target.value)} placeholder="solar-installation"/></label>
 <label>Page description<textarea value={form.description} onChange={e=>set('description',e.target.value)}/></label>
 <label>Listing page heading<input value={form.hero_title} onChange={e=>set('hero_title',e.target.value)} placeholder="Browse our projects"/></label>
 <label>Listing introduction<textarea value={form.hero_description} onChange={e=>set('hero_description',e.target.value)}/></label>
 <fieldset><legend>1. Categories / filters</legend><p className="builder-help">One category per line. Organization Admin will choose from these options, and visitors can filter published cards.</p>
 <label>Available categories<textarea rows={5} placeholder={'Residential\nCommercial\nIndustrial'} value={categoryInput} onChange={e=>{setCategoryInput(e.target.value);set('category_options',e.target.value.split('\n').map(x=>x.trim()).filter(Boolean))}}/></label>
 <label className="check"><input type="checkbox" checked={form.show_category_filter} onChange={e=>set('show_category_filter',e.target.checked)}/> Show category filters on listing page</label>
 <label className="check"><input type="checkbox" checked={form.show_search} onChange={e=>set('show_search',e.target.checked)}/> Show visitor search</label></fieldset>
 <fieldset><legend>2. Custom data fields</legend><p className="builder-help">Add fields such as Area, Number of floors, Warranty or Technology. They will automatically appear in the Organization Admin form and on the detail page.</p>
 {(form.field_definitions||[]).map((f:any,i:number)=><div className="builder-row" key={i}>
 <label>Field label<input value={f.label} placeholder="e.g. System capacity" onChange={e=>set('field_definitions',updList(form.field_definitions,i,'label',e.target.value))}/></label>
 <label>Database key<input value={f.key} placeholder="e.g. system_capacity" pattern="[a-z][a-z0-9_]*" title="Lowercase letters, numbers and underscores" onChange={e=>set('field_definitions',updList(form.field_definitions,i,'key',e.target.value))}/></label>
 <label>Input type<select value={f.type} onChange={e=>set('field_definitions',updList(form.field_definitions,i,'type',e.target.value))}>{['text','textarea','number','select','checkbox','date'].map(k=><option value={k} key={k}>{k}</option>)}</select></label>
 {f.type==='select'&&<label>Dropdown options (one per line)<textarea key={`master-options-${editing}-${i}`} defaultValue={(f.options||[]).join('\n')} onBlur={e=>set('field_definitions',updList(form.field_definitions,i,'options',e.target.value.split('\n').map(x=>x.trim()).filter(Boolean)))}/></label>}
 <div className="builder-checks">{(['required','show_on_card','show_on_detail'] as const).map(k=><label key={k} className="check"><input type="checkbox" checked={!!f[k]} onChange={e=>set('field_definitions',updList(form.field_definitions,i,k,e.target.checked))}/>{({required:'Required',show_on_card:'Show on card',show_on_detail:'Show in details'} as any)[k]}</label>)}</div>
 <div className="builder-actions"><button type="button" className="cancel" onClick={()=>set('field_definitions',reorder(form.field_definitions,i,-1))}><ArrowUp size={16}/></button><button type="button" className="cancel" onClick={()=>set('field_definitions',reorder(form.field_definitions,i,1))}><ArrowDown size={16}/></button><button type="button" className="danger" onClick={()=>set('field_definitions',form.field_definitions.filter((_:any,j:number)=>i!==j))}><Trash2 size={16}/></button></div></div>)}
 <button type="button" className="cancel" onClick={()=>set('field_definitions',[...form.field_definitions,{key:'',label:'',type:'text',required:false,options:[],show_on_card:false,show_on_detail:true}])}><Plus size={16}/> Add custom field</button></fieldset>
 <fieldset><legend>3. Property-style listing cards</legend>
 <label>Card layout<select value={form.listing_layout} onChange={e=>set('listing_layout',e.target.value)}><option value="grid">Image cards · 3 columns</option><option value="compact">Compact cards · 2 columns</option></select></label>
 <p className="builder-help">Choose which standard fields show on the cards. Custom fields have their own “Show on card” checkbox.</p>
 <div className="builder-checks">{cardOptions.map(([value,label])=><label key={value} className="check"><input type="checkbox" checked={form.card_fields.includes(value)} onChange={e=>set('card_fields',e.target.checked?[...form.card_fields,value]:form.card_fields.filter((x:string)=>x!==value))}/>{label}</label>)}</div></fieldset>
 <fieldset><legend>4. Detail page layout & sections</legend>
 <label>Detail layout<select value={form.detail_layout} onChange={e=>set('detail_layout',e.target.value)}><option value="sidebar">Gallery + inquiry sidebar (Properties style)</option><option value="wide">Wide portfolio content + inquiry below</option></select></label>
 {form.detail_sections.map((sec:any,i:number)=><div key={i} className="builder-section-row">
 <label>Section heading<input value={sec.title} onChange={e=>set('detail_sections',updList(form.detail_sections,i,'title',e.target.value))}/></label>
 <label>Content source<select value={sec.source} onChange={e=>set('detail_sections',updList(form.detail_sections,i,'source',e.target.value))}>{secOptions.map(([k,l])=><option key={k} value={k}>{l}</option>)}{form.field_definitions.filter((f:any)=>f.key).map((f:any)=><option key={f.key} value={'custom:'+f.key}>{f.label}</option>)}</select></label>
 <label>Display as<select value={sec.style} onChange={e=>set('detail_sections',updList(form.detail_sections,i,'style',e.target.value))}><option value="paragraph">Paragraph</option><option value="bullets">Bullet points</option><option value="specifications">Specifications</option></select></label>
 <label className="check"><input type="checkbox" checked={!!sec.visible} onChange={e=>set('detail_sections',updList(form.detail_sections,i,'visible',e.target.checked))}/> Visible</label>
 <div className="builder-actions"><button type="button" className="cancel" onClick={()=>set('detail_sections',reorder(form.detail_sections,i,-1))}><ArrowUp size={16}/></button><button type="button" className="cancel" onClick={()=>set('detail_sections',reorder(form.detail_sections,i,1))}><ArrowDown size={16}/></button><button type="button" className="danger" onClick={()=>set('detail_sections',form.detail_sections.filter((_:any,j:number)=>j!==i))}><Trash2 size={16}/></button></div></div>)}
 <button type="button" className="cancel" onClick={()=>set('detail_sections',[...form.detail_sections,{source:'description',title:'New section',style:'paragraph',visible:true}])}><Plus size={16}/> Add detail section</button></fieldset>
 <fieldset><legend>5. Inquiry form</legend><label>Inquiry panel heading<input value={form.inquiry_heading} onChange={e=>set('inquiry_heading',e.target.value)}/></label><p className="builder-help">Name and phone stay required. Show/hide additional questions below; all leads still reach Organization Admin.</p>
 <div className="builder-checks">{Object.entries(({email:'Email',budget:'Budget',preferred_callback:'Callback preference',visit_preference:'Site visit',message:'Requirement message'})).map(([key,label])=><label className="check" key={key}><input type="checkbox" checked={form.inquiry_fields[key]!==false} onChange={e=>set('inquiry_fields',{...form.inquiry_fields,[key]:e.target.checked})}/>{label}</label>)}</div></fieldset>
 <label>Menu display order<input type="number" value={form.display_order} onChange={e=>set('display_order',Number(e.target.value))}/></label>
 <label className="check"><input type="checkbox" checked={form.active} onChange={e=>set('active',e.target.checked)}/> Active page type</label>
 <button type="submit"><Plus size={17}/> {editing?'Update category & page templates':'Create category & page templates'}</button>
 {editing&&<button type="button" className="cancel" onClick={()=>{setEditing('');setCategoryInput('');setForm(newForm())}}>Cancel editing</button>}{message&&<p className="status-message" role="status">{message}</p>}
 </form>
 <section className="panel item-admin-list"><h2>Master-created categories and templates</h2>{items.map(item=><article key={item.id}><div><b>{item.name}</b><small>/services/{item.slug} · {item.active?'Active':'Disabled'}</small><p>{item.description}</p><small>{item.category_options?.length||0} categories · {item.field_definitions?.length||0} extra fields · {item.detail_sections?.length||0} detail sections</small></div><button type="button" aria-label="Edit template" onClick={()=>enterEdit(item)}><Pencil/></button><button type="button" className="danger" onClick={async()=>{if(confirm('Delete this type? Existing pages prevent deletion; disable instead.')){try{await deleteCustomPageType(item.id);await load();await reload()}catch(e:any){setMessage(e.message)}}}}><Trash2/></button></article>)}{!items.length&&<p>Create your first page type to begin.</p>}</section></div>
 <h2 style={{marginTop:26}}>Grant organization access for each page type</h2><p>Enable <b>Custom Pages & Services</b> in the organization's features, then choose which templates its admin can use.</p><div className="org-list">{orgs.map(org=><article key={org.id} className="panel" style={{padding:20}}><b>{org.name}</b><small style={{display:'block',marginBottom:10}}>{org.features?.custom_pages?'Custom Pages enabled':'Custom Pages feature is disabled'}</small><div className="feature-box">{items.map(page=><label key={page.id}><input type="checkbox" disabled={!org.features?.custom_pages} checked={Boolean(org.custom_page_access?.includes(page.id))} onChange={e=>grant(org,page.id,e.target.checked)}/> {page.name}{!page.active?' (globally disabled)':''}</label>)}</div></article>)}</div>
 </section>;
}
