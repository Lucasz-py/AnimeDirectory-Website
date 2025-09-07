import React, { useEffect, useRef } from 'react';

// Definimos la interfaz para las propiedades del componente
interface LiquidEtherProps {
    colors?: string[];
    particleCount?: number;
}

const LiquidEtherBackground: React.FC<LiquidEtherProps> = ({
    colors = ["#52227F", "#FFFFFF", "#819EEF"],
    particleCount = 50
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Estilos en objeto para usar en JSX
    const styles = {
        container: {
            position: 'relative' as const,
            width: '100%',
            height: '100vh',
            overflow: 'hidden' as const,
            background: '#000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        canvas: {
            position: 'absolute' as const,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
        },
        content: {
            position: 'relative' as const,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            textAlign: 'center' as const,
            padding: '2rem'
        },
        title: {
            fontSize: '3.5rem',
            marginBottom: '1rem',
            background: 'linear-gradient(90deg, #ff00cc, #3333ff, #00ffcc)',
            WebkitBackgroundClip: 'text' as const,
            backgroundClip: 'text' as const,
            color: 'transparent',
            animation: 'gradientMove 8s ease infinite'
        },
        text: {
            fontSize: '1.2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem',
            lineHeight: 1.6
        },
        button: {
            display: 'inline-block',
            padding: '12px 30px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '30px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
        }
    };

    // Efecto para la animación del fondo
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Ajustar el tamaño del canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Configuración de partículas
        interface Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            color: string;
        }

        const particles: Particle[] = [];

        // Crear partículas
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 100 + 50,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        // Animación
        let animationFrameId: number;

        const animate = () => {
            if (!ctx) return;

            // Limpiar canvas con un fondo semi-transparente para efecto de estela
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Actualizar y dibujar partículas
            particles.forEach(particle => {
                // Mover partícula
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                // Rebotar en los bordes
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

                // Dibujar partícula
                const gradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size
                );
                gradient.addColorStop(0, particle.color);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // Limpieza
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [colors, particleCount]);

    // Función para manejar el hover del botón
    const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
    };

    // Función para manejar cuando el mouse sale del botón
    const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.transform = 'translateY(0px)';
        e.currentTarget.style.boxShadow = 'none';
    };

    return (
        <div style={styles.container}>
            <canvas ref={canvasRef} style={styles.canvas} />
            <div style={styles.content}>
                <h1 style={styles.title}>Lucasz-py</h1>
                <p style={styles.text}>
                    "###################################################"
                </p>
                <button
                    style={styles.button}
                    onMouseOver={handleButtonHover}
                    onMouseOut={handleButtonLeave}
                >
                    Explorar Efecto
                </button>
            </div>

            {/* Incluimos los keyframes en el estilo para la animación */}
            <style>
                {`
          @keyframes gradientMove {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}
            </style>
        </div>
    );
};

export default LiquidEtherBackground;