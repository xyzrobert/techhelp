
import { Express } from 'express';
import { z } from 'zod';
import { storage } from './storage';

// Define application schema
export interface Application {
  id: number;
  name: string;
  email: string;
  phone: string;
  problemType: string;
  problemDescription: string;
  urgency: string;
  preferredContactMethod: string;
  previousAttempts?: string;
  deviceInfo: string;
  status: string;
  dateSubmitted: Date;
  assignedToId?: number;
}

// Store applications in memory for now
class ApplicationStorage {
  private applications: Map<number, Application>;
  private currentId: number;

  constructor() {
    this.applications = new Map();
    this.currentId = 1;
  }

  async getAllApplications(): Promise<Application[]> {
    return Array.from(this.applications.values());
  }

  async getApplication(id: number): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async createApplication(data: Omit<Application, 'id' | 'status' | 'dateSubmitted'>): Promise<Application> {
    const id = this.currentId++;
    const application: Application = {
      ...data,
      id,
      status: 'pending',
      dateSubmitted: new Date(),
    };
    this.applications.set(id, application);
    return application;
  }

  async updateApplicationStatus(id: number, status: string, assignedToId?: number): Promise<Application | undefined> {
    const application = this.applications.get(id);
    if (!application) return undefined;

    const updated = { 
      ...application, 
      status, 
      ...(assignedToId ? { assignedToId } : {}) 
    };
    
    this.applications.set(id, updated);
    return updated;
  }
}

export const applicationStorage = new ApplicationStorage();

// Application validation schema
const applicationSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
  email: z.string().email("Ungültige Email-Adresse"),
  phone: z.string().min(5, "Bitte geben Sie eine gültige Telefonnummer ein"),
  problemType: z.enum(["hardware", "software", "network", "mobile", "other"]),
  problemDescription: z.string().min(10, "Bitte beschreiben Sie Ihr Problem genauer"),
  urgency: z.enum(["low", "medium", "high"]),
  preferredContactMethod: z.enum(["email", "phone", "whatsapp"]),
  previousAttempts: z.string().optional(),
  deviceInfo: z.string().min(2, "Bitte geben Sie Informationen zu Ihrem Gerät an"),
});

export function setupApplications(app: Express) {
  // Submit new application
  app.post('/api/applications/submit', async (req, res) => {
    try {
      const data = applicationSchema.parse(req.body);
      const application = await applicationStorage.createApplication(data);
      
      res.status(201).json({ 
        message: 'Anfrage erfolgreich eingereicht',
        applicationId: application.id
      });
    } catch (error) {
      console.error('Application submission error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
      } else {
        res.status(500).json({ error: 'Anfrage konnte nicht verarbeitet werden' });
      }
    }
  });

  // Get all applications (admin only)
  app.get('/api/applications', async (req, res) => {
    try {
      // In a real app, check if user is admin
      const applications = await applicationStorage.getAllApplications();
      res.json(applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({ error: 'Anfragen konnten nicht geladen werden' });
    }
  });

  // Get a specific application
  app.get('/api/applications/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Ungültige Anfrage-ID' });
      }

      const application = await applicationStorage.getApplication(id);
      if (!application) {
        return res.status(404).json({ error: 'Anfrage nicht gefunden' });
      }

      res.json(application);
    } catch (error) {
      console.error('Error fetching application:', error);
      res.status(500).json({ error: 'Anfrage konnte nicht geladen werden' });
    }
  });

  // Update application status (admin or assigned helper only)
  app.patch('/api/applications/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Ungültige Anfrage-ID' });
      }

      const { status, assignedToId } = z.object({
        status: z.enum(['pending', 'assigned', 'in-progress', 'completed', 'cancelled']),
        assignedToId: z.number().optional()
      }).parse(req.body);

      const updated = await applicationStorage.updateApplicationStatus(
        id, 
        status, 
        assignedToId
      );

      if (!updated) {
        return res.status(404).json({ error: 'Anfrage nicht gefunden' });
      }

      res.json(updated);
    } catch (error) {
      console.error('Error updating application:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
      } else {
        res.status(500).json({ error: 'Status konnte nicht aktualisiert werden' });
      }
    }
  });
}
