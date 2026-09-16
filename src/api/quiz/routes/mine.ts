export default {
  routes: [
    { method: 'GET', path: '/quizzes/mine', handler: 'quiz.findMine' },
    { method: 'GET', path: '/quizzes/mine/reach', handler: 'quiz.findMineReach' },
  ],
};
