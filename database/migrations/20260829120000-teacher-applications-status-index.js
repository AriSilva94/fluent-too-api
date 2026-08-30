'use strict';

// Fila administrativa filtra por `status` e ordena por `created_at`. Sem índice, cada
// consulta é um scan completo da tabela — só não doeu ainda porque a tabela é pequena.
// Puramente aditivo: nao apaga nem altera dado nenhum.
module.exports = {
  async up(knex) {
    // Migrations de usuário rodam ANTES do Strapi criar as tabelas dos content-types
    // no primeiro boot com uma feature nova — num ambiente onde `teacher_applications`
    // ainda não existe, criar o índice aqui derrubaria o boot inteiro. Pula e deixa a
    // migration seguinte (que roda no próximo deploy, com a tabela já existindo) criar
    // o índice de verdade.
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
