/* Althea Contigo 2.0 — extensión aditiva
   No reemplaza script.js ni modifica las actividades existentes.
   Los datos nuevos se guardan bajo una clave separada y local.
*/
(() => {
  "use strict";
  const KEY = "altheaContigo_2_addon_v1";
  const defaults = {
    emotionNotes: [],
    calendar: {},
    simulatorDone: [],
    empathyDone: [],
    demoMode: false,
    fontScale: 1,
    contrast: false,
    reducedMotion: false
  };
  let data = { ...defaults };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
    if (saved && typeof saved === "object") data = { ...defaults, ...saved };
  } catch (_) {}
  const save = () => localStorage.setItem(KEY, JSON.stringify(data));
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
  const $ = (id) => document.getElementById(id);
  const root = document.querySelector(".app-shell");
  if (!root) return;

  const extraTabs = [
    ["simuladores","🎭 Simuladores"],
    ["emociones2","🌈 Mapa emocional"],
    ["empatia2","🌷 Laboratorio de empatía"],
    ["calendario2","🗓️ Mi calendario"],
    ["apoyo2","🧭 Centro de apoyo"],
    ["accesibilidad2","♿ Accesibilidad"]
  ];
  const nav = document.querySelector(".tabs");
  extraTabs.forEach(([id,label]) => {
    const b = document.createElement("button");
    b.className = "tab";
    b.dataset.tab = id;
    b.textContent = label;
    nav.appendChild(b);
  });

  const panel = (id, html) => {
    const s = document.createElement("section");
    s.id = `tab-${id}`;
    s.className = "tab-panel hidden addon-panel";
    s.innerHTML = html;
    document.querySelector("#appScreen").appendChild(s);
  };

  panel("simuladores", `
    <p class="eyebrow">PRACTICA CON SITUACIONES FICTICIAS</p>
    <h2>Simuladores de decisiones</h2>
    <p class="muted">Explora opciones posibles ante situaciones escolares. No hay que contar experiencias personales y puedes salir cuando quieras.</p>
    <div id="simulatorList" class="addon-grid"></div>
    <div id="simulatorStage" class="addon-card hidden" aria-live="polite"></div>
  `);
  panel("emociones2", `
    <p class="eyebrow">PONERLE NOMBRE A LO QUE SIENTES</p>
    <h2>Mapa emocional</h2>
    <p class="muted">Elige una emoción si te sirve. No es una evaluación ni un diagnóstico; también puedes no registrar nada.</p>
    <div class="emotion-grid" id="emotionChoices"></div>
    <div id="emotionPrompt" class="addon-card hidden" aria-live="polite"></div>
    <h3 class="addon-subhead">Mis registros de esta demostración</h3>
    <div id="emotionHistory" class="addon-list"></div>
    <button class="soft-btn" id="clearEmotionHistory" type="button">Borrar mis registros</button>
  `);
  panel("empatia2", `
    <p class="eyebrow">MIRAR DESDE OTRAS PERSPECTIVAS</p>
    <h2>Laboratorio de empatía</h2>
    <p class="muted">Pequeños retos para practicar escucha, respeto y apoyo sin juzgar ni presionar.</p>
    <div id="empathyList" class="addon-grid"></div>
  `);
  panel("calendario2", `
    <p class="eyebrow">ORGANIZA PEQUEÑOS MOMENTOS</p>
    <h2>Mi calendario de bienestar</h2>
    <p class="muted">Puedes anotar una actividad amable y realista para ti. No es obligatorio cumplirla ni compartirla.</p>
    <div class="addon-card">
      <label for="wellDate">Fecha</label>
      <input type="date" id="wellDate">
      <label for="wellTask">Actividad o recordatorio</label>
      <input type="text" id="wellTask" maxlength="100" placeholder="Ej. tomar una pausa, hablar con tutoría…">
      <button class="primary-btn" id="saveWellTask" type="button">Guardar recordatorio</button>
    </div>
    <div id="calendarEntries" class="addon-list"></div>
  `);
  panel("apoyo2", `
    <p class="eyebrow">NO TIENES QUE RESOLVER TODO A SOLAS</p>
    <h2>Centro de apoyo</h2>
    <p class="muted">Este apartado ofrece orientación general. No es un servicio de emergencia ni sustituye a profesionales.</p>
    <div class="addon-grid">
      <article class="addon-card"><span class="addon-icon">🏫</span><h3>Dentro de tu institución</h3><p>Pregunta por tutoría, orientación educativa, coordinación académica o el protocolo institucional de atención a la violencia y el acoso.</p></article>
      <article class="addon-card"><span class="addon-icon">🤝</span><h3>Personas de confianza</h3><p>Puedes acercarte a una persona adulta de confianza. Comparte únicamente lo que te sientas cómodo/a contando.</p></article>
      <article class="addon-card"><span class="addon-icon">📝</span><h3>Cómo iniciar la conversación</h3><p>“Hay una situación que me preocupa y quisiera saber qué opciones de apoyo existen”.</p></article>
      <article class="addon-card"><span class="addon-icon">🛡️</span><h3>Si hay riesgo inmediato</h3><p>Busca ayuda de una persona adulta cercana y de los servicios de emergencia de tu localidad. No intentes manejar una situación peligrosa sin apoyo.</p></article>
    </div>
    <div class="notice warning">Los canales y horarios de atención deben confirmarse directamente con tu institución. No inventamos teléfonos ni prometemos atención que este prototipo no puede brindar.</div>
  `);
  panel("accesibilidad2", `
    <p class="eyebrow">UNA EXPERIENCIA MÁS CÓMODA</p>
    <h2>Accesibilidad</h2>
    <p class="muted">Ajusta la presentación de esta demostración. Los cambios se guardan en este navegador.</p>
    <div class="addon-card accessibility-controls">
      <div><strong>Tamaño del texto</strong><div class="addon-actions"><button class="soft-btn" id="fontDown" type="button">A−</button><button class="soft-btn" id="fontReset" type="button">Restablecer</button><button class="soft-btn" id="fontUp" type="button">A+</button></div></div>
      <label class="addon-toggle"><input id="contrastToggle" type="checkbox"> Alto contraste</label>
      <label class="addon-toggle"><input id="motionToggle" type="checkbox"> Reducir animaciones</label>
      <p class="small muted">También puedes navegar con teclado. Usa Tab para avanzar, Shift + Tab para retroceder y Enter o espacio para activar controles.</p>
    </div>
  `);

  const sims = [
    {id:"exclusion",title:"Exclusión en un equipo",desc:"En un trabajo escolar, una persona queda fuera de la conversación.",q:"¿Qué respuesta puede ayudar sin aumentar el conflicto?",opts:["Invitarla a participar y proponer que el equipo escuche todas las ideas","Hacer una publicación burlándose del equipo","Decidir por la persona qué debe hacer"],a:0,why:"Abrir un espacio de participación y escuchar con respeto puede favorecer una colaboración más justa."},
    {id:"bystander",title:"Observas burlas repetidas",desc:"Notas comentarios hirientes que se repiten hacia un compañero.",q:"¿Cuál es un paso prudente?",opts:["Compartir el video para que todos opinen","Buscar orientación de una persona adulta o autoridad escolar","Enfrentar a todos sin apoyo"],a:1,why:"Pedir orientación permite responder con apoyo y sin exponerte a una confrontación insegura."},
    {id:"digital",title:"Mensaje incómodo en línea",desc:"En un grupo digital aparecen mensajes que humillan a alguien.",q:"¿Qué puedes hacer?",opts:["Reenviarlos a otros grupos","Responder con amenazas","No difundirlos, usar las opciones de reporte y pedir apoyo"],a:2,why:"Evitar la difusión y recurrir a canales responsables ayuda a reducir el daño."}
  ];
  const empathy = [
    ["Escucha sin interrumpir","Una persona comparte una opinión distinta. Practica resumir lo que entendiste antes de responder.","Escuchar no significa estar de acuerdo; significa dar espacio y tratar con respeto."],
    ["Pregunta sin presionar","Alguien parece necesitar apoyo, pero no quiere hablar en ese momento.","Puedes decir: “Si algún día quieres hablar o necesitas orientación, puedo ayudarte a buscarla”."],
    ["Evita suponer","Una compañera está más callada de lo habitual.","No adivines lo que ocurre. Puedes saludar con amabilidad y respetar si prefiere estar sola."]
  ];
  const emotions = [
    ["😊","Alegría","¿Qué pequeño momento o actividad te gustaría disfrutar hoy?"],
    ["😌","Calma","¿Qué te ayuda a sentirte en un ambiente tranquilo?"],
    ["😟","Preocupación","¿Hay algo pequeño que puedas organizar o alguien de confianza con quien hablar?"],
    ["😔","Tristeza","¿Qué gesto amable podrías ofrecerte ahora?"],
    ["😠","Enojo","¿Te serviría hacer una pausa antes de decidir cómo responder?"],
    ["😕","Confusión","¿Qué pregunta podrías hacer para comprender mejor la situación?"],
    ["😴","Cansancio","¿Puedes darte un descanso razonable o pedir ayuda con alguna tarea?"],
    ["🤔","Otra emoción","¿Qué palabra se acerca más a lo que estás sintiendo?"]
  ];

  function renderSimulators() {
    $("simulatorList").innerHTML = sims.map(s => `
      <article class="addon-card"><span class="addon-icon">🎭</span><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p>
      <span class="done-label">${data.simulatorDone.includes(s.id) ? "✓ Explorado" : "Reto interactivo"}</span>
      <button class="primary-btn" data-sim="${s.id}" type="button">Explorar situación</button></article>`).join("");
  }
  function openSim(id) {
    const s = sims.find(x => x.id === id); if (!s) return;
    const stage = $("simulatorStage"); stage.classList.remove("hidden");
    stage.innerHTML = `<h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p><strong>${esc(s.q)}</strong>
      <div class="addon-options">${s.opts.map((o,i)=>`<label><input type="radio" name="simAnswer" value="${i}"> ${esc(o)}</label>`).join("")}</div>
      <button class="primary-btn" id="checkSim" type="button">Comprobar</button><div id="simFeedback" class="notice hidden" aria-live="polite"></div>`;
    $("checkSim").onclick = () => {
      const pick = stage.querySelector('input[name="simAnswer"]:checked');
      if (!pick) { $("simFeedback").textContent = "Elige una opción para continuar."; $("simFeedback").classList.remove("hidden"); return; }
      const ok = Number(pick.value) === s.a;
      $("simFeedback").textContent = (ok ? "¡Buena elección! " : "Puedes revisar esta alternativa. ") + s.why;
      $("simFeedback").classList.remove("hidden");
      if (!data.simulatorDone.includes(id)) { data.simulatorDone.push(id); save(); renderSimulators(); }
    };
  }
  function renderEmotions() {
    $("emotionChoices").innerHTML = emotions.map((e,i)=>`<button class="emotion-choice" type="button" data-emotion="${i}"><span>${e[0]}</span><strong>${esc(e[1])}</strong></button>`).join("");
    $("emotionHistory").innerHTML = data.emotionNotes.length ? [...data.emotionNotes].reverse().map((n,i)=>`<div class="addon-list-row"><span>${esc(n.emoji)} ${esc(n.label)}</span><small>${esc(n.date)}</small></div>`).join("") : `<p class="muted small">Aún no hay registros. Puedes usar el mapa sin guardar nada.</p>`;
  }
  function renderEmpathy() {
    $("empathyList").innerHTML = empathy.map((e,i)=>`<article class="addon-card"><span class="addon-icon">🌷</span><h3>${esc(e[0])}</h3><p>${esc(e[1])}</p><div class="notice">${esc(e[2])}</div><button class="soft-btn" data-empathy="${i}" type="button">${data.empathyDone.includes(i)?"✓ Reto explorado":"Marcar como explorado"}</button></article>`).join("");
  }
  function renderCalendar() {
    const entries = Object.entries(data.calendar).sort((a,b)=>a[0].localeCompare(b[0]));
    $("calendarEntries").innerHTML = entries.length ? entries.map(([date,task])=>`<div class="addon-list-row"><span><strong>${esc(date)}</strong><br>${esc(task)}</span><button class="text-btn" data-delete-date="${esc(date)}" type="button">Eliminar</button></div>`).join("") : `<p class="muted small">Todavía no tienes recordatorios.</p>`;
  }
  function applyA11y() {
    document.documentElement.style.setProperty("--addon-font-scale", data.fontScale);
    document.body.classList.toggle("addon-contrast", data.contrast);
    document.body.classList.toggle("addon-reduced-motion", data.reducedMotion);
    $("contrastToggle").checked = data.contrast;
    $("motionToggle").checked = data.reducedMotion;
  }
  renderSimulators(); renderEmotions(); renderEmpathy(); renderCalendar(); applyA11y();

  document.addEventListener("click", e => {
    const sim = e.target.closest("[data-sim]"); if (sim) openSim(sim.dataset.sim);
    const em = e.target.closest("[data-emotion]");
    if (em) {
      const item = emotions[Number(em.dataset.emotion)];
      $("emotionPrompt").classList.remove("hidden");
      $("emotionPrompt").innerHTML = `<h3>${item[0]} ${esc(item[1])}</h3><p>${esc(item[2])}</p><button class="soft-btn" id="saveEmotion" type="button">Guardar registro local</button><p class="small muted">El registro no se comparte y no es un diagnóstico.</p>`;
      $("saveEmotion").onclick = () => {
        data.emotionNotes.push({emoji:item[0],label:item[1],date:new Date().toLocaleDateString("es-MX")});
        save(); renderEmotions(); $("emotionPrompt").classList.add("hidden");
      };
    }
    const emp = e.target.closest("[data-empathy]");
    if (emp) {
      const n = Number(emp.dataset.empathy);
      if (!data.empathyDone.includes(n)) data.empathyDone.push(n);
      save(); renderEmpathy();
    }
    const del = e.target.closest("[data-delete-date]");
    if (del) { delete data.calendar[del.dataset.deleteDate]; save(); renderCalendar(); }
  });

  $("saveWellTask").addEventListener("click", () => {
    const date = $("wellDate").value, task = $("wellTask").value.trim();
    if (!date || !task) { alert("Elige una fecha y escribe un recordatorio."); return; }
    data.calendar[date] = task; save(); $("wellTask").value = ""; renderCalendar();
  });
  $("clearEmotionHistory").addEventListener("click", () => {
    if (confirm("¿Quieres borrar los registros emocionales guardados en este navegador?")) {
      data.emotionNotes = []; save(); renderEmotions();
    }
  });
  $("fontDown").addEventListener("click", () => { data.fontScale = Math.max(.9, +(data.fontScale-.1).toFixed(1)); save(); applyA11y(); });
  $("fontUp").addEventListener("click", () => { data.fontScale = Math.min(1.3, +(data.fontScale+.1).toFixed(1)); save(); applyA11y(); });
  $("fontReset").addEventListener("click", () => { data.fontScale = 1; save(); applyA11y(); });
  $("contrastToggle").addEventListener("change", e => { data.contrast=e.target.checked; save(); applyA11y(); });
  $("motionToggle").addEventListener("change", e => { data.reducedMotion=e.target.checked; save(); applyA11y(); });

  // Etiqueta demostrativa: no crea un ranking ni compara el bienestar de estudiantes.
  const demo = document.createElement("div");
  demo.className = "demo-note";
  demo.innerHTML = `<strong>Modo demostración</strong><span>Contenido y registros de ejemplo se mantienen en este dispositivo.</span>`;
  const home = $("tab-inicio");
  if (home) home.appendChild(demo);

  // Mejora de navegación por teclado y cierre del modal con Escape.
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      const modal = $("activityModal");
      if (modal && !modal.classList.contains("hidden")) $("closeModal")?.click();
    }
  });
})();
