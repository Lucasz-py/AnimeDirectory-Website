import React, { useEffect, useRef } from 'react';

// Definimos la interfaz para las propiedades del componente
interface LiquidEtherProps {
    colors?: string[];
    particleCount?: number;
}

const LiquidEtherBackground: React.FC<LiquidEtherProps> = ({
    colors = ["#191970", "#BA55D3", "#4169E1", "#87CEFA"], // Azul medianoche, Medium orchid, Royal blue, Light sky blue
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

    return (
        <div style={styles.container}>
            <canvas ref={canvasRef} style={styles.canvas} />
        </div>
    );
};

export default LiquidEtherBackground;