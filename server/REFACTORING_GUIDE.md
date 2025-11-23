# Refactoring Guide: Routes to Controllers

## Overview

This guide explains how to refactor the current route-based architecture to use controllers for better separation of concerns.

## Current Structure

```
routes/
  ├── organizations.js  (contains route definitions + business logic)
  ├── jobs.js
  ├── applications.js
  └── ...
```

## Target Structure

```
controllers/
  ├── organizationController.js  (business logic only)
  ├── jobController.js
  ├── applicationController.js
  └── ...

routes/
  ├── organizations.js  (route definitions only)
  ├── jobs.js
  ├── applications.js
  └── ...
```

## Refactoring Steps

### Step 1: Create Controllers Folder
```bash
mkdir server/controllers
```

### Step 2: Extract Business Logic

**Before (routes/organizations.js):**
```javascript
router.post('/', authenticate, async (req, res) => {
  try {
    // Business logic here
    const organization = new Organization({...});
    await organization.save();
    res.json({...});
  } catch (error) {
    res.status(500).json({...});
  }
});
```

**After (controllers/organizationController.js):**
```javascript
export const createOrganization = async (req, res) => {
  try {
    // Business logic here
    const organization = new Organization({...});
    await organization.save();
    res.json({...});
  } catch (error) {
    res.status(500).json({...});
  }
};
```

**After (routes/organizations.js):**
```javascript
import { createOrganization } from '../controllers/organizationController.js';

router.post('/', authenticate, createOrganization);
```

## Example: Complete Refactoring

### Controller File (controllers/organizationController.js)
```javascript
import Organization from '../models/Organization.js';
import TeamMember from '../models/TeamMember.js';

export const createOrganization = async (req, res) => {
  // Business logic
};

export const getOrganization = async (req, res) => {
  // Business logic
};

export const updateOrganization = async (req, res) => {
  // Business logic
};
```

### Route File (routes/organizations.js)
```javascript
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole, ensureOrganizationAccess } from '../middleware/rbac.js';
import * as organizationController from '../controllers/organizationController.js';

const router = express.Router();

router.post('/', authenticate, organizationController.createOrganization);
router.get('/:orgId', authenticate, ensureOrganizationAccess, organizationController.getOrganization);
router.put('/:orgId', authenticate, requireRole('admin'), organizationController.updateOrganization);

export default router;
```

## Benefits

1. **Cleaner Routes**: Routes only define endpoints and middleware
2. **Reusable Logic**: Controllers can be imported and reused
3. **Easier Testing**: Test controllers independently
4. **Better Organization**: Clear separation of concerns
5. **Scalability**: Easier to add services layer later

## File Structure

```
server/
├── controllers/
│   ├── organizationController.js
│   ├── jobController.js
│   ├── applicationController.js
│   ├── interviewController.js
│   ├── messageController.js
│   ├── analyticsController.js
│   ├── dashboardController.js
│   └── billingController.js
├── routes/
│   ├── organizations.js
│   ├── jobs.js
│   ├── applications.js
│   └── ...
├── models/
├── middleware/
└── server.js
```

## Naming Conventions

- **Controllers**: `[resource]Controller.js` (e.g., `organizationController.js`)
- **Functions**: camelCase (e.g., `createOrganization`, `getOrganization`)
- **Exports**: Named exports (not default)

## Next Steps

1. Create controllers folder
2. Extract logic from each route file
3. Update route files to use controllers
4. Test all endpoints
5. Update documentation

## Optional: Services Layer

For even better architecture, you can add a services layer:

```
controllers/
  └── organizationController.js  (handles HTTP requests/responses)

services/
  └── organizationService.js  (handles business logic)

controllers call services, services call models
```

This is optional but recommended for complex applications.

