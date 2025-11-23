# Environment Variables Setup

This guide will help you set up the environment variables for the ResumeIQHub backend server.

## Quick Setup

1. Create a `.env` file in the `server` directory:
   ```bash
   cd server
   touch .env
   ```

2. Copy the following content into your `.env` file and replace `<db_password>` with your actual MongoDB password:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=30d

# MongoDB Configuration
# Replace <db_password> with your actual MongoDB password
MONGODB_URI=mongodb+srv://resumeiq2025_db_user:<db_password>@resumeiq.vbr3s8j.mongodb.net/?appName=ResumeIQHub

# SendGrid Configuration
SENDGRID_API_KEY=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
SENDGRID_TEMPLATE_ID=d-bde0e60eb8b14303bb06191b9f430b6f
SENDGRID_ACCOUNT_ID=57474233
SENDGRID_FROM_EMAIL=noreply@resumeiqhub.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=825146366681682
CLOUDINARY_API_SECRET=aub7arVEhMKjiB2sfTz3WKlur1k

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173
```

## Important Notes

1. **MongoDB Password**: Replace `<db_password>` in the `MONGODB_URI` with your actual MongoDB database password.

2. **Cloudinary Cloud Name**: Replace `your_cloud_name` with your actual Cloudinary cloud name. You can find this in your Cloudinary dashboard.

3. **JWT Secret**: Change `your_jwt_secret_key_change_in_production` to a strong, random secret key for production use.

4. **SendGrid From Email**: Update `SENDGRID_FROM_EMAIL` to match a verified sender email in your SendGrid account.

5. **Frontend URL**: Update `FRONTEND_URL` to your production frontend URL when deploying.

## Security Best Practices

- Never commit the `.env` file to version control
- Use different credentials for development and production
- Rotate API keys regularly
- Use strong, random JWT secrets

## Verification

After setting up your `.env` file, start the server:

```bash
npm run dev
```

You should see:
- ✅ Connected to MongoDB
- 🚀 Server is running on port 5000

If you see any connection errors, double-check your credentials in the `.env` file.

