'use strict';

module.exports = {
  async up(knex) {
    const hasTable = await knex.schema.hasTable('teacher_applications');
    if (!hasTable) {
      console.warn('[migration] teacher_applications ainda não existe, pulando indice (sera criado no proximo deploy)');
      return;
    }

    await knex.raw(
      'CREATE INDEX IF NOT EXISTS teacher_applications_status_created_at_idx ON teacher_applications (status, created_at)'
    );
  },

  async down(knex) {
    await knex.raw('DROP INDEX IF EXISTS teacher_applications_status_created_at_idx');
  },
};
