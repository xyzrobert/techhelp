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