import { useEffect, useState } from 'react';

interface CustomCursorProps {
  color?: string;
  size?: number;
  blendMode?: CSSStyleDeclaration['mixBlendMode'];
}

export const CustomCursor = ({ 
  color = 'rgba(249, 115, 22, 0.8)', 
  size = 20,
  blendMode = 'difference' as CSSStyleDeclaration['mixBlendMode']
}: CustomCursorProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('[data-interactive]')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      <div
        className="fixed pointer-events-none z-50 rounded-full transition-transform duration-150 ease-out"
        style={{
          left: position.x - size / 2,
          top: position.y - size / 2,
          width: isHovering ? size * 1.5 : size,
          height: isHovering ? size * 1.5 : size,
          backgroundColor: color,
          mixBlendMode: blendMode as any,
          transform: isClicking ? 'scale(0.8)' : 'scale(1)',
          transition: 'transform 0.1s ease-out, width 0.2s ease-out, height 0.2s ease-out',
        }}
      />
      <div
        className="fixed pointer-events-none z-50 rounded-full transition-all duration-100 ease-out"
        style={{
          left: position.x - 4,
          top: position.y - 4,
          width: 8,
          height: 8,
          backgroundColor: color,
          opacity: isHovering ? 0 : 1,
        }}
      />
    </>
  );
};
