import { useEffect, useState } from 'react';
import Button from '../components/button';
import { Clock, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from '../components/spinner';
import { useSearchParams } from 'react-router-dom';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await login(email);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
      setAutoLogin(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (email) {
      (async () => {
        await handleLogin();
      })();
    }
  }, [autoLogin]);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-164px)] bg-background">
      <div className="container grid grid-cols-12">
        <span></span>
        <div className="col-span-12 md:col-span-6 flex flex-col">
          <div className="w-full flex flex-col justify-start items-center md:items-start mb-8">
            <div className="rounded shadow-md overflow-hidden h-24 w-24 mb-2">
              <img
                src="/logo-the-news.webp"
                alt="Logo"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <p className="font-black text-primary text-4xl">news</p>
          </div>
          <span className="flex gap-2 items-center text-lg mb-8 justify-center md:justify-normal">
            <Clock className="text-primary" /> sempre às 07:07 da manhã
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold text-center md:text-start leading-[120%] mb-4">
            o melhor jornal digital do país ☕
          </h1>

          <p className="w-full text-center md:text-left text-md sm:text-lg font-regular mb-12 ">
            tudo que você precisa saber pra começar seu dia mais informado.
          </p>

          <form
            className="flex flex-col justify-center items-center md:grid md:grid-cols-6 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="flex w-full max-w-[350px] min-w-[350px] md:max-w-[410px] md:min-w-[410px] md:col-span-5 col-span-12 flex-col gap-2 md:gap-0">
              <div className="w-full bg-white rounded-md border border-neutral-300 p-2 flex items-center gap-2 relative focus-within:border-b-2  placeholder-shown:border-b hover:border-neutral-500 transition-all focus-within:border-b-primary focus-within:rounded-b-none focus-within:hover:border-b-primary text-neutral-black">
                <div className="p-2 text-inherit">
                  <Mail />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Insira o seu melhor e-mail aqui..."
                  className="appearance-none flex-1 h-full focus-within:outline-none pointer-events-auto text-neutral-900 disabled:bg-neutral-200 disabled:text-neutral-500 px-0"
                />
                <Button className="hidden md:flex" type="submit" disabled={isLoading}>
                  {isLoading ? <Spinner color="foreground" size="small" /> : 'entrar'}
                </Button>
              </div>
            </div>
            <Button
              className="flex md:hidden w-full max-w-[350px]"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <Spinner color="foreground" size="small" /> : 'entrar'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
