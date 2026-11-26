import {useEffect,useRef,useState} from 'react';
import {NavLink,Outlet,useNavigate} from 'react-router-dom';
import {Building2,LayoutDashboard,Home,HardHat,Paintbrush,FileText,MessageSquare,Users,LogOut,Menu,Layers3,HeartHandshake,Images} from 'lucide-react';
import {dashboard,logout,me,customPageTypes,getLoginActivity,recordLoginActivity} from '../api';

export function AdminLayout(){
  const [user,setUser]=useState<any>();
  const [open,setOpen]=useState(false);
  const [serviceTypes,setServiceTypes]=useState<any[]>([]);
  const [serviceError,setServiceError]=useState('');
  const navigate=useNavigate();
  const navigateRef=useRef(navigate);
  navigateRef.current=navigate;

  useEffect(()=>{
    (async()=>{
      try{
        const identity:any=await me();
        if(identity.role==='organization_admin'){
          const details:any=await dashboard();
          setUser({...identity,organization:details.organization,features:details.organization?.features||{}});
          if(details.organization?.features?.custom_pages){
            // API returns only active templates that Master Admin granted to this organization.
            try {
              const assigned:any=await customPageTypes();
              setServiceTypes(Array.isArray(assigned)?assigned:[]);
            } catch (error:any) {setServiceTypes([]);setServiceError(error?.message||'Custom Services could not load');}
          }
        }else setUser(identity);
      }catch{
        navigate('/login');
      }
    })();
  },[navigate]);

  // One-hour inactivity logout. The database also enforces this independently,
  // so a closed, suspended or manipulated tab cannot keep an expired login valid.
  useEffect(()=>{
    const IDLE_MS=60*60*1000;
    const HEARTBEAT_MS=5*60*1000;
    let lastActivity=Date.now();
    let lastReset=0;
    let idleTimer:ReturnType<typeof setTimeout>;
    const latestActivity=()=>Math.max(lastActivity,getLoginActivity());
    const signOut=()=>{
      // Don't revoke the same server session from an idle background tab when
      // another tab may be in use. PostgreSQL itself enforces the idle limit.
      localStorage.removeItem('re_access_token');
      localStorage.removeItem('re_last_activity');
      navigateRef.current('/login',{replace:true});
    };
    const check=()=>{
      const remaining=IDLE_MS-(Date.now()-latestActivity());
      if(remaining<=0){signOut();return;}
      idleTimer=setTimeout(check,remaining);
    };
    const activity=()=>{
      if(Date.now()-latestActivity()>=IDLE_MS){signOut();return;}
      lastActivity=Date.now();
      // Avoid clearing/recreating timers on every mouse movement pixel.
      if(Date.now()-lastReset>=15000){
        lastReset=Date.now();recordLoginActivity();clearTimeout(idleTimer);check();
      }
    };
    const verifyVisibility=()=>{if(document.visibilityState==='visible')checkAfterPause();};
    const checkAfterPause=()=>{clearTimeout(idleTimer);check();};
    const onExpired=()=>navigateRef.current('/login',{replace:true});
    const onStorage=(event:StorageEvent)=>{
      if(event.key==='re_access_token'&&!event.newValue)onExpired();
      if(event.key==='re_last_activity'&&event.newValue){clearTimeout(idleTimer);check();}
    };
    idleTimer=setTimeout(check,IDLE_MS);
    ['pointerdown','pointermove','keydown','touchstart','scroll'].forEach(name=>
      window.addEventListener(name,activity,{passive:true}));
    document.addEventListener('visibilitychange',verifyVisibility);
    window.addEventListener('re-session-expired',onExpired);
    window.addEventListener('storage',onStorage);
    // An actively used editor may have no API requests for a long period.
    // Only ping when the user interacted recently; idle users don't get kept alive.
    const heartbeat=setInterval(()=>{
      if(Date.now()-lastActivity<HEARTBEAT_MS&&localStorage.getItem('re_access_token')){
        void me().catch(()=>{});
      }
    },HEARTBEAT_MS);
    return()=>{
      clearTimeout(idleTimer);clearInterval(heartbeat);
      ['pointerdown','pointermove','keydown','touchstart','scroll'].forEach(name=>
        window.removeEventListener(name,activity));
      document.removeEventListener('visibilitychange',verifyVisibility);
      window.removeEventListener('re-session-expired',onExpired);
      window.removeEventListener('storage',onStorage);
    };
  },[]);

  if(!user)return <div className="state">Checking secure access…</div>;
  const superAdmin=user.role==='super_admin';
  const features=user.features||{};

  return <div className="admin-shell">
    <aside className={open?'open':''}>
      <div className="admin-brand"><Building2/><span>EstateControl<small>{superAdmin?'Super Admin':'Organization Admin'}</small></span></div>
      <nav onClick={()=>setOpen(false)}>
        {superAdmin
          ? <NavLink to="/control/super"><Users/> Organizations</NavLink>
          : <>
              <NavLink end to="/control"><LayoutDashboard/> Overview</NavLink>
              {features.properties&&<NavLink to="/control/properties"><Home/> Properties</NavLink>}
              {features.civil_services&&<NavLink to="/control/civil-services"><HardHat/> Civil Services</NavLink>}
              {features.construction_works&&<NavLink to="/control/construction-works"><HardHat/> Construction Works</NavLink>}
              {features.interior_designs&&<NavLink to="/control/interior-designs"><Paintbrush/> Interior Design</NavLink>}
              {features.lift_designs&&<NavLink to="/control/lift-designs"><Building2/> Lift Designs</NavLink>}
              {features.custom_pages&&serviceTypes.map((type:any)=><NavLink key={type.id} to={`/control/services/${encodeURIComponent(type.slug)}`} title={type.name}><Layers3/> {type.name}</NavLink>)}
              {features.custom_pages&&!!serviceError&&<NavLink to="/control/custom-pages" title={serviceError}><Layers3/> Services (retry)</NavLink>}
              {features.custom_pages&&serviceTypes.length===0&&!serviceError&&<NavLink to="/control/custom-pages"><Layers3/> Manage Services</NavLink>}
              {features.foundation&&<NavLink to="/control/foundation"><HeartHandshake/> Charity & Foundation</NavLink>}
              {features.gallery&&<NavLink to="/control/gallery"><Images/> Gallery</NavLink>}
              <NavLink to="/control/content"><FileText/> Page Content</NavLink>
              {(features.contact||features.interior_designs||features.lift_designs||features.custom_pages||features.foundation)&&<NavLink to="/control/inquiries"><MessageSquare/> Inquiries</NavLink>}
            </>
        }
      </nav>
      <button onClick={()=>{logout();navigate('/login')}}><LogOut/> Sign out</button>
    </aside>
    <main>
      <header className="admin-top">
        <button onClick={()=>setOpen(!open)}><Menu/></button>
        <div><b>Real Estate Management</b><small>{user.email}</small></div>
        <a href="/">Public website →</a>
      </header>
      <div className="admin-body"><Outlet context={user}/></div>
    </main>
  </div>;
}
