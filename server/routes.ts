import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertProfileSchema, insertEducationSchema, insertCareerSchema, insertFamilySchema, insertPreferencesSchema, insertInterestSchema, insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // Profile Routes
  app.post("/api/profile", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const userId = req.user!.id;
      const existingProfile = await storage.getProfile(userId);
      
      if (existingProfile) {
        return res.status(400).json({ message: "Profile already exists. Use PUT to update." });
      }
      
      const profileData = insertProfileSchema.parse({ ...req.body, userId });
      const profile = await storage.createProfile(profileData);
      
      res.status(201).json(profile);
    } catch (error) {
      next(error);
    }
  });
  
  app.put("/api/profile", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const userId = req.user!.id;
      const updates = { ...req.body };
      
      const updatedProfile = await storage.updateProfile(userId, updates);
      
      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.status(200).json(updatedProfile);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/profile/:userId", async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      
      const profile = await storage.getProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  });
  
  // Education Routes
  app.post("/api/education", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const userId = req.user!.id;
      const existingEducation = await storage.getEducation(userId);
      
      if (existingEducation) {
        return res.status(400).json({ message: "Education details already exist. Use PUT to update." });
      }
      
      const educationData = insertEducationSchema.parse({ ...req.body, userId });
      const education = await storage.createEducation(educationData);
      
      res.status(201).json(education);
    } catch (error) {
      next(error);
    }
  });
  
  app.put("/api/education", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const userId = req.user!.id;
      const updates = { ...req.body };
      
      const updatedEducation = await storage.updateEducation(userId, updates);
      
      if (!updatedEducation) {
        return res.status(404).json({ message: "Education details not found" });
      }
      
      res.status(200).json(updatedEducation);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/education/:userId", async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      
      const education = await storage.getEducation(userId);
      
      if (!education) {
        return res.status(404).json({ message: "Education details not found" });
      }
      
      res.status(200).json(education);
    } catch (error) {
      next(error);
    }
  });
  
  // Career Routes
  app.post("/api/career", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const userId = req.user!.id;
      const existingCareer = await storage.getCareer(userId);
      
      if (existingCareer) {
        return res.status(400).json({ message: "Career details already exist. Use PUT to update." });
      }
      
      const careerData = insertCareerSchema.parse({ ...req.body, userId });
      const career = await storage.createCareer(careerData);
      
      res.status(201).json(career);
    } catch (error) {
      next(error);
    }
  });
  
  app.put("/api/career", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const userId = req.user!.id;
      const updates = { ...req.body };
      
      const updatedCareer = await storage.updateCareer(userId, updates);
      
      if (!updatedCareer) {
        return res.status(404).json({ message: "Career details not found" });
      }
      
      res.status(200).json(updatedCareer);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/career/:userId", async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      
      const career = await storage.getCareer(userId);
      
      if (!career) {
        return res.status(404).json({ message: "Career details not found" });
      }
      
      res.status(200).json(career);
    } catch (error) {
      next(error);
    }
  });
  
  // Family Routes
  app.post("/api/family", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const userId = req.user!.id;
      const existingFamily = await storage.getFamily(userId);
      
      if (existingFamily) {
        return res.status(400).json({ message: "Family details already exist. Use PUT to update." });
      }
      
      const familyData = insertFamilySchema.parse({ ...req.body, userId });
      const family = await storage.createFamily(familyData);
      
      res.status(201).json(family);
    } catch (error) {
      next(error);
    }
  });
  
  app.put("/api/family", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const userId = req.user!.id;
      const updates = { ...req.body };
      
      const updatedFamily = await storage.updateFamily(userId, updates);
      
      if (!updatedFamily) {
        return res.status(404).json({ message: "Family details not found" });
      }
      
      res.status(200).json(updatedFamily);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/family/:userId", async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      
      const family = await storage.getFamily(userId);
      
      if (!family) {
        return res.status(404).json({ message: "Family details not found" });
      }
      
      res.status(200).json(family);
    } catch (error) {
      next(error);
    }
  });
  
  // Preferences Routes
  app.post("/api/preferences", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const userId = req.user!.id;
      const existingPreferences = await storage.getPreferences(userId);
      
      if (existingPreferences) {
        return res.status(400).json({ message: "Preferences already exist. Use PUT to update." });
      }
      
      const preferencesData = insertPreferencesSchema.parse({ ...req.body, userId });
      const preferences = await storage.createPreferences(preferencesData);
      
      res.status(201).json(preferences);
    } catch (error) {
      next(error);
    }
  });
  
  app.put("/api/preferences", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const userId = req.user!.id;
      const updates = { ...req.body };
      
      const updatedPreferences = await storage.updatePreferences(userId, updates);
      
      if (!updatedPreferences) {
        return res.status(404).json({ message: "Preferences not found" });
      }
      
      res.status(200).json(updatedPreferences);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/preferences/:userId", async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      
      const preferences = await storage.getPreferences(userId);
      
      if (!preferences) {
        return res.status(404).json({ message: "Preferences not found" });
      }
      
      res.status(200).json(preferences);
    } catch (error) {
      next(error);
    }
  });
  
  // Complete Profile Routes
  app.get("/api/complete-profile/:userId", async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      
      const completeProfile = await storage.getCompleteProfile(userId);
      
      if (!completeProfile || !completeProfile.profile) {
        return res.status(404).json({ message: "Complete profile not found" });
      }
      
      res.status(200).json(completeProfile);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/my-profile", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const userId = req.user!.id;
      const completeProfile = await storage.getCompleteProfile(userId);
      
      res.status(200).json(completeProfile);
    } catch (error) {
      next(error);
    }
  });
  
  // Interest Routes
  app.post("/api/interest", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const senderId = req.user!.id;
      const interestData = insertInterestSchema.parse({ ...req.body, senderId });
      
      // Check if interest already exists
      const senderInterests = await storage.getInterestsBySender(senderId);
      const existingInterest = senderInterests.find(
        (interest) => interest.receiverId === interestData.receiverId
      );
      
      if (existingInterest) {
        return res.status(400).json({ message: "Interest already sent to this profile" });
      }
      
      const interest = await storage.createInterest(interestData);
      
      res.status(201).json(interest);
    } catch (error) {
      next(error);
    }
  });
  
  app.put("/api/interest/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const interestId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Must be 'accepted' or 'rejected'" });
      }
      
      const updatedInterest = await storage.updateInterestStatus(interestId, status);
      
      if (!updatedInterest) {
        return res.status(404).json({ message: "Interest not found" });
      }
      
      res.status(200).json(updatedInterest);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/interests/sent", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const senderId = req.user!.id;
      const interests = await storage.getInterestsBySender(senderId);
      
      res.status(200).json(interests);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/interests/received", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const receiverId = req.user!.id;
      const interests = await storage.getInterestsByReceiver(receiverId);
      
      res.status(200).json(interests);
    } catch (error) {
      next(error);
    }
  });
  
  // Messaging Routes
  app.post("/api/message", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const senderId = req.user!.id;
      const messageData = insertMessageSchema.parse({ ...req.body, senderId });
      
      const message = await storage.createMessage(messageData);
      
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/messages/:userId", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const currentUserId = req.user!.id;
      const otherUserId = parseInt(req.params.userId);
      
      const messages = await storage.getConversation(currentUserId, otherUserId);
      
      // Mark messages from other user as read
      await storage.markMessagesAsRead(otherUserId, currentUserId);
      
      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  });
  
  // Search and Recommendations
  app.get("/api/search", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const criteria = req.query;
      const searchResults = await storage.searchProfiles(criteria);
      
      res.status(200).json(searchResults);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/matches", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const userId = req.user!.id;
      const recommendations = await storage.getRecommendedMatches(userId);
      
      res.status(200).json(recommendations);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
