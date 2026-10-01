/* =====================================================================
   HIGH LINE FITNESS — COMPONENTES E INTERAÇÕES
   Não é preciso editar este arquivo para trocar conteúdo: use window.HL.
   ===================================================================== */
(function () {
  "use strict";
  const HL = window.HL;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const isVid = s => /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(s || "");
  const ico = id => `<svg><use href="#i-${id}"/></svg>`;
  const ph = t => `<span class="tp">[ ${esc(t)} ]</span>`;
  const val = (v, t) => (v ? esc(v) : ph(t));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MODS = { natacao: "Natação", pilates: "Pilates", lutas: "Lutas", cross: "Cross Training", danca: "Dança", bale: "Balé", musculacao: "Musculação" };

  let holdFit = false; /* segura a animação do título do Fitness enquanto a cortina está fechada */

  /* Registro de objetos para modais (professores e listas de vídeo) */
  const REG = {}; let regN = 0;
  const reg = o => { const k = "r" + regN++; REG[k] = o; return k; };

  /* ---------------- Mídia / placeholder ---------------- */
  function Slot({ src = "", poster = "", label = "", alt = "", type, cls = "", auto = false } = {}) {
    const kind = type || (isVid(src) ? "video" : "img");
    if (!src) {
      return `<div class="slot is-empty ${cls}"><div class="slot__ph">${ico(kind === "video" ? "vid" : "img")}<span>${esc(label)}</span></div></div>`;
    }
    if (isVid(src)) {
      if (!auto && poster) return `<div class="slot ${cls}"><img src="${esc(poster)}" alt="${esc(alt)}" loading="lazy" decoding="async"></div>`;
      return `<div class="slot ${cls}"><video data-src="${esc(src)}" ${poster ? `poster="${esc(poster)}"` : ""} ${auto ? "" : 'class="noauto"'} muted loop playsinline preload="none"></video></div>`;
    }
    return `<div class="slot ${cls}"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async"></div>`;
  }

  /* ---------------- Links (WhatsApp / inscrição) ---------------- */
  const NOCFG = "#configurar-link";
  function waHref(key, custom) {
    const n = (custom || HL.contato.whatsapp || "").replace(/\D/g, "");
    const m = (HL.whatsappMensagens[key] || HL.whatsappMensagens.geral).msg;
    return n ? `https://wa.me/${n}?text=${encodeURIComponent(m)}` : NOCFG + "-whatsapp";
  }
  const linkHref = (url, fallbackKey) => url || HL.links[fallbackKey] || NOCFG + "-" + fallbackKey;
  function bindLinks(root = document) {
    $$("[data-wa]", root).forEach(a => a.href = waHref(a.dataset.wa, a.dataset.waNum));
    $$("[data-link]", root).forEach(a => a.href = linkHref(a.dataset.url, a.dataset.link));
  }
  let toastT;
  function toast(msg) {
    let t = $("#toast");
    if (!t) {
      t = document.createElement("div"); t.id = "toast";
      t.style.cssText = "position:fixed;left:50%;bottom:calc(90px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:300;background:var(--chalk);color:var(--ink);padding:14px 20px;font:700 14px/1.3 var(--display);max-width:calc(100vw - 40px);text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.4)";
      t.setAttribute("role", "status"); document.body.appendChild(t);
    }
    t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2600);
  }
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href^='#configurar-link']");
    if (!a) return;
    e.preventDefault();
    const what = a.getAttribute("href").replace("#configurar-link-", "");
    toast(what === "whatsapp" ? "[ LINK WHATSAPP ] ainda não configurado" : what === "inscricao" ? "[ LINK DE INSCRIÇÃO ] ainda não configurado" : what === "catalogo" ? "[ LINK DO CATÁLOGO ] ainda não configurado" : `[ LINK ${what.toUpperCase()} ] ainda não configurado`);
  });

  /* =================================================================
     COMPONENTES
     ================================================================= */

  /* Botão WhatsApp (inline) */
  const WhatsAppButton = (key, label = "Falar no WhatsApp", cls = "btn--ghost", num = "") =>
    `<a class="btn ${cls}" data-wa="${key}" ${num ? `data-wa-num="${esc(num)}"` : ""} target="_blank" rel="noopener"><svg class="wa-ico"><use href="#i-wa"/></svg>${esc(label)}</a>`;

  const CTASection = (key, link, dark) =>
    `<div class="btns"><a class="btn ${dark ? "btn--ink" : "btn--red"}" data-link="inscricao" ${link ? `data-url="${esc(link)}"` : ""} target="_blank" rel="noopener">Fazer inscrição</a>${WhatsAppButton(key)}</div>`;

  /* Professor */
  function ProfessorCard(p) {
    const k = reg(p);
    return `<button class="pcard" data-prof="${k}" aria-label="Ver perfil ${esc(p.nome || "do professor")}">
      ${Slot({ src: p.foto, alt: p.nome, label: "[ Inserir foto professor ]" })}
      <span class="pcard__n">${val(p.nome, "Nome do professor")}</span>
      <span class="pcard__m"><span class="meta">${p.modalidade ? esc(p.modalidade) : p._mod ? esc(p._mod) : ph("Modalidade")}</span><span class="meta">CREF ${val(p.cref, "CREF")}</span></span>
      <span class="pcard__more">Ver perfil</span>
    </button>`;
  }
  function ProfessorModal(p) {
    const list = a => (a && a.length ? a.map(esc).join(", ") : "");
    const f = (k, v, t, wide) => `<div${wide ? ' class="wide"' : ""}><dt class="meta">${k}</dt><dd>${val(v, t)}</dd></div>`;
    return `<div class="pm">
      ${Slot({ src: p.foto, alt: p.nome, label: "[ Inserir foto professor ]" })}
      <div class="pm__b">
        <span class="tag ${p.unidade === "expansao" ? "tag--exp" : ""}">${p.unidade === "expansao" ? "Expansão High Line" : "High Line Fitness"}</span>
        <h3 class="d d-m">${val(p.nome, "Nome do professor")}</h3>
        <dl>
          ${f("Modalidade", p.modalidade || p._mod, "Modalidade")}
          ${f("CREF", p.cref, "CREF")}
          ${f("Formação", p.formacao, "Formação", 1)}
          ${f("Especializações", list(p.especializacoes), "Especializações", 1)}
          ${f("Experiência", p.experiencia, "Experiência", 1)}
          ${f("Modalidades", list(p.modalidades), "Modalidades")}
          ${f("Horários", p.horarios, "Horários")}
        </dl>
        ${p.video ? `<div><p class="meta" style="margin:0 0 10px">Vídeo (opcional)</p>${Slot({ src: p.video, label: "[ Inserir vídeo do professor ]", type: "video", auto: true })}</div>` : ""}
        <div class="btns">${WhatsAppButton(p._wa || "geral", "Falar no WhatsApp", "btn--red", p.whatsapp)}</div>
      </div>
    </div>`;
  }
  const profList = (u, mods) => {
    const l = HL.professores.filter(p => (p.unidade || "fitness") === u);
    if (l.length) return l.map(p => ({ ...p, _wa: u === "fitness" ? "musculacao" : "expansao" }));
    return mods.map(m => ({ _ph: true, unidade: u, _mod: m, _wa: u === "fitness" ? "musculacao" : "expansao" }));
  };

  /* Nav de atividade */
  const ActivityCard = a =>
    `<a class="anav" href="#${a.id}" data-publicos="${esc((a.publicos || []).join(" "))}"><span class="anav__hex" aria-hidden="true">${a.icone}</span><span class="anav__n">${esc(a.nome)}</span></a>`;

  /* Topo da mini landing de cada atividade */
  const HeroSection = a => `<div class="act__txt">
      <span class="act__icon" aria-hidden="true">${a.icone}</span>
      <span class="tag ${a.estilo === "bale" ? "" : "tag--exp"}">Expansão High Line</span>
      <h2 class="d d-l rv">${esc(a.nome)}</h2>
      <p class="lead">${a.texto ? esc(a.texto) : ph(`Texto institucional — ${a.nome}`)}</p>
      ${a.semProfessor ? `<div class="btns"><a class="btn btn--red" data-link="catalogo" ${a.catalogo ? `data-url="${esc(a.catalogo)}"` : ""} target="_blank" rel="noopener">Ver catálogo →</a>${WhatsAppButton(a.id)}</div>` : CTASection(a.id, a.link, a.estilo === "bale")}
    </div>`;

  /* Seção completa de atividade */
  function ActivitySection(a, i) {
    const cls = ["act", i % 2 ? "act--flip" : "", a.estilo ? "act--" + a.estilo : ""].join(" ");
    const fotos = [0, 1, 2].map(k => { const f = (a.fotos || [])[k]; const src = typeof f === "string" ? f : (f && f.src) || ""; return Slot({ src, alt: (f && f.alt) || a.nome, label: `[ Foto ${a.nome} ${k + 1} ]` }); }).join("");
    const info = a.info.map(([k, v]) => `<div><dt class="meta">${esc(k)}</dt><dd>${val(v, k)}</dd></div>`).join("");

    let side = "";
    if (a.videoProfessor) {
      const vk = reg([{ titulo: a.videoProfessor.rotulo, src: a.videoProfessor.src, poster: a.videoProfessor.poster, formato: "horizontal" }]);
      side += `<button class="vcard" data-vlist="${vk}" data-vi="0" style="text-align:left">${Slot({ src: a.videoProfessor.src, poster: a.videoProfessor.poster, label: `[ ${a.videoProfessor.rotulo} ]`, type: "video" })}
        <span class="vcard__play"><span class="vcard__btn">${ico("play")}</span><span class="vcard__t">${esc(a.videoProfessor.rotulo)}</span></span></button>`;
    }
    if (!a.semProfessor) {
      const p = a.professor || { _ph: true, _mod: a.nome, unidade: "expansao" };
      p._wa = a.id; p.unidade = "expansao";
      const k = reg(p);
      side += `<p class="meta" style="margin:8px 0 0">Professor(a)</p>
        <button class="mini-prof" data-prof="${k}">
          ${Slot({ src: p.foto, alt: p.nome, label: "Foto" })}
          <span style="display:grid;gap:6px"><span class="pcard__n">${val(p.nome, "Nome do professor")}</span>
          <span class="meta">Formação: ${val(p.formacao, "Formação")}</span><span class="meta">CREF ${val(p.cref, "CREF")}</span>
          <span class="pcard__more">Ver perfil completo</span></span>
        </button>`;
    } else {
      if (a.ambiente) side += Slot({ src: a.ambiente, alt: `Ambiente — ${a.nome}`, cls: "slot--h" });
    }

    let extra = "";
    if (a.submodalidades) {
      const subs = a.submodalidades.length ? a.submodalidades : [{}, {}, {}];
      extra += `<h3 class="d d-m act__block-t">${a.id === "lutas" ? "Modalidades de luta" : "Modalidades de dança"}</h3><div class="subs">` +
        subs.map((s, k) => {
          const vk = reg([{ titulo: s.nome || `Modalidade ${k + 1}`, src: s.video, formato: "horizontal" }]);
          return `<article class="sub">
          ${Slot({ src: s.foto, alt: s.nome, label: "[ Foto da modalidade ]", cls: "slot--h" })}
          <div class="sub__b">
            <h4 class="pcard__n" style="margin:0">${val(s.nome, "Nome da modalidade")}</h4>
            <p style="margin:0;font-size:14px">${val(s.descricao, "Descrição")}</p>
            <dl><div><dt>Professor</dt><dd>${val(s.professor, "Nome")}</dd></div><div><dt>Formação</dt><dd>${val(s.formacao, "Formação")}</dd></div>
            <div><dt>CREF</dt><dd>${val(s.cref, "CREF")}</dd></div><div><dt>Horários</dt><dd>${val(s.horarios, "Horários")}</dd></div></dl>
            <div class="btns" style="margin-top:6px"><button class="btn btn--ghost btn--sm" data-vlist="${vk}" data-vi="0">▶ Vídeo</button>
            <a class="btn btn--red btn--sm" data-link="inscricao" ${s.link ? `data-url="${esc(s.link)}"` : ""} target="_blank" rel="noopener">Inscrição</a></div>
          </div></article>`;
        }).join("") + `</div>`;
    }

    return `<section class="${cls}" id="${a.id}" data-wa-ctx="${a.id}" ${a.trilha ? `data-trilha="${a.trilha}"` : ""}>
      <div class="wrap">
        <div class="act__top">
          ${HeroSection(a)}
          <div class="act__media">${Slot({ src: a.video, poster: a.poster, label: `[ Inserir vídeo institucional — ${a.nome} ]`, type: "video", auto: true })}${(a.fotos || []).length ? `<div class="act__row">${fotos}</div>` : ""}</div>
        </div>
        ${side ? `<div class="act__grid"><dl class="info">${info}</dl><div class="side">${side}</div></div>` : `<div class="act__grid act__grid--solo"><dl class="info">${info}</dl></div>`}
        ${extra}
      </div>
    </section>`;
  }

  /* Vídeo */
  function VideoCard(v, listKey, i) {
    const vert = (v.formato || "vertical") === "vertical";
    return `<button class="vcard ${vert ? "is-v" : "is-h"}" data-vlist="${listKey}" data-vi="${i}">
      ${Slot({ src: v.src, poster: v.poster, alt: v.titulo, label: `[ Inserir vídeo — ${v.titulo || "vídeo"} ]`, type: "video", cls: vert ? "slot--v" : "slot--h" })}
      <span class="vcard__play"><span class="vcard__btn">${ico("play")}</span><span class="vcard__t">${esc(v.titulo || "")}</span></span>
    </button>`;
  }

  /* Depoimentos */
  const stars = n => (n ? `<span class="stars" aria-label="${n} de 5 estrelas">${"★".repeat(Math.max(0, Math.min(5, +n)))}</span>` : "");
  const unitTag = d => `<span class="tst__unit">${d.unidade === "expansao" ? "Expansão High Line" : "High Line Fitness"}${d.modalidade && MODS[d.modalidade] ? " / " + MODS[d.modalidade] : d._mod ? " / " + esc(d._mod) : ""}</span>`;
  const complete = d => !!(d.destaque || (d.video && d.foto && d.depoimento && d.nome));

  function VideoTestimonial(d) {
    const vk = reg([{ titulo: d.nome || "Depoimento", src: d.video, poster: d.poster, formato: "vertical" }]);
    const full = complete(d) || d._full;
    return `<article class="tst tst--video ${full ? "is-full" : ""}" data-tipo="video" data-mod="${esc(d.modalidade || d._modId || "")}">
      ${d._full ? `<span class="tst__badge">Layout de destaque</span>` : ""}
      ${Slot({ src: d.video, poster: d.poster || d.foto, alt: d.nome, label: "[ Vídeo do aluno ]", type: "video", cls: "slot--v" })}
      <div class="tst__body">
        ${unitTag(d)}
        <span class="tst__n">${val(d.nome, "Nome do aluno")}</span>
        ${d.tempoComoAluno ? `<span class="meta">${esc(d.tempoComoAluno)}</span>` : ""}
        ${stars(d.avaliacao)}
        ${full ? `<p class="q" style="margin:0;font-style:italic">“${d.depoimento ? esc(d.depoimento) : "[ Depoimento real do aluno ]"}”</p>` : ""}
        <button class="btn btn--red btn--sm" data-vlist="${vk}" data-vi="0">▶ Assistir depoimento</button>
      </div>
    </article>`;
  }
  function StudentTestimonial(d) {
    return `<article class="tst tst--text" data-tipo="texto" data-mod="${esc(d.modalidade || d._modId || "")}">
      ${unitTag(d)}
      <p class="q">${d.depoimento ? esc(d.depoimento) : "[ Depoimento real do aluno ]"}</p>
      ${stars(d.avaliacao)}
      <div class="tst__who">${Slot({ src: d.foto, alt: d.nome, label: "Foto" })}
        <div><div class="tst__n">— ${val(d.nome, "Nome")}</div>${d.tempoComoAluno ? `<div class="meta" style="margin-top:4px">${esc(d.tempoComoAluno)}</div>` : ""}</div></div>
    </article>`;
  }
  function TestimonialCard(d) { /* depoimento de professor */
    const vk = reg([{ titulo: d.nome || "Professor", src: d.video, poster: d.foto, formato: "vertical" }]);
    return `<article class="tst" style="gap:0">
      <button data-vlist="${vk}" data-vi="0" style="position:relative;display:block;width:100%">
        ${Slot({ src: d.video || d.foto, poster: d.foto, alt: d.nome, label: "[ Foto / vídeo do professor ]", cls: "slot--p" })}
        <span class="vcard__play" style="z-index:3"><span class="vcard__btn">${ico("play")}</span></span>
      </button>
      <div style="padding:22px;display:grid;gap:10px">
        <span class="tst__n">${val(d.nome, "Nome do professor")}</span>
        <span class="meta">${val(d.cargo, "Cargo")} / ${val(d.modalidade, "Modalidade")}</span>
        <p style="margin:6px 0 0;font-style:italic;color:rgba(242,240,238,.82)">“${d.depoimento ? esc(d.depoimento) : "[ Depoimento do professor ]"}”</p>
      </div>
    </article>`;
  }
  function TestimonialCarousel(el, list) {
    el.innerHTML = list.map(d => (d.tipo === "video" || (!d.tipo && d.video) ? VideoTestimonial(d) : StudentTestimonial(d))).join("") +
      `<div class="empty" data-empty hidden>Ainda não há depoimentos nesta categoria.</div>`;
  }

  /* Galeria */
  function Gallery(el, list) {
    const ratios = ["4/5", "1/1", "3/4", "4/3", "1/1", "4/5"];
    const lk = reg(list.map(g => ({ titulo: g.legenda || g._lbl, src: g.src, formato: "horizontal", img: true })));
    el.innerHTML = list.map((g, i) => `<button class="gal__i" data-cat="${esc(g.categoria)}" data-vlist="${lk}" data-vi="${i}">
      ${Slot({ src: g.src, alt: g.legenda, label: g._lbl || g.legenda || "" }).replace('class="slot', `style="--r:${ratios[i % ratios.length]}" class="slot`)}
    </button>`).join("");
  }

  /* Planos */
  function PlanCard(p, i) {
    const ben = p.beneficios && p.beneficios.length ? p.beneficios.map(b => `<li>${esc(b)}</li>`).join("") : [1, 2, 3, 4].map(() => `<li>${ph("Benefício")}</li>`).join("");
    const mods = p.modalidades && p.modalidades.length ? p.modalidades.map(m => `<span class="pill">${esc(m)}</span>`).join(" ") : ph("Modalidades incluídas");
    return `<article class="plan ${p.destaque ? "is-hot" : ""}">
      <div style="display:grid;gap:10px">
        ${p.exemplo ? `<span class="meta">Estrutura de exemplo</span>` : ""}
        <span class="plan__name">${val(p.nome, `Nome do plano ${i + 1}`)}</span>
        <p style="margin:0;font-size:14px;color:var(--steel)">${val(p.descricao, "Descrição")}</p>
      </div>
      <div class="plan__price">${p.preco ? esc(p.preco) : `<span style="opacity:.35">[ Preço ]</span>`}<small>${p.periodo ? esc(p.periodo) : ""}</small></div>
      <ul>${ben}</ul>
      <div style="display:flex;flex-wrap:wrap;gap:6px">${mods}</div>
      <p class="plan__obs">${val(p.observacoes, "Observações")}</p>
      <a class="btn ${p.destaque ? "btn--ink" : "btn--red"}" data-link="inscricao" ${p.link ? `data-url="${esc(p.link)}"` : ""} target="_blank" rel="noopener">Fazer inscrição</a>
    </article>`;
  }
  function PlanComparison(el, cfg, nCols = 3) {
    const cols = cfg.colunas && cfg.colunas.length ? cfg.colunas.map(esc) : Array.from({ length: nCols }, (_, i) => `[ Plano ${i + 1} ]`);
    const rows = cfg.linhas && cfg.linhas.length ? cfg.linhas : Array.from({ length: 5 }, () => ({ _ph: true }));
    const cell = v => v === true ? `<span class="yes" aria-label="Incluído">✓</span>` : v === false ? `<span class="no" aria-label="Não incluído">—</span>` : v ? esc(v) : `<span class="tp">[ — ]</span>`;
    el.innerHTML = `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Recurso</th>${cols.map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody>
      ${rows.map(r => `<tr><td>${r._ph ? ph("Recurso / benefício") : esc(r.recurso)}</td>${cols.map((_, i) => `<td>${cell((r.valores || [])[i])}</td>`).join("")}</tr>`).join("")}
      </tbody></table></div>`;
  }

  /* Horários */
  function Schedule() {
    const days = [["seg", "Seg"], ["ter", "Ter"], ["qua", "Qua"], ["qui", "Qui"], ["sex", "Sex"], ["sab", "Sáb"]];
    const dEl = $("#days"), sEl = $("#sched");
    const today = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"][new Date().getDay()];
    let cur = days.some(d => d[0] === today) ? today : "seg";
    dEl.innerHTML = days.map(([k, l]) => `<button class="day" role="tab" data-d="${k}">${l}</button>`).join("");
    const render = () => {
      $$(".day", dEl).forEach(b => { b.classList.toggle("on", b.dataset.d === cur); b.setAttribute("aria-selected", b.dataset.d === cur); });
      const rows = HL.horarios.filter(h => h.dia === cur).sort((a, b) => String(a.horario).localeCompare(String(b.horario)));
      const head = `<thead><tr><th>Horário</th><th>Atividade</th><th>Professor</th><th>Modalidade</th><th>Vagas</th></tr></thead>`;
      const body = rows.length
        ? rows.map(h => `<tr><td><b>${esc(h.horario)}</b></td><td>${esc(h.atividade)}</td><td>${esc(h.professor)}</td><td>${esc(h.modalidade)}</td><td>${esc(h.vagas)}</td></tr>`).join("")
        : `<tr class="sched__empty"><td>[ Horário ]</td><td>[ Atividade ]</td><td>[ Professor ]</td><td>[ Modalidade ]</td><td>[ Vagas ]</td></tr>`;
      sEl.innerHTML = `<div class="tbl-wrap"><table class="tbl">${head}<tbody>${body}</tbody></table></div>` +
        (rows.length ? "" : `<p class="note">${HL.horarios.length ? "Sem aulas cadastradas neste dia." : "Os horários aparecem aqui assim que forem cadastrados em HL.horarios."}</p>`);
    };
    dEl.addEventListener("click", e => { const b = e.target.closest(".day"); if (b) { cur = b.dataset.d; render(); } });
    render();
  }

  /* Localização */
  function LocationSection() {
    const c = HL.contato;
    const map = c.mapsEmbed
      ? `<div class="slot"><iframe src="${esc(c.mapsEmbed)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Mapa da High Line"></iframe></div>`
      : `<div class="slot is-empty"><div class="slot__ph">${ico("pin")}<span>[ Inserir mapa — Google Maps ]</span></div></div>`;
    $("#loc").innerHTML = map + `<div class="loc__info">
      <dl>
        <div><dt class="meta">Endereço</dt><dd>${val(c.endereco, "Endereço")}</dd></div>
        <div><dt class="meta">Telefone</dt><dd>${val(c.telefone, "Telefone")}</dd></div>
        <div><dt class="meta">WhatsApp</dt><dd>${c.whatsapp ? esc(c.whatsapp) : ph("WhatsApp")}</dd></div>
        <div><dt class="meta">Horário de funcionamento</dt><dd>${val(c.horarioFuncionamento, "Horários")}</dd></div>
      </dl>
      <div class="btns"><a class="btn btn--light" href="${c.mapsLink ? esc(c.mapsLink) : NOCFG + "-maps"}" target="_blank" rel="noopener">Abrir no Google Maps</a>${WhatsAppButton("geral")}</div>
    </div>`;
  }

  /* =================================================================
     RENDERIZAÇÃO
     ================================================================= */
  function render() {
    /* Mídias fixas */
    if (HL.midia.aberturaVideo) $("#openMedia").outerHTML = Slot({ src: HL.midia.aberturaVideo, poster: HL.midia.aberturaVideoPoster, cls: "slot--cover", auto: true });
    $$("[data-media]").forEach(el => {
      const k = el.dataset.media, tmp = document.createElement("div");
      const fb = el.dataset.fallback, src = HL.midia[k] || (fb ? HL.midia[fb] : ""), cls = [...el.classList].filter(c => c !== "slot").join(" ");
      tmp.innerHTML = !src && el.dataset.optional
        ? `<div class="deco deco--${el.dataset.optional} ${cls}" aria-hidden="true"></div>`
        : Slot({ src, poster: HL.midia[k + "Poster"] || (fb ? HL.midia[fb + "Poster"] : ""), label: el.dataset.label, type: el.dataset.type, auto: true, cls });
      el.replaceWith(tmp.firstElementChild);
    });

    /* Números */
    $("#nums").innerHTML = HL.numeros.map(n => {
      const num = n.valor !== "" && !isNaN(+n.valor);
      return `<div class="num"><div class="num__v ${n.valor ? "" : "is-ph"}" ${num ? `data-count="${+n.valor}" data-pre="${esc(n.prefixo)}"` : ""}>${n.valor ? esc(n.prefixo + n.valor) : esc(n.placeholder)}</div><div class="num__l meta">${esc(n.rotulo)}</div></div>`;
    }).join("");

    /* Timeline */
    $("#timeline").innerHTML = HL.historia.map(h => `<div class="tl__i">
      <span class="meta">${val(h.ano, "Ano")}</span>
      <span class="tl__step">${esc(h.etapa)}</span>
      <strong>${val(h.titulo, "Título")}</strong>
      <p>${val(h.descricao, "Descrição")}</p>
      ${h.video || h.imagem ? Slot({ src: h.video || h.imagem, alt: h.titulo || h.etapa, cls: "slot--h", auto: true }) : ""}
    </div>`).join("");

    /* Estrutura */
    $("#bento").innerHTML = HL.estrutura.map(e => `<div class="bento__t">${Slot({ src: e.imagem, alt: e.titulo, label: `[ Foto — ${e.titulo} ]`, auto: true })}<span class="bento__lbl">${esc(e.titulo)}</span></div>`).join("");

    /* Vídeos fitness */
    const vfk = reg(HL.videosFitness);
    $("#videosFitness").innerHTML = HL.videosFitness.map((v, i) => VideoCard(v, vfk, i)).join("");

    /* Professores */
    $("#railProfFitness").innerHTML = profList("fitness", ["Musculação", "Musculação", "Treinamento", "Performance"]).map(ProfessorCard).join("");
    $("#railProfExp").innerHTML = profList("expansao", ["Natação", "Pilates", "Lutas", "Cross Training", "Dança", "Balé"]).map(ProfessorCard).join("");

    /* Depoimentos de professores */
    const dp = HL.depoimentosProfessores.length ? HL.depoimentosProfessores : [{}, {}, {}];
    $("#railStaff").innerHTML = dp.map(TestimonialCard).join("");

    /* Depoimentos de alunos (reais) */
    const dFit = HL.depoimentos.filter(d => (d.unidade || "fitness") === "fitness");
    const dExp = HL.depoimentos.filter(d => d.unidade === "expansao");
    TestimonialCarousel($("#tstFitness"), dFit.length ? dFit : [
      { tipo: "video", unidade: "fitness", _full: true }, { tipo: "texto", unidade: "fitness" }, { tipo: "texto", unidade: "fitness" }]);
    TestimonialCarousel($("#tstExp"), dExp.length ? dExp : Object.keys(MODS).filter(m => m !== "musculacao").map((m, i) =>
      ({ tipo: i % 2 ? "texto" : "video", unidade: "expansao", _modId: m, modalidade: m })));

    /* Galeria */
    const cats = [["musculacao", "Musculação"], ["cardio", "Cardio"], ["equipamentos", "Equipamentos"], ["ambientes", "Ambientes"]];
    Gallery($("#gal"), HL.galeria.length ? HL.galeria : Array.from({ length: 8 }, (_, i) => ({ categoria: cats[i % 4][0], _lbl: `[ Foto — ${cats[i % 4][1]} ]` })));

    /* Planos */
    $("#plansFitness").innerHTML = (HL.planosFitness.length ? HL.planosFitness : [{}, {}, {}]).map(PlanCard).join("");
    PlanComparison($("#cmpFitness"), HL.comparadorFitness, Math.max(HL.planosFitness.length, 3));
    $("#plansExp").innerHTML = HL.planosExpansao.map(PlanCard).join("");
    PlanComparison($("#cmpGeral"), HL.comparadorGeral);

    /* Atividades */
    $("#actsNav").innerHTML = HL.atividades.map(ActivityCard).join("");
    $("#actSections").innerHTML = HL.atividades.map(ActivitySection).join("");

    /* Mosaico de vídeos */
    const ve = HL.videosExperiencias.length ? HL.videosExperiencias :
      ["Momentos da academia", "Natação", "Cross", "Dança e balé", "Momentos da Expansão"].map(t => ({ titulo: t, formato: "vertical" }));
    const vek = reg(ve.map(v => ({ ...v, formato: "vertical" })));
    $("#mosaic").innerHTML = ve.map((v, i) => VideoCard({ ...v, formato: "vertical" }, vek, i)).join("");

    Schedule();
    LocationSection();

    /* Redes */
    const redes = [["instagram", "Instagram", "ig"], ["facebook", "Facebook", "fb"], ["tiktok", "TikTok", "tt"], ["youtube", "YouTube", "yt"]];
    $("#social").innerHTML = redes.map(([k, n, i]) => `<a class="soc" href="${HL.links[k] ? esc(HL.links[k]) : NOCFG + "-" + k}" target="_blank" rel="noopener">
      <span><span class="soc__n">${n}</span><div class="soc__h">${HL.redesArroba[k] ? esc(HL.redesArroba[k]) : "[ @perfil ]"}</div></span>${ico(i)}</a>`).join("");
    $("#footRedes").innerHTML = redes.map(([k, n]) => `<li><a href="${HL.links[k] ? esc(HL.links[k]) : NOCFG + "-" + k}" target="_blank" rel="noopener">${n}</a></li>`).join("");
    const c = HL.contato;
    $("#footContato").innerHTML = `<li><a data-wa="geral" target="_blank" rel="noopener">WhatsApp ${c.whatsapp ? esc(c.whatsapp) : ph("número")}</a></li>
      <li>${val(c.telefone, "Telefone")}</li><li>${c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : ph("E-mail")}</li><li>${val(c.endereco, "Endereço")}</li>`;
    $("#year").textContent = new Date().getFullYear();

    /* Experiência personalizada */
    $("#persOpts").innerHTML = HL.personalizar.map((o, i) => `<button class="popt ${i ? "" : "on"}" data-p="${o.id}" aria-pressed="${!i}">${esc(o.rotulo)}</button>`).join("");

    bindLinks();
  }

  /* =================================================================
     INTERAÇÕES
     ================================================================= */

  /* Carrosséis */
  function initRails() {
    $$(".rail-ctl[data-for]").forEach(c => {
      const rail = document.getElementById(c.dataset.for);
      c.innerHTML = `<button aria-label="Anterior">${ico("l")}</button><button aria-label="Próximo">${ico("r")}</button>`;
      const [p, n] = $$("button", c);
      const go = d => rail.scrollBy({ left: d * rail.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
      p.onclick = () => go(-1); n.onclick = () => go(1);
    });
  }

  /* Filtros (depoimentos e galeria) */
  function initFilters() {
    $$("[data-filter-for]").forEach(group => {
      const target = document.getElementById(group.dataset.filterFor);
      group.addEventListener("click", e => {
        const b = e.target.closest(".chip"); if (!b) return;
        $$(".chip", group).forEach(x => x.classList.toggle("on", x === b));
        const f = b.dataset.f; let shown = 0;
        [...target.children].forEach(el => {
          if (el.hasAttribute("data-empty")) return;
          const ok = f === "todos" || el.dataset.tipo === f || el.dataset.mod === f || el.dataset.cat === f;
          el.hidden = !ok; if (ok) shown++;
        });
        const em = $("[data-empty]", target); if (em) em.hidden = shown > 0;
        target.scrollLeft = 0;
      });
    });
    /* Filtro de atividades por público */
    $("#actFilter").addEventListener("click", e => {
      const b = e.target.closest(".chip"); if (!b) return;
      $$("#actFilter .chip").forEach(x => x.classList.toggle("on", x === b));
      const f = b.dataset.f, note = $("#actFilterNote"); let n = 0;
      $$(".anav").forEach(a => { const ok = f === "todas" || a.dataset.publicos.split(" ").includes(f); a.classList.toggle("dim", !ok); if (ok) n++; });
      note.hidden = n > 0;
      note.textContent = `Nenhuma atividade marcada como “${b.textContent}” ainda. Defina os públicos em HL.atividades[].publicos.`;
      if (!n) $$(".anav").forEach(a => a.classList.remove("dim"));
    });
  }

  /* Experiência personalizada */
  function initPersonalizar() {
    const res = $("#persRes");
    const nameOf = id => id === "fitness" ? { nome: "Musculação", icone: "🏋️", href: "#fitness" } : (() => { const a = HL.atividades.find(x => x.id === id); return a ? { nome: a.nome, icone: a.icone, href: "#" + a.id } : null; })();
    const show = id => {
      const o = HL.personalizar.find(x => x.id === id);
      $$(".popt").forEach(b => { const on = b.dataset.p === id; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
      const items = o.atividades.map(nameOf).filter(Boolean);
      res.innerHTML = `<span class="meta">Seu foco</span><h3 class="d d-m">${esc(o.rotulo)}</h3>
        ${items.length ? `<p class="lead" style="font-size:16px">Atividades relacionadas:</p><div class="pers__list">${items.map(it => `<a class="pers__item" href="${it.href}"><span>${it.icone}&nbsp; ${esc(it.nome)}</span>${ico("r").replace("<svg>", '<svg style="width:16px;height:16px">')}</a>`).join("")}</div>`
          : `<p class="tp-block">[ Defina as atividades relacionadas a “${esc(o.rotulo)}” em HL.personalizar ]</p>`}
        ${WhatsAppButton("expansao", "Montar minha rotina no WhatsApp", "btn--red")}`;
      bindLinks(res);
    };
    $("#persOpts").addEventListener("click", e => { const b = e.target.closest(".popt"); if (b) show(b.dataset.p); });
    show(HL.personalizar[0].id);
  }

  /* Modais */
  const profModal = $("#profModal"), vidModal = $("#vidModal");
  let vList = [], vIdx = 0;
  function openModal(d) { d.showModal(); document.body.classList.add("locked"); }
  function closeModal(d) { d.close(); }
  [profModal, vidModal].forEach(d => {
    d.addEventListener("close", () => { document.body.classList.remove("locked"); if (d === vidModal) { $("#vmStage").innerHTML = ""; Aud.duck(false); } });
    d.addEventListener("click", e => { if (e.target === d || e.target.closest("[data-close]")) closeModal(d); });
  });
  function renderVideo() {
    const v = vList[vIdx] || {};
    const vert = (v.formato || "vertical") === "vertical";
    let html;
    if (v.src && v.img) html = `<img src="${esc(v.src)}" alt="${esc(v.titulo)}" style="max-height:calc(100dvh - 140px);width:auto">`;
    else if (v.src && !v.img) html = `<video src="${esc(v.src)}" ${v.poster ? `poster="${esc(v.poster)}"` : ""} controls autoplay playsinline></video>`;
    else html = Slot({ label: v.img ? "[ Foto não cadastrada ]" : "[ Vídeo não cadastrado ]", type: v.img ? "img" : "video", cls: vert && !v.img ? "slot--v" : "slot--h" });
    $("#vmStage").innerHTML = html;
    $("#vmTitle").textContent = v.titulo || "";
    $("#vmCount").textContent = vList.length > 1 ? `${vIdx + 1} / ${vList.length}` : "";
    $("#vmPrev").hidden = $("#vmNext").hidden = vList.length < 2;
  }
  $("#vmPrev").onclick = () => { vIdx = (vIdx - 1 + vList.length) % vList.length; renderVideo(); };
  $("#vmNext").onclick = () => { vIdx = (vIdx + 1) % vList.length; renderVideo(); };
  vidModal.addEventListener("keydown", e => { if (e.key === "ArrowRight") $("#vmNext").click(); if (e.key === "ArrowLeft") $("#vmPrev").click(); });
  document.addEventListener("click", e => {
    const p = e.target.closest("[data-prof]");
    if (p) { $("#profModalBody").innerHTML = ProfessorModal(REG[p.dataset.prof]); bindLinks(profModal); lazyVideos(profModal); openModal(profModal); return; }
    const v = e.target.closest("[data-vlist]");
    if (v) { e.preventDefault(); vList = REG[v.dataset.vlist] || []; vIdx = +v.dataset.vi || 0; renderVideo(); openModal(vidModal); if (!vList[vIdx]?.img) Aud.duck(true); }
  });

  /* Vídeos sob demanda */
  let vidObs;
  function lazyVideos(root = document) {
    if (!vidObs) vidObs = new IntersectionObserver(es => es.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) {
        if (!v.src) { v.src = v.dataset.src; if (v.classList.contains("noauto")) v.preload = "metadata"; }
        if (!v.classList.contains("noauto") && !reduce) v.play().catch(() => {});
      } else if (!v.paused) v.pause();
    }), { rootMargin: "200px 0px" });
    $$("video[data-src]", root).forEach(v => vidObs.observe(v));
  }

  /* ---------------- Áudio global ---------------- */
  const Aud = {
    t: {}, cur: "principal", want: "principal", on: false, ducked: false, vol: HL.audio.volume,
    init() {
      ["principal", "classica"].forEach(k => {
        const el = new Audio(); el.loop = true; el.preload = "none"; el.volume = 0;
        if (HL.audio[k].src) el.src = HL.audio[k].src;
        this.t[k] = { el, src: HL.audio[k].src, nome: HL.audio[k].nome };
      });
      $("#audToggle").onclick = () => this.on ? this.pause() : this.play();
      this.ui();
    },
    level() { return this.ducked ? this.vol * 0.15 : this.vol; },
    fade(el, to, ms, done) {
      cancelAnimationFrame(el._raf);
      const from = el.volume, t0 = performance.now();
      const step = n => { const k = Math.min(1, (n - t0) / ms); el.volume = Math.max(0, Math.min(1, from + (to - from) * k)); if (k < 1) el._raf = requestAnimationFrame(step); else done && done(); };
      el._raf = requestAnimationFrame(step);
    },
    start(k) { const tr = this.t[k]; if (!tr.src) return; tr.el.play().then(() => this.fade(tr.el, this.level(), HL.audio.fadeMs)).catch(() => {}); },
    play() { this.on = true; this.cur = this.want; this.start(this.cur); this.ui(); },
    pause() { this.on = false; const tr = this.t[this.cur]; this.fade(tr.el, 0, 700, () => tr.el.pause()); this.ui(); },
    switchTo(k) {
      this.want = k;
      if (!this.on || this.cur === k) { this.ui(); return; }
      const old = this.t[this.cur]; this.fade(old.el, 0, HL.audio.fadeMs, () => old.el.pause());
      this.cur = k; this.t[k].el.volume = 0; this.start(k); this.ui();
    },
    duck(on) { this.ducked = on; if (this.on) this.fade(this.t[this.cur].el, this.level(), 500); },
    ui() {
      const tr = this.t[this.want];
      $("#aud").classList.toggle("playing", this.on);
      $("#audToggle").innerHTML = ico(this.on ? "vol" : "mute");
      $("#audToggle").setAttribute("aria-label", this.on ? "Desligar som" : "Ligar som");
      $("#audName").textContent = tr.src ? tr.nome : `${tr.nome} (não cadastrada)`;
    }
  };

  /* ---------------- Portão de entrada ---------------- */
  function initGate() {
    const g = $("#gate");
    document.body.classList.add("locked");
    const enter = sound => {
      if (sound) Aud.play();
      g.classList.add("open"); document.body.classList.remove("locked");
      setTimeout(() => $("#inicio").classList.add("play"), reduce ? 0 : 700);
      setTimeout(() => g.classList.add("gone"), reduce ? 0 : 1500);
    };
    $("#gateSound").onclick = () => enter(true);
    $("#gateMute").onclick = () => enter(false);
    $("#gateSound").focus();
  }

  /* ---------------- Rolagem: header, menu ativo, universos, transição, parallax ---------------- */
  function initScroll() {
    const hdr = $("#hdr"), open = $("#inicio"), fit = $("#fitness"), exp = $("#expansao"), trans = $("#trans"), stage = $(".trans__stage", trans);
    const navEls = $$("#nav [data-key]");
    const targets = [["inicio","inicio"],["personalizar","experiencia"],["universos","inicio"],["fitness","fitness"],["professores","professores"],["depoimentos","depoimentos"],["galeria","fitness"],["planos","planos"],
      ["trans","expansao"],["expansao","expansao"],["professores-expansao","professores"],["depoimentos-expansao","depoimentos"],["vivido","expansao"],["planos-expansao","planos"],["contato","contato"]]
      .map(([id, key]) => [document.getElementById(id), key]).filter(t => t[0]);
    const prog = $("#hdrProg");
    const heroes = $$(".hero .slot--cover, .open__split, .open > .slot--cover");
    const clamp = x => Math.max(0, Math.min(1, x));
    let tick = false;
    const run = () => {
      tick = false;
      const y = scrollY, vh = innerHeight;
      hdr.classList.toggle("scrolled", y > 20);
      hdr.classList.toggle("show-uni", y > open.offsetHeight * 0.75 && !document.body.classList.contains("menu-open"));
      /* menu ativo */
      let act = "inicio";
      targets.forEach(([el, key]) => { if (el.getBoundingClientRect().top < vh * 0.4) act = key; });
      navEls.forEach(n => n.classList.toggle("on", n.dataset.key === act));
      prog.style.setProperty("--p", clamp(y / (document.documentElement.scrollHeight - vh)));
      /* barra dos universos */
      const fTop = fit.getBoundingClientRect().top + y, eBot = exp.getBoundingClientRect().bottom + y, eTop = exp.getBoundingClientRect().top + y;
      $("#uniBar").style.setProperty("--p", clamp((y - fTop) / (eBot - fTop - vh)));
      const inExp = y + vh * 0.5 >= eTop;
      $$("#uni a").forEach(a => a.classList.toggle("on", (a.dataset.u === "expansao") === inExp));
      /* transição cinematográfica */
      if (!reduce) {
        const r = trans.getBoundingClientRect(), p = clamp(-r.top / (r.height - vh));
        stage.style.setProperty("--p1", clamp(p / 0.45));
        stage.style.setProperty("--p2", clamp((p - 0.35) / 0.3));
        stage.style.setProperty("--p3", clamp((p - 0.62) / 0.3));
        /* parallax discreto nos heróis */
        heroes.forEach(h => { const b = h.parentElement.getBoundingClientRect(); if (b.bottom > 0 && b.top < vh) h.style.transform = `translate3d(0,${(-b.top * 0.18).toFixed(1)}px,0) scale(1.06)`; });
      }
    };
    addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(run); } }, { passive: true });
    addEventListener("resize", run);
    run();
  }

  /* ---------------- Observadores: reveal, contadores, WhatsApp contextual, trilha ---------------- */
  function initObservers() {
    const rv = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); rv.unobserve(e.target); } }), { threshold: 0.2 });
    $$(".rv").forEach(el => { if (!el.closest(".open")) rv.observe(el); });

    const cnt = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; cnt.unobserve(e.target);
      const el = e.target, to = +el.dataset.count, pre = el.dataset.pre || "", t0 = performance.now(), dur = reduce ? 0 : 1600;
      const step = n => { const k = dur ? Math.min(1, (n - t0) / dur) : 1; el.textContent = pre + Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString("pt-BR"); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }), { threshold: 0.5 });
    $$("[data-count]").forEach(el => cnt.observe(el));

    /* WhatsApp contextual */
    const wa = $("#waFloat"), waT = $("#waFloatT");
    let cur = "";
    const setWa = k => {
      if (k === cur) return; cur = k;
      const m = HL.whatsappMensagens[k] || HL.whatsappMensagens.geral;
      waT.textContent = m.rotulo; wa.href = waHref(k); wa.setAttribute("aria-label", m.rotulo);
      wa.classList.remove("compact"); clearTimeout(wa._t); wa._t = setTimeout(() => wa.classList.add("compact"), 4000);
    };
    wa.addEventListener("mouseenter", () => wa.classList.remove("compact"));
    wa.addEventListener("mouseleave", () => { clearTimeout(wa._t); wa._t = setTimeout(() => wa.classList.add("compact"), 1200); });
    const ctx = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setWa(e.target.dataset.waCtx); }), { rootMargin: "-48% 0px -48% 0px" });
    $$("[data-wa-ctx]").forEach(el => ctx.observe(el));
    setWa("geral");

    /* Trilha sonora por seção (Dança/Balé → clássica) */
    const inClassic = new Set();
    const tr = new IntersectionObserver(es => {
      es.forEach(e => e.isIntersecting ? inClassic.add(e.target) : inClassic.delete(e.target));
      Aud.switchTo(inClassic.size ? "classica" : "principal");
    }, { rootMargin: "-35% 0px -35% 0px" });
    $$("[data-trilha='classica']").forEach(el => tr.observe(el));
  }


  /* ---------------- Títulos dos heróis (anima ao entrar na tela) ---------------- */
  const fitHero = $("#fitness .hero");
  function initHeroTitles() {
    const o = new IntersectionObserver(es => es.forEach(e => {
      if (e.intersectionRatio >= 0.3) { if (!(holdFit && e.target === fitHero)) e.target.classList.add("play"); }
      else if (!e.isIntersecting) e.target.classList.remove("play");
    }), { threshold: [0, 0.3] });
    $$(".hero").forEach(h => o.observe(h));
  }

  /* ---------------- Ida para a Expansão com a transição em câmera lenta ---------------- */
  function initExpansaoLink() {
    const trans = $("#trans"), exp = $("#expansao"), root = document.documentElement;
    let raf = 0, busy = false;
    const stop = () => { if (!busy) return; cancelAnimationFrame(raf); busy = false; root.style.scrollBehavior = ""; };
    ["wheel", "touchstart", "keydown"].forEach(ev => addEventListener(ev, stop, { passive: true }));
    const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    const tween = (from, to, dur, done) => {
      const t0 = performance.now();
      const step = n => { if (!busy) return; const k = Math.min(1, (n - t0) / dur); scrollTo(0, from + (to - from) * ease(k)); if (k < 1) raf = requestAnimationFrame(step); else done && done(); };
      raf = requestAnimationFrame(step);
    };
    document.addEventListener("click", e => {
      const a = e.target.closest('a[href="#expansao"]');
      if (!a || reduce) return;
      const y = scrollY, vh = innerHeight;
      const tTop = trans.getBoundingClientRect().top + y, tEnd = tTop + trans.offsetHeight - vh;
      const eTop = exp.getBoundingClientRect().top + y - (parseFloat(getComputedStyle(root).scrollPaddingTop) || 0);
      if (y >= tEnd) return;               /* já passou da transição: rolagem normal */
      e.preventDefault(); stop();
      busy = true; root.style.scrollBehavior = "auto";
      if (y < tTop) scrollTo(0, tTop);     /* corte seco para o início da cena */
      const from = Math.max(y, tTop);
      tween(from, tEnd, 4800 * (tEnd - from) / (tEnd - tTop), () => tween(tEnd, eTop, 1100, stop));
    });
  }


  /* ---------------- Ida para o Fitness com cortina cinematográfica ---------------- */
  function initFitnessLink() {
    const c = $("#curtain"), fit = $("#fitness"), root = document.documentElement;
    let busy = false;
    document.addEventListener("click", e => {
      const a = e.target.closest('a[href="#fitness"]');
      if (!a || reduce) return;
      e.preventDefault();
      if (busy) return;
      busy = true; holdFit = true;
      fitHero.classList.remove("play");
      c.className = "curtain on";
      requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add("close")));
      setTimeout(() => {                                   /* tela fechada: pula para o Fitness */
        root.style.scrollBehavior = "auto";
        scrollTo(0, fit.getBoundingClientRect().top + scrollY);
        root.style.scrollBehavior = "";
        c.classList.add("show");
        $(".curtain__c", c).classList.add("play");
      }, 800);
      setTimeout(() => {                                   /* abre a cortina e anima o título */
        c.classList.add("is-open");
        holdFit = false; fitHero.classList.add("play");
      }, 2500);
      setTimeout(() => {
        c.className = "curtain"; $(".curtain__c", c).classList.remove("play"); busy = false;
      }, 3400);
    });
  }


  /* ---------------- Cabeçalho: mega menus ---------------- */
  function initMega() {
    const hdr = $("#hdr"), items = $$(".nav__i[data-mega]"), canHover = matchMedia("(hover:hover)").matches;
    let openId = null, t;
    $("#megaActs").innerHTML = HL.atividades.map(x => `<a class="mact" href="#${x.id}"><span class="mact__hex" aria-hidden="true">${x.icone}</span><span class="mact__n">${esc(x.nome)}</span></a>`).join("");
    $("#mnavActs").innerHTML = HL.atividades.map(x => `<a class="chip" href="#${x.id}">${x.icone} ${esc(x.nome)}</a>`).join("") + `<a class="chip" href="#horarios">Horários</a>`;
    $$("[data-social]").forEach(el => el.href = HL.links[el.dataset.social] || NOCFG + "-" + el.dataset.social);
    const set = id => {
      openId = id;
      items.forEach(i => { const on = i.dataset.mega === id; i.classList.toggle("is-open", on); $(".nav__btn", i).setAttribute("aria-expanded", on); });
      $$(".mega").forEach(m => m.classList.toggle("is-open", m.id === "mega-" + id));
      hdr.classList.toggle("mega-open", !!id);
    };
    items.forEach(i => {
      const id = i.dataset.mega;
      $(".nav__btn", i).addEventListener("click", () => set(openId === id ? null : id));
      if (canHover) {
        i.addEventListener("mouseenter", () => { clearTimeout(t); set(id); });
        i.addEventListener("mouseleave", () => { t = setTimeout(() => set(null), 260); });
      }
    });
    $$(".mega").forEach(m => {
      if (canHover) {
        m.addEventListener("mouseenter", () => clearTimeout(t));
        m.addEventListener("mouseleave", () => { t = setTimeout(() => set(null), 260); });
      }
      m.addEventListener("click", e => { if (e.target.closest("a")) set(null); });
    });
    document.addEventListener("click", e => { if (openId && !e.target.closest(".nav__i, .mega")) set(null); });
    addEventListener("keydown", e => { if (e.key === "Escape") set(null); });
    addEventListener("wheel", () => { if (openId && !$(".mega.is-open:hover")) set(null); }, { passive: true });
  }

  /* ---------------- Menu mobile ---------------- */
  function initMenu() {
    const b = $("#burger"), body = document.body;
    const set = on => { body.classList.toggle("menu-open", on); b.setAttribute("aria-expanded", on); b.setAttribute("aria-label", on ? "Fechar menu" : "Abrir menu"); body.classList.toggle("locked", on); };
    b.onclick = () => set(!body.classList.contains("menu-open"));
    $("#mnav").addEventListener("click", e => { if (e.target.closest("a")) set(false); });
    addEventListener("keydown", e => { if (e.key === "Escape") set(false); });
  }

  /* ---------------- Início ---------------- */
  render();
  Aud.init();
  initGate();
  initRails();
  initFilters();
  initPersonalizar();
  lazyVideos();
  initObservers();
  initScroll();
  initMenu();
  initHeroTitles();
  initExpansaoLink();
  initFitnessLink();
  initMega();
  bindLinks($("#hdr"));
})();
