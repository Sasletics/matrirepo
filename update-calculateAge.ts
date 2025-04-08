/**
 * Updated function to replace in both classes in storage.ts:
 * 
 * private calculateAge(dob: Date | string): number {
 *   const today = new Date();
 *   const birthDate = typeof dob === 'string' ? new Date(dob) : dob;
 *   
 *   let age = today.getFullYear() - birthDate.getFullYear();
 *   const m = today.getMonth() - birthDate.getMonth();
 *   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
 *     age--;
 *   }
 *   return age;
 * }
 */

import { db } from "./server/db";
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import * as path from 'path';

function updateStorageFile() {
  try {
    console.log("Updating calculateAge function in storage.ts...");
    
    // Get current file path in ESM
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // Read the storage.ts file
    const storageFilePath = path.join(__dirname, 'server', 'storage.ts');
    const content = fs.readFileSync(storageFilePath, 'utf-8');
    
    // Create the new function content
    const newFunction = `private calculateAge(dob: Date | string): number {
    const today = new Date();
    const birthDate = typeof dob === 'string' ? new Date(dob) : dob;
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }`;
    
    // Replace the old function with the new one using regex to match both instances
    const pattern = /private calculateAge\(dob: Date\): number \{[\s\S]*?return age;\s*\}/g;
    const updatedContent = content.replace(pattern, newFunction);
    
    // Write the updated content back to the file
    fs.writeFileSync(storageFilePath, updatedContent, 'utf-8');
    
    console.log("Successfully updated calculateAge function in storage.ts!");
  } catch (error) {
    console.error("Error updating storage.ts:", error);
  }
}

updateStorageFile();