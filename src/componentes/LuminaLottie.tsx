import Lottie from 'lottie-react';
import luminaAnimation from '../assets/lumina.json';

export const LuminaLottie = () => {
  return (
    <div 
      className="w-full h-full"
      style={{
        filter: `
          hue-rotate(45deg) 
          brightness(1.2) 
          drop-shadow(0 0 15px rgba(132, 255, 0, 0.8))
          drop-shadow(0 0 30px rgba(173, 255, 47, 0.6))
        `,
        pointerEvents: 'none'
      }}
    >
      <Lottie animationData={luminaAnimation} loop={true} />
    </div>
  );
};
