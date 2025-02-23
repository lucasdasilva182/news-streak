import db from '../db';
import { Streak } from '../types';

export const addNewStreakRepository = async (
  user_id: number,
  newsletter_id: string,
  date: Date,
  utmParameters: {
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_channel: string | null;
  }
): Promise<Streak> => {
  try {
    const result = await db.query(
      'INSERT INTO streaks (user_id, newsletter_id, date, utm_parameters) VALUES ($1, $2, $3, $4::jsonb) RETURNING *',
      [user_id, newsletter_id, date, JSON.stringify(utmParameters)]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao adicionar novo streak: ', error);
    throw error;
  }
};

export const getExistingStreakRepository = async (user_id: number, date: Date): Promise<Streak> => {
  try {
    const result = await db.query('SELECT * FROM streaks WHERE user_id = $1 AND date = $2', [
      user_id,
      date,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao buscar streak: ', error);
    throw error;
  }
};

export const getStreakHistoryRepository = async (user_id: number) => {
  try {
    const result = await db.query('SELECT * FROM streaks WHERE user_id = $1 ORDER BY date ASC', [
      user_id,
    ]);
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar histórico de streaks: ', error);
    throw error;
  }
};

export const getStreakDatesRepository = async (user_id: number) => {
  try {
    const result = await db.query('SELECT date FROM streaks WHERE user_id = $1 ORDER BY date ASC', [
      user_id,
    ]);
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar datas de streaks: ', error);
    throw error;
  }
};
