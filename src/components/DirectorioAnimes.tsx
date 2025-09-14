import React, { useState, useEffect, useCallback } from 'react';
import supabase from '../lib/supabase';
import { User, UserProfile } from '../types/supabase';
import './DirectorioAnimes.css';

// Definir tipo para el estado
type EstadoAnime = 'Visto' | 'Viéndolo' | 'Por ver' | 'Favorito';

interface Anime {
    id: number;
    user_id: string;
    titulo: string;
    portada: string;
    descripcion: string;
    generos: string[];
    estado: EstadoAnime;
    rating: number;
    created_at?: string;
}

interface DirectorioAnimesProps {
    user: User | null;
    userProfile?: UserProfile | null;
    onLogout?: () => void;
}

const DirectorioAnimes: React.FC<DirectorioAnimesProps> = ({ user, onLogout }) => {
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editandoAnime, setEditandoAnime] = useState<Anime | null>(null);
    const [nuevoAnime, setNuevoAnime] = useState({
        titulo: '',
        portada: '',
        descripcion: '',
        generos: [] as string[],
        estado: 'Visto' as EstadoAnime,
        rating: 0
    });

    console.log('🔍 DirectorioAnimes renderizado - user:', user?.id, 'loading:', loading);

    // Cargar animes del usuario desde Supabase
    const cargarAnimes = useCallback(async () => {
        try {
            console.log('🔄 Intentando cargar animes...');
            setLoading(true);

            if (!user?.id) {
                console.log('❌ No hay user.id, no se pueden cargar animes');
                setAnimes([]);
                return;
            }

            console.log('🔍 Cargando animes para usuario:', user.id);

            const { data, error } = await supabase
                .from('animes')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('❌ Error de Supabase:', error);
                throw error;
            }

            console.log('✅ Animes cargados:', data?.length || 0);
            setAnimes(data || []);
        } catch (error) {
            console.error('❌ Error cargando animes:', error);
            setAnimes([]);
        } finally {
            console.log('✅ Carga de animes completada');
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        console.log('🔍 useEffect DirectorioAnimes - user:', user?.id);
        if (user && user.id) {
            console.log('✅ Usuario válido, cargando animes');
            cargarAnimes();
        } else {
            console.log('❌ No hay usuario válido, deteniendo carga');
            setLoading(false);
            setAnimes([]);
        }
    }, [user, cargarAnimes]);

    const agregarAnime = async () => {
        try {
            if (!user?.id) {
                console.error('❌ No hay usuario al agregar anime');
                return;
            }

            console.log('➕ Agregando anime para usuario:', user.id);

            const { data, error } = await supabase
                .from('animes')
                .insert([
                    {
                        ...nuevoAnime,
                        user_id: user.id,
                        generos: nuevoAnime.generos
                    }
                ])
                .select();

            if (error) {
                console.error('❌ Error de Supabase al insertar:', error);
                throw error;
            }

            if (data && data[0]) {
                console.log('✅ Anime agregado exitosamente');
                setAnimes([data[0], ...animes]);
                setNuevoAnime({
                    titulo: '',
                    portada: '',
                    descripcion: '',
                    generos: [],
                    estado: 'Visto',
                    rating: 0
                });
                setMostrarFormulario(false);
            }
        } catch (error) {
            console.error('❌ Error agregando anime:', error);
            alert('Error al agregar el anime. Por favor verifica la consola para más detalles.');
        }
    };

    const actualizarAnime = async () => {
        try {
            if (!editandoAnime?.id) {
                console.error('❌ No hay anime para editar');
                return;
            }

            console.log('✏️ Actualizando anime:', editandoAnime.id);

            const { data, error } = await supabase
                .from('animes')
                .update({
                    titulo: nuevoAnime.titulo,
                    portada: nuevoAnime.portada,
                    descripcion: nuevoAnime.descripcion,
                    generos: nuevoAnime.generos,
                    estado: nuevoAnime.estado,
                    rating: nuevoAnime.rating
                })
                .eq('id', editandoAnime.id)
                .select();

            if (error) {
                console.error('❌ Error de Supabase al actualizar:', error);
                throw error;
            }

            if (data && data[0]) {
                console.log('✅ Anime actualizado exitosamente');
                setAnimes(animes.map(anime =>
                    anime.id === editandoAnime.id ? data[0] : anime
                ));
                setEditandoAnime(null);
                setNuevoAnime({
                    titulo: '',
                    portada: '',
                    descripcion: '',
                    generos: [],
                    estado: 'Visto',
                    rating: 0
                });
                setMostrarFormulario(false);
            }
        } catch (error) {
            console.error('❌ Error actualizando anime:', error);
            alert('Error al actualizar el anime. Por favor verifica la consola para más detalles.');
        }
    };

    const eliminarAnime = async (id: number) => {
        try {
            if (!confirm('¿Estás seguro de que quieres eliminar este anime?')) {
                return;
            }

            console.log('🗑️ Eliminando anime:', id);

            const { error } = await supabase
                .from('animes')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('❌ Error de Supabase al eliminar:', error);
                throw error;
            }

            console.log('✅ Anime eliminado exitosamente');
            setAnimes(animes.filter(anime => anime.id !== id));
        } catch (error) {
            console.error('❌ Error eliminando anime:', error);
            alert('Error al eliminar el anime. Por favor verifica la consola para más detalles.');
        }
    };

    const iniciarEdicion = (anime: Anime) => {
        setEditandoAnime(anime);
        setNuevoAnime({
            titulo: anime.titulo,
            portada: anime.portada,
            descripcion: anime.descripcion,
            generos: anime.generos,
            estado: anime.estado,
            rating: anime.rating
        });
        setMostrarFormulario(true);
    };

    const cancelarEdicion = () => {
        setEditandoAnime(null);
        setNuevoAnime({
            titulo: '',
            portada: '',
            descripcion: '',
            generos: [],
            estado: 'Visto',
            rating: 0
        });
        setMostrarFormulario(false);
    };

    const handleLogout = () => {
        if (onLogout) {
            console.log('🚪 Cerrando sesión');
            onLogout();
        }
    };

    if (loading) {
        console.log('⏳ DirectorioAnimes: Mostrando loading...');
        return (
            <div className="directorio-completo">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando tu biblioteca...</p>
                </div>
            </div>
        );
    }

    // Si no hay usuario, mostrar mensaje
    if (!user) {
        console.log('❌ DirectorioAnimes: No hay usuario');
        return (
            <div className="directorio-completo">
                <div className="no-user-message">
                    <p>Por favor inicia sesión para acceder a tu biblioteca.</p>
                </div>
            </div>
        );
    }

    console.log('✅ DirectorioAnimes: Mostrando contenido para usuario:', user.id);
    return (
        <div className="directorio-completo">
            <div className="directorio-fondo"></div>
            <div className="directorio-contenido">
                <header className="directorio-header">
                    <div className="header-top">
                        {/* Izquierda: Texto "Biblioteca" */}
                        <div className="header-left">
                            <h1 className="header-title"> ⛩️BIBLIOTECA</h1>
                        </div>

                        {/* Centro: Logo */}
                        <div className="header-center">
                            <img
                                src="/logomain.png"
                                alt="Logo"
                                className="header-logo"
                            />
                        </div>

                        {/* Derecha: Botones */}
                        <div className="header-right">
                            <button onClick={() => setMostrarFormulario(true)} className="btn-primary">
                                + Agregar Anime
                            </button>
                            {onLogout && (
                                <button onClick={handleLogout} className="logout-btn">
                                    Cerrar Sesión
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Formulario para agregar/editar anime */}
                {mostrarFormulario && (
                    <div className="formulario-overlay">
                        <div className="formulario-anime">
                            <h2>{editandoAnime ? '-Editar Anime-' : '-Agregar Nuevos Animes-'}</h2>

                            <div className="form-group">
                                <label>Título:</label>
                                <input
                                    type="text"
                                    value={nuevoAnime.titulo}
                                    onChange={(e) => setNuevoAnime({ ...nuevoAnime, titulo: e.target.value })}
                                    placeholder="Nombre del anime"
                                />
                            </div>

                            <div className="form-group">
                                <label>URL de la portada:</label>
                                <input
                                    type="text"
                                    value={nuevoAnime.portada}
                                    onChange={(e) => setNuevoAnime({ ...nuevoAnime, portada: e.target.value })}
                                    placeholder="https://ejemplo.com/portada.jpg"
                                />
                            </div>

                            <div className="form-group">
                                <label>Descripción:</label>
                                <textarea
                                    value={nuevoAnime.descripcion}
                                    onChange={(e) => setNuevoAnime({ ...nuevoAnime, descripcion: e.target.value })}
                                    placeholder="Sinopsis del anime"
                                    rows={3}
                                />
                            </div>

                            <div className="form-group">
                                <label>Géneros (separados por coma):</label>
                                <input
                                    type="text"
                                    value={nuevoAnime.generos.join(', ')}
                                    onChange={(e) => setNuevoAnime({ ...nuevoAnime, generos: e.target.value.split(',').map(g => g.trim()) })}
                                    placeholder="Acción, Comedia, Drama"
                                />
                            </div>

                            <div className="form-group">
                                <label>Estado:</label>
                                <select
                                    value={nuevoAnime.estado}
                                    onChange={(e) => setNuevoAnime({
                                        ...nuevoAnime,
                                        estado: e.target.value as EstadoAnime
                                    })}
                                >
                                    <option value="Visto">Visto</option>
                                    <option value="Viéndolo">Viéndolo</option>
                                    <option value="Por ver">Por ver</option>
                                    <option value="Favorito">Favorito</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Rating (0-10):</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.5"
                                    value={nuevoAnime.rating}
                                    onChange={(e) => setNuevoAnime({ ...nuevoAnime, rating: Number(e.target.value) })}
                                />
                            </div>

                            <div className="form-buttons">
                                <button
                                    onClick={editandoAnime ? actualizarAnime : agregarAnime}
                                    className="btn-primary"
                                >
                                    {editandoAnime ? 'Actualizar' : 'Agregar'}
                                </button>
                                <button onClick={cancelarEdicion} className="btn-secondary">
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lista de animes */}
                <div className="animes-grid">
                    {animes.length === 0 ? (
                        <div className="no-animes">
                            <p>No tienes animes guardados todavía.</p>
                            <button onClick={() => setMostrarFormulario(true)} className="btn-primary">
                                Agregar tu primer anime
                            </button>
                        </div>
                    ) : (animes.map((anime) => (
                        <div key={anime.id} className="anime-card">
                            <div className="anime-portada">
                                <img src={anime.portada} alt={anime.titulo} />
                                <div className="anime-estado">{anime.estado}</div>
                                {anime.rating > 0 && (
                                    <div className="anime-rating">⭐ {anime.rating}</div>
                                )}
                            </div>

                            <div className="anime-info">
                                <h3 className="anime-titulo">{anime.titulo}</h3>

                                <p className="anime-descripcion">{anime.descripcion.substring(0, 100)}...</p>

                                <div className="anime-generos">
                                    {anime.generos.slice(0, 3).map((genero, index) => (
                                        <span key={index} className="genero-tag">{genero}</span>
                                    ))}
                                    {anime.generos.length > 3 && (
                                        <span className="genero-tag">+{anime.generos.length - 3}</span>
                                    )}
                                </div>

                                <div className="anime-actions">
                                    <button
                                        onClick={() => iniciarEdicion(anime)}
                                        className="btn-editar"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => eliminarAnime(anime.id)}
                                        className="btn-eliminar"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DirectorioAnimes;