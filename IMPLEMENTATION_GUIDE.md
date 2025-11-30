# Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing the remaining TODO items and completing the ResumeIQHub platform.

## Priority Implementation Tasks

### Phase 1: Critical Security & Stability (Week 1)

#### 1.1 Complete API Integrations

**Status:** 67 TODO items found

**Tasks:**
- [ ] Connect all frontend pages to backend APIs
- [ ] Replace mock data with real API calls
- [ ] Implement proper error handling for all API calls
- [ ] Add loading states for all async operations

**Files to Update:**
- `client/src/pages/recruiter/*.jsx` - All recruiter pages
- `client/src/pages/applicant/*.jsx` - All applicant pages
- `client/src/pages/admin/*.jsx` - Admin pages

**Example Implementation:**
```javascript
// Before (TODO)
// TODO: Fetch jobs from API
const fetchJobs = async () => {
  setTimeout(() => {
    setJobs([...mockData]);
  }, 1000);
};

// After (Complete)
const fetchJobs = async () => {
  try {
    setIsLoading(true);
    const jobs = await jobsAPI.getAll();
    setJobs(jobs);
  } catch (error) {
    setErrorMessage(error.message || 'Failed to load jobs');
  } finally {
    setIsLoading(false);
  }
};
```

#### 1.2 Error Tracking Integration

**Task:** Integrate error tracking service (Sentry recommended)

**Steps:**
1. Install Sentry: `npm install @sentry/react @sentry/node`
2. Configure in `client/src/main.jsx` and `server/server.js`
3. Replace console.error with Sentry.captureException
4. Set up error alerts

#### 1.3 CSRF Protection

**Task:** Implement CSRF token protection

**Steps:**
1. Install csrf: `npm install csurf`
2. Add CSRF middleware to server
3. Include CSRF token in frontend requests
4. Validate tokens on state-changing operations

### Phase 2: Testing & Quality (Week 2)

#### 2.1 Unit Tests

**Task:** Add comprehensive unit tests

**Coverage Goals:**
- Models: 90%+
- Controllers: 80%+
- Middleware: 90%+
- Utilities: 95%+

**Tools:**
- Jest for backend
- Vitest for frontend
- React Testing Library for components

#### 2.2 Integration Tests

**Task:** Add API integration tests

**Coverage:**
- All authentication flows
- CRUD operations
- Error scenarios
- Edge cases

#### 2.3 E2E Tests

**Task:** Add end-to-end tests

**Tools:**
- Playwright or Cypress
- Test critical user flows
- Test across browsers

### Phase 3: Documentation & Polish (Week 3)

#### 3.1 API Documentation

**Task:** Create comprehensive API documentation

**Tools:**
- Swagger/OpenAPI
- Postman collection
- API usage examples

#### 3.2 Code Documentation

**Task:** Add JSDoc comments to all functions

**Priority:**
1. Public APIs
2. Complex business logic
3. Utility functions
4. Components

#### 3.3 User Documentation

**Task:** Create user guides

**Content:**
- Getting started guide
- Feature documentation
- FAQ
- Troubleshooting

## Implementation Patterns

### API Integration Pattern

```javascript
// 1. Create API function in services/api.js
export const resourceAPI = {
  getAll: async () => {
    const response = await apiRequest('/resource');
    return response.data?.resources || [];
  },
  // ... other methods
};

// 2. Use in component
const MyComponent = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await resourceAPI.getAll();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage message={error} />;
  return <DataDisplay data={data} />;
};
```

### Error Handling Pattern

```javascript
// Consistent error handling
try {
  const result = await apiCall();
  // Handle success
} catch (error) {
  // Log error
  logError('Operation failed', error, { context });
  
  // Show user-friendly message
  const userMessage = error.isNetworkError
    ? 'Network error. Please check your connection.'
    : error.message || 'An error occurred. Please try again.';
  
  setErrorMessage(userMessage);
  dispatch(addNotification({
    type: 'error',
    title: 'Error',
    message: userMessage,
  }));
}
```

### Validation Pattern

```javascript
// Server-side validation
import { validateEmail, validatePassword, validateFields } from '../middleware/validation.js';

router.post('/endpoint', 
  validateFields({
    email: validateEmail,
    password: validatePassword,
    name: (value) => validateText(value, { required: true, minLength: 2 }),
  }),
  async (req, res) => {
    // req.body is now validated and sanitized
  }
);
```

## Testing Patterns

### Unit Test Example

```javascript
// server/utils/__tests__/validation.test.js
import { validateEmail, validatePassword } from '../validation.js';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email', () => {
      const result = validateEmail('test@example.com');
      expect(result.valid).toBe(true);
    });
    
    it('should reject invalid email', () => {
      const result = validateEmail('invalid');
      expect(result.valid).toBe(false);
    });
  });
});
```

### Integration Test Example

```javascript
// server/__tests__/auth.test.js
import request from 'supertest';
import app from '../server.js';

describe('Auth API', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Test123!@#',
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

## Code Review Checklist

Before submitting code:

- [ ] All TODO comments addressed or documented
- [ ] Input validation added
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Tests written (if applicable)
- [ ] Documentation updated
- [ ] No console.log in production code
- [ ] No hardcoded values
- [ ] Security considerations addressed
- [ ] Performance optimized (if needed)

## Common Issues & Solutions

### Issue: API calls failing silently

**Solution:**
```javascript
// Always handle errors
try {
  await apiCall();
} catch (error) {
  // Log and notify user
  console.error('API Error:', error);
  setErrorMessage(error.message);
}
```

### Issue: Memory leaks from subscriptions

**Solution:**
```javascript
useEffect(() => {
  const controller = new AbortController();
  
  fetchData(controller.signal);
  
  return () => {
    controller.abort(); // Cleanup
  };
}, []);
```

### Issue: Race conditions in API calls

**Solution:**
```javascript
useEffect(() => {
  let cancelled = false;
  
  const fetchData = async () => {
    const data = await apiCall();
    if (!cancelled) {
      setData(data);
    }
  };
  
  fetchData();
  
  return () => {
    cancelled = true;
  };
}, []);
```

## Performance Optimization

### Database Queries

- Use indexes on frequently queried fields
- Implement pagination for large datasets
- Use select() to limit returned fields
- Cache frequently accessed data

### Frontend Optimization

- Lazy load routes and components
- Implement virtual scrolling for long lists
- Optimize images (WebP, lazy loading)
- Code splitting for better bundle size

## Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] Tests passing
- [ ] Security audit completed
- [ ] Performance tested
- [ ] Error tracking configured
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Rollback plan prepared

## Support & Resources

- **Code Review Report:** See `CODE_REVIEW_REPORT.md`
- **Security Guide:** See `SECURITY.md`
- **API Documentation:** See API docs (to be created)
- **Architecture:** See architecture docs (to be created)

---

*This guide is a living document. Update as patterns and best practices evolve.*

