
import React, { useContext, useEffect, useRef } from 'react';
import { useMousePosition } from '../hooks/useMousePosition';
import { MagneticContext } from '../context/MagneticContext';
import { CursorConfig } from '../types';

const lerp = (start: number, end: number, amt: number) => {
    return (1 - amt) * start + amt * end;
};

interface CursorProps {
    intensity: number;
    stretchIntensity: number;
    isMouseDown: boolean;
    config: CursorConfig;
}

const Cursor: React.FC<CursorProps> = ({ intensity, stretchIntensity, isMouseDown, config }) => {
    const mousePosition = useMousePosition();
    const { isMagnetic } = useContext(MagneticContext);
    const ringRef = useRef<HTMLDivElement>(null);
    
    // Position physics
    const smoothedPos = useRef({ x: 0, y: 0 });
    const positionVelocity = useRef({ x: 0, y: 0 });

    // Velocity tracking for effects
    const lastSmoothedPos = useRef({ x: 0, y: 0 });
    const cursorVelocity = useRef({ x: 0, y: 0 });
    
    // Wobble effect
    const rotation = useRef(0);
    const rotationVelocity = useRef(0);
    const lastSpeed = useRef(0);

    // Stretch effect
    const scale = useRef({ x: 1, y: 1 });
    const stretchRotation = useRef(0);

    useEffect(() => {
        if (ringRef.current) {
            ringRef.current.style.backgroundColor = `rgba(255, 255, 255, ${config.fillOpacity})`;
            ringRef.current.style.backdropFilter = `blur(${config.blurRadius}px)`;
            // FIX: Property 'webkitBackdropFilter' does not exist on type 'CSSStyleDeclaration'. Cast to any to support vendor prefix for Safari.
            (ringRef.current.style as any).webkitBackdropFilter = `blur(${config.blurRadius}px)`; // for Safari
            ringRef.current.style.boxShadow = `inset 0 0 0 ${config.edgeThickness}px rgba(255, 255, 255, ${config.edgeOpacity})`;
            ringRef.current.style.setProperty('--border-opacity', String(config.borderOpacity));
        }
    }, [config]);

    useEffect(() => {
        if (smoothedPos.current.x === 0 && smoothedPos.current.y === 0) {
            smoothedPos.current = mousePosition;
            lastSmoothedPos.current = mousePosition;
        }

        let animationFrameId: number;

        // Bounce physics constants
        const POS_STIFFNESS = 0.2;
        const POS_DAMPING = 0.8 - (intensity * 0.5); 
        const ROTATION_INTENSITY = 0.01 + (intensity * 0.09);
        const WOBBLE_SENSITIVITY = -0.5;
        
        // Stretch physics constants
        const STRETCH_MULTIPLIER = 0.03;
        const STRETCH_MAX = 2.0;
        const SQUASH_MAX = 0.5;

        const animate = () => {
            if (!ringRef.current) return;
            
            // --- POSITION & WOBBLE ---
            if (isMagnetic) {
                // Lerp towards mouse when magnetic
                smoothedPos.current.x = lerp(smoothedPos.current.x, mousePosition.x, 0.2);
                smoothedPos.current.y = lerp(smoothedPos.current.y, mousePosition.y, 0.2);
                rotation.current = lerp(rotation.current, 0, 0.2);
                positionVelocity.current = { x: 0, y: 0 };
                rotationVelocity.current = 0;
            } else {
                // Spring physics for position
                const forceX = (mousePosition.x - smoothedPos.current.x) * POS_STIFFNESS;
                const forceY = (mousePosition.y - smoothedPos.current.y) * POS_STIFFNESS;
                const dampingX = -positionVelocity.current.x * POS_DAMPING;
                const dampingY = -positionVelocity.current.y * POS_DAMPING;
                positionVelocity.current.x += forceX + dampingX;
                positionVelocity.current.y += forceY + dampingY;
                smoothedPos.current.x += positionVelocity.current.x;
                smoothedPos.current.y += positionVelocity.current.y;
                
                // Spring physics for wobble
                const ROT_STIFFNESS = 0.1;
                const ROT_DAMPING = 0.6;
                let rotationForce = (0 - rotation.current) * ROT_STIFFNESS;
                let rotationDampingForce = -rotationVelocity.current * ROT_DAMPING;
                rotationVelocity.current += rotationForce + rotationDampingForce;
                rotation.current += rotationVelocity.current;
            }

            // --- VELOCITY CALCULATION ---
            cursorVelocity.current.x = smoothedPos.current.x - lastSmoothedPos.current.x;
            cursorVelocity.current.y = smoothedPos.current.y - lastSmoothedPos.current.y;
            lastSmoothedPos.current = { ...smoothedPos.current };
            const speed = Math.sqrt(cursorVelocity.current.x**2 + cursorVelocity.current.y**2);
            
            // Add wobble on sudden direction change
            const speedDelta = speed - lastSpeed.current;
            lastSpeed.current = speed;
            if (speedDelta < WOBBLE_SENSITIVITY && !isMagnetic) {
                rotationVelocity.current -= cursorVelocity.current.x * ROTATION_INTENSITY;
            }
            
            // --- SCALING & STRETCH ---
            // 1. Determine base scale based on magnetic hover (100% on hover, 80% otherwise)
            const baseScale = isMagnetic ? 1.0 : 0.8;
    
            // 2. Initialize target scales with the base scale
            let targetScaleX = baseScale;
            let targetScaleY = baseScale;
    
            // 3. Apply stretch/squash on top of base scale (if not magnetic)
            if (!isMagnetic) {
                const stretch = 1 + Math.min(speed * stretchIntensity * STRETCH_MULTIPLIER, STRETCH_MAX - 1);
                const squash = Math.max(2 - stretch, SQUASH_MAX);
                
                targetScaleY *= stretch;
                targetScaleX *= squash;
                
                // Update stretch rotation only when moving fast enough
                if (speed > 0.1) {
                    const angle = Math.atan2(cursorVelocity.current.y, cursorVelocity.current.x) * (180 / Math.PI);
                    stretchRotation.current = angle + 90; // +90 to align Y-axis scale with velocity direction
                }
            } else {
                // When magnetic, smoothly reset stretch rotation to 0
                stretchRotation.current = lerp(stretchRotation.current, 0, 0.2);
            }
    
            // 4. On mouse down, shrink to 50% of the current target size
            if (isMouseDown) {
                targetScaleX *= 0.5;
                targetScaleY *= 0.5;
            }
    
            scale.current.x = lerp(scale.current.x, targetScaleX, 0.2);
            scale.current.y = lerp(scale.current.y, targetScaleY, 0.2);

            // --- BORDER & TRANSFORM ---
            const baseBorderWidth = 4; // Desired visual thickness in pixels
            // Use the minimum scale to correctly compensate for squash/stretch
            const minScale = Math.min(scale.current.x, scale.current.y);
            // Avoid division by zero or extremely large borders if scale becomes tiny
            if (minScale > 0.1) {
                const compensatedBorderWidth = baseBorderWidth / minScale;
                ringRef.current.style.borderWidth = `${compensatedBorderWidth}px`;
            }

            ringRef.current.style.transform = `
                translate(${smoothedPos.current.x}px, ${smoothedPos.current.y}px) 
                translate(-50%, -50%) 
                rotate(${rotation.current}deg) 
                rotate(${stretchRotation.current}deg) 
                scale(${scale.current.x}, ${scale.current.y})
            `;
            
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [mousePosition, isMagnetic, intensity, stretchIntensity, isMouseDown]);

    return (
        <div 
            ref={ringRef}
            className={`cursor-ring ${isMagnetic ? 'magnetic' : ''}`} 
        />
    );
};

export default Cursor;