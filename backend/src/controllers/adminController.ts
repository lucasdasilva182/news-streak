import { Request, Response } from 'express';
import {
  getActiveUsersRepository,
  getAllUsersRepository,
  getStreaksRepository,
} from '../repositories/adminRepository';
import moment from 'moment';

export const getGeneralMetricsController = async (req: Request, res: Response) => {
  try {
    const users = await getActiveUsersRepository();

    const total_users = users.length;
    const avg_streak = users.reduce((sum, user) => sum + user.current_streak, 0) / total_users;

    res.status(200).json({ success: true, total_users, avg_streak });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao buscar métricas.' });
  }
};

export const getTopEngagedUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getActiveUsersRepository();
    const sortedUsers = users.sort((a, b) => b.current_streak - a.current_streak);
    const limit = parseInt(req.query.limit as string) || 100;

    const sorted_users = sortedUsers.slice(0, limit);

    res.status(200).json({ success: true, sorted_users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao buscar ranking.' });
  }
};

export const getFilteredStatsController = async (req: Request, res: Response) => {
  try {
    const streaks = await getStreaksRepository();
    const users = await getAllUsersRepository();

    const { email, newsletter_id, start_date, end_date, streak_status, last_opened } = req.query;

    let filtered_users = users;

    if (email) {
      filtered_users = filtered_users.filter((user) =>
        user.email.toLowerCase().includes((email as string).toLowerCase())
      );
    }

    if (newsletter_id) {
      filtered_users = filtered_users.filter((user) =>
        streaks.some(
          (streak) => streak.user_id === user.id && streak.newsletter_id === newsletter_id
        )
      );
    }

    if (streak_status === 'active') {
      filtered_users = filtered_users.filter((user) => user.current_streak > 0);
    } else if (streak_status === 'inactive') {
      filtered_users = filtered_users.filter((user) => user.current_streak === 0);
    }

    if (start_date || end_date) {
      const startDateNormalized = start_date
        ? moment(start_date as string, 'YYYY-MM-DD').startOf('day')
        : null;
      const endDateNormalized = end_date
        ? moment(end_date as string, 'YYYY-MM-DD').endOf('day')
        : null;

      filtered_users = filtered_users.filter((user) => {
        if (!user.last_opened) return false;

        const userLastOpened = moment(user.last_opened).startOf('day');

        if (startDateNormalized && endDateNormalized) {
          return userLastOpened.isBetween(startDateNormalized, endDateNormalized, null, '[]');
        } else if (startDateNormalized) {
          return userLastOpened.isSameOrBefore(startDateNormalized);
        } else if (endDateNormalized) {
          return userLastOpened.isSameOrBefore(endDateNormalized);
        }

        return true;
      });
    }

    res.status(200).json({ success: true, filtered_users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao buscar estatísticas filtradas.' });
  }
};
