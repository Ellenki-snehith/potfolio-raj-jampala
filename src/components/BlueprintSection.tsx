import { Link } from 'react-router-dom';
import { ArrowRight, Home, HardHat, KeyRound, ShieldCheck } from 'lucide-react';
import constructionImage from '../assets/p3.jpg';
import finishImage from '../assets/p1.jpg';

const CSS = String.raw`
.unblue,.unblue *{box-sizing:border-box}
.unblue{
  --unblue-navy:#102b43;
  --unblue-primary:#0b688b;
  --unblue-text:#142b3a;
  --unblue-muted:#677786;
  /* Same desktop gutters as the updated Hero and Featured Properties sections. */
  --unblue-page-gutter:max(20px,3.125%,calc(50% - 835px));
  position:relative;
  overflow:hidden;
  padding:108px 0 120px;
  background-color:#fff;
  color:var(--unblue-text);
}
.unblue::before{
  content:"";
  pointer-events:none;
  position:absolute;
  inset:0;
  opacity:.6;
  background-image:
    linear-gradient(rgba(16,43,67,.035) 1px,transparent 1px),
    linear-gradient(90deg,rgba(16,43,67,.035) 1px,transparent 1px);
  background-size:32px 32px;
}
/* Full-width container with exactly the same left/right gutter as the header. */
.unblue__wrap{
  position:relative;
  display:grid;
  grid-template-columns:minmax(0,1fr) minmax(0,1fr);
  align-items:center;
  gap:72px;
  width:100%;
  margin-inline:auto;
  padding-inline:var(--unblue-page-gutter);
}
.unblue__images{position:relative;min-width:0;min-height:485px}
.unblue__main{
  display:block;
  width:90%;
  height:440px;
  object-fit:cover;
  border-radius:20px;
  box-shadow:0 24px 50px rgba(16,43,67,.15);
}
.unblue__inset{
  position:absolute;
  right:0;
  bottom:0;
  width:52%;
  height:230px;
  object-fit:cover;
  border:5px solid #fff;
  border-radius:17px;
  box-shadow:0 20px 40px rgba(16,43,67,.18);
  animation:unblue-float 5s ease-in-out infinite;
}
.unblue__eyebrow{
  display:block;
  color:var(--unblue-primary);
  letter-spacing:.22em;
  font-size:12px;
  font-weight:800;
}
.unblue__title{
  margin:14px 0 0;
  color:var(--unblue-navy);
  font-size:clamp(32px,3.9vw,51px);
  line-height:1.15;
  letter-spacing:-.035em;
  font-weight:800;
}
.unblue__desc{margin:19px 0 0;color:var(--unblue-muted);font-size:15px;line-height:1.8}
.unblue__grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:30px}
.unblue__card{
  display:flex;
  flex-direction:column;
  min-width:0;
  min-height:155px;
  padding:20px;
  border:1px solid #e0e6ec;
  border-radius:12px;
  background:#fff;
  text-decoration:none;
  color:inherit;
  transition:box-shadow .25s,transform .25s,border-color .25s;
}
.unblue__card:hover{
  transform:translateY(-4px);
  border-color:rgba(11,104,139,.4);
  box-shadow:0 14px 26px rgba(16,43,67,.09);
}
.unblue__card:focus-visible,
.unblue__more:focus-visible{outline:3px solid var(--unblue-primary);outline-offset:3px}
.unblue__card svg{width:29px;height:29px;color:var(--unblue-primary)}
.unblue__card strong{display:block;margin-top:12px;color:var(--unblue-navy);font-size:15px}
.unblue__card span{display:block;margin-top:6px;font-size:12px;color:var(--unblue-muted);line-height:1.5}
.unblue__more{
  display:inline-flex;
  align-items:center;
  gap:8px;
  margin-top:26px;
  text-decoration:none;
  color:var(--unblue-primary);
  font-size:14px;
  font-weight:800;
}
.unblue__more:hover{color:var(--unblue-navy)}
.unblue__more svg{width:16px;height:16px}
@keyframes unblue-float{50%{transform:translateY(-10px)}}
@media(max-width:1000px){
  .unblue__wrap{gap:36px}
  .unblue__main{height:400px}
  .unblue__images{min-height:445px}
}
@media(max-width:780px){
  .unblue{padding:70px 0}
  .unblue__wrap{grid-template-columns:1fr;gap:46px}
  .unblue__images{min-height:375px}
  .unblue__main{height:345px;width:90%}
  .unblue__inset{height:160px}
  .unblue__title{font-size:36px}
}
@media(max-width:480px){
  .unblue{--unblue-page-gutter:16px;padding:60px 0 68px}
  .unblue__images{min-height:290px}
  .unblue__main{height:272px}
  .unblue__inset{height:140px}
  .unblue__grid{gap:10px}
  .unblue__card{min-height:154px;padding:14px}
  .unblue__title{font-size:clamp(29px,8vw,36px)}
}
@media(prefers-reduced-motion:reduce){
  .unblue__inset{animation:none}
  .unblue__card{transition:none}
}
`;

export default function BlueprintSection({ features = {} }: { features?: Record<string, any> }) {
  const cards = [
    ...(features.properties ? [{ icon: Home, title: 'Buy & Sell', text: 'Explore property options and listing details.', href: '/properties' }] : []),
    ...(features.construction_works ? [{ icon: HardHat, title: 'Construction', text: 'From structural work to the final finish.', href: '/construction-works' }] : []),
    ...(features.civil_services ? [{ icon: ShieldCheck, title: 'Civil Services', text: 'Repair, maintenance and skilled trades.', href: '/civil-works' }] : []),
    ...(features.interior_designs ? [{ icon: KeyRound, title: 'Interior Design', text: 'Beautiful spaces made for everyday life.', href: '/interior-designs' }] : []),
    ...(features.lift_designs ? [{ icon: KeyRound, title: 'Lift Solutions', text: 'Explore lift concepts and installations.', href: '/lift-designs' }] : []),
  ].slice(0, 4);

  if (!cards.length) return null;

  return <section className="unblue" id="home-about">
    <style>{CSS}</style>
    <div className="unblue__wrap">
      <div className="unblue__images">
        <img className="unblue__main" src={constructionImage} alt="Construction and civil works" loading="lazy" />
        <img className="unblue__inset" src={finishImage} alt="Finished modern property" loading="lazy" />
      </div>
      <div>
        <span className="unblue__eyebrow">FROM BLUEPRINT TO KEYS</span>
        <h2 className="unblue__title">Your property goals, one trusted team.</h2>
        <p className="unblue__desc">Whether you are exploring a property, planning construction, upgrading a room or arranging maintenance, discover services for every stage of your property journey.</p>
        <div className="unblue__grid">{cards.map((c) => <Link className="unblue__card" key={c.href} to={c.href}>
          <c.icon aria-hidden="true" /><strong>{c.title}</strong><span>{c.text}</span>
        </Link>)}</div>
        {features.contact && <Link className="unblue__more" to="/contact">Discuss your project <ArrowRight aria-hidden="true" /></Link>}
      </div>
    </div>
  </section>;
}
