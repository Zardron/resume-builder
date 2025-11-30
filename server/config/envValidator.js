// Environment variable validation

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
];

const optionalEnvVars = {
  PORT: '5001',
  CLIENT_URL: 'http://localhost:5173',
  JWT_EXPIRES_IN: '30d',
  NODE_ENV: 'development',
  SENDGRID_API_KEY: '',
  SENDGRID_FROM_EMAIL: '',
  CLOUDINARY_CLOUD_NAME: '',
  CLOUDINARY_API_KEY: '',
  CLOUDINARY_API_SECRET: '',
  GEMINI_API_KEY: '',
};

// Validates JWT_SECRET strength
const validateJWTSecret = (secret) => {
  if (!secret || typeof secret !== 'string') {
    return { valid: false, error: 'JWT_SECRET is required' };
  }
  
  if (secret.length < 32) {
    return { valid: false, error: 'JWT_SECRET must be at least 32 characters long for security' };
  }
  
  return { valid: true };
};

// Validates MongoDB URI format
const validateMongoURI = (uri) => {
  if (!uri || typeof uri !== 'string') {
    return { valid: false, error: 'MONGODB_URI is required' };
  }
  
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    return { valid: false, error: 'MONGODB_URI must be a valid MongoDB connection string' };
  }
  
  return { valid: true };
};

// Validates all environment variables
export const validateEnv = () => {
  const errors = [];
  const warnings = [];

  // Check required variables
  for (const varName of requiredEnvVars) {
    const value = process.env[varName];
    
    if (!value) {
      errors.push(`Missing required environment variable: ${varName}`);
      continue;
    }

    // Special validation for JWT_SECRET
    if (varName === 'JWT_SECRET') {
      const validation = validateJWTSecret(value);
      if (!validation.valid) {
        errors.push(`JWT_SECRET validation failed: ${validation.error}`);
      }
    }

    // Special validation for MONGODB_URI
    if (varName === 'MONGODB_URI') {
      const validation = validateMongoURI(value);
      if (!validation.valid) {
        errors.push(`MONGODB_URI validation failed: ${validation.error}`);
      }
    }
  }

  // Check optional variables and set defaults
  for (const [varName, defaultValue] of Object.entries(optionalEnvVars)) {
    if (!process.env[varName]) {
      if (defaultValue) {
        process.env[varName] = defaultValue;
        warnings.push(`Using default value for ${varName}: ${defaultValue}`);
      } else {
        warnings.push(`Optional environment variable not set: ${varName}`);
      }
    }
  }

  // Security warnings for production
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.SENDGRID_API_KEY) {
      warnings.push('SENDGRID_API_KEY not set - email functionality will be disabled');
    }
    
    if (process.env.SENDGRID_API_KEY && !process.env.SENDGRID_FROM_EMAIL) {
      warnings.push('SENDGRID_FROM_EMAIL not set - using default. Make sure the default email is verified in SendGrid as a Sender Identity');
    }
    
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 64) {
      warnings.push('JWT_SECRET is shorter than recommended for production (64+ characters)');
    }
    
    if (process.env.CLIENT_URL === 'http://localhost:5173') {
      warnings.push('CLIENT_URL is set to localhost - this should be your production domain');
    }
  }

  return { errors, warnings };
};

// Validates and loads environment variables (call at server startup)
export const loadAndValidateEnv = () => {
  const { errors, warnings } = validateEnv();

  // Log warnings
  if (warnings.length > 0) {
    console.warn('\n⚠️  Environment Variable Warnings:');
    warnings.forEach(warning => console.warn(`   - ${warning}`));
    console.warn('');
  }

  // Log errors and exit if critical
  if (errors.length > 0) {
    console.error('\n❌ Environment Variable Errors:');
    errors.forEach(error => console.error(`   - ${error}`));
    console.error('\nPlease fix these errors before starting the server.\n');
    process.exit(1);
  }

  console.log('✅ Environment variables validated successfully');
};

