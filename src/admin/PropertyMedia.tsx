import {useEffect,useState,type FormEvent} from 'react';
import {Link,useParams} from 'react-router-dom';
import {ArrowLeft,ExternalLink,File,FileText,Image,Save,Star,Trash2,Upload,Video} from 'lucide-react';
import {deletePropertyMedia,listItems,mediaUrl,propertyMedia,updatePropertyMedia,uploadPropertyMedia,constructionMedia,uploadConstructionMedia,updateConstructionMedia,deleteConstructionMedia,civilMedia,uploadCivilMedia,updateCivilMedia,deleteCivilMedia,interiorMedia,uploadInteriorMedia,updateInteriorMedia,deleteInteriorMedia,liftMedia,uploadLiftMedia,updateLiftMedia,deleteLiftMedia} from '../api';

const bytes=(value:number)=>value>1024*1024?`${(value/1024/1024).toFixed(1)} MB`:`${Math.max(1,Math.round(value/1024))} KB`;
function Preview({item}:{item:any}){const url=mediaUrl(item.url);if(item.media_type==='image')return <img src={url} alt={item.title}/>;if(item.media_type==='video')return <video src={url} controls preload="metadata"/>;return <div className="file-preview">{item.media_type==='document'?<FileText/>:<File/>}<span>{item.original_name}</span></div>}

export function PropertyMedia({kind='property'}:{kind?:'property'|'construction'|'civil'|'interior'|'lift'}){
  const {propertyId='',workId='',serviceId='',designId='',liftId=''}=useParams();
  const isConstruction=kind==='construction', isCivil=kind==='civil', isInterior=kind==='interior', isLift=kind==='lift', listingId=isLift?liftId:isInterior?designId:isCivil?serviceId:isConstruction?workId:propertyId;
  const mediaApi=isLift?liftMedia:isInterior?interiorMedia:isCivil?civilMedia:isConstruction?constructionMedia:propertyMedia;
  const uploadApi=isLift?uploadLiftMedia:isInterior?uploadInteriorMedia:isCivil?uploadCivilMedia:isConstruction?uploadConstructionMedia:uploadPropertyMedia;
  const updateApi=isLift?updateLiftMedia:isInterior?updateInteriorMedia:isCivil?updateCivilMedia:isConstruction?updateConstructionMedia:updatePropertyMedia;
  const deleteApi=isLift?deleteLiftMedia:isInterior?deleteInteriorMedia:isCivil?deleteCivilMedia:isConstruction?deleteConstructionMedia:deletePropertyMedia;
  const [property,setProperty]=useState<any>();
  const [items,setItems]=useState<any[]>([]);
  const [drafts,setDrafts]=useState<Record<string,any>>({});
  const [files,setFiles]=useState<File[]>([]);
  const [description,setDescription]=useState('');
  const [displayOrder,setDisplayOrder]=useState(0);
  const [cover,setCover]=useState(false);
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  const load=async()=>{const [properties,media]:any=await Promise.all([listItems(isLift?'lift_designs':isInterior?'interior_designs':isCivil?'civil_services':isConstruction?'construction_works':'properties'),mediaApi(listingId)]);setProperty(properties.find((item:any)=>item.id===listingId));setItems(media);setDrafts(Object.fromEntries(media.map((item:any)=>[item.id,{title:item.title||'',description:item.description||'',display_order:item.display_order||0,published:item.published!==false,is_cover:Boolean(item.is_cover)}])))};
  useEffect(()=>{load().catch(error=>setMessage(error.message))},[listingId,kind]);
  const upload=async(event:FormEvent)=>{event.preventDefault();if(!files.length)return;setBusy(true);setMessage('');try{for(let index=0;index<files.length;index++){const data=new FormData();data.append('file',files[index]);data.append('title',files[index].name);data.append('description',description);data.append('display_order',String(displayOrder+index));data.append('published','true');data.append('is_cover',String(cover&&index===0));await uploadApi(listingId,data)}setFiles([]);setDescription('');setCover(false);setMessage('Media uploaded successfully.');await load()}catch(error:any){setMessage(error.message)}finally{setBusy(false)}};
  const save=async(item:any)=>{try{await updateApi(listingId,item.id,{...drafts[item.id],display_order:Number(drafts[item.id].display_order||0)});setMessage('Media details updated.');await load()}catch(error:any){setMessage(error.message)}};
  return <>
    <div className="admin-title"><Link className="back-link" to={isLift?'/control/lift-designs':isInterior?'/control/interior-designs':isCivil?'/control/civil-services':isConstruction?'/control/construction-works':'/control/properties'}><ArrowLeft/> {isLift?'Lift Designs':isInterior?'Interior Designs':isCivil?'Civil services':isConstruction?'Construction Works':'Properties'}</Link><span>{isLift?'LIFT PROJECT MEDIA':isInterior?'INTERIOR PROJECT MEDIA':isCivil?'COMPLETED CIVIL WORK':isConstruction?'CONSTRUCTION MEDIA':'PROPERTY MEDIA'}</span><h1>{property?.title||property?.name||'Gallery'}</h1><p>Upload and organize multiple photos, videos, brochures, floor plans, legal documents and drawings.</p></div>
    <form className="panel property-media-upload" onSubmit={upload}>
      <label className="media-drop"><Upload/><b>Select multiple files</b><small>Images, videos, PDF/Office files, DWG/DXF/SKP drawings and ZIP archives · maximum 100 MB each</small><input type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.dwg,.dxf,.skp,.zip,.rar,.7z" onChange={event=>setFiles(Array.from(event.target.files||[]))}/></label>
      {files.length>0&&<div className="selected-files">{files.map(file=><span key={`${file.name}-${file.lastModified}`}>{file.name} <small>{bytes(file.size)}</small></span>)}</div>}
      <label>Description for this upload batch<textarea value={description} onChange={event=>setDescription(event.target.value)}/></label>
      <label>Starting display order<input type="number" value={displayOrder} onChange={event=>setDisplayOrder(Number(event.target.value))}/></label>
      <label className="check"><input type="checkbox" checked={cover} onChange={event=>setCover(event.target.checked)}/> Make the first selected image the cover</label>
      <button disabled={!files.length||busy}>{busy?'Uploading…':`Upload ${files.length||''} file${files.length===1?'':'s'}`}</button>
    </form>
    {message&&<p className="panel status-message media-status">{message}</p>}
    <h2 style={{marginTop:24}}>Gallery — photos, videos & documents</h2>
    <section className="property-media-grid">
      {items.map(item=>{const draft=drafts[item.id]||item;return <article className="panel property-media-card" key={item.id}><div className="media-admin-preview"><Preview item={item}/>{item.is_cover&&<span className="cover-badge"><Star/> Cover</span>}<span className="type-badge">{item.media_type==='image'?<Image/>:item.media_type==='video'?<Video/>:<FileText/>}{item.media_type}</span></div><div className="media-edit-fields"><label>Title<input value={draft.title||''} onChange={event=>setDrafts({...drafts,[item.id]:{...draft,title:event.target.value}})}/></label><label>Description<textarea value={draft.description||''} onChange={event=>setDrafts({...drafts,[item.id]:{...draft,description:event.target.value}})}/></label><label>Display order<input type="number" value={draft.display_order||0} onChange={event=>setDrafts({...drafts,[item.id]:{...draft,display_order:event.target.value}})}/></label><div className="media-checks"><label className="check"><input type="checkbox" checked={draft.published!==false} onChange={event=>setDrafts({...drafts,[item.id]:{...draft,published:event.target.checked}})}/> Published</label>{item.media_type==='image'&&<label className="check"><input type="checkbox" checked={Boolean(draft.is_cover)} onChange={event=>setDrafts({...drafts,[item.id]:{...draft,is_cover:event.target.checked}})}/> Cover</label>}</div><small>{item.original_name} · {bytes(item.size_bytes||0)}</small><div className="media-actions"><button onClick={()=>save(item)}><Save/> Save</button><a href={mediaUrl(item.url)} target="_blank" rel="noreferrer"><ExternalLink/> Open</a><button className="danger" onClick={async()=>{if(confirm('Delete this media file?')){await deleteApi(listingId,item.id);await load()}}}><Trash2/> Delete</button></div></div></article>})}
      {!items.length&&<div className="panel empty">No media uploaded yet.</div>}
    </section>
  </>;
}
