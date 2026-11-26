// import { useState, type FormEvent } from "react";
// import { Phone, Mail, MapPin } from "lucide-react";
// import { sendInquiry } from "../api";
// import { useSite } from "../main";
// import { SiteContentSections } from "../components/SiteContentSections";
// const initial = {
//   name: "",
//   phone: "",
//   email: "",
//   requirement_type: "Property",
//   message: "",
// };
// export function Contact() {
//   const { organization: o, page_content: p } = useSite(),
//     [form, setForm] = useState(initial),
//     [status, setStatus] = useState("");
//   const submit = async (e: FormEvent) => {
//     e.preventDefault();
//     try {
//       const r: any = await sendInquiry(form);
//       setStatus(`${r.message}. Reference: ${r.inquiry_id}`);
//       setForm(initial);
//     } catch (e: any) {
//       setStatus(e.message);
//     }
//   };
//   return (
//     <>
//       <section className="page-hero">
//         <span>CONTACT</span>
//         <h1>{p.contact_title || "Let’s discuss your requirement"}</h1>
//         <p>{p.contact_text}</p>
//       </section>
//       <SiteContentSections sections={p.page_sections?.contact || []} />
//       <section className="section contact-grid">
//         <div className="contact-info">
//           <h2>Reach our team</h2>
//           <p>
//             <Phone />
//             <span>
//               {o.phone}
//               <small>{o.alternate_phone}</small>
//             </span>
//           </p>
//           <p>
//             <Mail />
//             <span>{o.email}</span>
//           </p>
//           <p>
//             <MapPin />
//             <span>
//               {o.address}
//               <small>
//                 {o.city}, {o.state} {o.pincode}
//               </small>
//             </span>
//           </p>
//         </div>
//         <form className="contact-form" onSubmit={submit}>
//           <label>
//             Name *
//             <input
//               required
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//             />
//           </label>
//           <label>
//             Phone *
//             <input
//               required
//               value={form.phone}
//               onChange={(e) => setForm({ ...form, phone: e.target.value })}
//             />
//           </label>
//           <label>
//             Email
//             <input
//               type="email"
//               value={form.email}
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//             />
//           </label>
//           <label>
//             Requirement
//             <select
//               value={form.requirement_type}
//               onChange={(e) =>
//                 setForm({ ...form, requirement_type: e.target.value })
//               }
//             >
//               <option>Property</option>
//               <option>Civil Works</option>
//               <option>Carpenter</option>
//               <option>Plumber</option>
//               <option>Electrician</option>
//               <option>Construction</option>
//               <option>Other</option>
//             </select>
//           </label>
//           <label className="full">
//             Message
//             <textarea
//               value={form.message}
//               onChange={(e) => setForm({ ...form, message: e.target.value })}
//             />
//           </label>
//           <button className="primary">Submit inquiry</button>
//           {status && <p className="status-message">{status}</p>}
//         </form>
//       </section>
//     </>
//   );
// }


import { useState, type FormEvent } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
} from "lucide-react";

import { sendInquiry } from "../api";
import { useSite } from "../main";
import { SiteContentSections } from "../components/SiteContentSections";
import profileImage from "../assets/user.jpeg";

import "./Contact.css";

interface ContactForm {
  name: string;
  phone: string;
  email: string;
  location: string;
  message: string;
}

const initial: ContactForm = {
  name: "",
  phone: "",
  email: "",
  location: "",
  message: "",
};

export function Contact() {
  const { organization: o, page_content: p } = useSite();

  const [form, setForm] = useState<ContactForm>(initial);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const phone = o.phone || "";
  const email = o.email || "";
  const address = o.address || "";

  const location = [o.city, o.state, o.pincode]
    .filter(Boolean)
    .join(", ");

  const contactTitle = p.contact_title || "";

 const contactDescription =
  p.contact_text ||
  "Every concern deserves attention. Share your ideas, raise an issue or reach out for support. Together, we can work towards positive change in our community.";

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitting(true);
    setStatus("");

    try {
      // Include the visitor's location in the message
      const inquiryMessage = [
        form.message,
        form.location ? `Location: ${form.location}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      // Existing backend API structure
      const inquiryData = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        requirement_type: "Other",
        message: inquiryMessage,
      };

      const r: any = await sendInquiry(inquiryData);

      setStatus(
        `${r.message}. Reference: ${r.inquiry_id}`
      );

      setForm(initial);
    } catch (error: any) {
      setStatus(
        error?.message || "Unable to submit your message. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="contact-page">

        {/* ================= CONTACT HERO ================= */}
        <section className="contact-modern-hero">
          <div className="contact-modern-container">

            {/* LEFT SIDE */}
            <div className="contact-modern-left">
              <div className="contact-modern-eyebrow">
                CONTACT
              </div>

              {contactTitle ? (
                <h1 className="contact-modern-title">
                  {contactTitle}
                </h1>
              ) : (
                <h1 className="contact-modern-title">
                 Your voice
                  <br />
                  <span className="orange">matters.</span> We read
                  <br />
                  Let's make a difference. 
                </h1>
              )}

              <p className="contact-modern-description">
                {contactDescription}
              </p>

              {/* CALL AND EMAIL BUTTONS */}
              <div className="contact-modern-actions">

                {phone && (
                  <a
                    className="contact-modern-button contact-modern-button-primary"
                    href={`tel:${phone.replace(/\s/g, "")}`}
                  >
                    <Phone />
                    {phone}
                  </a>
                )}

                {email && (
                  <a
                    className="contact-modern-button contact-modern-button-secondary"
                    href={`mailto:${email}`}
                  >
                    <Mail />
                    Email instead
                  </a>
                )}

              </div>
            </div>

            {/* RIGHT SIDE CONTACT CARD */}
            <div className="contact-modern-card">

              {/* PROFILE */}
              <div className="contact-modern-profile">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="contact-modern-profile-image"
                />

                <div className="contact-modern-profile-info">
                  <h2 className="contact-modern-profile-name">
                    {o.head_name || o.name || "Public Service Office"}
                  </h2>

                  <div className="contact-modern-designation">
                    {o.designation ||
                      "Public Service · Community Engagement"}
                  </div>
                </div>

                <div className="contact-modern-edit-icon">
                  <MessageSquare />
                </div>
              </div>

              {/* CONTACT DETAILS */}
              <div className="contact-modern-details">

                {/* OFFICE ADDRESS */}
                <div className="contact-modern-detail">
                  <div className="contact-modern-detail-icon">
                    <MapPin />
                  </div>

                  <div className="contact-modern-detail-content">
                    <div className="contact-modern-detail-label">
                      Office
                    </div>

                    <div className="contact-modern-detail-value">
                      {address}

                      {location && (
                        <>
                          <br />
                          {location}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* PHONE */}
                {phone && (
                  <div className="contact-modern-detail">
                    <div className="contact-modern-detail-icon">
                      <Phone />
                    </div>

                    <div className="contact-modern-detail-content">
                      <div className="contact-modern-detail-label">
                        Phone
                      </div>

                      <div className="contact-modern-detail-value">
                        <a
                          href={`tel:${phone.replace(/\s/g, "")}`}
                        >
                          {phone}
                        </a>

                        {o.alternate_phone && (
                          <>
                            <br />

                            <a
                              href={`tel:${o.alternate_phone.replace(/\s/g, "")}`}
                            >
                              {o.alternate_phone}
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* EMAIL */}
                {email && (
                  <div className="contact-modern-detail">
                    <div className="contact-modern-detail-icon">
                      <Mail />
                    </div>

                    <div className="contact-modern-detail-content">
                      <div className="contact-modern-detail-label">
                        Email
                      </div>

                      <div className="contact-modern-detail-value">
                        <a href={`mailto:${email}`}>
                          {email}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* OFFICE HOURS */}
                <div className="contact-modern-detail">
                  <div className="contact-modern-detail-icon">
                    <Clock />
                  </div>

                  <div className="contact-modern-detail-content">
                    <div className="contact-modern-detail-label">
                      Office hours
                    </div>

                    <div className="contact-modern-detail-value">
                      {o.office_hours ||
                        "Please contact the office for availability"}
                    </div>
                  </div>
                </div>

              </div>

              {/* STATUS */}
              <div className="contact-modern-status">
                <span className="contact-modern-status-dot" />

                <span>
                  Every message is important to us.
                </span>
              </div>

            </div>
          </div>
        </section>

        {/* ================= ADMIN CUSTOM SECTIONS ================= */}
        <SiteContentSections
          sections={p.page_sections?.contact || []}
        />

        {/* ================= CONTACT FORM ================= */}
        <section
          className="contact-form-section"
          id="contact-form"
        >
          <div className="contact-form-container">

            {/* FORM TITLE */}
            <div className="contact-form-heading">
              <div className="contact-form-eyebrow">
                GET IN TOUCH
              </div>

              <h2>Send us a message</h2>

              <p>
                Share your details and your concern, suggestion or request.
                Our office can use the information to understand how to
                get back to you.
              </p>
            </div>

            {/* FORM */}
            <form
              className="contact-modern-form"
              onSubmit={submit}
            >

              {/* NAME */}
              <div className="contact-modern-field">
                <label htmlFor="contact-name">
                  Full Name *
                </label>

                <input
                  id="contact-name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              {/* MOBILE */}
              <div className="contact-modern-field">
                <label htmlFor="contact-phone">
                  Mobile Number *
                </label>

                <input
                  id="contact-phone"
                  type="tel"
                  placeholder="Enter your mobile number"
                  required
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                />
              </div>

              {/* EMAIL */}
              <div className="contact-modern-field">
                <label htmlFor="contact-email">
                  Email Address
                </label>

                <input
                  id="contact-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              {/* LOCATION */}
              <div className="contact-modern-field">
                <label htmlFor="contact-location">
                  Your Location
                </label>

                <input
                  id="contact-location"
                  type="text"
                  placeholder="Enter your area / village / locality"
                  value={form.location}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location: e.target.value,
                    })
                  }
                />
              </div>

              {/* MESSAGE */}
              <div className="contact-modern-field full">
                <label htmlFor="contact-message">
                  Your Message
                </label>

                <textarea
                  id="contact-message"
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      message: e.target.value,
                    })
                  }
                />
              </div>

              {/* SUBMIT */}
              <button
                className="contact-modern-submit"
                type="submit"
                disabled={submitting}
              >
                <Send />

                {submitting
                  ? "Sending..."
                  : "Send Message"}
              </button>

              {/* RESPONSE MESSAGE */}
              {status && (
                <p className="contact-modern-form-status">
                  {status}
                </p>
              )}

            </form>
          </div>
        </section>

      </div>
    </>
  );
}