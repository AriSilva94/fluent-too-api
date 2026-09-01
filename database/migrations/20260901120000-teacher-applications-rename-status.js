'use strict';

module.exports = {
  async up(knex) {
    const hasTable = await knex.schema.hasTable('teacher_applications');
    if (!hasTable) return;

    const hasOldColumn = await knex.schema.hasColumn('teacher_applications', 'status');
    const hasNewColumn = await knex.schema.hasColumn('teacher_applications', 'review_status');

    if (hasOldColumn && !hasNewColumn) {
      await knex.raw('ALTER TABLE teacher_applications RENAME COLUMN status TO review_status');
    }
  },

  async down(knex) {
    const hasTable = await knex.schema.hasTable('teacher_applications');
    if (!hasTable) return;

    const hasNewColumn = await knex.schema.hasColumn('teacher_applications', 'review_status');
    if (hasNewColumn) {
      await knex.raw('ALTER TABLE teacher_applications RENAME COLUMN review_status TO status');
    }
  },
};
