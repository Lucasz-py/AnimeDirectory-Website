import React, { useState } from 'react';
import './DirectorioAnimes.css';

interface Anime {
    id: number;
    titulo: string;
    portada: string;
    descripcion: string;
    generos: string[];
    fechaVisto: string;
    estado: 'Visto' | 'Viéndolo' | 'Por ver' | 'Favorito' | 'Dropped';
    rating: number;
}

const DirectorioAnimes: React.FC = () => {
    const [animes, setAnimes] = useState<Anime[]>([
        {
            id: 1,
            titulo: 'Sousou no Frieren',
            portada: 'https://a.storyblok.com/f/178900/1269x712/c2294b9ce0/frieren-anime-cast.jpg',
            descripcion: 'Tras derrotar al rey demonio, los héroes se separan y Frieren, una elfa maga que no envejece, ve cómo sus compañeros mueren con el tiempo. Con una nueva aprendiz humana, recorre los lugares de sus antiguas aventuras y aprende a valorar los lazos que no supo atesorar.',
            generos: ['Fantasia', 'Drama', 'Aventura'],
            fechaVisto: '11/8/2025, 06:28',
            estado: 'Favorito',
            rating: 5
        },
        {
            id: 2,
            titulo: 'Cyberpunk: Edgerunners',
            portada: 'https://wallpapercave.com/wp/wp11495464.jpg',
            descripcion: 'Cyberpunk: Edgerunners cuenta una historia independiente sobre un niño de la calle que intenta sobrevivir en una ciudad del futuro obsesionada con la tecnología y la modificación del cuerpo. Teniendo todo que perder, elige mantenerse con vida convirtiéndose en un edgerunner, un forajido mercenario también conocido como cyberpunk.',
            generos: ['Accion', 'Slice of Life'],
            fechaVisto: '11/8/2025, 21:01',
            estado: 'Favorito',
            rating: 5
        }
    ]);

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [nuevoAnime, setNuevoAnime] = useState<Omit<Anime, 'id'>>({
        titulo: '',
        portada: '',
        descripcion: '',
        generos: [],
        fechaVisto: new Date().toLocaleString(),
        estado: 'Visto',
        rating: 0
    });

    const agregarAnime = () => {
        const anime: Anime = {
            ...nuevoAnime,
            id: Date.now()
        };
        setAnimes([...animes, anime]);
        setNuevoAnime({
            titulo: '',
            portada: '',
            descripcion: '',
            generos: [],
            fechaVisto: new Date().toLocaleString(),
            estado: 'Visto',
            rating: 0
        });
        setMostrarFormulario(false);
    };

    return (
        <div className="directorio-completo">
            {/* Fondo integrado */}
            <div className="directorio-fondo">
                {/* Puedes agregar aquí un fondo simple o mantener el estilo CSS */}
            </div>

            {/* Contenido del directorio */}
            <div className="directorio-contenido">
                <header className="directorio-header">
                    <h1>Tanime.net</h1>
                    <nav className="directorio-nav">
                        <button className="nav-btn">Miranda</button>
                        <button className="nav-btn">Vistas</button>
                        <button className="nav-btn">Por ver</button>
                        <button className="nav-btn">Favorite</button>
                        <button className="nav-btn">Dropped</button>
                    </nav>

                    <nav className="directorio-nav-secondary">
                        <button className="nav-btn">Hierate</button>
                        <button className="nav-btn">Comunidad</button>
                        <button className="nav-btn">Top</button>
                        <button className="nav-btn">Historical</button>
                        <button className="nav-btn">Perfil</button>
                    </nav>
                </header>

                {/* Botón para agregar nuevo anime */}
                <div className="agregar-anime-btn">
                    <button onClick={() => setMostrarFormulario(true)} className="btn-primary">
                        + Agregar Anime
                    </button>
                </div>

                {/* Formulario para agregar anime */}
                {mostrarFormulario && (
                    <div className="formulario-overlay">
                        <div className="formulario-anime">
                            <h2>Agregar Nuevo Anime</h2>

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
                                    onChange={(e) => setNuevoAnime({ ...nuevoAnime, estado: e.target.value as Anime['estado'] })}
                                >
                                    <option value="Visto">Visto</option>
                                    <option value="Viéndolo">Viéndolo</option>
                                    <option value="Por ver">Por ver</option>
                                    <option value="Favorito">Favorito</option>
                                    <option value="Dropped">Dropped</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Rating (0-5):</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.5"
                                    value={nuevoAnime.rating}
                                    onChange={(e) => setNuevoAnime({ ...nuevoAnime, rating: Number(e.target.value) })}
                                />
                            </div>

                            <div className="form-buttons">
                                <button onClick={agregarAnime} className="btn-primary">
                                    Agregar
                                </button>
                                <button onClick={() => setMostrarFormulario(false)} className="btn-secondary">
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lista de animes */}
                <div className="animes-grid">
                    {animes.map((anime) => (
                        <div key={anime.id} className="anime-card">
                            <div className="anime-portada">
                                <img src={anime.portada} alt={anime.titulo} />
                                <div className="anime-estado">{anime.estado}</div>
                                {anime.rating > 0 && (
                                    <div className="anime-rating">⭐ {anime.rating}</div>
                                )}
                            </div>

                            <div className="anime-info">
                                <h3>{anime.titulo}</h3>
                                <p className="anime-descripcion">{anime.descripcion}</p>

                                <div className="anime-generos">
                                    {anime.generos.map((genero, index) => (
                                        <span key={index} className="genero-tag">{genero}</span>
                                    ))}
                                </div>

                                <div className="anime-fecha">
                                    <strong>{anime.estado}:</strong> {anime.fechaVisto}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DirectorioAnimes;