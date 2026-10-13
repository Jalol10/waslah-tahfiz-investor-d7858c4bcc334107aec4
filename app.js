document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener('click',()=>{
    const menu=document.querySelector('.mobile-nav');
    if(menu&&menu.open)menu.open=false;
  });
});
const anchors=[...document.querySelectorAll('main section[id]')];
const links=[...document.querySelectorAll('.desktop-nav a')];
if("IntersectionObserver" in window){
 const observer=new IntersectionObserver(entries=>{
  const current=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(current){links.forEach(a=>a.setAttribute("aria-current",String(a.getAttribute("href")==="#"+current.target.id)));}
 },{rootMargin:"-15% 0px -65% 0px",threshold:[0,.1,.4]});
 anchors.forEach(el=>observer.observe(el));
}
