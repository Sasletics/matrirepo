import { pgTable, text, serial, integer, boolean, date, json, time, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User account management
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phoneNumber").unique(),
  isVerified: boolean("is_verified").default(false),
  emailVerified: boolean("email_verified").default(false),
  phoneVerified: boolean("phone_verified").default(false),
  verificationToken: text("verification_token"),
  verificationTokenExpiry: date("verification_token_expiry"),
  referralCode: text("referral_code").unique(),
  referredBy: text("referred_by"),
  isProfileComplete: boolean("is_profile_complete").default(false),
  role: text("role").default("user"),
  subscriptionPlan: text("subscription_plan").default("free"),
  subscriptionExpiry: date("subscription_expiry"),
  matchesRemaining: integer("matches_remaining").default(10),
  createdAt: date("created_at").defaultNow(),
});

// User personal profiles
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  fullName: text("full_name").notNull(),
  gender: text("gender").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  height: integer("height"),
  maritalStatus: text("marital_status").notNull(),
  religion: text("religion").default("Hindu"),
  motherTongue: text("mother_tongue").default("Odia"),
  caste: text("caste"),
  subcaste: text("subcaste"),
  gotram: text("gotram"),
  manglik: text("manglik"),
  location: text("location").notNull(),
  state: text("state").notNull(),
  city: text("city").notNull(),
  country: text("country").default("India"),
  about: text("about"),
  hobbies: text("hobbies").array(),
  profilePicture: text("profile_picture"),
});

// Education details
export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  highestEducation: text("highest_education").notNull(),
  college: text("college"),
  degree: text("degree"),
  yearOfPassing: integer("year_of_passing"),
});

// Career details
export const career = pgTable("career", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  occupation: text("occupation").notNull(),
  employedIn: text("employed_in"),
  company: text("company"),
  annualIncome: text("annual_income"),
});

// Family details
export const family = pgTable("family", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  fatherStatus: text("father_status"),
  motherStatus: text("mother_status"),
  familyType: text("family_type"),
  familyValues: text("family_values"),
  familyAffluence: text("family_affluence"),
  siblings: integer("siblings"),
});

// Partner preferences
export const preferences = pgTable("preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  minAge: integer("min_age"),
  maxAge: integer("max_age"),
  minHeight: integer("min_height"),
  maxHeight: integer("max_height"),
  maritalStatus: text("marital_status").array(),
  education: text("education").array(),
  occupation: text("occupation").array(),
  income: text("income").array(),
  location: text("location").array(),
  caste: text("caste").array(),
  religion: text("religion").array(),
  motherTongue: text("mother_tongue").array(),
  specificRequirements: text("specific_requirements"),
});

// Interests (expressing interest in profiles)
export const interests = pgTable("interests", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  status: text("status").default("pending"), // pending, accepted, rejected
  createdAt: date("created_at").defaultNow(),
});

// Messages between users
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  read: boolean("read").default(false),
  createdAt: date("created_at").defaultNow(),
});

// Notifications for users
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // message, interest, match, profile_view, system
  content: text("content").notNull(),
  relatedUserId: integer("related_user_id").references(() => users.id),
  read: boolean("read").default(false),
  createdAt: date("created_at").defaultNow(),
});

// Horoscope details
export const horoscope = pgTable("horoscope", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  dateOfBirth: date("date_of_birth").notNull(),
  timeOfBirth: time("time_of_birth"),
  placeOfBirth: text("place_of_birth"),
  moon: text("moon_sign"),
  sun: text("sun_sign"),
  venus: text("venus_sign"),
  nakshatra: text("nakshatra"),
  manglik: boolean("manglik"),
  kuja: boolean("kuja_dosha"),
  otherDoshas: text("other_doshas"),
  rashi: text("rashi"),
  horoscopeNotes: text("horoscope_notes"),
  horoscopeChart: text("horoscope_chart"), // Could be a URL to a stored image
  createdAt: timestamp("created_at").defaultNow(),
});

// Success stories
export const successStories = pgTable("success_stories", {
  id: serial("id").primaryKey(),
  user1Id: integer("user1_id").notNull().references(() => users.id),
  user2Id: integer("user2_id").notNull().references(() => users.id),
  storyContent: text("story_content").notNull(),
  weddingDate: date("wedding_date"),
  isPublished: boolean("is_published").default(false),
  photo: text("photo"),
  createdAt: date("created_at").defaultNow(),
});

// Insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isVerified: true,
  emailVerified: true,
  phoneVerified: true,
  verificationToken: true,
  verificationTokenExpiry: true,
  referralCode: true,
  isProfileComplete: true,
  role: true,
  subscriptionPlan: true,
  subscriptionExpiry: true,
  matchesRemaining: true,
  createdAt: true,
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
});

export const insertEducationSchema = createInsertSchema(education).omit({
  id: true,
});

export const insertCareerSchema = createInsertSchema(career).omit({
  id: true,
});

export const insertFamilySchema = createInsertSchema(family).omit({
  id: true,
});

export const insertPreferencesSchema = createInsertSchema(preferences).omit({
  id: true,
});

export const insertInterestSchema = createInsertSchema(interests).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  read: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  read: true,
  createdAt: true,
});

export const insertHoroscopeSchema = createInsertSchema(horoscope).omit({
  id: true,
  createdAt: true,
});

export const insertSuccessStorySchema = createInsertSchema(successStories).omit({
  id: true,
  isPublished: true,
  createdAt: true,
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Education = typeof education.$inferSelect;

export type InsertCareer = z.infer<typeof insertCareerSchema>;
export type Career = typeof career.$inferSelect;

export type InsertFamily = z.infer<typeof insertFamilySchema>;
export type Family = typeof family.$inferSelect;

export type InsertPreference = z.infer<typeof insertPreferencesSchema>;
export type Preference = typeof preferences.$inferSelect;

export type InsertInterest = z.infer<typeof insertInterestSchema>;
export type Interest = typeof interests.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export type InsertHoroscope = z.infer<typeof insertHoroscopeSchema>;
export type Horoscope = typeof horoscope.$inferSelect;

export type InsertSuccessStory = z.infer<typeof insertSuccessStorySchema>;
export type SuccessStory = typeof successStories.$inferSelect;

// Complete profile type for easier frontend usage
export type CompleteProfile = {
  user: User;
  profile: Profile;
  education: Education;
  career: Career;
  family: Family;
  preferences: Preference;
  horoscope?: Horoscope;
};
