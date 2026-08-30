'use strict';

const path = require('path');
const { extraPublicQuizzes } = require('./seed-quizzes-extra');

const FRONTEND_LEVELS_DIR = path.join(__dirname, '..', '..', 'fluent-too', 'public', 'levels');

const LEVEL_IMAGE_FILES = {
  A1: 'a1.svg',
  A2: 'a2.svg',
  B1: 'b1.svg',
  B2: 'b2.svg',
  C1: 'c1-c2.svg',
  C2: 'c1-c2.svg',
};

const publicQuizzes = [
  {
    title: 'Saudações Básicas',
    slug: 'a1-pt-saudacoes-basicas-mc',
    description: 'Aprenda a cumprimentar e se apresentar em português.',
    targetLanguage: 'pt',
    level: 'A1',
    type: 'multiple-choice',
    estimatedMinutes: 3,
    questions: [
      { id: 'q1', question: 'Como se diz "hello" em português?', options: ['Olá', 'Tchau', 'Obrigado', 'Por favor'], correctAnswer: 'Olá' },
      { id: 'q2', question: 'Qual é a resposta educada para "Como você está?"', options: ['Estou bem, obrigado', 'Banana', 'Amanhã', 'Talvez'], correctAnswer: 'Estou bem, obrigado' },
      { id: 'q3', question: 'Como se despede alguém informalmente?', options: ['Tchau', 'Sim', 'Não', 'Café'], correctAnswer: 'Tchau' },
      { id: 'q4', question: 'Qual palavra significa "obrigado"?', options: ['Obrigado', 'Depois', 'Aqui', 'Ali'], correctAnswer: 'Obrigado' },
    ],
  },
  {
    title: 'Ser ou Estar',
    slug: 'a2-pt-ser-ou-estar-gap',
    description: 'Pratique a diferença entre os verbos "ser" e "estar".',
    targetLanguage: 'pt',
    level: 'A2',
    type: 'fill-gap',
    estimatedMinutes: 5,
    questions: [
      { id: 'q1', question: 'Complete com o verbo correto', parts: ['Eu ', ' médico.'], correctAnswers: ['sou'] },
      { id: 'q2', question: 'Complete com o verbo correto', parts: ['Nós ', ' cansados hoje.'], correctAnswers: ['estamos'] },
      { id: 'q3', question: 'Complete com o verbo correto', parts: ['Ela ', ' brasileira.'], correctAnswers: ['é'] },
      { id: 'q4', question: 'Complete com o verbo correto', parts: ['Vocês ', ' na escola agora.'], correctAnswers: ['estão'] },
    ],
  },
  {
    title: 'Vocabulário do Dia a Dia',
    slug: 'b1-pt-vocabulario-cotidiano-fc',
    description: 'Revise palavras comuns usadas no cotidiano.',
    targetLanguage: 'pt',
    level: 'B1',
    type: 'flashcard',
    estimatedMinutes: 4,
    questions: [
      { id: 'q1', question: 'trabalho', front: 'trabalho', back: 'job / work' },
      { id: 'q2', question: 'mercado', front: 'mercado', back: 'market' },
      { id: 'q3', question: 'reunião', front: 'reunião', back: 'meeting' },
      { id: 'q4', question: 'vizinho', front: 'vizinho', back: 'neighbor' },
      { id: 'q5', question: 'almoço', front: 'almoço', back: 'lunch' },
    ],
  },
  {
    title: 'Subjuntivo Básico',
    slug: 'b2-pt-subjuntivo-basico-mc',
    description: 'Introdução ao modo subjuntivo em situações comuns.',
    targetLanguage: 'pt',
    level: 'B2',
    type: 'multiple-choice',
    estimatedMinutes: 6,
    questions: [
      { id: 'q1', question: 'Espero que você ___ bem.', options: ['esteja', 'está', 'estava', 'estar'], correctAnswer: 'esteja' },
      { id: 'q2', question: 'Talvez ela ___ amanhã.', options: ['venha', 'vem', 'veio', 'vir'], correctAnswer: 'venha' },
      { id: 'q3', question: 'Se eu ___ tempo, eu viajaria.', options: ['tivesse', 'tenho', 'tive', 'ter'], correctAnswer: 'tivesse' },
      { id: 'q4', question: 'Quero que vocês ___ silêncio.', options: ['façam', 'fazem', 'fizeram', 'fazer'], correctAnswer: 'façam' },
    ],
  },
  {
    title: 'Expressões Idiomáticas',
    slug: 'c1-pt-expressoes-idiomaticas-gap',
    description: 'Complete expressões idiomáticas comuns do português.',
    targetLanguage: 'pt',
    level: 'C1',
    type: 'fill-gap',
    estimatedMinutes: 7,
    questions: [
      { id: 'q1', question: 'Complete a expressão', parts: ['Custar os olhos da ', '.'], correctAnswers: ['cara'] },
      { id: 'q2', question: 'Complete a expressão', parts: ['Matar dois coelhos com uma ', ' cajadada só.'], correctAnswers: ['só'] },
      { id: 'q3', question: 'Complete a expressão', parts: ['Chorar sobre o leite ', '.'], correctAnswers: ['derramado'] },
      { id: 'q4', question: 'Complete a expressão', parts: ['Pagar o ', ' pelo cordeiro.'], correctAnswers: ['pato'] },
    ],
  },
  {
    title: 'Nuances Lexicais',
    slug: 'c2-pt-nuances-lexicais-fc',
    description: 'Diferencie palavras de significado próximo em contextos formais.',
    targetLanguage: 'pt',
    level: 'C2',
    type: 'flashcard',
    estimatedMinutes: 6,
    questions: [
      { id: 'q1', question: 'acolher x abrigar', front: 'acolher', back: 'to welcome / receive warmly (emotional)' },
      { id: 'q2', question: 'abrigar', front: 'abrigar', back: 'to shelter / house (physical protection)' },
      { id: 'q3', question: 'perceber x notar', front: 'perceber', back: 'to realize / perceive (deeper understanding)' },
      { id: 'q4', question: 'notar', front: 'notar', back: 'to notice (surface observation)' },
    ],
  },

  {
    title: 'Basic Greetings',
    slug: 'a1-en-basic-greetings-mc',
    description: 'Learn how to greet people and introduce yourself in English.',
    targetLanguage: 'en',
    level: 'A1',
    type: 'multiple-choice',
    estimatedMinutes: 3,
    questions: [
      { id: 'q1', question: 'How do you say "olá" in English?', options: ['Hello', 'Goodbye', 'Thanks', 'Please'], correctAnswer: 'Hello' },
      { id: 'q2', question: 'What is a polite reply to "How are you?"', options: ['I am fine, thank you', 'Banana', 'Tomorrow', 'Maybe'], correctAnswer: 'I am fine, thank you' },
      { id: 'q3', question: 'What do you say when leaving informally?', options: ['Bye', 'Yes', 'No', 'Coffee'], correctAnswer: 'Bye' },
      { id: 'q4', question: 'Which word means "thank you"?', options: ['Thanks', 'Later', 'Here', 'There'], correctAnswer: 'Thanks' },
    ],
  },
  {
    title: 'Simple Present Tense',
    slug: 'a2-en-simple-present-gap',
    description: 'Practice conjugating verbs in the simple present tense.',
    targetLanguage: 'en',
    level: 'A2',
    type: 'fill-gap',
    estimatedMinutes: 5,
    questions: [
      { id: 'q1', question: 'Complete with the correct verb form', parts: ['She ', ' to school every day.'], correctAnswers: ['goes'] },
      { id: 'q2', question: 'Complete with the correct verb form', parts: ['They ', ' coffee in the morning.'], correctAnswers: ['drink'] },
      { id: 'q3', question: 'Complete with the correct verb form', parts: ['He ', " like spicy food."], correctAnswers: ["doesn't"] },
      { id: 'q4', question: 'Complete with the correct verb form', parts: ['I ', ' in a small apartment.'], correctAnswers: ['live'] },
    ],
  },
  {
    title: 'Everyday Vocabulary',
    slug: 'b1-en-everyday-vocabulary-fc',
    description: 'Review common words used in daily life.',
    targetLanguage: 'en',
    level: 'B1',
    type: 'flashcard',
    estimatedMinutes: 4,
    questions: [
      { id: 'q1', question: 'job', front: 'job', back: 'trabalho' },
      { id: 'q2', question: 'market', front: 'market', back: 'mercado' },
      { id: 'q3', question: 'meeting', front: 'meeting', back: 'reunião' },
      { id: 'q4', question: 'neighbor', front: 'neighbor', back: 'vizinho' },
      { id: 'q5', question: 'lunch', front: 'lunch', back: 'almoço' },
    ],
  },
  {
    title: 'Conditional Sentences',
    slug: 'b2-en-conditional-sentences-mc',
    description: 'Practice first and second conditional structures.',
    targetLanguage: 'en',
    level: 'B2',
    type: 'multiple-choice',
    estimatedMinutes: 6,
    questions: [
      { id: 'q1', question: 'If it rains, I ___ at home.', options: ['will stay', 'stayed', 'stay', 'staying'], correctAnswer: 'will stay' },
      { id: 'q2', question: 'If I had more time, I ___ travel more.', options: ['would', 'will', 'had', 'have'], correctAnswer: 'would' },
      { id: 'q3', question: 'If she studies, she ___ pass.', options: ['will', 'would', 'was', 'is'], correctAnswer: 'will' },
      { id: 'q4', question: 'If I were you, I ___ apologize.', options: ['would', 'will', 'am', 'was'], correctAnswer: 'would' },
    ],
  },
  {
    title: 'Phrasal Verbs',
    slug: 'c1-en-phrasal-verbs-gap',
    description: 'Complete common English phrasal verbs.',
    targetLanguage: 'en',
    level: 'C1',
    type: 'fill-gap',
    estimatedMinutes: 7,
    questions: [
      { id: 'q1', question: 'Complete the phrasal verb', parts: ['Can you ', ' up the volume?'], correctAnswers: ['turn'] },
      { id: 'q2', question: 'Complete the phrasal verb', parts: ['I need to ', ' up with the news.'], correctAnswers: ['catch'] },
      { id: 'q3', question: 'Complete the phrasal verb', parts: ['She decided to ', ' down the offer.'], correctAnswers: ['turn'] },
      { id: 'q4', question: 'Complete the phrasal verb', parts: ['They will ', ' off the meeting.'], correctAnswers: ['put'] },
    ],
  },
  {
    title: 'Advanced Idioms',
    slug: 'c2-en-advanced-idioms-fc',
    description: 'Learn nuanced idiomatic expressions used by native speakers.',
    targetLanguage: 'en',
    level: 'C2',
    type: 'flashcard',
    estimatedMinutes: 6,
    questions: [
      { id: 'q1', question: 'to bite the bullet', front: 'to bite the bullet', back: 'to endure a painful situation bravely' },
      { id: 'q2', question: 'to burn the midnight oil', front: 'to burn the midnight oil', back: 'to work late into the night' },
      { id: 'q3', question: 'to cut corners', front: 'to cut corners', back: 'to do something poorly to save time or money' },
      { id: 'q4', question: 'to read between the lines', front: 'to read between the lines', back: 'to understand the hidden meaning' },
    ],
  },

  {
    title: 'Salutations de Base',
    slug: 'a1-fr-salutations-de-base-mc',
    description: 'Apprenez à saluer et vous présenter en français.',
    targetLanguage: 'fr',
    level: 'A1',
    type: 'multiple-choice',
    estimatedMinutes: 3,
    questions: [
      { id: 'q1', question: 'Comment dit-on "hello" en français?', options: ['Bonjour', 'Au revoir', 'Merci', "S'il vous plaît"], correctAnswer: 'Bonjour' },
      { id: 'q2', question: 'Quelle est une réponse polie à "Comment allez-vous?"', options: ['Je vais bien, merci', 'Banane', 'Demain', 'Peut-être'], correctAnswer: 'Je vais bien, merci' },
      { id: 'q3', question: 'Que dit-on pour partir de façon informelle?', options: ['Salut', 'Oui', 'Non', 'Café'], correctAnswer: 'Salut' },
      { id: 'q4', question: 'Quel mot signifie "merci"?', options: ['Merci', 'Plus tard', 'Ici', 'Là'], correctAnswer: 'Merci' },
    ],
  },
  {
    title: 'Les Articles Définis',
    slug: 'a2-fr-articles-definis-gap',
    description: 'Pratiquez les articles définis le, la, les.',
    targetLanguage: 'fr',
    level: 'A2',
    type: 'fill-gap',
    estimatedMinutes: 5,
    questions: [
      { id: 'q1', question: 'Complétez avec le bon article', parts: ['', ' chat dort sur le canapé.'], correctAnswers: ['Le'] },
      { id: 'q2', question: 'Complétez avec le bon article', parts: ['', ' maison est très grande.'], correctAnswers: ['La'] },
      { id: 'q3', question: 'Complétez avec le bon article', parts: ['', ' enfants jouent dans le jardin.'], correctAnswers: ['Les'] },
      { id: 'q4', question: 'Complétez avec le bon article', parts: ['', ' eau est froide.'], correctAnswers: ["L'"] },
    ],
  },
  {
    title: 'Vocabulaire Quotidien',
    slug: 'b1-fr-vocabulaire-quotidien-fc',
    description: 'Révisez des mots courants utilisés au quotidien.',
    targetLanguage: 'fr',
    level: 'B1',
    type: 'flashcard',
    estimatedMinutes: 4,
    questions: [
      { id: 'q1', question: 'travail', front: 'travail', back: 'job / work' },
      { id: 'q2', question: 'marché', front: 'marché', back: 'market' },
      { id: 'q3', question: 'réunion', front: 'réunion', back: 'meeting' },
      { id: 'q4', question: 'voisin', front: 'voisin', back: 'neighbor' },
      { id: 'q5', question: 'déjeuner', front: 'déjeuner', back: 'lunch' },
    ],
  },
  {
    title: 'Le Subjonctif Présent',
    slug: 'b2-fr-subjonctif-present-mc',
    description: 'Introduction au subjonctif présent dans des situations courantes.',
    targetLanguage: 'fr',
    level: 'B2',
    type: 'multiple-choice',
    estimatedMinutes: 6,
    questions: [
      { id: 'q1', question: "J'espère que tu ___ bien.", options: ['ailles', 'vas', 'allais', 'aller'], correctAnswer: 'ailles' },
      { id: 'q2', question: 'Il faut que nous ___ à l’heure.', options: ['soyons', 'sommes', 'étions', 'être'], correctAnswer: 'soyons' },
      { id: 'q3', question: "Je veux qu'elle ___ ses devoirs.", options: ['fasse', 'fait', 'faisait', 'faire'], correctAnswer: 'fasse' },
      { id: 'q4', question: 'Bien qu’il ___ fatigué, il travaille.', options: ['soit', 'est', 'était', 'être'], correctAnswer: 'soit' },
    ],
  },
  {
    title: 'Expressions Idiomatiques',
    slug: 'c1-fr-expressions-idiomatiques-gap',
    description: "Complétez des expressions idiomatiques courantes du français.",
    targetLanguage: 'fr',
    level: 'C1',
    type: 'fill-gap',
    estimatedMinutes: 7,
    questions: [
      { id: 'q1', question: "Complétez l'expression", parts: ['Coûter les yeux de la ', '.'], correctAnswers: ['tête'] },
      { id: 'q2', question: "Complétez l'expression", parts: ['Avoir un chat dans la ', '.'], correctAnswers: ['gorge'] },
      { id: 'q3', question: "Complétez l'expression", parts: ["Poser un lapin à ", "."], correctAnswers: ['quelqu’un'] },
      { id: 'q4', question: "Complétez l'expression", parts: ['Tomber dans les ', '.'], correctAnswers: ['pommes'] },
    ],
  },
  {
    title: 'Nuances Lexicales',
    slug: 'c2-fr-nuances-lexicales-fc',
    description: 'Différenciez des mots de sens proche dans des contextes formels.',
    targetLanguage: 'fr',
    level: 'C2',
    type: 'flashcard',
    estimatedMinutes: 6,
    questions: [
      { id: 'q1', question: 'accueillir vs abriter', front: 'accueillir', back: 'to welcome (emotional / social)' },
      { id: 'q2', question: 'abriter', front: 'abriter', back: 'to shelter / house (physical protection)' },
      { id: 'q3', question: 'apercevoir vs remarquer', front: 'apercevoir', back: 'to glimpse / notice briefly' },
      { id: 'q4', question: 'remarquer', front: 'remarquer', back: 'to notice / point out (deliberate observation)' },
    ],
  },
];

const privateQuizzes = [
  {
    title: 'Números e Cores',
    slug: 'a1-pt-numeros-e-cores-gap',
    description: 'Pratique números e cores básicas em português.',
    targetLanguage: 'pt',
    level: 'A1',
    type: 'fill-gap',
    estimatedMinutes: 4,
    questions: [
      { id: 'q1', question: 'Complete', parts: ['Eu tenho ', ' anos. (3)'], correctAnswers: ['três'] },
      { id: 'q2', question: 'Complete', parts: ['O céu é ', '.'], correctAnswers: ['azul'] },
      { id: 'q3', question: 'Complete', parts: ['A grama é ', '.'], correctAnswers: ['verde'] },
    ],
  },
  {
    title: 'Rotina Diária',
    slug: 'a2-pt-rotina-diaria-fc',
    description: 'Vocabulário sobre a rotina do dia a dia.',
    targetLanguage: 'pt',
    level: 'A2',
    type: 'flashcard',
    estimatedMinutes: 4,
    questions: [
      { id: 'q1', question: 'acordar', front: 'acordar', back: 'to wake up' },
      { id: 'q2', question: 'tomar café da manhã', front: 'tomar café da manhã', back: 'to have breakfast' },
      { id: 'q3', question: 'dormir', front: 'dormir', back: 'to sleep' },
    ],
  },
  {
    title: 'Viagens e Turismo',
    slug: 'b1-pt-viagens-e-turismo-mc',
    description: 'Vocabulário útil para viajar por países de língua portuguesa.',
    targetLanguage: 'pt',
    level: 'B1',
    type: 'multiple-choice',
    estimatedMinutes: 5,
    questions: [
      { id: 'q1', question: 'Onde compro a passagem de ônibus?', options: ['Na rodoviária', 'No hospital', 'Na padaria', 'No banco'], correctAnswer: 'Na rodoviária' },
      { id: 'q2', question: 'O que significa "hospedagem"?', options: ['Acomodação', 'Comida', 'Transporte', 'Passaporte'], correctAnswer: 'Acomodação' },
      { id: 'q3', question: 'Como se pede a conta no restaurante?', options: ['A conta, por favor', 'Bom dia', 'Com licença', 'Desculpa'], correctAnswer: 'A conta, por favor' },
    ],
  },
  {
    title: 'Conectivos e Conjunções',
    slug: 'b2-pt-conectivos-gap',
    description: 'Pratique conectivos usados para argumentar e conectar ideias.',
    targetLanguage: 'pt',
    level: 'B2',
    type: 'fill-gap',
    estimatedMinutes: 6,
    questions: [
      { id: 'q1', question: 'Complete', parts: ['Estava cansado, ', ' foi trabalhar assim mesmo.'], correctAnswers: ['porém'] },
      { id: 'q2', question: 'Complete', parts: ['Estudou muito, ', ', passou na prova.'], correctAnswers: ['portanto'] },
      { id: 'q3', question: 'Complete', parts: ['Ele chegou tarde ', ' o trânsito.'], correctAnswers: ['devido'] },
    ],
  },
  {
    title: 'Registro Formal vs Informal',
    slug: 'c1-pt-registro-formal-informal-fc',
    description: 'Diferencie linguagem formal e informal em português.',
    targetLanguage: 'pt',
    level: 'C1',
    type: 'flashcard',
    estimatedMinutes: 5,
    questions: [
      { id: 'q1', question: 'informal: "beleza?"', front: 'beleza?', back: 'formal: "como vai?"' },
      { id: 'q2', question: 'informal: "valeu"', front: 'valeu', back: 'formal: "muito obrigado"' },
      { id: 'q3', question: 'informal: "tô indo"', front: 'tô indo', back: 'formal: "estou indo"' },
    ],
  },
  {
    title: 'Literatura e Cultura',
    slug: 'c2-pt-literatura-e-cultura-mc',
    description: 'Questões avançadas sobre literatura e cultura lusófona.',
    targetLanguage: 'pt',
    level: 'C2',
    type: 'multiple-choice',
    estimatedMinutes: 7,
    questions: [
      { id: 'q1', question: 'Quem escreveu "Dom Casmurro"?', options: ['Machado de Assis', 'José Saramago', 'Fernando Pessoa', 'Clarice Lispector'], correctAnswer: 'Machado de Assis' },
      { id: 'q2', question: 'Qual movimento literário Fernando Pessoa integrou?', options: ['Modernismo', 'Barroco', 'Arcadismo', 'Realismo'], correctAnswer: 'Modernismo' },
      { id: 'q3', question: 'Clarice Lispector nasceu em qual país?', options: ['Ucrânia', 'Brasil', 'Portugal', 'Angola'], correctAnswer: 'Ucrânia' },
    ],
  },

  {
    title: 'Numbers and Colors',
    slug: 'a1-en-numbers-and-colors-gap',
    description: 'Practice basic numbers and colors in English.',
    targetLanguage: 'en',
    level: 'A1',
    type: 'fill-gap',
    estimatedMinutes: 4,
    questions: [
      { id: 'q1', question: 'Complete', parts: ['I am ', ' years old. (3)'], correctAnswers: ['three'] },
      { id: 'q2', question: 'Complete', parts: ['The sky is ', '.'], correctAnswers: ['blue'] },
      { id: 'q3', question: 'Complete', parts: ['The grass is ', '.'], correctAnswers: ['green'] },
    ],
  },
  {
    title: 'Daily Routine',
    slug: 'a2-en-daily-routine-fc',
    description: 'Vocabulary for everyday routines.',
    targetLanguage: 'en',
    level: 'A2',
    type: 'flashcard',
    estimatedMinutes: 4,
    questions: [
      { id: 'q1', question: 'to wake up', front: 'to wake up', back: 'acordar' },
      { id: 'q2', question: 'to have breakfast', front: 'to have breakfast', back: 'tomar café da manhã' },
      { id: 'q3', question: 'to sleep', front: 'to sleep', back: 'dormir' },
    ],
  },
  {
    title: 'Travel and Tourism',
    slug: 'b1-en-travel-and-tourism-mc',
    description: 'Useful vocabulary for traveling in English-speaking countries.',
    targetLanguage: 'en',
    level: 'B1',
    type: 'multiple-choice',
    estimatedMinutes: 5,
    questions: [
      { id: 'q1', question: 'Where do you buy a bus ticket?', options: ['At the bus station', 'At the hospital', 'At the bakery', 'At the bank'], correctAnswer: 'At the bus station' },
      { id: 'q2', question: 'What does "accommodation" mean?', options: ['A place to stay', 'Food', 'Transport', 'Passport'], correctAnswer: 'A place to stay' },
      { id: 'q3', question: 'How do you ask for the bill?', options: ['Check, please', 'Good morning', 'Excuse me', 'Sorry'], correctAnswer: 'Check, please' },
    ],
  },
  {
    title: 'Linking Words',
    slug: 'b2-en-linking-words-gap',
    description: 'Practice connectors used to argue and link ideas.',
    targetLanguage: 'en',
    level: 'B2',
    type: 'fill-gap',
    estimatedMinutes: 6,
    questions: [
      { id: 'q1', question: 'Complete', parts: ['He was tired, ', ' he went to work anyway.'], correctAnswers: ['however'] },
      { id: 'q2', question: 'Complete', parts: ['She studied hard, ', ', she passed the exam.'], correctAnswers: ['therefore'] },
      { id: 'q3', question: 'Complete', parts: ['He arrived late ', ' the traffic.'], correctAnswers: ['due'] },
    ],
  },
  {
    title: 'Formal vs Informal Register',
    slug: 'c1-en-formal-vs-informal-register-fc',
    description: 'Tell apart formal and informal English expressions.',
    targetLanguage: 'en',
    level: 'C1',
    type: 'flashcard',
    estimatedMinutes: 5,
    questions: [
      { id: 'q1', question: 'informal: "what\'s up?"', front: "what's up?", back: 'formal: "how are you?"' },
      { id: 'q2', question: 'informal: "thanks a lot"', front: 'thanks a lot', back: 'formal: "thank you very much"' },
      { id: 'q3', question: 'informal: "gonna"', front: 'gonna', back: 'formal: "going to"' },
    ],
  },
  {
    title: 'Literature and Culture',
    slug: 'c2-en-literature-and-culture-mc',
    description: 'Advanced questions about English-language literature and culture.',
    targetLanguage: 'en',
    level: 'C2',
    type: 'multiple-choice',
    estimatedMinutes: 7,
    questions: [
      { id: 'q1', question: 'Who wrote "Pride and Prejudice"?', options: ['Jane Austen', 'Virginia Woolf', 'Charles Dickens', 'George Orwell'], correctAnswer: 'Jane Austen' },
      { id: 'q2', question: 'Which movement is Virginia Woolf associated with?', options: ['Modernism', 'Romanticism', 'Victorian realism', 'Gothic'], correctAnswer: 'Modernism' },
      { id: 'q3', question: '"1984" was written by whom?', options: ['George Orwell', 'Aldous Huxley', 'Ray Bradbury', 'H.G. Wells'], correctAnswer: 'George Orwell' },
    ],
  },

  {
    title: 'Nombres et Couleurs',
    slug: 'a1-fr-nombres-et-couleurs-gap',
    description: 'Pratiquez les nombres et couleurs de base en français.',
    targetLanguage: 'fr',
    level: 'A1',
    type: 'fill-gap',
    estimatedMinutes: 4,
    questions: [
      { id: 'q1', question: 'Complétez', parts: ["J'ai ", ' ans. (3)'], correctAnswers: ['trois'] },
      { id: 'q2', question: 'Complétez', parts: ['Le ciel est ', '.'], correctAnswers: ['bleu'] },
      { id: 'q3', question: 'Complétez', parts: ["L'herbe est ", '.'], correctAnswers: ['verte'] },
    ],
  },
  {
    title: 'Routine Quotidienne',
    slug: 'a2-fr-routine-quotidienne-fc',
    description: 'Vocabulaire de la routine quotidienne.',
    targetLanguage: 'fr',
    level: 'A2',
    type: 'flashcard',
    estimatedMinutes: 4,
    questions: [
      { id: 'q1', question: 'se réveiller', front: 'se réveiller', back: 'to wake up' },
      { id: 'q2', question: 'prendre le petit-déjeuner', front: 'prendre le petit-déjeuner', back: 'to have breakfast' },
      { id: 'q3', question: 'dormir', front: 'dormir', back: 'to sleep' },
    ],
  },
  {
    title: 'Voyage et Tourisme',
    slug: 'b1-fr-voyage-et-tourisme-mc',
    description: 'Vocabulaire utile pour voyager dans les pays francophones.',
    targetLanguage: 'fr',
    level: 'B1',
    type: 'multiple-choice',
    estimatedMinutes: 5,
    questions: [
      { id: 'q1', question: "Où achète-t-on un billet de bus?", options: ['À la gare routière', "À l'hôpital", 'À la boulangerie', 'À la banque'], correctAnswer: 'À la gare routière' },
      { id: 'q2', question: 'Que signifie "hébergement"?', options: ['Logement', 'Nourriture', 'Transport', 'Passeport'], correctAnswer: 'Logement' },
      { id: 'q3', question: "Comment demande-t-on l'addition?", options: ["L'addition, s'il vous plaît", 'Bonjour', 'Excusez-moi', 'Pardon'], correctAnswer: "L'addition, s'il vous plaît" },
    ],
  },
  {
    title: 'Mots de Liaison',
    slug: 'b2-fr-mots-de-liaison-gap',
    description: 'Pratiquez les connecteurs logiques pour argumenter.',
    targetLanguage: 'fr',
    level: 'B2',
    type: 'fill-gap',
    estimatedMinutes: 6,
    questions: [
      { id: 'q1', question: 'Complétez', parts: ['Il était fatigué, ', ' il est allé travailler quand même.'], correctAnswers: ['cependant'] },
      { id: 'q2', question: 'Complétez', parts: ['Elle a beaucoup étudié, ', ', elle a réussi.'], correctAnswers: ['donc'] },
      { id: 'q3', question: 'Complétez', parts: ['Il est arrivé en retard ', ' à la circulation.'], correctAnswers: ['dû'] },
    ],
  },
  {
    title: 'Registre Formel vs Informel',
    slug: 'c1-fr-registre-formel-informel-fc',
    description: 'Différenciez le langage formel et informel en français.',
    targetLanguage: 'fr',
    level: 'C1',
    type: 'flashcard',
    estimatedMinutes: 5,
    questions: [
      { id: 'q1', question: 'informel: "ça va?"', front: 'ça va?', back: 'formel: "comment allez-vous?"' },
      { id: 'q2', question: 'informel: "merci beaucoup"', front: 'merci beaucoup (familier)', back: 'formel: "je vous remercie"' },
      { id: 'q3', question: 'informel: "je vais"', front: "j'vais (familier)", back: 'formel: "je vais"' },
    ],
  },
  {
    title: 'Littérature et Culture',
    slug: 'c2-fr-litterature-et-culture-mc',
    description: 'Questions avancées sur la littérature et la culture francophone.',
    targetLanguage: 'fr',
    level: 'C2',
    type: 'multiple-choice',
    estimatedMinutes: 7,
    questions: [
      { id: 'q1', question: 'Qui a écrit "Les Misérables"?', options: ['Victor Hugo', 'Albert Camus', 'Molière', 'Voltaire'], correctAnswer: 'Victor Hugo' },
      { id: 'q2', question: 'Quel mouvement est associé à Albert Camus?', options: ['Existentialisme', 'Romantisme', 'Classicisme', 'Symbolisme'], correctAnswer: 'Existentialisme' },
      { id: 'q3', question: 'Molière était principalement un auteur de quoi?', options: ['Théâtre', 'Poésie épique', 'Romans policiers', 'Essais scientifiques'], correctAnswer: 'Théâtre' },
    ],
  },
];

async function uploadLevelImages(strapi) {
  const fs = require('fs-extra');
  const mime = require('mime-types');

  const cache = {};
  const map = {};

  for (const [level, fileName] of Object.entries(LEVEL_IMAGE_FILES)) {
    if (!cache[fileName]) {
      const filePath = path.join(FRONTEND_LEVELS_DIR, fileName);
      const stats = fs.statSync(filePath);
      const [uploaded] = await strapi.plugin('upload').service('upload').upload({
        files: {
          filepath: filePath,
          originalFilename: fileName,
          size: stats.size,
          mimetype: mime.lookup(fileName) || 'image/svg+xml',
        },
        data: {
          fileInfo: {
            alternativeText: `Level visual ${fileName}`,
            caption: fileName,
            name: fileName,
          },
        },
      });
      cache[fileName] = uploaded.id;
    }
    map[level] = cache[fileName];
  }

  return map;
}

async function upsertQuiz(strapi, quiz, isPublic, imageId) {
  const data = { ...quiz, isPublic, ...(imageId ? { image: imageId } : {}) };

  const existing = await strapi.documents('api::quiz.quiz').findFirst({
    filters: { slug: quiz.slug },
  });

  if (existing) {
    await strapi.documents('api::quiz.quiz').update({
      documentId: existing.documentId,
      data,
      status: 'published',
    });
    return 'updated';
  }

  await strapi.documents('api::quiz.quiz').create({
    data,
    status: 'published',
  });
  return 'created';
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  const imageByLevel = await uploadLevelImages(app);

  const counts = { created: 0, updated: 0 };

  for (const quiz of [...publicQuizzes, ...extraPublicQuizzes]) {
    const result = await upsertQuiz(app, quiz, true, imageByLevel[quiz.level]);
    counts[result] += 1;
  }

  for (const quiz of privateQuizzes) {
    const result = await upsertQuiz(app, quiz, false, imageByLevel[quiz.level]);
    counts[result] += 1;
  }

  console.log(`Quizzes created: ${counts.created}, updated: ${counts.updated}`);

  await app.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
