'use strict';

const { parseLegacyBlogDate } = require('../legacy-blog-date');

async function columnIsText(knex) {
  const [column] = await knex('information_schema.columns')
    .select('data_type')
    .where({ table_name: 'blog_posts', column_name: 'date' })
    .andWhereRaw('table_schema = current_schema()');

  return Boolean(column) && String(column.data_type).toLowerCase().includes('char');
}

module.exports = {
  async up(knex) {
    const hasTable = await knex.schema.hasTable('blog_posts');
    if (!hasTable) return;
    if (!(await columnIsText(knex))) return;

    const rows = await knex('blog_posts').select('id', 'date');
    const invalidas = [];

    for (const row of rows) {
      const iso = parseLegacyBlogDate(row.date);
      if (!iso) {
        invalidas.push(`#${row.id}: ${JSON.stringify(row.date)}`);
        continue;
      }
      if (iso !== row.date) await knex('blog_posts').where({ id: row.id }).update({ date: iso });
    }

    if (invalidas.length > 0) {
      throw new Error(
        `Nao foi possivel converter a data de ${invalidas.length} post(s) do blog: ${invalidas.join(', ')}. ` +
          'Corrija esses valores para AAAA-MM-DD e rode novamente.'
      );
    }

    await knex.raw('ALTER TABLE blog_posts ALTER COLUMN date TYPE date USING date::date');
  },

  async down(knex) {
    const hasTable = await knex.schema.hasTable('blog_posts');
    if (!hasTable) return;
    if (await columnIsText(knex)) return;

    await knex.raw('ALTER TABLE blog_posts ALTER COLUMN date TYPE varchar(255) USING to_char(date, \'YYYY-MM-DD\')');
  },
};
