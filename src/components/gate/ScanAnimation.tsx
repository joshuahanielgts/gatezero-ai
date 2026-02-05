import { useState, useEffect } from "react";
import { Shield, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScanAnimationProps {
  onComplete: () => void;
}

const scanSteps = [
  { id: 1, label: "Connecting to Vahan API...", duration: 600 },
  { id: 2, label: "RC Status Verified (Active)", duration: 500 },
  { id: 3, label: "Insurance Validity Confirmed", duration: 500 },
  { id: 4, label: "Tax Compliance Check Passed", duration: 500 },
  { id: 5, label: "Calculating Route Distance...", duration: 700 },
  { id: 6, label: "GSTIN Status Validated", duration: 500 },
];

export function ScanAnimation({ onComplete }: ScanAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (currentStep >= scanSteps.length) {
      setTimeout(onComplete, 500);
      return;
    }

    const timer = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, scanSteps[currentStep].id]);
      setCurrentStep((prev) => prev + 1);
    }, scanSteps[currentStep]?.duration || 500);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <div className="max-w-md mx-auto text-center">
      {/* Animated Shield */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto animate-pulse-glow">
          <Shield className="w-16 h-16 text-primary animate-shield-pulse" />
        </div>
        
        {/* Scanning ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 rounded-full border-2 border-primary/30 animate-ping" style={{ animationDuration: '1.5s' }} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2">System Scan in Progress</h2>
      <p className="text-muted-foreground text-sm mb-8">Verifying compliance status...</p>

      {/* Checklist */}
      <div className="space-y-3 text-left">
        {scanSteps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = index === currentStep && !isCompleted;
          const isPending = index > currentStep;

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-all duration-300",
                isCompleted && "bg-safe/10 border border-safe/20",
                isCurrent && "bg-primary/10 border border-primary/20",
                isPending && "opacity-40"
              )}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                isCompleted && "bg-safe",
                isCurrent && "bg-primary",
                isPending && "bg-muted"
              )}>
                {isCompleted ? (
                  <Check className="w-4 h-4 text-safe-foreground" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                )}
              </div>
              
              <span className={cn(
                "text-sm font-medium",
                isCompleted && "text-safe",
                isCurrent && "text-foreground",
                isPending && "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
