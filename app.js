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
  const stages = [
    ["1. Найти слово, которое нужно исправить",
     "Устаз открывает проверяемый аят и выбирает конкретное слово. Нажмите на слово в золотой рамке слева.",
     "Далее: тип ошибки →"],
    ["2. Назвать ошибку",
     "В карточке выбранного слова Устаз отмечает, что именно было неправильно. Выберите категорию ниже.",
     "Далее: замечание →"],
    ["3. Написать пояснение",
     "Устаз объясняет ученику, какую часть нужно повторить. Для примера можно изменить текст ниже — он никуда не отправляется.",
     "Далее: повторение →"],
    ["4. Назначить повторение",
     "Устаз возвращает задание на повторение. Официальный PASS позднее подтверждается отдельно после реальной проверки.",
     "Посмотреть итог ↗"]
  ];
  const state = {step: 0, kind: "Пропуск слова", assigned: false};
  function update() {
    root.dataset.step = String(state.step + 1);
    counter.textContent = "Шаг " + (state.step + 1) + " из 4";
    title.textContent = stages[state.step][0];
    instruction.textContent = stages[state.step][1];
    next.textContent = stages[state.step][2];
    next.disabled = state.step === 3;
    previous.disabled = state.step === 0;
    hint.textContent = state.step === 0
      ? "↓ Нажмите на слово в золотой рамке"
      : "Выбрано слово 2:8:11 · отметка в историческом макете";
    panels.forEach((p, i) => {p.hidden = i !== state.step});
    stageButtons.forEach((b, i) => {
      if (i === state.step) b.setAttribute("aria-current","step");
      else b.removeAttribute("aria-current");
    });
    categories.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.demoKind === state.kind)));
    const note = comment.value.trim() || "Повторить выделенный участок.";
    if (state.assigned) {
      result.textContent = "Только демонстрация: выбран фрагмент 2:8:11, категория «" +
        state.kind + "», замечание «" + note + "», назначение REPEAT показано визуально. Ничего не отправлено и не сохранено.";
    } else {
      const infos = [
        "После выбора слова к нему будет прикреплена карточка ошибки. Здесь показан только концепт.",
        "Категория замечания: «" + state.kind + "». Дальше преподаватель напишет пояснение.",
        "Категория: «" + state.kind + "». Пример пояснения: «" + note + "».",
        "Следующий шаг в будущем продукте: назначить REPEAT. Официальный PASS не выдаётся автоматически."
      ];
      result.textContent = infos[state.step];
    }
  }
  function goTo(n) {
    if (n >= 0 && n < stages.length) {
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
  comment.addEventListener("input", function () { state.assigned = false; update(); });
  update();
})();
