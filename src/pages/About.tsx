// import{Building2,Target,Users,ShieldCheck}from'lucide-react';
// import{useSite}from'../main';
// import{SiteContentSections}from'../components/SiteContentSections';
// export function About(){
//  const{organization:o,page_content:p}=useSite();
//  return <>
//   <section className="page-hero"><span>ABOUT OUR SERVICES</span><h1>{p.about_title||`About ${o.name}`}</h1><p>{p.about_text||o.about}</p></section>
//   <SiteContentSections sections={p.page_sections?.about||[]}/>
//   <section className="section about-grid"><article><Building2/><h2>One organization, complete support</h2><p>{o.about}</p><p>Led by <b>{o.head_name}</b>, our team combines local market understanding with reliable project execution.</p></article><div className="value-grid"><div><Target/><b>Practical guidance</b><p>Clear choices based on location, budget and real needs.</p></div><div><Users/><b>Local network</b><p>Property professionals and civil-service specialists.</p></div><div><ShieldCheck/><b>Accountable service</b><p>Transparent communication from inquiry to completion.</p></div></div></section>
//  </>;
// }
import {
  Target,
  Users,
  ShieldCheck,
  Heart,
  Handshake,
  BookOpen,
  Award,
  MessageCircle,
  Lightbulb,
  Building2,
  Briefcase,
  Star,
} from 'lucide-react';

import { useSite } from '../main';
import { SiteContentSections } from '../components/SiteContentSections';
import '../components/about-page.css';

// IMPORT PROFILE IMAGE DIRECTLY FROM ASSETS
import profileImage from '../assets/user.jpeg';

export function About() {
  const site = useSite();

  const o: any = site.organization || {};
  const p: any = site.page_content || {};

  // ADMIN DATA
  const aboutTitle =
    p.about_title || 'About Us';

  const aboutDescription =
    p.about_text ||
    'Committed to public service, community development, and social empowerment.';

  // ADMIN-CREATED CUSTOM ABOUT SECTIONS
  const aboutSections = Array.isArray(p.page_sections?.about)
    ? p.page_sections.about
    : [];

  // PROFILE DETAILS
  const personName =
    o.head_name ||
    o.name ||
    'Serving the Community';

  return (
    <>
      {/* ================= ABOUT HERO ================= */}

      <section className="about-page-hero">
        <div className="about-page-hero-content">

          <span className="about-eyebrow">
            ABOUT &amp; INTRODUCTION
          </span>

          <h1>{aboutTitle}</h1>

          <p>{aboutDescription}</p>

        </div>
      </section>


      {/* ================= PROFILE SECTION ================= */}

      <section className="about-profile-section">
        <div className="about-profile-container">

          {/* PROFILE IMAGE */}

          <div className="about-profile-image-wrapper">

            <img
              src={profileImage}
              alt={personName}
              className="about-profile-image"
            />

            <div className="about-profile-image-accent"></div>

          </div>


          {/* PROFILE CONTENT */}

          <div className="about-profile-content">

            <span className="about-eyebrow">
              PUBLIC SERVICE &amp; LEADERSHIP
            </span>

            <h2>{personName}</h2>

            <h3>
              BJP OBC Morcha President – Chaitanyapuri
            </h3>

            <p>{aboutDescription}</p>

            <p>
              Dedicated to community engagement, public awareness,
              social development, and constructive participation in
              initiatives that contribute to the betterment of society.
            </p>

            <p>
              Through communication, collaboration, and community
              interaction, the focus is on understanding local concerns,
              encouraging awareness, and supporting initiatives that
              create meaningful opportunities for people.
            </p>


            {/* PROFILE TAGS */}

            <div className="about-profile-tags">
              <span>OBC Rights &amp; Awareness</span>
              <span>Youth Development</span>
              <span>Social Empowerment</span>
              <span>Community Engagement</span>
            </div>

          </div>
        </div>
      </section>


      {/* ================= ADMIN CUSTOM ABOUT SECTIONS ================= */}

      {/* 
        IMPORTANT:
        These sections are dynamically loaded from your Admin Panel.
        Do not remove this component.
      */}

      <SiteContentSections
        sections={aboutSections}
      />


      {/* ================= INTRODUCTION SECTION ================= */}

      <section className="about-introduction-section">

        <div className="about-introduction-container">

          <div className="about-introduction-heading">

            <span className="about-eyebrow">
              OUR COMMITMENT
            </span>

            <h2>
              A Commitment to Community and Public Service
            </h2>

          </div>


          <div className="about-introduction-content">

            <div className="about-introduction-card">

              <div className="about-introduction-icon">
                <Heart />
              </div>

              <h3>People-Centered Approach</h3>

              <p>
                Understanding the concerns, aspirations, and needs of
                people through communication and active community
                engagement.
              </p>

            </div>


            <div className="about-introduction-card">

              <div className="about-introduction-icon">
                <Handshake />
              </div>

              <h3>Collaborative Engagement</h3>

              <p>
                Encouraging cooperation, dialogue, and constructive
                participation among individuals and community members.
              </p>

            </div>


            <div className="about-introduction-card">

              <div className="about-introduction-icon">
                <Lightbulb />
              </div>

              <h3>Awareness and Development</h3>

              <p>
                Promoting awareness of opportunities, public information,
                education, and community development initiatives.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= AREAS OF FOCUS ================= */}

      <section className="about-focus-section">

        <div className="about-focus-container">


          {/* SECTION HEADING */}

          <div className="about-focus-heading">

            <span className="about-eyebrow">
              AREAS OF FOCUS
            </span>

            <h2>
              Areas of Public Engagement
            </h2>

            <p>
              Areas of interest related to community awareness,
              social participation, development, and public engagement.
            </p>

          </div>


          {/* FOCUS CARDS */}

          <div className="about-focus-grid">


            {/* CARD 1 */}

            <div className="about-focus-card">

              <div className="about-focus-icon">
                <ShieldCheck />
              </div>

              <h3>OBC Rights &amp; Awareness</h3>

              <p>
                Promoting awareness of rights, opportunities,
                government information, and access to relevant
                public resources.
              </p>

            </div>


            {/* CARD 2 */}

            <div className="about-focus-card">

              <div className="about-focus-icon">
                <Users />
              </div>

              <h3>Youth Development</h3>

              <p>
                Encouraging young people toward education,
                skill development, responsibility, and positive
                participation in society.
              </p>

            </div>


            {/* CARD 3 */}

            <div className="about-focus-card">

              <div className="about-focus-icon">
                <Heart />
              </div>

              <h3>Social Empowerment</h3>

              <p>
                Supporting awareness and initiatives that encourage
                participation, opportunity, inclusion, and social
                development.
              </p>

            </div>


            {/* CARD 4 */}

            <div className="about-focus-card">

              <div className="about-focus-icon">
                <Handshake />
              </div>

              <h3>Community Engagement</h3>

              <p>
                Encouraging communication and constructive engagement
                around community concerns, ideas, and local needs.
              </p>

            </div>


            {/* CARD 5 */}

            <div className="about-focus-card">

              <div className="about-focus-icon">
                <BookOpen />
              </div>

              <h3>Education &amp; Awareness</h3>

              <p>
                Encouraging learning, awareness, and access to
                information about educational opportunities and
                public initiatives.
              </p>

            </div>


            {/* CARD 6 */}

            <div className="about-focus-card">

              <div className="about-focus-icon">
                <Target />
              </div>

              <h3>Community Development</h3>

              <p>
                Focusing on local needs, development priorities,
                and constructive activities that support the
                community.
              </p>

            </div>


          </div>

        </div>

      </section>


      {/* ================= PUBLIC SERVICE VALUES ================= */}

      <section className="about-values-section">

        <div className="about-values-container">

          <div className="about-values-heading">

            <span className="about-eyebrow">
              PRINCIPLES &amp; VALUES
            </span>

            <h2>
              Values That Guide Public Engagement
            </h2>

            <p>
              Building meaningful relationships through responsible
              communication, cooperation, and a commitment to
              community-focused activities.
            </p>

          </div>


          <div className="about-values-grid">


            {/* VALUE 1 */}

            <div className="about-value-card">

              <div className="about-value-icon">
                <Heart />
              </div>

              <h3>Service</h3>

              <p>
                Maintaining a service-oriented approach and
                understanding the importance of people's concerns.
              </p>

            </div>


            {/* VALUE 2 */}

            <div className="about-value-card">

              <div className="about-value-icon">
                <ShieldCheck />
              </div>

              <h3>Responsibility</h3>

              <p>
                Encouraging responsible communication, awareness,
                and participation in community activities.
              </p>

            </div>


            {/* VALUE 3 */}

            <div className="about-value-card">

              <div className="about-value-icon">
                <Users />
              </div>

              <h3>Inclusiveness</h3>

              <p>
                Recognizing the importance of participation,
                dialogue, and cooperation among people from
                different backgrounds.
              </p>

            </div>


            {/* VALUE 4 */}

            <div className="about-value-card">

              <div className="about-value-icon">
                <Award />
              </div>

              <h3>Commitment</h3>

              <p>
                Maintaining dedication toward community
                engagement, awareness, and development-related
                activities.
              </p>

            </div>


          </div>

        </div>

      </section>


      {/* ================= COMMUNITY CONNECT ================= */}

      <section className="about-community-section">

        <div className="about-community-container">

          <div className="about-community-content">

            <span className="about-eyebrow">
              COMMUNITY CONNECT
            </span>

            <h2>
              Communication, Cooperation &amp; Community
            </h2>

            <p>
              Community engagement is an important part of public
              service. Listening to concerns, exchanging ideas,
              sharing information, and encouraging constructive
              participation help create stronger connections
              between people and their communities.
            </p>

            <p>
              The aim is to encourage open communication and
              awareness while supporting initiatives focused on
              education, social development, and community welfare.
            </p>

          </div>


          <div className="about-community-highlights">

            <div className="about-community-highlight">

              <MessageCircle />

              <div>
                <h3>Communication</h3>

                <p>
                  Open dialogue and exchange of ideas.
                </p>
              </div>

            </div>


            <div className="about-community-highlight">

              <Users />

              <div>
                <h3>Participation</h3>

                <p>
                  Encouraging constructive community involvement.
                </p>
              </div>

            </div>


            <div className="about-community-highlight">

              <Building2 />

              <div>
                <h3>Development</h3>

                <p>
                  Supporting awareness around local development.
                </p>
              </div>

            </div>


            <div className="about-community-highlight">

              <Briefcase />

              <div>
                <h3>Opportunities</h3>

                <p>
                  Sharing information about relevant opportunities.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FINAL SECTION ================= */}

      <section className="about-final-section">

        <div className="about-final-content">

          <span className="about-eyebrow">
            PUBLIC SERVICE &amp; COMMUNITY
          </span>

          <h2>
            Together Towards a Better Community
          </h2>

          <p>
            Encouraging awareness, participation, cooperation,
            and community-focused initiatives for positive
            development.
          </p>

        </div>

      </section>

    </>
  );
}
