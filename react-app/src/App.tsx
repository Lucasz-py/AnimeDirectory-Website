import React, { useState, useEffect } from 'react';
import LiquidEtherBackground from './components/LiquidEtherBackground';
import Login from './components/Login';
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

        // Aquí está la corrección - data.session puede ser null
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

  const handleLogout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
    } catch (error: unknown) {
      console.error('Error al cerrar sesión:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al cerrar sesión';
      setError(errorMessage);
    }
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

  return (
    <div className="App">
      <LiquidEtherBackground />
      <div className="app-content">
        <h1>¡Bienvenido!</h1>
        <p>Has iniciado sesión como: {user.email}</p>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default App;
/*
import LetterGlitch from './components/LetterGlitch';
import Card, { CardBody } from './components/Card';
import List from './components/List';

function App() {
  const list = ['goku', 'vegeta', 'bulma'];

  return (
    <>
      <Card>
        <CardBody title='Hola Mundo' text='Este es el texto' />
        <List data={list} />
      </Card>
      <LetterGlitch
        glitchSpeed={50}
        centerVignette={true}
        outerVignette={false}
        smooth={true}
      />
    </>
  );
}

export default App;
*/
/*import Lightning from './components/Lightning';

function App() {
  return (<div style={{ width: '100%', height: '600px', position: 'relative' }}>
    <Lightning
      hue={220}
      xOffset={0}
      speed={1}
      intensity={1}
      size={1}
    />
  </div>
  )
}

export default App
*/


/*import LiquidEtherBackground from './components/LiquidEtherBackground';

function App() {
  return (
    <div className="App">
      <LiquidEtherBackground
        colors={["#52227F", "#FF00CC", "#00FFCC"]}
        particleCount={60}
      />
    </div>
  );
}

export default App;

/*
import Card, { CardBody } from './components/Card'
import List from './components/List'


function App() {
  const list = ['goku', 'vegeta', 'bulma']
  return <Card>
    <CardBody title='Hola Mundo' text='Este es el texto' />
    <List data={list} />
  </Card>
}

export default App
*/
