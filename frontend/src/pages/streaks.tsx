import { useEffect, useState } from 'react';
import UserService from '../services/UserService';
import { Header } from '../components/header';
import Card from '../components/card';
import { Check, Copy } from 'lucide-react';
import moment from 'moment';
import clsx from 'clsx';
import Calendar from '../components/calendar';
import { PageLoadSpinner } from '../components/pageLoadSpinner';
import Button from '../components/button';

interface ReadingHistoryItem {
  date: string;
}

export default function Streaks() {
  const userService = new UserService();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentStreaks, setCurrentStreaks] = useState<number>(0);
  const [maxCountStreaks, setMaxCountStreaks] = useState<number>(0);
  const [badges, setBadges] = useState<number>(0);
  const [markedDates, setMarkedDates] = useState<string[]>([]);
  const [readingHistory, setReadingHistory] = useState<ReadingHistoryItem[]>([]);

  const handleGetStats = async (email: string) => {
    try {
      const response = await userService.getUserStats({ email });
      setCurrentStreaks(response.data.current_streak);
      setReadingHistory(response.data.history as ReadingHistoryItem[]);
      setMaxCountStreaks(response.data.max_count_streaks);

      const markedDates = (response.data.history as ReadingHistoryItem[]).map(
        (item: ReadingHistoryItem) => {
          return moment.utc(item.date).format('YYYY-MM-DD');
        }
      );

      setMarkedDates(markedDates);
    } catch (error) {
      console.log('Erro ao buscar stats. ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const days = ['S', 'T', 'Q', 'Q', 'S', 'S'];
  const getWeekDay = (index: number) => {
    return days[index];
  };

  const getPhrase = () => {
    if (currentStreaks <= 0) {
      return 'Que tal dar uma lida no Dênius?';
    } else if (currentStreaks === 1) {
      return 'Seu primeiro dia!';
    } else {
      return 'Dias consecutivos!';
    }
  };

  const streakDays = new Set(
    readingHistory.map((item) => {
      return moment.utc(item.date).isoWeekday();
    })
  );

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      handleGetStats(user.email);
    }
  }, []);

  useEffect(() => {
    if (maxCountStreaks >= 6) {
      setBadges(1);
    } else if (maxCountStreaks >= 12) {
      setBadges(2);
    } else if (maxCountStreaks >= 18) {
      setBadges(3);
    }
  }, [maxCountStreaks]);

  if (isLoading) {
    return <PageLoadSpinner />;
  }

  return (
    <div className=" bg-gray-100">
      <Header />
      <div className="container flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-center md:text-start leading-[120%]">
          Bem-vindo!
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-center md:text-start text-primary ">
          Acompanhe aqui seu progresso de leitura
        </h2>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4">
          <Card className="flex flex-col md:flex-row gap-6 md:col-span-2 items-center justify-around">
            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="w-12">
                  <img
                    src="/fire.svg"
                    alt="Icone fogo"
                    className={`"w-full h-full object-cover object-center " ${
                      currentStreaks <= 0 ? 'grayscale' : ''
                    }`}
                  />
                </div>
                <div className="flex flex-col ">
                  <h3 className="text-2xl md:text-3xl font-extrabold">{currentStreaks}</h3>
                  <p className="text-accent">{getPhrase()}</p>
                </div>
              </div>
              <div>
                <div className="flex gap-4 ">
                  {days.map((_, i) => (
                    <div className="flex flex-col items-center justify-center" key={i}>
                      <div
                        className={clsx(
                          'h-6 w-6 rounded-full bg-background shadow-xl border border-muted relative ',
                          streakDays.has(i + 1) ? 'bg-success' : 'bg-background'
                        )}
                      >
                        {streakDays.has(i + 1) && (
                          <Check
                            size={16}
                            strokeWidth={3}
                            className="absolute text-white top-[4px] left-[3px]"
                          />
                        )}
                      </div>
                      <p className="font-bold text-accent">{getWeekDay(i)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col  gap-4">
              <Card className="!bg-background flex flex-col items-center justify-center">
                <h3 className="text-xl font-extrabold">{badges}</h3>
                <p className="text-accent text-xs">Badges</p>
              </Card>
              <div className="grid grid-cols-2 gap-4">
                <Card className="!bg-background flex flex-col items-center justify-center">
                  <h3 className="text-xl font-extrabold">{maxCountStreaks}</h3>
                  <p className="text-accent text-xs">Recorde pessoal</p>
                </Card>
                <Card className="!bg-background flex flex-col items-center justify-center">
                  <h3 className="text-xl font-extrabold">{readingHistory.length}</h3>
                  <p className="text-accent text-xs">Artigos lidos</p>
                </Card>
              </div>
            </div>
          </Card>
          <Card className="flex flex-col md:col-span-1 col-start-3 gap-2 items-center justify-center">
            <h3 className="text-xl md:text-2xl font-extrabold">Badges</h3>
            <p className="text-accent">Conquiste badges para ter o café</p>
            <div className="flex gap-4">
              <div className={clsx('w-16', badges === 1 ? '' : 'grayscale')}>
                <img
                  src="/badge-1.png"
                  alt="Badge chaleira"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className={clsx('w-16', badges === 2 ? '' : 'grayscale')}>
                <img
                  src="/badge-2.png"
                  alt="Badge grãos de café"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className={clsx('w-16', badges === 3 ? '' : 'grayscale')}>
                <img
                  src="/badge-3.png"
                  alt="Badge xícara"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-center md:text-start text-primary">
            Histórico de leituras
          </h2>
          <div className="flex flex-col gap-4 justify-center items-center md:grid md:grid-cols-2">
            <div className="flex flex-col justify-center items-center md:justify-start md:items-start gap-1">
              <Calendar markedDates={markedDates} />
              <div className="flex items-start md:items-center">
                <img
                  src="/full_streak.png"
                  alt="Xícara"
                  className="w-7 h-7 relative -top-1 object-cover object-center"
                />
                <p className="text-accent text-sm">
                  <span>Dias em que você leu estão marcados no calendário</span>
                </p>
              </div>
            </div>
            <div className="h-full flex flex-col justify-center items-center gap-4 md:justify-start md:items-start">
              <Card className="!bg-background shadow-lg">
                <div className="flex flex-col gap-2 ">
                  <h3 className="text-xl font-extrabold">💡Dica</h3>
                  <p className="text-accent">
                    Aproveite para ler um artigo do the news todos os dias, assim você se mantém
                    informado e ainda ganha badges!
                  </p>
                </div>
              </Card>

              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-extrabold">Compartilhe o the news</h3>
                  <p className="text-accent text-sm">
                    Compartilhe seu link de indicação único com seus amigos, colegas e familiares
                    para acumular indicações.
                  </p>
                </div>
                <div className="bg-white rounded-md border border-neutral-300 p-2 flex items-center gap-2 relative focus-within:border-b-2  placeholder-shown:border-b hover:border-neutral-500 transition-all w-full focus-within:border-b-primary focus-within:rounded-b-none focus-within:hover:border-b-primary text-neutral-black">
                  <input
                    disabled
                    type="text"
                    value={'https://app.thenewscc.com.br/subscribe'}
                    placeholder="Insira o seu melhor e-mail aqui..."
                    className="peer appearance-none flex-1 h-full focus-within:outline-none pointer-events-auto text-neutral-900 disabled:bg-neutral-200 disabled:text-neutral-500 disabled:bg-transparent px-0"
                  />
                  <Button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText('https://app.thenewscc.com.br/subscribe')
                    }
                  >
                    <Copy size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
