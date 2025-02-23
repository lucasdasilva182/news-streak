import { Footer } from './components/footer';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';
import { Toaster } from 'sonner';

function App() {
  return (
    <div className="">
      <AuthProvider>
        <Toaster richColors />
        <AppRoutes />
        <Footer />
      </AuthProvider>
    </div>
  );
}

export default App;
