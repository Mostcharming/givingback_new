# Project API Documentation

## Overview

The Project API provides endpoints for creating and managing project briefs. All endpoints are secured with authentication middleware.

## Endpoints

### Create Project Brief

**POST** `/project`

#### Authentication

Required: `secureLogin` middleware (Bearer token in Authorization header)

#### Request Body

```json
{
  "title": "Build Community Center",
  "category": "Infrastructure",
  "description": "We need to construct a community center for the local residents...",
  "budget": "5000000",
  "deadline": "2026-03-15",
  "state": "Lagos",
  "lga": "Ikeja",
  "status": "brief"
}
```

#### Field Mapping

| Frontend Field | Database Field  | Type                | Required | Notes                                           |
| -------------- | --------------- | ------------------- | -------- | ----------------------------------------------- |
| title          | title           | string              | Yes      | Project title                                   |
| category       | category        | string              | Yes      | Project category                                |
| description    | description     | string              | Yes      | Project description                             |
| budget         | cost            | number              | Yes      | Budget amount (will be parsed to float)         |
| deadline       | deadline        | string (YYYY-MM-DD) | Yes      | Application deadline                            |
| state          | state           | string              | Yes      | State/Province                                  |
| lga            | city            | string              | Yes      | LGA/City (maps to city field in DB)             |
| status         | status          | string              | Yes      | One of: `draft`, `brief`, `active`, `completed` |
| N/A            | donor_id        | number              | Auto     | Extracted from authenticated user               |
| N/A            | organization_id | number              | Auto     | Set to null (can be assigned later)             |

#### Success Response (201 Created)

```json
{
  "status": "success",
  "message": "Project brief created successfully",
  "data": {
    "id": 1,
    "title": "Build Community Center",
    "category": "Infrastructure",
    "description": "We need to construct a community center for the local residents...",
    "budget": 5000000,
    "deadline": "2026-03-15",
    "state": "Lagos",
    "city": "Ikeja",
    "status": "brief",
    "donor_id": 5,
    "createdAt": "2026-01-20T10:30:00.000Z"
  }
}
```

#### Error Responses

**400 - Missing Required Fields**

```json
{
  "status": "fail",
  "error": "Missing required field(s): title, category"
}
```

**400 - Invalid Budget**

```json
{
  "status": "fail",
  "error": "Budget must be a valid positive number"
}
```

**400 - Invalid Deadline**

```json
{
  "status": "fail",
  "error": "Deadline must be a valid date (YYYY-MM-DD)"
}
```

**400 - Invalid Status**

```json
{
  "status": "fail",
  "error": "Status must be one of: draft, brief, active, completed"
}
```

**400 - User Not a Donor**

```json
{
  "status": "fail",
  "message": "User is not registered as a donor"
}
```

**401 - Unauthorized**

```json
{
  "status": "fail",
  "message": "Unauthorized: User not found"
}
```

**500 - Server Error**

```json
{
  "status": "fail",
  "error": "An error occurred while creating the project brief",
  "details": "Error message details"
}
```

## Implementation Details

### Security

- All endpoints require valid JWT authentication via `secureLogin` middleware
- User identity is verified and stored in `req.user`
- Donor information is automatically fetched from the authenticated user's context

### Transaction Handling

- Project creation uses database transactions
- If any error occurs, the transaction is automatically rolled back
- Ensures data consistency

### Validation

- All required fields are validated before processing
- Budget is converted to float and validated to be positive
- Deadline is validated as a proper date
- Status is validated against allowed values
- User must be registered as a donor

### Database Schema

Projects are stored in the `project` table with the following structure:

```sql
CREATE TABLE `project` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(128),
  `category` VARCHAR(128),
  `description` TEXT,
  `cost` INT,
  `deadline` DATE,
  `state` VARCHAR(128),
  `city` VARCHAR(128),
  `status` VARCHAR(128),
  `donor_id` INT,
  `organization_id` INT UNSIGNED,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ...other fields
);
```

## Example Usage

### Frontend (React/TypeScript)

```typescript
const handlePublish = async () => {
  const finalData = {
    title: formData.title,
    category: formData.category,
    description: formData.description,
    budget: formData.budget,
    deadline: formData.deadline,
    state: formData.state,
    lga: formData.lga,
    status: "brief",
  };

  try {
    const response = await fetch("/api/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(finalData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Project created:", result.data);
      // Handle success
    } else {
      console.error("Error:", result.error);
      // Handle error
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
};
```

### cURL Example

```bash
curl -X POST http://localhost:3000/api/project \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Build Community Center",
    "category": "Infrastructure",
    "description": "We need to construct a community center for the local residents...",
    "budget": "5000000",
    "deadline": "2026-03-15",
    "state": "Lagos",
    "lga": "Ikeja",
    "status": "brief"
  }'
```

## Notes

- The `donor_id` is automatically extracted from the authenticated user's donor profile
- The `organization_id` is set to null during creation but can be updated later
- All timestamps are stored in UTC
- The API uses transaction rollback on errors to maintain database consistency
