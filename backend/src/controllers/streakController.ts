import {
  addNewStreakRepository,
  getExistingStreakRepository,
  getStreakDatesRepository,
  getStreakHistoryRepository,
} from '../repositories/streakRepository';
import { updateUserCurrrentStreakRepository } from '../repositories/userRepository';
import { Streak } from '../types';

export const addStreakController = async (
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
    const existingStreak = await getExistingStreakRepository(user_id, date);

    if (existingStreak) {
      return existingStreak;
    }

    if (new Date(date).getDay() === 0) {
      throw new Error('Não é possível adicionar streaks aos domingos.');
    }

    const result = await addNewStreakRepository(user_id, newsletter_id, date, utmParameters);

    return result;
  } catch (error) {
    console.error('Erro ao adicionar streak:', error);
    throw error;
  }
};

export const updateStreakController = async (user_id: number) => {
  try {
    const datesResult = await getStreakDatesRepository(user_id);
    console.log(datesResult);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streakCount = 0;
    let previousDate = null;

    if (!datesResult || datesResult.length === 0) {
      await updateUserCurrrentStreakRepository(0, user_id);
      return;
    }

    datesResult.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const lastDate = new Date(datesResult[0].date);
    lastDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays > 1 && lastDate.getDay() !== 0) {
      await updateUserCurrrentStreakRepository(0, user_id);
      return;
    }

    for (let i = 0; i < datesResult.length; i++) {
      const currentDate = new Date(datesResult[i].date);
      currentDate.setHours(0, 0, 0, 0);

      if (i === 0) {
        streakCount++;
        previousDate = currentDate;
      } else if (previousDate) {
        const diffTime = previousDate.getTime() - currentDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
          streakCount++;
        } else if (diffDays === 2 && [5, 6].includes(currentDate.getDay())) {
          streakCount++;
        } else {
          break;
        }
      }

      previousDate = currentDate;
    }

    await updateUserCurrrentStreakRepository(streakCount, user_id);
  } catch (error) {
    console.error('Erro ao atualizar streak:', error);
    throw error;
  }
};

export const getStreakHistoryController = async (user_id: number) => {
  try {
    const result = await getStreakHistoryRepository(user_id);
    return result;
  } catch (error) {
    console.error('Erro ao buscar histórico de streaks:', error);
    throw error;
  }
};
