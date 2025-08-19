import { CheckCircle, ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export const PromotionProgress = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    'Preparing promotion...',
    'Updating student records...',
    'Validating class assignments...',
    'Promotion completed!'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 25;
        if (newProgress <= 100) {
          setCurrentStep(Math.floor(newProgress / 25) - 1);
          return newProgress;
        }
        return prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      {/* Modal */}
      <div className="relative bg-card glass-modal rounded-2xl p-8 animate-scale-in max-w-md w-full">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
            <ArrowUp className="w-8 h-8 text-white animate-bounce" />
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-bold text-foreground">
            Promoting Students
          </h3>
          
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-gradient-primary h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground">{progress}% Complete</p>
          </div>
          
          {/* Current Step */}
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-primary/10 text-primary' 
                    : 'bg-muted/50 text-muted-foreground'
                }`}
              >
                {index <= currentStep ? (
                  <CheckCircle className="w-5 h-5 text-primary animate-scale-in" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground"></div>
                )}
                <span className="text-sm font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};