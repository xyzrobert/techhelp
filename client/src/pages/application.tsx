
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
