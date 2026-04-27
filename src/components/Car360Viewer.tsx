import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCw, MoveHorizontal, Maximize2, X, ChevronLeft, ChevronRight, Loader2, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Car360ViewerProps {
  frames: string[];
  autoRotate?: boolean;
  onClose?: () => void;
  isModal?: boolean;
}

const Car360Viewer: React.FC<Car360ViewerProps> = ({ 
  frames, 
  autoRotate = true, 
  onClose,
  isModal = false 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoRotate);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const totalFrames = frames.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const lastX = useRef<number>(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    frames.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
      };
    });
  }, [frames]);

  const allLoaded = imagesLoaded === totalFrames;

  // Auto-rotation logic
  useEffect(() => {
    if (isAutoPlaying && !isDragging && allLoaded) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalFrames);
      }, 250); // Slower auto-rotation for a premium feel
    } else {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, isDragging, totalFrames, allLoaded]);

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setIsAutoPlaying(false);
    lastX.current = clientX;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - lastX.current;
    // Sensitivity: pixels per frame. Higher = slower/less sensitive
    const sensitivity = 40; 
    
    if (Math.abs(deltaX) > sensitivity) {
      const framesToMove = Math.floor(Math.abs(deltaX) / sensitivity);
      if (deltaX > 0) {
        setCurrentIndex((prev) => (prev - framesToMove + totalFrames) % totalFrames);
      } else {
        setCurrentIndex((prev) => (prev + framesToMove) % totalFrames);
      }
      lastX.current = clientX;
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center group select-none ${isModal ? "h-[70vh] md:h-[80vh] rounded-3xl" : "h-full rounded-2xl"}`}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      {!allLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-sm font-medium animate-pulse">Loading 360 Experience ({Math.round((imagesLoaded/totalFrames)*100)}%)</p>
        </div>
      )}

      {/* Main Image View */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={frames[currentIndex]}
            alt="Car 360 View"
            className="max-w-full max-h-full object-contain pointer-events-none drop-shadow-2xl"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          />
        </AnimatePresence>
      </div>

      {/* Close Button (Modal only) */}
      {isModal && onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-30 rounded-full bg-background/50 backdrop-blur-md hover:bg-background"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>
      )}

      {/* Interaction Help Overlay */}
      {allLoaded && !isDragging && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="bg-black/20 backdrop-blur-[2px] rounded-full p-4 text-white flex flex-col items-center gap-2">
            <MoveHorizontal className="w-8 h-8 animate-bounce-horizontal" />
            <span className="text-xs font-bold uppercase tracking-widest">Drag to rotate</span>
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20 bg-background/40 backdrop-blur-xl border border-white/20 p-2 rounded-2xl shadow-2xl scale-90 md:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl h-10 w-10 hover:bg-white/20"
          onClick={() => setCurrentIndex((prev) => (prev - 1 + totalFrames) % totalFrames)}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="h-6 w-[1px] bg-white/20"></div>

        <Button
          variant="ghost"
          size="icon"
          className={`rounded-xl h-10 w-10 hover:bg-white/20 ${isAutoPlaying ? "text-primary" : ""}`}
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        >
          {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl h-10 w-10 hover:bg-white/20"
          onClick={() => {
            setCurrentIndex(0);
            setIsAutoPlaying(false);
          }}
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        <div className="h-6 w-[1px] bg-white/20"></div>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl h-10 w-10 hover:bg-white/20"
          onClick={() => setCurrentIndex((prev) => (prev + 1) % totalFrames)}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Angle Indicator */}
      <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-full border border-black/5 dark:border-white/5 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground opacity-60">
        <RotateCw className="w-3 h-3" />
        <span>{Math.round((currentIndex / totalFrames) * 360)}° View</span>
      </div>
    </div>
  );
};

export default Car360Viewer;
