import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Computer, Wifi, Smartphone, Home, MapPin, Phone, Calendar, X } from 'lucide-react';
import { useLocation } from 'wouter';

interface OnboardingFlowProps {
  onClose?: () => void;
}

interface Problem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const problems: Problem[] = [
  {
    icon: <Computer className="w-12 h-12" />,
    title: "Computer Problems",
    description: "Issues with your PC, laptop, or software"
  },
  {
    icon: <Wifi className="w-12 h-12" />,
    title: "Internet Issues",
    description: "WiFi, network, or connection problems"
  },
  {
    icon: <Smartphone className="w-12 h-12" />,
    title: "Smartphone Help",
    description: "Phone setup, apps, or troubleshooting"
  },
  {
    icon: <Home className="w-12 h-12" />,
    title: "Smart Home",
    description: "Smart devices and home automation"
  }
];

export function OnboardingFlow({ onClose }: OnboardingFlowProps) {
  const [step, setStep] = React.useState(0);
  const [selectedProblem, setSelectedProblem] = React.useState<Problem | null>(null);
  const [location, setLocation] = React.useState<'home' | 'public' | null>(null);
  const [, navigate] = useLocation();

  const slides = [
    // Welcome Slide
    {
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-4">Welcome to TechHelp</h1>
            <p className="text-xl text-muted-foreground">
              Let's find the perfect helper for you
            </p>
          </motion.div>
          <Button
            size="lg"
            className="text-xl px-8 py-6"
            onClick={() => setStep(1)}
          >
            Get Started
          </Button>
        </div>
      )
    },
    // Problem Selection
    {
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center mb-6">
            What do you need help with?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {problems.map((problem) => (
              <Card
                key={problem.title}
                className={`p-6 cursor-pointer transition-all ${
                  selectedProblem?.title === problem.title
                    ? 'ring-2 ring-primary'
                    : 'hover:bg-accent'
                }`}
                onClick={() => setSelectedProblem(problem)}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  {problem.icon}
                  <h3 className="text-xl font-medium">{problem.title}</h3>
                  <p className="text-muted-foreground">{problem.description}</p>
                </div>
              </Card>
            ))}
          </div>
          {selectedProblem && (
            <div className="flex justify-center mt-6">
              <Button
                size="lg"
                onClick={() => setStep(2)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )
    },
    // Location Preference
    {
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Where would you feel most comfortable?
          </h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Card
              className={`p-6 cursor-pointer transition-all ${
                location === 'home' ? 'ring-2 ring-primary' : 'hover:bg-accent'
              }`}
              onClick={() => setLocation('home')}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <Home className="w-12 h-12" />
                <h3 className="text-xl font-medium">At my home</h3>
                <p className="text-muted-foreground">
                  Get help in the comfort of your own space
                </p>
              </div>
            </Card>
            <Card
              className={`p-6 cursor-pointer transition-all ${
                location === 'public' ? 'ring-2 ring-primary' : 'hover:bg-accent'
              }`}
              onClick={() => setLocation('public')}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <MapPin className="w-12 h-12" />
                <h3 className="text-xl font-medium">At a public place</h3>
                <p className="text-muted-foreground">
                  Meet at a café or public location
                </p>
              </div>
            </Card>
          </div>
          {location && (
            <div className="flex justify-center mt-6">
              <Button
                size="lg"
                onClick={() => setStep(3)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )
    },
    // Contact Method
    {
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Request Help
          </h2>
          <div className="flex justify-center">
            <Card
              className="p-6 cursor-pointer hover:bg-accent transition-all"
              onClick={() => navigate('/search')}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <Calendar className="w-12 h-12" />
                <h3 className="text-xl font-medium">Request Callback</h3>
                <p className="text-muted-foreground">
                  Book a time that works for you and we'll have an expert call you back
                </p>
                <Button size="lg">Schedule Now</Button>
              </div>
            </Card>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 right-4 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
      )}
      <div className="w-full max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {slides[step].content}
          </motion.div>
        </AnimatePresence>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-8 gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                index === step ? 'w-8 bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 