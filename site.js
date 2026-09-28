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

const photoDialog=document.querySelector('.photo-dialog');
const fullPhoto=photoDialog.querySelector('.photo-full');
const photoCaption=photoDialog.querySelector('.photo-caption');
const galleryPhotos=[...document.querySelectorAll('.collage-group:not([aria-hidden]) .collage-tile')];
const prevPhoto=photoDialog.querySelector('.photo-prev img');
const nextPhoto=photoDialog.querySelector('.photo-next img');
let galleryIndex=0;
let touchStartX=null;
function showGalleryPhoto(){
  const current=galleryPhotos[galleryIndex];
  const previous=galleryPhotos[(galleryIndex-1+galleryPhotos.length)%galleryPhotos.length];
  const next=galleryPhotos[(galleryIndex+1)%galleryPhotos.length];
  fullPhoto.src=current.dataset.photo;
  fullPhoto.alt=current.dataset.caption;
  prevPhoto.src=previous.dataset.photo;
  nextPhoto.src=next.dataset.photo;
  photoDialog.querySelector('.photo-prev').setAttribute('aria-label',`Предыдущее фото, ${previous.dataset.caption}`);
  photoDialog.querySelector('.photo-next').setAttribute('aria-label',`Следующее фото, ${next.dataset.caption}`);
}
function moveGallery(direction){galleryIndex=(galleryIndex+direction+galleryPhotos.length)%galleryPhotos.length;showGalleryPhoto()}
document.addEventListener('click',event=>{
  const photoButton=event.target.closest('[data-photo]');
  if(!photoButton)return;
  const isGallery=photoButton.classList.contains('collage-tile');
  photoDialog.classList.toggle('is-gallery',isGallery);
  if(isGallery){
    galleryIndex=galleryPhotos.findIndex(photo=>photo.dataset.photo===photoButton.dataset.photo);
    showGalleryPhoto();
  }else{
    fullPhoto.src=photoButton.dataset.photo;
    fullPhoto.alt=photoButton.dataset.caption;
  }
  photoCaption.textContent=photoButton.dataset.caption;
  photoCaption.hidden=isGallery;
  photoDialog.showModal();
  document.body.classList.add('photo-open');
});
photoDialog.querySelector('.photo-prev').addEventListener('click',()=>moveGallery(-1));
photoDialog.querySelector('.photo-next').addEventListener('click',()=>moveGallery(1));
photoDialog.addEventListener('keydown',event=>{
  if(!photoDialog.classList.contains('is-gallery'))return;
  if(event.key==='ArrowLeft'){event.preventDefault();moveGallery(-1)}
  if(event.key==='ArrowRight'){event.preventDefault();moveGallery(1)}
});
photoDialog.addEventListener('touchstart',event=>{if(photoDialog.classList.contains('is-gallery'))touchStartX=event.changedTouches[0]?.screenX??null},{passive:true});
photoDialog.addEventListener('touchend',event=>{
  if(touchStartX===null)return;
  const distance=(event.changedTouches[0]?.screenX??touchStartX)-touchStartX;
  if(Math.abs(distance)>45)moveGallery(distance<0?1:-1);
  touchStartX=null;
},{passive:true});
photoDialog.querySelector('.photo-close').addEventListener('click',()=>photoDialog.close());
photoDialog.addEventListener('click',event=>{if(event.target===photoDialog)photoDialog.close()});
photoDialog.addEventListener('close',()=>{document.body.classList.remove('photo-open');fullPhoto.removeAttribute('src')});
