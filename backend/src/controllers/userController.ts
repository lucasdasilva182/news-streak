import { Request, Response } from 'express';
import {
  createUserRepository,
  getUserByEmailRepository,
  updateUserMaxCountStreaksRepository,
} from '../repositories/userRepository';
import {
  addStreakController,
  getStreakHistoryController,
  updateStreakController,
} from './streakController';
import jwt from 'jsonwebtoken';

export const saveToDatabaseController = async (req: Request, res: Response) => {
  try {
    const {
      email,
      id,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_channel,
    }: {
      email: string;
      id: string;
      utm_source: string;
      utm_medium: string;
      utm_campaign: string;
      utm_channel: string;
    } = req.query as {
      email: string;
      id: string;
      utm_source: string;
      utm_medium: string;
      utm_campaign: string;
      utm_channel: string;
    };

    if (!email || !id) {
      return res.status(400).json({ success: false, message: 'Dados inválidos.' });
    }

    const utmParameters = {
      utm_source: utm_source || '',
      utm_medium: utm_medium || '',
      utm_campaign: utm_campaign || '',
      utm_channel: utm_channel || '',
    };

    let user = await getUserByEmailController(email);

    if (!user) {
      user = await createUserController(email);
    }

    await addStreakController(user.id, id, new Date(), utmParameters);

    await updateStreakController(user.id);

    user = await getUserByEmailController(email);

    if (user.max_count_streaks <= user.current_streak) {
      await updateUserMaxCountStreaksRepository(user.current_streak, user.id);
    }

    res.status(200).json({ success: true, message: 'Dados salvos com sucesso!' });
  } catch (error) {
    console.error('Erro ao processar o webhook:', error);
    res.status(500).json({ success: false, message: 'Erro ao processar o webhook.' });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'E-mail não fornecido.' });
    }

    let user = await getUserByEmailController(email);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    const token = jwt.sign(user, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        current_streak: user.current_streak,
        max_count_streaks: user.max_count_streaks,
        is_admin: user.is_admin,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login: ', error);
    res.status(500).json({ success: false, message: 'Erro ao fazer login.' });
  }
};

export const getUserStatsController = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ success: false, message: 'E-mail não fornecido.' });
    }

    const user = await getUserByEmailController(email as string);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    const history = await getStreakHistoryController(user.id);

    res.status(200).json({
      success: true,
      current_streak: user.current_streak,
      max_count_streaks: user.max_count_streaks,
      history,
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas: ', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar estatísticas.' });
  }
};

export const getUserByEmailController = async (email: string) => {
  try {
    const result = await getUserByEmailRepository(email);

    return result;
  } catch (error) {
    console.error('Erro ao buscar usuário: ', error);
  }
};

export const createUserController = async (email: string) => {
  try {
    const result = await createUserRepository(email);

    return result;
  } catch (error) {
    console.error('Erro ao criar usuário: ', error);
  }
};
