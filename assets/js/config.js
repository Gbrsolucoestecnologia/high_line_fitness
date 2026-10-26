/* =====================================================================
   HIGH LINE FITNESS — CONTEÚDO EDITÁVEL
   ---------------------------------------------------------------------
   Tudo o que aparece no site sai daqui. Para publicar conteúdo real,
   basta preencher os campos vazios ("") ou adicionar itens às listas [].
   Campo vazio = o site mostra um placeholder no lugar.
   Mídia: informe o caminho/URL. Vídeos (.mp4/.webm) são detectados
   automaticamente; use "...Poster" para a imagem de capa do vídeo.
   ===================================================================== */
window.HL = {

  /* ---------- TEMA ----------
     "natal"  = ativa o tema de Natal (neve, luzes, campanha, árvore, contagem regressiva)
     "padrao" = volta ao visual normal da High Line                                  */
  tema: "padrao",

  /* ---------- Campanha de Natal (aparece só com tema "natal") ---------- */
  natal: {
    texto: "",                  // texto da campanha
    beneficios: ["", "", ""],   // condições/benefícios REAIS da campanha
    validade: "",               // ex.: "até 24/12"
    link: ""                    // link de inscrição da campanha (vazio = usa links.inscricao)
  },

  /* ---------- Contato e links ---------- */
  contato: {
    whatsapp: "",               // só números com DDI+DDD. Ex.: "5585900000000"
    telefone: "",
    email: "",
    endereco: "",
    horarioFuncionamento: "",
    mapsEmbed: "",              // URL do "incorporar mapa" do Google Maps
    mapsLink: ""                // link "abrir no Google Maps"
  },
  links: {
    inscricao: "",              // link geral de inscrição
    catalogo: "",               // catálogo da lanchonete (se preferir, use atividades → lanchonete → catalogo)
    instagram: "", facebook: "", tiktok: "", youtube: ""
  },
  redesArroba: { instagram: "", facebook: "", tiktok: "", youtube: "" },

  /* ---------- WhatsApp contextual (rótulo do botão + mensagem) ---------- */
  whatsappMensagens: {
    geral:      { rotulo: "Falar no WhatsApp",        msg: "Olá! Vim pelo site da High Line e gostaria de mais informações." },
    natal:      { rotulo: "Falar sobre o Natal",      msg: "Olá! Vim pelo site e quero saber sobre a campanha de Natal da High Line." },
    musculacao: { rotulo: "Falar sobre musculação",   msg: "Olá! Quero saber mais sobre a musculação na High Line Fitness." },
    planos:     { rotulo: "Falar sobre planos",       msg: "Olá! Quero saber mais sobre os planos da High Line." },
    expansao:   { rotulo: "Falar sobre a Expansão",   msg: "Olá! Quero conhecer as atividades da Expansão High Line." },
    natacao:    { rotulo: "Falar sobre natação",      msg: "Olá! Quero saber mais sobre a natação na High Line." },
    pilates:    { rotulo: "Falar sobre Pilates",      msg: "Olá! Quero saber mais sobre o Pilates na High Line." },
    lutas:      { rotulo: "Falar sobre lutas",        msg: "Olá! Quero saber mais sobre as lutas na High Line." },
    cross:      { rotulo: "Falar sobre Cross",        msg: "Olá! Quero saber mais sobre o Cross Training na High Line." },
    danca:      { rotulo: "Falar sobre dança",        msg: "Olá! Quero saber mais sobre as aulas de dança na High Line." },
    bale:       { rotulo: "Falar sobre balé",         msg: "Olá! Quero saber mais sobre o balé na High Line." },
    lanchonete: { rotulo: "Falar com a lanchonete",   msg: "Olá! Quero saber mais sobre a lanchonete da High Line." },
    eventos:    { rotulo: "Falar sobre eventos",      msg: "Olá! Quero saber mais sobre os eventos High Adventure da High Line." }
  },

  /* ---------- Áudio ambiente ---------- */
  audio: {
    principal: { src: "", nome: "Trilha principal" },   // instrumental, sem voz
    classica:  { src: "", nome: "Piano / clássica" },   // toca nas seções de Dança e Balé
    natal:     { src: "", nome: "Trilha de Natal" },    // com tema "natal", substitui a trilha principal
    volume: 0.5,
    fadeMs: 1800
  },

  /* ---------- Mídias fixas das seções ---------- */
  midia: {
    fachadaFitness: "", fachadaExpansao: "",
    aberturaVideo: "", aberturaVideoPoster: "",   // se preenchido, substitui as duas fachadas
    painelFitness: "", painelExpansao: "",        // vazio = usa a foto da fachada
    fitnessHero: "", fitnessHeroPoster: "",
    expansaoHero: "", expansaoHeroPoster: "",
    ctaFinal: "", ctaFinalPoster: ""              // opcional
  },

  /* ---------- 6. Números (valor vazio = placeholder) ---------- */
  numeros: [
    { valor: "", prefixo: "+", rotulo: "Alunos",           placeholder: "+XXX" },
    { valor: "", prefixo: "",  rotulo: "Modalidades",      placeholder: "XX" },
    { valor: "", prefixo: "",  rotulo: "Profissionais",    placeholder: "XX" },
    { valor: "", prefixo: "",  rotulo: "Anos de história", placeholder: "XX" }
  ],

  /* ---------- 7. História ---------- */
  historia: [
    { etapa: "Fundação",      ano: "", titulo: "", descricao: "", imagem: "", video: "" },
    { etapa: "Crescimento",   ano: "", titulo: "", descricao: "", imagem: "", video: "" },
    { etapa: "Expansão",      ano: "", titulo: "", descricao: "", imagem: "", video: "" },
    { etapa: "Momento atual", ano: "", titulo: "", descricao: "", imagem: "", video: "" }
  ],

  /* ---------- 8. Estrutura ---------- */
  estrutura: [
    { titulo: "Musculação",   imagem: "" },
    { titulo: "Cardio",       imagem: "" },
    { titulo: "Equipamentos", imagem: "" },
    { titulo: "Treinamento",  imagem: "" },
    { titulo: "Ambientes",    imagem: "" }
  ],

  /* ---------- 9. Vídeos fitness (formato: "vertical" | "horizontal") ---------- */
  videosFitness: [
    { titulo: "Treinos",      formato: "vertical",   src: "", poster: "" },
    { titulo: "Equipamentos", formato: "horizontal", src: "", poster: "" },
    { titulo: "Professores",  formato: "vertical",   src: "", poster: "" },
    { titulo: "Ambiente",     formato: "horizontal", src: "", poster: "" }
  ],

  /* ---------- 10 e 33. Professores ----------
     unidade: "fitness" | "expansao"
     { nome, foto, unidade, modalidade, cref, formacao, especializacoes:[], experiencia,
       modalidades:[], horarios, whatsapp, video }                                    */
  professores: [],

  /* ---------- 11. Depoimentos dos professores ----------
     { nome, cargo, modalidade, foto, video, depoimento }                             */
  depoimentosProfessores: [],

  /* ---------- 12, 13 e 15. Depoimentos REAIS de alunos ----------
     SOMENTE conteúdo real e autorizado. Campos:
     { nome, foto, video, poster, tipo:"video"|"texto", unidade:"fitness"|"expansao",
       modalidade:"natacao"|"pilates"|"lutas"|"cross"|"danca"|"bale"|"musculacao"|"" (opcional),
       depoimento, tempoComoAluno, avaliacao (1–5, só se fornecida), destaque:true|false } */
  depoimentos: [],

  /* ---------- 14. Vídeos de experiências dos alunos ----------
     { titulo, src, poster, unidade }                                                  */
  videosExperiencias: [],

  /* ---------- 16. Galeria fitness ----------
     { categoria:"musculacao"|"cardio"|"equipamentos"|"ambientes", src, legenda }        */
  galeria: [],

  /* ---------- 18. Planos fitness ----------
     { nome, preco, periodo, descricao, beneficios:[], modalidades:[], observacoes, link, destaque } */
  planosFitness: [],

  /* ---------- 19. Comparador fitness ----------
     colunas: nomes dos planos; linhas: { recurso, valores:[true|false|"texto"] }       */
  comparadorFitness: { colunas: [], linhas: [] },

  /* ---------- 35. Planos Expansão (nomes são só estrutura de exemplo) ---------- */
  planosExpansao: [
    { nome: "Fitness",            exemplo: true, preco: "", periodo: "", descricao: "", beneficios: [], modalidades: [], observacoes: "", link: "" },
    { nome: "Fitness + Cross",    exemplo: true, preco: "", periodo: "", descricao: "", beneficios: [], modalidades: [], observacoes: "", link: "" },
    { nome: "Fitness + Expansão", exemplo: true, preco: "", periodo: "", descricao: "", beneficios: [], modalidades: [], observacoes: "", link: "" },
    { nome: "Completo",           exemplo: true, preco: "", periodo: "", descricao: "", beneficios: [], modalidades: [], observacoes: "", link: "" }
  ],

  /* ---------- 36. Comparador geral ---------- */
  comparadorGeral: { colunas: ["Fitness", "Expansão", "Planos combinados"], linhas: [] },

  /* ---------- 23–30. Atividades da Expansão ----------
     fotos: lista de imagens extras (a fileira de fotos só aparece se houver fotos)
     publicos: "criancas" | "adultos" | "performance" | "bem-estar" | "familia"
     info: pares [rótulo, valor] — valor vazio vira placeholder                         */
  atividades: [
    { id: "natacao", nome: "Natação", icone: "🏊", estilo: "agua", publicos: [],
      texto: "", video: "", poster: "", fotos: [], link: "",
      info: [["Níveis", ""], ["Faixa etária", ""], ["Horários", ""], ["Estrutura da piscina", ""]],
      professor: null, videoProfessor: { src: "", poster: "", rotulo: "Vídeo do professor apresentando a piscina" } },

    { id: "pilates", nome: "Pilates", icone: "🧘", publicos: [],
      texto: "", video: "", poster: "", fotos: [], link: "",
      info: [["O espaço", ""], ["Horários", ""], ["Formato das aulas", ""], ["Informações", ""]],
      professor: null },

    { id: "lutas", nome: "Lutas", icone: "🥊", publicos: [],
      texto: "", video: "", poster: "", fotos: [], link: "",
      info: [["Modalidades", ""], ["Horários", ""]],
      professor: null,
      submodalidades: [] /* { nome, foto, video, professor, formacao, cref, horarios, descricao, link } */ },

    { id: "cross", nome: "Cross Training", icone: "🏋️", estilo: "cross", publicos: [],
      texto: "", video: "", poster: "", fotos: [], link: "",
      info: [["Estrutura", ""], ["Horários", ""], ["Informações", ""]],
      professor: null },

    { id: "danca", nome: "Dança", icone: "💃", trilha: "classica", publicos: [],
      texto: "", video: "", poster: "", fotos: [], link: "",
      info: [["Modalidades", ""], ["Horários", ""], ["Informações", ""]],
      professor: null,
      submodalidades: [] },

    { id: "bale", nome: "Balé", icone: "🩰", estilo: "bale", trilha: "classica", publicos: [],
      texto: "", video: "", poster: "", fotos: [], link: "",
      info: [["Horários", ""], ["Turmas", ""], ["Informações", ""]],
      professor: null },

    { id: "lanchonete", nome: "Lanchonete", icone: "☕", estilo: "cafe", publicos: [],
      texto: "", video: "", poster: "", fotos: [], link: "", ambiente: "",
      info: [["Funcionamento", ""], ["Sobre o ambiente", ""]],
      semProfessor: true,
      catalogo: "" /* link do catálogo da lanchonete (cardápio, PDF, Instagram, iFood etc.) */ }
  ],

  /* ---------- Eventos: High Adventure ----------
     >>> ÁREA PARA ATUALIZAR OS EVENTOS <<<
     agendados: próximos eventos. Use a data no formato "AAAA-MM-DD" (ex.: "2026-11-15").
                Quando a data passar, o evento vai sozinho para "Eventos passados".
       { nome, data, horario, local, descricao, foto, link, vagas }
     passados: eventos já realizados (somente reais).
       { nome, data, local, resumo, capa, fotos: ["midia/fotos/..."], video }          */
  eventos: {
    nome: "High Adventure",
    texto: "",
    agendados: [],
    passados: []
  },

  /* ---------- 32. Horários ----------
     { dia:"seg"|"ter"|"qua"|"qui"|"sex"|"sab", horario, atividade, professor, modalidade, vagas } */
  horarios: [],

  /* ---------- 34. Experiência personalizada (ids das atividades; "fitness" = musculação) ---------- */
  personalizar: [
    { id: "forca",          rotulo: "Força",           atividades: ["fitness", "cross"] },
    { id: "condicionamento",rotulo: "Condicionamento", atividades: ["cross", "natacao", "lutas"] },
    { id: "bem-estar",      rotulo: "Bem-estar",       atividades: ["pilates", "natacao"] },
    { id: "natacao",        rotulo: "Natação",         atividades: ["natacao"] },
    { id: "lutas",          rotulo: "Lutas",           atividades: ["lutas"] },
    { id: "danca",          rotulo: "Dança",           atividades: ["danca"] },
    { id: "bale",           rotulo: "Balé",            atividades: ["bale"] },
    { id: "familia",        rotulo: "Família",         atividades: [] }
  ]
};
