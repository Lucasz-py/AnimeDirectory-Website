import { useState, useEffect } from 'react';
import LiquidEtherBackground from './components/LiquidEtherBackground';
import Login from './components/Login';
import DirectorioAnimes from './components/DirectorioAnimes';
import supabase from './lib/supabase';
import { User, Session } from './types/supabase';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Verificar sesión activa al cargar
  useEffect(() => {
    const getSession = async (): Promise<void> => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (data.session?.user) {
          setUser(data.session.user);
        }
      } catch (error: unknown) {
        console.error('Error obteniendo sesión:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error al obtener sesión';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: string, session: Session | null) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          setError('');
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (userData: User): void => {
    setUser(userData);
    setError('');
  };

  const handleError = (errorMessage: string): void => {
    setError(errorMessage);
  };

  if (loading) {
    return (
      <div className="App">
        <LiquidEtherBackground />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="App">
        <LiquidEtherBackground />
        <Login onLogin={handleLogin} onError={handleError} />
        {error && (
          <div className="error-toast">
            {error}
          </div>
        )}
      </div>
    );
  }

  // SOLO DIRECTORIO - SIN BACKGROUND
  return <DirectorioAnimes />;
}

export default App;