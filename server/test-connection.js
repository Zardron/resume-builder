import mongoose from 'mongoose';
import 'dotenv/config';

const testConnection = async () => {
  console.log('Testing MongoDB connection...');
  console.log('Connection string (masked):', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@'));
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connection successful!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.message.includes('bad auth')) {
      console.error('\n💡 Authentication failed. Possible causes:');
      console.error('   1. Password is incorrect');
      console.error('   2. Username is incorrect');
      console.error('   3. Password has special characters that need URL encoding');
      console.error('\n   Try:');
      console.error('   - Verify the password in MongoDB Atlas');
      console.error('   - Reset the password if needed');
      console.error('   - Try the other username: resumeiq2025_db_user');
    }
    process.exit(1);
  }
};

testConnection();

