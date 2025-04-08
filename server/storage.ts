import { users, profiles, education, career, family, preferences, interests, messages, User, Profile, Education, Career, Family, Preference, Interest, Message, InsertUser, InsertProfile, InsertEducation, InsertCareer, InsertFamily, InsertPreference, InsertInterest, InsertMessage, CompleteProfile } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Profile management
  getProfile(userId: number): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: number, updates: Partial<Profile>): Promise<Profile | undefined>;
  
  // Education
  getEducation(userId: number): Promise<Education | undefined>;
  createEducation(education: InsertEducation): Promise<Education>;
  updateEducation(userId: number, updates: Partial<Education>): Promise<Education | undefined>;
  
  // Career
  getCareer(userId: number): Promise<Career | undefined>;
  createCareer(career: InsertCareer): Promise<Career>;
  updateCareer(userId: number, updates: Partial<Career>): Promise<Career | undefined>;
  
  // Family
  getFamily(userId: number): Promise<Family | undefined>;
  createFamily(family: InsertFamily): Promise<Family>;
  updateFamily(userId: number, updates: Partial<Family>): Promise<Family | undefined>;
  
  // Preferences
  getPreferences(userId: number): Promise<Preference | undefined>;
  createPreferences(preferences: InsertPreference): Promise<Preference>;
  updatePreferences(userId: number, updates: Partial<Preference>): Promise<Preference | undefined>;
  
  // Interest management
  createInterest(interest: InsertInterest): Promise<Interest>;
  updateInterestStatus(id: number, status: string): Promise<Interest | undefined>;
  getInterestsBySender(senderId: number): Promise<Interest[]>;
  getInterestsByReceiver(receiverId: number): Promise<Interest[]>;
  
  // Messaging
  createMessage(message: InsertMessage): Promise<Message>;
  getConversation(user1Id: number, user2Id: number): Promise<Message[]>;
  markMessagesAsRead(senderId: number, receiverId: number): Promise<void>;
  
  // Searching and matching
  searchProfiles(criteria: any): Promise<CompleteProfile[]>;
  getRecommendedMatches(userId: number): Promise<CompleteProfile[]>;
  
  // Complete profile retrieval
  getCompleteProfile(userId: number): Promise<CompleteProfile | undefined>;
  getAllCompleteProfiles(): Promise<CompleteProfile[]>;
  
  // Session storage
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  // Storage maps
  private users: Map<number, User>;
  private profiles: Map<number, Profile>;
  private educations: Map<number, Education>;
  private careers: Map<number, Career>;
  private families: Map<number, Family>;
  private preferences: Map<number, Preference>;
  private interests: Map<number, Interest>;
  private messages: Map<number, Message>;
  
  // Auto-incrementing IDs
  private currentUserId: number;
  private currentProfileId: number;
  private currentEducationId: number;
  private currentCareerId: number;
  private currentFamilyId: number;
  private currentPreferenceId: number;
  private currentInterestId: number;
  private currentMessageId: number;
  
  // Session store
  sessionStore: session.SessionStore;
  
  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.educations = new Map();
    this.careers = new Map();
    this.families = new Map();
    this.preferences = new Map();
    this.interests = new Map();
    this.messages = new Map();
    
    this.currentUserId = 1;
    this.currentProfileId = 1;
    this.currentEducationId = 1;
    this.currentCareerId = 1;
    this.currentFamilyId = 1;
    this.currentPreferenceId = 1;
    this.currentInterestId = 1;
    this.currentMessageId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }
  
  // User management
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      isVerified: false, 
      isProfileComplete: false, 
      role: "user", 
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Profile management
  async getProfile(userId: number): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(
      (profile) => profile.userId === userId,
    );
  }
  
  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = this.currentProfileId++;
    const profile: Profile = { ...insertProfile, id };
    this.profiles.set(id, profile);
    
    // Update user profile status
    const user = await this.getUser(insertProfile.userId);
    if (user) {
      await this.updateUser(user.id, { isProfileComplete: true });
    }
    
    return profile;
  }
  
  async updateProfile(userId: number, updates: Partial<Profile>): Promise<Profile | undefined> {
    const profile = await this.getProfile(userId);
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...updates };
    this.profiles.set(profile.id, updatedProfile);
    return updatedProfile;
  }
  
  // Education
  async getEducation(userId: number): Promise<Education | undefined> {
    return Array.from(this.educations.values()).find(
      (edu) => edu.userId === userId,
    );
  }
  
  async createEducation(insertEducation: InsertEducation): Promise<Education> {
    const id = this.currentEducationId++;
    const education: Education = { ...insertEducation, id };
    this.educations.set(id, education);
    return education;
  }
  
  async updateEducation(userId: number, updates: Partial<Education>): Promise<Education | undefined> {
    const education = await this.getEducation(userId);
    if (!education) return undefined;
    
    const updatedEducation = { ...education, ...updates };
    this.educations.set(education.id, updatedEducation);
    return updatedEducation;
  }
  
  // Career
  async getCareer(userId: number): Promise<Career | undefined> {
    return Array.from(this.careers.values()).find(
      (career) => career.userId === userId,
    );
  }
  
  async createCareer(insertCareer: InsertCareer): Promise<Career> {
    const id = this.currentCareerId++;
    const career: Career = { ...insertCareer, id };
    this.careers.set(id, career);
    return career;
  }
  
  async updateCareer(userId: number, updates: Partial<Career>): Promise<Career | undefined> {
    const career = await this.getCareer(userId);
    if (!career) return undefined;
    
    const updatedCareer = { ...career, ...updates };
    this.careers.set(career.id, updatedCareer);
    return updatedCareer;
  }
  
  // Family
  async getFamily(userId: number): Promise<Family | undefined> {
    return Array.from(this.families.values()).find(
      (family) => family.userId === userId,
    );
  }
  
  async createFamily(insertFamily: InsertFamily): Promise<Family> {
    const id = this.currentFamilyId++;
    const family: Family = { ...insertFamily, id };
    this.families.set(id, family);
    return family;
  }
  
  async updateFamily(userId: number, updates: Partial<Family>): Promise<Family | undefined> {
    const family = await this.getFamily(userId);
    if (!family) return undefined;
    
    const updatedFamily = { ...family, ...updates };
    this.families.set(family.id, updatedFamily);
    return updatedFamily;
  }
  
  // Preferences
  async getPreferences(userId: number): Promise<Preference | undefined> {
    return Array.from(this.preferences.values()).find(
      (pref) => pref.userId === userId,
    );
  }
  
  async createPreferences(insertPreferences: InsertPreference): Promise<Preference> {
    const id = this.currentPreferenceId++;
    const preference: Preference = { ...insertPreferences, id };
    this.preferences.set(id, preference);
    return preference;
  }
  
  async updatePreferences(userId: number, updates: Partial<Preference>): Promise<Preference | undefined> {
    const preference = await this.getPreferences(userId);
    if (!preference) return undefined;
    
    const updatedPreference = { ...preference, ...updates };
    this.preferences.set(preference.id, updatedPreference);
    return updatedPreference;
  }
  
  // Interest management
  async createInterest(insertInterest: InsertInterest): Promise<Interest> {
    const id = this.currentInterestId++;
    const now = new Date();
    const interest: Interest = { 
      ...insertInterest, 
      id, 
      status: "pending", 
      createdAt: now 
    };
    this.interests.set(id, interest);
    return interest;
  }
  
  async updateInterestStatus(id: number, status: string): Promise<Interest | undefined> {
    const interest = this.interests.get(id);
    if (!interest) return undefined;
    
    const updatedInterest = { ...interest, status };
    this.interests.set(id, updatedInterest);
    return updatedInterest;
  }
  
  async getInterestsBySender(senderId: number): Promise<Interest[]> {
    return Array.from(this.interests.values()).filter(
      (interest) => interest.senderId === senderId,
    );
  }
  
  async getInterestsByReceiver(receiverId: number): Promise<Interest[]> {
    return Array.from(this.interests.values()).filter(
      (interest) => interest.receiverId === receiverId,
    );
  }
  
  // Messaging
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const now = new Date();
    const message: Message = { 
      ...insertMessage, 
      id, 
      read: false, 
      createdAt: now 
    };
    this.messages.set(id, message);
    return message;
  }
  
  async getConversation(user1Id: number, user2Id: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => 
        (message.senderId === user1Id && message.receiverId === user2Id) ||
        (message.senderId === user2Id && message.receiverId === user1Id)
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  async markMessagesAsRead(senderId: number, receiverId: number): Promise<void> {
    const messagesToUpdate = Array.from(this.messages.values()).filter(
      (message) => 
        message.senderId === senderId && 
        message.receiverId === receiverId && 
        !message.read
    );
    
    for (const message of messagesToUpdate) {
      const updatedMessage = { ...message, read: true };
      this.messages.set(message.id, updatedMessage);
    }
  }
  
  // Helper function to calculate match percentage based on preferences
  private calculateMatchPercentage(profile1: CompleteProfile, profile2: CompleteProfile): number {
    if (!profile1.preferences || !profile2.profile) return 0;
    
    let points = 0;
    let totalPoints = 0;
    const p1 = profile1.preferences;
    const p2 = profile2.profile;
    
    // Age check
    if (p1.minAge && p1.maxAge) {
      totalPoints += 10;
      const age = this.calculateAge(p2.dateOfBirth);
      if (age >= p1.minAge && age <= p1.maxAge) {
        points += 10;
      }
    }
    
    // Height check
    if (p1.minHeight && p1.maxHeight && p2.height) {
      totalPoints += 5;
      if (p2.height >= p1.minHeight && p2.height <= p1.maxHeight) {
        points += 5;
      }
    }
    
    // Marital status check
    if (p1.maritalStatus && p1.maritalStatus.length > 0) {
      totalPoints += 10;
      if (p1.maritalStatus.includes(p2.maritalStatus)) {
        points += 10;
      }
    }
    
    // Location check
    if (p1.location && p1.location.length > 0) {
      totalPoints += 8;
      if (p1.location.includes(p2.location) || p1.location.includes(p2.state) || p1.location.includes(p2.city)) {
        points += 8;
      }
    }
    
    // Caste check
    if (p1.caste && p1.caste.length > 0 && p2.caste) {
      totalPoints += 10;
      if (p1.caste.includes(p2.caste)) {
        points += 10;
      }
    }
    
    // Religion check
    if (p1.religion && p1.religion.length > 0) {
      totalPoints += 10;
      if (p1.religion.includes(p2.religion)) {
        points += 10;
      }
    }
    
    // Mother tongue check
    if (p1.motherTongue && p1.motherTongue.length > 0) {
      totalPoints += 8;
      if (p1.motherTongue.includes(p2.motherTongue)) {
        points += 8;
      }
    }
    
    // Education check
    if (profile2.education && p1.education && p1.education.length > 0) {
      totalPoints += 7;
      if (p1.education.includes(profile2.education.highestEducation)) {
        points += 7;
      }
    }
    
    // Occupation check
    if (profile2.career && p1.occupation && p1.occupation.length > 0) {
      totalPoints += 7;
      if (p1.occupation.includes(profile2.career.occupation)) {
        points += 7;
      }
    }
    
    // Income check
    if (profile2.career && p1.income && p1.income.length > 0) {
      totalPoints += 5;
      if (p1.income.includes(profile2.career.annualIncome)) {
        points += 5;
      }
    }
    
    return totalPoints > 0 ? Math.round((points / totalPoints) * 100) : 0;
  }
  
  private calculateAge(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }
  
  // Searching and matching
  async searchProfiles(criteria: any): Promise<CompleteProfile[]> {
    const allProfiles = await this.getAllCompleteProfiles();
    
    return allProfiles.filter(profile => {
      if (!profile.profile) return false;
      
      // Gender filter
      if (criteria.gender && profile.profile.gender !== criteria.gender) return false;
      
      // Age filter
      if (criteria.minAge || criteria.maxAge) {
        const age = this.calculateAge(profile.profile.dateOfBirth);
        if (criteria.minAge && age < criteria.minAge) return false;
        if (criteria.maxAge && age > criteria.maxAge) return false;
      }
      
      // Marital status filter
      if (criteria.maritalStatus && profile.profile.maritalStatus !== criteria.maritalStatus) return false;
      
      // Religion filter
      if (criteria.religion && profile.profile.religion !== criteria.religion) return false;
      
      // Mother tongue filter
      if (criteria.motherTongue && profile.profile.motherTongue !== criteria.motherTongue) return false;
      
      // Caste filter
      if (criteria.caste && profile.profile.caste !== criteria.caste) return false;
      
      // Location filter
      if (criteria.location) {
        const locationMatch = profile.profile.location.includes(criteria.location) || 
                             profile.profile.state.includes(criteria.location) || 
                             profile.profile.city.includes(criteria.location);
        if (!locationMatch) return false;
      }
      
      // Education filter
      if (criteria.education && profile.education && profile.education.highestEducation !== criteria.education) return false;
      
      // Occupation filter
      if (criteria.occupation && profile.career && profile.career.occupation !== criteria.occupation) return false;
      
      // Annual income filter
      if (criteria.minIncome && profile.career && parseInt(profile.career.annualIncome) < criteria.minIncome) return false;
      
      return true;
    });
  }
  
  async getRecommendedMatches(userId: number): Promise<CompleteProfile[]> {
    const userProfile = await this.getCompleteProfile(userId);
    if (!userProfile || !userProfile.preferences) return [];
    
    const allProfiles = await this.getAllCompleteProfiles();
    const oppositeGender = userProfile.profile.gender === 'Male' ? 'Female' : 'Male';
    
    // Filter profiles by opposite gender and calculate match percentage
    const matchedProfiles = allProfiles
      .filter(profile => 
        profile.user.id !== userId && 
        profile.profile && 
        profile.profile.gender === oppositeGender
      )
      .map(profile => {
        const matchPercentage = this.calculateMatchPercentage(userProfile, profile);
        return { profile, matchPercentage };
      })
      .filter(match => match.matchPercentage >= 50) // Only return profiles with >=50% match
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .map(match => match.profile);
    
    return matchedProfiles;
  }
  
  // Complete profile retrieval
  async getCompleteProfile(userId: number): Promise<CompleteProfile | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const profile = await this.getProfile(userId);
    const education = await this.getEducation(userId);
    const career = await this.getCareer(userId);
    const family = await this.getFamily(userId);
    const preferences = await this.getPreferences(userId);
    
    return {
      user,
      profile,
      education,
      career,
      family,
      preferences
    };
  }
  
  async getAllCompleteProfiles(): Promise<CompleteProfile[]> {
    const userIds = Array.from(this.users.keys());
    const completeProfiles: CompleteProfile[] = [];
    
    for (const userId of userIds) {
      const profile = await this.getCompleteProfile(userId);
      if (profile && profile.profile) {
        completeProfiles.push(profile);
      }
    }
    
    return completeProfiles;
  }
}

export const storage = new MemStorage();
