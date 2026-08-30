'use strict';

// O content-type declara `attemptKey` como `unique: true`, mas isso nunca virou uma
// constraint real no Postgres (verificado direto no banco) — hoje a proteção contra
// duplicata é só a checagem `findOne` antes do `create` no controller, que tem uma
// janela de corrida entre duas requisições concorrentes.
//
// Ideal seria único por usuário (não global), mas o relacionamento com o usuário mora
// numa tabela de link separada (`quiz_attempts_user_lnk`), então uma constraint única
// composta exigiria duplicar a coluna de usuário nesta tabela — mudança estrutural
// maior, fora do escopo de uma migration de índice. Global já é proteção real (a chave
// já embute quiz+respostas+score, colisão entre usuários diferentes é bem improvável)
// e resolve a corrida que a checagem em código sozinha não fecha.
module.exports = {
  async up(knex) {
    // Ver comentário equivalente em 20260829120000: migrations de usuário rodam antes
    // do Strapi criar as tabelas novas no primeiro boot de uma feature.
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
