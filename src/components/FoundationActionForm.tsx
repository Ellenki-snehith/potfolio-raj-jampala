import {useEffect, useMemo, useState, type FormEvent} from 'react';
import {
  ArrowRight, CalendarDays, HandHeart, HeartHandshake,
  HelpCircle, MailCheck, Users, CheckCircle2,
} from 'lucide-react';
import {foundationSubmit} from '../api';

/**
 * Context-aware public submission panel.
 * All submissions continue through the existing Foundation API and Lead Inbox.
 * Extra page-specific answers are written into message (not thrown away by
 * the current backend validator), while linked records use entry_id.
 */
export type FoundationActionSlug =
  | 'our-causes' | 'our-projects' | 'events'
  | 'donate' | 'volunteer' | 'request-help';

type ChoiceOptions = {volunteerRoles?: string[]; helpCategories?: string[]};
type EntryChoice = {id: string; title: string};

type Props = {
  slug: FoundationActionSlug;
  entryId?: string;
  entryTitle?: string;
  entries?: EntryChoice[];
  choiceOptions?: ChoiceOptions;
  guidance?: string;
};

type FormValues = {
  name: string;
  phone: string;
  email: string;
  message: string;
  interest: string;
  availability: string;
  help_category: string;
  donation_amount_interest: string;
  participants: string;
  purpose: string;
  skills: string;
  district: string;
  frequency: string;
  consent: boolean;
  website: string;
};

const blank = (): FormValues => ({
  name:'', phone:'', email:'', message:'', interest:'', availability:'',
  help_category:'', donation_amount_interest:'', participants:'', purpose:'',
  skills:'', district:'', frequency:'', consent:false, website:'',
});

type FormConfig = {
  eyebrow: string;
  title: string;
  description: string;
  button: string;
  messageLabel: string;
  kind: 'inquiry' | 'volunteer' | 'help' | 'donation_interest';
  icon: 'cause' | 'project' | 'event' | 'donate' | 'volunteer' | 'help';
};

const config: Record<FoundationActionSlug, FormConfig> = {
  'our-causes': {
    eyebrow:'SUPPORT A CAUSE', title:'Get involved in this cause',
    description:'Tell us which welfare program interests you and how you would like to contribute.',
    button:'Send cause enquiry', messageLabel:'Your question or how you would like to help',
    kind:'inquiry', icon:'cause',
  },
  'our-projects': {
    eyebrow:'PROJECT COLLABORATION', title:'Enquire about a project',
    description:'Ask about a project, provide resources, or discuss a possible collaboration.',
    button:'Send project enquiry', messageLabel:'Describe your project enquiry',
    kind:'inquiry', icon:'project',
  },
  events: {
    eyebrow:'EVENT PARTICIPATION', title:'Register your interest in an event',
    description:'Choose an event and tell us how you would like to participate. Our team will confirm the arrangements.',
    button:'Send event request', messageLabel:'Questions or special requirements (optional)',
    kind:'inquiry', icon:'event',
  },
  donate: {
    eyebrow:'SUPPORT OUR WORK', title:'Ask about making a donation',
    description:'Request guidance about a campaign or recurring contribution. Do not share payment card or banking credentials.',
    button:'Send donation enquiry', messageLabel:'Your donation questions (optional)',
    kind:'donation_interest', icon:'donate',
  },
  volunteer: {
    eyebrow:'BECOME A VOLUNTEER', title:'Volunteer registration',
    description:'Share your preferred role, availability, and skills. We will contact you about suitable opportunities.',
    button:'Submit volunteer application', messageLabel:'Why would you like to volunteer? (optional)',
    kind:'volunteer', icon:'volunteer',
  },
  'request-help': {
    eyebrow:'REQUEST ASSISTANCE', title:'Apply for foundation support',
    description:'Choose an assistance program and describe your situation briefly. Our team will review your request privately.',
    button:'Submit assistance request', messageLabel:'Describe the assistance you need *',
    kind:'help', icon:'help',
  },
};

const purposeOptions: Partial<Record<FoundationActionSlug, string[]>> = {
  'our-causes': [
    'Learn more about this program', 'Volunteer for this cause',
    'Contribute materials or supplies', 'Sponsor this cause', 'Discuss a partnership',
  ],
  'our-projects': [
    'Request project details', 'Partner on this project',
    'Sponsor or donate resources', 'Visit the project', 'Request a progress update',
  ],
  events: [
    'Attend the event', 'Volunteer at the event',
    'Support or sponsor the event', 'Ask the event organizer',
  ],
};

const clip = (value: string, max: number) => value.trim().slice(0,max);

function ActionIcon({icon}:{icon:FormConfig['icon']}) {
  const props = {size:27, strokeWidth:1.8};
  if(icon==='event') return <CalendarDays {...props}/>;
  if(icon==='volunteer') return <Users {...props}/>;
  if(icon==='help') return <HelpCircle {...props}/>;
  if(icon==='project') return <CheckCircle2 {...props}/>;
  if(icon==='donate') return <HeartHandshake {...props}/>;
  return <HandHeart {...props}/>;
}

export function FoundationActionForm({
  slug, entryId='', entryTitle='', entries=[], choiceOptions={}, guidance,
}:Props) {
  const settings=config[slug];
  const [open,setOpen]=useState(slug==='volunteer'||slug==='request-help');
  const [fields,setFields]=useState<FormValues>(blank);
  const [selectedEntry,setSelectedEntry]=useState(entryId);
  const [saving,setSaving]=useState(false);
  const [notice,setNotice]=useState('');
  const [error,setError]=useState('');

  const validEntries=useMemo(()=>entries.filter(e=>e.id&&e.title),[entries]);
  useEffect(()=>{setSelectedEntry(entryId);setFields(blank());setNotice('');setError('');
    setOpen(slug==='volunteer'||slug==='request-help');},[slug,entryId]);
  const set=<K extends keyof FormValues>(key:K, value:FormValues[K])=>
    setFields(old=>({...old,[key]:value}));

  const currentTitle=entryTitle||validEntries.find(e=>e.id===selectedEntry)?.title||'';
  const choices=slug==='volunteer'
    ? (validEntries.length?validEntries.map(e=>({label:e.title,value:e.id})):
        (choiceOptions.volunteerRoles||[]).map(role=>({label:role,value:role})))
    : validEntries.map(e=>({label:e.title,value:e.id}));

  const submit=async(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    if(saving)return;
    setSaving(true);setError('');setNotice('');
    try{
      const extra:[string,string][]=[];
      if(fields.purpose)extra.push(['Participation / support type',fields.purpose]);
      if(fields.participants)extra.push(['Number of participants',fields.participants]);
      if(fields.skills)extra.push(['Skills',fields.skills]);
      if(fields.district)extra.push(['Area / district',fields.district]);
      if(fields.frequency)extra.push(['Contribution preference',fields.frequency]);
      if(currentTitle)extra.push(['Selected program / project',currentTitle]);
      const annotated=[...extra.map(([k,v])=>`${k}: ${clip(v,180)}`)];
      if(fields.message.trim())annotated.push(`Message: ${clip(fields.message,1600)}`);
      const message=annotated.join('\n').slice(0,3000);
      const linkedEntry=entryId||((validEntries.some(e=>e.id===selectedEntry))?selectedEntry:'');
      const res:{reference_id?:string}=await foundationSubmit({
        name:fields.name.trim(),phone:fields.phone.trim(),email:fields.email.trim(),
        message,kind:settings.kind,page_slug:slug,entry_id:linkedEntry,
        interest:settings.kind==='volunteer'?(fields.interest||currentTitle).slice(0,200):fields.interest,availability:fields.availability,
        help_category:fields.help_category,
        donation_amount_interest:fields.donation_amount_interest,
        consent:fields.consent,website:fields.website,
      });
      setNotice(`Your ${settings.kind==='volunteer'?'application':'request'} was received.${res.reference_id?` Reference: ${res.reference_id}`:''}`);
      setFields(blank());
      if(!entryId)setSelectedEntry('');
    }catch(err:any){setError(err?.message||'We could not submit the form. Please try again.');}
    finally{setSaving(false);}
  };

  return <section className={`fo-purpose-panel fo-purpose-${slug}`} id="foundation-action" aria-label={settings.title}>
    <aside className="fo-purpose-intro">
      <div className="fo-purpose-icon"><ActionIcon icon={settings.icon}/></div>
      <span className="fo-eyebrow">{settings.eyebrow}</span>
      <h2>{entryTitle?`${settings.title}: ${entryTitle}`:settings.title}</h2>
      <p>{guidance||settings.description}</p>
      {slug==='donate'&&<p className="fo-purpose-small">This is an enquiry only; payments are completed through the foundation's official donation link.</p>}
      {slug==='request-help'&&<p className="fo-purpose-small">Please do not enter Aadhaar numbers, medical records, financial account details or other sensitive documents.</p>}
      {!open&&<button className="fo-button" type="button" onClick={()=>setOpen(true)} aria-expanded={false}>
        {settings.button}<ArrowRight size={16}/>
      </button>}
    </aside>
    {open&&<form className="fo-purpose-form" onSubmit={submit}>
      <div className="fo-purpose-form-heading"><h3>{settings.button}</h3>
        {slug!=='volunteer'&&slug!=='request-help'&&<button className="fo-purpose-close" type="button" onClick={()=>setOpen(false)}>Close form</button>}
      </div>
      <div className="fo-purpose-form-grid">
        {choices.length>0&&!entryId&&<label className="fo-field-full">
          {slug==='events'?'Select an event':slug==='volunteer'?'Preferred volunteer opportunity':slug==='donate'?'Donation campaign':slug==='request-help'?'Assistance program':slug==='our-causes'?'Choose a cause':'Choose a project'}
          <select value={selectedEntry||(!validEntries.length&&slug==='volunteer'?fields.interest:'')}
            onChange={e=>{
              if(!validEntries.length&&slug==='volunteer')set('interest',e.target.value);
              else setSelectedEntry(e.target.value);
            }}>
            <option value="">Select an option (optional)</option>
            {choices.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </label>}
        <label>Your name *<input required autoComplete="name" maxLength={120} value={fields.name} onChange={e=>set('name',e.target.value)}/></label>
        <label>Phone number *<input required type="tel" autoComplete="tel" inputMode="tel" minLength={7} maxLength={30} value={fields.phone} onChange={e=>set('phone',e.target.value)}/></label>
        <label className="fo-field-full">Email (optional)<input type="email" autoComplete="email" maxLength={200} value={fields.email} onChange={e=>set('email',e.target.value)}/></label>
        {purposeOptions[slug]&&<label className="fo-field-full">{slug==='events'?'How will you participate?':'How would you like to get involved?'}
          <select value={fields.purpose} onChange={e=>set('purpose',e.target.value)}><option value="">Choose an option</option>
            {purposeOptions[slug]!.map(choice=><option key={choice} value={choice}>{choice}</option>)}
          </select>
        </label>}
        {slug==='events'&&<label>Expected participants
          <input min={1} max={10000} type="number" inputMode="numeric" placeholder="1" value={fields.participants} onChange={e=>set('participants',e.target.value)}/>
        </label>}
        {slug==='volunteer'&&<>
          {!entryId&&validEntries.length===0&&!(choiceOptions.volunteerRoles||[]).length&&<label className="fo-field-full">Preferred role / area of interest
            <input maxLength={200} placeholder="Teaching, health camps, event coordination..." value={fields.interest} onChange={e=>set('interest',e.target.value)}/>
          </label>}
          <label>Availability
            <input maxLength={200} placeholder="Weekends, weekdays, flexible..." value={fields.availability} onChange={e=>set('availability',e.target.value)}/>
          </label>
          <label>Relevant skills (optional)
            <input maxLength={200} placeholder="Communication, teaching, logistics..." value={fields.skills} onChange={e=>set('skills',e.target.value)}/>
          </label>
        </>}
        {slug==='request-help'&&<>
          <label className="fo-field-full">Assistance category *
            <select required value={fields.help_category} onChange={e=>set('help_category',e.target.value)}>
              <option value="">Choose an assistance category</option>
              {(choiceOptions.helpCategories?.length?choiceOptions.helpCategories:['Education','Healthcare','Food and essentials','Disaster relief','Other assistance']).map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="fo-field-full">Area / district (optional)
            <input maxLength={150} value={fields.district} onChange={e=>set('district',e.target.value)} placeholder="Where assistance is needed"/>
          </label>
        </>}
        {slug==='donate'&&<>
          <label>Indicative amount (optional)
            <input maxLength={100} inputMode="decimal" placeholder="₹1,000" value={fields.donation_amount_interest} onChange={e=>set('donation_amount_interest',e.target.value)}/>
          </label>
          <label>Donation preference
            <select value={fields.frequency} onChange={e=>set('frequency',e.target.value)}>
              <option value="">Select preference</option><option>One-time</option><option>Monthly</option><option>Corporate sponsorship</option><option>In-kind contribution</option>
            </select>
          </label>
        </>}
        <label className="fo-field-full">{settings.messageLabel}
          <textarea rows={4} maxLength={1600} required={slug==='request-help'}
            placeholder={slug==='request-help'?'Explain what assistance is needed, without sensitive personal information...':slug==='volunteer'?'Tell us about your interest and experience...':'Add any details that will help us respond...'}
            value={fields.message} onChange={e=>set('message',e.target.value)}/>
        </label>
      </div>
      <input className="fo-honeypot" autoComplete="off" tabIndex={-1} aria-hidden="true" value={fields.website} onChange={e=>set('website',e.target.value)}/>
      <label className="fo-purpose-consent"><input type="checkbox" required checked={fields.consent} onChange={e=>set('consent',e.target.checked)}/>
        <span>I agree to be contacted by the foundation about this {slug==='request-help'?'assistance request':slug==='volunteer'?'volunteer application':'enquiry'}.</span>
      </label>
      <button className="fo-button" disabled={saving} type="submit">{saving?'Sending…':settings.button}<ArrowRight size={16}/></button>
      {notice&&<p className="fo-success-message" role="status"><MailCheck size={18}/>{notice}</p>}
      {error&&<p className="fo-error" role="alert">{error}</p>}
    </form>}
  </section>;
}
