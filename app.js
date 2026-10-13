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


// Bounded local-only investor walkthrough: simulated teacher workflow, no storage/API.
(function () {
  "use strict";
  const root = document.getElementById("teacher-demo");
  if (!root) return;
  const panels = Array.from(root.querySelectorAll("[data-demo-panel]"));
  const stageButtons = Array.from(root.querySelectorAll("[data-demo-step]"));
  const categories = Array.from(root.querySelectorAll("[data-demo-kind]"));
  const previous = root.querySelector("[data-demo-prev]");
  const next = root.querySelector("[data-demo-next]");
  const result = root.querySelector("#teacher-demo-result");
  const comment = root.querySelector("#teacher-demo-comment");
  const title = root.querySelector("#teacher-demo-title");
  const instruction = root.querySelector("#teacher-demo-instruction");
  const counter = root.querySelector("#teacher-demo-counter");
  const hint = root.querySelector("#teacher-demo-hint");
  const currentT = () => window.WaslahLocale.interactive().teacher;
  const state = {step: 0, kind: "Пропуск слова", assigned: false};
  function update() {
    root.dataset.step = String(state.step + 1);
    const t=currentT();
    const stages=t.stages;
    counter.textContent=t.counter.replace("{n}",String(state.step+1));
    title.textContent = stages[state.step][0];
    instruction.textContent = stages[state.step][1];
    next.textContent = stages[state.step][2];
    next.disabled = state.step === 3;
    previous.disabled = state.step === 0;
    hint.textContent = state.step === 0 ? t.hintStart : t.hintSelected;
    panels.forEach((p, i) => {p.hidden = i !== state.step});
    stageButtons.forEach((b, i) => {
      if (i === state.step) b.setAttribute("aria-current","step");
      else b.removeAttribute("aria-current");
    });
    categories.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.demoKind === state.kind)));
    const note = comment.value.trim() || t.fallback;
    const kind=t.kinds[state.kind]||state.kind;
    const fmt=s=>s.replaceAll("{kind}",kind).replaceAll("{note}",note);
    result.textContent=state.assigned?fmt(t.assigned):fmt(t.results[state.step]);
  }
  function goTo(n) {
    if (n >= 0 && n < currentT().stages.length) {
      state.step = n;
      state.assigned = false;
      update();
    }
  }
  root.addEventListener("click", function (event) {
    const word = event.target.closest("[data-ustaz-word]");
    const stage = event.target.closest("[data-demo-step]");
    const kind = event.target.closest("[data-demo-kind]");
    if (word) { goTo(1); return; }
    if (stage) { goTo(Number(stage.dataset.demoStep) - 1); return; }
    if (kind) { state.kind = kind.dataset.demoKind; goTo(2); return; }
    if (event.target.closest("[data-demo-prev]")) { goTo(state.step - 1); return; }
    if (event.target.closest("[data-demo-next]")) { goTo(state.step + 1); return; }
    if (event.target.closest("[data-demo-repeat]")) {
      state.step = 3;
      state.assigned = true;
      update();
    }
  });
  comment.addEventListener("input", function () {comment.dataset.userEdited="yes";state.assigned=false;update();});
  document.addEventListener("waslah:language",function(){
    if(comment.dataset.userEdited!=="yes")comment.value=currentT().defaultNote;
    update();
  });
  update();
})();

/* Historical 7-day FAMI_BISHAWQ preview, no network, storage or progress mutation. */
(function(){
  "use strict";
  const root=document.getElementById("khatm7-explorer");
  if(!root)return;
  const plan=()=>window.WaslahLocale.interactive().khatm;
  const letters=["ف","م","ي","ب","ش","و","ق"];
  const b=[...root.querySelectorAll("[data-khatm7-day]")];
  const previous=root.querySelector("[data-khatm7-prev]");
  const next=root.querySelector("[data-khatm7-next]");
  const number=root.querySelector("#khatm7-count");
  const kicker=root.querySelector("#khatm7-selected-kicker");
  const title=root.querySelector("#khatm7-selected-title");
  const range=root.querySelector("#khatm7-selected-range");
  const detail=root.querySelector("#khatm7-selected-detail");
  let current=0;
  function show(n){
    const t=plan();
    const days=t.days;
    if(!Number.isInteger(n)||n<0||n>=days.length)return;
    current=n;
    const item=days[n];
    b.forEach((button,i)=>button.setAttribute("aria-pressed",String(i===n)));
    number.textContent=String(n+1).padStart(2,"0")+" / 07";
    kicker.textContent=t.dayLabel.replace("{n}",String(n+1)).replace("{letter}",letters[n]);
    title.textContent=item[0];
    range.textContent=item[1];
    detail.textContent=item[2];
    previous.disabled=n===0;
    next.disabled=n===days.length-1;
  }
  root.addEventListener("click",function(event){
    const btn=event.target.closest("[data-khatm7-day]");
    if(btn&&root.contains(btn)){show(Number(btn.dataset.khatm7Day)-1);return}
    if(event.target.closest("[data-khatm7-prev]"))show(current-1);
    if(event.target.closest("[data-khatm7-next]"))show(current+1);
  });
  document.addEventListener("waslah:language",()=>show(current));
  show(0);
})();

/* R8: local-only pilot enquiry handoff. No email destination or personal data is stored. */
(function(){
  "use strict";
  const button=document.querySelector("[data-partner-copy]");
  const status=document.getElementById("partner-request-status");
  if(!button||!status)return;
  button.addEventListener("click",async function(){
    const t=window.WaslahLocale.interactive().partner;
    try {
      if(!navigator.clipboard||typeof navigator.clipboard.writeText!=="function")throw Error("Clipboard unavailable");
      await navigator.clipboard.writeText(t.request);
      status.textContent=t.copied;
    } catch (_) {
      status.textContent=t.failed;
    }
  });
})();


/* R8 Figma Desktop-localized static screenshots. Original RU and Quran text are unchanged. */
(function () {
  "use strict";
  const nodes=Array.from(document.querySelectorAll("img[data-r8-media],a[data-r8-media]"));
  function localize() {
    const lang=(window.WaslahLocale&&window.WaslahLocale.get())||document.documentElement.lang||"ru";
    for (const node of nodes) {
      const filename=lang==="uz"||lang==="ar"
        ? "assets/r8-"+lang+"-"+node.dataset.r8Media+".webp"
        : node.dataset.r8Original;
      if(node.tagName==="IMG"&&node.getAttribute("src")!==filename)node.setAttribute("src",filename);
      if(node.tagName==="A"&&node.getAttribute("href")!==filename)node.setAttribute("href",filename);
    }
  }
  document.addEventListener("waslah:language",localize);
  localize();
})();
