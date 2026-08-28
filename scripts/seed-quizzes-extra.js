'use strict';

// Extra public quizzes to reach 10 quizzes per (level, targetLanguage) in dev.
// Combined with scripts/seed-quizzes.js: existing seed already has 2 per (level, lang)
// (1 public + 1 private). This file adds 8 new public quizzes per (level, lang) = 144 total.
// Same schema as seed-quizzes.js entries. Loaded and upserted by seed-quizzes.js.

function mc(base, minutes, questions) {
  return {
    ...base,
    type: 'multiple-choice',
    estimatedMinutes: minutes,
    questions: questions.map(([q, options, correctAnswer], i) => ({
      id: `q${i + 1}`,
      question: q,
      options,
      correctAnswer,
    })),
  };
}

function gap(base, minutes, questions) {
  return {
    ...base,
    type: 'fill-gap',
    estimatedMinutes: minutes,
    questions: questions.map(([q, before, after, answer], i) => ({
      id: `q${i + 1}`,
      question: q,
      parts: [before, after],
      correctAnswers: [answer],
    })),
  };
}

function fc(base, minutes, pairs) {
  return {
    ...base,
    type: 'flashcard',
    estimatedMinutes: minutes,
    questions: pairs.map(([front, back], i) => ({
      id: `q${i + 1}`,
      question: front,
      front,
      back,
    })),
  };
}

const extraPublicQuizzes = [
  // ================= A1 =================
  fc(
    { title: 'Família', slug: 'a1-pt-familia-fc', description: 'Aprenda os nomes dos membros da família.', targetLanguage: 'pt', level: 'A1' },
    3,
    [['pai', 'father'], ['mãe', 'mother'], ['irmão', 'brother'], ['irmã', 'sister'], ['avó', 'grandmother']]
  ),
  mc(
    { title: 'Dias da Semana', slug: 'a1-pt-dias-da-semana-mc', description: 'Pratique os dias da semana em português.', targetLanguage: 'pt', level: 'A1' },
    3,
    [
      ['Que dia vem depois de segunda-feira?', ['terça-feira', 'quarta-feira', 'domingo', 'sábado'], 'terça-feira'],
      ['Qual é o primeiro dia da semana no calendário brasileiro?', ['domingo', 'segunda-feira', 'sábado', 'sexta-feira'], 'domingo'],
      ["Como se diz 'Friday' em português?", ['sexta-feira', 'quinta-feira', 'sábado', 'domingo'], 'sexta-feira'],
    ]
  ),
  gap(
    { title: 'Comida e Bebida', slug: 'a1-pt-comida-e-bebida-gap', description: 'Complete frases simples sobre comida e bebida.', targetLanguage: 'pt', level: 'A1' },
    3,
    [
      ['Complete a frase', 'Eu quero um copo de ', '.', 'água'],
      ['Complete a frase', 'No café da manhã eu bebo ', '.', 'café'],
      ['Complete a frase', 'Vou comer um sanduíche de ', '.', 'queijo'],
    ]
  ),
  fc(
    { title: 'Objetos da Sala de Aula', slug: 'a1-pt-objetos-sala-aula-fc', description: 'Vocabulário de objetos usados na escola.', targetLanguage: 'pt', level: 'A1' },
    3,
    [['caderno', 'notebook'], ['lápis', 'pencil'], ['mochila', 'backpack'], ['quadro', 'board'], ['borracha', 'eraser']]
  ),
  mc(
    { title: 'Números 11-20', slug: 'a1-pt-numeros-11-20-mc', description: 'Pratique números de 11 a 20 em português.', targetLanguage: 'pt', level: 'A1' },
    3,
    [
      ['Como se escreve o número 15?', ['quinze', 'treze', 'dezesseis', 'doze'], 'quinze'],
      ["Quanto é 'onze mais um'?", ['doze', 'treze', 'onze', 'dez'], 'doze'],
      ['Como se diz 20 em português?', ['vinte', 'dez', 'doze', 'quinze'], 'vinte'],
    ]
  ),
  gap(
    { title: 'Clima', slug: 'a1-pt-clima-gap', description: 'Vocabulário básico sobre o clima.', targetLanguage: 'pt', level: 'A1' },
    3,
    [
      ['Complete a frase', 'Hoje está muito ', ' lá fora.', 'frio'],
      ['Complete a frase', 'Está chovendo, leve um ', '.', 'guarda-chuva'],
      ['Complete a frase', 'No verão o tempo fica ', '.', 'quente'],
    ]
  ),
  fc(
    { title: 'Animais', slug: 'a1-pt-animais-fc', description: 'Vocabulário de animais comuns.', targetLanguage: 'pt', level: 'A1' },
    3,
    [['cachorro', 'dog'], ['gato', 'cat'], ['pássaro', 'bird'], ['peixe', 'fish'], ['cavalo', 'horse']]
  ),
  mc(
    { title: 'Roupas', slug: 'a1-pt-roupas-mc', description: 'Vocabulário sobre peças de roupa.', targetLanguage: 'pt', level: 'A1' },
    3,
    [
      ['Qual dessas é uma peça de roupa para os pés?', ['sapato', 'camisa', 'chapéu', 'cinto'], 'sapato'],
      ["Como se diz 'jacket' em português?", ['jaqueta', 'calça', 'vestido', 'meia'], 'jaqueta'],
      ['O que você usa na cabeça quando está sol?', ['chapéu', 'sapato', 'luva', 'cinto'], 'chapéu'],
    ]
  ),

  fc(
    { title: 'Family', slug: 'a1-en-family-fc', description: 'Learn family member names in English.', targetLanguage: 'en', level: 'A1' },
    3,
    [['father', 'pai'], ['mother', 'mãe'], ['brother', 'irmão'], ['sister', 'irmã'], ['grandmother', 'avó']]
  ),
  mc(
    { title: 'Days of the Week', slug: 'a1-en-days-of-the-week-mc', description: 'Practice the days of the week in English.', targetLanguage: 'en', level: 'A1' },
    3,
    [
      ['What day comes after Monday?', ['Tuesday', 'Wednesday', 'Sunday', 'Saturday'], 'Tuesday'],
      ['Which day is the last day of the work week (Mon-Fri)?', ['Friday', 'Sunday', 'Wednesday', 'Saturday'], 'Friday'],
      ["How do you say 'sexta-feira' in English?", ['Friday', 'Thursday', 'Saturday', 'Sunday'], 'Friday'],
    ]
  ),
  gap(
    { title: 'Food and Drink', slug: 'a1-en-food-and-drink-gap', description: 'Complete simple sentences about food and drink.', targetLanguage: 'en', level: 'A1' },
    3,
    [
      ['Complete the sentence', 'I want a glass of ', '.', 'water'],
      ['Complete the sentence', 'For breakfast I drink ', '.', 'coffee'],
      ['Complete the sentence', 'I will eat a cheese ', '.', 'sandwich'],
    ]
  ),
  fc(
    { title: 'Classroom Objects', slug: 'a1-en-classroom-objects-fc', description: 'Vocabulary for objects used at school.', targetLanguage: 'en', level: 'A1' },
    3,
    [['notebook', 'caderno'], ['pencil', 'lápis'], ['backpack', 'mochila'], ['board', 'quadro'], ['eraser', 'borracha']]
  ),
  mc(
    { title: 'Numbers 11-20', slug: 'a1-en-numbers-11-20-mc', description: 'Practice numbers 11 to 20 in English.', targetLanguage: 'en', level: 'A1' },
    3,
    [
      ['How do you write the number 15?', ['fifteen', 'thirteen', 'sixteen', 'twelve'], 'fifteen'],
      ["What is 'eleven plus one'?", ['twelve', 'thirteen', 'eleven', 'ten'], 'twelve'],
      ['How do you say 20 in English?', ['twenty', 'ten', 'twelve', 'fifteen'], 'twenty'],
    ]
  ),
  gap(
    { title: 'Weather', slug: 'a1-en-weather-gap', description: 'Basic vocabulary about the weather.', targetLanguage: 'en', level: 'A1' },
    3,
    [
      ['Complete the sentence', "It's very ", ' outside today.', 'cold'],
      ['Complete the sentence', "It's raining, take an ", '.', 'umbrella'],
      ['Complete the sentence', 'In summer the weather gets ', '.', 'hot'],
    ]
  ),
  fc(
    { title: 'Animals', slug: 'a1-en-animals-fc', description: 'Vocabulary for common animals.', targetLanguage: 'en', level: 'A1' },
    3,
    [['dog', 'cachorro'], ['cat', 'gato'], ['bird', 'pássaro'], ['fish', 'peixe'], ['horse', 'cavalo']]
  ),
  mc(
    { title: 'Clothing', slug: 'a1-en-clothing-mc', description: 'Vocabulary about clothing items.', targetLanguage: 'en', level: 'A1' },
    3,
    [
      ['Which of these is worn on your feet?', ['shoes', 'shirt', 'hat', 'belt'], 'shoes'],
      ["How do you say 'jaqueta' in English?", ['jacket', 'pants', 'dress', 'sock'], 'jacket'],
      ['What do you wear on your head in the sun?', ['hat', 'shoes', 'glove', 'belt'], 'hat'],
    ]
  ),

  fc(
    { title: 'La Famille', slug: 'a1-fr-la-famille-fc', description: 'Apprenez les membres de la famille en français.', targetLanguage: 'fr', level: 'A1' },
    3,
    [['père', 'father'], ['mère', 'mother'], ['frère', 'brother'], ['sœur', 'sister'], ['grand-mère', 'grandmother']]
  ),
  mc(
    { title: 'Les Jours de la Semaine', slug: 'a1-fr-les-jours-de-la-semaine-mc', description: 'Pratiquez les jours de la semaine en français.', targetLanguage: 'fr', level: 'A1' },
    3,
    [
      ['Quel jour vient après lundi?', ['mardi', 'mercredi', 'dimanche', 'samedi'], 'mardi'],
      ['Quel est le premier jour de la semaine en France?', ['lundi', 'dimanche', 'samedi', 'vendredi'], 'lundi'],
      ["Comment dit-on 'Friday' en français?", ['vendredi', 'jeudi', 'samedi', 'dimanche'], 'vendredi'],
    ]
  ),
  gap(
    { title: 'Nourriture et Boissons', slug: 'a1-fr-nourriture-et-boissons-gap', description: 'Complétez des phrases simples sur la nourriture.', targetLanguage: 'fr', level: 'A1' },
    3,
    [
      ['Complétez la phrase', "Je veux un verre d'", 'eau.', 'eau'],
      ['Complétez la phrase', 'Au petit-déjeuner je bois du ', '.', 'café'],
      ['Complétez la phrase', 'Je vais manger un sandwich au ', '.', 'fromage'],
    ]
  ),
  fc(
    { title: 'Objets de Classe', slug: 'a1-fr-objets-de-classe-fc', description: "Vocabulaire des objets utilisés à l'école.", targetLanguage: 'fr', level: 'A1' },
    3,
    [['cahier', 'notebook'], ['crayon', 'pencil'], ['sac à dos', 'backpack'], ['tableau', 'board'], ['gomme', 'eraser']]
  ),
  mc(
    { title: 'Nombres 11-20', slug: 'a1-fr-nombres-11-20-mc', description: 'Pratiquez les nombres de 11 à 20 en français.', targetLanguage: 'fr', level: 'A1' },
    3,
    [
      ['Comment écrit-on le nombre 15?', ['quinze', 'treize', 'seize', 'douze'], 'quinze'],
      ["Que vaut 'onze plus un'?", ['douze', 'treize', 'onze', 'dix'], 'douze'],
      ['Comment dit-on 20 en français?', ['vingt', 'dix', 'douze', 'quinze'], 'vingt'],
    ]
  ),
  gap(
    { title: 'Le Temps (météo)', slug: 'a1-fr-le-temps-meteo-gap', description: 'Vocabulaire de base sur la météo.', targetLanguage: 'fr', level: 'A1' },
    3,
    [
      ['Complétez la phrase', 'Il fait très ', ' dehors aujourd’hui.', 'froid'],
      ['Complétez la phrase', 'Il pleut, prends un ', '.', 'parapluie'],
      ['Complétez la phrase', 'En été, il fait ', '.', 'chaud'],
    ]
  ),
  fc(
    { title: 'Animaux', slug: 'a1-fr-animaux-fc', description: 'Vocabulaire des animaux courants.', targetLanguage: 'fr', level: 'A1' },
    3,
    [['chien', 'dog'], ['chat', 'cat'], ['oiseau', 'bird'], ['poisson', 'fish'], ['cheval', 'horse']]
  ),
  mc(
    { title: 'Vêtements', slug: 'a1-fr-vetements-mc', description: 'Vocabulaire sur les vêtements.', targetLanguage: 'fr', level: 'A1' },
    3,
    [
      ['Lequel de ces mots désigne un vêtement pour les pieds?', ['chaussures', 'chemise', 'chapeau', 'ceinture'], 'chaussures'],
      ["Comment dit-on 'jacket' en français?", ['veste', 'pantalon', 'robe', 'chaussette'], 'veste'],
      ['Que porte-t-on sur la tête au soleil?', ['chapeau', 'chaussures', 'gant', 'ceinture'], 'chapeau'],
    ]
  ),

  // ================= A2 =================
  fc(
    { title: 'Passatempos', slug: 'a2-pt-passatempos-fc', description: 'Vocabulário sobre hobbies e passatempos.', targetLanguage: 'pt', level: 'A2' },
    4,
    [['ler', 'to read'], ['nadar', 'to swim'], ['cozinhar', 'to cook'], ['cantar', 'to sing'], ['dançar', 'to dance']]
  ),
  mc(
    { title: 'Passado Simples', slug: 'a2-pt-passado-simples-mc', description: 'Pratique verbos regulares no passado.', targetLanguage: 'pt', level: 'A2' },
    4,
    [
      ['Ontem eu ___ (trabalhar) até tarde.', ['trabalhei', 'trabalho', 'trabalhava', 'trabalhando'], 'trabalhei'],
      ['Ela ___ (falar) com o professor.', ['falou', 'fala', 'falava', 'falando'], 'falou'],
      ['Nós ___ (estudar) para a prova.', ['estudamos', 'estudávamos', 'estudaremos', 'estudando'], 'estudamos'],
    ]
  ),
  gap(
    { title: 'Direções', slug: 'a2-pt-direcoes-gap', description: 'Pratique vocabulário para dar e pedir direções.', targetLanguage: 'pt', level: 'A2' },
    4,
    [
      ['Complete a frase', 'Vire à ', ' na próxima rua.', 'direita'],
      ['Complete a frase', 'O banco fica ', ' do mercado.', 'perto'],
      ['Complete a frase', 'Siga ', ' até o semáforo.', 'reto'],
    ]
  ),
  fc(
    { title: 'Cômodos da Casa', slug: 'a2-pt-comodos-da-casa-fc', description: 'Vocabulário sobre os cômodos de uma casa.', targetLanguage: 'pt', level: 'A2' },
    4,
    [['cozinha', 'kitchen'], ['quarto', 'bedroom'], ['banheiro', 'bathroom'], ['sala', 'living room'], ['jardim', 'garden']]
  ),
  mc(
    { title: 'Comparativos', slug: 'a2-pt-comparativos-mc', description: 'Pratique adjetivos comparativos.', targetLanguage: 'pt', level: 'A2' },
    4,
    [
      ['Este carro é ___ (rápido) do que aquele.', ['mais rápido', 'rápido', 'mais rápida', 'rapidez'], 'mais rápido'],
      ['Ela é ___ (alto) da turma.', ['a mais alta', 'mais alta', 'alta', 'altura'], 'a mais alta'],
      ['Meu irmão é ___ (velho) do que eu.', ['mais velho', 'velho', 'mais velha', 'velhice'], 'mais velho'],
    ]
  ),
  gap(
    { title: 'Expressões de Tempo', slug: 'a2-pt-expressoes-de-tempo-gap', description: 'Pratique expressões relacionadas a tempo e horário.', targetLanguage: 'pt', level: 'A2' },
    4,
    [
      ['Complete a frase', 'Eu acordo ', ' das sete horas.', 'antes'],
      ['Complete a frase', 'Nos vemos na semana ', '.', 'próxima'],
      ['Complete a frase', 'Ele sempre chega na ', '.', 'hora'],
    ]
  ),
  fc(
    { title: 'Partes do Corpo', slug: 'a2-pt-partes-do-corpo-fc', description: 'Vocabulário sobre partes do corpo.', targetLanguage: 'pt', level: 'A2' },
    4,
    [['cabeça', 'head'], ['mão', 'hand'], ['perna', 'leg'], ['olho', 'eye'], ['coração', 'heart']]
  ),
  mc(
    { title: 'Advérbios de Frequência', slug: 'a2-pt-adverbios-de-frequencia-mc', description: 'Pratique advérbios de frequência na rotina diária.', targetLanguage: 'pt', level: 'A2' },
    4,
    [
      ['Eu ___ (always) como fora de casa.', ['sempre', 'nunca', 'às vezes', 'raramente'], 'sempre'],
      ['Ela ___ (never) chega atrasada.', ['nunca', 'sempre', 'às vezes', 'raramente'], 'nunca'],
      ['Nós ___ (sometimes) saímos à noite.', ['às vezes', 'sempre', 'nunca', 'raramente'], 'às vezes'],
    ]
  ),

  fc(
    { title: 'Hobbies', slug: 'a2-en-hobbies-fc', description: 'Vocabulary about hobbies and pastimes.', targetLanguage: 'en', level: 'A2' },
    4,
    [['to read', 'ler'], ['to swim', 'nadar'], ['to cook', 'cozinhar'], ['to sing', 'cantar'], ['to dance', 'dançar']]
  ),
  mc(
    { title: 'Simple Past', slug: 'a2-en-simple-past-mc', description: 'Practice regular verbs in the simple past.', targetLanguage: 'en', level: 'A2' },
    4,
    [
      ['Yesterday I ___ (work) late.', ['worked', 'work', 'working', 'works'], 'worked'],
      ['She ___ (talk) to the teacher.', ['talked', 'talks', 'talking', 'talk'], 'talked'],
      ['We ___ (study) for the test.', ['studied', 'study', 'studying', 'studies'], 'studied'],
    ]
  ),
  gap(
    { title: 'Directions', slug: 'a2-en-directions-gap', description: 'Practice vocabulary for giving and asking directions.', targetLanguage: 'en', level: 'A2' },
    4,
    [
      ['Complete the sentence', 'Turn ', ' at the next street.', 'right'],
      ['Complete the sentence', 'The bank is ', ' the market.', 'near'],
      ['Complete the sentence', 'Go ', ' until the traffic light.', 'straight'],
    ]
  ),
  fc(
    { title: 'Rooms in the House', slug: 'a2-en-rooms-in-the-house-fc', description: 'Vocabulary for rooms in a house.', targetLanguage: 'en', level: 'A2' },
    4,
    [['kitchen', 'cozinha'], ['bedroom', 'quarto'], ['bathroom', 'banheiro'], ['living room', 'sala'], ['garden', 'jardim']]
  ),
  mc(
    { title: 'Comparatives', slug: 'a2-en-comparatives-mc', description: 'Practice comparative adjectives.', targetLanguage: 'en', level: 'A2' },
    4,
    [
      ['This car is ___ (fast) than that one.', ['faster', 'fast', 'fastest', 'fastly'], 'faster'],
      ['She is ___ (tall) in the class.', ['the tallest', 'taller', 'tall', 'tallness'], 'the tallest'],
      ['My brother is ___ (old) than me.', ['older', 'old', 'oldest', 'age'], 'older'],
    ]
  ),
  gap(
    { title: 'Time Expressions', slug: 'a2-en-time-expressions-gap', description: 'Practice expressions related to time.', targetLanguage: 'en', level: 'A2' },
    4,
    [
      ['Complete the sentence', 'I wake up ', ' seven o’clock.', 'before'],
      ['Complete the sentence', 'See you next ', '.', 'week'],
      ['Complete the sentence', 'He always arrives on ', '.', 'time'],
    ]
  ),
  fc(
    { title: 'Body Parts', slug: 'a2-en-body-parts-fc', description: 'Vocabulary for parts of the body.', targetLanguage: 'en', level: 'A2' },
    4,
    [['head', 'cabeça'], ['hand', 'mão'], ['leg', 'perna'], ['eye', 'olho'], ['heart', 'coração']]
  ),
  mc(
    { title: 'Adverbs of Frequency', slug: 'a2-en-adverbs-of-frequency-mc', description: 'Practice adverbs of frequency in daily routine.', targetLanguage: 'en', level: 'A2' },
    4,
    [
      ['I ___ (always) eat out.', ['always', 'never', 'sometimes', 'rarely'], 'always'],
      ['She ___ (never) arrives late.', ['never', 'always', 'sometimes', 'rarely'], 'never'],
      ['We ___ (sometimes) go out at night.', ['sometimes', 'always', 'never', 'rarely'], 'sometimes'],
    ]
  ),

  fc(
    { title: 'Loisirs', slug: 'a2-fr-loisirs-fc', description: 'Vocabulaire sur les loisirs.', targetLanguage: 'fr', level: 'A2' },
    4,
    [['lire', 'to read'], ['nager', 'to swim'], ['cuisiner', 'to cook'], ['chanter', 'to sing'], ['danser', 'to dance']]
  ),
  mc(
    { title: 'Passé Composé', slug: 'a2-fr-passe-compose-mc', description: 'Pratiquez les verbes réguliers au passé composé.', targetLanguage: 'fr', level: 'A2' },
    4,
    [
      ["Hier j'___ (travailler) tard.", ['ai travaillé', 'travaille', 'travaillais', 'travaillant'], 'ai travaillé'],
      ['Elle a ___ (parler) au professeur.', ['parlé', 'parle', 'parlait', 'parlant'], 'parlé'],
      ["Nous avons ___ (étudier) pour l'examen.", ['étudié', 'étudions', 'étudiions', 'étudiant'], 'étudié'],
    ]
  ),
  gap(
    { title: 'Directions', slug: 'a2-fr-directions-gap', description: 'Pratiquez le vocabulaire pour donner des directions.', targetLanguage: 'fr', level: 'A2' },
    4,
    [
      ['Complétez la phrase', 'Tournez à ', ' à la prochaine rue.', 'droite'],
      ['Complétez la phrase', 'La banque est ', ' du marché.', 'près'],
      ['Complétez la phrase', 'Continuez tout ', " jusqu'au feu.", 'droit'],
    ]
  ),
  fc(
    { title: 'Les Pièces de la Maison', slug: 'a2-fr-les-pieces-de-la-maison-fc', description: 'Vocabulaire des pièces de la maison.', targetLanguage: 'fr', level: 'A2' },
    4,
    [['cuisine', 'kitchen'], ['chambre', 'bedroom'], ['salle de bain', 'bathroom'], ['salon', 'living room'], ['jardin', 'garden']]
  ),
  mc(
    { title: 'Les Comparatifs', slug: 'a2-fr-les-comparatifs-mc', description: 'Pratiquez les adjectifs comparatifs.', targetLanguage: 'fr', level: 'A2' },
    4,
    [
      ['Cette voiture est ___ (rapide) que celle-là.', ['plus rapide', 'rapide', 'plus rapides', 'rapidité'], 'plus rapide'],
      ['Elle est ___ (grand) de la classe.', ['la plus grande', 'plus grande', 'grande', 'grandeur'], 'la plus grande'],
      ['Mon frère est ___ (vieux) que moi.', ['plus âgé', 'âgé', 'plus âgée', 'âge'], 'plus âgé'],
    ]
  ),
  gap(
    { title: 'Expressions de Temps', slug: 'a2-fr-expressions-de-temps-gap', description: 'Pratiquez les expressions liées au temps.', targetLanguage: 'fr', level: 'A2' },
    4,
    [
      ['Complétez la phrase', 'Je me réveille ', ' sept heures.', 'avant'],
      ['Complétez la phrase', 'On se voit la semaine ', '.', 'prochaine'],
      ['Complétez la phrase', "Il arrive toujours à l'", '.', 'heure'],
    ]
  ),
  fc(
    { title: 'Parties du Corps', slug: 'a2-fr-parties-du-corps-fc', description: 'Vocabulaire des parties du corps.', targetLanguage: 'fr', level: 'A2' },
    4,
    [['tête', 'head'], ['main', 'hand'], ['jambe', 'leg'], ['œil', 'eye'], ['cœur', 'heart']]
  ),
  mc(
    { title: "Adverbes de Fréquence", slug: 'a2-fr-adverbes-de-frequence-mc', description: 'Pratiquez les adverbes de fréquence.', targetLanguage: 'fr', level: 'A2' },
    4,
    [
      ['Je ___ (always) mange dehors.', ['toujours', 'jamais', 'parfois', 'rarement'], 'toujours'],
      ["Elle n'arrive ___ (never) en retard.", ['jamais', 'toujours', 'parfois', 'rarement'], 'jamais'],
      ['Nous sortons ___ (sometimes) le soir.', ['parfois', 'toujours', 'jamais', 'rarement'], 'parfois'],
    ]
  ),

  // ================= B1 =================
  fc(
    { title: 'Vocabulário de Trabalho', slug: 'b1-pt-vocabulario-de-trabalho-fc', description: 'Vocabulário útil no ambiente de trabalho.', targetLanguage: 'pt', level: 'B1' },
    5,
    [['currículo', 'resume'], ['entrevista', 'interview'], ['salário', 'salary'], ['chefe', 'boss'], ['prazo', 'deadline']]
  ),
  mc(
    { title: 'Verbos Modais: Dever', slug: 'b1-pt-verbos-modais-dever-mc', description: 'Pratique os verbos modais dever/ir no futuro.', targetLanguage: 'pt', level: 'B1' },
    5,
    [
      ['Você ___ estudar mais para passar.', ['deve', 'deveu', 'devia', 'devendo'], 'deve'],
      ['Nós ___ (will) viajar amanhã.', ['vamos', 'fomos', 'íamos', 'indo'], 'vamos'],
      ['Ele ___ (should) pedir desculpas.', ['deveria', 'deve ter', 'devia', 'devendo'], 'deveria'],
    ]
  ),
  gap(
    { title: 'Saúde e Sintomas', slug: 'b1-pt-saude-e-sintomas-gap', description: 'Vocabulário sobre saúde e sintomas.', targetLanguage: 'pt', level: 'B1' },
    5,
    [
      ['Complete a frase', 'Estou com ', ' de cabeça.', 'dor'],
      ['Complete a frase', 'Preciso tomar um ', ' para a febre.', 'remédio'],
      ['Complete a frase', 'Marquei uma consulta com o ', '.', 'médico'],
    ]
  ),
  fc(
    { title: 'Tecnologia', slug: 'b1-pt-tecnologia-fc', description: 'Vocabulário sobre tecnologia e dispositivos.', targetLanguage: 'pt', level: 'B1' },
    5,
    [['tela', 'screen'], ['senha', 'password'], ['aplicativo', 'app'], ['teclado', 'keyboard'], ['nuvem', 'cloud']]
  ),
  mc(
    { title: 'Ligações Telefônicas', slug: 'b1-pt-ligacoes-telefonicas-mc', description: 'Frases úteis para ligações telefônicas.', targetLanguage: 'pt', level: 'B1' },
    5,
    [
      ['Como se diz para pedir para esperar na linha?', ['Um momento, por favor', 'Tchau', 'Obrigado', 'Desculpa'], 'Um momento, por favor'],
      ['Qual frase usamos para dizer que a pessoa não está?', ['Ele não está no momento', 'Muito obrigado', 'Bom dia', 'Com licença'], 'Ele não está no momento'],
      ['Como perguntar quem está falando?', ['Quem fala?', 'Onde você está?', 'Que horas são?', 'Como vai?'], 'Quem fala?'],
    ]
  ),
  gap(
    { title: 'Meio Ambiente', slug: 'b1-pt-meio-ambiente-gap', description: 'Vocabulário sobre meio ambiente e sustentabilidade.', targetLanguage: 'pt', level: 'B1' },
    5,
    [
      ['Complete a frase', 'Devemos reciclar o ', ' para proteger o planeta.', 'lixo'],
      ['Complete a frase', 'A ', ' está aumentando por causa da poluição.', 'temperatura'],
      ['Complete a frase', 'Precisamos economizar ', '.', 'água'],
    ]
  ),
  fc(
    { title: 'Emoções', slug: 'b1-pt-emocoes-fc', description: 'Vocabulário sobre emoções e sentimentos.', targetLanguage: 'pt', level: 'B1' },
    5,
    [['feliz', 'happy'], ['triste', 'sad'], ['ansioso', 'anxious'], ['animado', 'excited'], ['com raiva', 'angry']]
  ),
  mc(
    { title: 'Verbos Modais: Poder', slug: 'b1-pt-verbos-modais-poder-mc', description: 'Pratique os verbos modais poder/conseguir.', targetLanguage: 'pt', level: 'B1' },
    5,
    [
      ['___ eu usar seu telefone?', ['Posso', 'Devo', 'Vou', 'Vim'], 'Posso'],
      ['Quando criança, eu ___ nadar muito bem.', ['conseguia', 'posso', 'devo', 'vou'], 'conseguia'],
      ['___ eu fazer uma pergunta?', ['Poderia', 'Devo', 'Vou', 'Sou'], 'Poderia'],
    ]
  ),

  fc(
    { title: 'Work Vocabulary', slug: 'b1-en-work-vocabulary-fc', description: 'Useful vocabulary for the workplace.', targetLanguage: 'en', level: 'B1' },
    5,
    [['resume', 'currículo'], ['interview', 'entrevista'], ['salary', 'salário'], ['boss', 'chefe'], ['deadline', 'prazo']]
  ),
  mc(
    { title: 'Modal Verbs: Should', slug: 'b1-en-modal-verbs-should-mc', description: 'Practice modal verbs should/will.', targetLanguage: 'en', level: 'B1' },
    5,
    [
      ['You ___ (should) study more to pass.', ['should', 'must', 'will', 'shall'], 'should'],
      ['We ___ (will) travel tomorrow.', ['will', 'would', 'are', 'were'], 'will'],
      ['He ___ (should) apologize.', ['should', 'must', 'shall', 'would'], 'should'],
    ]
  ),
  gap(
    { title: 'Health and Symptoms', slug: 'b1-en-health-and-symptoms-gap', description: 'Vocabulary about health and symptoms.', targetLanguage: 'en', level: 'B1' },
    5,
    [
      ['Complete the sentence', 'I have a ', '.', 'headache'],
      ['Complete the sentence', 'I need to take ', ' for the fever.', 'medicine'],
      ['Complete the sentence', 'I booked an appointment with the ', '.', 'doctor'],
    ]
  ),
  fc(
    { title: 'Technology', slug: 'b1-en-technology-fc', description: 'Vocabulary about technology and devices.', targetLanguage: 'en', level: 'B1' },
    5,
    [['screen', 'tela'], ['password', 'senha'], ['app', 'aplicativo'], ['keyboard', 'teclado'], ['cloud', 'nuvem']]
  ),
  mc(
    { title: 'Phone Calls', slug: 'b1-en-phone-calls-mc', description: 'Useful phrases for phone calls.', targetLanguage: 'en', level: 'B1' },
    5,
    [
      ['How do you ask someone to hold the line?', ['One moment please', 'Goodbye', 'Thank you', 'Sorry'], 'One moment please'],
      ['Which phrase says the person is not available?', ['He’s not available right now', 'Nice to meet you', 'Good morning', 'Excuse me'], 'He’s not available right now'],
      ['How do you ask who is calling?', ['Who’s calling?', 'Where are you?', 'What time is it?', 'How are you?'], 'Who’s calling?'],
    ]
  ),
  gap(
    { title: 'Environment', slug: 'b1-en-environment-gap', description: 'Vocabulary about the environment and sustainability.', targetLanguage: 'en', level: 'B1' },
    5,
    [
      ['Complete the sentence', 'We should recycle ', ' to protect the planet.', 'trash'],
      ['Complete the sentence', 'The ', ' is rising because of pollution.', 'temperature'],
      ['Complete the sentence', 'We need to save ', '.', 'water'],
    ]
  ),
  fc(
    { title: 'Emotions', slug: 'b1-en-emotions-fc', description: 'Vocabulary about emotions and feelings.', targetLanguage: 'en', level: 'B1' },
    5,
    [['happy', 'feliz'], ['sad', 'triste'], ['anxious', 'ansioso'], ['excited', 'animado'], ['angry', 'com raiva']]
  ),
  mc(
    { title: 'Modal Verbs: Can/Could', slug: 'b1-en-modal-verbs-can-could-mc', description: 'Practice modal verbs can/could.', targetLanguage: 'en', level: 'B1' },
    5,
    [
      ['___ I use your phone?', ['Can', 'Must', 'Will', 'Am'], 'Can'],
      ['As a child, I ___ swim very well.', ['could', 'can', 'must', 'will'], 'could'],
      ['___ I ask a question?', ['Could', 'Must', 'Will', 'Am'], 'Could'],
    ]
  ),

  fc(
    { title: 'Vocabulaire du Travail', slug: 'b1-fr-vocabulaire-du-travail-fc', description: "Vocabulaire utile pour le monde du travail.", targetLanguage: 'fr', level: 'B1' },
    5,
    [['CV', 'resume'], ['entretien', 'interview'], ['salaire', 'salary'], ['patron', 'boss'], ['délai', 'deadline']]
  ),
  mc(
    { title: 'Verbes Modaux: Devoir', slug: 'b1-fr-verbes-modaux-devoir-mc', description: 'Pratiquez les verbes modaux devoir/aller.', targetLanguage: 'fr', level: 'B1' },
    5,
    [
      ['Tu ___ (should) étudier plus pour réussir.', ['devrais', 'dois', 'devais', 'devant'], 'devrais'],
      ['Nous ___ (will) voyager demain.', ['allons', 'irons', 'allions', 'irait'], 'irons'],
      ["Il ___ (should) s'excuser.", ['devrait', 'doit', 'devait', 'devant'], 'devrait'],
    ]
  ),
  gap(
    { title: 'Santé et Symptômes', slug: 'b1-fr-sante-et-symptomes-gap', description: 'Vocabulaire sur la santé et les symptômes.', targetLanguage: 'fr', level: 'B1' },
    5,
    [
      ['Complétez la phrase', "J'ai mal à la ", '.', 'tête'],
      ['Complétez la phrase', 'Je dois prendre un ', ' pour la fièvre.', 'médicament'],
      ['Complétez la phrase', 'J’ai pris rendez-vous chez le ', '.', 'médecin'],
    ]
  ),
  fc(
    { title: 'Technologie', slug: 'b1-fr-technologie-fc', description: 'Vocabulaire sur la technologie et les appareils.', targetLanguage: 'fr', level: 'B1' },
    5,
    [['écran', 'screen'], ['mot de passe', 'password'], ['application', 'app'], ['clavier', 'keyboard'], ['nuage', 'cloud']]
  ),
  mc(
    { title: 'Appels Téléphoniques', slug: 'b1-fr-appels-telephoniques-mc', description: 'Expressions utiles pour les appels téléphoniques.', targetLanguage: 'fr', level: 'B1' },
    5,
    [
      ['Comment demande-t-on de patienter?', ['Un instant s’il vous plaît', 'Au revoir', 'Merci', 'Pardon'], 'Un instant s’il vous plaît'],
      ['Quelle phrase dit que la personne est absente?', ['Il n’est pas disponible pour le moment', 'Enchanté', 'Bonjour', 'Excusez-moi'], 'Il n’est pas disponible pour le moment'],
      ['Comment demande-t-on qui appelle?', ['Qui est à l’appareil?', 'Où êtes-vous?', 'Quelle heure est-il?', 'Comment allez-vous?'], 'Qui est à l’appareil?'],
    ]
  ),
  gap(
    { title: 'Environnement', slug: 'b1-fr-environnement-gap', description: "Vocabulaire sur l'environnement et la durabilité.", targetLanguage: 'fr', level: 'B1' },
    5,
    [
      ['Complétez la phrase', 'Nous devons recycler les ', ' pour protéger la planète.', 'déchets'],
      ['Complétez la phrase', 'La ', ' augmente à cause de la pollution.', 'température'],
      ['Complétez la phrase', "Nous devons économiser l'", '.', 'eau'],
    ]
  ),
  fc(
    { title: 'Émotions', slug: 'b1-fr-emotions-fc', description: 'Vocabulaire sur les émotions et sentiments.', targetLanguage: 'fr', level: 'B1' },
    5,
    [['heureux', 'happy'], ['triste', 'sad'], ['anxieux', 'anxious'], ['excité', 'excited'], ['en colère', 'angry']]
  ),
  mc(
    { title: 'Verbes Modaux: Pouvoir', slug: 'b1-fr-verbes-modaux-pouvoir-mc', description: 'Pratiquez les verbes modaux pouvoir.', targetLanguage: 'fr', level: 'B1' },
    5,
    [
      ['___-je utiliser votre téléphone?', ['Puis', 'Dois', 'Vais', 'Suis'], 'Puis'],
      ['Enfant, je ___ très bien nager.', ['pouvais', 'peux', 'dois', 'vais'], 'pouvais'],
      ['___-je poser une question?', ['Pourrais', 'Dois', 'Vais', 'Suis'], 'Pourrais'],
    ]
  ),

  // ================= B2 =================
  fc(
    { title: 'Vocabulário de Negócios', slug: 'b2-pt-vocabulario-de-negocios-fc', description: 'Vocabulário do mundo dos negócios.', targetLanguage: 'pt', level: 'B2' },
    6,
    [['acordo', 'agreement'], ['investimento', 'investment'], ['concorrência', 'competition'], ['lucro', 'profit'], ['orçamento', 'budget']]
  ),
  mc(
    { title: 'Voz Passiva', slug: 'b2-pt-voz-passiva-mc', description: 'Pratique a formação da voz passiva.', targetLanguage: 'pt', level: 'B2' },
    6,
    [
      ['O livro ___ (escrever) por ela.', ['foi escrito', 'escreveu', 'escreve', 'escrevendo'], 'foi escrito'],
      ['A casa ___ (construir) em 1990.', ['foi construída', 'construiu', 'constrói', 'construindo'], 'foi construída'],
      ['Os documentos ___ (enviar) ontem.', ['foram enviados', 'enviaram', 'enviam', 'enviando'], 'foram enviados'],
    ]
  ),
  gap(
    { title: 'Discurso Indireto', slug: 'b2-pt-discurso-indireto-gap', description: 'Pratique o discurso indireto.', targetLanguage: 'pt', level: 'B2' },
    6,
    [
      ['Complete a frase', 'Ela disse que ', ' cansada.', 'estava'],
      ['Complete a frase', 'Ele falou que ', ' viajar.', 'ia'],
      ['Complete a frase', 'Eles disseram que já ', ' o trabalho.', 'tinham terminado'],
    ]
  ),
  fc(
    { title: 'Entrevista de Emprego', slug: 'b2-pt-entrevista-de-emprego-fc', description: 'Vocabulário para entrevistas de emprego.', targetLanguage: 'pt', level: 'B2' },
    6,
    [['pontos fortes', 'strengths'], ['ponto fraco', 'weakness'], ['experiência', 'experience'], ['habilidades', 'skills'], ['referências', 'references']]
  ),
  mc(
    { title: 'Orações Relativas', slug: 'b2-pt-oracoes-relativas-mc', description: 'Pratique pronomes relativos.', targetLanguage: 'pt', level: 'B2' },
    6,
    [
      ['Esse é o homem ___ me ajudou.', ['que', 'quem', 'cujo', 'onde'], 'que'],
      ['A cidade ___ eu nasci é linda.', ['onde', 'que', 'quem', 'cujo'], 'onde'],
      ['Essa é a mulher ___ filho estuda comigo.', ['cujo', 'que', 'quem', 'onde'], 'cujo'],
    ]
  ),
  gap(
    { title: 'Opinião e Debate', slug: 'b2-pt-opiniao-e-debate-gap', description: 'Pratique expressões para dar opinião.', targetLanguage: 'pt', level: 'B2' },
    6,
    [
      ['Complete a frase', 'Na minha ', ', isso é injusto.', 'opinião'],
      ['Complete a frase', 'Eu discordo ', ' dessa ideia.', 'totalmente'],
      ['Complete a frase', 'É importante considerar os dois ', ' do argumento.', 'lados'],
    ]
  ),
  fc(
    { title: 'Mídia e Notícias', slug: 'b2-pt-midia-e-noticias-fc', description: 'Vocabulário sobre mídia e notícias.', targetLanguage: 'pt', level: 'B2' },
    6,
    [['manchete', 'headline'], ['reportagem', 'news report'], ['jornalista', 'journalist'], ['fonte', 'source'], ['transmissão', 'broadcast']]
  ),
  mc(
    { title: 'Escrita Formal', slug: 'b2-pt-escrita-formal-mc', description: 'Pratique expressões formais de escrita.', targetLanguage: 'pt', level: 'B2' },
    6,
    [
      ['Qual expressão é mais formal para começar uma carta?', ['Prezado(a) senhor(a)', 'Oi', 'E aí', 'Fala'], 'Prezado(a) senhor(a)'],
      ['Como encerrar um e-mail formal?', ['Atenciosamente', 'Beijos', 'Falou', 'Até mais'], 'Atenciosamente'],
      ['Qual dessas é uma forma formal de pedir algo?', ['Solicito que', 'Me dá', 'Passa aí', 'Manda'], 'Solicito que'],
    ]
  ),

  fc(
    { title: 'Business Vocabulary', slug: 'b2-en-business-vocabulary-fc', description: 'Vocabulary from the business world.', targetLanguage: 'en', level: 'B2' },
    6,
    [['agreement', 'acordo'], ['investment', 'investimento'], ['competition', 'concorrência'], ['profit', 'lucro'], ['budget', 'orçamento']]
  ),
  mc(
    { title: 'Passive Voice', slug: 'b2-en-passive-voice-mc', description: 'Practice forming the passive voice.', targetLanguage: 'en', level: 'B2' },
    6,
    [
      ['The book ___ (write) by her.', ['was written', 'wrote', 'writes', 'writing'], 'was written'],
      ['The house ___ (build) in 1990.', ['was built', 'built', 'builds', 'building'], 'was built'],
      ['The documents ___ (send) yesterday.', ['were sent', 'sent', 'send', 'sending'], 'were sent'],
    ]
  ),
  gap(
    { title: 'Reported Speech', slug: 'b2-en-reported-speech-gap', description: 'Practice reported speech.', targetLanguage: 'en', level: 'B2' },
    6,
    [
      ['Complete the sentence', 'She said she ', ' tired.', 'was'],
      ['Complete the sentence', 'He said he ', ' travel.', 'would'],
      ['Complete the sentence', 'They said they had already ', ' the work.', 'finished'],
    ]
  ),
  fc(
    { title: 'Job Interview', slug: 'b2-en-job-interview-fc', description: 'Vocabulary for job interviews.', targetLanguage: 'en', level: 'B2' },
    6,
    [['strengths', 'pontos fortes'], ['weakness', 'ponto fraco'], ['experience', 'experiência'], ['skills', 'habilidades'], ['references', 'referências']]
  ),
  mc(
    { title: 'Relative Clauses', slug: 'b2-en-relative-clauses-mc', description: 'Practice relative pronouns.', targetLanguage: 'en', level: 'B2' },
    6,
    [
      ['This is the man ___ helped me.', ['who', 'whom', 'whose', 'where'], 'who'],
      ['The city ___ I was born is beautiful.', ['where', 'who', 'whose', 'which'], 'where'],
      ['This is the woman ___ son studies with me.', ['whose', 'who', 'whom', 'where'], 'whose'],
    ]
  ),
  gap(
    { title: 'Opinion and Debate', slug: 'b2-en-opinion-and-debate-gap', description: 'Practice expressions for giving opinions.', targetLanguage: 'en', level: 'B2' },
    6,
    [
      ['Complete the sentence', 'In my ', ', this is unfair.', 'opinion'],
      ['Complete the sentence', 'I completely ', ' with that idea.', 'disagree'],
      ['Complete the sentence', 'It’s important to consider both ', ' of the argument.', 'sides'],
    ]
  ),
  fc(
    { title: 'Media and News', slug: 'b2-en-media-and-news-fc', description: 'Vocabulary about media and news.', targetLanguage: 'en', level: 'B2' },
    6,
    [['headline', 'manchete'], ['news report', 'reportagem'], ['journalist', 'jornalista'], ['source', 'fonte'], ['broadcast', 'transmissão']]
  ),
  mc(
    { title: 'Formal Writing', slug: 'b2-en-formal-writing-mc', description: 'Practice formal writing expressions.', targetLanguage: 'en', level: 'B2' },
    6,
    [
      ['Which expression is more formal to start a letter?', ['Dear Sir/Madam', 'Hey', 'What’s up', 'Yo'], 'Dear Sir/Madam'],
      ['How do you close a formal email?', ['Sincerely', 'Kisses', 'Later', 'See ya'], 'Sincerely'],
      ['Which of these is a formal way to request something?', ['I would like to request', 'Gimme', 'Give it', 'Hand it over'], 'I would like to request'],
    ]
  ),

  fc(
    { title: 'Vocabulaire des Affaires', slug: 'b2-fr-vocabulaire-des-affaires-fc', description: 'Vocabulaire du monde des affaires.', targetLanguage: 'fr', level: 'B2' },
    6,
    [['accord', 'agreement'], ['investissement', 'investment'], ['concurrence', 'competition'], ['bénéfice', 'profit'], ['budget', 'budget']]
  ),
  mc(
    { title: 'La Voix Passive', slug: 'b2-fr-la-voix-passive-mc', description: 'Pratiquez la formation de la voix passive.', targetLanguage: 'fr', level: 'B2' },
    6,
    [
      ['Le livre ___ (écrire) par elle.', ['a été écrit', 'a écrit', 'écrit', 'écrivant'], 'a été écrit'],
      ['La maison ___ (construire) en 1990.', ['a été construite', 'a construit', 'construit', 'construisant'], 'a été construite'],
      ['Les documents ___ (envoyer) hier.', ['ont été envoyés', 'ont envoyé', 'envoient', 'envoyant'], 'ont été envoyés'],
    ]
  ),
  gap(
    { title: 'Discours Indirect', slug: 'b2-fr-discours-indirect-gap', description: 'Pratiquez le discours indirect.', targetLanguage: 'fr', level: 'B2' },
    6,
    [
      ['Complétez la phrase', "Elle a dit qu'elle ", ' fatiguée.', 'était'],
      ['Complétez la phrase', "Il a dit qu'il ", ' voyager.', 'allait'],
      ['Complétez la phrase', 'Ils ont dit qu’ils avaient déjà ', ' le travail.', 'fini'],
    ]
  ),
  fc(
    { title: "Entretien d'Embauche", slug: 'b2-fr-entretien-embauche-fc', description: "Vocabulaire pour l'entretien d'embauche.", targetLanguage: 'fr', level: 'B2' },
    6,
    [['points forts', 'strengths'], ['point faible', 'weakness'], ['expérience', 'experience'], ['compétences', 'skills'], ['références', 'references']]
  ),
  mc(
    { title: 'Propositions Relatives', slug: 'b2-fr-propositions-relatives-mc', description: 'Pratiquez les pronoms relatifs.', targetLanguage: 'fr', level: 'B2' },
    6,
    [
      ["C'est l'homme ___ m'a aidé.", ['qui', 'que', 'dont', 'où'], 'qui'],
      ['La ville ___ je suis né est belle.', ['où', 'qui', 'que', 'dont'], 'où'],
      ["C'est la femme ___ le fils étudie avec moi.", ['dont', 'qui', 'que', 'où'], 'dont'],
    ]
  ),
  gap(
    { title: 'Opinion et Débat', slug: 'b2-fr-opinion-et-debat-gap', description: 'Pratiquez les expressions pour donner son opinion.', targetLanguage: 'fr', level: 'B2' },
    6,
    [
      ['Complétez la phrase', 'À mon ', ', c’est injuste.', 'avis'],
      ['Complétez la phrase', "Je ne suis pas du tout d'", ' avec cette idée.', 'accord'],
      ['Complétez la phrase', 'Il est important de considérer les deux ', " de l'argument.", 'côtés'],
    ]
  ),
  fc(
    { title: 'Médias et Actualités', slug: 'b2-fr-medias-et-actualites-fc', description: 'Vocabulaire sur les médias et les actualités.', targetLanguage: 'fr', level: 'B2' },
    6,
    [['titre', 'headline'], ['reportage', 'news report'], ['journaliste', 'journalist'], ['source', 'source'], ['diffusion', 'broadcast']]
  ),
  mc(
    { title: 'Écriture Formelle', slug: 'b2-fr-ecriture-formelle-mc', description: "Pratiquez les expressions d'écriture formelle.", targetLanguage: 'fr', level: 'B2' },
    6,
    [
      ['Quelle formule est plus formelle pour commencer une lettre?', ['Cher Monsieur/Madame', 'Salut', 'Coucou', 'Yo'], 'Cher Monsieur/Madame'],
      ['Comment termine-t-on un e-mail formel?', ['Cordialement', 'Bisous', 'À plus', 'Salut'], 'Cordialement'],
      ['Laquelle de ces formules est une façon formelle de demander quelque chose?', ['Je vous prie de bien vouloir', 'Donne-moi', 'Passe-moi ça', 'File-le'], 'Je vous prie de bien vouloir'],
    ]
  ),

  // ================= C1 =================
  fc(
    { title: 'Collocations Comuns', slug: 'c1-pt-collocations-comuns-fc', description: 'Combinações de palavras usadas naturalmente por falantes nativos.', targetLanguage: 'pt', level: 'C1' },
    7,
    [['tomar uma decisão', 'to make a decision'], ['correr um risco', 'to take a risk'], ['prestar atenção', 'to pay attention'], ['dar uma olhada', 'to take a look'], ['ganhar tempo', 'to save time']]
  ),
  mc(
    { title: 'Vocabulário Acadêmico', slug: 'c1-pt-vocabulario-academico-mc', description: 'Vocabulário usado em contextos acadêmicos.', targetLanguage: 'pt', level: 'C1' },
    7,
    [
      ["Qual palavra significa 'analisar profundamente'?", ['aprofundar', 'resumir', 'ignorar', 'repetir'], 'aprofundar'],
      ["O que significa 'hipótese'?", ['suposição a ser testada', 'fato comprovado', 'opinião pessoal', 'erro comum'], 'suposição a ser testada'],
      ["'Coerente' significa:", ['lógico e bem conectado', 'confuso', 'repetitivo', 'curto'], 'lógico e bem conectado'],
    ]
  ),
  gap(
    { title: 'Conectores Avançados', slug: 'c1-pt-conectores-avancados-gap', description: 'Pratique conectores usados em textos argumentativos.', targetLanguage: 'pt', level: 'C1' },
    7,
    [
      ['Complete a frase', '', ' o mau tempo, a viagem continuou.', 'Apesar de'],
      ['Complete a frase', 'Ele estudou muito; ', ', não passou no exame.', 'contudo'],
      ['Complete a frase', '', ' ele seja jovem, tem muita experiência.', 'Embora'],
    ]
  ),
  fc(
    { title: 'Termos Jurídicos', slug: 'c1-pt-termos-juridicos-fc', description: 'Vocabulário jurídico e formal.', targetLanguage: 'pt', level: 'C1' },
    7,
    [['cláusula', 'clause'], ['réu', 'defendant'], ['testemunha', 'witness'], ['sentença', 'ruling'], ['contrato', 'contract']]
  ),
  mc(
    { title: 'Phrasal Verbs Avançados', slug: 'c1-pt-phrasal-verbs-avancados-mc', description: 'Expressões verbais avançadas em português.', targetLanguage: 'pt', level: 'C1' },
    7,
    [
      ["'Levar em conta' significa:", ['considerar', 'ignorar', 'esquecer', 'negar'], 'considerar'],
      ["'Abrir mão de' significa:", ['desistir de', 'pegar', 'ganhar', 'perder'], 'desistir de'],
      ["'Colocar em prática' significa:", ['aplicar', 'imaginar', 'planejar', 'cancelar'], 'aplicar'],
    ]
  ),
  gap(
    { title: 'Registro e Persuasão', slug: 'c1-pt-registro-e-persuasao-gap', description: 'Pratique linguagem persuasiva formal.', targetLanguage: 'pt', level: 'C1' },
    7,
    [
      ['Complete a frase', 'É inegável que essa medida trará ', ' benefícios.', 'grandes'],
      ['Complete a frase', 'Portanto, podemos ', ' que a proposta é viável.', 'concluir'],
      ['Complete a frase', 'Sem dúvida, essa é a melhor ', ' a seguir.', 'opção'],
    ]
  ),
  fc(
    { title: 'Mudança de Registro', slug: 'c1-pt-mudanca-de-registro-fc', description: 'Compare linguagem informal e formal.', targetLanguage: 'pt', level: 'C1' },
    7,
    [['topa?', 'você aceita?'], ['beleza', 'está tudo bem'], ['dá um help', 'pode me ajudar'], ['sacou?', 'você entendeu?']]
  ),
  mc(
    { title: 'Debate e Argumentação', slug: 'c1-pt-debate-e-argumentacao-mc', description: 'Expressões usadas em debates formais.', targetLanguage: 'pt', level: 'C1' },
    7,
    [
      ['Qual expressão introduz um contra-argumento?', ['Por outro lado', 'Além disso', 'Da mesma forma', 'Em primeiro lugar'], 'Por outro lado'],
      ['Qual frase reforça um argumento?', ['Isso comprova que', 'Talvez', 'Não sei', 'De qualquer jeito'], 'Isso comprova que'],
      ['Como você concede um ponto ao oponente educadamente?', ['Reconheço que, mas', 'Você está errado', 'Isso é bobagem', 'Não me importa'], 'Reconheço que, mas'],
    ]
  ),

  fc(
    { title: 'Common Collocations', slug: 'c1-en-common-collocations-fc', description: 'Word combinations native speakers use naturally.', targetLanguage: 'en', level: 'C1' },
    7,
    [['to make a decision', 'tomar uma decisão'], ['to take a risk', 'correr um risco'], ['to pay attention', 'prestar atenção'], ['to take a look', 'dar uma olhada'], ['to save time', 'ganhar tempo']]
  ),
  mc(
    { title: 'Academic Vocabulary', slug: 'c1-en-academic-vocabulary-mc', description: 'Vocabulary used in academic contexts.', targetLanguage: 'en', level: 'C1' },
    7,
    [
      ["Which word means 'to analyze deeply'?", ['to delve into', 'to summarize', 'to ignore', 'to repeat'], 'to delve into'],
      ["What does 'hypothesis' mean?", ['an assumption to be tested', 'a proven fact', 'a personal opinion', 'a common mistake'], 'an assumption to be tested'],
      ["'Coherent' means:", ['logical and well-connected', 'confusing', 'repetitive', 'short'], 'logical and well-connected'],
    ]
  ),
  gap(
    { title: 'Advanced Connectors', slug: 'c1-en-advanced-connectors-gap', description: 'Practice connectors used in argumentative texts.', targetLanguage: 'en', level: 'C1' },
    7,
    [
      ['Complete the sentence', '', ' the bad weather, the trip continued.', 'Despite'],
      ['Complete the sentence', 'He studied hard; ', ', he did not pass the exam.', 'however'],
      ['Complete the sentence', '', ' he is young, he has a lot of experience.', 'Although'],
    ]
  ),
  fc(
    { title: 'Legal Terms', slug: 'c1-en-legal-terms-fc', description: 'Legal and formal vocabulary.', targetLanguage: 'en', level: 'C1' },
    7,
    [['clause', 'cláusula'], ['defendant', 'réu'], ['witness', 'testemunha'], ['ruling', 'sentença'], ['contract', 'contrato']]
  ),
  mc(
    { title: 'Advanced Phrasal Verbs', slug: 'c1-en-advanced-phrasal-verbs-mc', description: 'Advanced phrasal verb expressions.', targetLanguage: 'en', level: 'C1' },
    7,
    [
      ["'To account for' means:", ['to explain', 'to ignore', 'to forget', 'to deny'], 'to explain'],
      ["'To give up on' means:", ['to stop trying', 'to start', 'to win', 'to lose'], 'to stop trying'],
      ["'To put into practice' means:", ['to apply', 'to imagine', 'to plan', 'to cancel'], 'to apply'],
    ]
  ),
  gap(
    { title: 'Register and Persuasion', slug: 'c1-en-register-and-persuasion-gap', description: 'Practice formal persuasive language.', targetLanguage: 'en', level: 'C1' },
    7,
    [
      ['Complete the sentence', 'It is undeniable that this measure will bring ', ' benefits.', 'great'],
      ['Complete the sentence', 'Therefore, we can ', ' that the proposal is viable.', 'conclude'],
      ['Complete the sentence', 'Without a doubt, this is the best ', ' to follow.', 'option'],
    ]
  ),
  fc(
    { title: 'Register Shifting', slug: 'c1-en-register-shifting-fc', description: 'Compare informal and formal English.', targetLanguage: 'en', level: 'C1' },
    7,
    [['gimme a sec', 'give me a moment'], ['wanna', 'want to'], ['kinda', 'kind of'], ['lemme know', 'let me know']]
  ),
  mc(
    { title: 'Debate and Argumentation', slug: 'c1-en-debate-and-argumentation-mc', description: 'Expressions used in formal debate.', targetLanguage: 'en', level: 'C1' },
    7,
    [
      ['Which expression introduces a counter-argument?', ['On the other hand', 'Furthermore', 'Likewise', 'First of all'], 'On the other hand'],
      ['Which phrase reinforces an argument?', ['This proves that', 'Maybe', 'I don’t know', 'Whatever'], 'This proves that'],
      ['How do you politely concede a point to your opponent?', ['I acknowledge that, but', 'You’re wrong', 'That’s nonsense', 'I don’t care'], 'I acknowledge that, but'],
    ]
  ),

  fc(
    { title: 'Collocations Courantes', slug: 'c1-fr-collocations-courantes-fc', description: 'Combinaisons de mots utilisées naturellement par les natifs.', targetLanguage: 'fr', level: 'C1' },
    7,
    [['prendre une décision', 'to make a decision'], ['prendre un risque', 'to take a risk'], ['faire attention', 'to pay attention'], ['jeter un coup d’œil', 'to take a look'], ['gagner du temps', 'to save time']]
  ),
  mc(
    { title: 'Vocabulaire Académique', slug: 'c1-fr-vocabulaire-academique-mc', description: 'Vocabulaire utilisé dans un contexte académique.', targetLanguage: 'fr', level: 'C1' },
    7,
    [
      ["Quel mot signifie 'analyser en profondeur'?", ['approfondir', 'résumer', 'ignorer', 'répéter'], 'approfondir'],
      ["Que signifie 'hypothèse'?", ['une supposition à tester', 'un fait prouvé', 'une opinion personnelle', 'une erreur courante'], 'une supposition à tester'],
      ["'Cohérent' signifie:", ['logique et bien lié', 'confus', 'répétitif', 'court'], 'logique et bien lié'],
    ]
  ),
  gap(
    { title: 'Connecteurs Avancés', slug: 'c1-fr-connecteurs-avances-gap', description: 'Pratiquez les connecteurs utilisés dans les textes argumentatifs.', targetLanguage: 'fr', level: 'C1' },
    7,
    [
      ['Complétez la phrase', '', ' le mauvais temps, le voyage a continué.', 'Malgré'],
      ['Complétez la phrase', 'Il a beaucoup étudié; ', ', il n’a pas réussi l’examen.', 'cependant'],
      ['Complétez la phrase', '', ' il soit jeune, il a beaucoup d’expérience.', 'Bien que'],
    ]
  ),
  fc(
    { title: 'Termes Juridiques', slug: 'c1-fr-termes-juridiques-fc', description: 'Vocabulaire juridique et formel.', targetLanguage: 'fr', level: 'C1' },
    7,
    [['clause', 'clause'], ['accusé', 'defendant'], ['témoin', 'witness'], ['jugement', 'ruling'], ['contrat', 'contract']]
  ),
  mc(
    { title: 'Verbes à Particule Avancés', slug: 'c1-fr-verbes-a-particule-avances-mc', description: 'Expressions verbales avancées en français.', targetLanguage: 'fr', level: 'C1' },
    7,
    [
      ["'Tenir compte de' signifie:", ['considérer', 'ignorer', 'oublier', 'nier'], 'considérer'],
      ["'Renoncer à' signifie:", ['abandonner', 'prendre', 'gagner', 'perdre'], 'abandonner'],
      ["'Mettre en pratique' signifie:", ['appliquer', 'imaginer', 'planifier', 'annuler'], 'appliquer'],
    ]
  ),
  gap(
    { title: 'Registre et Persuasion', slug: 'c1-fr-registre-et-persuasion-gap', description: 'Pratiquez le langage persuasif formel.', targetLanguage: 'fr', level: 'C1' },
    7,
    [
      ['Complétez la phrase', 'Il est indéniable que cette mesure apportera de ', ' bénéfices.', 'grands'],
      ['Complétez la phrase', 'Par conséquent, nous pouvons ', ' que la proposition est viable.', 'conclure'],
      ['Complétez la phrase', 'Sans aucun doute, c’est la meilleure ', ' à suivre.', 'option'],
    ]
  ),
  fc(
    { title: 'Changement de Registre', slug: 'c1-fr-changement-de-registre-fc', description: 'Comparez le langage informel et formel en français.', targetLanguage: 'fr', level: 'C1' },
    7,
    [['t’inquiète', 'ne vous inquiétez pas'], ['j’sais pas', 'je ne sais pas'], ['faut que', 'il faut que'], ['grave (familier)', 'vraiment']]
  ),
  mc(
    { title: 'Débat et Argumentation', slug: 'c1-fr-debat-et-argumentation-mc', description: 'Expressions utilisées dans un débat formel.', targetLanguage: 'fr', level: 'C1' },
    7,
    [
      ['Quelle expression introduit un contre-argument?', ['En revanche', 'De plus', 'De même', 'Tout d’abord'], 'En revanche'],
      ['Quelle phrase renforce un argument?', ['Cela prouve que', 'Peut-être', 'Je ne sais pas', 'Peu importe'], 'Cela prouve que'],
      ['Comment concède-t-on poliment un point à son adversaire?', ['Je reconnais que, mais', 'Vous avez tort', 'C’est absurde', 'Je m’en fiche'], 'Je reconnais que, mais'],
    ]
  ),

  // ================= C2 =================
  fc(
    { title: 'Vocabulário Raro', slug: 'c2-pt-vocabulario-raro-fc', description: 'Vocabulário sofisticado e pouco comum.', targetLanguage: 'pt', level: 'C2' },
    7,
    [['perene', 'everlasting / perennial'], ['efêmero', 'ephemeral'], ['ubíquo', 'ubiquitous'], ['incipiente', 'incipient'], ['hodierno', 'present-day']]
  ),
  mc(
    { title: 'Figuras de Linguagem', slug: 'c2-pt-figuras-de-linguagem-mc', description: 'Reconheça figuras de linguagem em português.', targetLanguage: 'pt', level: 'C2' },
    7,
    [
      ["'O tempo é um rio que corre sem parar' é um exemplo de:", ['metáfora', 'onomatopeia', 'hipérbole', 'eufemismo'], 'metáfora'],
      ["Dizer 'chorei rios de lágrimas' é:", ['hipérbole', 'metáfora', 'ironia', 'eufemismo'], 'hipérbole'],
      ["Usar 'partiu para melhor' em vez de 'morreu' é:", ['eufemismo', 'hipérbole', 'metáfora', 'ironia'], 'eufemismo'],
    ]
  ),
  gap(
    { title: 'Provérbios', slug: 'c2-pt-proverbios-gap', description: 'Complete provérbios populares em português.', targetLanguage: 'pt', level: 'C2' },
    7,
    [
      ['Complete o provérbio', 'Água mole em pedra dura, tanto bate até que ', '.', 'fura'],
      ['Complete o provérbio', 'Quem tudo quer, tudo ', '.', 'perde'],
      ['Complete o provérbio', 'Antes tarde do que ', '.', 'nunca'],
    ]
  ),
  fc(
    { title: 'Termos Especializados', slug: 'c2-pt-termos-especializados-fc', description: 'Vocabulário de linguística e etimologia.', targetLanguage: 'pt', level: 'C2' },
    7,
    [['etimologia', 'etymology'], ['neologismo', 'neologism'], ['semântica', 'semantics'], ['sintaxe', 'syntax'], ['morfologia', 'morphology']]
  ),
  mc(
    { title: 'Ironia e Sátira', slug: 'c2-pt-ironia-e-satira-mc', description: 'Identifique ironia e sátira em textos.', targetLanguage: 'pt', level: 'C2' },
    7,
    [
      ['Um texto que critica a sociedade usando humor exagerado é:', ['sátira', 'elegia', 'ode', 'soneto'], 'sátira'],
      ["Dizer 'que dia lindo' durante uma tempestade é:", ['ironia', 'metáfora', 'aliteração', 'rima'], 'ironia'],
      ['Uma obra que ridiculariza vícios humanos é chamada de:', ['sátira', 'épico', 'lírica', 'drama'], 'sátira'],
    ]
  ),
  gap(
    { title: 'Marcadores Discursivos', slug: 'c2-pt-marcadores-discursivos-gap', description: 'Pratique marcadores discursivos avançados.', targetLanguage: 'pt', level: 'C2' },
    7,
    [
      ['Complete a frase', 'Posto ', ', vamos analisar os dados.', 'isso'],
      ['Complete a frase', 'Em última ', ', a proposta é sólida.', 'análise'],
      ['Complete a frase', '', ' obstante as críticas, o projeto seguiu em frente.', 'Não'],
    ]
  ),
  fc(
    { title: 'Expressões Regionais', slug: 'c2-pt-expressoes-regionais-fc', description: 'Expressões regionais e coloquiais do Brasil.', targetLanguage: 'pt', level: 'C2' },
    7,
    [['trem (Minas, informal p/ "coisa")', 'thing (regional slang)'], ['égua (Nordeste, exclamação)', 'wow / surprise'], ['bah (Sul, exclamação)', 'wow / oh'], ['mano (SP, gíria)', 'dude / friend']]
  ),
  mc(
    { title: 'Compreensão Discursiva Avançada', slug: 'c2-pt-compreensao-discursiva-avancada-mc', description: 'Pratique conectivos e nuances de texto avançado.', targetLanguage: 'pt', level: 'C2' },
    7,
    [
      ["Qual palavra melhor substitui 'contudo' mantendo o sentido?", ['entretanto', 'portanto', 'porque', 'assim'], 'entretanto'],
      ['Em um texto acadêmico, qual conectivo indica conclusão?', ['portanto', 'mas', 'ou', 'e'], 'portanto'],
      ['Qual dessas palavras é um marcador de ênfase?', ['de fato', 'talvez', 'quase', 'quase nunca'], 'de fato'],
    ]
  ),

  fc(
    { title: 'Rare Vocabulary', slug: 'c2-en-rare-vocabulary-fc', description: 'Sophisticated and uncommon vocabulary.', targetLanguage: 'en', level: 'C2' },
    7,
    [['everlasting', 'perene'], ['ephemeral', 'efêmero'], ['ubiquitous', 'ubíquo'], ['incipient', 'incipiente'], ['present-day', 'hodierno']]
  ),
  mc(
    { title: 'Literary Devices', slug: 'c2-en-literary-devices-mc', description: 'Recognize literary devices in English.', targetLanguage: 'en', level: 'C2' },
    7,
    [
      ["'Time is a river that never stops flowing' is an example of:", ['metaphor', 'onomatopoeia', 'hyperbole', 'euphemism'], 'metaphor'],
      ["Saying 'I cried a river of tears' is:", ['hyperbole', 'metaphor', 'irony', 'euphemism'], 'hyperbole'],
      ["Using 'passed away' instead of 'died' is:", ['euphemism', 'hyperbole', 'metaphor', 'irony'], 'euphemism'],
    ]
  ),
  gap(
    { title: 'Proverbs', slug: 'c2-en-proverbs-gap', description: 'Complete popular English proverbs.', targetLanguage: 'en', level: 'C2' },
    7,
    [
      ['Complete the proverb', 'Rome wasn’t built in a ', '.', 'day'],
      ['Complete the proverb', 'Actions speak louder than ', '.', 'words'],
      ['Complete the proverb', 'Better late than ', '.', 'never'],
    ]
  ),
  fc(
    { title: 'Specialized Terms', slug: 'c2-en-specialized-terms-fc', description: 'Vocabulary from linguistics and etymology.', targetLanguage: 'en', level: 'C2' },
    7,
    [['etymology', 'etimologia'], ['neologism', 'neologismo'], ['semantics', 'semântica'], ['syntax', 'sintaxe'], ['morphology', 'morfologia']]
  ),
  mc(
    { title: 'Irony and Satire', slug: 'c2-en-irony-and-satire-mc', description: 'Identify irony and satire in texts.', targetLanguage: 'en', level: 'C2' },
    7,
    [
      ['A text that criticizes society using exaggerated humor is:', ['satire', 'elegy', 'ode', 'sonnet'], 'satire'],
      ["Saying 'what a beautiful day' during a storm is:", ['irony', 'metaphor', 'alliteration', 'rhyme'], 'irony'],
      ['A work that mocks human vices is called:', ['satire', 'epic', 'lyric', 'drama'], 'satire'],
    ]
  ),
  gap(
    { title: 'Discourse Markers', slug: 'c2-en-discourse-markers-gap', description: 'Practice advanced discourse markers.', targetLanguage: 'en', level: 'C2' },
    7,
    [
      ['Complete the sentence', 'That ', ' said, let’s analyze the data.', 'being'],
      ['Complete the sentence', 'In the ', ' analysis, the proposal is solid.', 'final'],
      ['Complete the sentence', '', ' withstanding the criticism, the project moved forward.', 'Not'],
    ]
  ),
  fc(
    { title: 'Regional Expressions', slug: 'c2-en-regional-expressions-fc', description: 'Regional and colloquial English expressions.', targetLanguage: 'en', level: 'C2' },
    7,
    [['y’all (Southern US)', 'you all (informal plural you)'], ['reckon (regional)', 'to think / suppose'], ['mate (British/AU)', 'friend'], ['ain’t (informal/regional)', 'is not / has not']]
  ),
  mc(
    { title: 'Advanced Discourse Comprehension', slug: 'c2-en-advanced-discourse-comprehension-mc', description: 'Practice advanced connectors and nuance.', targetLanguage: 'en', level: 'C2' },
    7,
    [
      ["Which word best replaces 'however' keeping the meaning?", ['nevertheless', 'therefore', 'because', 'thus'], 'nevertheless'],
      ['In an academic text, which connector indicates conclusion?', ['therefore', 'but', 'or', 'and'], 'therefore'],
      ['Which of these words is an emphasis marker?', ['indeed', 'maybe', 'almost', 'rarely'], 'indeed'],
    ]
  ),

  fc(
    { title: 'Vocabulaire Rare', slug: 'c2-fr-vocabulaire-rare-fc', description: 'Vocabulaire sophistiqué et peu courant.', targetLanguage: 'fr', level: 'C2' },
    7,
    [['pérenne', 'everlasting'], ['éphémère', 'ephemeral'], ['ubiquitaire', 'ubiquitous'], ['naissant', 'incipient'], ['actuel', 'present-day']]
  ),
  mc(
    { title: 'Figures de Style', slug: 'c2-fr-figures-de-style-mc', description: 'Reconnaissez les figures de style en français.', targetLanguage: 'fr', level: 'C2' },
    7,
    [
      ["'Le temps est un fleuve qui coule sans cesse' est un exemple de:", ['métaphore', 'onomatopée', 'hyperbole', 'euphémisme'], 'métaphore'],
      ["Dire 'j'ai pleuré des rivières de larmes' est une:", ['hyperbole', 'métaphore', 'ironie', 'euphémisme'], 'hyperbole'],
      ["Utiliser 'il nous a quittés' au lieu de 'il est mort' est un:", ['euphémisme', 'hyperbole', 'métaphore', 'ironie'], 'euphémisme'],
    ]
  ),
  gap(
    { title: 'Proverbes', slug: 'c2-fr-proverbes-gap', description: 'Complétez des proverbes populaires en français.', targetLanguage: 'fr', level: 'C2' },
    7,
    [
      ['Complétez le proverbe', 'Petit à petit, l’oiseau fait son ', '.', 'nid'],
      ['Complétez le proverbe', 'Les actes en disent plus long que les ', '.', 'mots'],
      ['Complétez le proverbe', 'Mieux vaut tard que ', '.', 'jamais'],
    ]
  ),
  fc(
    { title: 'Termes Spécialisés', slug: 'c2-fr-termes-specialises-fc', description: 'Vocabulaire de linguistique et étymologie.', targetLanguage: 'fr', level: 'C2' },
    7,
    [['étymologie', 'etymology'], ['néologisme', 'neologism'], ['sémantique', 'semantics'], ['syntaxe', 'syntax'], ['morphologie', 'morphology']]
  ),
  mc(
    { title: 'Ironie et Satire', slug: 'c2-fr-ironie-et-satire-mc', description: 'Identifiez l’ironie et la satire dans des textes.', targetLanguage: 'fr', level: 'C2' },
    7,
    [
      ['Un texte qui critique la société avec un humour exagéré est une:', ['satire', 'élégie', 'ode', 'sonnet'], 'satire'],
      ['Dire "quelle belle journée" pendant une tempête est de l’:', ['ironie', 'métaphore', 'allitération', 'rime'], 'ironie'],
      ['Une œuvre qui ridiculise les vices humains s’appelle une:', ['satire', 'épopée', 'poésie lyrique', 'drame'], 'satire'],
    ]
  ),
  gap(
    { title: 'Marqueurs de Discours', slug: 'c2-fr-marqueurs-de-discours-gap', description: 'Pratiquez les marqueurs de discours avancés.', targetLanguage: 'fr', level: 'C2' },
    7,
    [
      ['Complétez la phrase', 'Cela ', ' dit, analysons les données.', 'étant'],
      ['Complétez la phrase', 'En dernière ', ', la proposition est solide.', 'analyse'],
      ['Complétez la phrase', '', ' obstant les critiques, le projet a avancé.', 'Nonobstant'],
    ]
  ),
  fc(
    { title: 'Expressions Régionales', slug: 'c2-fr-expressions-regionales-fc', description: 'Expressions régionales et familières en français.', targetLanguage: 'fr', level: 'C2' },
    7,
    [['chuis (familier, = je suis)', 'I am (informal)'], ['ouais (familier = oui)', 'yeah'], ['bah (interjection)', 'well / oh'], ['chocolatine (régionalisme du Sud-Ouest)', 'pain au chocolat']]
  ),
  mc(
    { title: 'Compréhension Discursive Avancée', slug: 'c2-fr-comprehension-discursive-avancee-mc', description: 'Pratiquez les connecteurs et nuances avancées.', targetLanguage: 'fr', level: 'C2' },
    7,
    [
      ["Quel mot remplace le mieux 'cependant' en gardant le sens?", ['néanmoins', 'donc', 'parce que', 'ainsi'], 'néanmoins'],
      ['Dans un texte académique, quel connecteur indique une conclusion?', ['donc', 'mais', 'ou', 'et'], 'donc'],
      ['Lequel de ces mots est un marqueur d’insistance?', ['en effet', 'peut-être', 'presque', 'rarement'], 'en effet'],
    ]
  ),
];

module.exports = { extraPublicQuizzes };
