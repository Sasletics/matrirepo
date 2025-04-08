import { db } from "./server/db";
import { eq, and } from "drizzle-orm";
import { profiles } from "./shared/schema";

// This function will simply update all dateOfBirth fields to proper date objects
async function fixProfileDates() {
  try {
    console.log("Fixing profile dates...");
    
    // Get all profiles
    const allProfiles = await db.select().from(profiles);
    console.log(`Found ${allProfiles.length} profiles to fix`);
    
    // Fix date format for each profile
    for (const profile of allProfiles) {
      // Update the profile with date as a proper date object if it's a string
      if (profile.date_of_birth && typeof profile.date_of_birth === 'string') {
        const dateObj = new Date(profile.date_of_birth);
        await db.update(profiles)
          .set({ date_of_birth: dateObj.toISOString().split('T')[0] })
          .where(eq(profiles.id, profile.id));
        console.log(`Fixed date for profile ${profile.id}: ${profile.date_of_birth} -> ${dateObj.toISOString().split('T')[0]}`);
      }
    }
    
    console.log("All profile dates fixed successfully!");
  } catch (error) {
    console.error("Error fixing profile dates:", error);
  }
}

fixProfileDates().finally(() => {
  console.log("Done");
  process.exit(0);
});