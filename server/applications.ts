
import { Express, Request, Response } from 'express';
import { z } from 'zod';
import { authenticateToken } from './auth';

// In-memory storage for applications
let applications: Application[] = [];
let nextId = 1;

interface Application {
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

export function setupApplications(app: Express) {
  // Submit application endpoint
  app.post('/api/applications', async (req: Request, res: Response) => {
    try {
      const applicationData = z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().min(1, "Email is required").email("Invalid email address"),
        phone: z.string().min(1, "Phone number is required"),
        problemType: z.string().min(1, "Problem type is required"),
        problemDescription: z.string().min(1, "Problem description is required"),
        urgency: z.enum(["low", "medium", "high"]),
        preferredContactMethod: z.enum(["email", "phone", "either"]),
        previousAttempts: z.string().optional(),
        deviceInfo: z.string().min(1, "Device info is required"),
      }).parse(req.body);

      const application: Application = {
        ...applicationData,
        id: nextId++,
        status: 'pending',
        dateSubmitted: new Date()
      };

      applications.push(application);

      res.status(201).json({ 
        message: 'Application submitted successfully',
        applicationId: application.id
      });
    } catch (error) {
      console.error('Application submission error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
      } else {
        res.status(500).json({ error: 'Application submission failed' });
      }
    }
  });

  // Get all applications (admin only)
  app.get('/api/applications', authenticateToken, async (req: Request, res: Response) => {
    // In a real app, check if user is admin
    // @ts-ignore - we know req.user exists due to authenticateToken
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    
    res.json(applications);
  });

  // Get application by ID (admin or owner)
  app.get('/api/applications/:id', authenticateToken, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const application = applications.find(a => a.id === id);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    // @ts-ignore - we know req.user exists due to authenticateToken
    if (req.user.role !== 'admin' && application.email !== req.user.username) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    
    res.json(application);
  });

  // Update application status (admin only)
  app.patch('/api/applications/:id/status', authenticateToken, async (req: Request, res: Response) => {
    try {
      // In a real app, check if user is admin
      // @ts-ignore - we know req.user exists due to authenticateToken
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
      
      const id = parseInt(req.params.id);
      const { status } = z.object({
        status: z.enum(["pending", "reviewing", "approved", "rejected"])
      }).parse(req.body);
      
      const applicationIndex = applications.findIndex(a => a.id === id);
      
      if (applicationIndex === -1) {
        return res.status(404).json({ error: 'Application not found' });
      }
      
      applications[applicationIndex] = {
        ...applications[applicationIndex],
        status
      };
      
      res.json(applications[applicationIndex]);
    } catch (error) {
      console.error('Update application status error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
      } else {
        res.status(500).json({ error: 'Failed to update application status' });
      }
    }
  });

  // Assign application to a helper (admin only)
  app.patch('/api/applications/:id/assign', authenticateToken, async (req: Request, res: Response) => {
    try {
      // In a real app, check if user is admin
      // @ts-ignore - we know req.user exists due to authenticateToken
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
      
      const id = parseInt(req.params.id);
      const { helperId } = z.object({
        helperId: z.number()
      }).parse(req.body);
      
      const applicationIndex = applications.findIndex(a => a.id === id);
      
      if (applicationIndex === -1) {
        return res.status(404).json({ error: 'Application not found' });
      }
      
      applications[applicationIndex] = {
        ...applications[applicationIndex],
        assignedToId: helperId
      };
      
      res.json(applications[applicationIndex]);
    } catch (error) {
      console.error('Assign application error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
      } else {
        res.status(500).json({ error: 'Failed to assign application' });
      }
    }
  });
}
