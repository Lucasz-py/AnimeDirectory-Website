import React, { useState } from 'react';
import supabase from '../lib/supabase';
import { User } from '../types/supabase';
import './Login.css';

interface LoginProps {
    onLogin?: (user: User) => void;
    onError?: (error: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onError }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isSignUp, setIsSignUp] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                // Registro de nuevo usuario
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) {
                    throw error;
                }

                if (data?.user && onLogin) {
                    onLogin(data.user);
                } else if (data?.user === null) {
                    throw new Error('No se pudo crear el usuario');
                }
            } else {
                // Inicio de sesión
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    throw error;
                }

                if (data?.user && onLogin) {
                    onLogin(data.user);
                } else if (data?.user === null) {
                    throw new Error('Credenciales incorrectas');
                }
            }

        } catch (error: unknown) {
            console.error('Error de autenticación:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error en la autenticación';
            if (onError) {
                onError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-overlay">
            <div className="login-container">
                <div className="login-card">
                    <h1 className="login-title">Lucasz-py</h1>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="input-group">
                            <label htmlFor="email" className="input-label">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="tu@email.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password" className="input-label">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="Tu contraseña"
                                required
                                disabled={loading}
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? 'Cargando...' : (isSignUp ? 'Registrarse' : 'Iniciar Sesión')}
                        </button>
                    </form>

                    <div className="auth-switch">
                        <p>
                            {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                            <button
                                type="button"
                                className="switch-button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                disabled={loading}
                            >
                                {isSignUp ? 'Iniciar sesión' : 'Registrarse'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;