
import { Express, Request, Response } from 'express';
import { z } from 'zod';
import { authenticateToken } from './auth';
import { storage } from './storage';

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

// Type definition for verification
export interface Verification {
  id: number;
  userId: number;
  routerSetup: string;
  wpsExplanation: string;
  firewallSetting: string;
  windowsIssue: string;
  cableTypes: string;
  technicalExperience: string;
  toolsUsed: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  reviewedBy?: number;
  reviewedAt?: Date;
  feedback?: string;
}

// Add the verification schema
const verificationSchema = z.object({
  routerSetup: z.enum(['a', 'b', 'c', 'd']),
  wpsExplanation: z.string().min(20),
  firewallSetting: z.enum(['a', 'b', 'c', 'd']),
  windowsIssue: z.enum(['a', 'b', 'c', 'd']),
  cableTypes: z.enum(['a', 'b', 'c', 'd']),
  technicalExperience: z.string().min(50),
  toolsUsed: z.string().min(10),
});

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

  // Endpoint to submit verification
  app.post('/api/verifications', authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Check if user already has a pending or approved verification
      const existingVerification = await storage.getUserVerification(userId);
      if (existingVerification && (existingVerification.status === 'pending' || existingVerification.status === 'approved')) {
        return res.status(400).json({ 
          error: existingVerification.status === 'pending' 
            ? 'Du hast bereits eine Verifizierung eingereicht, die noch geprüft wird' 
            : 'Du bist bereits verifiziert' 
        });
      }

      // Validate the data
      const verificationData = verificationSchema.parse(req.body);
      
      // Create verification
      const verification = await storage.createVerification({
        userId,
        ...verificationData,
        status: 'pending',
        createdAt: new Date()
      });

      res.status(201).json({ 
        message: 'Verifizierung erfolgreich eingereicht',
        verificationId: verification.id
      });
    } catch (error) {
      console.error('Verification submission error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
      } else {
        res.status(500).json({ error: 'Fehler bei der Einreichung der Verifizierung' });
      }
    }
  });

  // Endpoint to get a user's verification status
  app.get('/api/verifications/status', authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const verification = await storage.getUserVerification(userId);
      
      if (!verification) {
        return res.status(404).json({ error: 'Keine Verifizierung gefunden' });
      }
      
      res.json({ status: verification.status });
    } catch (error) {
      console.error('Get verification error:', error);
      res.status(500).json({ error: 'Fehler beim Abrufen der Verifizierung' });
    }
  });

  // Admin routes for verification management
  app.get('/api/admin/verifications', authenticateToken, async (req: any, res) => {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unzureichende Berechtigungen' });
      }
      
      const verifications = await storage.getAllVerifications();
      res.json(verifications);
    } catch (error) {
      console.error('Admin get verifications error:', error);
      res.status(500).json({ error: 'Fehler beim Abrufen der Verifizierungen' });
    }
  });

  // Endpoint to review a verification (admin only)
  app.post('/api/admin/verifications/:id/review', authenticateToken, async (req: any, res) => {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unzureichende Berechtigungen' });
      }
      
      const verificationId = parseInt(req.params.id);
      
      const { status, feedback } = z.object({
        status: z.enum(['approved', 'rejected']),
        feedback: z.string().optional()
      }).parse(req.body);
      
      const reviewedVerification = await storage.reviewVerification(
        verificationId, 
        status, 
        req.user.id, 
        feedback
      );
      
      // If approved, update user's verification status
      if (status === 'approved') {
        await storage.setUserVerified(reviewedVerification.userId, true);
      }
      
      res.json({ 
        message: `Verifizierung erfolgreich ${status === 'approved' ? 'genehmigt' : 'abgelehnt'}`,
        verification: reviewedVerification
      });
    } catch (error) {
      console.error('Review verification error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
      } else {
        res.status(500).json({ error: 'Fehler bei der Bearbeitung der Verifizierung' });
      }
    }
  });
}
