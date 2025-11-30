import mongoose from 'mongoose';
import 'dotenv/config';
import User from './models/User.js';
import crypto from 'crypto';
import { logInfo, logError, logWarn } from './utils/logger.js';

// Generate a secure random password
const generateSecurePassword = (length = 16) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const all = uppercase + lowercase + numbers + special;
  
  let password = '';
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

const createSuperAdmin = async () => {
  logInfo('Creating super admin user...');
  
  // Get credentials from environment variables or generate secure defaults
  const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@resumeiqhub.com';
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD || generateSecurePassword(20);
  const adminName = process.env.SUPER_ADMIN_NAME || 'ResumeIQHub Administrator';
  
  // Warn if using default credentials
  if (!process.env.SUPER_ADMIN_EMAIL || !process.env.SUPER_ADMIN_PASSWORD) {
    logWarn('Using generated/default credentials. Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in .env for production.');
  }
  
  try {
    // Validate MongoDB URI
    if (!process.env.MONGODB_URI) {
      logError('MONGODB_URI is required', new Error('Missing MONGODB_URI'));
      process.exit(1);
    }
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logInfo('Connected to MongoDB');

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
    if (existingAdmin) {
      logWarn('Super admin user already exists with this email. Updating to super_admin role...');
      existingAdmin.role = 'super_admin';
      
      // Only update password if provided via env var
      if (process.env.SUPER_ADMIN_PASSWORD) {
        existingAdmin.password = adminPassword; // Will be hashed by pre-save hook
      }
      
      existingAdmin.isEmailVerified = true;
      await existingAdmin.save();
      logInfo('Super admin updated successfully!');
      
      if (process.env.SUPER_ADMIN_PASSWORD) {
        logInfo(`\n📋 Updated Admin Details:`);
        logInfo(`   Email: ${adminEmail}`);
        logInfo(`   Password: [Updated from environment variable]`);
        logInfo(`   Role: super_admin`);
      }
      
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create new super admin user
    const superAdmin = new User({
      fullName: adminName,
      email: adminEmail.toLowerCase(),
      password: adminPassword, // Will be hashed by pre-save hook
      role: 'super_admin',
      userType: 'both', // Can act as both applicant and recruiter
      isEmailVerified: true, // Admin account should be verified
      credits: 10000, // Give admin plenty of credits
      subscription: {
        plan: 'enterprise',
        status: 'active',
        startDate: new Date(),
        endDate: (() => {
          const date = new Date();
          date.setMonth(date.getMonth() + 1);
          return date;
        })(),
        autoRenew: true,
        paymentMethod: 'system',
      },
      profile: {
        title: 'System Administrator',
        company: 'ResumeIQHub',
        bio: 'Platform administrator with full system access',
      },
    });

    await superAdmin.save();
    logInfo('Super admin user created successfully!');
    logInfo('\n📋 User Details:');
    logInfo(`   Email: ${adminEmail}`);
    
    // Only show password if it was generated (not from env)
    if (!process.env.SUPER_ADMIN_PASSWORD) {
      logInfo(`   Password: ${adminPassword}`);
      logWarn('⚠️  IMPORTANT: Save this password securely. It will not be shown again.');
    } else {
      logInfo(`   Password: [Set from environment variable]`);
    }
    
    logInfo(`   Role: super_admin`);
    logInfo(`   Credits: 10,000`);
    logInfo(`   Subscription: Enterprise AI (Active)`);
    logInfo(`   Email Verified: Yes`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    logError('Error creating super admin', error);
    if (error.code === 11000) {
      logError('User with this email already exists.');
    }
    await mongoose.connection.close();
    process.exit(1);
  }
};

createSuperAdmin();
