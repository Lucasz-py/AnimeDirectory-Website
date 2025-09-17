import React, { useState, useCallback, useEffect } from 'react';
import { Anime, User, UserProfile } from '../types/supabase';
import './FiltradorAnimes.css';

interface FiltradorAnimesProps {
    animes: Anime[];
    user: User | null;
    userProfile?: UserProfile | null;
    onFiltroChange: (animesFiltrados: Anime[]) => void;
}

type CriterioOrden = 'nombre' | 'fecha' | 'fecha2' | 'favorito' | 'rating';

// Función para normalizar texto (eliminar acentos y convertir a minúsculas)
const normalizarTexto = (texto: string): string => {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
};

// Clave base para localStorage
const CRITERIO_ORDEN_KEY = 'animeSortCriteria';

// Función segura para localStorage con prefijo de usuario
const safeLocalStorage = {
    getItem: (key: string, userId: string | null = null): string | null => {
        try {
            // Para usuarios no autenticados, usar una clave de sesión temporal
            const storageKey = userId ? `${userId}_${key}` : `guest_${key}`;
            return localStorage.getItem(storageKey);
        } catch (error) {
            console.error('Error al acceder a localStorage:', error);
            return null;
        }
    },
    setItem: (key: string, value: string, userId: string | null = null): void => {
        try {
            const storageKey = userId ? `${userId}_${key}` : `guest_${key}`;
            localStorage.setItem(storageKey, value);
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }
};

const FiltradorAnimes: React.FC<FiltradorAnimesProps> = ({ animes, user, userProfile, onFiltroChange }) => {
    // Obtener el criterio guardado o usar 'fecha' por defecto
    const [criterioOrden, setCriterioOrden] = useState<CriterioOrden>('fecha');
    const [busqueda, setBusqueda] = useState('');
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Cargar preferencias guardadas cuando el usuario esté disponible
    useEffect(() => {
        if (!isInitialized) {
            const userId = user?.id || null;
            const guardado = safeLocalStorage.getItem(CRITERIO_ORDEN_KEY, userId);

            // Validar que el valor guardado es un criterio válido
            if (guardado && ['nombre', 'fecha', 'fecha2', 'favorito', 'rating'].includes(guardado)) {
                setCriterioOrden(guardado as CriterioOrden);
            }
            setIsInitialized(true);
        }
    }, [user, isInitialized]);

    // Guardar el criterio en localStorage cuando cambie
    useEffect(() => {
        if (isInitialized) {
            const userId = user?.id || null;
            safeLocalStorage.setItem(CRITERIO_ORDEN_KEY, criterioOrden, userId);
        }
    }, [criterioOrden, user, isInitialized]);

    // Función para obtener el nombre de usuario a mostrar
    const getDisplayName = () => {
        if (userProfile?.username) {
            return userProfile.username;
        }
        if (user?.email) {
            return user.email.split('@')[0];
        }
        if (user?.id) {
            return `User_${user.id.slice(0, 6)}`;
        }
        return 'Guest';
    };

    const aplicarFiltros = useCallback(() => {
        let animesFiltrados = [...animes];

        // Aplicar filtro de búsqueda
        if (busqueda) {
            const busquedaNormalizada = normalizarTexto(busqueda);

            animesFiltrados = animesFiltrados.filter(anime => {
                const tituloNormalizado = normalizarTexto(anime.titulo);
                const generosNormalizados = anime.generos.map(genero => normalizarTexto(genero));

                return (
                    tituloNormalizado.includes(busquedaNormalizada) ||
                    generosNormalizados.some(genero => genero.includes(busquedaNormalizada))
                );
            });
        }

        // Aplicar ordenamiento
        switch (criterioOrden) {
            case 'nombre':
                animesFiltrados.sort((a, b) => a.titulo.localeCompare(b.titulo));
                break;
            case 'fecha':
                animesFiltrados.sort((a, b) => {
                    const fechaA = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const fechaB = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return fechaB - fechaA; // Más recientes primero
                });
                break;
            case 'fecha2':
                animesFiltrados.sort((a, b) => {
                    const fechaA = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const fechaB = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return fechaA - fechaB; // Más antiguos primero
                });
                break;
            case 'favorito':
                animesFiltrados.sort((a, b) => {
                    if (a.estado === 'Favorito' && b.estado !== 'Favorito') return -1;
                    if (a.estado !== 'Favorito' && b.estado === 'Favorito') return 1;
                    return 0;
                });
                break;
            case 'rating':
                animesFiltrados.sort((a, b) => b.rating - a.rating); // Mayor rating primero
                break;
            default:
                break;
        }

        onFiltroChange(animesFiltrados);
    }, [animes, busqueda, criterioOrden, onFiltroChange]);

    // Aplicar filtros cuando cambien los criterios
    useEffect(() => {
        aplicarFiltros();
    }, [aplicarFiltros]);

    const limpiarFiltros = () => {
        setCriterioOrden('fecha');
        setBusqueda('');
        setMostrarFiltros(false);
    };

    const toggleFiltros = () => {
        setMostrarFiltros(!mostrarFiltros);
    };

    return (
        <div className="filtrador-container">
            <div className="filtrador-header">
                <div className="welcome-message">
                    <span className="welcome-text">
                        🏯Welcome, <span className="username">{getDisplayName()}</span>!
                    </span>
                </div>

                <div className="filtros-buttons">
                    <button onClick={toggleFiltros} className="btn-filtrar">
                        {mostrarFiltros ? 'Cerrar' : 'Filtrar'}
                    </button>

                    {mostrarFiltros && (
                        <button onClick={limpiarFiltros} className="btn-limpiar">
                            Limpiar
                        </button>
                    )}
                </div>
            </div>

            {mostrarFiltros && (
                <div className="filtros-content">
                    <div className="filtro-busqueda">
                        <label>Buscar por:</label>
                        <input
                            type="text"
                            placeholder="Buscar por título o género..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="input-busqueda"
                        />
                    </div>

                    <div className="filtro-orden">
                        <label>Ordenar por:</label>
                        <select
                            value={criterioOrden}
                            onChange={(e) => setCriterioOrden(e.target.value as CriterioOrden)}
                            className="select-orden"
                        >
                            <option value="fecha">⬆️Más recientes primero</option>
                            <option value="fecha2">⬇️Más antiguo primero</option>
                            <option value="nombre">🖋️Nombre (A-Z)</option>
                            <option value="favorito">❤️Favoritos primero</option>
                            <option value="rating">⭐Mayor rating primero</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FiltradorAnimes;