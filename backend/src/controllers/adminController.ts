import { Request, Response } from 'express';
import { getActiveUsersRepository, getStreaksRepository } from '../repositories/adminRepository';

export const getGeneralMetricsController = async (req: Request, res: Response) => {
  try {
    const users = await getActiveUsersRepository();

    const totalUsers = users.length;
    const avgStreak = users.reduce((sum, user) => sum + user.current_streak, 0) / totalUsers;

    res.json({ success: true, data: { totalUsers, avgStreak } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao buscar métricas.' });
  }
};

export const getTopEngagedUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getActiveUsersRepository();
    const sortedUsers = users.sort((a, b) => b.current_streak - a.current_streak);
    const limit = parseInt(req.query.limit as string) || 10;

    res.json({ success: true, data: sortedUsers.slice(0, limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao buscar ranking.' });
  }
};

export const getFilteredStatsController = async (req: Request, res: Response) => {
  try {
    const streaks = await getStreaksRepository();
    const { newsletter_id, start_date, end_date, streak_status } = req.query;

    let filteredStreaks = streaks;

    if (newsletter_id) {
      filteredStreaks = filteredStreaks.filter((streak) => streak.newsletter_id === newsletter_id);
    }
    if (start_date) {
      filteredStreaks = filteredStreaks.filter(
        (streak) => streak.date >= new Date(start_date as string)
      );
    }
    if (end_date) {
      filteredStreaks = filteredStreaks.filter(
        (streak) => streak.date <= new Date(end_date as string)
      );
    }
    if (streak_status === 'active') {
      filteredStreaks = filteredStreaks.filter((streak) => streak.current_streak > 0);
    } else if (streak_status === 'inactive') {
      filteredStreaks = filteredStreaks.filter((streak) => streak.current_streak === 0);
    }

    res.json({ success: true, data: filteredStreaks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao buscar estatísticas filtradas.' });
  }
};
