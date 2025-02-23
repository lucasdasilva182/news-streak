import db from '../db';

export const getTopEngagedUsersRepository = async () => {
  try {
    const result = await db.query(
      'SELECT email, current_streak FROM users ORDER BY current_streak DESC LIMIT 10'
    );
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar usuário: ', error);
    throw error;
  }
};

export const getActiveUsersRepository = async () => {
  try {
    const result = await db.query(`
    SELECT id, email, current_streak, max_count_streaks, last_opened
    FROM users
    WHERE last_opened >= NOW() - INTERVAL '7 days';
  `);
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar usuário: ', error);
    throw error;
  }
};

export const getStreaksRepository = async () => {
  try {
    const result = await db.query(`
      SELECT user_id, newsletter_id, date, utm_parameters
      FROM streaks;
    `);
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar usuário: ', error);
    throw error;
  }
};
