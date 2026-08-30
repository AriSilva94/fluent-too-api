'use strict';

// Histórico de tentativas (dashboard do aluno, "app_admin" vendo tudo) ordena por
// `completed_at` com LIMIT 20. O relacionamento com o usuário fica numa tabela de
// link (`quiz_attempts_user_lnk`), que já tem índice em `user_id`; falta este aqui
// para o ORDER BY não varrer a tabela inteira. Puramente aditivo.
module.exports = {
  async up(knex) {
    await knex.raw('CREATE INDEX IF NOT EXISTS quiz_attempts_completed_at_idx ON quiz_attempts (completed_at)');
  },

  async down(knex) {
    await knex.raw('DROP INDEX IF EXISTS quiz_attempts_completed_at_idx');
  },
};
