import db from '../db';
import { User } from '../types';

export const getUserByEmailRepository = async (email: string): Promise<any> => {
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erro ao buscar usuário: ', error);
    throw error;
  }
};

export const createUserRepository = async (email: string): Promise<User> => {
  try {
    const result = await db.query('INSERT INTO users (email) VALUES ($1) RETURNING *', [email]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao criar usuário: ', error);
    throw error;
  }
};

export const updateUserCurrrentStreakRepository = async (streakCount: number, user_id: number) => {
  try {
    await db.query(
      'UPDATE users SET current_streak = $1, last_opened = CURRENT_DATE WHERE id = $2',
      [streakCount, user_id]
    );
  } catch (error) {
    console.error('Erro ao atualizar streaks: ', error);
    throw error;
  }
};

export const updateUserMaxCountStreaksRepository = async (
  maxCountStreaks: number,
  user_id: number
) => {
  try {
    await db.query('UPDATE users SET max_count_streaks = $1 WHERE id = $2', [
      maxCountStreaks,
      user_id,
    ]);
  } catch (error) {
    console.error('Erro ao atualizar os badges: ', error);

    throw error;
  }
};
