import BaseService from './BaseService';

interface GetFilteredStatsParams {
  newsletter_id: string;
  start_date: string;
  end_date: string;
  streak_status: string;
}

interface GeneralMetrics {
  data: {
    success: boolean;
    total_users: number;
    avg_streak: number;
  };
}

interface RankingTopUsers {
  data: {
    success: boolean;
    sorted_users: object[];
  };
}

interface FilteredStats {
  data: {
    success: boolean;
    filtered_users: object[];
  };
}

export default class AdminService extends BaseService {
  constructor() {
    super();
  }

  public getGeneralMetrics(): Promise<GeneralMetrics> {
    return this.requester.get(`${this.url}/admin/metrics`);
  }

  public getTopEngagedUsers(): Promise<RankingTopUsers> {
    return this.requester.get(`${this.url}/admin/ranking`);
  }

  public getFilteredStats(param: GetFilteredStatsParams): Promise<FilteredStats> {
    return this.requester.get(`${this.url}/admin/stats`, { params: param });
  }
}
