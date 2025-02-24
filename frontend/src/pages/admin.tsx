import { useEffect, useState, useMemo } from 'react';
import AdminService from '../services/AdminService';
import { Header } from '../components/header';
import Card from '../components/card';
import moment from 'moment';
import { PageLoadSpinner } from '../components/pageLoadSpinner';
import Button from '../components/button';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Filter, X } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface User {
  id: string;
  email: string;
  current_streak: number;
  max_count_streaks: number;
  last_opened: string;
}

export default function Admin() {
  const adminService = new AdminService();

  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [avgStreak, setAvgStreak] = useState(0);
  const [activeUsersLast7Days, setActiveUsersLast7Days] = useState(0);
  const [topUsers, setTopUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState({
    email: '',
    newsletter_id: '',
    start_date: null as Date | null,
    end_date: null as Date | null,
    streak_status: '',
  });

  const fetchGeneralMetrics = async () => {
    try {
      const response = await adminService.getGeneralMetrics();
      setTotalUsers(response.data.total_users);
      setAvgStreak(response.data.avg_streak);
    } catch (error) {
      console.error('Erro ao buscar métricas gerais:', error);
    }
  };

  const fetchTopUsers = async () => {
    try {
      const response = await adminService.getTopEngagedUsers();
      setTopUsers(response.data.sorted_users as User[]);
      setActiveUsersLast7Days(response.data.sorted_users.length);
    } catch (error) {
      console.error('Erro ao buscar ranking de usuários:', error);
    }
  };

  const applyFilters = async () => {
    try {
      const filtersParams = {
        email: filters.email,
        newsletter_id: filters.newsletter_id,
        start_date: filters.start_date ? moment(filters.start_date).format('YYYY-MM-DD') : '',
        end_date: filters.end_date ? moment(filters.end_date).format('YYYY-MM-DD') : '',
        streak_status: filters.streak_status,
      };
      const response = await adminService.getFilteredStats(filtersParams);
      setTopUsers([...(response.data.filtered_users as User[])]);
    } catch (error) {
      console.error('Erro ao aplicar filtros:', error);
    }
  };

  const clearFilters = () => {
    setFilters({
      email: '',
      newsletter_id: '',
      start_date: null,
      end_date: null,
      streak_status: '',
    });
  };

  const isAnyFilterApplied = () => {
    return (
      filters.email ||
      filters.newsletter_id ||
      filters.start_date ||
      filters.end_date ||
      filters.streak_status
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchGeneralMetrics(), fetchTopUsers()]);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = useMemo(() => {
    return {
      labels: topUsers.map((user) => user.email),
      datasets: [
        {
          label: 'Streak Atual',
          data: topUsers.map((user) => user.current_streak),
          borderColor: '#ffd700',
          fill: false,
        },
        {
          label: 'Streak Máximo',
          data: topUsers.map((user) => user.max_count_streaks),
          borderColor: '#210f0b',
          fill: false,
        },
      ],
    };
  }, [topUsers]);

  if (isLoading) {
    return <PageLoadSpinner />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="container flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-center md:text-start leading-[120%]">
          Dashboard administrativo
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className=" ">
            <p className="text-sm text-gray-500">Total de Leitores</p>
            <p className="text-2xl font-bold">{totalUsers}</p>
          </Card>
          <Card className=" ">
            <p className="text-sm text-gray-500">Média de Streaks</p>
            <p className="text-2xl font-bold">{avgStreak.toFixed(2)}</p>
          </Card>
          <Card className=" ">
            <p className="text-sm text-gray-500">Leitores Ativos (Últimos 7 Dias)</p>
            <p className="text-2xl font-bold">{activeUsersLast7Days}</p>
          </Card>
        </div>

        <div className="flex flex-col items-end md:flex-row w-full gap-4 mt-4">
          <div className="w-full">
            <label htmlFor="email-user">E-mail do usuário</label>

            <input
              name="email-user"
              type="text"
              placeholder="E-mail do usuário"
              value={filters.email}
              onChange={(e) => setFilters({ ...filters, email: e.target.value })}
              className="border px-2 py-1 !h-10 rounded w-full"
            />
          </div>
          <div className="w-full">
            <label htmlFor="id-newsletter">ID da Newsletter</label>

            <input
              name="id-newsletter"
              type="text"
              placeholder="ID da Newsletter"
              value={filters.newsletter_id}
              onChange={(e) => setFilters({ ...filters, newsletter_id: e.target.value })}
              className="border px-2 py-1 !h-10 rounded w-full"
            />
          </div>
          <div className="w-full">
            <label htmlFor="start-date">Última leitura</label>
            <DatePicker
              name="start-date"
              isClearable
              selected={filters.start_date}
              onChange={(date) => setFilters({ ...filters, start_date: date })}
              dateFormat="dd/MM/yyyy"
              placeholderText="Data de Início"
              className="border px-2 py-1 !h-10 rounded w-full"
            />
          </div>
          <div className="w-full">
            <DatePicker
              isClearable
              selected={filters.end_date}
              onChange={(date) => setFilters({ ...filters, end_date: date })}
              dateFormat="dd/MM/yyyy"
              placeholderText="Data de Fim"
              className="border px-2 py-1 !h-10 rounded w-full"
            />
          </div>
          <div className="w-full">
            <label htmlFor="status-streak">Status streak</label>

            <select
              name="status-streak"
              value={filters.streak_status}
              onChange={(e) => setFilters({ ...filters, streak_status: e.target.value })}
              className="border px-2 py-1 !h-10 rounded w-full"
            >
              <option value="">Todos os Status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>

          {isAnyFilterApplied() && (
            <Button
              onClick={clearFilters}
              className="!h-10 !min-w-fit bg-transparent hover:bg-transparent text-destructive"
            >
              <X size={18} />
            </Button>
          )}
          <Button onClick={applyFilters} className="!h-10 !min-w-fit">
            <Filter size={18} />
          </Button>
        </div>
        <div className="flex flex-col  md:grid md:grid-cols-4 w-full gap-4 "></div>

        {topUsers.length == 0 && <h2>Sem dados</h2>}

        {topUsers.length > 0 && (
          <>
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold">Padrões de Engajamento</h2>
              <Card className="flex flex-col gap-4">
                <Line key={JSON.stringify(chartData)} data={chartData} />
              </Card>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold">Ranking de Leitores</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">E-mail</th>
                      <th className="py-2 px-4 border-b">Streak Atual</th>
                      <th className="py-2 px-4 border-b">Máximo Streak</th>
                      <th className="py-2 px-4 border-b">Última Leitura</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b text-center">{user.current_streak}</td>
                        <td className="py-2 px-4 border-b text-center">{user.max_count_streaks}</td>
                        <td className="py-2 px-4 border-b text-center">
                          {moment.utc(user.last_opened).format('DD/MM/YYYY')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
