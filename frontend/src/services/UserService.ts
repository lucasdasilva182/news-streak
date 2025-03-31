import { User } from '../types';
import BaseService from './BaseService';

interface GetUserStatsParams {
  email: string;
}
interface ConfirmReadingParams {
  email: string;
  date: string;
}

interface UserLogin {
  data: {
    success: boolean;
    token: string;
    user: User;
  };
}

interface UserStats {
  data: {
    success: boolean;
    current_streak: number;
    history: object[];
    max_count_streaks: number;
  };
}

export default class UserService extends BaseService {
  constructor() {
    super();
  }

  public login(param: GetUserStatsParams): Promise<UserLogin> {
    return this.requester.post(`${this.url}/login`, param);
  }

  public getUserStats(param: GetUserStatsParams): Promise<UserStats> {
    return this.requester.get(`${this.url}/user/stats`, { params: param });
  }

  public confirmReading(param: ConfirmReadingParams): Promise<UserLogin> {
    return this.requester.get(`${this.url}/?email=${param.email}&id=${param.date}`);
  }
}
