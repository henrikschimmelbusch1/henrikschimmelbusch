
import { useEffect, useRef, useContext } from 'react';
import { MagneticContext } from '../context/MagneticContext';

interface MagneticOptions {
    strength?: number;
    scale?: number;
}

export const useMagnetic = (
    ref: React.RefObject<HTMLElement>, 
    { strength = 0.15, scale = 1.03 }: MagneticOptions = {}
) => {
    const { setIsMagnetic } = useContext(MagneticContext);
    const animationFrame = useRef(0);
    const adjustedStrength = useRef(strength);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Calculate size-adjusted strength once, after the element is mounted.
        const { width, height } = element.getBoundingClientRect();
        if (width > 0 && height > 0) {
            const area = width * height;
            const baseArea = 4000; // Approx. 60x60px element
            const areaRatio = Math.max(1, area / baseArea);
            // The larger the element, the weaker the pull (inertia)
            adjustedStrength.current = strength / Math.pow(areaRatio, 0.75);
        } else {
            adjustedStrength.current = strength;
        }


        const onMouseMove = (e: MouseEvent) => {
            cancelAnimationFrame(animationFrame.current);
            animationFrame.current = requestAnimationFrame(() => {
                if (!ref.current) return;
                const { clientX, clientY } = e;
                const { left, top, width, height } = element.getBoundingClientRect();
                const centerX = left + width / 2;
                const centerY = top + height / 2;
                
                const deltaX = clientX - centerX;
                const deltaY = clientY - centerY;

                element.style.transition = 'transform 0.1s ease-out';
                element.style.transform = `translate(${deltaX * adjustedStrength.current}px, ${deltaY * adjustedStrength.current}px) scale(${scale})`;
            });
        };

        const onMouseLeave = () => {
            cancelAnimationFrame(animationFrame.current);
            if (!ref.current) return;
            element.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
            element.style.transform = 'translate(0, 0) scale(1)';
            setIsMagnetic(false);
        };
        
        const onMouseEnter = () => {
             setIsMagnetic(true);
        }

        element.addEventListener('mouseenter', onMouseEnter);
        element.addEventListener('mousemove', onMouseMove);
        element.addEventListener('mouseleave', onMouseLeave);

        return () => {
             cancelAnimationFrame(animationFrame.current);
             element.removeEventListener('mouseenter', onMouseEnter);
             element.removeEventListener('mousemove', onMouseMove);
             element.removeEventListener('mouseleave', onMouseLeave);
        };
    }, [ref, strength, scale, setIsMagnetic]);
};