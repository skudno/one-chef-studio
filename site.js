document.documentElement.classList.add('js');
const intro=document.querySelector('.intro');
let introGone=false;
function dismissIntro(){if(introGone)return;introGone=true;intro.classList.add('is-gone');intro.setAttribute('aria-hidden','true');}
function onFirstWheel(event){if(introGone)return;if(event.deltaY>0){event.preventDefault();dismissIntro();}}
let touchStartY=null;
window.addEventListener('wheel',onFirstWheel,{passive:false});
window.addEventListener('touchstart',event=>{if(!introGone)touchStartY=event.touches[0]?.clientY ?? null;},{passive:true});
window.addEventListener('touchmove',event=>{if(introGone||touchStartY===null)return;if(touchStartY-(event.touches[0]?.clientY??touchStartY)>12){event.preventDefault();dismissIntro();}},{passive:false});
window.addEventListener('keydown',event=>{if(introGone)return;if(['ArrowDown','PageDown',' ','End'].includes(event.key)){event.preventDefault();dismissIntro();}});
window.addEventListener('scroll',()=>{if(!introGone && window.scrollY>5){window.scrollTo({top:0,behavior:'instant'});dismissIntro();}},{passive:true});
if(window.scrollY>56)dismissIntro();
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reducedMotion && 'IntersectionObserver' in window){const blocks=document.querySelectorAll('.about-main,.menu-main,.gallery-main,.contacts-main');blocks.forEach(block=>block.classList.add('will-reveal'));const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target);}})},{threshold:.08});blocks.forEach(block=>observer.observe(block));}
