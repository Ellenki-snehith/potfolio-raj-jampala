// import { Link } from 'react-router-dom';
// import { MapPin, ArrowRight } from 'lucide-react';

// const CSS = String.raw`
// .uncta,.uncta *{box-sizing:border-box}
// .uncta{background:#0e786f;color:#fff}
// .uncta__wrap{width:min(100% - 48px,1240px);margin:auto;padding:52px 0;display:flex;align-items:center;justify-content:space-between;gap:28px}
// .uncta__info{display:flex;align-items:center;gap:21px}
// .uncta__info>svg{width:42px;height:42px;flex-shrink:0}
// .uncta__title{margin:0;font-size:clamp(21px,2.3vw,28px);font-weight:800;line-height:1.25;color:#fff}
// .uncta__text{margin:8px 0 0;font-size:14px;color:#ffffffd9}
// .uncta__button{display:inline-flex;align-items:center;justify-content:center;gap:9px;flex-shrink:0;padding:15px 24px;border-radius:8px;background:#fff;color:#0e786f;font-size:14px;font-weight:800;text-decoration:none;transition:transform .2s}
// .uncta__button:hover{transform:translateY(-2px)}
// .uncta__button svg{width:17px;height:17px}
// @media(max-width:700px){.uncta__wrap{width:min(100% - 32px,1240px);padding:40px 0;flex-direction:column;align-items:flex-start}.uncta__button{width:100%}.uncta__info{gap:16px}}
// @media(prefers-reduced-motion:reduce){.uncta__button{transition:none}}
// `;
// export default function ContactCTA() {
//   return <section className="uncta" id="home-contact"><style>{CSS}</style><div className="uncta__wrap">
//     <div className="uncta__info"><MapPin aria-hidden="true"/><div><h2 className="uncta__title">Have a property requirement?</h2><p className="uncta__text">Tell us your location, budget and requirements.</p></div></div>
//     <Link className="uncta__button" to="/contact">Send an inquiry <ArrowRight aria-hidden="true"/></Link>
//   </div></section>;
// }

import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';

const CSS = String.raw`
.uncta,.uncta *{box-sizing:border-box}

.uncta{
  background:#17243a;
  color:#fff;
  position:relative;
  overflow:hidden;
}

.uncta::before{
  content:"";
  position:absolute;
  width:380px;
  height:380px;
  border-radius:50%;
  background:rgba(255,153,51,.08);
  right:-100px;
  top:-180px;
}

.uncta__wrap{
  width:min(100% - 48px,1240px);
  margin:auto;
  padding:55px 0;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:30px;
  position:relative;
  z-index:1;
}

.uncta__info{
  display:flex;
  align-items:center;
  gap:22px;
}

.uncta__icon{
  width:64px;
  height:64px;
  border-radius:18px;
  background:#ff9933;
  display:flex;
  align-items:center;
  justify-content:center;
  flex-shrink:0;
  color:#fff;
}

.uncta__icon svg{
  width:30px;
  height:30px;
}

.uncta__title{
  margin:0;
  font-size:clamp(22px,2.5vw,32px);
  font-weight:800;
  line-height:1.3;
  color:#fff;
}

.uncta__text{
  margin:10px 0 0;
  max-width:650px;
  font-size:16px;
  line-height:1.8;
  color:rgba(255,255,255,.78);
}

.uncta__button{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:12px;
  flex-shrink:0;
  padding:17px 28px;
  border-radius:50px;
  background:#ff9933;
  color:#17243a;
  font-size:15px;
  font-weight:800;
  text-decoration:none;
  transition:all .25s ease;
  border:2px solid #ff9933;
}

.uncta__button:hover{
  background:#fff;
  color:#17243a;
  border-color:#fff;
  transform:translateY(-3px);
  box-shadow:0 10px 25px rgba(0,0,0,.15);
}

.uncta__button svg{
  width:19px;
  height:19px;
  transition:transform .25s ease;
}

.uncta__button:hover svg{
  transform:translateX(4px);
}

/* TABLET */
@media(max-width:900px){
  .uncta__wrap{
    padding:45px 0;
  }

  .uncta__info{
    gap:18px;
  }
}

/* MOBILE */
@media(max-width:700px){
  .uncta__wrap{
    width:min(100% - 32px,1240px);
    padding:40px 0;
    flex-direction:column;
    align-items:flex-start;
    gap:25px;
  }

  .uncta__info{
    align-items:flex-start;
    gap:16px;
  }

  .uncta__icon{
    width:54px;
    height:54px;
    border-radius:15px;
  }

  .uncta__icon svg{
    width:25px;
    height:25px;
  }

  .uncta__title{
    font-size:23px;
  }

  .uncta__text{
    font-size:14px;
  }

  .uncta__button{
    width:100%;
  }
}

@media(prefers-reduced-motion:reduce){
  .uncta__button,
  .uncta__button svg{
    transition:none;
  }
}
`;

export default function ContactCTA() {
  return (
    <section className="uncta" id="home-contact">
      <style>{CSS}</style>

      <div className="uncta__wrap">

        <div className="uncta__info">
          <div className="uncta__icon">
            <MessageCircle aria-hidden="true" />
          </div>

          <div>
            <h2 className="uncta__title">
              Together, let's build a better community
            </h2>

            <p className="uncta__text">
              Have a concern, suggestion or need assistance?
              Reach out and let us work towards a solution together.
            </p>
          </div>
        </div>

        <Link className="uncta__button" to="/contact">
          Contact Us
          <ArrowRight aria-hidden="true" />
        </Link>

      </div>
    </section>
  );
}