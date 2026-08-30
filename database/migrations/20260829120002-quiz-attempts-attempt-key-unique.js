'use strict';

module.exports = {
  async up(knex) {
    const hasTable = await knex.schema.hasTable('quiz_attempts');
    if (!hasTable) {
      console.warn('[migration] quiz_attempts ainda não existe, pulando indice (sera criado no proximo deploy)');
      return;
    }

    const duplicates = await knex('quiz_attempts')
      .select('attempt_key')
      .whereNotNull('attempt_key')
      .groupBy('attempt_key')
      .havingRaw('COUNT(*) > 1');

    if (duplicates.length > 0) {
      console.warn(
        `[migration] Pulando indice unico de quiz_attempts.attempt_key: ${duplicates.length} valores duplicados ja existem na base. Resolva manualmente antes de reaplicar.`
      );
      return;
    }

    await knex.raw('CREATE UNIQUE INDEX IF NOT EXISTS quiz_attempts_attempt_key_unique ON quiz_attempts (attempt_key)');
  },

  async down(knex) {
    await knex.raw('DROP INDEX IF EXISTS quiz_attempts_attempt_key_unique');
  },
};
