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
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isSignUp, setIsSignUp] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                // Validaciones de registro
                if (!username.trim()) {
                    throw new Error('El nombre de usuario es requerido');
                }
                if (!email.includes('@')) {
                    throw new Error('Ingresa un email válido');
                }
                if (password.length < 6) {
                    throw new Error('La contraseña debe tener al menos 6 caracteres');
                }
                if (password !== confirmPassword) {
                    throw new Error('Las contraseñas no coinciden');
                }

                // Registro de nuevo usuario con Supabase
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username: username.trim()
                        }
                    }
                });

                if (error) {
                    throw error;
                }

                if (data.user && onLogin) {
                    onLogin(data.user);
                } else {
                    // Si no hay error pero no hay usuario, puede ser que necesite confirmación de email
                    throw new Error('Te hemos enviado un email de confirmación. Por favor verifica tu cuenta.');
                }
            } else {
                // Inicio de sesión (puede ser con email o username)
                let authIdentifier = email;

                // Si el input no contiene @, asumimos que es un username
                if (!email.includes('@')) {
                    try {
                        // Buscar el usuario por username en la tabla de perfiles
                        const { data: profileData, error: profileError } = await supabase
                            .from('profiles')
                            .select('email')
                            .eq('username', email.trim())
                            .single();

                        if (profileError || !profileData) {
                            throw new Error('Usuario no encontrado');
                        }
                        authIdentifier = profileData.email;
                    } catch (error) {
                        throw new Error('Usuario no encontrado');
                    }
                }

                // Iniciar sesión con Supabase
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: authIdentifier,
                    password,
                });

                if (error) {
                    throw error;
                }

                if (data.user && onLogin) {
                    onLogin(data.user);
                } else {
                    throw new Error('Error al iniciar sesión');
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

    const resetForm = () => {
        setEmail('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="login-overlay">
            <div className="login-container">
                <div className="login-card">
                    <h1 className="login-title">Anime collection</h1>

                    <form onSubmit={handleSubmit} className="login-form">
                        {isSignUp && (
                            <div className="input-group">
                                <label htmlFor="username" className="input-label">
                                    Nombre de usuario *
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                    className="input-field"
                                    placeholder="Tu nombre de usuario único"
                                    required={isSignUp}
                                    disabled={loading}
                                    pattern="[a-zA-Z0-9_]+"
                                    title="Solo letras, números y guiones bajos"
                                />
                                <span className="help-text">Solo letras, números y guiones bajos</span>
                            </div>
                        )}

                        <div className="input-group">
                            <label htmlFor="email" className="input-label">
                                {isSignUp ? 'Email *' : 'Email o User'}
                            </label>
                            <input
                                type="text"
                                id="email"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder={isSignUp ? "tu@email.com" : "Email o nombre de usuario"}
                                required
                                disabled={loading}
                            />
                            {!isSignUp && (
                                <span className="help-text"></span>
                            )}
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
                                placeholder="contraseña"
                                required
                                disabled={loading}
                                minLength={6}
                            />
                            <span className="help-text">Mínimo 6 caracteres</span>
                        </div>

                        {isSignUp && (
                            <div className="input-group">
                                <label htmlFor="confirmPassword" className="input-label">
                                    Confirmar Contraseña *
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                    className="input-field"
                                    placeholder="Repite tu contraseña"
                                    required={isSignUp}
                                    disabled={loading}
                                    minLength={6}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? 'Cargando...' : (isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión')}
                        </button>
                    </form>

                    <div className="auth-switch">
                        <p>
                            {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                            <button
                                type="button"
                                className="switch-button"
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    resetForm();
                                }}
                                disabled={loading}
                            >
                                {isSignUp ? 'Iniciar sesión' : 'Crear cuenta'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;