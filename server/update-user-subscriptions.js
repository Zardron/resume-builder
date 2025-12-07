import mongoose from 'mongoose';
import 'dotenv/config';
import User from './models/User.js';
import { logInfo, logError, logWarn } from './utils/logger.js';

const updateUserSubscriptions = async () => {
  logInfo('Starting subscription update for all users...');
  
  try {
    // Validate MongoDB URI
    if (!process.env.MONGODB_URI) {
      logError('MONGODB_URI is required', new Error('Missing MONGODB_URI'));
      process.exit(1);
    }
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // First, migrate any old 'premium' plans to 'enterprise' (since premium was the highest tier)
    const premiumMigrationResult = await User.updateMany(
      {
        'subscription.plan': 'premium',
      },
      {
        $set: {
          'subscription.plan': 'enterprise',
        },
      }
    );

    if (premiumMigrationResult.modifiedCount > 0) {
      logInfo(`✅ Migrated ${premiumMigrationResult.modifiedCount} user(s) from 'premium' to 'enterprise' plan`);
    }

    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // Set end date to 1 month from now

    // Update all applicants to Basic AI subscription
    const applicantResult = await User.updateMany(
      {
        userType: { $in: ['applicant', 'both'] },
        role: { $ne: 'super_admin' }, // Exclude super admins
      },
      {
        $set: {
          'subscription.plan': 'basic',
          'subscription.status': 'active',
          'subscription.startDate': now,
          'subscription.endDate': endDate,
          'subscription.autoRenew': true,
          'subscription.paymentMethod': 'system',
        },
      }
    );

    logInfo(`✅ Updated ${applicantResult.modifiedCount} applicant(s) to Basic AI subscription`);

    // Update all super admins to Enterprise AI subscription
    const superAdminResult = await User.updateMany(
      {
        role: 'super_admin',
      },
      {
        $set: {
          'subscription.plan': 'enterprise',
          'subscription.status': 'active',
          'subscription.startDate': now,
          'subscription.endDate': endDate,
          'subscription.autoRenew': true,
          'subscription.paymentMethod': 'system',
        },
      }
    );

    logInfo(`✅ Updated ${superAdminResult.modifiedCount} super admin(s) to Enterprise AI subscription`);

    // Update regular admins (if any) to Enterprise AI subscription as well
    const adminResult = await User.updateMany(
      {
        role: 'admin',
      },
      {
        $set: {
          'subscription.plan': 'enterprise',
          'subscription.status': 'active',
          'subscription.startDate': now,
          'subscription.endDate': endDate,
          'subscription.autoRenew': true,
          'subscription.paymentMethod': 'system',
        },
      }
    );

    if (adminResult.modifiedCount > 0) {
      logInfo(`✅ Updated ${adminResult.modifiedCount} admin(s) to Enterprise AI subscription`);
    }

    // Get summary
    const totalUsers = await User.countDocuments();
    const basicSubscriptions = await User.countDocuments({ 'subscription.plan': 'basic', 'subscription.status': 'active' });
    const enterpriseSubscriptions = await User.countDocuments({ 'subscription.plan': 'enterprise', 'subscription.status': 'active' });

    logInfo('\n📊 Subscription Summary:');
    logInfo(`   Total Users: ${totalUsers}`);
    logInfo(`   Basic AI Subscriptions: ${basicSubscriptions}`);
    logInfo(`   Enterprise AI Subscriptions: ${enterpriseSubscriptions}`);
    logInfo('\n✅ Subscription update completed successfully!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    logError('Error updating user subscriptions', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

updateUserSubscriptions();

