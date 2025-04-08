import { Horoscope } from "@shared/schema";

/**
 * Calculate horoscope compatibility score between two users
 * @param horoscope1 First user's horoscope
 * @param horoscope2 Second user's horoscope
 * @returns Compatibility percentage from 0-100
 */
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

/**
 * Check if two zodiac signs are compatible
 */
export function areZodiacSignsCompatible(sign1: string, sign2: string): boolean {
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

/**
 * Check if two nakshatras are compatible
 */
export function areNakshatrasCompatible(nakshatra1: string, nakshatra2: string): boolean {
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