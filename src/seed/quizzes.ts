export const LEVEL_IMAGE_FILES: Record<string, string> = {
  "A1": "a1.svg",
  "A2": "a2.svg",
  "B1": "b1.svg",
  "B2": "b2.svg",
  "C1": "c1-c2.svg",
  "C2": "c1-c2.svg"
};

export type SeedQuiz = {
  slug: string;
  title: string;
  description?: string;
  targetLanguage: string;
  level: string;
  type: string;
  questions: unknown[];
  estimatedMinutes?: number;
  isPublic: boolean;
};

export const QUIZZES: SeedQuiz[] = [
  {
    "title": "Saudações Básicas",
    "slug": "a1-pt-saudacoes-basicas-mc",
    "description": "Aprenda a cumprimentar e se apresentar em português.",
    "targetLanguage": "pt",
    "level": "A1",
    "type": "multiple-choice",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "Como se diz \"hello\" em português?",
        "options": [
          "Olá",
          "Tchau",
          "Obrigado",
          "Por favor"
        ],
        "correctAnswer": "Olá"
      },
      {
        "id": "q2",
        "question": "Qual é a resposta educada para \"Como você está?\"",
        "options": [
          "Estou bem, obrigado",
          "Banana",
          "Amanhã",
          "Talvez"
        ],
        "correctAnswer": "Estou bem, obrigado"
      },
      {
        "id": "q3",
        "question": "Como se despede alguém informalmente?",
        "options": [
          "Tchau",
          "Sim",
          "Não",
          "Café"
        ],
        "correctAnswer": "Tchau"
      },
      {
        "id": "q4",
        "question": "Qual palavra significa \"obrigado\"?",
        "options": [
          "Obrigado",
          "Depois",
          "Aqui",
          "Ali"
        ],
        "correctAnswer": "Obrigado"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Ser ou Estar",
    "slug": "a2-pt-ser-ou-estar-gap",
    "description": "Pratique a diferença entre os verbos \"ser\" e \"estar\".",
    "targetLanguage": "pt",
    "level": "A2",
    "type": "fill-gap",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "Complete com o verbo correto",
        "parts": [
          "Eu ",
          " médico."
        ],
        "correctAnswers": [
          "sou"
        ]
      },
      {
        "id": "q2",
        "question": "Complete com o verbo correto",
        "parts": [
          "Nós ",
          " cansados hoje."
        ],
        "correctAnswers": [
          "estamos"
        ]
      },
      {
        "id": "q3",
        "question": "Complete com o verbo correto",
        "parts": [
          "Ela ",
          " brasileira."
        ],
        "correctAnswers": [
          "é"
        ]
      },
      {
        "id": "q4",
        "question": "Complete com o verbo correto",
        "parts": [
          "Vocês ",
          " na escola agora."
        ],
        "correctAnswers": [
          "estão"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Vocabulário do Dia a Dia",
    "slug": "b1-pt-vocabulario-cotidiano-fc",
    "description": "Revise palavras comuns usadas no cotidiano.",
    "targetLanguage": "pt",
    "level": "B1",
    "type": "flashcard",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "trabalho",
        "front": "trabalho",
        "back": "job / work"
      },
      {
        "id": "q2",
        "question": "mercado",
        "front": "mercado",
        "back": "market"
      },
      {
        "id": "q3",
        "question": "reunião",
        "front": "reunião",
        "back": "meeting"
      },
      {
        "id": "q4",
        "question": "vizinho",
        "front": "vizinho",
        "back": "neighbor"
      },
      {
        "id": "q5",
        "question": "almoço",
        "front": "almoço",
        "back": "lunch"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Subjuntivo Básico",
    "slug": "b2-pt-subjuntivo-basico-mc",
    "description": "Introdução ao modo subjuntivo em situações comuns.",
    "targetLanguage": "pt",
    "level": "B2",
    "type": "multiple-choice",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "Espero que você ___ bem.",
        "options": [
          "esteja",
          "está",
          "estava",
          "estar"
        ],
        "correctAnswer": "esteja"
      },
      {
        "id": "q2",
        "question": "Talvez ela ___ amanhã.",
        "options": [
          "venha",
          "vem",
          "veio",
          "vir"
        ],
        "correctAnswer": "venha"
      },
      {
        "id": "q3",
        "question": "Se eu ___ tempo, eu viajaria.",
        "options": [
          "tivesse",
          "tenho",
          "tive",
          "ter"
        ],
        "correctAnswer": "tivesse"
      },
      {
        "id": "q4",
        "question": "Quero que vocês ___ silêncio.",
        "options": [
          "façam",
          "fazem",
          "fizeram",
          "fazer"
        ],
        "correctAnswer": "façam"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Expressões Idiomáticas",
    "slug": "c1-pt-expressoes-idiomaticas-gap",
    "description": "Complete expressões idiomáticas comuns do português.",
    "targetLanguage": "pt",
    "level": "C1",
    "type": "fill-gap",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Complete a expressão",
        "parts": [
          "Custar os olhos da ",
          "."
        ],
        "correctAnswers": [
          "cara"
        ]
      },
      {
        "id": "q2",
        "question": "Complete a expressão",
        "parts": [
          "Matar dois coelhos com uma ",
          " cajadada só."
        ],
        "correctAnswers": [
          "só"
        ]
      },
      {
        "id": "q3",
        "question": "Complete a expressão",
        "parts": [
          "Chorar sobre o leite ",
          "."
        ],
        "correctAnswers": [
          "derramado"
        ]
      },
      {
        "id": "q4",
        "question": "Complete a expressão",
        "parts": [
          "Pagar o ",
          " pelo cordeiro."
        ],
        "correctAnswers": [
          "pato"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Nuances Lexicais",
    "slug": "c2-pt-nuances-lexicais-fc",
    "description": "Diferencie palavras de significado próximo em contextos formais.",
    "targetLanguage": "pt",
    "level": "C2",
    "type": "flashcard",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "acolher x abrigar",
        "front": "acolher",
        "back": "to welcome / receive warmly (emotional)"
      },
      {
        "id": "q2",
        "question": "abrigar",
        "front": "abrigar",
        "back": "to shelter / house (physical protection)"
      },
      {
        "id": "q3",
        "question": "perceber x notar",
        "front": "perceber",
        "back": "to realize / perceive (deeper understanding)"
      },
      {
        "id": "q4",
        "question": "notar",
        "front": "notar",
        "back": "to notice (surface observation)"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Basic Greetings",
    "slug": "a1-en-basic-greetings-mc",
    "description": "Learn how to greet people and introduce yourself in English.",
    "targetLanguage": "en",
    "level": "A1",
    "type": "multiple-choice",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "How do you say \"olá\" in English?",
        "options": [
          "Hello",
          "Goodbye",
          "Thanks",
          "Please"
        ],
        "correctAnswer": "Hello"
      },
      {
        "id": "q2",
        "question": "What is a polite reply to \"How are you?\"",
        "options": [
          "I am fine, thank you",
          "Banana",
          "Tomorrow",
          "Maybe"
        ],
        "correctAnswer": "I am fine, thank you"
      },
      {
        "id": "q3",
        "question": "What do you say when leaving informally?",
        "options": [
          "Bye",
          "Yes",
          "No",
          "Coffee"
        ],
        "correctAnswer": "Bye"
      },
      {
        "id": "q4",
        "question": "Which word means \"thank you\"?",
        "options": [
          "Thanks",
          "Later",
          "Here",
          "There"
        ],
        "correctAnswer": "Thanks"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Simple Present Tense",
    "slug": "a2-en-simple-present-gap",
    "description": "Practice conjugating verbs in the simple present tense.",
    "targetLanguage": "en",
    "level": "A2",
    "type": "fill-gap",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "Complete with the correct verb form",
        "parts": [
          "She ",
          " to school every day."
        ],
        "correctAnswers": [
          "goes"
        ]
      },
      {
        "id": "q2",
        "question": "Complete with the correct verb form",
        "parts": [
          "They ",
          " coffee in the morning."
        ],
        "correctAnswers": [
          "drink"
        ]
      },
      {
        "id": "q3",
        "question": "Complete with the correct verb form",
        "parts": [
          "He ",
          " like spicy food."
        ],
        "correctAnswers": [
          "doesn't"
        ]
      },
      {
        "id": "q4",
        "question": "Complete with the correct verb form",
        "parts": [
          "I ",
          " in a small apartment."
        ],
        "correctAnswers": [
          "live"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Everyday Vocabulary",
    "slug": "b1-en-everyday-vocabulary-fc",
    "description": "Review common words used in daily life.",
    "targetLanguage": "en",
    "level": "B1",
    "type": "flashcard",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "job",
        "front": "job",
        "back": "trabalho"
      },
      {
        "id": "q2",
        "question": "market",
        "front": "market",
        "back": "mercado"
      },
      {
        "id": "q3",
        "question": "meeting",
        "front": "meeting",
        "back": "reunião"
      },
      {
        "id": "q4",
        "question": "neighbor",
        "front": "neighbor",
        "back": "vizinho"
      },
      {
        "id": "q5",
        "question": "lunch",
        "front": "lunch",
        "back": "almoço"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Conditional Sentences",
    "slug": "b2-en-conditional-sentences-mc",
    "description": "Practice first and second conditional structures.",
    "targetLanguage": "en",
    "level": "B2",
    "type": "multiple-choice",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "If it rains, I ___ at home.",
        "options": [
          "will stay",
          "stayed",
          "stay",
          "staying"
        ],
        "correctAnswer": "will stay"
      },
      {
        "id": "q2",
        "question": "If I had more time, I ___ travel more.",
        "options": [
          "would",
          "will",
          "had",
          "have"
        ],
        "correctAnswer": "would"
      },
      {
        "id": "q3",
        "question": "If she studies, she ___ pass.",
        "options": [
          "will",
          "would",
          "was",
          "is"
        ],
        "correctAnswer": "will"
      },
      {
        "id": "q4",
        "question": "If I were you, I ___ apologize.",
        "options": [
          "would",
          "will",
          "am",
          "was"
        ],
        "correctAnswer": "would"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Phrasal Verbs",
    "slug": "c1-en-phrasal-verbs-gap",
    "description": "Complete common English phrasal verbs.",
    "targetLanguage": "en",
    "level": "C1",
    "type": "fill-gap",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Complete the phrasal verb",
        "parts": [
          "Can you ",
          " up the volume?"
        ],
        "correctAnswers": [
          "turn"
        ]
      },
      {
        "id": "q2",
        "question": "Complete the phrasal verb",
        "parts": [
          "I need to ",
          " up with the news."
        ],
        "correctAnswers": [
          "catch"
        ]
      },
      {
        "id": "q3",
        "question": "Complete the phrasal verb",
        "parts": [
          "She decided to ",
          " down the offer."
        ],
        "correctAnswers": [
          "turn"
        ]
      },
      {
        "id": "q4",
        "question": "Complete the phrasal verb",
        "parts": [
          "They will ",
          " off the meeting."
        ],
        "correctAnswers": [
          "put"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Advanced Idioms",
    "slug": "c2-en-advanced-idioms-fc",
    "description": "Learn nuanced idiomatic expressions used by native speakers.",
    "targetLanguage": "en",
    "level": "C2",
    "type": "flashcard",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "to bite the bullet",
        "front": "to bite the bullet",
        "back": "to endure a painful situation bravely"
      },
      {
        "id": "q2",
        "question": "to burn the midnight oil",
        "front": "to burn the midnight oil",
        "back": "to work late into the night"
      },
      {
        "id": "q3",
        "question": "to cut corners",
        "front": "to cut corners",
        "back": "to do something poorly to save time or money"
      },
      {
        "id": "q4",
        "question": "to read between the lines",
        "front": "to read between the lines",
        "back": "to understand the hidden meaning"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Salutations de Base",
    "slug": "a1-fr-salutations-de-base-mc",
    "description": "Apprenez à saluer et vous présenter en français.",
    "targetLanguage": "fr",
    "level": "A1",
    "type": "multiple-choice",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "Comment dit-on \"hello\" en français?",
        "options": [
          "Bonjour",
          "Au revoir",
          "Merci",
          "S'il vous plaît"
        ],
        "correctAnswer": "Bonjour"
      },
      {
        "id": "q2",
        "question": "Quelle est une réponse polie à \"Comment allez-vous?\"",
        "options": [
          "Je vais bien, merci",
          "Banane",
          "Demain",
          "Peut-être"
        ],
        "correctAnswer": "Je vais bien, merci"
      },
      {
        "id": "q3",
        "question": "Que dit-on pour partir de façon informelle?",
        "options": [
          "Salut",
          "Oui",
          "Non",
          "Café"
        ],
        "correctAnswer": "Salut"
      },
      {
        "id": "q4",
        "question": "Quel mot signifie \"merci\"?",
        "options": [
          "Merci",
          "Plus tard",
          "Ici",
          "Là"
        ],
        "correctAnswer": "Merci"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Les Articles Définis",
    "slug": "a2-fr-articles-definis-gap",
    "description": "Pratiquez les articles définis le, la, les.",
    "targetLanguage": "fr",
    "level": "A2",
    "type": "fill-gap",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "Complétez avec le bon article",
        "parts": [
          "",
          " chat dort sur le canapé."
        ],
        "correctAnswers": [
          "Le"
        ]
      },
      {
        "id": "q2",
        "question": "Complétez avec le bon article",
        "parts": [
          "",
          " maison est très grande."
        ],
        "correctAnswers": [
          "La"
        ]
      },
      {
        "id": "q3",
        "question": "Complétez avec le bon article",
        "parts": [
          "",
          " enfants jouent dans le jardin."
        ],
        "correctAnswers": [
          "Les"
        ]
      },
      {
        "id": "q4",
        "question": "Complétez avec le bon article",
        "parts": [
          "",
          " eau est froide."
        ],
        "correctAnswers": [
          "L'"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Vocabulaire Quotidien",
    "slug": "b1-fr-vocabulaire-quotidien-fc",
    "description": "Révisez des mots courants utilisés au quotidien.",
    "targetLanguage": "fr",
    "level": "B1",
    "type": "flashcard",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "travail",
        "front": "travail",
        "back": "job / work"
      },
      {
        "id": "q2",
        "question": "marché",
        "front": "marché",
        "back": "market"
      },
      {
        "id": "q3",
        "question": "réunion",
        "front": "réunion",
        "back": "meeting"
      },
      {
        "id": "q4",
        "question": "voisin",
        "front": "voisin",
        "back": "neighbor"
      },
      {
        "id": "q5",
        "question": "déjeuner",
        "front": "déjeuner",
        "back": "lunch"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Le Subjonctif Présent",
    "slug": "b2-fr-subjonctif-present-mc",
    "description": "Introduction au subjonctif présent dans des situations courantes.",
    "targetLanguage": "fr",
    "level": "B2",
    "type": "multiple-choice",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "J'espère que tu ___ bien.",
        "options": [
          "ailles",
          "vas",
          "allais",
          "aller"
        ],
        "correctAnswer": "ailles"
      },
      {
        "id": "q2",
        "question": "Il faut que nous ___ à l’heure.",
        "options": [
          "soyons",
          "sommes",
          "étions",
          "être"
        ],
        "correctAnswer": "soyons"
      },
      {
        "id": "q3",
        "question": "Je veux qu'elle ___ ses devoirs.",
        "options": [
          "fasse",
          "fait",
          "faisait",
          "faire"
        ],
        "correctAnswer": "fasse"
      },
      {
        "id": "q4",
        "question": "Bien qu’il ___ fatigué, il travaille.",
        "options": [
          "soit",
          "est",
          "était",
          "être"
        ],
        "correctAnswer": "soit"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Expressions Idiomatiques",
    "slug": "c1-fr-expressions-idiomatiques-gap",
    "description": "Complétez des expressions idiomatiques courantes du français.",
    "targetLanguage": "fr",
    "level": "C1",
    "type": "fill-gap",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Complétez l'expression",
        "parts": [
          "Coûter les yeux de la ",
          "."
        ],
        "correctAnswers": [
          "tête"
        ]
      },
      {
        "id": "q2",
        "question": "Complétez l'expression",
        "parts": [
          "Avoir un chat dans la ",
          "."
        ],
        "correctAnswers": [
          "gorge"
        ]
      },
      {
        "id": "q3",
        "question": "Complétez l'expression",
        "parts": [
          "Poser un lapin à ",
          "."
        ],
        "correctAnswers": [
          "quelqu’un"
        ]
      },
      {
        "id": "q4",
        "question": "Complétez l'expression",
        "parts": [
          "Tomber dans les ",
          "."
        ],
        "correctAnswers": [
          "pommes"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Nuances Lexicales",
    "slug": "c2-fr-nuances-lexicales-fc",
    "description": "Différenciez des mots de sens proche dans des contextes formels.",
    "targetLanguage": "fr",
    "level": "C2",
    "type": "flashcard",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "accueillir vs abriter",
        "front": "accueillir",
        "back": "to welcome (emotional / social)"
      },
      {
        "id": "q2",
        "question": "abriter",
        "front": "abriter",
        "back": "to shelter / house (physical protection)"
      },
      {
        "id": "q3",
        "question": "apercevoir vs remarquer",
        "front": "apercevoir",
        "back": "to glimpse / notice briefly"
      },
      {
        "id": "q4",
        "question": "remarquer",
        "front": "remarquer",
        "back": "to notice / point out (deliberate observation)"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Família",
    "slug": "a1-pt-familia-fc",
    "description": "Aprenda os nomes dos membros da família.",
    "targetLanguage": "pt",
    "level": "A1",
    "type": "flashcard",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "pai",
        "front": "pai",
        "back": "father"
      },
      {
        "id": "q2",
        "question": "mãe",
        "front": "mãe",
        "back": "mother"
      },
      {
        "id": "q3",
        "question": "irmão",
        "front": "irmão",
        "back": "brother"
      },
      {
        "id": "q4",
        "question": "irmã",
        "front": "irmã",
        "back": "sister"
      },
      {
        "id": "q5",
        "question": "avó",
        "front": "avó",
        "back": "grandmother"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Dias da Semana",
    "slug": "a1-pt-dias-da-semana-mc",
    "description": "Pratique os dias da semana em português.",
    "targetLanguage": "pt",
    "level": "A1",
    "type": "multiple-choice",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "Que dia vem depois de segunda-feira?",
        "options": [
          "terça-feira",
          "quarta-feira",
          "domingo",
          "sábado"
        ],
        "correctAnswer": "terça-feira"
      },
      {
        "id": "q2",
        "question": "Qual é o primeiro dia da semana no calendário brasileiro?",
        "options": [
          "domingo",
          "segunda-feira",
          "sábado",
          "sexta-feira"
        ],
        "correctAnswer": "domingo"
      },
      {
        "id": "q3",
        "question": "Como se diz 'Friday' em português?",
        "options": [
          "sexta-feira",
          "quinta-feira",
          "sábado",
          "domingo"
        ],
        "correctAnswer": "sexta-feira"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Comida e Bebida",
    "slug": "a1-pt-comida-e-bebida-gap",
    "description": "Complete frases simples sobre comida e bebida.",
    "targetLanguage": "pt",
    "level": "A1",
    "type": "fill-gap",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "Complete a frase",
        "parts": [
          "Eu quero um copo de ",
          "."
        ],
        "correctAnswers": [
          "água"
        ]
      },
      {
        "id": "q2",
        "question": "Complete a frase",
        "parts": [
          "No café da manhã eu bebo ",
          "."
        ],
        "correctAnswers": [
          "café"
        ]
      },
      {
        "id": "q3",
        "question": "Complete a frase",
        "parts": [
          "Vou comer um sanduíche de ",
          "."
        ],
        "correctAnswers": [
          "queijo"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Objetos da Sala de Aula",
    "slug": "a1-pt-objetos-sala-aula-fc",
    "description": "Vocabulário de objetos usados na escola.",
    "targetLanguage": "pt",
    "level": "A1",
    "type": "flashcard",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "caderno",
        "front": "caderno",
        "back": "notebook"
      },
      {
        "id": "q2",
        "question": "lápis",
        "front": "lápis",
        "back": "pencil"
      },
      {
        "id": "q3",
        "question": "mochila",
        "front": "mochila",
        "back": "backpack"
      },
      {
        "id": "q4",
        "question": "quadro",
        "front": "quadro",
        "back": "board"
      },
      {
        "id": "q5",
        "question": "borracha",
        "front": "borracha",
        "back": "eraser"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Números 11-20",
    "slug": "a1-pt-numeros-11-20-mc",
    "description": "Pratique números de 11 a 20 em português.",
    "targetLanguage": "pt",
    "level": "A1",
    "type": "multiple-choice",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "Como se escreve o número 15?",
        "options": [
          "quinze",
          "treze",
          "dezesseis",
          "doze"
        ],
        "correctAnswer": "quinze"
      },
      {
        "id": "q2",
        "question": "Quanto é 'onze mais um'?",
        "options": [
          "doze",
          "treze",
          "onze",
          "dez"
        ],
        "correctAnswer": "doze"
      },
      {
        "id": "q3",
        "question": "Como se diz 20 em português?",
        "options": [
          "vinte",
          "dez",
          "doze",
          "quinze"
        ],
        "correctAnswer": "vinte"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Clima",
    "slug": "a1-pt-clima-gap",
    "description": "Vocabulário básico sobre o clima.",
    "targetLanguage": "pt",
    "level": "A1",
    "type": "fill-gap",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "Complete a frase",
        "parts": [
          "Hoje está muito ",
          " lá fora."
        ],
        "correctAnswers": [
          "frio"
        ]
      },
      {
        "id": "q2",
        "question": "Complete a frase",
        "parts": [
          "Está chovendo, leve um ",
          "."
        ],
        "correctAnswers": [
          "guarda-chuva"
        ]
      },
      {
        "id": "q3",
        "question": "Complete a frase",
        "parts": [
          "No verão o tempo fica ",
          "."
        ],
        "correctAnswers": [
          "quente"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Animais",
    "slug": "a1-pt-animais-fc",
    "description": "Vocabulário de animais comuns.",
    "targetLanguage": "pt",
    "level": "A1",
    "type": "flashcard",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "cachorro",
        "front": "cachorro",
        "back": "dog"
      },
      {
        "id": "q2",
        "question": "gato",
        "front": "gato",
        "back": "cat"
      },
      {
        "id": "q3",
        "question": "pássaro",
        "front": "pássaro",
        "back": "bird"
      },
      {
        "id": "q4",
        "question": "peixe",
        "front": "peixe",
        "back": "fish"
      },
      {
        "id": "q5",
        "question": "cavalo",
        "front": "cavalo",
        "back": "horse"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Roupas",
    "slug": "a1-pt-roupas-mc",
    "description": "Vocabulário sobre peças de roupa.",
    "targetLanguage": "pt",
    "level": "A1",
    "type": "multiple-choice",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "Qual dessas é uma peça de roupa para os pés?",
        "options": [
          "sapato",
          "camisa",
          "chapéu",
          "cinto"
        ],
        "correctAnswer": "sapato"
      },
      {
        "id": "q2",
        "question": "Como se diz 'jacket' em português?",
        "options": [
          "jaqueta",
          "calça",
          "vestido",
          "meia"
        ],
        "correctAnswer": "jaqueta"
      },
      {
        "id": "q3",
        "question": "O que você usa na cabeça quando está sol?",
        "options": [
          "chapéu",
          "sapato",
          "luva",
          "cinto"
        ],
        "correctAnswer": "chapéu"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Family",
    "slug": "a1-en-family-fc",
    "description": "Learn family member names in English.",
    "targetLanguage": "en",
    "level": "A1",
    "type": "flashcard",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "father",
        "front": "father",
        "back": "pai"
      },
      {
        "id": "q2",
        "question": "mother",
        "front": "mother",
        "back": "mãe"
      },
      {
        "id": "q3",
        "question": "brother",
        "front": "brother",
        "back": "irmão"
      },
      {
        "id": "q4",
        "question": "sister",
        "front": "sister",
        "back": "irmã"
      },
      {
        "id": "q5",
        "question": "grandmother",
        "front": "grandmother",
        "back": "avó"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Days of the Week",
    "slug": "a1-en-days-of-the-week-mc",
    "description": "Practice the days of the week in English.",
    "targetLanguage": "en",
    "level": "A1",
    "type": "multiple-choice",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "What day comes after Monday?",
        "options": [
          "Tuesday",
          "Wednesday",
          "Sunday",
          "Saturday"
        ],
        "correctAnswer": "Tuesday"
      },
      {
        "id": "q2",
        "question": "Which day is the last day of the work week (Mon-Fri)?",
        "options": [
          "Friday",
          "Sunday",
          "Wednesday",
          "Saturday"
        ],
        "correctAnswer": "Friday"
      },
      {
        "id": "q3",
        "question": "How do you say 'sexta-feira' in English?",
        "options": [
          "Friday",
          "Thursday",
          "Saturday",
          "Sunday"
        ],
        "correctAnswer": "Friday"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Food and Drink",
    "slug": "a1-en-food-and-drink-gap",
    "description": "Complete simple sentences about food and drink.",
    "targetLanguage": "en",
    "level": "A1",
    "type": "fill-gap",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "Complete the sentence",
        "parts": [
          "I want a glass of ",
          "."
        ],
        "correctAnswers": [
          "water"
        ]
      },
      {
        "id": "q2",
        "question": "Complete the sentence",
        "parts": [
          "For breakfast I drink ",
          "."
        ],
        "correctAnswers": [
          "coffee"
        ]
      },
      {
        "id": "q3",
        "question": "Complete the sentence",
        "parts": [
          "I will eat a cheese ",
          "."
        ],
        "correctAnswers": [
          "sandwich"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Classroom Objects",
    "slug": "a1-en-classroom-objects-fc",
    "description": "Vocabulary for objects used at school.",
    "targetLanguage": "en",
    "level": "A1",
    "type": "flashcard",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "notebook",
        "front": "notebook",
        "back": "caderno"
      },
      {
        "id": "q2",
        "question": "pencil",
        "front": "pencil",
        "back": "lápis"
      },
      {
        "id": "q3",
        "question": "backpack",
        "front": "backpack",
        "back": "mochila"
      },
      {
        "id": "q4",
        "question": "board",
        "front": "board",
        "back": "quadro"
      },
      {
        "id": "q5",
        "question": "eraser",
        "front": "eraser",
        "back": "borracha"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Numbers 11-20",
    "slug": "a1-en-numbers-11-20-mc",
    "description": "Practice numbers 11 to 20 in English.",
    "targetLanguage": "en",
    "level": "A1",
    "type": "multiple-choice",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "How do you write the number 15?",
        "options": [
          "fifteen",
          "thirteen",
          "sixteen",
          "twelve"
        ],
        "correctAnswer": "fifteen"
      },
      {
        "id": "q2",
        "question": "What is 'eleven plus one'?",
        "options": [
          "twelve",
          "thirteen",
          "eleven",
          "ten"
        ],
        "correctAnswer": "twelve"
      },
      {
        "id": "q3",
        "question": "How do you say 20 in English?",
        "options": [
          "twenty",
          "ten",
          "twelve",
          "fifteen"
        ],
        "correctAnswer": "twenty"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Weather",
    "slug": "a1-en-weather-gap",
    "description": "Basic vocabulary about the weather.",
    "targetLanguage": "en",
    "level": "A1",
    "type": "fill-gap",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "Complete the sentence",
        "parts": [
          "It's very ",
          " outside today."
        ],
        "correctAnswers": [
          "cold"
        ]
      },
      {
        "id": "q2",
        "question": "Complete the sentence",
        "parts": [
          "It's raining, take an ",
          "."
        ],
        "correctAnswers": [
          "umbrella"
        ]
      },
      {
        "id": "q3",
        "question": "Complete the sentence",
        "parts": [
          "In summer the weather gets ",
          "."
        ],
        "correctAnswers": [
          "hot"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Animals",
    "slug": "a1-en-animals-fc",
    "description": "Vocabulary for common animals.",
    "targetLanguage": "en",
    "level": "A1",
    "type": "flashcard",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "dog",
        "front": "dog",
        "back": "cachorro"
      },
      {
        "id": "q2",
        "question": "cat",
        "front": "cat",
        "back": "gato"
      },
      {
        "id": "q3",
        "question": "bird",
        "front": "bird",
        "back": "pássaro"
      },
      {
        "id": "q4",
        "question": "fish",
        "front": "fish",
        "back": "peixe"
      },
      {
        "id": "q5",
        "question": "horse",
        "front": "horse",
        "back": "cavalo"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Clothing",
    "slug": "a1-en-clothing-mc",
    "description": "Vocabulary about clothing items.",
    "targetLanguage": "en",
    "level": "A1",
    "type": "multiple-choice",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "Which of these is worn on your feet?",
        "options": [
          "shoes",
          "shirt",
          "hat",
          "belt"
        ],
        "correctAnswer": "shoes"
      },
      {
        "id": "q2",
        "question": "How do you say 'jaqueta' in English?",
        "options": [
          "jacket",
          "pants",
          "dress",
          "sock"
        ],
        "correctAnswer": "jacket"
      },
      {
        "id": "q3",
        "question": "What do you wear on your head in the sun?",
        "options": [
          "hat",
          "shoes",
          "glove",
          "belt"
        ],
        "correctAnswer": "hat"
      }
    ],
    "isPublic": true
  },
  {
    "title": "La Famille",
    "slug": "a1-fr-la-famille-fc",
    "description": "Apprenez les membres de la famille en français.",
    "targetLanguage": "fr",
    "level": "A1",
    "type": "flashcard",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "père",
        "front": "père",
        "back": "father"
      },
      {
        "id": "q2",
        "question": "mère",
        "front": "mère",
        "back": "mother"
      },
      {
        "id": "q3",
        "question": "frère",
        "front": "frère",
        "back": "brother"
      },
      {
        "id": "q4",
        "question": "sœur",
        "front": "sœur",
        "back": "sister"
      },
      {
        "id": "q5",
        "question": "grand-mère",
        "front": "grand-mère",
        "back": "grandmother"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Les Jours de la Semaine",
    "slug": "a1-fr-les-jours-de-la-semaine-mc",
    "description": "Pratiquez les jours de la semaine en français.",
    "targetLanguage": "fr",
    "level": "A1",
    "type": "multiple-choice",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "Quel jour vient après lundi?",
        "options": [
          "mardi",
          "mercredi",
          "dimanche",
          "samedi"
        ],
        "correctAnswer": "mardi"
      },
      {
        "id": "q2",
        "question": "Quel est le premier jour de la semaine en France?",
        "options": [
          "lundi",
          "dimanche",
          "samedi",
          "vendredi"
        ],
        "correctAnswer": "lundi"
      },
      {
        "id": "q3",
        "question": "Comment dit-on 'Friday' en français?",
        "options": [
          "vendredi",
          "jeudi",
          "samedi",
          "dimanche"
        ],
        "correctAnswer": "vendredi"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Nourriture et Boissons",
    "slug": "a1-fr-nourriture-et-boissons-gap",
    "description": "Complétez des phrases simples sur la nourriture.",
    "targetLanguage": "fr",
    "level": "A1",
    "type": "fill-gap",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "Complétez la phrase",
        "parts": [
          "Je veux un verre d'",
          "eau."
        ],
        "correctAnswers": [
          "eau"
        ]
      },
      {
        "id": "q2",
        "question": "Complétez la phrase",
        "parts": [
          "Au petit-déjeuner je bois du ",
          "."
        ],
        "correctAnswers": [
          "café"
        ]
      },
      {
        "id": "q3",
        "question": "Complétez la phrase",
        "parts": [
          "Je vais manger un sandwich au ",
          "."
        ],
        "correctAnswers": [
          "fromage"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Objets de Classe",
    "slug": "a1-fr-objets-de-classe-fc",
    "description": "Vocabulaire des objets utilisés à l'école.",
    "targetLanguage": "fr",
    "level": "A1",
    "type": "flashcard",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "cahier",
        "front": "cahier",
        "back": "notebook"
      },
      {
        "id": "q2",
        "question": "crayon",
        "front": "crayon",
        "back": "pencil"
      },
      {
        "id": "q3",
        "question": "sac à dos",
        "front": "sac à dos",
        "back": "backpack"
      },
      {
        "id": "q4",
        "question": "tableau",
        "front": "tableau",
        "back": "board"
      },
      {
        "id": "q5",
        "question": "gomme",
        "front": "gomme",
        "back": "eraser"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Nombres 11-20",
    "slug": "a1-fr-nombres-11-20-mc",
    "description": "Pratiquez les nombres de 11 à 20 en français.",
    "targetLanguage": "fr",
    "level": "A1",
    "type": "multiple-choice",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "Comment écrit-on le nombre 15?",
        "options": [
          "quinze",
          "treize",
          "seize",
          "douze"
        ],
        "correctAnswer": "quinze"
      },
      {
        "id": "q2",
        "question": "Que vaut 'onze plus un'?",
        "options": [
          "douze",
          "treize",
          "onze",
          "dix"
        ],
        "correctAnswer": "douze"
      },
      {
        "id": "q3",
        "question": "Comment dit-on 20 en français?",
        "options": [
          "vingt",
          "dix",
          "douze",
          "quinze"
        ],
        "correctAnswer": "vingt"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Le Temps (météo)",
    "slug": "a1-fr-le-temps-meteo-gap",
    "description": "Vocabulaire de base sur la météo.",
    "targetLanguage": "fr",
    "level": "A1",
    "type": "fill-gap",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "Complétez la phrase",
        "parts": [
          "Il fait très ",
          " dehors aujourd’hui."
        ],
        "correctAnswers": [
          "froid"
        ]
      },
      {
        "id": "q2",
        "question": "Complétez la phrase",
        "parts": [
          "Il pleut, prends un ",
          "."
        ],
        "correctAnswers": [
          "parapluie"
        ]
      },
      {
        "id": "q3",
        "question": "Complétez la phrase",
        "parts": [
          "En été, il fait ",
          "."
        ],
        "correctAnswers": [
          "chaud"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Animaux",
    "slug": "a1-fr-animaux-fc",
    "description": "Vocabulaire des animaux courants.",
    "targetLanguage": "fr",
    "level": "A1",
    "type": "flashcard",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "chien",
        "front": "chien",
        "back": "dog"
      },
      {
        "id": "q2",
        "question": "chat",
        "front": "chat",
        "back": "cat"
      },
      {
        "id": "q3",
        "question": "oiseau",
        "front": "oiseau",
        "back": "bird"
      },
      {
        "id": "q4",
        "question": "poisson",
        "front": "poisson",
        "back": "fish"
      },
      {
        "id": "q5",
        "question": "cheval",
        "front": "cheval",
        "back": "horse"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Vêtements",
    "slug": "a1-fr-vetements-mc",
    "description": "Vocabulaire sur les vêtements.",
    "targetLanguage": "fr",
    "level": "A1",
    "type": "multiple-choice",
    "estimatedMinutes": 3,
    "questions": [
      {
        "id": "q1",
        "question": "Lequel de ces mots désigne un vêtement pour les pieds?",
        "options": [
          "chaussures",
          "chemise",
          "chapeau",
          "ceinture"
        ],
        "correctAnswer": "chaussures"
      },
      {
        "id": "q2",
        "question": "Comment dit-on 'jacket' en français?",
        "options": [
          "veste",
          "pantalon",
          "robe",
          "chaussette"
        ],
        "correctAnswer": "veste"
      },
      {
        "id": "q3",
        "question": "Que porte-t-on sur la tête au soleil?",
        "options": [
          "chapeau",
          "chaussures",
          "gant",
          "ceinture"
        ],
        "correctAnswer": "chapeau"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Passatempos",
    "slug": "a2-pt-passatempos-fc",
    "description": "Vocabulário sobre hobbies e passatempos.",
    "targetLanguage": "pt",
    "level": "A2",
    "type": "flashcard",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "ler",
        "front": "ler",
        "back": "to read"
      },
      {
        "id": "q2",
        "question": "nadar",
        "front": "nadar",
        "back": "to swim"
      },
      {
        "id": "q3",
        "question": "cozinhar",
        "front": "cozinhar",
        "back": "to cook"
      },
      {
        "id": "q4",
        "question": "cantar",
        "front": "cantar",
        "back": "to sing"
      },
      {
        "id": "q5",
        "question": "dançar",
        "front": "dançar",
        "back": "to dance"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Passado Simples",
    "slug": "a2-pt-passado-simples-mc",
    "description": "Pratique verbos regulares no passado.",
    "targetLanguage": "pt",
    "level": "A2",
    "type": "multiple-choice",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "Ontem eu ___ (trabalhar) até tarde.",
        "options": [
          "trabalhei",
          "trabalho",
          "trabalhava",
          "trabalhando"
        ],
        "correctAnswer": "trabalhei"
      },
      {
        "id": "q2",
        "question": "Ela ___ (falar) com o professor.",
        "options": [
          "falou",
          "fala",
          "falava",
          "falando"
        ],
        "correctAnswer": "falou"
      },
      {
        "id": "q3",
        "question": "Nós ___ (estudar) para a prova.",
        "options": [
          "estudamos",
          "estudávamos",
          "estudaremos",
          "estudando"
        ],
        "correctAnswer": "estudamos"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Direções",
    "slug": "a2-pt-direcoes-gap",
    "description": "Pratique vocabulário para dar e pedir direções.",
    "targetLanguage": "pt",
    "level": "A2",
    "type": "fill-gap",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "Complete a frase",
        "parts": [
          "Vire à ",
          " na próxima rua."
        ],
        "correctAnswers": [
          "direita"
        ]
      },
      {
        "id": "q2",
        "question": "Complete a frase",
        "parts": [
          "O banco fica ",
          " do mercado."
        ],
        "correctAnswers": [
          "perto"
        ]
      },
      {
        "id": "q3",
        "question": "Complete a frase",
        "parts": [
          "Siga ",
          " até o semáforo."
        ],
        "correctAnswers": [
          "reto"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Cômodos da Casa",
    "slug": "a2-pt-comodos-da-casa-fc",
    "description": "Vocabulário sobre os cômodos de uma casa.",
    "targetLanguage": "pt",
    "level": "A2",
    "type": "flashcard",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "cozinha",
        "front": "cozinha",
        "back": "kitchen"
      },
      {
        "id": "q2",
        "question": "quarto",
        "front": "quarto",
        "back": "bedroom"
      },
      {
        "id": "q3",
        "question": "banheiro",
        "front": "banheiro",
        "back": "bathroom"
      },
      {
        "id": "q4",
        "question": "sala",
        "front": "sala",
        "back": "living room"
      },
      {
        "id": "q5",
        "question": "jardim",
        "front": "jardim",
        "back": "garden"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Comparativos",
    "slug": "a2-pt-comparativos-mc",
    "description": "Pratique adjetivos comparativos.",
    "targetLanguage": "pt",
    "level": "A2",
    "type": "multiple-choice",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "Este carro é ___ (rápido) do que aquele.",
        "options": [
          "mais rápido",
          "rápido",
          "mais rápida",
          "rapidez"
        ],
        "correctAnswer": "mais rápido"
      },
      {
        "id": "q2",
        "question": "Ela é ___ (alto) da turma.",
        "options": [
          "a mais alta",
          "mais alta",
          "alta",
          "altura"
        ],
        "correctAnswer": "a mais alta"
      },
      {
        "id": "q3",
        "question": "Meu irmão é ___ (velho) do que eu.",
        "options": [
          "mais velho",
          "velho",
          "mais velha",
          "velhice"
        ],
        "correctAnswer": "mais velho"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Expressões de Tempo",
    "slug": "a2-pt-expressoes-de-tempo-gap",
    "description": "Pratique expressões relacionadas a tempo e horário.",
    "targetLanguage": "pt",
    "level": "A2",
    "type": "fill-gap",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "Complete a frase",
        "parts": [
          "Eu acordo ",
          " das sete horas."
        ],
        "correctAnswers": [
          "antes"
        ]
      },
      {
        "id": "q2",
        "question": "Complete a frase",
        "parts": [
          "Nos vemos na semana ",
          "."
        ],
        "correctAnswers": [
          "próxima"
        ]
      },
      {
        "id": "q3",
        "question": "Complete a frase",
        "parts": [
          "Ele sempre chega na ",
          "."
        ],
        "correctAnswers": [
          "hora"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Partes do Corpo",
    "slug": "a2-pt-partes-do-corpo-fc",
    "description": "Vocabulário sobre partes do corpo.",
    "targetLanguage": "pt",
    "level": "A2",
    "type": "flashcard",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "cabeça",
        "front": "cabeça",
        "back": "head"
      },
      {
        "id": "q2",
        "question": "mão",
        "front": "mão",
        "back": "hand"
      },
      {
        "id": "q3",
        "question": "perna",
        "front": "perna",
        "back": "leg"
      },
      {
        "id": "q4",
        "question": "olho",
        "front": "olho",
        "back": "eye"
      },
      {
        "id": "q5",
        "question": "coração",
        "front": "coração",
        "back": "heart"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Advérbios de Frequência",
    "slug": "a2-pt-adverbios-de-frequencia-mc",
    "description": "Pratique advérbios de frequência na rotina diária.",
    "targetLanguage": "pt",
    "level": "A2",
    "type": "multiple-choice",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "Eu ___ (always) como fora de casa.",
        "options": [
          "sempre",
          "nunca",
          "às vezes",
          "raramente"
        ],
        "correctAnswer": "sempre"
      },
      {
        "id": "q2",
        "question": "Ela ___ (never) chega atrasada.",
        "options": [
          "nunca",
          "sempre",
          "às vezes",
          "raramente"
        ],
        "correctAnswer": "nunca"
      },
      {
        "id": "q3",
        "question": "Nós ___ (sometimes) saímos à noite.",
        "options": [
          "às vezes",
          "sempre",
          "nunca",
          "raramente"
        ],
        "correctAnswer": "às vezes"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Hobbies",
    "slug": "a2-en-hobbies-fc",
    "description": "Vocabulary about hobbies and pastimes.",
    "targetLanguage": "en",
    "level": "A2",
    "type": "flashcard",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "to read",
        "front": "to read",
        "back": "ler"
      },
      {
        "id": "q2",
        "question": "to swim",
        "front": "to swim",
        "back": "nadar"
      },
      {
        "id": "q3",
        "question": "to cook",
        "front": "to cook",
        "back": "cozinhar"
      },
      {
        "id": "q4",
        "question": "to sing",
        "front": "to sing",
        "back": "cantar"
      },
      {
        "id": "q5",
        "question": "to dance",
        "front": "to dance",
        "back": "dançar"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Simple Past",
    "slug": "a2-en-simple-past-mc",
    "description": "Practice regular verbs in the simple past.",
    "targetLanguage": "en",
    "level": "A2",
    "type": "multiple-choice",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "Yesterday I ___ (work) late.",
        "options": [
          "worked",
          "work",
          "working",
          "works"
        ],
        "correctAnswer": "worked"
      },
      {
        "id": "q2",
        "question": "She ___ (talk) to the teacher.",
        "options": [
          "talked",
          "talks",
          "talking",
          "talk"
        ],
        "correctAnswer": "talked"
      },
      {
        "id": "q3",
        "question": "We ___ (study) for the test.",
        "options": [
          "studied",
          "study",
          "studying",
          "studies"
        ],
        "correctAnswer": "studied"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Directions",
    "slug": "a2-en-directions-gap",
    "description": "Practice vocabulary for giving and asking directions.",
    "targetLanguage": "en",
    "level": "A2",
    "type": "fill-gap",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "Complete the sentence",
        "parts": [
          "Turn ",
          " at the next street."
        ],
        "correctAnswers": [
          "right"
        ]
      },
      {
        "id": "q2",
        "question": "Complete the sentence",
        "parts": [
          "The bank is ",
          " the market."
        ],
        "correctAnswers": [
          "near"
        ]
      },
      {
        "id": "q3",
        "question": "Complete the sentence",
        "parts": [
          "Go ",
          " until the traffic light."
        ],
        "correctAnswers": [
          "straight"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Rooms in the House",
    "slug": "a2-en-rooms-in-the-house-fc",
    "description": "Vocabulary for rooms in a house.",
    "targetLanguage": "en",
    "level": "A2",
    "type": "flashcard",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "kitchen",
        "front": "kitchen",
        "back": "cozinha"
      },
      {
        "id": "q2",
        "question": "bedroom",
        "front": "bedroom",
        "back": "quarto"
      },
      {
        "id": "q3",
        "question": "bathroom",
        "front": "bathroom",
        "back": "banheiro"
      },
      {
        "id": "q4",
        "question": "living room",
        "front": "living room",
        "back": "sala"
      },
      {
        "id": "q5",
        "question": "garden",
        "front": "garden",
        "back": "jardim"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Comparatives",
    "slug": "a2-en-comparatives-mc",
    "description": "Practice comparative adjectives.",
    "targetLanguage": "en",
    "level": "A2",
    "type": "multiple-choice",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "This car is ___ (fast) than that one.",
        "options": [
          "faster",
          "fast",
          "fastest",
          "fastly"
        ],
        "correctAnswer": "faster"
      },
      {
        "id": "q2",
        "question": "She is ___ (tall) in the class.",
        "options": [
          "the tallest",
          "taller",
          "tall",
          "tallness"
        ],
        "correctAnswer": "the tallest"
      },
      {
        "id": "q3",
        "question": "My brother is ___ (old) than me.",
        "options": [
          "older",
          "old",
          "oldest",
          "age"
        ],
        "correctAnswer": "older"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Time Expressions",
    "slug": "a2-en-time-expressions-gap",
    "description": "Practice expressions related to time.",
    "targetLanguage": "en",
    "level": "A2",
    "type": "fill-gap",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "Complete the sentence",
        "parts": [
          "I wake up ",
          " seven o’clock."
        ],
        "correctAnswers": [
          "before"
        ]
      },
      {
        "id": "q2",
        "question": "Complete the sentence",
        "parts": [
          "See you next ",
          "."
        ],
        "correctAnswers": [
          "week"
        ]
      },
      {
        "id": "q3",
        "question": "Complete the sentence",
        "parts": [
          "He always arrives on ",
          "."
        ],
        "correctAnswers": [
          "time"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Body Parts",
    "slug": "a2-en-body-parts-fc",
    "description": "Vocabulary for parts of the body.",
    "targetLanguage": "en",
    "level": "A2",
    "type": "flashcard",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "head",
        "front": "head",
        "back": "cabeça"
      },
      {
        "id": "q2",
        "question": "hand",
        "front": "hand",
        "back": "mão"
      },
      {
        "id": "q3",
        "question": "leg",
        "front": "leg",
        "back": "perna"
      },
      {
        "id": "q4",
        "question": "eye",
        "front": "eye",
        "back": "olho"
      },
      {
        "id": "q5",
        "question": "heart",
        "front": "heart",
        "back": "coração"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Adverbs of Frequency",
    "slug": "a2-en-adverbs-of-frequency-mc",
    "description": "Practice adverbs of frequency in daily routine.",
    "targetLanguage": "en",
    "level": "A2",
    "type": "multiple-choice",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "I ___ (always) eat out.",
        "options": [
          "always",
          "never",
          "sometimes",
          "rarely"
        ],
        "correctAnswer": "always"
      },
      {
        "id": "q2",
        "question": "She ___ (never) arrives late.",
        "options": [
          "never",
          "always",
          "sometimes",
          "rarely"
        ],
        "correctAnswer": "never"
      },
      {
        "id": "q3",
        "question": "We ___ (sometimes) go out at night.",
        "options": [
          "sometimes",
          "always",
          "never",
          "rarely"
        ],
        "correctAnswer": "sometimes"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Loisirs",
    "slug": "a2-fr-loisirs-fc",
    "description": "Vocabulaire sur les loisirs.",
    "targetLanguage": "fr",
    "level": "A2",
    "type": "flashcard",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "lire",
        "front": "lire",
        "back": "to read"
      },
      {
        "id": "q2",
        "question": "nager",
        "front": "nager",
        "back": "to swim"
      },
      {
        "id": "q3",
        "question": "cuisiner",
        "front": "cuisiner",
        "back": "to cook"
      },
      {
        "id": "q4",
        "question": "chanter",
        "front": "chanter",
        "back": "to sing"
      },
      {
        "id": "q5",
        "question": "danser",
        "front": "danser",
        "back": "to dance"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Passé Composé",
    "slug": "a2-fr-passe-compose-mc",
    "description": "Pratiquez les verbes réguliers au passé composé.",
    "targetLanguage": "fr",
    "level": "A2",
    "type": "multiple-choice",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "Hier j'___ (travailler) tard.",
        "options": [
          "ai travaillé",
          "travaille",
          "travaillais",
          "travaillant"
        ],
        "correctAnswer": "ai travaillé"
      },
      {
        "id": "q2",
        "question": "Elle a ___ (parler) au professeur.",
        "options": [
          "parlé",
          "parle",
          "parlait",
          "parlant"
        ],
        "correctAnswer": "parlé"
      },
      {
        "id": "q3",
        "question": "Nous avons ___ (étudier) pour l'examen.",
        "options": [
          "étudié",
          "étudions",
          "étudiions",
          "étudiant"
        ],
        "correctAnswer": "étudié"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Directions",
    "slug": "a2-fr-directions-gap",
    "description": "Pratiquez le vocabulaire pour donner des directions.",
    "targetLanguage": "fr",
    "level": "A2",
    "type": "fill-gap",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "Complétez la phrase",
        "parts": [
          "Tournez à ",
          " à la prochaine rue."
        ],
        "correctAnswers": [
          "droite"
        ]
      },
      {
        "id": "q2",
        "question": "Complétez la phrase",
        "parts": [
          "La banque est ",
          " du marché."
        ],
        "correctAnswers": [
          "près"
        ]
      },
      {
        "id": "q3",
        "question": "Complétez la phrase",
        "parts": [
          "Continuez tout ",
          " jusqu'au feu."
        ],
        "correctAnswers": [
          "droit"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Les Pièces de la Maison",
    "slug": "a2-fr-les-pieces-de-la-maison-fc",
    "description": "Vocabulaire des pièces de la maison.",
    "targetLanguage": "fr",
    "level": "A2",
    "type": "flashcard",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "cuisine",
        "front": "cuisine",
        "back": "kitchen"
      },
      {
        "id": "q2",
        "question": "chambre",
        "front": "chambre",
        "back": "bedroom"
      },
      {
        "id": "q3",
        "question": "salle de bain",
        "front": "salle de bain",
        "back": "bathroom"
      },
      {
        "id": "q4",
        "question": "salon",
        "front": "salon",
        "back": "living room"
      },
      {
        "id": "q5",
        "question": "jardin",
        "front": "jardin",
        "back": "garden"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Les Comparatifs",
    "slug": "a2-fr-les-comparatifs-mc",
    "description": "Pratiquez les adjectifs comparatifs.",
    "targetLanguage": "fr",
    "level": "A2",
    "type": "multiple-choice",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "Cette voiture est ___ (rapide) que celle-là.",
        "options": [
          "plus rapide",
          "rapide",
          "plus rapides",
          "rapidité"
        ],
        "correctAnswer": "plus rapide"
      },
      {
        "id": "q2",
        "question": "Elle est ___ (grand) de la classe.",
        "options": [
          "la plus grande",
          "plus grande",
          "grande",
          "grandeur"
        ],
        "correctAnswer": "la plus grande"
      },
      {
        "id": "q3",
        "question": "Mon frère est ___ (vieux) que moi.",
        "options": [
          "plus âgé",
          "âgé",
          "plus âgée",
          "âge"
        ],
        "correctAnswer": "plus âgé"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Expressions de Temps",
    "slug": "a2-fr-expressions-de-temps-gap",
    "description": "Pratiquez les expressions liées au temps.",
    "targetLanguage": "fr",
    "level": "A2",
    "type": "fill-gap",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "Complétez la phrase",
        "parts": [
          "Je me réveille ",
          " sept heures."
        ],
        "correctAnswers": [
          "avant"
        ]
      },
      {
        "id": "q2",
        "question": "Complétez la phrase",
        "parts": [
          "On se voit la semaine ",
          "."
        ],
        "correctAnswers": [
          "prochaine"
        ]
      },
      {
        "id": "q3",
        "question": "Complétez la phrase",
        "parts": [
          "Il arrive toujours à l'",
          "."
        ],
        "correctAnswers": [
          "heure"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Parties du Corps",
    "slug": "a2-fr-parties-du-corps-fc",
    "description": "Vocabulaire des parties du corps.",
    "targetLanguage": "fr",
    "level": "A2",
    "type": "flashcard",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "tête",
        "front": "tête",
        "back": "head"
      },
      {
        "id": "q2",
        "question": "main",
        "front": "main",
        "back": "hand"
      },
      {
        "id": "q3",
        "question": "jambe",
        "front": "jambe",
        "back": "leg"
      },
      {
        "id": "q4",
        "question": "œil",
        "front": "œil",
        "back": "eye"
      },
      {
        "id": "q5",
        "question": "cœur",
        "front": "cœur",
        "back": "heart"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Adverbes de Fréquence",
    "slug": "a2-fr-adverbes-de-frequence-mc",
    "description": "Pratiquez les adverbes de fréquence.",
    "targetLanguage": "fr",
    "level": "A2",
    "type": "multiple-choice",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "Je ___ (always) mange dehors.",
        "options": [
          "toujours",
          "jamais",
          "parfois",
          "rarement"
        ],
        "correctAnswer": "toujours"
      },
      {
        "id": "q2",
        "question": "Elle n'arrive ___ (never) en retard.",
        "options": [
          "jamais",
          "toujours",
          "parfois",
          "rarement"
        ],
        "correctAnswer": "jamais"
      },
      {
        "id": "q3",
        "question": "Nous sortons ___ (sometimes) le soir.",
        "options": [
          "parfois",
          "toujours",
          "jamais",
          "rarement"
        ],
        "correctAnswer": "parfois"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Vocabulário de Trabalho",
    "slug": "b1-pt-vocabulario-de-trabalho-fc",
    "description": "Vocabulário útil no ambiente de trabalho.",
    "targetLanguage": "pt",
    "level": "B1",
    "type": "flashcard",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "currículo",
        "front": "currículo",
        "back": "resume"
      },
      {
        "id": "q2",
        "question": "entrevista",
        "front": "entrevista",
        "back": "interview"
      },
      {
        "id": "q3",
        "question": "salário",
        "front": "salário",
        "back": "salary"
      },
      {
        "id": "q4",
        "question": "chefe",
        "front": "chefe",
        "back": "boss"
      },
      {
        "id": "q5",
        "question": "prazo",
        "front": "prazo",
        "back": "deadline"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Verbos Modais: Dever",
    "slug": "b1-pt-verbos-modais-dever-mc",
    "description": "Pratique os verbos modais dever/ir no futuro.",
    "targetLanguage": "pt",
    "level": "B1",
    "type": "multiple-choice",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "Você ___ estudar mais para passar.",
        "options": [
          "deve",
          "deveu",
          "devia",
          "devendo"
        ],
        "correctAnswer": "deve"
      },
      {
        "id": "q2",
        "question": "Nós ___ (will) viajar amanhã.",
        "options": [
          "vamos",
          "fomos",
          "íamos",
          "indo"
        ],
        "correctAnswer": "vamos"
      },
      {
        "id": "q3",
        "question": "Ele ___ (should) pedir desculpas.",
        "options": [
          "deveria",
          "deve ter",
          "devia",
          "devendo"
        ],
        "correctAnswer": "deveria"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Saúde e Sintomas",
    "slug": "b1-pt-saude-e-sintomas-gap",
    "description": "Vocabulário sobre saúde e sintomas.",
    "targetLanguage": "pt",
    "level": "B1",
    "type": "fill-gap",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "Complete a frase",
        "parts": [
          "Estou com ",
          " de cabeça."
        ],
        "correctAnswers": [
          "dor"
        ]
      },
      {
        "id": "q2",
        "question": "Complete a frase",
        "parts": [
          "Preciso tomar um ",
          " para a febre."
        ],
        "correctAnswers": [
          "remédio"
        ]
      },
      {
        "id": "q3",
        "question": "Complete a frase",
        "parts": [
          "Marquei uma consulta com o ",
          "."
        ],
        "correctAnswers": [
          "médico"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Tecnologia",
    "slug": "b1-pt-tecnologia-fc",
    "description": "Vocabulário sobre tecnologia e dispositivos.",
    "targetLanguage": "pt",
    "level": "B1",
    "type": "flashcard",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "tela",
        "front": "tela",
        "back": "screen"
      },
      {
        "id": "q2",
        "question": "senha",
        "front": "senha",
        "back": "password"
      },
      {
        "id": "q3",
        "question": "aplicativo",
        "front": "aplicativo",
        "back": "app"
      },
      {
        "id": "q4",
        "question": "teclado",
        "front": "teclado",
        "back": "keyboard"
      },
      {
        "id": "q5",
        "question": "nuvem",
        "front": "nuvem",
        "back": "cloud"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Ligações Telefônicas",
    "slug": "b1-pt-ligacoes-telefonicas-mc",
    "description": "Frases úteis para ligações telefônicas.",
    "targetLanguage": "pt",
    "level": "B1",
    "type": "multiple-choice",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "Como se diz para pedir para esperar na linha?",
        "options": [
          "Um momento, por favor",
          "Tchau",
          "Obrigado",
          "Desculpa"
        ],
        "correctAnswer": "Um momento, por favor"
      },
      {
        "id": "q2",
        "question": "Qual frase usamos para dizer que a pessoa não está?",
        "options": [
          "Ele não está no momento",
          "Muito obrigado",
          "Bom dia",
          "Com licença"
        ],
        "correctAnswer": "Ele não está no momento"
      },
      {
        "id": "q3",
        "question": "Como perguntar quem está falando?",
        "options": [
          "Quem fala?",
          "Onde você está?",
          "Que horas são?",
          "Como vai?"
        ],
        "correctAnswer": "Quem fala?"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Meio Ambiente",
    "slug": "b1-pt-meio-ambiente-gap",
    "description": "Vocabulário sobre meio ambiente e sustentabilidade.",
    "targetLanguage": "pt",
    "level": "B1",
    "type": "fill-gap",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "Complete a frase",
        "parts": [
          "Devemos reciclar o ",
          " para proteger o planeta."
        ],
        "correctAnswers": [
          "lixo"
        ]
      },
      {
        "id": "q2",
        "question": "Complete a frase",
        "parts": [
          "A ",
          " está aumentando por causa da poluição."
        ],
        "correctAnswers": [
          "temperatura"
        ]
      },
      {
        "id": "q3",
        "question": "Complete a frase",
        "parts": [
          "Precisamos economizar ",
          "."
        ],
        "correctAnswers": [
          "água"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Emoções",
    "slug": "b1-pt-emocoes-fc",
    "description": "Vocabulário sobre emoções e sentimentos.",
    "targetLanguage": "pt",
    "level": "B1",
    "type": "flashcard",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "feliz",
        "front": "feliz",
        "back": "happy"
      },
      {
        "id": "q2",
        "question": "triste",
        "front": "triste",
        "back": "sad"
      },
      {
        "id": "q3",
        "question": "ansioso",
        "front": "ansioso",
        "back": "anxious"
      },
      {
        "id": "q4",
        "question": "animado",
        "front": "animado",
        "back": "excited"
      },
      {
        "id": "q5",
        "question": "com raiva",
        "front": "com raiva",
        "back": "angry"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Verbos Modais: Poder",
    "slug": "b1-pt-verbos-modais-poder-mc",
    "description": "Pratique os verbos modais poder/conseguir.",
    "targetLanguage": "pt",
    "level": "B1",
    "type": "multiple-choice",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "___ eu usar seu telefone?",
        "options": [
          "Posso",
          "Devo",
          "Vou",
          "Vim"
        ],
        "correctAnswer": "Posso"
      },
      {
        "id": "q2",
        "question": "Quando criança, eu ___ nadar muito bem.",
        "options": [
          "conseguia",
          "posso",
          "devo",
          "vou"
        ],
        "correctAnswer": "conseguia"
      },
      {
        "id": "q3",
        "question": "___ eu fazer uma pergunta?",
        "options": [
          "Poderia",
          "Devo",
          "Vou",
          "Sou"
        ],
        "correctAnswer": "Poderia"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Work Vocabulary",
    "slug": "b1-en-work-vocabulary-fc",
    "description": "Useful vocabulary for the workplace.",
    "targetLanguage": "en",
    "level": "B1",
    "type": "flashcard",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "resume",
        "front": "resume",
        "back": "currículo"
      },
      {
        "id": "q2",
        "question": "interview",
        "front": "interview",
        "back": "entrevista"
      },
      {
        "id": "q3",
        "question": "salary",
        "front": "salary",
        "back": "salário"
      },
      {
        "id": "q4",
        "question": "boss",
        "front": "boss",
        "back": "chefe"
      },
      {
        "id": "q5",
        "question": "deadline",
        "front": "deadline",
        "back": "prazo"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Modal Verbs: Should",
    "slug": "b1-en-modal-verbs-should-mc",
    "description": "Practice modal verbs should/will.",
    "targetLanguage": "en",
    "level": "B1",
    "type": "multiple-choice",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "You ___ (should) study more to pass.",
        "options": [
          "should",
          "must",
          "will",
          "shall"
        ],
        "correctAnswer": "should"
      },
      {
        "id": "q2",
        "question": "We ___ (will) travel tomorrow.",
        "options": [
          "will",
          "would",
          "are",
          "were"
        ],
        "correctAnswer": "will"
      },
      {
        "id": "q3",
        "question": "He ___ (should) apologize.",
        "options": [
          "should",
          "must",
          "shall",
          "would"
        ],
        "correctAnswer": "should"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Health and Symptoms",
    "slug": "b1-en-health-and-symptoms-gap",
    "description": "Vocabulary about health and symptoms.",
    "targetLanguage": "en",
    "level": "B1",
    "type": "fill-gap",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "Complete the sentence",
        "parts": [
          "I have a ",
          "."
        ],
        "correctAnswers": [
          "headache"
        ]
      },
      {
        "id": "q2",
        "question": "Complete the sentence",
        "parts": [
          "I need to take ",
          " for the fever."
        ],
        "correctAnswers": [
          "medicine"
        ]
      },
      {
        "id": "q3",
        "question": "Complete the sentence",
        "parts": [
          "I booked an appointment with the ",
          "."
        ],
        "correctAnswers": [
          "doctor"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Technology",
    "slug": "b1-en-technology-fc",
    "description": "Vocabulary about technology and devices.",
    "targetLanguage": "en",
    "level": "B1",
    "type": "flashcard",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "screen",
        "front": "screen",
        "back": "tela"
      },
      {
        "id": "q2",
        "question": "password",
        "front": "password",
        "back": "senha"
      },
      {
        "id": "q3",
        "question": "app",
        "front": "app",
        "back": "aplicativo"
      },
      {
        "id": "q4",
        "question": "keyboard",
        "front": "keyboard",
        "back": "teclado"
      },
      {
        "id": "q5",
        "question": "cloud",
        "front": "cloud",
        "back": "nuvem"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Phone Calls",
    "slug": "b1-en-phone-calls-mc",
    "description": "Useful phrases for phone calls.",
    "targetLanguage": "en",
    "level": "B1",
    "type": "multiple-choice",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "How do you ask someone to hold the line?",
        "options": [
          "One moment please",
          "Goodbye",
          "Thank you",
          "Sorry"
        ],
        "correctAnswer": "One moment please"
      },
      {
        "id": "q2",
        "question": "Which phrase says the person is not available?",
        "options": [
          "He’s not available right now",
          "Nice to meet you",
          "Good morning",
          "Excuse me"
        ],
        "correctAnswer": "He’s not available right now"
      },
      {
        "id": "q3",
        "question": "How do you ask who is calling?",
        "options": [
          "Who’s calling?",
          "Where are you?",
          "What time is it?",
          "How are you?"
        ],
        "correctAnswer": "Who’s calling?"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Environment",
    "slug": "b1-en-environment-gap",
    "description": "Vocabulary about the environment and sustainability.",
    "targetLanguage": "en",
    "level": "B1",
    "type": "fill-gap",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "Complete the sentence",
        "parts": [
          "We should recycle ",
          " to protect the planet."
        ],
        "correctAnswers": [
          "trash"
        ]
      },
      {
        "id": "q2",
        "question": "Complete the sentence",
        "parts": [
          "The ",
          " is rising because of pollution."
        ],
        "correctAnswers": [
          "temperature"
        ]
      },
      {
        "id": "q3",
        "question": "Complete the sentence",
        "parts": [
          "We need to save ",
          "."
        ],
        "correctAnswers": [
          "water"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Emotions",
    "slug": "b1-en-emotions-fc",
    "description": "Vocabulary about emotions and feelings.",
    "targetLanguage": "en",
    "level": "B1",
    "type": "flashcard",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "happy",
        "front": "happy",
        "back": "feliz"
      },
      {
        "id": "q2",
        "question": "sad",
        "front": "sad",
        "back": "triste"
      },
      {
        "id": "q3",
        "question": "anxious",
        "front": "anxious",
        "back": "ansioso"
      },
      {
        "id": "q4",
        "question": "excited",
        "front": "excited",
        "back": "animado"
      },
      {
        "id": "q5",
        "question": "angry",
        "front": "angry",
        "back": "com raiva"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Modal Verbs: Can/Could",
    "slug": "b1-en-modal-verbs-can-could-mc",
    "description": "Practice modal verbs can/could.",
    "targetLanguage": "en",
    "level": "B1",
    "type": "multiple-choice",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "___ I use your phone?",
        "options": [
          "Can",
          "Must",
          "Will",
          "Am"
        ],
        "correctAnswer": "Can"
      },
      {
        "id": "q2",
        "question": "As a child, I ___ swim very well.",
        "options": [
          "could",
          "can",
          "must",
          "will"
        ],
        "correctAnswer": "could"
      },
      {
        "id": "q3",
        "question": "___ I ask a question?",
        "options": [
          "Could",
          "Must",
          "Will",
          "Am"
        ],
        "correctAnswer": "Could"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Vocabulaire du Travail",
    "slug": "b1-fr-vocabulaire-du-travail-fc",
    "description": "Vocabulaire utile pour le monde du travail.",
    "targetLanguage": "fr",
    "level": "B1",
    "type": "flashcard",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "CV",
        "front": "CV",
        "back": "resume"
      },
      {
        "id": "q2",
        "question": "entretien",
        "front": "entretien",
        "back": "interview"
      },
      {
        "id": "q3",
        "question": "salaire",
        "front": "salaire",
        "back": "salary"
      },
      {
        "id": "q4",
        "question": "patron",
        "front": "patron",
        "back": "boss"
      },
      {
        "id": "q5",
        "question": "délai",
        "front": "délai",
        "back": "deadline"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Verbes Modaux: Devoir",
    "slug": "b1-fr-verbes-modaux-devoir-mc",
    "description": "Pratiquez les verbes modaux devoir/aller.",
    "targetLanguage": "fr",
    "level": "B1",
    "type": "multiple-choice",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "Tu ___ (should) étudier plus pour réussir.",
        "options": [
          "devrais",
          "dois",
          "devais",
          "devant"
        ],
        "correctAnswer": "devrais"
      },
      {
        "id": "q2",
        "question": "Nous ___ (will) voyager demain.",
        "options": [
          "allons",
          "irons",
          "allions",
          "irait"
        ],
        "correctAnswer": "irons"
      },
      {
        "id": "q3",
        "question": "Il ___ (should) s'excuser.",
        "options": [
          "devrait",
          "doit",
          "devait",
          "devant"
        ],
        "correctAnswer": "devrait"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Santé et Symptômes",
    "slug": "b1-fr-sante-et-symptomes-gap",
    "description": "Vocabulaire sur la santé et les symptômes.",
    "targetLanguage": "fr",
    "level": "B1",
    "type": "fill-gap",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "Complétez la phrase",
        "parts": [
          "J'ai mal à la ",
          "."
        ],
        "correctAnswers": [
          "tête"
        ]
      },
      {
        "id": "q2",
        "question": "Complétez la phrase",
        "parts": [
          "Je dois prendre un ",
          " pour la fièvre."
        ],
        "correctAnswers": [
          "médicament"
        ]
      },
      {
        "id": "q3",
        "question": "Complétez la phrase",
        "parts": [
          "J’ai pris rendez-vous chez le ",
          "."
        ],
        "correctAnswers": [
          "médecin"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Technologie",
    "slug": "b1-fr-technologie-fc",
    "description": "Vocabulaire sur la technologie et les appareils.",
    "targetLanguage": "fr",
    "level": "B1",
    "type": "flashcard",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "écran",
        "front": "écran",
        "back": "screen"
      },
      {
        "id": "q2",
        "question": "mot de passe",
        "front": "mot de passe",
        "back": "password"
      },
      {
        "id": "q3",
        "question": "application",
        "front": "application",
        "back": "app"
      },
      {
        "id": "q4",
        "question": "clavier",
        "front": "clavier",
        "back": "keyboard"
      },
      {
        "id": "q5",
        "question": "nuage",
        "front": "nuage",
        "back": "cloud"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Appels Téléphoniques",
    "slug": "b1-fr-appels-telephoniques-mc",
    "description": "Expressions utiles pour les appels téléphoniques.",
    "targetLanguage": "fr",
    "level": "B1",
    "type": "multiple-choice",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "Comment demande-t-on de patienter?",
        "options": [
          "Un instant s’il vous plaît",
          "Au revoir",
          "Merci",
          "Pardon"
        ],
        "correctAnswer": "Un instant s’il vous plaît"
      },
      {
        "id": "q2",
        "question": "Quelle phrase dit que la personne est absente?",
        "options": [
          "Il n’est pas disponible pour le moment",
          "Enchanté",
          "Bonjour",
          "Excusez-moi"
        ],
        "correctAnswer": "Il n’est pas disponible pour le moment"
      },
      {
        "id": "q3",
        "question": "Comment demande-t-on qui appelle?",
        "options": [
          "Qui est à l’appareil?",
          "Où êtes-vous?",
          "Quelle heure est-il?",
          "Comment allez-vous?"
        ],
        "correctAnswer": "Qui est à l’appareil?"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Environnement",
    "slug": "b1-fr-environnement-gap",
    "description": "Vocabulaire sur l'environnement et la durabilité.",
    "targetLanguage": "fr",
    "level": "B1",
    "type": "fill-gap",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "Complétez la phrase",
        "parts": [
          "Nous devons recycler les ",
          " pour protéger la planète."
        ],
        "correctAnswers": [
          "déchets"
        ]
      },
      {
        "id": "q2",
        "question": "Complétez la phrase",
        "parts": [
          "La ",
          " augmente à cause de la pollution."
        ],
        "correctAnswers": [
          "température"
        ]
      },
      {
        "id": "q3",
        "question": "Complétez la phrase",
        "parts": [
          "Nous devons économiser l'",
          "."
        ],
        "correctAnswers": [
          "eau"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Émotions",
    "slug": "b1-fr-emotions-fc",
    "description": "Vocabulaire sur les émotions et sentiments.",
    "targetLanguage": "fr",
    "level": "B1",
    "type": "flashcard",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "heureux",
        "front": "heureux",
        "back": "happy"
      },
      {
        "id": "q2",
        "question": "triste",
        "front": "triste",
        "back": "sad"
      },
      {
        "id": "q3",
        "question": "anxieux",
        "front": "anxieux",
        "back": "anxious"
      },
      {
        "id": "q4",
        "question": "excité",
        "front": "excité",
        "back": "excited"
      },
      {
        "id": "q5",
        "question": "en colère",
        "front": "en colère",
        "back": "angry"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Verbes Modaux: Pouvoir",
    "slug": "b1-fr-verbes-modaux-pouvoir-mc",
    "description": "Pratiquez les verbes modaux pouvoir.",
    "targetLanguage": "fr",
    "level": "B1",
    "type": "multiple-choice",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "___-je utiliser votre téléphone?",
        "options": [
          "Puis",
          "Dois",
          "Vais",
          "Suis"
        ],
        "correctAnswer": "Puis"
      },
      {
        "id": "q2",
        "question": "Enfant, je ___ très bien nager.",
        "options": [
          "pouvais",
          "peux",
          "dois",
          "vais"
        ],
        "correctAnswer": "pouvais"
      },
      {
        "id": "q3",
        "question": "___-je poser une question?",
        "options": [
          "Pourrais",
          "Dois",
          "Vais",
          "Suis"
        ],
        "correctAnswer": "Pourrais"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Vocabulário de Negócios",
    "slug": "b2-pt-vocabulario-de-negocios-fc",
    "description": "Vocabulário do mundo dos negócios.",
    "targetLanguage": "pt",
    "level": "B2",
    "type": "flashcard",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "acordo",
        "front": "acordo",
        "back": "agreement"
      },
      {
        "id": "q2",
        "question": "investimento",
        "front": "investimento",
        "back": "investment"
      },
      {
        "id": "q3",
        "question": "concorrência",
        "front": "concorrência",
        "back": "competition"
      },
      {
        "id": "q4",
        "question": "lucro",
        "front": "lucro",
        "back": "profit"
      },
      {
        "id": "q5",
        "question": "orçamento",
        "front": "orçamento",
        "back": "budget"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Voz Passiva",
    "slug": "b2-pt-voz-passiva-mc",
    "description": "Pratique a formação da voz passiva.",
    "targetLanguage": "pt",
    "level": "B2",
    "type": "multiple-choice",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "O livro ___ (escrever) por ela.",
        "options": [
          "foi escrito",
          "escreveu",
          "escreve",
          "escrevendo"
        ],
        "correctAnswer": "foi escrito"
      },
      {
        "id": "q2",
        "question": "A casa ___ (construir) em 1990.",
        "options": [
          "foi construída",
          "construiu",
          "constrói",
          "construindo"
        ],
        "correctAnswer": "foi construída"
      },
      {
        "id": "q3",
        "question": "Os documentos ___ (enviar) ontem.",
        "options": [
          "foram enviados",
          "enviaram",
          "enviam",
          "enviando"
        ],
        "correctAnswer": "foram enviados"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Discurso Indireto",
    "slug": "b2-pt-discurso-indireto-gap",
    "description": "Pratique o discurso indireto.",
    "targetLanguage": "pt",
    "level": "B2",
    "type": "fill-gap",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "Complete a frase",
        "parts": [
          "Ela disse que ",
          " cansada."
        ],
        "correctAnswers": [
          "estava"
        ]
      },
      {
        "id": "q2",
        "question": "Complete a frase",
        "parts": [
          "Ele falou que ",
          " viajar."
        ],
        "correctAnswers": [
          "ia"
        ]
      },
      {
        "id": "q3",
        "question": "Complete a frase",
        "parts": [
          "Eles disseram que já ",
          " o trabalho."
        ],
        "correctAnswers": [
          "tinham terminado"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Entrevista de Emprego",
    "slug": "b2-pt-entrevista-de-emprego-fc",
    "description": "Vocabulário para entrevistas de emprego.",
    "targetLanguage": "pt",
    "level": "B2",
    "type": "flashcard",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "pontos fortes",
        "front": "pontos fortes",
        "back": "strengths"
      },
      {
        "id": "q2",
        "question": "ponto fraco",
        "front": "ponto fraco",
        "back": "weakness"
      },
      {
        "id": "q3",
        "question": "experiência",
        "front": "experiência",
        "back": "experience"
      },
      {
        "id": "q4",
        "question": "habilidades",
        "front": "habilidades",
        "back": "skills"
      },
      {
        "id": "q5",
        "question": "referências",
        "front": "referências",
        "back": "references"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Orações Relativas",
    "slug": "b2-pt-oracoes-relativas-mc",
    "description": "Pratique pronomes relativos.",
    "targetLanguage": "pt",
    "level": "B2",
    "type": "multiple-choice",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "Esse é o homem ___ me ajudou.",
        "options": [
          "que",
          "quem",
          "cujo",
          "onde"
        ],
        "correctAnswer": "que"
      },
      {
        "id": "q2",
        "question": "A cidade ___ eu nasci é linda.",
        "options": [
          "onde",
          "que",
          "quem",
          "cujo"
        ],
        "correctAnswer": "onde"
      },
      {
        "id": "q3",
        "question": "Essa é a mulher ___ filho estuda comigo.",
        "options": [
          "cujo",
          "que",
          "quem",
          "onde"
        ],
        "correctAnswer": "cujo"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Opinião e Debate",
    "slug": "b2-pt-opiniao-e-debate-gap",
    "description": "Pratique expressões para dar opinião.",
    "targetLanguage": "pt",
    "level": "B2",
    "type": "fill-gap",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "Complete a frase",
        "parts": [
          "Na minha ",
          ", isso é injusto."
        ],
        "correctAnswers": [
          "opinião"
        ]
      },
      {
        "id": "q2",
        "question": "Complete a frase",
        "parts": [
          "Eu discordo ",
          " dessa ideia."
        ],
        "correctAnswers": [
          "totalmente"
        ]
      },
      {
        "id": "q3",
        "question": "Complete a frase",
        "parts": [
          "É importante considerar os dois ",
          " do argumento."
        ],
        "correctAnswers": [
          "lados"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Mídia e Notícias",
    "slug": "b2-pt-midia-e-noticias-fc",
    "description": "Vocabulário sobre mídia e notícias.",
    "targetLanguage": "pt",
    "level": "B2",
    "type": "flashcard",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "manchete",
        "front": "manchete",
        "back": "headline"
      },
      {
        "id": "q2",
        "question": "reportagem",
        "front": "reportagem",
        "back": "news report"
      },
      {
        "id": "q3",
        "question": "jornalista",
        "front": "jornalista",
        "back": "journalist"
      },
      {
        "id": "q4",
        "question": "fonte",
        "front": "fonte",
        "back": "source"
      },
      {
        "id": "q5",
        "question": "transmissão",
        "front": "transmissão",
        "back": "broadcast"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Escrita Formal",
    "slug": "b2-pt-escrita-formal-mc",
    "description": "Pratique expressões formais de escrita.",
    "targetLanguage": "pt",
    "level": "B2",
    "type": "multiple-choice",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "Qual expressão é mais formal para começar uma carta?",
        "options": [
          "Prezado(a) senhor(a)",
          "Oi",
          "E aí",
          "Fala"
        ],
        "correctAnswer": "Prezado(a) senhor(a)"
      },
      {
        "id": "q2",
        "question": "Como encerrar um e-mail formal?",
        "options": [
          "Atenciosamente",
          "Beijos",
          "Falou",
          "Até mais"
        ],
        "correctAnswer": "Atenciosamente"
      },
      {
        "id": "q3",
        "question": "Qual dessas é uma forma formal de pedir algo?",
        "options": [
          "Solicito que",
          "Me dá",
          "Passa aí",
          "Manda"
        ],
        "correctAnswer": "Solicito que"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Business Vocabulary",
    "slug": "b2-en-business-vocabulary-fc",
    "description": "Vocabulary from the business world.",
    "targetLanguage": "en",
    "level": "B2",
    "type": "flashcard",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "agreement",
        "front": "agreement",
        "back": "acordo"
      },
      {
        "id": "q2",
        "question": "investment",
        "front": "investment",
        "back": "investimento"
      },
      {
        "id": "q3",
        "question": "competition",
        "front": "competition",
        "back": "concorrência"
      },
      {
        "id": "q4",
        "question": "profit",
        "front": "profit",
        "back": "lucro"
      },
      {
        "id": "q5",
        "question": "budget",
        "front": "budget",
        "back": "orçamento"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Passive Voice",
    "slug": "b2-en-passive-voice-mc",
    "description": "Practice forming the passive voice.",
    "targetLanguage": "en",
    "level": "B2",
    "type": "multiple-choice",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "The book ___ (write) by her.",
        "options": [
          "was written",
          "wrote",
          "writes",
          "writing"
        ],
        "correctAnswer": "was written"
      },
      {
        "id": "q2",
        "question": "The house ___ (build) in 1990.",
        "options": [
          "was built",
          "built",
          "builds",
          "building"
        ],
        "correctAnswer": "was built"
      },
      {
        "id": "q3",
        "question": "The documents ___ (send) yesterday.",
        "options": [
          "were sent",
          "sent",
          "send",
          "sending"
        ],
        "correctAnswer": "were sent"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Reported Speech",
    "slug": "b2-en-reported-speech-gap",
    "description": "Practice reported speech.",
    "targetLanguage": "en",
    "level": "B2",
    "type": "fill-gap",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "Complete the sentence",
        "parts": [
          "She said she ",
          " tired."
        ],
        "correctAnswers": [
          "was"
        ]
      },
      {
        "id": "q2",
        "question": "Complete the sentence",
        "parts": [
          "He said he ",
          " travel."
        ],
        "correctAnswers": [
          "would"
        ]
      },
      {
        "id": "q3",
        "question": "Complete the sentence",
        "parts": [
          "They said they had already ",
          " the work."
        ],
        "correctAnswers": [
          "finished"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Job Interview",
    "slug": "b2-en-job-interview-fc",
    "description": "Vocabulary for job interviews.",
    "targetLanguage": "en",
    "level": "B2",
    "type": "flashcard",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "strengths",
        "front": "strengths",
        "back": "pontos fortes"
      },
      {
        "id": "q2",
        "question": "weakness",
        "front": "weakness",
        "back": "ponto fraco"
      },
      {
        "id": "q3",
        "question": "experience",
        "front": "experience",
        "back": "experiência"
      },
      {
        "id": "q4",
        "question": "skills",
        "front": "skills",
        "back": "habilidades"
      },
      {
        "id": "q5",
        "question": "references",
        "front": "references",
        "back": "referências"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Relative Clauses",
    "slug": "b2-en-relative-clauses-mc",
    "description": "Practice relative pronouns.",
    "targetLanguage": "en",
    "level": "B2",
    "type": "multiple-choice",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "This is the man ___ helped me.",
        "options": [
          "who",
          "whom",
          "whose",
          "where"
        ],
        "correctAnswer": "who"
      },
      {
        "id": "q2",
        "question": "The city ___ I was born is beautiful.",
        "options": [
          "where",
          "who",
          "whose",
          "which"
        ],
        "correctAnswer": "where"
      },
      {
        "id": "q3",
        "question": "This is the woman ___ son studies with me.",
        "options": [
          "whose",
          "who",
          "whom",
          "where"
        ],
        "correctAnswer": "whose"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Opinion and Debate",
    "slug": "b2-en-opinion-and-debate-gap",
    "description": "Practice expressions for giving opinions.",
    "targetLanguage": "en",
    "level": "B2",
    "type": "fill-gap",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "Complete the sentence",
        "parts": [
          "In my ",
          ", this is unfair."
        ],
        "correctAnswers": [
          "opinion"
        ]
      },
      {
        "id": "q2",
        "question": "Complete the sentence",
        "parts": [
          "I completely ",
          " with that idea."
        ],
        "correctAnswers": [
          "disagree"
        ]
      },
      {
        "id": "q3",
        "question": "Complete the sentence",
        "parts": [
          "It’s important to consider both ",
          " of the argument."
        ],
        "correctAnswers": [
          "sides"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Media and News",
    "slug": "b2-en-media-and-news-fc",
    "description": "Vocabulary about media and news.",
    "targetLanguage": "en",
    "level": "B2",
    "type": "flashcard",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "headline",
        "front": "headline",
        "back": "manchete"
      },
      {
        "id": "q2",
        "question": "news report",
        "front": "news report",
        "back": "reportagem"
      },
      {
        "id": "q3",
        "question": "journalist",
        "front": "journalist",
        "back": "jornalista"
      },
      {
        "id": "q4",
        "question": "source",
        "front": "source",
        "back": "fonte"
      },
      {
        "id": "q5",
        "question": "broadcast",
        "front": "broadcast",
        "back": "transmissão"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Formal Writing",
    "slug": "b2-en-formal-writing-mc",
    "description": "Practice formal writing expressions.",
    "targetLanguage": "en",
    "level": "B2",
    "type": "multiple-choice",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "Which expression is more formal to start a letter?",
        "options": [
          "Dear Sir/Madam",
          "Hey",
          "What’s up",
          "Yo"
        ],
        "correctAnswer": "Dear Sir/Madam"
      },
      {
        "id": "q2",
        "question": "How do you close a formal email?",
        "options": [
          "Sincerely",
          "Kisses",
          "Later",
          "See ya"
        ],
        "correctAnswer": "Sincerely"
      },
      {
        "id": "q3",
        "question": "Which of these is a formal way to request something?",
        "options": [
          "I would like to request",
          "Gimme",
          "Give it",
          "Hand it over"
        ],
        "correctAnswer": "I would like to request"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Vocabulaire des Affaires",
    "slug": "b2-fr-vocabulaire-des-affaires-fc",
    "description": "Vocabulaire du monde des affaires.",
    "targetLanguage": "fr",
    "level": "B2",
    "type": "flashcard",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "accord",
        "front": "accord",
        "back": "agreement"
      },
      {
        "id": "q2",
        "question": "investissement",
        "front": "investissement",
        "back": "investment"
      },
      {
        "id": "q3",
        "question": "concurrence",
        "front": "concurrence",
        "back": "competition"
      },
      {
        "id": "q4",
        "question": "bénéfice",
        "front": "bénéfice",
        "back": "profit"
      },
      {
        "id": "q5",
        "question": "budget",
        "front": "budget",
        "back": "budget"
      }
    ],
    "isPublic": true
  },
  {
    "title": "La Voix Passive",
    "slug": "b2-fr-la-voix-passive-mc",
    "description": "Pratiquez la formation de la voix passive.",
    "targetLanguage": "fr",
    "level": "B2",
    "type": "multiple-choice",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "Le livre ___ (écrire) par elle.",
        "options": [
          "a été écrit",
          "a écrit",
          "écrit",
          "écrivant"
        ],
        "correctAnswer": "a été écrit"
      },
      {
        "id": "q2",
        "question": "La maison ___ (construire) en 1990.",
        "options": [
          "a été construite",
          "a construit",
          "construit",
          "construisant"
        ],
        "correctAnswer": "a été construite"
      },
      {
        "id": "q3",
        "question": "Les documents ___ (envoyer) hier.",
        "options": [
          "ont été envoyés",
          "ont envoyé",
          "envoient",
          "envoyant"
        ],
        "correctAnswer": "ont été envoyés"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Discours Indirect",
    "slug": "b2-fr-discours-indirect-gap",
    "description": "Pratiquez le discours indirect.",
    "targetLanguage": "fr",
    "level": "B2",
    "type": "fill-gap",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "Complétez la phrase",
        "parts": [
          "Elle a dit qu'elle ",
          " fatiguée."
        ],
        "correctAnswers": [
          "était"
        ]
      },
      {
        "id": "q2",
        "question": "Complétez la phrase",
        "parts": [
          "Il a dit qu'il ",
          " voyager."
        ],
        "correctAnswers": [
          "allait"
        ]
      },
      {
        "id": "q3",
        "question": "Complétez la phrase",
        "parts": [
          "Ils ont dit qu’ils avaient déjà ",
          " le travail."
        ],
        "correctAnswers": [
          "fini"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Entretien d'Embauche",
    "slug": "b2-fr-entretien-embauche-fc",
    "description": "Vocabulaire pour l'entretien d'embauche.",
    "targetLanguage": "fr",
    "level": "B2",
    "type": "flashcard",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "points forts",
        "front": "points forts",
        "back": "strengths"
      },
      {
        "id": "q2",
        "question": "point faible",
        "front": "point faible",
        "back": "weakness"
      },
      {
        "id": "q3",
        "question": "expérience",
        "front": "expérience",
        "back": "experience"
      },
      {
        "id": "q4",
        "question": "compétences",
        "front": "compétences",
        "back": "skills"
      },
      {
        "id": "q5",
        "question": "références",
        "front": "références",
        "back": "references"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Propositions Relatives",
    "slug": "b2-fr-propositions-relatives-mc",
    "description": "Pratiquez les pronoms relatifs.",
    "targetLanguage": "fr",
    "level": "B2",
    "type": "multiple-choice",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "C'est l'homme ___ m'a aidé.",
        "options": [
          "qui",
          "que",
          "dont",
          "où"
        ],
        "correctAnswer": "qui"
      },
      {
        "id": "q2",
        "question": "La ville ___ je suis né est belle.",
        "options": [
          "où",
          "qui",
          "que",
          "dont"
        ],
        "correctAnswer": "où"
      },
      {
        "id": "q3",
        "question": "C'est la femme ___ le fils étudie avec moi.",
        "options": [
          "dont",
          "qui",
          "que",
          "où"
        ],
        "correctAnswer": "dont"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Opinion et Débat",
    "slug": "b2-fr-opinion-et-debat-gap",
    "description": "Pratiquez les expressions pour donner son opinion.",
    "targetLanguage": "fr",
    "level": "B2",
    "type": "fill-gap",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "Complétez la phrase",
        "parts": [
          "À mon ",
          ", c’est injuste."
        ],
        "correctAnswers": [
          "avis"
        ]
      },
      {
        "id": "q2",
        "question": "Complétez la phrase",
        "parts": [
          "Je ne suis pas du tout d'",
          " avec cette idée."
        ],
        "correctAnswers": [
          "accord"
        ]
      },
      {
        "id": "q3",
        "question": "Complétez la phrase",
        "parts": [
          "Il est important de considérer les deux ",
          " de l'argument."
        ],
        "correctAnswers": [
          "côtés"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Médias et Actualités",
    "slug": "b2-fr-medias-et-actualites-fc",
    "description": "Vocabulaire sur les médias et les actualités.",
    "targetLanguage": "fr",
    "level": "B2",
    "type": "flashcard",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "titre",
        "front": "titre",
        "back": "headline"
      },
      {
        "id": "q2",
        "question": "reportage",
        "front": "reportage",
        "back": "news report"
      },
      {
        "id": "q3",
        "question": "journaliste",
        "front": "journaliste",
        "back": "journalist"
      },
      {
        "id": "q4",
        "question": "source",
        "front": "source",
        "back": "source"
      },
      {
        "id": "q5",
        "question": "diffusion",
        "front": "diffusion",
        "back": "broadcast"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Écriture Formelle",
    "slug": "b2-fr-ecriture-formelle-mc",
    "description": "Pratiquez les expressions d'écriture formelle.",
    "targetLanguage": "fr",
    "level": "B2",
    "type": "multiple-choice",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "Quelle formule est plus formelle pour commencer une lettre?",
        "options": [
          "Cher Monsieur/Madame",
          "Salut",
          "Coucou",
          "Yo"
        ],
        "correctAnswer": "Cher Monsieur/Madame"
      },
      {
        "id": "q2",
        "question": "Comment termine-t-on un e-mail formel?",
        "options": [
          "Cordialement",
          "Bisous",
          "À plus",
          "Salut"
        ],
        "correctAnswer": "Cordialement"
      },
      {
        "id": "q3",
        "question": "Laquelle de ces formules est une façon formelle de demander quelque chose?",
        "options": [
          "Je vous prie de bien vouloir",
          "Donne-moi",
          "Passe-moi ça",
          "File-le"
        ],
        "correctAnswer": "Je vous prie de bien vouloir"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Collocations Comuns",
    "slug": "c1-pt-collocations-comuns-fc",
    "description": "Combinações de palavras usadas naturalmente por falantes nativos.",
    "targetLanguage": "pt",
    "level": "C1",
    "type": "flashcard",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "tomar uma decisão",
        "front": "tomar uma decisão",
        "back": "to make a decision"
      },
      {
        "id": "q2",
        "question": "correr um risco",
        "front": "correr um risco",
        "back": "to take a risk"
      },
      {
        "id": "q3",
        "question": "prestar atenção",
        "front": "prestar atenção",
        "back": "to pay attention"
      },
      {
        "id": "q4",
        "question": "dar uma olhada",
        "front": "dar uma olhada",
        "back": "to take a look"
      },
      {
        "id": "q5",
        "question": "ganhar tempo",
        "front": "ganhar tempo",
        "back": "to save time"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Vocabulário Acadêmico",
    "slug": "c1-pt-vocabulario-academico-mc",
    "description": "Vocabulário usado em contextos acadêmicos.",
    "targetLanguage": "pt",
    "level": "C1",
    "type": "multiple-choice",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Qual palavra significa 'analisar profundamente'?",
        "options": [
          "aprofundar",
          "resumir",
          "ignorar",
          "repetir"
        ],
        "correctAnswer": "aprofundar"
      },
      {
        "id": "q2",
        "question": "O que significa 'hipótese'?",
        "options": [
          "suposição a ser testada",
          "fato comprovado",
          "opinião pessoal",
          "erro comum"
        ],
        "correctAnswer": "suposição a ser testada"
      },
      {
        "id": "q3",
        "question": "'Coerente' significa:",
        "options": [
          "lógico e bem conectado",
          "confuso",
          "repetitivo",
          "curto"
        ],
        "correctAnswer": "lógico e bem conectado"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Conectores Avançados",
    "slug": "c1-pt-conectores-avancados-gap",
    "description": "Pratique conectores usados em textos argumentativos.",
    "targetLanguage": "pt",
    "level": "C1",
    "type": "fill-gap",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Complete a frase",
        "parts": [
          "",
          " o mau tempo, a viagem continuou."
        ],
        "correctAnswers": [
          "Apesar de"
        ]
      },
      {
        "id": "q2",
        "question": "Complete a frase",
        "parts": [
          "Ele estudou muito; ",
          ", não passou no exame."
        ],
        "correctAnswers": [
          "contudo"
        ]
      },
      {
        "id": "q3",
        "question": "Complete a frase",
        "parts": [
          "",
          " ele seja jovem, tem muita experiência."
        ],
        "correctAnswers": [
          "Embora"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Termos Jurídicos",
    "slug": "c1-pt-termos-juridicos-fc",
    "description": "Vocabulário jurídico e formal.",
    "targetLanguage": "pt",
    "level": "C1",
    "type": "flashcard",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "cláusula",
        "front": "cláusula",
        "back": "clause"
      },
      {
        "id": "q2",
        "question": "réu",
        "front": "réu",
        "back": "defendant"
      },
      {
        "id": "q3",
        "question": "testemunha",
        "front": "testemunha",
        "back": "witness"
      },
      {
        "id": "q4",
        "question": "sentença",
        "front": "sentença",
        "back": "ruling"
      },
      {
        "id": "q5",
        "question": "contrato",
        "front": "contrato",
        "back": "contract"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Phrasal Verbs Avançados",
    "slug": "c1-pt-phrasal-verbs-avancados-mc",
    "description": "Expressões verbais avançadas em português.",
    "targetLanguage": "pt",
    "level": "C1",
    "type": "multiple-choice",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "'Levar em conta' significa:",
        "options": [
          "considerar",
          "ignorar",
          "esquecer",
          "negar"
        ],
        "correctAnswer": "considerar"
      },
      {
        "id": "q2",
        "question": "'Abrir mão de' significa:",
        "options": [
          "desistir de",
          "pegar",
          "ganhar",
          "perder"
        ],
        "correctAnswer": "desistir de"
      },
      {
        "id": "q3",
        "question": "'Colocar em prática' significa:",
        "options": [
          "aplicar",
          "imaginar",
          "planejar",
          "cancelar"
        ],
        "correctAnswer": "aplicar"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Registro e Persuasão",
    "slug": "c1-pt-registro-e-persuasao-gap",
    "description": "Pratique linguagem persuasiva formal.",
    "targetLanguage": "pt",
    "level": "C1",
    "type": "fill-gap",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Complete a frase",
        "parts": [
          "É inegável que essa medida trará ",
          " benefícios."
        ],
        "correctAnswers": [
          "grandes"
        ]
      },
      {
        "id": "q2",
        "question": "Complete a frase",
        "parts": [
          "Portanto, podemos ",
          " que a proposta é viável."
        ],
        "correctAnswers": [
          "concluir"
        ]
      },
      {
        "id": "q3",
        "question": "Complete a frase",
        "parts": [
          "Sem dúvida, essa é a melhor ",
          " a seguir."
        ],
        "correctAnswers": [
          "opção"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Mudança de Registro",
    "slug": "c1-pt-mudanca-de-registro-fc",
    "description": "Compare linguagem informal e formal.",
    "targetLanguage": "pt",
    "level": "C1",
    "type": "flashcard",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "topa?",
        "front": "topa?",
        "back": "você aceita?"
      },
      {
        "id": "q2",
        "question": "beleza",
        "front": "beleza",
        "back": "está tudo bem"
      },
      {
        "id": "q3",
        "question": "dá um help",
        "front": "dá um help",
        "back": "pode me ajudar"
      },
      {
        "id": "q4",
        "question": "sacou?",
        "front": "sacou?",
        "back": "você entendeu?"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Debate e Argumentação",
    "slug": "c1-pt-debate-e-argumentacao-mc",
    "description": "Expressões usadas em debates formais.",
    "targetLanguage": "pt",
    "level": "C1",
    "type": "multiple-choice",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Qual expressão introduz um contra-argumento?",
        "options": [
          "Por outro lado",
          "Além disso",
          "Da mesma forma",
          "Em primeiro lugar"
        ],
        "correctAnswer": "Por outro lado"
      },
      {
        "id": "q2",
        "question": "Qual frase reforça um argumento?",
        "options": [
          "Isso comprova que",
          "Talvez",
          "Não sei",
          "De qualquer jeito"
        ],
        "correctAnswer": "Isso comprova que"
      },
      {
        "id": "q3",
        "question": "Como você concede um ponto ao oponente educadamente?",
        "options": [
          "Reconheço que, mas",
          "Você está errado",
          "Isso é bobagem",
          "Não me importa"
        ],
        "correctAnswer": "Reconheço que, mas"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Common Collocations",
    "slug": "c1-en-common-collocations-fc",
    "description": "Word combinations native speakers use naturally.",
    "targetLanguage": "en",
    "level": "C1",
    "type": "flashcard",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "to make a decision",
        "front": "to make a decision",
        "back": "tomar uma decisão"
      },
      {
        "id": "q2",
        "question": "to take a risk",
        "front": "to take a risk",
        "back": "correr um risco"
      },
      {
        "id": "q3",
        "question": "to pay attention",
        "front": "to pay attention",
        "back": "prestar atenção"
      },
      {
        "id": "q4",
        "question": "to take a look",
        "front": "to take a look",
        "back": "dar uma olhada"
      },
      {
        "id": "q5",
        "question": "to save time",
        "front": "to save time",
        "back": "ganhar tempo"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Academic Vocabulary",
    "slug": "c1-en-academic-vocabulary-mc",
    "description": "Vocabulary used in academic contexts.",
    "targetLanguage": "en",
    "level": "C1",
    "type": "multiple-choice",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Which word means 'to analyze deeply'?",
        "options": [
          "to delve into",
          "to summarize",
          "to ignore",
          "to repeat"
        ],
        "correctAnswer": "to delve into"
      },
      {
        "id": "q2",
        "question": "What does 'hypothesis' mean?",
        "options": [
          "an assumption to be tested",
          "a proven fact",
          "a personal opinion",
          "a common mistake"
        ],
        "correctAnswer": "an assumption to be tested"
      },
      {
        "id": "q3",
        "question": "'Coherent' means:",
        "options": [
          "logical and well-connected",
          "confusing",
          "repetitive",
          "short"
        ],
        "correctAnswer": "logical and well-connected"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Advanced Connectors",
    "slug": "c1-en-advanced-connectors-gap",
    "description": "Practice connectors used in argumentative texts.",
    "targetLanguage": "en",
    "level": "C1",
    "type": "fill-gap",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Complete the sentence",
        "parts": [
          "",
          " the bad weather, the trip continued."
        ],
        "correctAnswers": [
          "Despite"
        ]
      },
      {
        "id": "q2",
        "question": "Complete the sentence",
        "parts": [
          "He studied hard; ",
          ", he did not pass the exam."
        ],
        "correctAnswers": [
          "however"
        ]
      },
      {
        "id": "q3",
        "question": "Complete the sentence",
        "parts": [
          "",
          " he is young, he has a lot of experience."
        ],
        "correctAnswers": [
          "Although"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Legal Terms",
    "slug": "c1-en-legal-terms-fc",
    "description": "Legal and formal vocabulary.",
    "targetLanguage": "en",
    "level": "C1",
    "type": "flashcard",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "clause",
        "front": "clause",
        "back": "cláusula"
      },
      {
        "id": "q2",
        "question": "defendant",
        "front": "defendant",
        "back": "réu"
      },
      {
        "id": "q3",
        "question": "witness",
        "front": "witness",
        "back": "testemunha"
      },
      {
        "id": "q4",
        "question": "ruling",
        "front": "ruling",
        "back": "sentença"
      },
      {
        "id": "q5",
        "question": "contract",
        "front": "contract",
        "back": "contrato"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Advanced Phrasal Verbs",
    "slug": "c1-en-advanced-phrasal-verbs-mc",
    "description": "Advanced phrasal verb expressions.",
    "targetLanguage": "en",
    "level": "C1",
    "type": "multiple-choice",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "'To account for' means:",
        "options": [
          "to explain",
          "to ignore",
          "to forget",
          "to deny"
        ],
        "correctAnswer": "to explain"
      },
      {
        "id": "q2",
        "question": "'To give up on' means:",
        "options": [
          "to stop trying",
          "to start",
          "to win",
          "to lose"
        ],
        "correctAnswer": "to stop trying"
      },
      {
        "id": "q3",
        "question": "'To put into practice' means:",
        "options": [
          "to apply",
          "to imagine",
          "to plan",
          "to cancel"
        ],
        "correctAnswer": "to apply"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Register and Persuasion",
    "slug": "c1-en-register-and-persuasion-gap",
    "description": "Practice formal persuasive language.",
    "targetLanguage": "en",
    "level": "C1",
    "type": "fill-gap",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Complete the sentence",
        "parts": [
          "It is undeniable that this measure will bring ",
          " benefits."
        ],
        "correctAnswers": [
          "great"
        ]
      },
      {
        "id": "q2",
        "question": "Complete the sentence",
        "parts": [
          "Therefore, we can ",
          " that the proposal is viable."
        ],
        "correctAnswers": [
          "conclude"
        ]
      },
      {
        "id": "q3",
        "question": "Complete the sentence",
        "parts": [
          "Without a doubt, this is the best ",
          " to follow."
        ],
        "correctAnswers": [
          "option"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Register Shifting",
    "slug": "c1-en-register-shifting-fc",
    "description": "Compare informal and formal English.",
    "targetLanguage": "en",
    "level": "C1",
    "type": "flashcard",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "gimme a sec",
        "front": "gimme a sec",
        "back": "give me a moment"
      },
      {
        "id": "q2",
        "question": "wanna",
        "front": "wanna",
        "back": "want to"
      },
      {
        "id": "q3",
        "question": "kinda",
        "front": "kinda",
        "back": "kind of"
      },
      {
        "id": "q4",
        "question": "lemme know",
        "front": "lemme know",
        "back": "let me know"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Debate and Argumentation",
    "slug": "c1-en-debate-and-argumentation-mc",
    "description": "Expressions used in formal debate.",
    "targetLanguage": "en",
    "level": "C1",
    "type": "multiple-choice",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Which expression introduces a counter-argument?",
        "options": [
          "On the other hand",
          "Furthermore",
          "Likewise",
          "First of all"
        ],
        "correctAnswer": "On the other hand"
      },
      {
        "id": "q2",
        "question": "Which phrase reinforces an argument?",
        "options": [
          "This proves that",
          "Maybe",
          "I don’t know",
          "Whatever"
        ],
        "correctAnswer": "This proves that"
      },
      {
        "id": "q3",
        "question": "How do you politely concede a point to your opponent?",
        "options": [
          "I acknowledge that, but",
          "You’re wrong",
          "That’s nonsense",
          "I don’t care"
        ],
        "correctAnswer": "I acknowledge that, but"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Collocations Courantes",
    "slug": "c1-fr-collocations-courantes-fc",
    "description": "Combinaisons de mots utilisées naturellement par les natifs.",
    "targetLanguage": "fr",
    "level": "C1",
    "type": "flashcard",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "prendre une décision",
        "front": "prendre une décision",
        "back": "to make a decision"
      },
      {
        "id": "q2",
        "question": "prendre un risque",
        "front": "prendre un risque",
        "back": "to take a risk"
      },
      {
        "id": "q3",
        "question": "faire attention",
        "front": "faire attention",
        "back": "to pay attention"
      },
      {
        "id": "q4",
        "question": "jeter un coup d’œil",
        "front": "jeter un coup d’œil",
        "back": "to take a look"
      },
      {
        "id": "q5",
        "question": "gagner du temps",
        "front": "gagner du temps",
        "back": "to save time"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Vocabulaire Académique",
    "slug": "c1-fr-vocabulaire-academique-mc",
    "description": "Vocabulaire utilisé dans un contexte académique.",
    "targetLanguage": "fr",
    "level": "C1",
    "type": "multiple-choice",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Quel mot signifie 'analyser en profondeur'?",
        "options": [
          "approfondir",
          "résumer",
          "ignorer",
          "répéter"
        ],
        "correctAnswer": "approfondir"
      },
      {
        "id": "q2",
        "question": "Que signifie 'hypothèse'?",
        "options": [
          "une supposition à tester",
          "un fait prouvé",
          "une opinion personnelle",
          "une erreur courante"
        ],
        "correctAnswer": "une supposition à tester"
      },
      {
        "id": "q3",
        "question": "'Cohérent' signifie:",
        "options": [
          "logique et bien lié",
          "confus",
          "répétitif",
          "court"
        ],
        "correctAnswer": "logique et bien lié"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Connecteurs Avancés",
    "slug": "c1-fr-connecteurs-avances-gap",
    "description": "Pratiquez les connecteurs utilisés dans les textes argumentatifs.",
    "targetLanguage": "fr",
    "level": "C1",
    "type": "fill-gap",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Complétez la phrase",
        "parts": [
          "",
          " le mauvais temps, le voyage a continué."
        ],
        "correctAnswers": [
          "Malgré"
        ]
      },
      {
        "id": "q2",
        "question": "Complétez la phrase",
        "parts": [
          "Il a beaucoup étudié; ",
          ", il n’a pas réussi l’examen."
        ],
        "correctAnswers": [
          "cependant"
        ]
      },
      {
        "id": "q3",
        "question": "Complétez la phrase",
        "parts": [
          "",
          " il soit jeune, il a beaucoup d’expérience."
        ],
        "correctAnswers": [
          "Bien que"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Termes Juridiques",
    "slug": "c1-fr-termes-juridiques-fc",
    "description": "Vocabulaire juridique et formel.",
    "targetLanguage": "fr",
    "level": "C1",
    "type": "flashcard",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "clause",
        "front": "clause",
        "back": "clause"
      },
      {
        "id": "q2",
        "question": "accusé",
        "front": "accusé",
        "back": "defendant"
      },
      {
        "id": "q3",
        "question": "témoin",
        "front": "témoin",
        "back": "witness"
      },
      {
        "id": "q4",
        "question": "jugement",
        "front": "jugement",
        "back": "ruling"
      },
      {
        "id": "q5",
        "question": "contrat",
        "front": "contrat",
        "back": "contract"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Verbes à Particule Avancés",
    "slug": "c1-fr-verbes-a-particule-avances-mc",
    "description": "Expressions verbales avancées en français.",
    "targetLanguage": "fr",
    "level": "C1",
    "type": "multiple-choice",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "'Tenir compte de' signifie:",
        "options": [
          "considérer",
          "ignorer",
          "oublier",
          "nier"
        ],
        "correctAnswer": "considérer"
      },
      {
        "id": "q2",
        "question": "'Renoncer à' signifie:",
        "options": [
          "abandonner",
          "prendre",
          "gagner",
          "perdre"
        ],
        "correctAnswer": "abandonner"
      },
      {
        "id": "q3",
        "question": "'Mettre en pratique' signifie:",
        "options": [
          "appliquer",
          "imaginer",
          "planifier",
          "annuler"
        ],
        "correctAnswer": "appliquer"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Registre et Persuasion",
    "slug": "c1-fr-registre-et-persuasion-gap",
    "description": "Pratiquez le langage persuasif formel.",
    "targetLanguage": "fr",
    "level": "C1",
    "type": "fill-gap",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Complétez la phrase",
        "parts": [
          "Il est indéniable que cette mesure apportera de ",
          " bénéfices."
        ],
        "correctAnswers": [
          "grands"
        ]
      },
      {
        "id": "q2",
        "question": "Complétez la phrase",
        "parts": [
          "Par conséquent, nous pouvons ",
          " que la proposition est viable."
        ],
        "correctAnswers": [
          "conclure"
        ]
      },
      {
        "id": "q3",
        "question": "Complétez la phrase",
        "parts": [
          "Sans aucun doute, c’est la meilleure ",
          " à suivre."
        ],
        "correctAnswers": [
          "option"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Changement de Registre",
    "slug": "c1-fr-changement-de-registre-fc",
    "description": "Comparez le langage informel et formel en français.",
    "targetLanguage": "fr",
    "level": "C1",
    "type": "flashcard",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "t’inquiète",
        "front": "t’inquiète",
        "back": "ne vous inquiétez pas"
      },
      {
        "id": "q2",
        "question": "j’sais pas",
        "front": "j’sais pas",
        "back": "je ne sais pas"
      },
      {
        "id": "q3",
        "question": "faut que",
        "front": "faut que",
        "back": "il faut que"
      },
      {
        "id": "q4",
        "question": "grave (familier)",
        "front": "grave (familier)",
        "back": "vraiment"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Débat et Argumentation",
    "slug": "c1-fr-debat-et-argumentation-mc",
    "description": "Expressions utilisées dans un débat formel.",
    "targetLanguage": "fr",
    "level": "C1",
    "type": "multiple-choice",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Quelle expression introduit un contre-argument?",
        "options": [
          "En revanche",
          "De plus",
          "De même",
          "Tout d’abord"
        ],
        "correctAnswer": "En revanche"
      },
      {
        "id": "q2",
        "question": "Quelle phrase renforce un argument?",
        "options": [
          "Cela prouve que",
          "Peut-être",
          "Je ne sais pas",
          "Peu importe"
        ],
        "correctAnswer": "Cela prouve que"
      },
      {
        "id": "q3",
        "question": "Comment concède-t-on poliment un point à son adversaire?",
        "options": [
          "Je reconnais que, mais",
          "Vous avez tort",
          "C’est absurde",
          "Je m’en fiche"
        ],
        "correctAnswer": "Je reconnais que, mais"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Vocabulário Raro",
    "slug": "c2-pt-vocabulario-raro-fc",
    "description": "Vocabulário sofisticado e pouco comum.",
    "targetLanguage": "pt",
    "level": "C2",
    "type": "flashcard",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "perene",
        "front": "perene",
        "back": "everlasting / perennial"
      },
      {
        "id": "q2",
        "question": "efêmero",
        "front": "efêmero",
        "back": "ephemeral"
      },
      {
        "id": "q3",
        "question": "ubíquo",
        "front": "ubíquo",
        "back": "ubiquitous"
      },
      {
        "id": "q4",
        "question": "incipiente",
        "front": "incipiente",
        "back": "incipient"
      },
      {
        "id": "q5",
        "question": "hodierno",
        "front": "hodierno",
        "back": "present-day"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Figuras de Linguagem",
    "slug": "c2-pt-figuras-de-linguagem-mc",
    "description": "Reconheça figuras de linguagem em português.",
    "targetLanguage": "pt",
    "level": "C2",
    "type": "multiple-choice",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "'O tempo é um rio que corre sem parar' é um exemplo de:",
        "options": [
          "metáfora",
          "onomatopeia",
          "hipérbole",
          "eufemismo"
        ],
        "correctAnswer": "metáfora"
      },
      {
        "id": "q2",
        "question": "Dizer 'chorei rios de lágrimas' é:",
        "options": [
          "hipérbole",
          "metáfora",
          "ironia",
          "eufemismo"
        ],
        "correctAnswer": "hipérbole"
      },
      {
        "id": "q3",
        "question": "Usar 'partiu para melhor' em vez de 'morreu' é:",
        "options": [
          "eufemismo",
          "hipérbole",
          "metáfora",
          "ironia"
        ],
        "correctAnswer": "eufemismo"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Provérbios",
    "slug": "c2-pt-proverbios-gap",
    "description": "Complete provérbios populares em português.",
    "targetLanguage": "pt",
    "level": "C2",
    "type": "fill-gap",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Complete o provérbio",
        "parts": [
          "Água mole em pedra dura, tanto bate até que ",
          "."
        ],
        "correctAnswers": [
          "fura"
        ]
      },
      {
        "id": "q2",
        "question": "Complete o provérbio",
        "parts": [
          "Quem tudo quer, tudo ",
          "."
        ],
        "correctAnswers": [
          "perde"
        ]
      },
      {
        "id": "q3",
        "question": "Complete o provérbio",
        "parts": [
          "Antes tarde do que ",
          "."
        ],
        "correctAnswers": [
          "nunca"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Termos Especializados",
    "slug": "c2-pt-termos-especializados-fc",
    "description": "Vocabulário de linguística e etimologia.",
    "targetLanguage": "pt",
    "level": "C2",
    "type": "flashcard",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "etimologia",
        "front": "etimologia",
        "back": "etymology"
      },
      {
        "id": "q2",
        "question": "neologismo",
        "front": "neologismo",
        "back": "neologism"
      },
      {
        "id": "q3",
        "question": "semântica",
        "front": "semântica",
        "back": "semantics"
      },
      {
        "id": "q4",
        "question": "sintaxe",
        "front": "sintaxe",
        "back": "syntax"
      },
      {
        "id": "q5",
        "question": "morfologia",
        "front": "morfologia",
        "back": "morphology"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Ironia e Sátira",
    "slug": "c2-pt-ironia-e-satira-mc",
    "description": "Identifique ironia e sátira em textos.",
    "targetLanguage": "pt",
    "level": "C2",
    "type": "multiple-choice",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Um texto que critica a sociedade usando humor exagerado é:",
        "options": [
          "sátira",
          "elegia",
          "ode",
          "soneto"
        ],
        "correctAnswer": "sátira"
      },
      {
        "id": "q2",
        "question": "Dizer 'que dia lindo' durante uma tempestade é:",
        "options": [
          "ironia",
          "metáfora",
          "aliteração",
          "rima"
        ],
        "correctAnswer": "ironia"
      },
      {
        "id": "q3",
        "question": "Uma obra que ridiculariza vícios humanos é chamada de:",
        "options": [
          "sátira",
          "épico",
          "lírica",
          "drama"
        ],
        "correctAnswer": "sátira"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Marcadores Discursivos",
    "slug": "c2-pt-marcadores-discursivos-gap",
    "description": "Pratique marcadores discursivos avançados.",
    "targetLanguage": "pt",
    "level": "C2",
    "type": "fill-gap",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Complete a frase",
        "parts": [
          "Posto ",
          ", vamos analisar os dados."
        ],
        "correctAnswers": [
          "isso"
        ]
      },
      {
        "id": "q2",
        "question": "Complete a frase",
        "parts": [
          "Em última ",
          ", a proposta é sólida."
        ],
        "correctAnswers": [
          "análise"
        ]
      },
      {
        "id": "q3",
        "question": "Complete a frase",
        "parts": [
          "",
          " obstante as críticas, o projeto seguiu em frente."
        ],
        "correctAnswers": [
          "Não"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Expressões Regionais",
    "slug": "c2-pt-expressoes-regionais-fc",
    "description": "Expressões regionais e coloquiais do Brasil.",
    "targetLanguage": "pt",
    "level": "C2",
    "type": "flashcard",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "trem (Minas, informal p/ \"coisa\")",
        "front": "trem (Minas, informal p/ \"coisa\")",
        "back": "thing (regional slang)"
      },
      {
        "id": "q2",
        "question": "égua (Nordeste, exclamação)",
        "front": "égua (Nordeste, exclamação)",
        "back": "wow / surprise"
      },
      {
        "id": "q3",
        "question": "bah (Sul, exclamação)",
        "front": "bah (Sul, exclamação)",
        "back": "wow / oh"
      },
      {
        "id": "q4",
        "question": "mano (SP, gíria)",
        "front": "mano (SP, gíria)",
        "back": "dude / friend"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Compreensão Discursiva Avançada",
    "slug": "c2-pt-compreensao-discursiva-avancada-mc",
    "description": "Pratique conectivos e nuances de texto avançado.",
    "targetLanguage": "pt",
    "level": "C2",
    "type": "multiple-choice",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Qual palavra melhor substitui 'contudo' mantendo o sentido?",
        "options": [
          "entretanto",
          "portanto",
          "porque",
          "assim"
        ],
        "correctAnswer": "entretanto"
      },
      {
        "id": "q2",
        "question": "Em um texto acadêmico, qual conectivo indica conclusão?",
        "options": [
          "portanto",
          "mas",
          "ou",
          "e"
        ],
        "correctAnswer": "portanto"
      },
      {
        "id": "q3",
        "question": "Qual dessas palavras é um marcador de ênfase?",
        "options": [
          "de fato",
          "talvez",
          "quase",
          "quase nunca"
        ],
        "correctAnswer": "de fato"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Rare Vocabulary",
    "slug": "c2-en-rare-vocabulary-fc",
    "description": "Sophisticated and uncommon vocabulary.",
    "targetLanguage": "en",
    "level": "C2",
    "type": "flashcard",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "everlasting",
        "front": "everlasting",
        "back": "perene"
      },
      {
        "id": "q2",
        "question": "ephemeral",
        "front": "ephemeral",
        "back": "efêmero"
      },
      {
        "id": "q3",
        "question": "ubiquitous",
        "front": "ubiquitous",
        "back": "ubíquo"
      },
      {
        "id": "q4",
        "question": "incipient",
        "front": "incipient",
        "back": "incipiente"
      },
      {
        "id": "q5",
        "question": "present-day",
        "front": "present-day",
        "back": "hodierno"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Literary Devices",
    "slug": "c2-en-literary-devices-mc",
    "description": "Recognize literary devices in English.",
    "targetLanguage": "en",
    "level": "C2",
    "type": "multiple-choice",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "'Time is a river that never stops flowing' is an example of:",
        "options": [
          "metaphor",
          "onomatopoeia",
          "hyperbole",
          "euphemism"
        ],
        "correctAnswer": "metaphor"
      },
      {
        "id": "q2",
        "question": "Saying 'I cried a river of tears' is:",
        "options": [
          "hyperbole",
          "metaphor",
          "irony",
          "euphemism"
        ],
        "correctAnswer": "hyperbole"
      },
      {
        "id": "q3",
        "question": "Using 'passed away' instead of 'died' is:",
        "options": [
          "euphemism",
          "hyperbole",
          "metaphor",
          "irony"
        ],
        "correctAnswer": "euphemism"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Proverbs",
    "slug": "c2-en-proverbs-gap",
    "description": "Complete popular English proverbs.",
    "targetLanguage": "en",
    "level": "C2",
    "type": "fill-gap",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Complete the proverb",
        "parts": [
          "Rome wasn’t built in a ",
          "."
        ],
        "correctAnswers": [
          "day"
        ]
      },
      {
        "id": "q2",
        "question": "Complete the proverb",
        "parts": [
          "Actions speak louder than ",
          "."
        ],
        "correctAnswers": [
          "words"
        ]
      },
      {
        "id": "q3",
        "question": "Complete the proverb",
        "parts": [
          "Better late than ",
          "."
        ],
        "correctAnswers": [
          "never"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Specialized Terms",
    "slug": "c2-en-specialized-terms-fc",
    "description": "Vocabulary from linguistics and etymology.",
    "targetLanguage": "en",
    "level": "C2",
    "type": "flashcard",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "etymology",
        "front": "etymology",
        "back": "etimologia"
      },
      {
        "id": "q2",
        "question": "neologism",
        "front": "neologism",
        "back": "neologismo"
      },
      {
        "id": "q3",
        "question": "semantics",
        "front": "semantics",
        "back": "semântica"
      },
      {
        "id": "q4",
        "question": "syntax",
        "front": "syntax",
        "back": "sintaxe"
      },
      {
        "id": "q5",
        "question": "morphology",
        "front": "morphology",
        "back": "morfologia"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Irony and Satire",
    "slug": "c2-en-irony-and-satire-mc",
    "description": "Identify irony and satire in texts.",
    "targetLanguage": "en",
    "level": "C2",
    "type": "multiple-choice",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "A text that criticizes society using exaggerated humor is:",
        "options": [
          "satire",
          "elegy",
          "ode",
          "sonnet"
        ],
        "correctAnswer": "satire"
      },
      {
        "id": "q2",
        "question": "Saying 'what a beautiful day' during a storm is:",
        "options": [
          "irony",
          "metaphor",
          "alliteration",
          "rhyme"
        ],
        "correctAnswer": "irony"
      },
      {
        "id": "q3",
        "question": "A work that mocks human vices is called:",
        "options": [
          "satire",
          "epic",
          "lyric",
          "drama"
        ],
        "correctAnswer": "satire"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Discourse Markers",
    "slug": "c2-en-discourse-markers-gap",
    "description": "Practice advanced discourse markers.",
    "targetLanguage": "en",
    "level": "C2",
    "type": "fill-gap",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Complete the sentence",
        "parts": [
          "That ",
          " said, let’s analyze the data."
        ],
        "correctAnswers": [
          "being"
        ]
      },
      {
        "id": "q2",
        "question": "Complete the sentence",
        "parts": [
          "In the ",
          " analysis, the proposal is solid."
        ],
        "correctAnswers": [
          "final"
        ]
      },
      {
        "id": "q3",
        "question": "Complete the sentence",
        "parts": [
          "",
          " withstanding the criticism, the project moved forward."
        ],
        "correctAnswers": [
          "Not"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Regional Expressions",
    "slug": "c2-en-regional-expressions-fc",
    "description": "Regional and colloquial English expressions.",
    "targetLanguage": "en",
    "level": "C2",
    "type": "flashcard",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "y’all (Southern US)",
        "front": "y’all (Southern US)",
        "back": "you all (informal plural you)"
      },
      {
        "id": "q2",
        "question": "reckon (regional)",
        "front": "reckon (regional)",
        "back": "to think / suppose"
      },
      {
        "id": "q3",
        "question": "mate (British/AU)",
        "front": "mate (British/AU)",
        "back": "friend"
      },
      {
        "id": "q4",
        "question": "ain’t (informal/regional)",
        "front": "ain’t (informal/regional)",
        "back": "is not / has not"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Advanced Discourse Comprehension",
    "slug": "c2-en-advanced-discourse-comprehension-mc",
    "description": "Practice advanced connectors and nuance.",
    "targetLanguage": "en",
    "level": "C2",
    "type": "multiple-choice",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Which word best replaces 'however' keeping the meaning?",
        "options": [
          "nevertheless",
          "therefore",
          "because",
          "thus"
        ],
        "correctAnswer": "nevertheless"
      },
      {
        "id": "q2",
        "question": "In an academic text, which connector indicates conclusion?",
        "options": [
          "therefore",
          "but",
          "or",
          "and"
        ],
        "correctAnswer": "therefore"
      },
      {
        "id": "q3",
        "question": "Which of these words is an emphasis marker?",
        "options": [
          "indeed",
          "maybe",
          "almost",
          "rarely"
        ],
        "correctAnswer": "indeed"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Vocabulaire Rare",
    "slug": "c2-fr-vocabulaire-rare-fc",
    "description": "Vocabulaire sophistiqué et peu courant.",
    "targetLanguage": "fr",
    "level": "C2",
    "type": "flashcard",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "pérenne",
        "front": "pérenne",
        "back": "everlasting"
      },
      {
        "id": "q2",
        "question": "éphémère",
        "front": "éphémère",
        "back": "ephemeral"
      },
      {
        "id": "q3",
        "question": "ubiquitaire",
        "front": "ubiquitaire",
        "back": "ubiquitous"
      },
      {
        "id": "q4",
        "question": "naissant",
        "front": "naissant",
        "back": "incipient"
      },
      {
        "id": "q5",
        "question": "actuel",
        "front": "actuel",
        "back": "present-day"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Figures de Style",
    "slug": "c2-fr-figures-de-style-mc",
    "description": "Reconnaissez les figures de style en français.",
    "targetLanguage": "fr",
    "level": "C2",
    "type": "multiple-choice",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "'Le temps est un fleuve qui coule sans cesse' est un exemple de:",
        "options": [
          "métaphore",
          "onomatopée",
          "hyperbole",
          "euphémisme"
        ],
        "correctAnswer": "métaphore"
      },
      {
        "id": "q2",
        "question": "Dire 'j'ai pleuré des rivières de larmes' est une:",
        "options": [
          "hyperbole",
          "métaphore",
          "ironie",
          "euphémisme"
        ],
        "correctAnswer": "hyperbole"
      },
      {
        "id": "q3",
        "question": "Utiliser 'il nous a quittés' au lieu de 'il est mort' est un:",
        "options": [
          "euphémisme",
          "hyperbole",
          "métaphore",
          "ironie"
        ],
        "correctAnswer": "euphémisme"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Proverbes",
    "slug": "c2-fr-proverbes-gap",
    "description": "Complétez des proverbes populaires en français.",
    "targetLanguage": "fr",
    "level": "C2",
    "type": "fill-gap",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Complétez le proverbe",
        "parts": [
          "Petit à petit, l’oiseau fait son ",
          "."
        ],
        "correctAnswers": [
          "nid"
        ]
      },
      {
        "id": "q2",
        "question": "Complétez le proverbe",
        "parts": [
          "Les actes en disent plus long que les ",
          "."
        ],
        "correctAnswers": [
          "mots"
        ]
      },
      {
        "id": "q3",
        "question": "Complétez le proverbe",
        "parts": [
          "Mieux vaut tard que ",
          "."
        ],
        "correctAnswers": [
          "jamais"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Termes Spécialisés",
    "slug": "c2-fr-termes-specialises-fc",
    "description": "Vocabulaire de linguistique et étymologie.",
    "targetLanguage": "fr",
    "level": "C2",
    "type": "flashcard",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "étymologie",
        "front": "étymologie",
        "back": "etymology"
      },
      {
        "id": "q2",
        "question": "néologisme",
        "front": "néologisme",
        "back": "neologism"
      },
      {
        "id": "q3",
        "question": "sémantique",
        "front": "sémantique",
        "back": "semantics"
      },
      {
        "id": "q4",
        "question": "syntaxe",
        "front": "syntaxe",
        "back": "syntax"
      },
      {
        "id": "q5",
        "question": "morphologie",
        "front": "morphologie",
        "back": "morphology"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Ironie et Satire",
    "slug": "c2-fr-ironie-et-satire-mc",
    "description": "Identifiez l’ironie et la satire dans des textes.",
    "targetLanguage": "fr",
    "level": "C2",
    "type": "multiple-choice",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Un texte qui critique la société avec un humour exagéré est une:",
        "options": [
          "satire",
          "élégie",
          "ode",
          "sonnet"
        ],
        "correctAnswer": "satire"
      },
      {
        "id": "q2",
        "question": "Dire \"quelle belle journée\" pendant une tempête est de l’:",
        "options": [
          "ironie",
          "métaphore",
          "allitération",
          "rime"
        ],
        "correctAnswer": "ironie"
      },
      {
        "id": "q3",
        "question": "Une œuvre qui ridiculise les vices humains s’appelle une:",
        "options": [
          "satire",
          "épopée",
          "poésie lyrique",
          "drame"
        ],
        "correctAnswer": "satire"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Marqueurs de Discours",
    "slug": "c2-fr-marqueurs-de-discours-gap",
    "description": "Pratiquez les marqueurs de discours avancés.",
    "targetLanguage": "fr",
    "level": "C2",
    "type": "fill-gap",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Complétez la phrase",
        "parts": [
          "Cela ",
          " dit, analysons les données."
        ],
        "correctAnswers": [
          "étant"
        ]
      },
      {
        "id": "q2",
        "question": "Complétez la phrase",
        "parts": [
          "En dernière ",
          ", la proposition est solide."
        ],
        "correctAnswers": [
          "analyse"
        ]
      },
      {
        "id": "q3",
        "question": "Complétez la phrase",
        "parts": [
          "",
          " obstant les critiques, le projet a avancé."
        ],
        "correctAnswers": [
          "Nonobstant"
        ]
      }
    ],
    "isPublic": true
  },
  {
    "title": "Expressions Régionales",
    "slug": "c2-fr-expressions-regionales-fc",
    "description": "Expressions régionales et familières en français.",
    "targetLanguage": "fr",
    "level": "C2",
    "type": "flashcard",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "chuis (familier, = je suis)",
        "front": "chuis (familier, = je suis)",
        "back": "I am (informal)"
      },
      {
        "id": "q2",
        "question": "ouais (familier = oui)",
        "front": "ouais (familier = oui)",
        "back": "yeah"
      },
      {
        "id": "q3",
        "question": "bah (interjection)",
        "front": "bah (interjection)",
        "back": "well / oh"
      },
      {
        "id": "q4",
        "question": "chocolatine (régionalisme du Sud-Ouest)",
        "front": "chocolatine (régionalisme du Sud-Ouest)",
        "back": "pain au chocolat"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Compréhension Discursive Avancée",
    "slug": "c2-fr-comprehension-discursive-avancee-mc",
    "description": "Pratiquez les connecteurs et nuances avancées.",
    "targetLanguage": "fr",
    "level": "C2",
    "type": "multiple-choice",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Quel mot remplace le mieux 'cependant' en gardant le sens?",
        "options": [
          "néanmoins",
          "donc",
          "parce que",
          "ainsi"
        ],
        "correctAnswer": "néanmoins"
      },
      {
        "id": "q2",
        "question": "Dans un texte académique, quel connecteur indique une conclusion?",
        "options": [
          "donc",
          "mais",
          "ou",
          "et"
        ],
        "correctAnswer": "donc"
      },
      {
        "id": "q3",
        "question": "Lequel de ces mots est un marqueur d’insistance?",
        "options": [
          "en effet",
          "peut-être",
          "presque",
          "rarement"
        ],
        "correctAnswer": "en effet"
      }
    ],
    "isPublic": true
  },
  {
    "title": "Números e Cores",
    "slug": "a1-pt-numeros-e-cores-gap",
    "description": "Pratique números e cores básicas em português.",
    "targetLanguage": "pt",
    "level": "A1",
    "type": "fill-gap",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "Complete",
        "parts": [
          "Eu tenho ",
          " anos. (3)"
        ],
        "correctAnswers": [
          "três"
        ]
      },
      {
        "id": "q2",
        "question": "Complete",
        "parts": [
          "O céu é ",
          "."
        ],
        "correctAnswers": [
          "azul"
        ]
      },
      {
        "id": "q3",
        "question": "Complete",
        "parts": [
          "A grama é ",
          "."
        ],
        "correctAnswers": [
          "verde"
        ]
      }
    ],
    "isPublic": false
  },
  {
    "title": "Rotina Diária",
    "slug": "a2-pt-rotina-diaria-fc",
    "description": "Vocabulário sobre a rotina do dia a dia.",
    "targetLanguage": "pt",
    "level": "A2",
    "type": "flashcard",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "acordar",
        "front": "acordar",
        "back": "to wake up"
      },
      {
        "id": "q2",
        "question": "tomar café da manhã",
        "front": "tomar café da manhã",
        "back": "to have breakfast"
      },
      {
        "id": "q3",
        "question": "dormir",
        "front": "dormir",
        "back": "to sleep"
      }
    ],
    "isPublic": false
  },
  {
    "title": "Viagens e Turismo",
    "slug": "b1-pt-viagens-e-turismo-mc",
    "description": "Vocabulário útil para viajar por países de língua portuguesa.",
    "targetLanguage": "pt",
    "level": "B1",
    "type": "multiple-choice",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "Onde compro a passagem de ônibus?",
        "options": [
          "Na rodoviária",
          "No hospital",
          "Na padaria",
          "No banco"
        ],
        "correctAnswer": "Na rodoviária"
      },
      {
        "id": "q2",
        "question": "O que significa \"hospedagem\"?",
        "options": [
          "Acomodação",
          "Comida",
          "Transporte",
          "Passaporte"
        ],
        "correctAnswer": "Acomodação"
      },
      {
        "id": "q3",
        "question": "Como se pede a conta no restaurante?",
        "options": [
          "A conta, por favor",
          "Bom dia",
          "Com licença",
          "Desculpa"
        ],
        "correctAnswer": "A conta, por favor"
      }
    ],
    "isPublic": false
  },
  {
    "title": "Conectivos e Conjunções",
    "slug": "b2-pt-conectivos-gap",
    "description": "Pratique conectivos usados para argumentar e conectar ideias.",
    "targetLanguage": "pt",
    "level": "B2",
    "type": "fill-gap",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "Complete",
        "parts": [
          "Estava cansado, ",
          " foi trabalhar assim mesmo."
        ],
        "correctAnswers": [
          "porém"
        ]
      },
      {
        "id": "q2",
        "question": "Complete",
        "parts": [
          "Estudou muito, ",
          ", passou na prova."
        ],
        "correctAnswers": [
          "portanto"
        ]
      },
      {
        "id": "q3",
        "question": "Complete",
        "parts": [
          "Ele chegou tarde ",
          " o trânsito."
        ],
        "correctAnswers": [
          "devido"
        ]
      }
    ],
    "isPublic": false
  },
  {
    "title": "Registro Formal vs Informal",
    "slug": "c1-pt-registro-formal-informal-fc",
    "description": "Diferencie linguagem formal e informal em português.",
    "targetLanguage": "pt",
    "level": "C1",
    "type": "flashcard",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "informal: \"beleza?\"",
        "front": "beleza?",
        "back": "formal: \"como vai?\""
      },
      {
        "id": "q2",
        "question": "informal: \"valeu\"",
        "front": "valeu",
        "back": "formal: \"muito obrigado\""
      },
      {
        "id": "q3",
        "question": "informal: \"tô indo\"",
        "front": "tô indo",
        "back": "formal: \"estou indo\""
      }
    ],
    "isPublic": false
  },
  {
    "title": "Literatura e Cultura",
    "slug": "c2-pt-literatura-e-cultura-mc",
    "description": "Questões avançadas sobre literatura e cultura lusófona.",
    "targetLanguage": "pt",
    "level": "C2",
    "type": "multiple-choice",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Quem escreveu \"Dom Casmurro\"?",
        "options": [
          "Machado de Assis",
          "José Saramago",
          "Fernando Pessoa",
          "Clarice Lispector"
        ],
        "correctAnswer": "Machado de Assis"
      },
      {
        "id": "q2",
        "question": "Qual movimento literário Fernando Pessoa integrou?",
        "options": [
          "Modernismo",
          "Barroco",
          "Arcadismo",
          "Realismo"
        ],
        "correctAnswer": "Modernismo"
      },
      {
        "id": "q3",
        "question": "Clarice Lispector nasceu em qual país?",
        "options": [
          "Ucrânia",
          "Brasil",
          "Portugal",
          "Angola"
        ],
        "correctAnswer": "Ucrânia"
      }
    ],
    "isPublic": false
  },
  {
    "title": "Numbers and Colors",
    "slug": "a1-en-numbers-and-colors-gap",
    "description": "Practice basic numbers and colors in English.",
    "targetLanguage": "en",
    "level": "A1",
    "type": "fill-gap",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "Complete",
        "parts": [
          "I am ",
          " years old. (3)"
        ],
        "correctAnswers": [
          "three"
        ]
      },
      {
        "id": "q2",
        "question": "Complete",
        "parts": [
          "The sky is ",
          "."
        ],
        "correctAnswers": [
          "blue"
        ]
      },
      {
        "id": "q3",
        "question": "Complete",
        "parts": [
          "The grass is ",
          "."
        ],
        "correctAnswers": [
          "green"
        ]
      }
    ],
    "isPublic": false
  },
  {
    "title": "Daily Routine",
    "slug": "a2-en-daily-routine-fc",
    "description": "Vocabulary for everyday routines.",
    "targetLanguage": "en",
    "level": "A2",
    "type": "flashcard",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "to wake up",
        "front": "to wake up",
        "back": "acordar"
      },
      {
        "id": "q2",
        "question": "to have breakfast",
        "front": "to have breakfast",
        "back": "tomar café da manhã"
      },
      {
        "id": "q3",
        "question": "to sleep",
        "front": "to sleep",
        "back": "dormir"
      }
    ],
    "isPublic": false
  },
  {
    "title": "Travel and Tourism",
    "slug": "b1-en-travel-and-tourism-mc",
    "description": "Useful vocabulary for traveling in English-speaking countries.",
    "targetLanguage": "en",
    "level": "B1",
    "type": "multiple-choice",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "Where do you buy a bus ticket?",
        "options": [
          "At the bus station",
          "At the hospital",
          "At the bakery",
          "At the bank"
        ],
        "correctAnswer": "At the bus station"
      },
      {
        "id": "q2",
        "question": "What does \"accommodation\" mean?",
        "options": [
          "A place to stay",
          "Food",
          "Transport",
          "Passport"
        ],
        "correctAnswer": "A place to stay"
      },
      {
        "id": "q3",
        "question": "How do you ask for the bill?",
        "options": [
          "Check, please",
          "Good morning",
          "Excuse me",
          "Sorry"
        ],
        "correctAnswer": "Check, please"
      }
    ],
    "isPublic": false
  },
  {
    "title": "Linking Words",
    "slug": "b2-en-linking-words-gap",
    "description": "Practice connectors used to argue and link ideas.",
    "targetLanguage": "en",
    "level": "B2",
    "type": "fill-gap",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "Complete",
        "parts": [
          "He was tired, ",
          " he went to work anyway."
        ],
        "correctAnswers": [
          "however"
        ]
      },
      {
        "id": "q2",
        "question": "Complete",
        "parts": [
          "She studied hard, ",
          ", she passed the exam."
        ],
        "correctAnswers": [
          "therefore"
        ]
      },
      {
        "id": "q3",
        "question": "Complete",
        "parts": [
          "He arrived late ",
          " the traffic."
        ],
        "correctAnswers": [
          "due"
        ]
      }
    ],
    "isPublic": false
  },
  {
    "title": "Formal vs Informal Register",
    "slug": "c1-en-formal-vs-informal-register-fc",
    "description": "Tell apart formal and informal English expressions.",
    "targetLanguage": "en",
    "level": "C1",
    "type": "flashcard",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "informal: \"what's up?\"",
        "front": "what's up?",
        "back": "formal: \"how are you?\""
      },
      {
        "id": "q2",
        "question": "informal: \"thanks a lot\"",
        "front": "thanks a lot",
        "back": "formal: \"thank you very much\""
      },
      {
        "id": "q3",
        "question": "informal: \"gonna\"",
        "front": "gonna",
        "back": "formal: \"going to\""
      }
    ],
    "isPublic": false
  },
  {
    "title": "Literature and Culture",
    "slug": "c2-en-literature-and-culture-mc",
    "description": "Advanced questions about English-language literature and culture.",
    "targetLanguage": "en",
    "level": "C2",
    "type": "multiple-choice",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Who wrote \"Pride and Prejudice\"?",
        "options": [
          "Jane Austen",
          "Virginia Woolf",
          "Charles Dickens",
          "George Orwell"
        ],
        "correctAnswer": "Jane Austen"
      },
      {
        "id": "q2",
        "question": "Which movement is Virginia Woolf associated with?",
        "options": [
          "Modernism",
          "Romanticism",
          "Victorian realism",
          "Gothic"
        ],
        "correctAnswer": "Modernism"
      },
      {
        "id": "q3",
        "question": "\"1984\" was written by whom?",
        "options": [
          "George Orwell",
          "Aldous Huxley",
          "Ray Bradbury",
          "H.G. Wells"
        ],
        "correctAnswer": "George Orwell"
      }
    ],
    "isPublic": false
  },
  {
    "title": "Nombres et Couleurs",
    "slug": "a1-fr-nombres-et-couleurs-gap",
    "description": "Pratiquez les nombres et couleurs de base en français.",
    "targetLanguage": "fr",
    "level": "A1",
    "type": "fill-gap",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "Complétez",
        "parts": [
          "J'ai ",
          " ans. (3)"
        ],
        "correctAnswers": [
          "trois"
        ]
      },
      {
        "id": "q2",
        "question": "Complétez",
        "parts": [
          "Le ciel est ",
          "."
        ],
        "correctAnswers": [
          "bleu"
        ]
      },
      {
        "id": "q3",
        "question": "Complétez",
        "parts": [
          "L'herbe est ",
          "."
        ],
        "correctAnswers": [
          "verte"
        ]
      }
    ],
    "isPublic": false
  },
  {
    "title": "Routine Quotidienne",
    "slug": "a2-fr-routine-quotidienne-fc",
    "description": "Vocabulaire de la routine quotidienne.",
    "targetLanguage": "fr",
    "level": "A2",
    "type": "flashcard",
    "estimatedMinutes": 4,
    "questions": [
      {
        "id": "q1",
        "question": "se réveiller",
        "front": "se réveiller",
        "back": "to wake up"
      },
      {
        "id": "q2",
        "question": "prendre le petit-déjeuner",
        "front": "prendre le petit-déjeuner",
        "back": "to have breakfast"
      },
      {
        "id": "q3",
        "question": "dormir",
        "front": "dormir",
        "back": "to sleep"
      }
    ],
    "isPublic": false
  },
  {
    "title": "Voyage et Tourisme",
    "slug": "b1-fr-voyage-et-tourisme-mc",
    "description": "Vocabulaire utile pour voyager dans les pays francophones.",
    "targetLanguage": "fr",
    "level": "B1",
    "type": "multiple-choice",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "Où achète-t-on un billet de bus?",
        "options": [
          "À la gare routière",
          "À l'hôpital",
          "À la boulangerie",
          "À la banque"
        ],
        "correctAnswer": "À la gare routière"
      },
      {
        "id": "q2",
        "question": "Que signifie \"hébergement\"?",
        "options": [
          "Logement",
          "Nourriture",
          "Transport",
          "Passeport"
        ],
        "correctAnswer": "Logement"
      },
      {
        "id": "q3",
        "question": "Comment demande-t-on l'addition?",
        "options": [
          "L'addition, s'il vous plaît",
          "Bonjour",
          "Excusez-moi",
          "Pardon"
        ],
        "correctAnswer": "L'addition, s'il vous plaît"
      }
    ],
    "isPublic": false
  },
  {
    "title": "Mots de Liaison",
    "slug": "b2-fr-mots-de-liaison-gap",
    "description": "Pratiquez les connecteurs logiques pour argumenter.",
    "targetLanguage": "fr",
    "level": "B2",
    "type": "fill-gap",
    "estimatedMinutes": 6,
    "questions": [
      {
        "id": "q1",
        "question": "Complétez",
        "parts": [
          "Il était fatigué, ",
          " il est allé travailler quand même."
        ],
        "correctAnswers": [
          "cependant"
        ]
      },
      {
        "id": "q2",
        "question": "Complétez",
        "parts": [
          "Elle a beaucoup étudié, ",
          ", elle a réussi."
        ],
        "correctAnswers": [
          "donc"
        ]
      },
      {
        "id": "q3",
        "question": "Complétez",
        "parts": [
          "Il est arrivé en retard ",
          " à la circulation."
        ],
        "correctAnswers": [
          "dû"
        ]
      }
    ],
    "isPublic": false
  },
  {
    "title": "Registre Formel vs Informel",
    "slug": "c1-fr-registre-formel-informel-fc",
    "description": "Différenciez le langage formel et informel en français.",
    "targetLanguage": "fr",
    "level": "C1",
    "type": "flashcard",
    "estimatedMinutes": 5,
    "questions": [
      {
        "id": "q1",
        "question": "informel: \"ça va?\"",
        "front": "ça va?",
        "back": "formel: \"comment allez-vous?\""
      },
      {
        "id": "q2",
        "question": "informel: \"merci beaucoup\"",
        "front": "merci beaucoup (familier)",
        "back": "formel: \"je vous remercie\""
      },
      {
        "id": "q3",
        "question": "informel: \"je vais\"",
        "front": "j'vais (familier)",
        "back": "formel: \"je vais\""
      }
    ],
    "isPublic": false
  },
  {
    "title": "Littérature et Culture",
    "slug": "c2-fr-litterature-et-culture-mc",
    "description": "Questions avancées sur la littérature et la culture francophone.",
    "targetLanguage": "fr",
    "level": "C2",
    "type": "multiple-choice",
    "estimatedMinutes": 7,
    "questions": [
      {
        "id": "q1",
        "question": "Qui a écrit \"Les Misérables\"?",
        "options": [
          "Victor Hugo",
          "Albert Camus",
          "Molière",
          "Voltaire"
        ],
        "correctAnswer": "Victor Hugo"
      },
      {
        "id": "q2",
        "question": "Quel mouvement est associé à Albert Camus?",
        "options": [
          "Existentialisme",
          "Romantisme",
          "Classicisme",
          "Symbolisme"
        ],
        "correctAnswer": "Existentialisme"
      },
      {
        "id": "q3",
        "question": "Molière était principalement un auteur de quoi?",
        "options": [
          "Théâtre",
          "Poésie épique",
          "Romans policiers",
          "Essais scientifiques"
        ],
        "correctAnswer": "Théâtre"
      }
    ],
    "isPublic": false
  }
];
