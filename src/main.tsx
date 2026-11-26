// import React,{createContext,useContext,useEffect,useState} from 'react';
// import {createRoot} from 'react-dom/client';
// import {BrowserRouter,Route,Routes} from 'react-router-dom';
// import {ORG_ID,publicData} from './api';
// import {PublicLayout} from './components/PublicLayout';
// import {Home} from './pages/Home';
// import {Properties} from './pages/Properties';
// import {PropertyDetail} from './pages/PropertyDetail';
// import {CivilWorks} from './pages/CivilWorks';
// import {CivilWorkDetail} from './pages/CivilWorkDetail';
// import {ConstructionWorks} from './pages/ConstructionWorks';
// import {ConstructionWorkDetail} from './pages/ConstructionWorkDetail';
// import {InteriorDesigns} from './pages/InteriorDesigns';
// import {InteriorDesignDetail} from './pages/InteriorDesignDetail';
// import {LiftDesigns} from './pages/LiftDesigns';
// import {LiftDesignDetail} from './pages/LiftDesignDetail';
// import {CustomPages,CustomPageDetail} from './pages/CustomPages';
// import {About} from './pages/About';
// import {Gallery} from './pages/Gallery';
// import {Contact} from './pages/Contact';
// import {CustomContentPage} from './pages/CustomContentPage';
// import {FoundationSite} from './pages/FoundationSite';
// import {FoundationAdmin} from './admin/FoundationAdmin';
// import {Login} from './admin/Login';
// import {AdminLayout} from './admin/AdminLayout';
// import {SuperAdmin} from './admin/SuperAdmin';
// import {OrgDashboard} from './admin/OrgDashboard';
// import {ManageItems} from './admin/ManageItems';
// import {PropertyMedia} from './admin/PropertyMedia';
// import {ManageContent} from './admin/ManageContent';
// import {GalleryAdmin} from './admin/GalleryAdmin';
// import {Inquiries} from './admin/Inquiries';
// import {CustomPagesAdmin} from './admin/CustomPagesAdmin';
// import {CustomPageMedia} from './admin/CustomPageMedia';
// import './styles.css';

// export const SiteContext=createContext<any>(null);
// export const useSite=()=>useContext(SiteContext);

// function Site(){
//   const [data,setData]=useState<any>();
//   const [error,setError]=useState('');
//   useEffect(()=>{if(!ORG_ID)setError('VITE_ORGANIZATION_ID is not configured');else publicData().then(setData).catch(reason=>setError(reason.message))},[]);
//   if(error)return <div className="state"><h1>Website unavailable</h1><p>{error}</p></div>;
//   if(!data)return <div className="state">Loading Public Service Portfolio…</div>;
//   const features=data.organization.features||{};
//   const visibility=data.page_content?.page_visibility||{};
//   return <SiteContext.Provider value={data}><Routes>

//     <Route element={<PublicLayout/>}>
//     {features.foundation&&<Route path="foundation/*" element={<FoundationSite/>}/>}
//     <Route index element={visibility.home!==false?<Home/>:<div className="state"><h1>Home page is inactive</h1><p>This page has been disabled by the organization.</p></div>}/>
//     {features.properties&&<><Route path="properties" element={<Properties/>}/><Route path="properties/:propertyId" element={<PropertyDetail/>}/></>}
//     {features.civil_services&&<><Route path="civil-works" element={<CivilWorks/>}/><Route path="civil-works/:serviceId" element={<CivilWorkDetail/>}/></>}
//     {features.construction_works&&<><Route path="construction-works" element={<ConstructionWorks/>}/><Route path="construction-works/:workId" element={<ConstructionWorkDetail/>}/></>} 
//     {features.lift_designs&&<><Route path="lift-designs" element={<LiftDesigns/>}/><Route path="lift-designs/:liftId" element={<LiftDesignDetail/>}/></>}
//     {features.interior_designs&&<><Route path="interior-designs" element={<InteriorDesigns/>}/><Route path="interior-designs/:designId" element={<InteriorDesignDetail/>}/></>}
//     {features.custom_pages&&<><Route path="services/:typeSlug" element={<CustomPages/>}/><Route path="services/:typeSlug/:itemSlug" element={<CustomPageDetail/>}/></>}
//     {features.custom_content_pages&&<Route path="pages/:slug" element={<CustomContentPage/>}/>}
//     {features.gallery&&visibility.gallery!==false&&<Route path="gallery" element={<Gallery/>}/>}
//     {features.about&&visibility.about!==false&&<Route path="about" element={<About/>}/>} 
//     {features.contact&&visibility.contact!==false&&<Route path="contact" element={<Contact/>}/>} 
//     <Route path="*" element={<div className="state"><h1>Page unavailable</h1><p>This page is not enabled for this organization.</p></div>}/>
//   </Route></Routes></SiteContext.Provider>;
// }

// function App(){return <Routes>
//   <Route path="/login" element={<Login/>}/>
//   <Route path="/control" element={<AdminLayout/>}>
//     <Route index element={<OrgDashboard/>}/><Route path="super" element={<SuperAdmin/>}/><Route path="properties" element={<ManageItems kind="properties"/>}/><Route path="properties/:propertyId/media" element={<PropertyMedia/>}/><Route path="civil-services" element={<ManageItems kind="civil_services"/>}/><Route path="civil-services/:serviceId/media" element={<PropertyMedia kind="civil"/>}/><Route path="construction-works" element={<ManageItems kind="construction_works"/>}/><Route path="construction-works/:workId/media" element={<PropertyMedia kind="construction"/>}/><Route path="interior-designs" element={<ManageItems kind="interior_designs"/>}/><Route path="interior-designs/:designId/media" element={<PropertyMedia kind="interior"/>}/><Route path="lift-designs" element={<ManageItems kind="lift_designs"/>}/><Route path="lift-designs/:liftId/media" element={<PropertyMedia kind="lift"/>}/><Route path="custom-pages" element={<CustomPagesAdmin/>}/><Route path="services/:typeSlug" element={<CustomPagesAdmin/>}/><Route path="custom-pages/:entryId/media" element={<CustomPageMedia/>}/><Route path="foundation" element={<FoundationAdmin/>}/><Route path="gallery" element={<GalleryAdmin/>}/><Route path="content" element={<ManageContent/>}/><Route path="inquiries" element={<Inquiries/>}/>
//   </Route>
//   <Route path="*" element={<Site/>}/>
// </Routes>}

// createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><App/></BrowserRouter></React.StrictMode>);


import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ORG_ID, publicData } from './api';

import { PublicLayout } from './components/PublicLayout';
import ScrollToTop from './components/ScrollToTop';

import { Home } from './pages/Home';
import { Properties } from './pages/Properties';
import { PropertyDetail } from './pages/PropertyDetail';
import { CivilWorks } from './pages/CivilWorks';
import { CivilWorkDetail } from './pages/CivilWorkDetail';
import { ConstructionWorks } from './pages/ConstructionWorks';
import { ConstructionWorkDetail } from './pages/ConstructionWorkDetail';
import { InteriorDesigns } from './pages/InteriorDesigns';
import { InteriorDesignDetail } from './pages/InteriorDesignDetail';
import { LiftDesigns } from './pages/LiftDesigns';
import { LiftDesignDetail } from './pages/LiftDesignDetail';
import { CustomPages, CustomPageDetail } from './pages/CustomPages';
import { About } from './pages/About';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { CustomContentPage } from './pages/CustomContentPage';
import { FoundationSite } from './pages/FoundationSite';

import { FoundationAdmin } from './admin/FoundationAdmin';
import { Login } from './admin/Login';
import { AdminLayout } from './admin/AdminLayout';
import { SuperAdmin } from './admin/SuperAdmin';
import { OrgDashboard } from './admin/OrgDashboard';
import { ManageItems } from './admin/ManageItems';
import { PropertyMedia } from './admin/PropertyMedia';
import { ManageContent } from './admin/ManageContent';
import { GalleryAdmin } from './admin/GalleryAdmin';
import { Inquiries } from './admin/Inquiries';
import { CustomPagesAdmin } from './admin/CustomPagesAdmin';
import { CustomPageMedia } from './admin/CustomPageMedia';

import './styles.css';

/* =========================================================
   SITE CONTEXT
========================================================= */

export const SiteContext = createContext<any>(null);

export const useSite = () => useContext(SiteContext);

/* =========================================================
   PUBLIC WEBSITE
========================================================= */

function Site() {
  const [data, setData] = useState<any>();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ORG_ID) {
      setError('VITE_ORGANIZATION_ID is not configured');
    } else {
      publicData()
        .then(setData)
        .catch(reason => setError(reason.message));
    }
  }, []);

  if (error) {
    return (
      <div className="state">
        <h1>Website unavailable</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="state">
        Loading Public Service Portfolio…
      </div>
    );
  }

  const features = data.organization.features || {};
  const visibility = data.page_content?.page_visibility || {};

  return (
    <SiteContext.Provider value={data}>
      <Routes>
        <Route element={<PublicLayout />}>

          {features.foundation && (
            <Route
              path="foundation/*"
              element={<FoundationSite />}
            />
          )}

          <Route
            index
            element={
              visibility.home !== false
                ? <Home />
                : (
                  <div className="state">
                    <h1>Home page is inactive</h1>
                    <p>
                      This page has been disabled by the organization.
                    </p>
                  </div>
                )
            }
          />

          {features.properties && (
            <>
              <Route
                path="properties"
                element={<Properties />}
              />
              <Route
                path="properties/:propertyId"
                element={<PropertyDetail />}
              />
            </>
          )}

          {features.civil_services && (
            <>
              <Route
                path="civil-works"
                element={<CivilWorks />}
              />
              <Route
                path="civil-works/:serviceId"
                element={<CivilWorkDetail />}
              />
            </>
          )}

          {features.construction_works && (
            <>
              <Route
                path="construction-works"
                element={<ConstructionWorks />}
              />
              <Route
                path="construction-works/:workId"
                element={<ConstructionWorkDetail />}
              />
            </>
          )}

          {features.lift_designs && (
            <>
              <Route
                path="lift-designs"
                element={<LiftDesigns />}
              />
              <Route
                path="lift-designs/:liftId"
                element={<LiftDesignDetail />}
              />
            </>
          )}

          {features.interior_designs && (
            <>
              <Route
                path="interior-designs"
                element={<InteriorDesigns />}
              />
              <Route
                path="interior-designs/:designId"
                element={<InteriorDesignDetail />}
              />
            </>
          )}

          {features.custom_pages && (
            <>
              <Route
                path="services/:typeSlug"
                element={<CustomPages />}
              />
              <Route
                path="services/:typeSlug/:itemSlug"
                element={<CustomPageDetail />}
              />
            </>
          )}

          {features.custom_content_pages && (
            <Route
              path="pages/:slug"
              element={<CustomContentPage />}
            />
          )}

          {features.gallery && visibility.gallery !== false && (
            <Route
              path="gallery"
              element={<Gallery />}
            />
          )}

          {features.about && visibility.about !== false && (
            <Route
              path="about"
              element={<About />}
            />
          )}

          {features.contact && visibility.contact !== false && (
            <Route
              path="contact"
              element={<Contact />}
            />
          )}

          <Route
            path="*"
            element={
              <div className="state">
                <h1>Page unavailable</h1>
                <p>
                  This page is not enabled for this organization.
                </p>
              </div>
            }
          />

        </Route>
      </Routes>
    </SiteContext.Provider>
  );
}

/* =========================================================
   APPLICATION ROUTES
========================================================= */

function App() {
  return (
    <Routes>

      {/* Admin Login */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Admin Dashboard */}
      <Route
        path="/control"
        element={<AdminLayout />}
      >
        <Route
          index
          element={<OrgDashboard />}
        />

        <Route
          path="super"
          element={<SuperAdmin />}
        />

        <Route
          path="properties"
          element={<ManageItems kind="properties" />}
        />

        <Route
          path="properties/:propertyId/media"
          element={<PropertyMedia />}
        />

        <Route
          path="civil-services"
          element={<ManageItems kind="civil_services" />}
        />

        <Route
          path="civil-services/:serviceId/media"
          element={<PropertyMedia kind="civil" />}
        />

        <Route
          path="construction-works"
          element={<ManageItems kind="construction_works" />}
        />

        <Route
          path="construction-works/:workId/media"
          element={<PropertyMedia kind="construction" />}
        />

        <Route
          path="interior-designs"
          element={<ManageItems kind="interior_designs" />}
        />

        <Route
          path="interior-designs/:designId/media"
          element={<PropertyMedia kind="interior" />}
        />

        <Route
          path="lift-designs"
          element={<ManageItems kind="lift_designs" />}
        />

        <Route
          path="lift-designs/:liftId/media"
          element={<PropertyMedia kind="lift" />}
        />

        <Route
          path="custom-pages"
          element={<CustomPagesAdmin />}
        />

        <Route
          path="services/:typeSlug"
          element={<CustomPagesAdmin />}
        />

        <Route
          path="custom-pages/:entryId/media"
          element={<CustomPageMedia />}
        />

        <Route
          path="foundation"
          element={<FoundationAdmin />}
        />

        <Route
          path="gallery"
          element={<GalleryAdmin />}
        />

        <Route
          path="content"
          element={<ManageContent />}
        />

        <Route
          path="inquiries"
          element={<Inquiries />}
        />

      </Route>

      {/* Public Website */}
      <Route
        path="*"
        element={<Site />}
      />

    </Routes>
  );
}

/* =========================================================
   APPLICATION ENTRY POINT
   ScrollToTop is placed inside BrowserRouter
========================================================= */

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>

      {/* Scroll to top whenever the route changes */}
      <ScrollToTop />

      <App />

    </BrowserRouter>
  </React.StrictMode>
);
