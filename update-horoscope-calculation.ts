// Update the calculateHoroscopeCompatibility function to include a 'createdAt' field
// to address the schema issues.

import { Horoscope } from "@shared/schema";

export function calculateHoroscopeCompatibility(
  horoscope1: Horoscope | undefined,
  horoscope2: Horoscope | undefined
): number {
  if (!horoscope1 || !horoscope2) return 0;
  
  // Implement horoscope matching logic based on compatibility of signs, stars, etc.
  // This is a simple implementation - can be expanded with detailed Vedic astrology rules
  
  let matchPoints = 0;
  const totalPoints = 36; // Traditional astrology uses 36 points system
  
  // Sun sign compatibility - 8 points
  if (horoscope1.sun && horoscope2.sun && 
      areZodiacSignsCompatible(horoscope1.sun, horoscope2.sun)) {
    matchPoints += 8;
  }
  
  // Nakshatra compatibility - 10 points
  if (horoscope1.nakshatra && horoscope2.nakshatra && 
      areNakshatrasCompatible(horoscope1.nakshatra, horoscope2.nakshatra)) {
    matchPoints += 10;
  }
  
  // Manglik (Mangal Dosha) check - 8 points
  if (horoscope1.manglik === horoscope2.manglik) {
    matchPoints += 8;
  } else if (horoscope1.manglik === false && horoscope2.manglik === false) {
    matchPoints += 8;
  }
  
  // Planetary positions - 10 points (simplified)
  if (horoscope1.moon && horoscope2.moon && 
      horoscope1.moon === horoscope2.moon) {
    matchPoints += 5;
  }
  if (horoscope1.venus && horoscope2.venus && 
      horoscope1.venus === horoscope2.venus) {
    matchPoints += 5;
  }
  
  // Calculate percentage match
  return Math.round((matchPoints / totalPoints) * 100);
}

function areZodiacSignsCompatible(sign1: string, sign2: string): boolean {
  // Simplified zodiac compatibility
  const compatiblePairs = [
    ['Aries', 'Leo'], ['Aries', 'Sagittarius'], 
    ['Taurus', 'Virgo'], ['Taurus', 'Capricorn'],
    ['Gemini', 'Libra'], ['Gemini', 'Aquarius'],
    ['Cancer', 'Scorpio'], ['Cancer', 'Pisces'],
    ['Leo', 'Aries'], ['Leo', 'Sagittarius'],
    ['Virgo', 'Taurus'], ['Virgo', 'Capricorn'],
    ['Libra', 'Gemini'], ['Libra', 'Aquarius'],
    ['Scorpio', 'Cancer'], ['Scorpio', 'Pisces'],
    ['Sagittarius', 'Aries'], ['Sagittarius', 'Leo'],
    ['Capricorn', 'Taurus'], ['Capricorn', 'Virgo'],
    ['Aquarius', 'Gemini'], ['Aquarius', 'Libra'],
    ['Pisces', 'Cancer'], ['Pisces', 'Scorpio']
  ];
  
  return compatiblePairs.some(pair => 
    (pair[0] === sign1 && pair[1] === sign2) || 
    (pair[0] === sign2 && pair[1] === sign1)
  );
}

function areNakshatrasCompatible(nakshatra1: string, nakshatra2: string): boolean {
  // Simplified nakshatra compatibility check
  // In a real application, this would include the full 28 nakshatras with detailed compatibility rules
  const compatibleNakshatraPairs = [
    ['Ashwini', 'Bharani'],
    ['Krittika', 'Rohini'],
    ['Mrigashira', 'Ardra'],
    ['Punarvasu', 'Pushya'],
    ['Ashlesha', 'Magha'],
    ['Purva Phalguni', 'Uttara Phalguni'],
    ['Hasta', 'Chitra'],
    ['Swati', 'Vishakha'],
    ['Anuradha', 'Jyeshtha'],
    ['Mula', 'Purva Ashadha'],
    ['Uttara Ashadha', 'Shravana'],
    ['Dhanishta', 'Shatabhisha'],
    ['Purva Bhadrapada', 'Uttara Bhadrapada'],
    ['Revati', 'Ashwini']
  ];
  
  // Check if directly compatible
  for (const pair of compatibleNakshatraPairs) {
    if ((pair[0] === nakshatra1 && pair[1] === nakshatra2) || 
        (pair[0] === nakshatra2 && pair[1] === nakshatra1)) {
      return true;
    }
  }
  
  // Same nakshatra compatibility
  if (nakshatra1 === nakshatra2) {
    return true;
  }
  
  return false;
}

// Sample implementation
const horoscope1 = {
  id: 1,
  userId: 1,
  dateOfBirth: "1990-05-15",
  createdAt: new Date(),
  manglik: false,
  timeOfBirth: "06:30:00",
  placeOfBirth: "Bhubaneswar",
  moon: "Taurus",
  sun: "Taurus",
  venus: "Aries",
  mars: "Gemini",
  mercury: null,
  jupiter: null,
  saturn: null,
  rahu: null,
  ketu: null,
  nakshatra: "Rohini",
  ascendant: "Leo",
  horoscopeChart: null,
  rashi: null,
  kuja: null,
  otherDoshas: null,
  horoscopeNotes: null
};

// For a below average match scenario, we'll create a horoscope with mostly incompatible signs but a few matches
const horoscope2 = {
  id: 2,
  userId: 2,
  dateOfBirth: "1992-01-10",
  createdAt: new Date(),
  manglik: false,  // Manglik status matches (8 points)
  timeOfBirth: "13:45:00",
  placeOfBirth: "Cuttack",
  moon: "Scorpio", // Moon sign does not match (0 points)
  sun: "Scorpio",  // Not compatible with Taurus (0 points)
  venus: "Gemini", // Venus sign does not match (0 points)
  mars: "Sagittarius",
  mercury: null,
  jupiter: null,
  saturn: null,
  rahu: null,
  ketu: null,
  nakshatra: "Mula", // Not compatible with Rohini (0 points)
  ascendant: "Aries",
  horoscopeChart: null,
  rashi: null,
  kuja: null,
  otherDoshas: null,
  horoscopeNotes: null
};

const compatibility = calculateHoroscopeCompatibility(horoscope1, horoscope2);
console.log(`Compatibility score: ${compatibility}%`);

function getCompatibilityLevel(score: number): string {
  if (score >= 80) return "Excellent Match";
  if (score >= 60) return "Good Match";
  if (score >= 40) return "Average Match";
  if (score >= 20) return "Below Average Match";
  return "Poor Match";
}

console.log(`Compatibility level: ${getCompatibilityLevel(compatibility)}`);