import { users, profiles, education, career, family, horoscope, preferences, interests, messages, notifications, successStories, User, Profile, Education, Career, Family, Horoscope, Preference, Interest, Message, Notification, SuccessStory, InsertUser, InsertProfile, InsertEducation, InsertCareer, InsertFamily, InsertHoroscope, InsertPreference, InsertInterest, InsertMessage, InsertNotification, InsertSuccessStory, CompleteProfile } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPgSimple from "connect-pg-simple";
import { db } from "./db";
import { eq, or, and, desc, asc, sql } from "drizzle-orm";
import { calculateHoroscopeCompatibility } from "./horoscope-matcher";

// Keep the rest of the file as it is, but replace the matchHoroscopes method in both MemStorage and DatabaseStorage classes:

// In MemStorage class:
async matchHoroscopes(userId1: number, userId2: number): Promise<number> {
  const horoscope1 = await this.getHoroscope(userId1);
  const horoscope2 = await this.getHoroscope(userId2);
  
  // Use the shared horoscope compatibility function
  return calculateHoroscopeCompatibility(horoscope1, horoscope2);
}

// In DatabaseStorage class:
async matchHoroscopes(userId1: number, userId2: number): Promise<number> {
  const horoscope1 = await this.getHoroscope(userId1);
  const horoscope2 = await this.getHoroscope(userId2);
  
  // Use the shared horoscope compatibility function
  return calculateHoroscopeCompatibility(horoscope1, horoscope2);
}

// There's also no need to keep the following methods in both classes:
// - areZodiacSignsCompatible
// - areNakshatrasCompatible
// These should be removed since they're now in the horoscope-matcher.ts file