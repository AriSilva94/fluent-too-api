'use strict';

module.exports = {
  async up(knex) {
    const hasTable = await knex.schema.hasTable('quiz_attempts');
    if (!hasTable) {
      console.warn('[migration] quiz_attempts ainda não existe, pulando indice (sera criado no proximo deploy)');
      return;
    }

    await knex.raw('CREATE INDEX IF NOT EXISTS quiz_attempts_completed_at_idx ON quiz_attempts (completed_at)');
  },

  async down(knex) {
    await knex.raw('DROP INDEX IF EXISTS quiz_attempts_completed_at_idx');
  },
};
