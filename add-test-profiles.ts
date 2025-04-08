import { db } from "./server/db";
import { users, profiles, education, career, family, horoscope, preferences } from "./shared/schema";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { storage } from "./server/storage";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function addTestProfiles() {
  console.log("Adding test profiles...");

  try {
    // Check if profiles already exist
    const existingUsers = await db.select().from(users).where(eq(users.username, "priya_sharma"));
    
    if (existingUsers.length > 0) {
      console.log("Test profiles already exist. Skipping...");
      return;
    }
    
    // Create test users and profiles
    const testProfiles = [
      {
        username: "priya_sharma",
        password: "password123",
        email: "priya.sharma@example.com",
        gender: "female",
        fullName: "Priya Sharma",
        dateOfBirth: "1995-05-15",
        maritalStatus: "Single",
        location: "Bhubaneswar",
        state: "Odisha",
        city: "Bhubaneswar",
        height: 62, // 5'2"
        religion: "Hindu",
        motherTongue: "Odia",
        caste: "Brahmin",
        profilePicture: "https://randomuser.me/api/portraits/women/33.jpg",
        about: "I am a software engineer who loves to travel and explore new places. Looking for someone who shares similar interests.",
        
        // Education
        highestEducation: "Masters in Computer Applications",
        college: "KIIT University",
        degree: "MCA",
        yearOfPassing: 2020,
        
        // Career
        occupation: "Software Engineer",
        employedIn: "IT Industry",
        company: "Infosys",
        annualIncome: "10-15 LPA",
        
        // Family
        fatherStatus: "Working",
        motherStatus: "Working",
        familyType: "Nuclear Family",
        familyValues: "Moderate",
        familyAffluence: "Upper Middle Class",
        siblings: 1,
        
        // Horoscope
        manglik: false,
        timeOfBirth: "08:45 AM",
        placeOfBirth: "Cuttack",
        moon: "Gemini",
        sun: "Taurus",
        mars: "Cancer",
        mercury: "Taurus",
        jupiter: "Libra",
        venus: "Gemini",
        saturn: "Aquarius",
        rahu: "Capricorn",
        ketu: "Cancer",
        nakshatra: "Ardra",
        
        // Preferences
        maritalStatusPrefs: ["Single", "Divorced"],
        religionPrefs: ["Hindu"],
        motherTonguePrefs: ["Odia", "Hindi"],
        castePrefs: ["Brahmin", "Karan", "Khandayat"],
        locationPrefs: ["Odisha", "West Bengal"],
        educationPrefs: ["Bachelors", "Masters", "Doctorate"],
        occupationPrefs: ["Any Professional"],
        incomePrefs: ["5-10 LPA", "10-15 LPA", "15-25 LPA"],
        heightPrefs: [64, 74],
        agePrefs: [25, 32]
      },
      {
        username: "rahul_mishra",
        password: "password123",
        email: "rahul.mishra@example.com",
        gender: "male",
        fullName: "Rahul Mishra",
        dateOfBirth: "1993-09-24",
        maritalStatus: "Single",
        location: "Cuttack",
        state: "Odisha",
        city: "Cuttack",
        height: 70, // 5'10"
        religion: "Hindu",
        motherTongue: "Odia",
        caste: "Brahmin",
        profilePicture: "https://randomuser.me/api/portraits/men/44.jpg",
        about: "Working as a medical professional, passionate about healthcare and helping others. Love music and playing guitar in my free time.",
        
        // Education
        highestEducation: "MBBS",
        college: "SCB Medical College",
        degree: "MBBS",
        yearOfPassing: 2018,
        
        // Career
        occupation: "Doctor",
        employedIn: "Healthcare",
        company: "SCB Medical College & Hospital",
        annualIncome: "15-25 LPA",
        
        // Family
        fatherStatus: "Retired",
        motherStatus: "Homemaker",
        familyType: "Joint Family",
        familyValues: "Traditional",
        familyAffluence: "Upper Middle Class",
        siblings: 1,
        
        // Horoscope
        manglik: false,
        timeOfBirth: "10:30 AM",
        placeOfBirth: "Cuttack",
        moon: "Virgo",
        sun: "Virgo",
        mars: "Leo",
        mercury: "Libra",
        jupiter: "Scorpio",
        venus: "Libra",
        saturn: "Aquarius",
        rahu: "Sagittarius",
        ketu: "Gemini",
        nakshatra: "Hasta",
        
        // Preferences
        maritalStatusPrefs: ["Single"],
        religionPrefs: ["Hindu"],
        motherTonguePrefs: ["Odia"],
        castePrefs: ["Brahmin", "Karan"],
        locationPrefs: ["Odisha"],
        educationPrefs: ["Bachelors", "Masters"],
        occupationPrefs: ["Any Professional"],
        incomePrefs: ["5-10 LPA", "10-15 LPA"],
        heightPrefs: [60, 68],
        agePrefs: [25, 30]
      },
      {
        username: "anjali_patel",
        password: "password123",
        email: "anjali.patel@example.com",
        gender: "female",
        fullName: "Anjali Patel",
        dateOfBirth: "1996-11-03",
        maritalStatus: "Single",
        location: "Bhubaneswar",
        state: "Odisha",
        city: "Bhubaneswar",
        height: 65, // 5'5"
        religion: "Hindu",
        motherTongue: "Odia",
        caste: "Khandayat",
        profilePicture: "https://randomuser.me/api/portraits/women/55.jpg",
        about: "I'm a CA by profession and love to cook and dance in my free time. Looking for someone with similar values and interests.",
        
        // Education
        highestEducation: "CA",
        college: "ICAI",
        degree: "Chartered Accountant",
        yearOfPassing: 2021,
        
        // Career
        occupation: "Chartered Accountant",
        employedIn: "Finance",
        company: "KPMG",
        annualIncome: "12-18 LPA",
        
        // Family
        fatherStatus: "Business Owner",
        motherStatus: "Homemaker",
        familyType: "Nuclear Family",
        familyValues: "Moderate",
        familyAffluence: "Upper Middle Class",
        siblings: 2,
        
        // Horoscope
        manglik: false,
        timeOfBirth: "07:15 PM",
        placeOfBirth: "Bhubaneswar",
        moon: "Scorpio",
        sun: "Scorpio",
        mars: "Virgo",
        mercury: "Libra",
        jupiter: "Capricorn",
        venus: "Sagittarius",
        saturn: "Pisces",
        rahu: "Taurus",
        ketu: "Scorpio",
        nakshatra: "Anuradha",
        
        // Preferences
        maritalStatusPrefs: ["Single", "Divorced"],
        religionPrefs: ["Hindu"],
        motherTonguePrefs: ["Odia", "Hindi"],
        castePrefs: ["Khandayat", "Brahmin", "Karan"],
        locationPrefs: ["Odisha", "Mumbai", "Delhi"],
        educationPrefs: ["Bachelors", "Masters", "CA", "MBA"],
        occupationPrefs: ["Business Owner", "Manager", "Chartered Accountant", "Government Officer"],
        incomePrefs: ["10-15 LPA", "15-25 LPA", "25+ LPA"],
        heightPrefs: [65, 75],
        agePrefs: [27, 35]
      },
      {
        username: "vikram_patnaik",
        password: "password123",
        email: "vikram.patnaik@example.com",
        gender: "male",
        fullName: "Vikram Patnaik",
        dateOfBirth: "1990-07-17",
        maritalStatus: "Divorced",
        location: "Bhubaneswar",
        state: "Odisha",
        city: "Bhubaneswar",
        height: 68, // 5'8"
        religion: "Hindu",
        motherTongue: "Odia",
        caste: "Karan",
        profilePicture: "https://randomuser.me/api/portraits/men/67.jpg",
        about: "I own a tech company and am passionate about innovation. Love outdoor activities like trekking and photography.",
        
        // Education
        highestEducation: "MBA",
        college: "IIM Bangalore",
        degree: "MBA",
        yearOfPassing: 2015,
        
        // Career
        occupation: "Entrepreneur",
        employedIn: "Business",
        company: "OdiTech Solutions Pvt Ltd",
        annualIncome: "30+ LPA",
        
        // Family
        fatherStatus: "Business Owner",
        motherStatus: "Homemaker",
        familyType: "Nuclear Family",
        familyValues: "Moderate",
        familyAffluence: "Affluent",
        siblings: 1,
        
        // Horoscope
        manglik: false,
        timeOfBirth: "02:30 PM",
        placeOfBirth: "Puri",
        moon: "Cancer",
        sun: "Cancer",
        mars: "Leo",
        mercury: "Leo",
        jupiter: "Taurus",
        venus: "Virgo",
        saturn: "Capricorn",
        rahu: "Gemini",
        ketu: "Sagittarius",
        nakshatra: "Pushya",
        
        // Preferences
        maritalStatusPrefs: ["Single", "Divorced", "Widowed"],
        religionPrefs: ["Hindu"],
        motherTonguePrefs: ["Odia", "Bengali", "Hindi"],
        castePrefs: ["Any"],
        locationPrefs: ["Odisha", "West Bengal", "Karnataka", "Maharashtra"],
        educationPrefs: ["Bachelors", "Masters", "MBA", "PhD"],
        occupationPrefs: ["Any Professional"],
        incomePrefs: ["Any"],
        heightPrefs: [60, 70],
        agePrefs: [25, 35]
      },
      {
        username: "neha_mohanty",
        password: "password123",
        email: "neha.mohanty@example.com",
        gender: "female",
        fullName: "Neha Mohanty",
        dateOfBirth: "1992-03-29",
        maritalStatus: "Single",
        location: "Berhampur",
        state: "Odisha",
        city: "Berhampur",
        height: 63, // 5'3"
        religion: "Hindu",
        motherTongue: "Odia",
        caste: "Khandayat",
        profilePicture: "https://randomuser.me/api/portraits/women/62.jpg",
        about: "I am a teacher by profession. Love reading, painting and classical dance. Looking for someone who respects independence and has similar values.",
        
        // Education
        highestEducation: "B.Ed",
        college: "Berhampur University",
        degree: "B.Ed",
        yearOfPassing: 2016,
        
        // Career
        occupation: "Teacher",
        employedIn: "Education",
        company: "DAV Public School",
        annualIncome: "6-10 LPA",
        
        // Family
        fatherStatus: "Retired",
        motherStatus: "Homemaker",
        familyType: "Joint Family",
        familyValues: "Traditional",
        familyAffluence: "Middle Class",
        siblings: 2,
        
        // Horoscope
        manglik: false,
        timeOfBirth: "05:45 AM",
        placeOfBirth: "Berhampur",
        moon: "Aries",
        sun: "Aries",
        mars: "Taurus",
        mercury: "Pisces",
        jupiter: "Leo",
        venus: "Taurus",
        saturn: "Capricorn",
        rahu: "Gemini",
        ketu: "Sagittarius",
        nakshatra: "Ashwini",
        
        // Preferences
        maritalStatusPrefs: ["Single"],
        religionPrefs: ["Hindu"],
        motherTonguePrefs: ["Odia"],
        castePrefs: ["Khandayat", "Brahmin", "Karan"],
        locationPrefs: ["Odisha"],
        educationPrefs: ["Bachelors", "Masters", "B.Ed", "M.Ed"],
        occupationPrefs: ["Teacher", "Professor", "Government Officer", "Engineer"],
        incomePrefs: ["5-10 LPA", "10-15 LPA", "15-25 LPA"],
        heightPrefs: [66, 74],
        agePrefs: [28, 36]
      }
    ];
    
    // Add test profiles to database
    for (const profile of testProfiles) {
      // Create user
      const hashedPassword = await hashPassword(profile.password);
      const user = await db.insert(users).values({
        username: profile.username,
        password: hashedPassword,
        email: profile.email,
        is_verified: true,
        email_verified: true,
        phone_verified: true,
        subscription_plan: "basic",
        subscription_expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        matches_remaining: 10,
        created_at: new Date().toISOString().split('T')[0],
      }).returning();
      
      const userId = user[0].id;
      
      // Create profile
      await db.insert(profiles).values({
        user_id: userId,
        full_name: profile.fullName,
        gender: profile.gender,
        date_of_birth: profile.dateOfBirth,
        marital_status: profile.maritalStatus,
        location: profile.location,
        state: profile.state,
        city: profile.city,
        height: profile.height,
        religion: profile.religion,
        mother_tongue: profile.motherTongue,
        caste: profile.caste,
        about: profile.about,
        profile_picture: profile.profilePicture,
      });
      
      // Create education
      await db.insert(education).values({
        user_id: userId,
        highest_education: profile.highestEducation,
        college: profile.college,
        degree: profile.degree,
        year_of_passing: profile.yearOfPassing,
      });
      
      // Create career
      await db.insert(career).values({
        user_id: userId,
        occupation: profile.occupation,
        employed_in: profile.employedIn,
        company: profile.company,
        annual_income: profile.annualIncome,
      });
      
      // Create family
      await db.insert(family).values({
        user_id: userId,
        father_status: profile.fatherStatus,
        mother_status: profile.motherStatus,
        family_type: profile.familyType,
        family_values: profile.familyValues,
        family_affluence: profile.familyAffluence,
        siblings: profile.siblings,
      });
      
      // Create horoscope
      await db.insert(horoscope).values({
        user_id: userId,
        date_of_birth: profile.dateOfBirth,
        time_of_birth: profile.timeOfBirth,
        place_of_birth: profile.placeOfBirth,
        moon_sign: profile.moon,
        sun_sign: profile.sun,
        venus_sign: profile.venus,
        nakshatra: profile.nakshatra,
        manglik: profile.manglik,
        kuja_dosha: null,
        other_doshas: null,
        rashi: null,
        horoscope_notes: null,
        horoscope_chart: null,
        created_at: new Date().toISOString(),
      });
      
      // Create preferences
      await db.insert(preferences).values({
        user_id: userId,
        marital_status: profile.maritalStatusPrefs,
        religion: profile.religionPrefs,
        mother_tongue: profile.motherTonguePrefs,
        caste: profile.castePrefs,
        location: profile.locationPrefs,
        education: profile.educationPrefs,
        occupation: profile.occupationPrefs,
        income: profile.incomePrefs,
        min_height: profile.heightPrefs[0],
        max_height: profile.heightPrefs[1],
        min_age: profile.agePrefs[0],
        max_age: profile.agePrefs[1],
        specific_requirements: null,
      });
    }
    
    console.log("Successfully added test profiles!");
  } catch (error) {
    console.error("Failed to add test profiles:", error);
  }
}

// Execute the function
addTestProfiles().finally(() => {
  console.log("Done");
  process.exit(0);
});