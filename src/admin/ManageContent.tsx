import {FieldImageEditor} from './FieldImageEditor';
import {useEffect,useState,type FormEvent} from 'react';
import {useOutletContext} from 'react-router-dom';
import {getPageContent,savePageContent,uploadImage,mediaUrl} from '../api';
import {Plus,Trash2,ArrowUp,ArrowDown,ImagePlus,Save} from 'lucide-react';
import type {PageSection,PageCustomField,PublishedPage} from '../components/SiteContentSections';
import './page-content-editor.css';

const uid=()=>`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;
const blank={home_title:'',home_subtitle:'',home_services:[],about_title:'',about_text:'',contact_title:'',contact_text:''};
export const blankSection=():PageSection=>({id:uid(),category:'',heading:'',eyebrow:'',body:'',image_url:'',button_label:'',button_url:'',layout:'standard',published:true,fields:[],gallery:[]});
const blankField=():PageCustomField=>({id:uid(),name:'',type:'text',value:'',show:true,image_url:'',image_align:'right'});
const slugify=(s:string)=>s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g,'').trim().replace(/[\s-]+/g,'-').slice(0,70);
const normalizeSection=(s:any):PageSection=>({...blankSection(),...s,id:s?.id||uid(),fields:Array.isArray(s?.fields)?s.fields:[]});
const normalizePages=(v:any):PublishedPage[]=>Array.isArray(v)?v.map((p:any)=>({...p,sections:Array.isArray(p.sections)?p.sections.map(normalizeSection):[]})):[];

type EditorProps={sections:PageSection[];onChange:(next:PageSection[])=>void};
export function SectionsEditor({sections,onChange}:EditorProps){
 const [uploading,setUploading]=useState('');
 const [uploadError,setUploadError]=useState('');
 const patch=(index:number,change:Partial<PageSection>)=>onChange(sections.map((s,i)=>i===index?{...s,...change}:s));
 const move=(index:number,offset:number)=>{const next=[...sections];const destination=index+offset;if(destination<0||destination>=next.length)return;[next[index],next[destination]]=[next[destination],next[index]];onChange(next)};
 const upload=async(index:number,file?:File)=>{if(!file)return;setUploadError('');setUploading(sections[index].id);try{const data=new FormData();data.append('file',file);const result:any=await uploadImage(data);patch(index,{image_url:result.url})}catch(err:any){setUploadError(err.message||'Upload failed')}finally{setUploading('')}};
 return <div className="pc-sections">
  {sections.map((s,index)=><div className="pc-section" key={s.id}>
   <div className="pc-section-head"><b>Section {index+1}: {s.heading||'New section'}</b><div>
    <button type="button" title="Move up" disabled={index===0} onClick={()=>move(index,-1)}><ArrowUp size={16}/></button>
    <button type="button" title="Move down" disabled={index===sections.length-1} onClick={()=>move(index,1)}><ArrowDown size={16}/></button>
    <button type="button" className="pc-danger" title="Remove section" onClick={()=>{if(confirm('Remove this section? Save to apply.'))onChange(sections.filter((_,i)=>i!==index))}}><Trash2 size={16}/></button>
   </div></div>
   <div className="pc-grid"><label>Section heading *<input required value={s.heading} onChange={e=>patch(index,{heading:e.target.value})} placeholder="Example: Our mission"/></label>
    <label>Category / section group<input value={s.category||''} onChange={e=>patch(index,{category:e.target.value})} placeholder="Example: Services, Awards, FAQ"/></label>
    <label>Small subheading / eyebrow<input value={s.eyebrow||''} onChange={e=>patch(index,{eyebrow:e.target.value})} placeholder="Example: WHY CHOOSE US"/></label>
    <label>Layout<select value={s.layout||'standard'} onChange={e=>patch(index,{layout:e.target.value as PageSection['layout']})}><option value="standard">Standard</option><option value="highlight">Highlighted</option><option value="split">Image + Text</option><option value="cards">Custom fields as cards</option></select></label>
    <label className="pc-wide">Description / page content<textarea rows={4} value={s.body||''} onChange={e=>patch(index,{body:e.target.value})}/></label>
    <label className="pc-wide">Section image<div className="pc-image-row"><input value={s.image_url||''} onChange={e=>patch(index,{image_url:e.target.value})} placeholder="Upload or paste HTTPS image URL"/><label className="pc-upload"><ImagePlus size={16}/>{uploading===s.id?'Uploading...':'Upload image'}<input type="file" accept="image/*" disabled={Boolean(uploading)} onChange={e=>void upload(index,e.target.files?.[0])}/></label></div>{s.image_url&&<img className="pc-image-preview" src={mediaUrl(s.image_url)} alt="Section preview"/>}</label>
    <label>Button label<input value={s.button_label||''} onChange={e=>patch(index,{button_label:e.target.value})} placeholder="Example: View projects"/></label>
    <label>Button link<input value={s.button_url||''} onChange={e=>patch(index,{button_url:e.target.value})} placeholder="/properties or https://..."/></label>
   </div>
   <div className="pc-gallery-section">
    <h3>Section gallery — photos & videos</h3><p>Add multiple files to a dedicated gallery below this section. Custom field galleries are edited separately inside each field.</p>
    <FieldImageEditor value={{gallery:s.gallery||[]}} galleryOnly onChange={change=>{if(change.gallery)patch(index,{gallery:change.gallery})}}/>
   </div>
   <div className="pc-custom-head"><strong>Custom fields in this section</strong><button type="button" onClick={()=>patch(index,{fields:[...(s.fields||[]),blankField()]})} disabled={(s.fields||[]).length>=30}><Plus size={15}/> Add custom field</button></div>
   {(s.fields||[]).map((field,fi)=>{
    const changeField=(change:Partial<PageCustomField>)=>patch(index,{fields:s.fields.map((f,i)=>i===fi?{...f,...change}:f)});
    return <div className="pc-field" key={field.id}>
      <label>Field name *<input required value={field.name} placeholder="Example: Warranty period" onChange={e=>changeField({name:e.target.value})}/></label>
      <label>Field type<select value={field.type} onChange={e=>changeField({type:e.target.value as PageCustomField['type'],value:''})}><option value="text">Text</option><option value="long_text">Long description</option><option value="number">Number</option><option value="date">Date</option><option value="yes_no">Yes / No</option><option value="list">List (one per line)</option></select></label>
      <label className="pc-field-value">Value{field.type==='long_text'||field.type==='list'?<textarea rows={3} value={Array.isArray(field.value)?field.value.join('\n'):field.value} onChange={e=>changeField({value:e.target.value})}/>:field.type==='yes_no'?<select value={String(field.value)} onChange={e=>changeField({value:e.target.value})}><option value="">Select</option><option value="true">Yes</option><option value="false">No</option></select>:<input type={field.type==='number'?'number':field.type==='date'?'date':'text'} value={String(field.value)} onChange={e=>changeField({value:e.target.value})}/>}</label>
      <FieldImageEditor value={field} onChange={change=>changeField(change)}/>
      <label className="pc-inline"><input type="checkbox" checked={field.show!==false} onChange={e=>changeField({show:e.target.checked})}/> Show publicly</label>
      <button type="button" className="pc-danger" title="Remove custom field" onClick={()=>patch(index,{fields:s.fields.filter((_,i)=>i!==fi)})}><Trash2 size={16}/></button>
    </div>;
   })}
   <label className="pc-inline"><input type="checkbox" checked={s.published!==false} onChange={e=>patch(index,{published:e.target.checked})}/> Publish this section on the website</label>
  </div>)}
  {uploadError&&<p className="pc-error" role="alert">{uploadError}</p>}
  <button className="pc-add" type="button" disabled={sections.length>=30} onClick={()=>onChange([...sections,blankSection()])}><Plus size={17}/> Add section or category</button>
 </div>;
}

export function ManageContent(){
 const access=useOutletContext<any>();
 const features=access?.features||{};
 const [form,setForm]=useState<any>(blank);
 const [services,setServices]=useState('');
 const [visibility,setVisibility]=useState<Record<string,boolean>>({home:true,about:true,contact:true,properties:true,civil_services:true,construction_works:true,interior_designs:true,lift_designs:true,custom_pages:true,custom_content_pages:true,foundation:true,gallery:true});
 const [sections,setSections]=useState<Record<string,PageSection[]>>({home:[],about:[],contact:[]});
 const [pages,setPages]=useState<PublishedPage[]>([]);
 const [tab,setTab]=useState('home');
 const [saving,setSaving]=useState(false);
 const [message,setMessage]=useState('');
 useEffect(()=>{getPageContent().then((response:any)=>{
   const data={...blank,...(response||{})};setForm(data);setVisibility({home:true,about:true,contact:true,properties:true,civil_services:true,construction_works:true,interior_designs:true,lift_designs:true,custom_pages:true,custom_content_pages:true,foundation:true,gallery:true,...(data.page_visibility||{})});setServices((data.home_services||[]).join('\n'));
   const raw=data.page_sections||{};setSections({home:(raw.home||[]).map(normalizeSection),about:(raw.about||[]).map(normalizeSection),contact:(raw.contact||[]).map(normalizeSection)});
   setPages(normalizePages(data.custom_content_pages));
 }).catch((err:any)=>setMessage(err.message))},[]);
 const setSectionRows=(page:string,rows:PageSection[])=>setSections(prev=>({...prev,[page]:rows}));
 const editPage=(index:number,patch:Partial<PublishedPage>)=>setPages(items=>items.map((p,i)=>i===index?{...p,...patch}:p));
 const addPage=()=>{const id=uid();setPages(items=>[...items,{id,slug:'',title:'',subtitle:'',menu_label:'',published:false,show_in_nav:true,sections:[]}]);setTab(`page:${id}`);setMessage('');};
 const save=async(event:FormEvent)=>{
   event.preventDefault();setSaving(true);setMessage('');
   try{
    const payload:any={home_title:form.home_title,home_subtitle:form.home_subtitle,page_visibility:visibility,page_sections:{home:sections.home||[]}};
    if(features.home_services)payload.home_services=services.split('\n').map(item=>item.trim()).filter(Boolean);
    if(features.about){Object.assign(payload,{about_title:form.about_title,about_text:form.about_text});payload.page_sections.about=sections.about||[]}
    if(features.contact){Object.assign(payload,{contact_title:form.contact_title,contact_text:form.contact_text});payload.page_sections.contact=sections.contact||[]}
    if(features.custom_content_pages){payload.custom_content_pages=pages.map(p=>({...p,slug:slugify(p.slug||p.title),menu_label:p.menu_label||p.title}))}
    await savePageContent(payload);setMessage('Website page content and custom sections saved successfully.');
   }catch(err:any){setMessage(err.message||'Save failed')}finally{setSaving(false)}
 };
 const pageIndex=pages.findIndex(p=>tab===`page:${p.id}`);
 return <><div className="admin-title"><span>WEBSITE CONTENT BUILDER</span><h1>Customize page content</h1><p>Create your own page sections, categories, field names, images and buttons. Changes appear on your public website after saving.</p></div>
 <form className="panel pc-editor" onSubmit={save}>
  <section className="pc-site-visibility"><h2>Website page availability</h2><p>Hide individual website pages without deleting their data. Master Admin permissions always take priority. A disabled page disappears from the public navigation.</p><div className="pc-visibility-grid">
  {([['home','Home'],['about','About Us'],['contact','Contact Us'],['properties','Properties'],['civil_services','Civil Works'],['construction_works','Construction Works'],['interior_designs','Interior Designs'],['lift_designs','Lift Designs'],['custom_pages','Master Admin-created Services'],['custom_content_pages','Custom Content Pages'],['foundation','Charity & Foundation Website'],['gallery','Gallery page']] as [string,string][]).filter(([key])=>key==='home'||features[key]).map(([key,label])=><label key={key} className="pc-site-visibility-item"><input type="checkbox" checked={visibility[key]!==false} onChange={e=>setVisibility(previous=>({...previous,[key]:e.target.checked}))}/><span>{label}<small>{visibility[key]!==false?'Active':'Inactive'}</small></span></label>)}
  </div></section>
  <div className="pc-tabs" role="tablist" aria-label="Choose a page to edit">
   <button type="button" className={tab==='home'?'active':''} onClick={()=>setTab('home')}>Home</button>
   {features.about&&<button type="button" className={tab==='about'?'active':''} onClick={()=>setTab('about')}>About Us</button>}
   {features.contact&&<button type="button" className={tab==='contact'?'active':''} onClick={()=>setTab('contact')}>Contact Us</button>}
   {features.custom_content_pages&&pages.map(p=><button type="button" key={p.id} className={tab===`page:${p.id}`?'active':''} onClick={()=>setTab(`page:${p.id}`)}>{p.title||'New Page'}</button>)}
   {features.custom_content_pages&&<button type="button" className="pc-new-page" onClick={addPage}><Plus size={15}/> New page</button>}
  </div>
  {tab==='home'&&<><h2>Home page</h2><label className="pc-inline pc-visibility-toggle"><input type="checkbox" checked={visibility.home!==false} onChange={e=>setVisibility(previous=>({...previous,home:e.target.checked}))}/> Page active on public website</label><div className="pc-grid"><label>Hero title<input value={form.home_title||''} onChange={e=>setForm({...form,home_title:e.target.value})}/></label><label>Hero subtitle<textarea rows={2} value={form.home_subtitle||''} onChange={e=>setForm({...form,home_subtitle:e.target.value})}/></label>{features.home_services&&<label className="pc-wide">Home services (one per line)<textarea rows={3} value={services} onChange={e=>setServices(e.target.value)}/></label>}</div><h3>Home custom page sections</h3><SectionsEditor sections={sections.home||[]} onChange={rows=>setSectionRows('home',rows)}/></>}
  {tab==='about'&&features.about&&<><h2>About Us page</h2><label className="pc-inline pc-visibility-toggle"><input type="checkbox" checked={visibility.about!==false} onChange={e=>setVisibility(previous=>({...previous,about:e.target.checked}))}/> Page active on public website</label><div className="pc-grid"><label>About title<input value={form.about_title||''} onChange={e=>setForm({...form,about_title:e.target.value})}/></label><label className="pc-wide">About description<textarea rows={4} value={form.about_text||''} onChange={e=>setForm({...form,about_text:e.target.value})}/></label></div><h3>About custom page sections</h3><SectionsEditor sections={sections.about||[]} onChange={rows=>setSectionRows('about',rows)}/></>}
  {tab==='contact'&&features.contact&&<><h2>Contact Us page</h2><label className="pc-inline pc-visibility-toggle"><input type="checkbox" checked={visibility.contact!==false} onChange={e=>setVisibility(previous=>({...previous,contact:e.target.checked}))}/> Page active on public website</label><div className="pc-grid"><label>Contact title<input value={form.contact_title||''} onChange={e=>setForm({...form,contact_title:e.target.value})}/></label><label className="pc-wide">Contact description<textarea rows={4} value={form.contact_text||''} onChange={e=>setForm({...form,contact_text:e.target.value})}/></label></div><p>The existing contact inquiry form remains on the page.</p><h3>Contact custom page sections</h3><SectionsEditor sections={sections.contact||[]} onChange={rows=>setSectionRows('contact',rows)}/></>}
  {pageIndex>=0&&features.custom_content_pages&&(()=>{const page=pages[pageIndex];return <><div className="pc-headrow"><h2>Custom website page</h2><button type="button" className="pc-danger" onClick={()=>{if(confirm('Delete this page? Save to apply.')){setPages(pages.filter(p=>p.id!==page.id));setTab('home')}}}><Trash2 size={17}/> Delete page</button></div>
   <div className="pc-grid"><label>Page title *<input required value={page.title} placeholder="Example: Our Team" onChange={e=>editPage(pageIndex,{title:e.target.value})}/></label>
    <label>URL slug *<input required value={page.slug} placeholder="our-team" onChange={e=>editPage(pageIndex,{slug:slugify(e.target.value)})}/><small>Public URL: /pages/{slugify(page.slug)||'your-page'}</small></label>
    <label>Navigation label<input value={page.menu_label||''} placeholder="Defaults to page title" onChange={e=>editPage(pageIndex,{menu_label:e.target.value})}/></label>
    <label className="pc-wide">Page subtitle<textarea rows={2} value={page.subtitle||''} onChange={e=>editPage(pageIndex,{subtitle:e.target.value})}/></label>
    <label className="pc-inline"><input type="checkbox" checked={page.published} onChange={e=>editPage(pageIndex,{published:e.target.checked})}/> Published</label>
    <label className="pc-inline"><input type="checkbox" checked={page.show_in_nav} onChange={e=>editPage(pageIndex,{show_in_nav:e.target.checked})}/> Show in website navigation</label>
   </div><h3>Page sections / custom categories</h3><SectionsEditor sections={page.sections||[]} onChange={rows=>editPage(pageIndex,{sections:rows})}/></>})()}
  {message&&<p className={message.toLowerCase().includes('success')?'pc-success':'pc-error'} role="status">{message}</p>}
  <div className="pc-save"><button type="submit" disabled={saving}><Save size={17}/>{saving?'Saving...':'Save all page content'}</button></div>
 </form></>;
}
