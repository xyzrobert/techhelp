import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Phone, Users, QrCode, Trophy } from "lucide-react";

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    title: "Request Confirmed",
    description: "Your contact request has been received and will be confirmed by the helper.",
    icon: <Check className="w-12 h-12 text-green-500" />,
  },
  {
    title: "Helper Callback",
    description: "The helper will call you back on your provided phone number to discuss your tech issue.",
    icon: <Phone className="w-12 h-12 text-blue-500" />,
  },
  {
    title: "Meet Helper",
    description: "Meet with your helper at the agreed time and location to resolve your tech issue.",
    icon: <Users className="w-12 h-12 text-purple-500" />,
  },
  {
    title: "Payment",
    description: "Scan the QR code to pay with card, or pay with cash after the service is complete.",
    icon: <QrCode className="w-12 h-12 text-orange-500" />,
  },
  {
    title: "All Done!",
    description: "Your tech issue is resolved! Don't forget to rate your helper's service.",
    icon: <Trophy className="w-12 h-12 text-yellow-500" />,
  },
];

interface ContactSuccessSliderProps {
  open: boolean;
  onClose: () => void;
}

export function ContactSuccessSlider({ open, onClose }: ContactSuccessSliderProps) {
  const [currentStep, setCurrentStep] = React.useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>What happens next?</DialogTitle>
          <DialogDescription>
            Here's what to expect after submitting your contact request
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6 space-y-4">
          <div className="relative w-full">
            <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 rounded">
              <motion.div
                className="h-full bg-primary rounded"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((currentStep + 1) / steps.length) * 100}%` 
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-4 pt-4 min-h-[250px] h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center h-full"
              >
                <motion.div
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  className="mb-4"
                >
                  {steps[currentStep].icon}
                </motion.div>
                <motion.h3 
                  className="text-xl font-semibold mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {steps[currentStep].title}
                </motion.h3>
                <motion.p 
                  className="text-center text-muted-foreground"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {steps[currentStep].description}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? "Done" : "Next"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 