const STORAGE_KEY = "altheaContigoSimulador_v1";
const activities = [
  {id:"emociones", title:"Reconozco mis emociones", icon:"🧭", xp:5, desc:"Identifica emociones que pueden aparecer en situaciones cotidianas.", questions:[
    {q:"Si una persona se siente preocupada antes de una exposición, ¿qué emoción podría estar experimentando?", options:["Nerviosismo","Alegría obligatoria","Indiferencia siempre"], answer:0, explain:"El nerviosismo puede aparecer ante una situación que genera incertidumbre."},
    {q:"¿Cuál es una forma saludable de reconocer lo que sientes?", options:["Ignorarlo siempre","Ponerle nombre a la emoción y buscar una forma segura de expresarla","Avergonzarte por sentirla"], answer:1, explain:"Identificar y nombrar una emoción es un primer paso para comprenderla."}
  ]},
  {id:"acoso", title:"¿Es una situación de acoso?", icon:"🛡️", xp:10, desc:"Distingue entre un desacuerdo aislado y conductas repetidas que pueden causar daño.", questions:[
    {q:"Un compañero recibe burlas repetidas y no deseadas por parte de un grupo. ¿Qué podría indicar esta situación?", options:["Una broma sin importancia","Una posible situación de acoso","Una diferencia de gustos"], answer:1, explain:"Las burlas repetidas y no deseadas pueden ser una señal de acoso. Es importante buscar apoyo."},
    {q:"Si observas que alguien está siendo excluido de forma constante, ¿qué sería adecuado?", options:["Compartir el rumor","No hacer nada en ningún caso","Buscar apoyo de una persona adulta o autoridad de confianza"], answer:2, explain:"Pedir orientación a una persona de confianza puede ayudar a atender la situación de manera segura."}
  ]},
  {id:"apoyo", title:"Sé dónde buscar apoyo", icon:"🤝", xp:10, desc:"Conoce opciones para pedir orientación y acompañamiento.", questions:[
    {q:"Si una situación escolar te preocupa, ¿con quién puedes acercarte?", options:["Orientación educativa, tutoría o una persona adulta de confianza","Con alguien que te pida guardar todo en secreto","Con nadie, porque debes resolverlo sin ayuda"], answer:0, explain:"La tutoría, orientación educativa y personas adultas de confianza pueden ayudarte a encontrar apoyo."},
    {q:"¿Qué puedes hacer si no sabes qué servicio está disponible en tu institución?", options:["Suponer que no existe ninguno","Preguntar en servicios escolares, tutoría u orientación","Publicar datos personales en redes"], answer:1, explain:"Preguntar directamente en la institución permite conocer los servicios y sus canales de atención."}
  ]},
  {id:"bienestar", title:"Pequeños pasos para mi bienestar", icon:"🌱", xp:10, desc:"Reconoce acciones cotidianas que pueden favorecer tu bienestar.", questions:[
    {q:"¿Cuál de estas opciones puede ayudarte a organizar un momento de autocuidado?", options:["Hacer una pausa y elegir una actividad sencilla que disfrutes","Exigirte resolver todo de inmediato","Compararte constantemente con otras personas"], answer:0, explain:"Una pausa y una actividad sencilla pueden ser formas de autocuidado."},
    {q:"Si una actividad no te hace sentir cómodo, ¿qué puedes hacer?", options:["Continuar aunque no quieras","Pedir una pausa o elegir no participar","Sentirte culpable"], answer:1, explain:"Puedes establecer límites y elegir no participar en una actividad que te incomoda."}
  ]}
];
const levels = [
  {name:"Primeros pasos", min:0, max:9},
  {name:"Conociéndome", min:10, max:19},
  {name:"Reconociendo", min:20, max:29},
  {name:"Buscando apoyo", min:30, max:34},
  {name:"Mi bienestar importa", min:35, max:35}
];
let state = {name:"", xp:0, completed:[], results:{}};
let currentActivity = null;
let currentQuestion = 0;
let correctCount = 0;
let answered = false;

const $ = id => document.getElementById(id);
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); render(); }
function load(){
  try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); if(saved && typeof saved === "object") state = {...state,...saved}; } catch(e){}
  if(state.name){ $("welcomeScreen").classList.add("hidden"); $("appScreen").classList.remove("hidden"); render(); }
}
function levelIndex(){ return state.xp >= 35 ? 4 : Math.floor(state.xp / 10); }
function render(){
  $("userName").textContent = state.name || "estudiante";
  $("xpTotal").textContent = `${state.xp} XP`;
  $("progressXp").textContent = state.xp;
  $("completedCount").textContent = `${state.completed.length}/4`;
  const idx = levelIndex(), level = levels[idx];
  $("levelName").textContent = `Nivel ${idx+1}`;
  $("levelSubtitle").textContent = level.name;
  $("levelHeading").textContent = `Nivel ${idx+1} · ${level.name}`;
  const within = idx === 4 ? 100 : Math.min(100, Math.round(((state.xp - level.min) / (level.max - level.min + 1)) * 100));
  $("levelPercent").textContent = `${within}%`;
  $("levelBar").style.width = `${within}%`;
  $("levelHint").textContent = idx === 4 ? "¡Has completado todos los niveles del recorrido!" : `Te faltan ${Math.max(0, level.max + 1 - state.xp)} XP para el siguiente nivel.`;
  $("activityList").innerHTML = activities.map(a => {
    const done = state.completed.includes(a.id);
    return `<article class="activity-item"><div class="feature-icon">${a.icon}</div><div class="activity-info"><span class="chip">${a.xp} XP</span><h3>${a.title}</h3><p>${a.desc}</p>${done?'<span class="done-label">✓ Completada</span>':''}</div><button class="primary-btn" data-open-activity="${a.id}" type="button">${done?'Practicar':'Comenzar'}</button></article>`;
  }).join("");
  $("badges").innerHTML = [
    ["🌱","Primer paso","Completar una actividad",state.completed.length>=1],
    ["💜","Me conozco","Completar emociones",state.completed.includes("emociones")],
    ["🛡️","Identifico","Completar acoso",state.completed.includes("acoso")],
    ["🤝","Busco apoyo","Completar redes de apoyo",state.completed.includes("apoyo")],
    ["🌸","Mi bienestar","Completar las cuatro actividades",state.completed.length===4]
  ].map(b=>`<div class="badge-card ${b[3]?'':'locked'}"><div class="emoji">${b[0]}</div><strong>${b[1]}</strong><small>${b[2]}</small></div>`).join("");
  $("progressDetails").innerHTML = activities.map(a=>`<div class="progress-row"><span>${a.icon} ${a.title}</span><strong>${state.completed.includes(a.id)?'Completada':'Pendiente'}</strong></div>`).join("");
}
function showTab(tab){
  document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
  document.querySelectorAll(".tab-panel").forEach(p=>p.classList.toggle("hidden",p.id!==`tab-${tab}`));
}
function openActivity(id){
  currentActivity = activities.find(a=>a.id===id); currentQuestion=0; correctCount=0; answered=false;
  if(!currentActivity) return;
  $("modalEyebrow").textContent = `ACTIVIDAD · ${currentActivity.xp} XP`;
  $("modalTitle").textContent = currentActivity.title;
  $("modalDescription").textContent = currentActivity.desc;
  $("feedback").classList.add("hidden"); $("checkAnswer").classList.remove("hidden"); $("finishActivity").classList.add("hidden");
  $("activityModal").classList.remove("hidden"); renderQuestion();
}
function renderQuestion(){
  const q=currentActivity.questions[currentQuestion];
  $("questionArea").innerHTML=`<div class="question"><strong>Pregunta ${currentQuestion+1} de ${currentActivity.questions.length}: ${q.q}</strong>${q.options.map((o,i)=>`<label class="option"><input type="radio" name="answer" value="${i}"><span>${o}</span></label>`).join("")}</div>`;
  $("feedback").classList.add("hidden"); $("checkAnswer").classList.remove("hidden"); $("finishActivity").classList.add("hidden"); answered=false;
}
function checkAnswer(){
  if(answered) return;
  const selected=document.querySelector('input[name="answer"]:checked');
  if(!selected){ $("feedback").textContent="Selecciona una respuesta para continuar."; $("feedback").className="feedback error"; return; }
  const q=currentActivity.questions[currentQuestion], correct=Number(selected.value)===q.answer;
  if(correct) correctCount++;
  answered=true;
  $("feedback").textContent=(correct?"¡Muy bien! ":"Puedes seguir aprendiendo. ")+q.explain;
  $("feedback").className=`feedback ${correct?'':'error'}`;
  $("checkAnswer").classList.add("hidden");
  if(currentQuestion < currentActivity.questions.length-1){ $("finishActivity").textContent="Siguiente pregunta"; $("finishActivity").classList.remove("hidden"); }
  else { $("finishActivity").textContent="Ver resultado"; $("finishActivity").classList.remove("hidden"); }
}
function nextOrFinish(){
  if(currentQuestion < currentActivity.questions.length-1){currentQuestion++;renderQuestion();return;}
  const total=currentActivity.questions.length;
  const earned=state.completed.includes(currentActivity.id)?0:currentActivity.xp;
  if(earned){state.xp+=earned;state.completed.push(currentActivity.id);}
  state.results[currentActivity.id]={correct:correctCount,total,percent:Math.round(correctCount/total*100)};
  $("questionArea").innerHTML=`<div class="question"><h3>¡Actividad terminada! 🌸</h3><p>Respuestas correctas: <strong>${correctCount} de ${total}</strong> (${Math.round(correctCount/total*100)}%).</p><p>${earned?`Ganaste ${earned} XP.`:"Ya habías recibido los puntos de esta actividad; puedes practicar nuevamente."}</p></div>`;
  $("feedback").textContent="Recuerda: aprender y pedir orientación son pasos valiosos. ¡Gracias por participar!";
  $("feedback").className="feedback";
  $("finishActivity").classList.add("hidden"); $("checkAnswer").textContent="Cerrar"; $("checkAnswer").classList.remove("hidden");
  $("checkAnswer").onclick=closeModal;
  save();
}
function closeModal(){
  $("activityModal").classList.add("hidden");
  $("checkAnswer").onclick=checkAnswer;
  showTab("progreso");
}
$("profileForm").addEventListener("submit",e=>{e.preventDefault();const name=$("nickname").value.trim();if(!name)return;state.name=name;save();$("welcomeScreen").classList.add("hidden");$("appScreen").classList.remove("hidden");});
document.addEventListener("click",e=>{
  const open=e.target.closest("[data-open-activity]"); if(open) openActivity(open.dataset.openActivity);
  const tab=e.target.closest("[data-tab]"); if(tab) showTab(tab.dataset.tab);
});
$("checkAnswer").addEventListener("click",checkAnswer);
$("finishActivity").addEventListener("click",nextOrFinish);
$("closeModal").addEventListener("click",closeModal);
$("activityModal").addEventListener("click",e=>{if(e.target===$("activityModal"))closeModal();});
$("resetBtn").addEventListener("click",()=>{if(confirm("¿Quieres borrar el perfil y todo el avance guardado en este navegador?")){localStorage.removeItem(STORAGE_KEY);state={name:"",xp:0,completed:[],results:{}};$("appScreen").classList.add("hidden");$("welcomeScreen").classList.remove("hidden");$("nickname").value="";showTab("inicio");}});
load();
