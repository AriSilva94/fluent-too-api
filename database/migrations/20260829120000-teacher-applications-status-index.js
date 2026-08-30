'use strict';

// Fila administrativa filtra por `status` e ordena por `created_at`. Sem índice, cada
// consulta é um scan completo da tabela — só não doeu ainda porque a tabela é pequena.
// Puramente aditivo: nao apaga nem altera dado nenhum.
module.exports = {
  async up(knex) {
    await knex.raw(
      'CREATE INDEX IF NOT EXISTS teacher_applications_status_created_at_idx ON teacher_applications (status, created_at)'
    );
  },

  async down(knex) {
    await knex.raw('DROP INDEX IF EXISTS teacher_applications_status_created_at_idx');
  },
};
