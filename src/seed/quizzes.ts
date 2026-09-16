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
  }
];
