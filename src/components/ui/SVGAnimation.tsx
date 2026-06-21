import { useEffect, useRef, useState } from 'react';

interface SVGAnimationProps {
  src: string;
  className?: string;
  width?: number;
  height?: number;
  autoplay?: boolean;
  speed?: number;
}

export const SVGAnimation = ({ 
  src, 
  className = '', 
  width = 200, 
  height = 200, 
  autoplay = true, 
  speed = 1 
}: SVGAnimationProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSVG = async () => {
      try {
        const response = await fetch(src);
        const svgText = await response.text();
        
        if (svgRef.current) {
          svgRef.current.innerHTML = svgText;
          setIsLoaded(true);
          
          // Add animation classes to SVG elements
          const paths = svgRef.current.querySelectorAll('path, circle, rect, ellipse, polygon, polyline, line');
          paths.forEach((path, index) => {
            (path as HTMLElement).classList.add('animate-fadeIn');
            (path as HTMLElement).style.animationDelay = `${index * 0.05}s`;
          });
        }
      } catch (error) {
        console.error('Failed to load SVG:', error);
      }
    };

    loadSVG();
  }, [src]);

  useEffect(() => {
    if (!svgRef.current || !isLoaded) return;

    const svg = svgRef.current;
    svg.style.animationPlayState = autoplay ? 'running' : 'paused';
    
    if (speed !== 1) {
      svg.style.animationDuration = `${1 / speed}s`;
    }
  }, [autoplay, speed, isLoaded]);

  return (
    <div 
      className={`inline-block ${className}`}
      style={{ width, height }}
    >
      {!isLoaded && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-full"
        style={{ display: isLoaded ? 'block' : 'none' }}
      />
    </div>
  );
};

interface AnimatedIconProps {
  icon: React.ReactNode;
  className?: string;
  animate?: 'pulse' | 'spin' | 'bounce' | 'shake' | 'float';
}

export const AnimatedIcon = ({ icon, className = '', animate = 'pulse' }: AnimatedIconProps) => {
  const animationClasses = {
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    bounce: 'animate-bounce',
    shake: 'animate-shake',
    float: 'animate-float',
  };

  return (
    <div className={`inline-block ${animationClasses[animate]} ${className}`}>
      {icon}
    </div>
  );
};
