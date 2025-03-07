import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowRight, Phone, Search, Check } from "lucide-react";

export function SearchGuide() {
  return (
    <Card className="mb-8 border-green-100 bg-green-50/50">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="flex items-center gap-2 text-green-700 md:border-r md:border-green-200 md:pr-6">
            <Search className="h-5 w-5" />
            <h3 className="text-xl font-semibold whitespace-nowrap">So geht's:</h3>
          </div>

          <div className="flex flex-col md:flex-row gap-6 flex-1 justify-around">
            {/* Step 1 */}
            <div className="flex items-center md:items-start gap-3">
              <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div className="flex flex-col items-center md:items-start">
                <p className="text-lg text-green-800">Helfer auswählen</p>
                <ArrowDown className="h-5 w-5 text-green-600 animate-bounce mt-2" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center md:items-start gap-3">
              <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div className="flex flex-col items-center md:items-start">
                <p className="text-lg text-green-800">Rückruf anfordern</p>
                <Phone className="h-5 w-5 text-green-600 animate-pulse mt-2" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center md:items-start gap-3">
              <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div className="flex flex-col items-center md:items-start">
                <p className="text-lg text-green-800">Hilfe erhalten</p>
                <Check className="h-5 w-5 text-green-600 animate-bounce mt-2" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 