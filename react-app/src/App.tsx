import { useState, useEffect } from 'react';
import Login from './components/Login';
import DirectorioAnimes from './components/DirectorioAnimes';
import supabase from './lib/supabase';
import { User } from './types/supabase';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('🔍 App useEffect ejecutado');

    // Obtener sesión inicial
    const initializeAuth = async () => {
      try {
        console.log('🔄 Inicializando autenticación...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('❌ Error obteniendo sesión:', sessionError);
          setError('Error al cargar la sesión');
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('✅ Usuario autenticado:', session.user.id);
          setUser(session.user);
        } else {
          console.log('ℹ️ No hay usuario autenticado');
        }
      } catch (error) {
        console.error('❌ Error inicializando auth:', error);
        setError('Error al inicializar');
      } finally {
        console.log('✅ Loading terminado');
        setLoading(false);
      }
    };

    initializeAuth();

    // Suscripción a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event);

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ Usuario inició sesión:', session.user.id);
          setUser(session.user);
          setError('');
        } else if (event === 'SIGNED_OUT') {
          console.log('✅ Usuario cerró sesión');
          setUser(null);
          setError('');
        }
      }
    );

    // Timeout de seguridad
    const safetyTimeout = setTimeout(() => {
      console.log('⏰ Timeout de seguridad: Forzando fin de loading');
      setLoading(false);
    }, 5000); // 5 segundos

    return () => {
      console.log('🧹 Limpiando useEffect');
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setError('');
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleLogout = async () => {
    try {
      console.log('🚪 Cerrando sesión...');
      await supabase.auth.signOut();
      setUser(null);
      setError('');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setError('Error al cerrar sesión');
    }
  };

  console.log('🔄 App renderizado - loading:', loading, 'user:', user?.id);

  if (loading) {
    console.log('⏳ Mostrando pantalla de carga...');
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
        <button
          onClick={() => {
            console.log('🔄 Reiniciando manualmente...');
            window.location.href = '/'; // Redirección completa
          }}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: 'rgba(102, 126, 234, 0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!user) {
    console.log('👤 No hay usuario, mostrando Login');
    return (
      <div className="App">
        <Login onLogin={handleLogin} onError={handleError} />
        {error && <div className="error-toast">{error}</div>}
      </div>
    );
  }

  console.log('🎬 Mostrando DirectorioAnimes para usuario:', user.id);
  return (
    <div className="App">
      <DirectorioAnimes
        user={user}
        onLogout={handleLogout}
      />
      {error && <div className="error-toast">{error}</div>}
    </div>
  );
}

export default App;