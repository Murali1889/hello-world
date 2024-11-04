
import { Loader2 } from 'lucide-react';
import { Progress } from '../components/ui/progress';


const LoadingComponent = ({ progress, messageIndex, loadingMessages }) => {
  return (
    <div className="relative h-full w-full rounded-lg">
      <div className="relative flex h-full flex-col items-center justify-center p-8">
        {/* Spinner */}
        <div className="mb-8 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-white/10 p-4">
            <Loader2 className="h-full w-full animate-spin text-black" />
          </div>
        </div>

        {/* Progress bar and text */}
        <div className="w-full max-w-md space-y-4">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-[#DE85AD] to-[#B44F7E]">
              Analyzing Company Data
            </h1>
            <p className="text-lg text-black/80">
              Please wait while we gather information
            </p>
          </div>

          {/* Animated message */}
          <div className="relative h-8">
            <p
              className="absolute left-0 right-0 text-center text-sm text-black/60"
              style={{
                animation: 'fadeInOut 2.5s infinite',
                WebkitAnimation: 'fadeInOut 2.5s infinite'
              }}
            >
              {loadingMessages[messageIndex]}
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2 w-full bg-black/20" />
            <p className="text-center text-sm text-black/60">{progress}%</p>
          </div>
        </div>

        {/* Loading animation dots */}
        <div className="mt-8 flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-black"
              style={{
                animation: `bounce 1.4s infinite ${i * 0.2}s`,
                WebkitAnimation: `bounce 1.4s infinite ${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Add keyframe animations */}
      <style>
        {`
          @keyframes slide {
            0% { transform: translateX(0) translateY(0); }
            100% { transform: translateX(-64px) translateY(-64px); }
          }
          @-webkit-keyframes slide {
            0% { transform: translateX(0) translateY(0); }
            100% { transform: translateX(-64px) translateY(-64px); }
          }

          @keyframes fadeInOut {
            0%, 100% { 
              opacity: 0;
              transform: translateY(10px);
            }
            50% { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          @-webkit-keyframes fadeInOut {
            0%, 100% { 
              opacity: 0;
              transform: translateY(10px);
            }
            50% { 
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-8px); }
          }
          @-webkit-keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-8px); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingComponent;