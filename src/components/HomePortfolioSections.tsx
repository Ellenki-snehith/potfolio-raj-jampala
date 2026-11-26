
// import './home-portfolio-sections.css';

// import communityImage from '../assets/activity-community.jpg';
// import educationImage from '../assets/activity-education.jpg';
// import healthcareImage from '../assets/activity-healthcare.jpg';
// import environmentImage from '../assets/activity-environment.jpg';
// import empowermentImage from '../assets/activity-empowerment.jpg';

// const stats = [
//   { number: '25+', label: 'Years of public service' },
//   { number: '1,200+', label: 'Community interactions' },
//   { number: '40,000+', label: 'People reached' },
//   { number: '85+', label: 'Public initiatives' },
// ];

// const activities = [
//   {
//     category: 'Community',
//     title: 'Listening to the people',
//     description: 'Meeting residents and understanding local concerns.',
//     image: communityImage,
//     className: 'activity-featured',
//   },
//   {
//     category: 'Education',
//     title: 'Supporting education',
//     description: 'Encouraging learning opportunities for students.',
//     image: educationImage,
//     className: '',
//   },
//   {
//     category: 'Healthcare',
//     title: 'Community healthcare',
//     description: 'Promoting health awareness and accessibility.',
//     image: healthcareImage,
//     className: '',
//   },
//   {
//     category: 'Environment',
//     title: 'Green community initiatives',
//     description: 'Encouraging environmental awareness and participation.',
//     image: environmentImage,
//     className: 'activity-featured',
//   },
//   {
//     category: 'Empowerment',
//     title: 'Women and youth development',
//     description: 'Supporting participation, skills and empowerment.',
//     image: empowermentImage,
//     className: '',
//   },
// ];

// const focusAreas = [
//   {
//     icon: '📚',
//     title: 'Education',
//     description:
//       'Promoting educational opportunities, student support and learning initiatives.',
//   },
//   {
//     icon: '♥',
//     title: 'Healthcare',
//     description:
//       'Encouraging health awareness, accessibility and community wellbeing.',
//   },
//   {
//     icon: '🌱',
//     title: 'Farmers',
//     description:
//       'Listening to agricultural concerns and supporting rural development.',
//   },
//   {
//     icon: '👥',
//     title: 'Women & Youth',
//     description:
//       'Encouraging participation, empowerment, skills and opportunities.',
//   },
// ];

// const journey = [
//   {
//     year: 'Early Journey',
//     text: 'Beginning the journey through community involvement and public service.',
//   },
//   {
//     year: 'Community Engagement',
//     text: 'Building connections with residents and understanding local needs.',
//   },
//   {
//     year: 'Public Service',
//     text: 'Working towards community development and public welfare.',
//   },
//   {
//     year: 'Present',
//     text: 'Continuing to focus on people, development and community participation.',
//   },
// ];

// export default function HomePortfolioSections() {
//   return (
//     <div className="home-portfolio-sections">

//       {/* STATISTICS */}
//       <section className="home-stats">
//         <div className="home-stats-inner">
//           {stats.map((stat, index) => (
//             <div className="home-stat" key={index}>
//               <h2>{stat.number}</h2>
//               <p>{stat.label}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* QUOTE BANNER */}
//       <section className="home-quote-section">
//         <div className="home-quote-banner">
//           <div className="home-quote-content">
//             <span className="home-quote-mark">“</span>

//             <h2>
//               Public service is about listening,
//               <br />
//               understanding and working
//               <br />
//               for the people.
//             </h2>

//             <p>COMMITMENT TO COMMUNITY & PUBLIC SERVICE</p>
//           </div>
//         </div>
//       </section>

//       {/* RECENT ACTIVITIES */}
//       <section className="home-activities-section">
//         <div className="home-section-heading">
//           <div>
//             <span className="home-eyebrow">ON THE GROUND</span>
//             <h2>Recent activities</h2>
//           </div>

//           <a href="/party-services" className="home-outline-link">
//             All activities <span>→</span>
//           </a>
//         </div>

//         <div className="home-activities-grid">
//           {activities.map((activity, index) => (
//             <article
//               key={index}
//               className={`home-activity-card ${activity.className}`}
//             >
//               <img src={activity.image} alt={activity.title} />

//               <div className="home-activity-overlay">
//                 <span className="home-activity-tag">
//                   {activity.category}
//                 </span>

//                 <h3>{activity.title}</h3>

//                 <p>{activity.description}</p>
//               </div>
//             </article>
//           ))}
//         </div>
//       </section>

//       {/* FOCUS AREAS */}
//       <section className="home-focus-section">
//         <div className="home-focus-heading">
//           <span className="home-eyebrow">OUR VISION</span>

//           <h2>
//             Four focus areas for a
//             <br />
//             stronger community
//           </h2>
//         </div>

//         <div className="home-focus-grid">
//           {focusAreas.map((area, index) => (
//             <article className="home-focus-card" key={index}>
//               <div className="home-focus-icon">{area.icon}</div>

//               <h3>{area.title}</h3>

//               <p>{area.description}</p>
//             </article>
//           ))}
//         </div>
//       </section>

//       {/* JOURNEY TIMELINE */}
//       <section className="home-journey-section">
//         <div className="home-journey-left">
//           <span className="home-eyebrow">THE JOURNEY</span>

//           <h2>
//             A journey of
//             <br />
//             service and
//             <br />
//             commitment
//           </h2>

//           <p>
//             A continuing journey focused on people, community and
//             meaningful development.
//           </p>
//         </div>

//         <div className="home-timeline">
//           {journey.map((item, index) => (
//             <div className="home-timeline-item" key={index}>
//               <div className="home-timeline-dot" />

//               <div className="home-timeline-content">
//                 <h3>{item.year}</h3>
//                 <p>{item.text}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//     </div>
//   );
// }

//-----------------------------------------------------------------------------------------------

// import { useEffect, useRef, useState } from 'react';
// import './home-portfolio-sections.css';

// import communityImage from '../assets/activity-community.jpg';
// import educationImage from '../assets/activity-education.jpg';
// import healthcareImage from '../assets/activity-healthcare.jpg';
// import environmentImage from '../assets/activity-environment.jpg';
// import empowermentImage from '../assets/activity-empowerment.jpg';
// import quoteBackground from '../assets/quote-background.jpg';

// import {
//   BookOpen,
//   HeartPulse,
//   Sprout,
//   UsersRound,
// } from 'lucide-react';

// /* =========================================
//    STATISTICS
// ========================================= */

// const stats = [
//   { value: 15, suffix: '+', label: 'Years of experience' },
//   { value: 100, suffix: '+', label: 'Villages visited' },
//   { value: 5000, suffix: '+', label: 'Trees planted' },
//   { value: 75, suffix: '+', label: 'Education camps' },
//   { value: 100, suffix: '+', label: 'Free health camps' },
// ];

// /* =========================================
//    ACTIVITIES
// ========================================= */

// const activities = [
//   {
//     category: 'Community',
//     title: 'Listening to the people',
//     description: 'Meeting residents and understanding local concerns.',
//     image: communityImage,
//   },
//   {
//     category: 'Education',
//     title: 'Supporting young minds',
//     description:
//       'Encouraging students through education and learning initiatives.',
//     image: educationImage,
//   },
//   {
//     category: 'Healthcare',
//     title: 'Health for every family',
//     description:
//       'Promoting health awareness and free medical support.',
//     image: healthcareImage,
//   },
//   {
//     category: 'Environment',
//     title: 'A greener tomorrow',
//     description:
//       'Promoting tree plantation and environmental responsibility.',
//     image: environmentImage,
//   },
//   {
//     category: 'Empowerment',
//     title: 'Empowering women and youth',
//     description:
//       'Supporting skills, opportunities and community participation.',
//     image: empowermentImage,
//   },
// ];

// /* =========================================
//    FOCUS AREAS
// ========================================= */

// const focusAreas = [
//   {
//     icon: BookOpen,
//     title: 'Education',
//     description:
//       'Supporting students, promoting education and creating opportunities for the next generation.',
//   },
//   {
//     icon: HeartPulse,
//     title: 'Healthcare',
//     description:
//       'Encouraging health awareness, medical camps and accessible healthcare for families.',
//   },
//   {
//     icon: Sprout,
//     title: 'Farmers',
//     description:
//       'Understanding farmers’ concerns and supporting agriculture and rural development.',
//   },
//   {
//     icon: UsersRound,
//     title: 'Women & Youth',
//     description:
//       'Encouraging empowerment, skills, leadership and opportunities for women and young people.',
//   },
// ];

// /* =========================================
//    JOURNEY
// ========================================= */

// const journey = [
//   {
//     year: 'Early Journey',
//     text: 'Beginning the journey through community involvement and public service.',
//   },
//   {
//     year: 'Community Engagement',
//     text: 'Building connections with residents and understanding local needs.',
//   },
//   {
//     year: 'Public Service',
//     text: 'Working towards community development and public welfare.',
//   },
//   {
//     year: 'Present',
//     text: 'Continuing to focus on people, development and community participation.',
//   },
// ];

// /* =========================================
//    ANIMATED COUNTER
// ========================================= */

// function AnimatedCounter({
//   value,
//   suffix = '',
// }: {
//   value: number;
//   suffix?: string;
// }) {
//   const [count, setCount] = useState(0);

//   const counterRef = useRef<HTMLSpanElement>(null);
//   const hasAnimated = useRef(false);

//   useEffect(() => {
//     const element = counterRef.current;

//     if (!element) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         const entry = entries[0];

//         if (entry.isIntersecting && !hasAnimated.current) {
//           hasAnimated.current = true;

//           const duration = 1800;
//           const startTime = performance.now();

//           const animate = (currentTime: number) => {
//             const elapsed = currentTime - startTime;
//             const progress = Math.min(elapsed / duration, 1);

//             // Smooth ease-out effect
//             const easedProgress = 1 - Math.pow(1 - progress, 3);

//             const currentCount = Math.floor(value * easedProgress);

//             setCount(currentCount);

//             if (progress < 1) {
//               requestAnimationFrame(animate);
//             } else {
//               setCount(value);
//             }
//           };

//           requestAnimationFrame(animate);
//           observer.disconnect();
//         }
//       },
//       {
//         threshold: 0.35,
//       }
//     );

//     observer.observe(element);

//     return () => observer.disconnect();
//   }, [value]);

//   return (
//     <span ref={counterRef}>
//       {count.toLocaleString('en-IN')}
//       {suffix}
//     </span>
//   );
// }

// /* =========================================
//    HOME PORTFOLIO SECTIONS
// ========================================= */

// export default function HomePortfolioSections() {
//   return (
//     <div className="home-portfolio-sections">

//       {/* =====================================
//           STATISTICS / OUR IMPACT
//       ====================================== */}

//       <section className="home-stats">

//         <div className="home-stats-heading">
//           <span className="home-eyebrow">OUR IMPACT</span>

//           <h2>Service that makes a difference</h2>

//           <p>
//             Every effort begins with people and works towards
//             meaningful community development.
//           </p>
//         </div>

//         <div className="home-stats-inner">
//           {stats.map((stat, index) => (
//             <div className="home-stat" key={index}>
//               <h2 className="home-stat-number">
//                 <AnimatedCounter
//                   value={stat.value}
//                   suffix={stat.suffix}
//                 />
//               </h2>

//               <p>{stat.label}</p>
//             </div>
//           ))}
//         </div>

//       </section>

//       {/* =====================================
//           QUOTE BANNER
//       ====================================== */}

//       <section className="home-quote-section">

//         <div
//           className="home-quote-banner"
//           style={{
//             backgroundImage: `url(${quoteBackground})`,
//           }}
//         >

//           <div className="home-quote-overlay"></div>

//           <div className="home-quote-content">

//             <span className="home-quote-mark">“</span>

//             <h2>
//               True leadership begins
//               <br />
//               with listening to people
//               <br />
//               and serving with purpose.
//             </h2>

//             <p>
//               PEOPLE • PROGRESS • PUBLIC SERVICE
//             </p>

//           </div>

//         </div>

//       </section>

//       {/* =====================================
//           RECENT ACTIVITIES
//       ====================================== */}

//       <section className="home-activities-section">

//         <div className="home-section-heading">

//           <div>
//             <span className="home-eyebrow">
//               PEOPLE • PROGRESS • ACTION
//             </span>

//             <h2>Our work on the ground</h2>

//             <p>
//               Connecting with people and working towards positive change.
//             </p>
//           </div>

//           <a
//             href="/services/advocate-page"
//             className="home-outline-link"
//           >
//             Explore activities
//             <span>→</span>
//           </a>

//         </div>

//         <div className="home-activities-grid">

//           {activities.map((activity, index) => (
//             <article
//               key={index}
//               className="home-activity-card"
//             >

//               <img
//                 src={activity.image}
//                 alt={activity.title}
//               />

//               <div className="home-activity-overlay">

//                 <span className="home-activity-tag">
//                   {activity.category}
//                 </span>

//                 <h3>{activity.title}</h3>

//                 <p>{activity.description}</p>

//               </div>

//             </article>
//           ))}

//         </div>

//       </section>

//       {/* =====================================
//           FOCUS AREAS
//       ====================================== */}

//       <section className="home-focus-section">

//         <div className="home-focus-heading">

//           <span className="home-eyebrow">
//             OUR VISION
//           </span>

//           <h2>
//             Four focus areas for a
//             <br />
//             stronger community
//           </h2>

//           <p>
//             Building a better future through opportunities,
//             support and community participation.
//           </p>

//         </div>

//         <div className="home-focus-grid">

//           {focusAreas.map((area, index) => {
//             const Icon = area.icon;

//             return (
//               <article
//                 className="home-focus-card"
//                 key={index}
//               >

//                 <div className="home-focus-icon">
//                   <Icon
//                     size={32}
//                     strokeWidth={2}
//                   />
//                 </div>

//                 <h3>{area.title}</h3>

//                 <p>{area.description}</p>

//                 <span className="home-focus-number">
//                   0{index + 1}
//                 </span>

//               </article>
//             );
//           })}

//         </div>

//       </section>

//       {/* =====================================
//           JOURNEY TIMELINE
//       ====================================== */}

//       <section className="home-journey-section">

//         <div className="home-journey-left">

//           <span className="home-eyebrow">
//             THE JOURNEY
//           </span>

//           <h2>
//             A journey of
//             <br />
//             service and
//             <br />
//             commitment
//           </h2>

//           <p>
//             A continuing journey focused on people,
//             community and meaningful development.
//           </p>

//         </div>

//         <div className="home-timeline">

//           {journey.map((item, index) => (
//             <div
//               className="home-timeline-item"
//               key={index}
//             >

//               <div className="home-timeline-dot"></div>

//               <div className="home-timeline-content">

//                 <span className="home-timeline-number">
//                   0{index + 1}
//                 </span>

//                 <h3>{item.year}</h3>

//                 <p>{item.text}</p>

//               </div>

//             </div>
//           ))}

//         </div>

//       </section>

//     </div>
//   );
// }

import { useEffect, useRef, useState } from 'react';
import './home-portfolio-sections.css';

import quoteBackground from '../assets/quote-background.jpg';

import {
  BookOpen,
  HeartPulse,
  Sprout,
  UsersRound,
} from 'lucide-react';

import CustomServicesSection from './CustomServicesSection';

/* =========================================
   COMPONENT PROPS
========================================= */

type HomePortfolioSectionsProps = {
  customPageTypes?: any[];
  customPageEntries?: any[];
};

/* =========================================
   STATISTICS
========================================= */

const stats = [
  { value: 15, suffix: '+', label: 'Years of experience' },
  { value: 100, suffix: '+', label: 'Villages visited' },
  { value: 5000, suffix: '+', label: 'Trees planted' },
  { value: 75, suffix: '+', label: 'Education camps' },
  { value: 100, suffix: '+', label: 'Free health camps' },
];

/* =========================================
   FOCUS AREAS
========================================= */

const focusAreas = [
  {
    icon: BookOpen,
    title: 'Education',
    description:
      'Supporting students, promoting education and creating opportunities for the next generation.',
  },
  {
    icon: HeartPulse,
    title: 'Healthcare',
    description:
      'Encouraging health awareness, medical camps and accessible healthcare for families.',
  },
  {
    icon: Sprout,
    title: 'Farmers',
    description:
      'Understanding farmers’ concerns and supporting agriculture and rural development.',
  },
  {
    icon: UsersRound,
    title: 'Women & Youth',
    description:
      'Encouraging empowerment, skills, leadership and opportunities for women and young people.',
  },
];

/* =========================================
   JOURNEY
========================================= */

const journey = [
  {
    year: 'Early Journey',
    text: 'Beginning the journey through community involvement and public service.',
  },
  {
    year: 'Community Engagement',
    text: 'Building connections with residents and understanding local needs.',
  },
  {
    year: 'Public Service',
    text: 'Working towards community development and public welfare.',
  },
  {
    year: 'Present',
    text: 'Continuing to focus on people, development and community participation.',
  },
];

/* =========================================
   ANIMATED COUNTER
========================================= */

function AnimatedCounter({
  value,
  suffix = '',
}: {
  value: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = counterRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          const duration = 1800;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(value * easedProgress);

            setCount(currentCount);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(value);
            }
          };

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      {
        threshold: 0.35,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={counterRef}>
      {count.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

/* =========================================
   HOME PORTFOLIO SECTIONS
========================================= */

export default function HomePortfolioSections({
  customPageTypes = [],
  customPageEntries = [],
}: HomePortfolioSectionsProps) {
  return (
    <div className="home-portfolio-sections">

      {/* =====================================
          STATISTICS / OUR IMPACT
      ====================================== */}

      <section className="home-stats">
        <div className="home-stats-heading">
          <span className="home-eyebrow">OUR IMPACT</span>

          <h2>Service that makes a difference</h2>

          <p>
            Every effort begins with people and works towards
            meaningful community development.
          </p>
        </div>

        <div className="home-stats-inner">
          {stats.map((stat, index) => (
            <div className="home-stat" key={index}>
              <h2 className="home-stat-number">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                />
              </h2>

              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================
          QUOTE BANNER
      ====================================== */}

      <section className="home-quote-section">
        <div
          className="home-quote-banner"
          style={{
            backgroundImage: `url(${quoteBackground})`,
          }}
        >
          <div className="home-quote-overlay"></div>

          <div className="home-quote-content">
            <span className="home-quote-mark">“</span>

            <h2>
              True leadership begins
              <br />
              with listening to people
              <br />
              and serving with purpose.
            </h2>

            <p>PEOPLE • PROGRESS • PUBLIC SERVICE</p>
          </div>
        </div>
      </section>

      {/* =====================================
          DYNAMIC PARTY SERVICES FROM ADMIN
          THIS REPLACES THE OLD STATIC ACTIVITIES
      ====================================== */}

      <CustomServicesSection
        types={customPageTypes}
        entries={customPageEntries}
      />

      {/* =====================================
          FOCUS AREAS
      ====================================== */}

      <section className="home-focus-section">
        <div className="home-focus-heading">
          <span className="home-eyebrow">
            OUR VISION
          </span>

          <h2>
            Four focus areas for a
            <br />
            stronger community
          </h2>

          <p>
            Building a better future through opportunities,
            support and community participation.
          </p>
        </div>

        <div className="home-focus-grid">
          {focusAreas.map((area, index) => {
            const Icon = area.icon;

            return (
              <article
                className="home-focus-card"
                key={index}
              >
                <div className="home-focus-icon">
                  <Icon
                    size={32}
                    strokeWidth={2}
                  />
                </div>

                <h3>{area.title}</h3>

                <p>{area.description}</p>

                <span className="home-focus-number">
                  0{index + 1}
                </span>
              </article>
            );
          })}
        </div>
      </section>

      {/* =====================================
          JOURNEY TIMELINE
      ====================================== */}

      <section className="home-journey-section">
        <div className="home-journey-left">
          <span className="home-eyebrow">
            THE JOURNEY
          </span>

          <h2>
            A journey of
            <br />
            service and
            <br />
            commitment
          </h2>

          <p>
            A continuing journey focused on people,
            community and meaningful development.
          </p>
        </div>

        <div className="home-timeline">
          {journey.map((item, index) => (
            <div
              className="home-timeline-item"
              key={index}
            >
              <div className="home-timeline-dot"></div>

              <div className="home-timeline-content">
                <span className="home-timeline-number">
                  0{index + 1}
                </span>

                <h3>{item.year}</h3>

                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
