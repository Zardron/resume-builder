import mongoose from 'mongoose';
import 'dotenv/config';
import User from './models/User.js';

const createSuperAdmin = async () => {
  console.log('Creating super admin user...');
  console.log('Connection string (masked):', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@'));
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resumeiqhub');
    console.log('✅ Connected to MongoDB');

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ email: 'resumeiqhub@gmail.com' });
    if (existingAdmin) {
      console.log('⚠️  Super admin user already exists with this email.');
      console.log('   Updating to super_admin role...');
      existingAdmin.role = 'super_admin';
      existingAdmin.password = 'Poslaklopq123!'; // Will be hashed by pre-save hook
      existingAdmin.isEmailVerified = true;
      await existingAdmin.save();
      console.log('✅ Super admin updated successfully!');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create new super admin user
    const superAdmin = new User({
      fullName: 'ResumeIQHub Administrator',
      email: 'resumeiqhub@gmail.com',
      password: 'Poslaklopq123!', // Will be hashed by pre-save hook
      role: 'super_admin',
      userType: 'both', // Can act as both applicant and recruiter
      isEmailVerified: true, // Admin account should be verified
      credits: 10000, // Give admin plenty of credits
      subscription: {
        plan: 'premium',
        status: 'active',
        startDate: new Date(),
        autoRenew: true,
      },
      profile: {
        title: 'System Administrator',
        company: 'ResumeIQHub',
        bio: 'Platform administrator with full system access',
      },
    });

    await superAdmin.save();
    console.log('✅ Super admin user created successfully!');
    console.log('\n📋 User Details:');
    console.log('   Email: resumeiqhub@gmail.com');
    console.log('   Password: Poslaklopq123!');
    console.log('   Role: super_admin');
    console.log('   Credits: 10,000');
    console.log('   Subscription: Premium (Active)');
    console.log('   Email Verified: Yes');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
    if (error.code === 11000) {
      console.error('   User with this email already exists.');
    }
    await mongoose.connection.close();
    process.exit(1);
  }
};

createSuperAdmin();

