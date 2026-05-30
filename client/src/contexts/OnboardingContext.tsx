import React, { createContext, ReactNode, useContext, useState } from "react";

interface OnboardingContextType {
  isOnboarding: boolean;
  currentStep: number;
  currentSidebarLink: string | null;
  startOnboarding: () => void;
  setCurrentStep: (step: number) => void;
  setSidebarLink: (link: string | null) => void;
  stopOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSidebarLink, setCurrentSidebarLink] = useState<string | null>(
    null,
  );

  const startOnboarding = () => setIsOnboarding(true);
  const stopOnboarding = () => {
    setIsOnboarding(false);
    setCurrentStep(0);
    setCurrentSidebarLink(null);
  };

  const setSidebarLink = (link: string | null) => setCurrentSidebarLink(link);

  return (
    <OnboardingContext.Provider
      value={{
        isOnboarding,
        currentStep,
        currentSidebarLink,
        startOnboarding,
        setCurrentStep,
        setSidebarLink,
        stopOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
};
