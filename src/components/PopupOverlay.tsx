import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PopupOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    // Mostra il popup dopo 45 secondi
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      
      // Countdown di 15 secondi prima di poter chiudere
      let timeLeft = 15;
      const countdownInterval = setInterval(() => {
        timeLeft--;
        setCountdown(timeLeft);
        
        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          setCanClose(true);
        }
      }, 1000);

      return () => clearInterval(countdownInterval);
    }, 45000);

    return () => clearTimeout(showTimer);
  }, []);

  const handleClose = () => {
    if (canClose) {
      setIsVisible(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Chiudi solo se si clicca sull'overlay, non sul popup
    if (e.target === e.currentTarget && canClose) {
      handleClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 w-screen h-screen bg-black/70 z-[9999] animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background w-[90%] max-w-[800px] h-[90%] sm:h-[85%] rounded-lg overflow-hidden shadow-2xl animate-popup-fade">
        
        {/* Pulsante di chiusura e timer */}
        <div className="absolute top-2 sm:top-3 right-3 sm:right-4 flex items-center gap-2 z-10">
          {!canClose && (
            <span className="text-xs sm:text-sm text-muted-foreground bg-background/80 px-2 py-1 rounded">
              Chiudi tra {countdown}s
            </span>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClose}
            disabled={!canClose}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full p-0 transition-all duration-300 ${
              !canClose 
                ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50' 
                : 'bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer'
            }`}
            title={canClose ? 'Chiudi' : 'Attendere per chiudere'}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>

        {/* Iframe */}
        <iframe
          src="https://otieu.com/4/7245716"
          className="w-full h-full border-0 rounded-lg"
          title="Popup Content"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
}