import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertProfileSchema, insertEducationSchema, insertCareerSchema, insertFamilySchema, insertPreferencesSchema, insertInterestSchema, insertMessageSchema, insertNotificationSchema, insertSuccessStorySchema } from "@shared/schema";
import { generateOTP, createVerificationEmail, createPhoneVerificationMessage, sendEmail } from "./email";
import { calculateHoroscopeCompatibility } from "./horoscope-matcher";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Verification Routes
  app.post("/api/send-verification-email", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const userId = req.user!.id;
      const user = await storage.getUser(userId);
      
      if (!user || !user.email) {
        return res.status(400).json({ message: "User email not found" });
      }
      
      // Generate a 6-digit OTP
      const otp = generateOTP();
      
      // Set expiry to 24 hours from now
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24);
      
      // Save token to user record
      await storage.setVerificationToken(userId, otp, expiry);
      
      // Create verification email
      const emailParams = createVerificationEmail(user.email, otp);
      
      // In a production environment, this would send a real email via SendGrid or another provider
      // For now, we'll log it and simulate success
      console.log("Would send email:", emailParams);
      
      // We'll need to replace this with actual email sending once we integrate with SendGrid
      // const result = await sendEmail(emailParams);
      const result = true; // Simulate success
      
      if (result) {
        res.status(200).json({ message: "Verification email sent" });
      } else {
        res.status(500).json({ message: "Failed to send verification email" });
      }
    } catch (error) {
      next(error);
    }
  });
  
  app.post("/api/send-verification-sms", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const userId = req.user!.id;
      const user = await storage.getUser(userId);
      
      if (!user || !user.phoneNumber) {
        return res.status(400).json({ message: "User phone number not found" });
      }
      
      // Generate a 6-digit OTP
      const otp = generateOTP();
      
      // Set expiry to 24 hours from now
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24);
      
      // Save token to user record
      await storage.setVerificationToken(userId, otp, expiry);
      
      // Create verification SMS message
      const message = createPhoneVerificationMessage(otp);
      
      // In a production environment, this would send a real SMS via Twilio or another provider
      // For now, we'll log it and simulate success
      console.log("Would send SMS to", user.phoneNumber, ":", message);
      
      // Simulate success for now
      const result = true;
      
      if (result) {
        res.status(200).json({ message: "Verification SMS sent" });
      } else {
        res.status(500).json({ message: "Failed to send verification SMS" });
      }
    } catch (error) {
      next(error);
    }
  });
  
  app.post("/api/verify-email", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const userId = req.user!.id;
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: "Verification token is required" });
      }
      
      const result = await storage.verifyEmail(userId, token);
      
      if (result) {
        res.status(200).json({ message: "Email successfully verified" });
      } else {
        res.status(400).json({ message: "Invalid or expired verification token" });
      }
    } catch (error) {
      next(error);
    }
  });
  
  app.post("/api/verify-phone", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const userId = req.user!.id;
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: "Verification token is required" });
      }
      
      const result = await storage.verifyPhone(userId, token);
      
      if (result) {
        res.status(200).json({ message: "Phone successfully verified" });
      } else {
        res.status(400).json({ message: "Invalid or expired verification token" });
      }
    } catch (error) {
      next(error);
    }
  });
  
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
      const userProfile = await storage.getCompleteProfile(userId);
      if (!userProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }
      
      const allProfiles = await storage.getAllCompleteProfiles();
      
      // Filter out the user's own profile and get all profiles of opposite gender
      const potentialMatches = allProfiles
        .filter(profile => 
          profile.user.id !== userId && 
          profile.profile.gender !== userProfile.profile.gender
        );
      
      // Calculate match percentage based on preferences and return matches with percentages
      const matchesWithPercentages = potentialMatches.map(profile => {
        const matchPercentage = storage.calculateMatchPercentage(userProfile, profile);
        return { profile, matchPercentage };
      });
      
      // Sort by match percentage (highest first)
      matchesWithPercentages.sort((a, b) => b.matchPercentage - a.matchPercentage);
      
      // Return matches with their match percentages
      res.status(200).json(matchesWithPercentages);
    } catch (error) {
      next(error);
    }
  });

  // Subscription Routes
  app.put("/api/subscription", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const userId = req.user!.id;
      const { plan, expiryDate } = req.body;
      
      if (!plan || !expiryDate) {
        return res.status(400).json({ message: "Plan and expiry date are required" });
      }
      
      const updatedUser = await storage.updateSubscription(userId, plan, new Date(expiryDate));
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  });
  
  app.post("/api/decrement-match", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const userId = req.user!.id;
      const updatedUser = await storage.decrementMatchCount(userId);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  });
  
  // Notification Routes
  app.get("/api/notifications", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const userId = req.user!.id;
      const notifications = await storage.getUserNotifications(userId);
      
      res.status(200).json(notifications);
    } catch (error) {
      next(error);
    }
  });
  
  app.post("/api/notification", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const userId = req.user!.id;
      const notificationData = insertNotificationSchema.parse({ ...req.body, userId });
      
      const notification = await storage.createNotification(notificationData);
      
      res.status(201).json(notification);
    } catch (error) {
      next(error);
    }
  });
  
  app.put("/api/notification/:id/read", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const notificationId = parseInt(req.params.id);
      const updatedNotification = await storage.markNotificationAsRead(notificationId);
      
      if (!updatedNotification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      res.status(200).json(updatedNotification);
    } catch (error) {
      next(error);
    }
  });
  
  // Success Story Routes
  app.get("/api/success-stories", async (req, res, next) => {
    try {
      const successStories = await storage.getSuccessStories();
      
      res.status(200).json(successStories);
    } catch (error) {
      next(error);
    }
  });
  
  app.post("/api/success-story", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const user1Id = req.user!.id;
      const storyData = insertSuccessStorySchema.parse({ ...req.body, user1Id });
      
      const successStory = await storage.createSuccessStory(storyData);
      
      res.status(201).json(successStory);
    } catch (error) {
      next(error);
    }
  });

  // Compatibility check by birth details
  app.post("/api/birth-details-compatibility", async (req, res, next) => {
    try {
      const { person1, person2 } = req.body;
      
      if (!person1 || !person2) {
        return res.status(400).json({ message: "Both person's details are required" });
      }
      
      // Create horoscope objects from birth details (simplified)
      const horoscope1 = {
        userId: 0,
        id: 0,
        dateOfBirth: person1.dateOfBirth || "",
        timeOfBirth: person1.timeOfBirth || null,
        placeOfBirth: person1.placeOfBirth || null,
        manglik: person1.manglik || false,
        sun: person1.sun || null,
        moon: person1.moon || null,
        mars: person1.mars || null,
        mercury: person1.mercury || null,
        jupiter: person1.jupiter || null,
        venus: person1.venus || null,
        saturn: person1.saturn || null,
        rahu: person1.rahu || null,
        ketu: person1.ketu || null,
        nakshatra: person1.nakshatra || null,
        ascendant: person1.ascendant || null,
        horoscopeChart: null
      };
      
      const horoscope2 = {
        userId: 0,
        id: 0,
        dateOfBirth: person2.dateOfBirth || "",
        timeOfBirth: person2.timeOfBirth || null,
        placeOfBirth: person2.placeOfBirth || null,
        manglik: person2.manglik || false,
        sun: person2.sun || null,
        moon: person2.moon || null,
        mars: person2.mars || null,
        mercury: person2.mercury || null,
        jupiter: person2.jupiter || null,
        venus: person2.venus || null,
        saturn: person2.saturn || null,
        rahu: person2.rahu || null,
        ketu: person2.ketu || null,
        nakshatra: person2.nakshatra || null,
        ascendant: person2.ascendant || null,
        horoscopeChart: null
      };
      
      // Calculate compatibility
      const compatibilityScore = calculateHoroscopeCompatibility(horoscope1, horoscope2);
      
      res.status(200).json({ 
        compatibilityScore,
        compatibilityLevel: getCompatibilityLevel(compatibilityScore)
      });
    } catch (error) {
      next(error);
    }
  });

  // Direct Horoscope Data Compatibility (without requiring user IDs)
  app.post("/api/horoscope-direct-compatibility", async (req, res, next) => {
    try {
      const { horoscope1, horoscope2 } = req.body;
      
      if (!horoscope1 || !horoscope2) {
        return res.status(400).json({ message: "Both horoscope data are required" });
      }
      
      // Calculate compatibility directly using function from horoscope-matcher.ts
      const compatibilityScore = calculateHoroscopeCompatibility(horoscope1, horoscope2);
      
      res.status(200).json({ 
        compatibilityScore,
        compatibilityLevel: getCompatibilityLevel(compatibilityScore)
      });
    } catch (error) {
      next(error);
    }
  });
  
  // Horoscope Compatibility Route (using user IDs)
  app.get("/api/horoscope-compatibility/:userId1/:userId2", async (req, res, next) => {
    try {
      const userId1 = parseInt(req.params.userId1);
      const userId2 = parseInt(req.params.userId2);
      
      if (isNaN(userId1) || isNaN(userId2)) {
        return res.status(400).json({ message: "Invalid user IDs" });
      }
      
      // Fetch the horoscope data
      const horoscope1 = await storage.getHoroscope(userId1);
      const horoscope2 = await storage.getHoroscope(userId2);
      
      // Calculate compatibility directly using the function from horoscope-matcher.ts
      const compatibilityScore = calculateHoroscopeCompatibility(horoscope1, horoscope2);
      
      res.status(200).json({ 
        userId1, 
        userId2, 
        compatibilityScore,
        compatibilityLevel: getCompatibilityLevel(compatibilityScore)
      });
    } catch (error) {
      next(error);
    }
  });
  
  // Helper function to get compatibility level description
  function getCompatibilityLevel(score: number): string {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Average Match";
    if (score >= 20) return "Below Average Match";
    return "Poor Match";
  }

  const httpServer = createServer(app);

  return httpServer;
}
