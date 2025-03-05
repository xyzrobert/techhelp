
import React from 'react';
import ApplicationForm from '@/components/ApplicationForm';

export default function ApplicationPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Technische Unterstützung anfordern</h1>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        Füllen Sie dieses Formular aus, um einen technischen Helfer anzufordern. 
        Nach dem Absenden wird ein qualifizierter Student Ihr Problem prüfen und Ihnen bei der Lösung helfen.
      </p>
      <ApplicationForm />
    </div>
  );
}
import React from 'react';
import ApplicationForm from '@/components/ApplicationForm';

export default function ApplicationPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Technische Unterstützung anfragen</h1>
          <p className="text-muted-foreground">
            Fülle das Formular aus, um dich für technische Unterstützung zu bewerben
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ApplicationForm />
        </div>
      </div>
    </div>
  );
}
