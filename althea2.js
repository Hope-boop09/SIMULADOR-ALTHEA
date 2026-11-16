
/* Althea Contigo 2.2 — extensión corregida
   Conserva simuladores, mapa emocional, empatía, calendario,
   centro de apoyo, avatar, compañera Althea, flor y accesibilidad.
   Los datos se guardan localmente en este navegador.
*/
(() => {
  'use strict';

  const ADDON_KEY = 'altheaContigo_2_addon_v1';
  const AVATAR_KEY = 'altheaContigo_avatar_v1';

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
    const saved = JSON.parse(localStorage.getItem(ADDON_KEY) || '{}');
    if (saved && typeof saved === 'object') {
      data = { ...defaults, ...saved };
    }
  } catch (_) {}

  const save = () => localStorage.setItem(ADDON_KEY, JSON.stringify(data));

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));

  const $ = id => document.getElementById(id);
  const root = document.querySelector('.app-shell');

  if (!root) return;

  // --------------------------------------------------
  // PESTAÑAS
  // --------------------------------------------------

  const nav = document.querySelector('.tabs');

  const extraTabs = [
    ['simuladores', '🎭 Simuladores'],
    ['emociones2', '🌈 Mapa emocional'],
    ['empatia2', '🌷 Laboratorio de empatía'],
    ['calendario2', '🗓️ Mi calendario'],
    ['apoyo2', '🧭 Centro de apoyo'],
    ['accesibilidad2', '♿ Accesibilidad'],
    ['avatar2', '🪄 Mi avatar']
  ];

  if (nav) {
    extraTabs.forEach(([id, label]) => {
      if (!nav.querySelector(`[data-tab="${id}"]`)) {
        const b = document.createElement('button');
        b.className = 'tab';
        b.dataset.tab = id;
        b.type = 'button';
        b.textContent = label;
        nav.appendChild(b);
      }
    });
  }

  const appScreen = $('appScreen');

  /*
    CORRECCIÓN PRINCIPAL:
    Ahora se reutiliza un panel existente y se actualiza su contenido.
    Antes, si el panel ya existía, la función terminaba sin hacer nada.
  */
  const addPanel = (id, html) => {
    if (!appScreen) return;

    let panel = $('tab-' + id);

    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'tab-' + id;
      appScreen.appendChild(panel);
    }

    panel.classList.add('tab-panel', 'hidden', 'addon-panel');
    panel.innerHTML = html;

    return panel;
  };

  addPanel('simuladores', `
    <p class="eyebrow">PRACTICA CON SITUACIONES FICTICIAS</p>
    <h2>Simuladores de decisiones</h2>
    <p class="muted">Explora opciones posibles ante situaciones escolares. No necesitas contar experiencias personales y puedes salir cuando quieras.</p>
    <div id="simulatorList" class="addon-grid"></div>
    <div id="simulatorStage" class="addon-card hidden" aria-live="polite"></div>
  `);

  addPanel('emociones2', `
    <p class="eyebrow">PONERLE NOMBRE A LO QUE SIENTES</p>
    <h2>Mapa emocional</h2>
    <p class="muted">Elige una emoción si te sirve. No es una evaluación ni un diagnóstico; también puedes no registrar nada.</p>
    <div class="emotion-grid" id="emotionChoices"></div>
    <div id="emotionPrompt" class="addon-card hidden" aria-live="polite"></div>
    <h3 class="addon-subhead">Mis registros de esta demostración</h3>
    <div id="emotionHistory" class="addon-list"></div>
    <button class="soft-btn" id="clearEmotionHistory" type="button">Borrar mis registros</button>
  `);

  addPanel('empatia2', `
    <p class="eyebrow">MIRAR DESDE OTRAS PERSPECTIVAS</p>
    <h2>Laboratorio de empatía</h2>
    <p class="muted">Pequeños retos para practicar escucha, respeto y apoyo sin juzgar ni presionar.</p>
    <div id="empathyList" class="addon-grid"></div>
  `);

  addPanel('calendario2', `
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

  addPanel('apoyo2', `
    <p class="eyebrow">NO TIENES QUE RESOLVER TODO A SOLAS</p>
    <h2>Centro de apoyo</h2>
    <p class="muted">Este apartado ofrece orientación general. No es un servicio de emergencia ni sustituye a profesionales.</p>

    <div class="addon-grid">
      <article class="addon-card">
        <span class="addon-icon">🏫</span>
        <h3>Dentro de tu institución</h3>
        <p>Pregunta por tutoría, orientación educativa, coordinación académica o el protocolo institucional de atención a la violencia y el acoso.</p>
      </article>

      <article class="addon-card">
        <span class="addon-icon">🤝</span>
        <h3>Personas de confianza</h3>
        <p>Puedes acercarte a una persona adulta de confianza. Comparte únicamente lo que te sientas cómodo/a contando.</p>
      </article>

      <article class="addon-card">
        <span class="addon-icon">📝</span>
        <h3>Cómo iniciar la conversación</h3>
        <p>“Hay una situación que me preocupa y quisiera saber qué opciones de apoyo existen”.</p>
      </article>

      <article class="addon-card">
        <span class="addon-icon">🛡️</span>
        <h3>Si hay riesgo inmediato</h3>
        <p>Busca ayuda de una persona adulta cercana y de los servicios de emergencia de tu localidad. No intentes manejar una situación peligrosa sin apoyo.</p>
      </article>
    </div>

    <div class="notice warning">
      Los canales y horarios de atención deben confirmarse directamente con tu institución. No inventamos teléfonos ni prometemos atención que este prototipo no puede brindar.
    </div>
  `);

  addPanel('accesibilidad2', `
    <p class="eyebrow">UNA EXPERIENCIA MÁS CÓMODA</p>
    <h2>Accesibilidad</h2>
    <p class="muted">Ajusta la presentación y elige cómo recibir la información. Estas opciones no sustituyen lectores de pantalla ni interpretación profesional en LSM.</p>

    <div class="addon-card accessibility-controls">
      <div>
        <strong>Tamaño del texto</strong>
        <div class="addon-actions">
          <button class="soft-btn" id="fontDown" type="button">A−</button>
          <button class="soft-btn" id="fontReset" type="button">Restablecer</button>
          <button class="soft-btn" id="fontUp" type="button">A+</button>
        </div>
      </div>

      <label class="addon-toggle">
        <input id="contrastToggle" type="checkbox">
        Alto contraste
      </label>

      <label class="addon-toggle">
        <input id="motionToggle" type="checkbox">
        Reducir animaciones
      </label>

      <div>
        <strong>Apoyos de comunicación</strong>
        <p class="small muted">Las indicaciones importantes también aparecen por escrito. Los avisos se muestran en pantalla y no dependen únicamente del sonido.</p>

        <button class="soft-btn" id="readPage" type="button">🔊 Leer el texto principal</button>
        <button class="soft-btn" id="stopReading" type="button">Detener lectura</button>

        <p id="a11yStatus" class="small muted" aria-live="polite">La lectura en voz alta depende de la compatibilidad del navegador.</p>
      </div>

      <div class="notice">
        Para personas sordas: se recomienda que cualquier video futuro incluya subtítulos, transcripción y, cuando esté disponible, interpretación en Lengua de Señas Mexicana (LSM). Este prototipo aún no incluye videos interpretados en LSM.
      </div>

      <div class="notice">
        Para personas ciegas: usa encabezados, botones etiquetados y navegación con teclado. El contenido generado debe revisarse con un lector de pantalla antes de publicar la plataforma como servicio accesible.
      </div>
    </div>
  `);

  addPanel('avatar2', `
    <p class="eyebrow">UN ESPACIO QUE TE REPRESENTA</p>
    <h2>Mi avatar</h2>
    <p class="muted">Crea un personaje para tu perfil. Puedes cambiarlo cuando quieras; no necesitas usar tu apariencia real.</p>

    <div class="avatar-workspace">
      <div class="avatar-preview-card">
        <div id="avatarPreview" class="avatar-preview" aria-label="Vista previa de tu avatar"></div>
        <strong id="avatarPreviewName">Mi avatar</strong>
        <p class="small muted">Así se verá tu personaje</p>
      </div>

      <div class="addon-card avatar-controls">
        <label for="avatarHair">Cabello</label>
        <select id="avatarHair">
          <option value="long">Largo</option>
          <option value="medium">Mediano</option>
          <option value="short">Corto</option>
          <option value="curly">Rizado</option>
        </select>

        <label for="avatarHairColor">Color de cabello</label>
        <select id="avatarHairColor">
          <option value="#70452f">Castaño</option>
          <option value="#3d2a25">Castaño oscuro</option>
          <option value="#242126">Negro</option>
          <option value="#b87945">Cobrizo</option>
          <option value="#d7b66d">Rubio</option>
          <option value="#805b9b">Violeta fantasía</option>
        </select>

        <label for="avatarClothes">Ropa</label>
        <select id="avatarClothes">
          <option value="#b99bd4">Vestido lila</option>
          <option value="#8c75b8">Vestido violeta</option>
          <option value="#e6a9c8">Vestido rosa</option>
          <option value="#83aeb0">Conjunto verde agua</option>
          <option value="#647da8">Conjunto azul</option>
        </select>

        <label for="avatarAccessory">Accesorio</label>
        <select id="avatarAccessory">
          <option value="flower">Flor</option>
          <option value="bow">Moño</option>
          <option value="glasses">Lentes</option>
          <option value="none">Sin accesorio</option>
        </select>

        <label for="avatarName">Nombre de tu avatar</label>
        <input id="avatarName" type="text" maxlength="20" placeholder="Ej. Estrellita">

        <div class="addon-actions">
          <button class="primary-btn" id="saveAvatar" type="button">Guardar avatar</button>
          <button class="soft-btn" id="resetAvatar" type="button">Restablecer</button>
        </div>

        <p id="avatarSavedMsg" class="small muted" aria-live="polite">Tu avatar se guarda solo en este navegador.</p>
      </div>
    </div>
  `);

  // --------------------------------------------------
  // AVATAR
  // --------------------------------------------------

  const avatarDefaults = {
    hair: 'long',
    hairColor: '#70452f',
    clothes: '#b99bd4',
    accessory: 'flower',
    name: 'Mi avatar'
  };

  let avatar = { ...avatarDefaults };

  try {
    avatar = {
      ...avatarDefaults,
      ...JSON.parse(localStorage.getItem(AVATAR_KEY) || '{}')
    };
  } catch (_) {}

  const avatarSVG = a => {
    const hairBack = a.hair === 'short'
      ? 'M34 48 Q27 7 64 8 Q101 7 94 49 L91 80 L38 80 Z'
      : a.hair === 'medium'
      ? 'M28 47 Q24 5 64 8 Q104 5 100 47 L94 91 L34 91 Z'
      : a.hair === 'curly'
      ? 'M28 47 Q15 3 43 10 Q51 -1 64 9 Q83 -2 89 13 Q112 9 100 49 L97 96 L31 96 Z'
      : 'M27 47 Q22 5 64 8 Q106 5 101 47 L99 119 Q86 137 83 94 L43 94 Q41 137 29 119 Z';

    const accessory = a.accessory === 'flower'
      ? '<g><circle cx="87" cy="29" r="5" fill="#e9a8cb"/><circle cx="87" cy="21" r="4" fill="#e9a8cb"/><circle cx="94" cy="26" r="4" fill="#e9a8cb"/><circle cx="91" cy="34" r="4" fill="#e9a8cb"/><circle cx="80" cy="26" r="4" fill="#e9a8cb"/><circle cx="87" cy="28" r="2.5" fill="#e7c86d"/></g>'
      : a.accessory === 'bow'
      ? '<path d="M82 27 Q68 12 70 31 Q73 39 84 31 Q95 42 100 30 Q101 13 86 27Z" fill="#e6a2c5"/>'
      : a.accessory === 'glasses'
      ? '<g fill="none" stroke="#59445f" stroke-width="2.5"><circle cx="51" cy="53" r="9"/><circle cx="77" cy="53" r="9"/><path d="M60 53h8"/></g>'
      : '';

    const hairFront = a.hair === 'short'
      ? 'M31 47 Q32 13 64 13 Q95 13 97 47 Q82 36 73 36 Q54 43 31 47Z'
      : 'M30 47 Q31 12 64 12 Q96 12 98 47 Q82 34 73 35 Q52 42 30 47Z';

    return `
      <svg viewBox="0 0 128 166" role="img" aria-label="Avatar ilustrado con cabello ${esc(a.hair)} y ropa personalizada">
        <path d="${hairBack}" fill="${a.hairColor}"/>
        <path d="M34 50 Q30 30 42 24 Q64 9 86 24 Q98 33 94 58 L90 82 Q83 98 64 98 Q45 98 38 82Z" fill="#f2d2bd"/>
        <path d="M48 54q5-4 10 0M70 54q5-4 10 0" stroke="#513b39" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M59 70q5 5 10 0" stroke="#b86f75" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="${hairFront}" fill="${a.hairColor}"/>
        ${accessory}
        <path d="M53 91h22l7 11 19 47H27l19-47Z" fill="${a.clothes}"/>
        <path d="M53 91q11 9 22 0" fill="none" stroke="#f7eafa" stroke-width="3"/>
        <path d="M47 109l-9 30M81 109l9 30" stroke="#f2d2bd" stroke-width="9" stroke-linecap="round"/>
        <path d="M49 149h30" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      </svg>
    `;
  };

  function renderAvatar() {
    const preview = $('avatarPreview');

    if (preview) {
      preview.innerHTML = avatarSVG(avatar);
    }

    if ($('avatarPreviewName')) {
      $('avatarPreviewName').textContent = avatar.name || 'Mi avatar';
    }

    ['Hair', 'HairColor', 'Clothes', 'Accessory', 'Name'].forEach(k => {
      const el = $('avatar' + k);
      if (el) {
        el.value = avatar[k.charAt(0).toLowerCase() + k.slice(1)] ?? '';
      }
    });

    document.querySelectorAll('[data-althea-avatar]').forEach(el => {
      el.innerHTML = avatarSVG(avatar);
      el.setAttribute('aria-label', 'Avatar de perfil');
    });
  }

  ['avatarHair', 'avatarHairColor', 'avatarClothes', 'avatarAccessory', 'avatarName'].forEach(id => {
    $(id)?.addEventListener('input', e => {
      const key = id.replace('avatar', '');
      const prop = key.charAt(0).toLowerCase() + key.slice(1);
      avatar[prop] = e.target.value;
      renderAvatar();
    });
  });

  $('saveAvatar')?.addEventListener('click', () => {
    avatar.name = ($('avatarName')?.value || '').trim() || 'Mi avatar';
    localStorage.setItem(AVATAR_KEY, JSON.stringify(avatar));
    renderAvatar();

    if ($('avatarSavedMsg')) {
      $('avatarSavedMsg').textContent = '¡Avatar guardado! Ya aparece en tu perfil en este navegador.';
    }
  });

  $('resetAvatar')?.addEventListener('click', () => {
    avatar = { ...avatarDefaults };
    localStorage.removeItem(AVATAR_KEY);
    renderAvatar();

    if ($('avatarSavedMsg')) {
      $('avatarSavedMsg').textContent = 'Se restauró el avatar inicial.';
    }
  });

  const userName = $('userName');

  if (userName && !$('#profileAvatarMini')) {
    const mini = document.createElement('span');
    mini.id = 'profileAvatarMini';
    mini.className = 'profile-avatar-mini';
    mini.dataset.altheaAvatar = '';
    userName.parentNode?.insertBefore(mini, userName);
  }

  // --------------------------------------------------
  // COMPAÑERA ALTHEA
  // --------------------------------------------------

  const home = $('#tab-inicio');

  if (home && !$('#altheaCompanion')) {
    const companion = document.createElement('article');
    companion.id = 'altheaCompanion';
    companion.className = 'althea-companion addon-card';

    companion.innerHTML = `
      <div class="companion-art" aria-hidden="true">
        <svg viewBox="0 0 150 175">
          <path d="M35 58Q24 5 76 8Q128 7 116 65L113 143H39Z" fill="#70452f"/>
          <path d="M45 52Q42 20 76 20Q110 20 108 57L103 91Q96 111 76 111Q56 111 49 91Z" fill="#f1d0bb"/>
          <path d="M57 65q6-5 12 0M82 65q6-5 12 0" stroke="#513b39" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M69 83q7 7 14 0" stroke="#bd7780" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <path d="M59 108h34l25 58H31Z" fill="#b99bd4"/>
          <path d="M59 108q17 13 34 0" fill="none" stroke="#f4e8fb" stroke-width="4"/>
          <path d="M103 31q-13-22 2-23q16 9-2 23" fill="#e6a8c8"/>
          <circle cx="105" cy="25" r="5" fill="#e6c96d"/>
        </svg>
      </div>

      <div>
        <p class="eyebrow">TU COMPAÑERA DE ALTHEA</p>
        <h3>¡Hola! Soy Althea 🌷</h3>
        <p class="companion-message" id="companionMessage">Podemos avanzar a tu ritmo. No tienes que completar todo hoy.</p>
        <button class="soft-btn" id="newCompanionMessage" type="button">Dame un mensaje amable</button>
      </div>
    `;

    home.prepend(companion);
  }

  const companionMessages = [
    'Cada pequeño paso cuenta, incluso descansar.',
    'Pedir orientación también es una forma de cuidarte.',
    'No tienes que tener todas las respuestas ahora.',
    'Tu voz merece ser escuchada con respeto.',
    'Puedes explorar las actividades a tu propio ritmo.'
  ];

  $('newCompanionMessage')?.addEventListener('click', () => {
    const current = $('companionMessage')?.textContent;
    const options = companionMessages.filter(x => x !== current);

    if ($('companionMessage')) {
      $('companionMessage').textContent =
        options[Math.floor(Math.random() * options.length)];
    }
  });

  // --------------------------------------------------
  // FLOR DEL PROGRESO
  // --------------------------------------------------

  function getProgress() {
    let original = {};

    try {
      original = JSON.parse(localStorage.getItem('altheaContigoPlus_v1') || '{}') || {};
    } catch (_) {}

    const completed = Array.isArray(original.completed)
      ? original.completed.length
      : 0;

    const xp = Number(original.xp) || 0;
    const total = 15;

    return {
      completed: Math.min(completed, total),
      xp: Math.max(0, xp),
      total,
      pct: Math.min(100, Math.round(completed / total * 100))
    };
  }

  function flowerSVG(done, total) {
    const petals = Array.from({ length: 15 }, (_, i) => `
      <ellipse
        cx="75"
        cy="29"
        rx="12"
        ry="25"
        transform="rotate(${i * 24} 75 75)"
        fill="${i < done ? '#c59bdf' : '#eee7f2'}"
        stroke="${i < done ? '#9d79bb' : '#d8cddd'}"
        stroke-width="1.5"
      />
    `).join('');

    return `
      <svg viewBox="0 0 150 190" role="img" aria-label="Flor del progreso: ${done} de ${total} pétalos florecidos">
        <path d="M75 91Q68 132 75 174" stroke="#6f9d72" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M74 145q-31-26-39 0q22 18 39 0M76 158q30-25 39-1q-20 19-39 1" fill="#9bc59b"/>
        <g transform="translate(0 5)">
          ${petals}
          <circle cx="75" cy="75" r="17" fill="#f0cc78" stroke="#d8a94d" stroke-width="2"/>
        </g>
      </svg>
    `;
  }

  function renderFlower() {
    const p = getProgress();
    let host = $('#flowerProgressCard');

    if (!host) {
      const progressPanel =
        $('#tab-progreso') ||
        $('#tab-mi-progreso') ||
        $('#tab-inicio');

      if (!progressPanel) return;

      host = document.createElement('article');
      host.id = 'flowerProgressCard';
      host.className = 'addon-card flower-progress-card';

      if (progressPanel.id === 'tab-inicio') {
        progressPanel.appendChild(host);
      } else {
        progressPanel.prepend(host);
      }
    }

    host.innerHTML = `
      <div class="flower-layout">
        <div class="flower-visual">${flowerSVG(p.completed, p.total)}</div>

        <div>
          <p class="eyebrow">CADA PASO HACE FLORECER ALGO</p>
          <h3>Tu flor del progreso 🌸</h3>

          <p class="muted">
            Has explorado <strong>${p.completed} de ${p.total}</strong>
            actividades. Cada actividad completada hace florecer un pétalo.
          </p>

          <div class="flower-meter" role="progressbar"
            aria-label="Actividades completadas"
            aria-valuemin="0"
            aria-valuemax="${p.total}"
            aria-valuenow="${p.completed}">
            <span style="width:${p.pct}%"></span>
          </div>

          <p class="small muted">
            ${p.pct}% de actividades exploradas · ${p.xp} puntos de experiencia
          </p>

          <p class="small">
            ${p.completed === p.total
              ? '¡Tu flor está completamente abierta!'
              : p.completed === 0
              ? 'Tu flor está esperando su primer pétalo.'
              : '¡Tu flor sigue creciendo a tu ritmo!'}
          </p>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------
  // ACCESIBILIDAD
  // --------------------------------------------------

  function applyA11y() {
    document.documentElement.style.setProperty('--addon-font-scale', data.fontScale);

    document.body.classList.toggle('addon-contrast', !!data.contrast);
    document.body.classList.toggle('addon-reduced-motion', !!data.reducedMotion);

    if ($('contrastToggle')) {
      $('contrastToggle').checked = !!data.contrast;
    }

    if ($('motionToggle')) {
      $('motionToggle').checked = !!data.reducedMotion;
    }
  }

  $('fontDown')?.addEventListener('click', () => {
    data.fontScale = Math.max(0.9, +(data.fontScale - 0.1).toFixed(1));
    save();
    applyA11y();
  });

  $('fontUp')?.addEventListener('click', () => {
    data.fontScale = Math.min(1.5, +(data.fontScale + 0.1).toFixed(1));
    save();
    applyA11y();
  });

  $('fontReset')?.addEventListener('click', () => {
    data.fontScale = 1;
    save();
    applyA11y();
  });

  $('contrastToggle')?.addEventListener('change', e => {
    data.contrast = e.target.checked;
    save();
    applyA11y();
  });

  $('motionToggle')?.addEventListener('change', e => {
    data.reducedMotion = e.target.checked;
    save();
    applyA11y();
  });

  $('readPage')?.addEventListener('click', () => {
    const text =
      document.querySelector('.tab-panel:not(.hidden)')?.innerText ||
      document.querySelector('#appScreen')?.innerText ||
      '';

    if (!('speechSynthesis' in window)) {
      if ($('a11yStatus')) {
        $('a11yStatus').textContent =
          'Tu navegador no ofrece lectura en voz alta. Puedes usar un lector de pantalla del sistema.';
      }
      return;
    }

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text.slice(0, 3500));
    utterance.lang = 'es-MX';

    speechSynthesis.speak(utterance);

    if ($('a11yStatus')) {
      $('a11yStatus').textContent = 'Lectura iniciada.';
    }
  });

  $('stopReading')?.addEventListener('click', () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }

    if ($('a11yStatus')) {
      $('a11yStatus').textContent = 'Lectura detenida.';
    }
  });

  // --------------------------------------------------
  // SIMULADORES
  // --------------------------------------------------

  const sims = [
    {
      id: 'exclusion',
      title: 'Exclusión en un equipo',
      desc: 'En un trabajo escolar, una persona queda fuera de la conversación.',
      q: '¿Qué respuesta puede ayudar sin aumentar el conflicto?',
      opts: [
        'Invitarla a participar y proponer que el equipo escuche todas las ideas',
        'Hacer una publicación burlándose del equipo',
        'Decidir por la persona qué debe hacer'
      ],
      a: 0,
      why: 'Abrir un espacio de participación y escuchar con respeto puede favorecer una colaboración más justa.'
    },
    {
      id: 'bystander',
      title: 'Observas burlas repetidas',
      desc: 'Notas comentarios hirientes que se repiten hacia un compañero.',
      q: '¿Cuál es un paso prudente?',
      opts: [
        'Compartir el video para que todos opinen',
        'Buscar orientación de una persona adulta o autoridad escolar',
        'Enfrentar a todos sin apoyo'
      ],
      a: 1,
      why: 'Pedir orientación permite responder con apoyo y sin exponerte a una confrontación insegura.'
    },
    {
      id: 'digital',
      title: 'Mensaje incómodo en línea',
      desc: 'En un grupo digital aparecen mensajes que humillan a alguien.',
      q: '¿Qué puedes hacer?',
      opts: [
        'Reenviarlos a otros grupos',
        'Responder con amenazas',
        'No difundirlos, usar las opciones de reporte y pedir apoyo'
      ],
      a: 2,
      why: 'Evitar la difusión y recurrir a canales responsables ayuda a reducir el daño.'
    }
  ];

  // --------------------------------------------------
  // LABORATORIO DE EMPATÍA
  // --------------------------------------------------

  const empathy = [
    [
      'Escucha sin interrumpir',
      'Una persona comparte una opinión distinta. Practica resumir lo que entendiste antes de responder.',
      'Escuchar no significa estar de acuerdo; significa dar espacio y tratar con respeto.'
    ],
    [
      'Pregunta sin presionar',
      'Alguien parece necesitar apoyo, pero no quiere hablar en ese momento.',
      'Puedes decir: “Si algún día quieres hablar o necesitas orientación, puedo ayudarte a buscarla”.'
    ],
    [
      'Evita suponer',
      'Una compañera está más callada de lo habitual.',
      'No adivines lo que ocurre. Puedes saludar con amabilidad y respetar si prefiere estar sola.'
    ]
  ];

  // --------------------------------------------------
  // MAPA EMOCIONAL
  // --------------------------------------------------

  const emotions = [
    ['😊', 'Alegría', '¿Qué pequeño momento o actividad te gustaría disfrutar hoy?'],
    ['😌', 'Calma', '¿Qué te ayuda a sentirte en un ambiente tranquilo?'],
    ['😟', 'Preocupación', '¿Hay algo pequeño que puedas organizar o alguien de confianza con quien hablar?'],
    ['😔', 'Tristeza', '¿Qué gesto amable podrías ofrecerte ahora?'],
    ['😠', 'Enojo', '¿Te serviría hacer una pausa antes de decidir cómo responder?'],
    ['😕', 'Confusión', '¿Qué pregunta podrías hacer para comprender mejor la situación?'],
    ['😴', 'Cansancio', '¿Puedes darte un descanso razonable o pedir ayuda con alguna tarea?'],
    ['🤔', 'Otra emoción', '¿Qué palabra se acerca más a lo que estás sintiendo?']
  ];

  // --------------------------------------------------
  // FUNCIONES DE RENDERIZADO
  // --------------------------------------------------

  function renderSims() {
    if (!$('simulatorList')) return;

    $('simulatorList').innerHTML = sims.map(s => `
      <article class="addon-card">
        <span class="addon-icon">🎭</span>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.desc)}</p>
        <span class="done-label">
          ${data.simulatorDone.includes(s.id) ? '✓ Explorado' : 'Reto interactivo'}
        </span>
        <button class="primary-btn" data-sim="${s.id}" type="button">
          Explorar situación
        </button>
      </article>
    `).join('');
  }

  function openSim(id) {
    const s = sims.find(x => x.id === id);
    if (!s || !$('simulatorStage')) return;

    const stage = $('simulatorStage');
    stage.classList.remove('hidden');

    stage.innerHTML = `
      <h3>${esc(s.title)}</h3>
      <p>${esc(s.desc)}</p>
      <strong>${esc(s.q)}</strong>

      <div class="addon-options">
        ${s.opts.map((o, i) => `
          <label>
            <input type="radio" name="simAnswer" value="${i}">
            ${esc(o)}
          </label>
        `).join('')}
      </div>

      <button class="primary-btn" id="checkSim" type="button">Comprobar</button>

      <div id="simFeedback" class="notice hidden" aria-live="polite"></div>
    `;

    $('#checkSim').onclick = () => {
      const pick = stage.querySelector('input[name="simAnswer"]:checked');

      if (!pick) {
        $('#simFeedback').textContent = 'Elige una opción para continuar.';
        $('#simFeedback').classList.remove('hidden');
        return;
      }

      const ok = Number(pick.value) === s.a;

      $('#simFeedback').textContent =
        (ok ? '¡Buena elección! ' : 'Puedes revisar esta alternativa.') + ' ' + s.why;

      $('#simFeedback').classList.remove('hidden');

      if (!data.simulatorDone.includes(id)) {
        data.simulatorDone.push(id);
        save();
        renderSims();
      }
    };
  }

  function renderEmotions() {
    if (!$('emotionChoices')) return;

    $('emotionChoices').innerHTML = emotions.map((e, i) => `
      <button class="emotion-choice" type="button" data-emotion="${i}">
        <span>${e[0]}</span>
        <strong>${esc(e[1])}</strong>
      </button>
    `).join('');

    if ($('emotionHistory')) {
      $('emotionHistory').innerHTML = data.emotionNotes.length
        ? [...data.emotionNotes].reverse().map(n => `
            <div class="addon-list-row">
              <span>${esc(n.emoji)} ${esc(n.label)}</span>
              <small>${esc(n.date)}</small>
            </div>
          `).join('')
        : '<p class="muted small">Aún no hay registros. Puedes usar el mapa sin guardar nada.</p>';
    }
  }

  function renderEmpathy() {
    if (!$('empathyList')) return;

    $('empathyList').innerHTML = empathy.map((e, i) => `
      <article class="addon-card">
        <span class="addon-icon">🌷</span>
        <h3>${esc(e[0])}</h3>
        <p>${esc(e[1])}</p>
        <div class="notice">${esc(e[2])}</div>
        <button class="soft-btn" data-empathy="${i}" type="button">
          ${data.empathyDone.includes(i) ? '✓ Reto explorado' : 'Marcar como explorado'}
        </button>
      </article>
    `).join('');
  }

  function renderCalendar() {
    if (!$('calendarEntries')) return;

    const entries = Object.entries(data.calendar)
      .sort((a, b) => a[0].localeCompare(b[0]));

    $('calendarEntries').innerHTML = entries.length
      ? entries.map(([date, task]) => `
          <div class="addon-list-row">
            <span>
              <strong>${esc(date)}</strong><br>
              ${esc(task)}
            </span>
            <button class="text-btn" data-delete-date="${esc(date)}" type="button">
              Eliminar
            </button>
          </div>
        `).join('')
      : '<p class="muted small">Todavía no tienes recordatorios.</p>';
  }

  // --------------------------------------------------
  // INICIALIZACIÓN DE LOS MÓDULOS
  // --------------------------------------------------

  renderSims();
  renderEmotions();
  renderEmpathy();
  renderCalendar();
  renderAvatar();
  renderFlower();
  applyA11y();

  // --------------------------------------------------
  // EVENTOS DE LOS MÓDULOS
  // --------------------------------------------------

  document.addEventListener('click', e => {
    const sim = e.target.closest('[data-sim]');
    if (sim) {
      openSim(sim.dataset.sim);
    }

    const em = e.target.closest('[data-emotion]');

    if (em) {
      const item = emotions[Number(em.dataset.emotion)];

      if (!$('emotionPrompt')) return;

      $('emotionPrompt').classList.remove('hidden');

      $('emotionPrompt').innerHTML = `
        <h3>${item[0]} ${esc(item[1])}</h3>
        <p>${esc(item[2])}</p>
        <button class="soft-btn" id="saveEmotion" type="button">Guardar registro local</button>
        <p class="small muted">El registro no se comparte y no es un diagnóstico.</p>
      `;

      $('#saveEmotion').onclick = () => {
        data.emotionNotes.push({
          emoji: item[0],
          label: item[1],
          date: new Date().toLocaleDateString('es-MX')
        });

        save();
        renderEmotions();
        $('emotionPrompt').classList.add('hidden');
      };
    }

    const emp = e.target.closest('[data-empathy]');

    if (emp) {
      const n = Number(emp.dataset.empathy);

      if (!data.empathyDone.includes(n)) {
        data.empathyDone.push(n);
      }

      save();
      renderEmpathy();
    }

    const del = e.target.closest('[data-delete-date]');

    if (del) {
      delete data.calendar[del.dataset.deleteDate];
      save();
      renderCalendar();
    }
  });

  $('saveWellTask')?.addEventListener('click', () => {
    const date = $('wellDate')?.value;
    const task = $('wellTask')?.value.trim();

    if (!date || !task) {
      alert('Elige una fecha y escribe un recordatorio.');
      return;
    }

    data.calendar[date] = task;
    save();

    $('wellTask').value = '';
    renderCalendar();
  });

  $('clearEmotionHistory')?.addEventListener('click', () => {
    if (confirm('¿Quieres borrar los registros emocionales guardados en este navegador?')) {
      data.emotionNotes = [];
      save();
      renderEmotions();
    }
  });

  // --------------------------------------------------
  // AVISO DE MODO DEMOSTRACIÓN
  // --------------------------------------------------

  if (home && !home.querySelector('.demo-note')) {
    const demo = document.createElement('div');
    demo.className = 'demo-note';

    demo.innerHTML = `
      <strong>Modo demostración</strong>
      <span>Contenido y registros de ejemplo se mantienen en este dispositivo.</span>
    `;

    home.appendChild(demo);
  }

  // --------------------------------------------------
  // CIERRE DE MODALES
  // --------------------------------------------------

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const modal = $('activityModal');

      if (modal && !modal.classList.contains('hidden')) {
        $('#closeModal')?.click();
      }
    }
  });

  // --------------------------------------------------
  // ACTUALIZACIÓN DE PROGRESO
  // --------------------------------------------------

  window.addEventListener('storage', renderFlower);

  const originalRender = window.render;

  if (
    typeof originalRender === 'function' &&
    !originalRender.__altheaFlowerWrapped
  ) {
    const wrapped = function(...args) {
      const result = originalRender.apply(this, args);
      renderFlower();
      return result;
    };

    wrapped.__altheaFlowerWrapped = true;
    window.render = wrapped;
  }

  // Mantiene actualizada la flor si cambian las actividades.
  setInterval(renderFlower, 2500);

})();
