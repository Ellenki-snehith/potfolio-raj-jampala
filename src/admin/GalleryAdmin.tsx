import {useEffect,useState,type FormEvent} from 'react';
import {Link,useOutletContext} from 'react-router-dom';
import {ArrowDown,ArrowUp,ExternalLink,Film,ImagePlus,Plus,Save,Trash2} from 'lucide-react';
import {deleteSiteGalleryMedia,getSiteGallery,mediaUrl,reorderSiteGallery,saveSiteGallery,updateSiteGalleryMedia,uploadSiteGalleryMedia} from '../api';
import {FieldImageEditor} from './FieldImageEditor';
import type {PageCustomField} from '../components/SiteContentSections';
import './site-gallery-admin.css';

type MediaItem={id:string;url:string;title:string;description?:string;original_name?:string;media_type:'image'|'video';display_order:number;published:boolean};
const blank=()=>({title:'Our Gallery',description:'',items:[] as MediaItem[],fields:[] as PageCustomField[]});
const newField=():PageCustomField=>({id:`gallery-field-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,name:'',type:'text',value:'',show:true,image_url:'',image_align:'right',gallery:[]});

export function GalleryAdmin(){
 const user=useOutletContext<any>();
 const [data,setData]=useState(blank());
 const [loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[uploading,setUploading]=useState(false);
 const [busyItem,setBusyItem]=useState(''),[notice,setNotice]=useState(''),[error,setError]=useState('');
 const [selected,setSelected]=useState<File[]>([]);
 const [filter,setFilter]=useState<'all'|'image'|'video'>('all');
 const enabled=Boolean(user?.features?.gallery);
 const reload=async()=>{const result:any=await getSiteGallery();setData({...blank(),...result,items:result?.items||[],fields:result?.fields||[]});};
 useEffect(()=>{
  if(!enabled){setLoading(false);return;}
  let active=true;
  getSiteGallery().then((result:any)=>{if(active)setData({...blank(),...result,items:result?.items||[],fields:result?.fields||[]});})
   .catch((e:any)=>{if(active)setError(e.message||'Gallery could not be loaded');})
   .finally(()=>{if(active)setLoading(false)});
  return()=>{active=false};
 },[enabled]);
 const saveSettings=async(e:FormEvent)=>{
  e.preventDefault();setSaving(true);setError('');setNotice('');
  try{
   if(data.fields.some(f=>!f.name.trim()))throw new Error('Each custom field needs a name.');
   const saved:any=await saveSiteGallery({title:data.title,description:data.description,fields:data.fields});
   setData(old=>({...old,title:saved.title,description:saved.description,fields:saved.fields||[]}));
   setNotice('Gallery page content saved.');
  }catch(e:any){setError(e.message||'Unable to save gallery details');}finally{setSaving(false)}
 };
 const upload=async()=>{
  if(!selected.length)return;
  setUploading(true);setError('');setNotice('');let done=0;
  try{
   for(const file of selected){
    const allowed=/\.(jpe?g|png|webp|gif|avif|mp4|webm|mov|m4v)$/i.test(file.name);
    if(!allowed)throw new Error(`Unsupported file: ${file.name}`);
    const payload=new FormData();payload.append('file',file);
    await uploadSiteGalleryMedia(payload);done++;
   }
   setSelected([]);setNotice(`${done} gallery file(s) uploaded successfully.`);
  }catch(e:any){setError(`${done} file(s) uploaded. ${e.message||'Upload failed'}`)}
  finally{try{await reload()}catch(e:any){setError(e.message||'Could not refresh gallery')}setUploading(false)}
 };
 const update=async(id:string,body:Partial<MediaItem>)=>{
  setBusyItem(id);setError('');setNotice('');
  try{await updateSiteGalleryMedia(id,body);await reload();setNotice('Gallery item updated.');}
  catch(e:any){setError(e.message||'Gallery update failed')}
  finally{setBusyItem('')}
 };
 const move=async(item:MediaItem,step:number)=>{
  const ordered=[...data.items].sort((a,b)=>a.display_order-b.display_order);
  const index=ordered.findIndex(x=>x.id===item.id),destination=index+step;
  if(destination<0||destination>=ordered.length)return;
  [ordered[index],ordered[destination]]=[ordered[destination],ordered[index]];
  setBusyItem(item.id);setError('');
  try{await reorderSiteGallery(ordered.map(row=>row.id));await reload();setNotice('Gallery order updated.');}
  catch(e:any){setError(e.message||'Could not reorder gallery');await reload().catch(()=>{})}
  finally{setBusyItem('')}
 };
 const remove=async(item:MediaItem)=>{
  if(!window.confirm(`Remove ${item.title||'this media'} from the website Gallery?`))return;
  setBusyItem(item.id);setError('');
  try{await deleteSiteGalleryMedia(item.id);await reload();setNotice('Gallery media removed.');}
  catch(e:any){setError(e.message||'Unable to delete gallery media')}
  finally{setBusyItem('')}
 };
 const patchField=(index:number,patch:Partial<PageCustomField>)=>setData(old=>({...old,fields:old.fields.map((f,i)=>i===index?{...f,...patch}:f)}));
 if(!enabled)return <div className="panel"><h2>Gallery is not enabled</h2><p>Ask Master Admin to enable the Gallery page for your organization.</p></div>;
 if(loading)return <div className="state">Loading website gallery…</div>;
 const ordered=[...data.items].sort((a,b)=>a.display_order-b.display_order);
 const visible=ordered.filter(m=>filter==='all'||m.media_type===filter);
 return <div className="site-gallery-admin">
  <div className="admin-title"><span>WEBSITE PAGES · GALLERY</span><h1>Gallery page</h1><p>Manage one dedicated gallery for the whole organization, like the About Us page. This is independent from individual property and service galleries.</p>
   <Link className="site-gallery-view" to="/gallery" target="_blank" rel="noopener noreferrer"><ExternalLink size={16}/> View public Gallery</Link>
  </div>
  {error&&<p className="panel site-gallery-alert" role="alert">{error}</p>}
  {notice&&<p className="panel site-gallery-success" role="status">{notice}</p>}
  <form className="panel site-gallery-settings" onSubmit={saveSettings}>
   <h2>Gallery page details</h2>
   <label>Page heading<input required maxLength={160} value={data.title} onChange={e=>setData({...data,title:e.target.value})}/></label>
   <label>Description<textarea rows={3} maxLength={3000} value={data.description} onChange={e=>setData({...data,description:e.target.value})}/></label>
   <div className="site-gallery-section-heading"><h3>Optional custom fields</h3><button type="button" className="site-gallery-secondary" disabled={data.fields.length>=30} onClick={()=>setData(old=>({...old,fields:[...old.fields,newField()]}))}><Plus size={15}/> Add custom field</button></div>
   <p className="site-gallery-hint">Custom fields can have descriptions, their own image on the left or right, and their own photo/video gallery.</p>
   {data.fields.map((field,index)=><div className="site-gallery-field" key={field.id}>
    <div className="site-gallery-field-head"><strong>Custom field {index+1}</strong><button type="button" className="site-gallery-danger" onClick={()=>setData(old=>({...old,fields:old.fields.filter((_,i)=>i!==index)}))}><Trash2 size={15}/> Remove</button></div>
    <div className="site-gallery-row"><label>Field name<input maxLength={110} required value={field.name} onChange={e=>patchField(index,{name:e.target.value})}/></label>
    <label>Field type<select value={field.type} onChange={e=>patchField(index,{type:e.target.value as PageCustomField['type'],value:''})}><option value="text">Text</option><option value="long_text">Long description</option><option value="number">Number</option><option value="date">Date</option><option value="yes_no">Yes / No</option></select></label></div>
    <label>Value{field.type==='long_text'?<textarea rows={3} value={String(field.value||'')} onChange={e=>patchField(index,{value:e.target.value})}/>:<input type={field.type==='date'?'date':field.type==='number'?'number':'text'} value={String(field.value||'')} onChange={e=>patchField(index,{value:e.target.value})}/>}</label>
    <label className="site-gallery-checkbox"><input type="checkbox" checked={field.show!==false} onChange={e=>patchField(index,{show:e.target.checked})}/> Show on public Gallery page</label>
    <FieldImageEditor value={field} onChange={patch=>patchField(index,patch)}/>
   </div>)}
   <button type="submit" className="site-gallery-primary" disabled={saving}><Save size={16}/>{saving?'Saving…':'Save gallery page details'}</button>
  </form>
  <section className="panel site-gallery-uploads">
   <h2>Gallery photos & videos</h2><p className="site-gallery-hint">Choose several files at once. Uploaded images appear in a responsive grid on your public Gallery page. Files are stored in OneDrive.</p>
   <label className="site-gallery-drop"><ImagePlus size={26}/><strong>Select gallery images and videos</strong><small>JPG, PNG, WebP, AVIF, GIF, MP4, WebM or MOV — up to the backend file-size limit each.</small>
    <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime" disabled={uploading} onChange={e=>setSelected(Array.from(e.target.files||[]))}/>
   </label>
   {selected.length>0&&<p className="site-gallery-hint">Selected: {selected.map(f=>f.name).join(', ')}</p>}
   <button type="button" className="site-gallery-primary" disabled={uploading||selected.length===0} onClick={()=>void upload()}><ImagePlus size={17}/>{uploading?'Uploading…':`Upload ${selected.length} file(s)`}</button>
  </section>
  <section className="site-gallery-list">
   <div className="site-gallery-section-heading"><h2>Uploaded media ({ordered.length})</h2><div className="site-gallery-filters"><button type="button" aria-pressed={filter==='all'} onClick={()=>setFilter('all')}>All</button><button type="button" aria-pressed={filter==='image'} onClick={()=>setFilter('image')}>Photos</button><button type="button" aria-pressed={filter==='video'} onClick={()=>setFilter('video')}>Videos</button></div></div>
   <div className="site-gallery-admin-grid">{visible.map(item=>{
    const index=ordered.findIndex(m=>m.id===item.id);
    return <article className="panel site-gallery-card" key={item.id}>
     <div className="site-gallery-preview">{item.media_type==='video'?<video controls preload="metadata" src={mediaUrl(item.url)}/>:<img src={mediaUrl(item.url)} alt={item.title||'Gallery image'} loading="lazy"/>}<span><Film size={13}/>{item.media_type}</span></div>
     <div className="site-gallery-card-fields">
      <label>Title<input key={`${item.id}-title-${item.title}`} defaultValue={item.title||''} maxLength={150} disabled={busyItem===item.id} onBlur={e=>{if(e.target.value!==item.title)void update(item.id,{title:e.target.value})}}/></label>
      <label>Description<textarea key={`${item.id}-desc-${item.description||''}`} defaultValue={item.description||''} maxLength={2000} rows={2} disabled={busyItem===item.id} onBlur={e=>{if(e.target.value!==(item.description||''))void update(item.id,{description:e.target.value})}}/></label>
      <label className="site-gallery-checkbox"><input type="checkbox" disabled={!!busyItem} checked={item.published!==false} onChange={e=>void update(item.id,{published:e.target.checked})}/> Show on website</label>
      <div className="site-gallery-card-actions"><button type="button" title="Move earlier" disabled={!!busyItem||index===0} onClick={()=>void move(item,-1)}><ArrowUp size={16}/></button><button type="button" title="Move later" disabled={!!busyItem||index===ordered.length-1} onClick={()=>void move(item,1)}><ArrowDown size={16}/></button><button type="button" className="site-gallery-danger" disabled={!!busyItem} onClick={()=>void remove(item)}><Trash2 size={16}/> Delete</button></div>
     </div>
    </article>
   })}</div>
   {!visible.length&&<div className="panel site-gallery-empty">{ordered.length?'No media matches this filter.':'No gallery files uploaded yet. Add your first photos or videos above.'}</div>}
  </section>
 </div>;
}
