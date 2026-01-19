# NGO Management API Documentation

## Overview

This document describes the new NGO management endpoints that have been added to the authentication routes. These endpoints allow for:

1. Adding a single NGO organization
2. Bulk uploading multiple NGOs from an Excel file
3. Downloading a sample Excel template for bulk uploads

---

## Endpoints

### 1. Add Single NGO

**Endpoint:** `POST /auth/organizations`

**Description:** Creates a new NGO organization with all related records (user, organization, address, and bank information). Automatically generates a secure password and sends a welcome email.

**Request Body:**

```json
{
  "name": "Organization Name",
  "email": "contact@organization.org",
  "phone": "+234812345678",
  "address": "123 Main Street (optional)",
  "state": "Lagos (optional)",
  "city_lga": "Ikeja (optional)",
  "interest_area": "Education,Healthcare (optional, comma-separated)",
  "cac": "RC12345678 (optional)",
  "website": "https://organization.org (optional)",
  "bankName": "First Bank (optional)",
  "accountName": "Organization Name (optional)",
  "accountNumber": "1234567890 (optional)",
  "bvn": "11123456789 (optional)"
}
```

**Required Fields:**

- `name` - Organization name
- `email` - Unique email address
- `phone` - Contact phone number

**Response (Success - 201):**

```json
{
  "status": "success",
  "message": "NGO added successfully",
  "data": {
    "userId": 170,
    "email": "contact@organization.org",
    "name": "Organization Name",
    "note": "A welcome email with login credentials has been sent to the organization"
  }
}
```

**Response (Error - 400/409/500):**

```json
{
  "error": "Error message describing what went wrong"
}
```

**Example cURL:**

```bash
curl -X POST http://localhost:5000/auth/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Example NGO",
    "email": "contact@examplengo.org",
    "phone": "+234812345678",
    "address": "123 Main Street",
    "state": "Lagos",
    "city_lga": "Ikeja",
    "interest_area": "Education,Healthcare",
    "cac": "RC12345678",
    "website": "https://examplengo.org",
    "bankName": "First Bank",
    "accountName": "Example NGO",
    "accountNumber": "1234567890",
    "bvn": "11123456789"
  }'
```

---

### 2. Bulk Upload NGOs

**Endpoint:** `POST /auth/bulk/upload`

**Description:** Uploads multiple NGO organizations from an Excel file. Each NGO in the file is created with an auto-generated password and receives a welcome email.

**Request:**

- **Method:** POST
- **Content-Type:** multipart/form-data
- **Form Field:** `bulk` (file input)

**Accepted File Formats:**

- `.xlsx` (Excel 2007+)
- `.xls` (Excel 97-2003)

**Required Excel Columns:**

1. `Name` - Organization name
2. `Email` - Unique email address
3. `Phone` - Contact phone number

**Optional Excel Columns:** 4. `Address` - Physical address 5. `State` - State/Province 6. `City_LGA` - City/LGA 7. `Interest_Area` - Comma-separated focus areas 8. `CAC` - Corporate Affairs Commission number 9. `Website` - Organization website 10. `BankName` - Bank name 11. `AccountName` - Account holder name 12. `AccountNumber` - Bank account number 13. `BVN` - Bank Verification Number

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Bulk upload completed",
  "summary": {
    "total": 50,
    "successful": 48,
    "failed": 2
  },
  "successData": [
    {
      "name": "Example NGO",
      "email": "contact@examplengo.org",
      "userId": 170,
      "password": "SecurePassword123!@"
    },
    {
      "name": "Another NGO",
      "email": "info@anotherngo.org",
      "userId": 171,
      "password": "AnotherPassword456!@"
    }
  ],
  "errors": [
    {
      "name": "Failed NGO",
      "email": "duplicate@email.org",
      "error": "Email already exists"
    }
  ]
}
```

**Response (Error - 400/500):**

```json
{
  "error": "Error message describing what went wrong"
}
```

**Example with JavaScript/Fetch:**

```javascript
const formData = new FormData();
const fileInput = document.getElementById("fileInput").files[0];
formData.append("bulk", fileInput);

fetch("http://localhost:5000/auth/bulk/upload", {
  method: "POST",
  body: formData,
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

**Example with cURL:**

```bash
curl -X POST http://localhost:5000/auth/bulk/upload \
  -F "bulk=@path/to/ngos.xlsx"
```

---

### 3. Download Sample NGO File

**Endpoint:** `GET /auth/bulk/sample`

**Description:** Downloads a sample Excel file with the correct format and structure for bulk uploading NGOs. This file serves as a template for users to understand the required columns and format.

**Response:**

- **Content-Type:** application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
- **File Name:** `sample_ngos_bulk.xlsx`

**File Contents:**
The sample file includes:

- Header row with all supported column names
- Two example NGO entries demonstrating proper data format
- Pre-formatted column widths for readability

**Example cURL:**

```bash
curl -X GET http://localhost:5000/auth/bulk/sample \
  -o sample_ngos_bulk.xlsx
```

**Example JavaScript/Fetch:**

```javascript
fetch("http://localhost:5000/auth/bulk/sample")
  .then((response) => response.blob())
  .then((blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_ngos_bulk.xlsx";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  });
```

---

## Data Structure

### User Table (Created)

```sql
INSERT INTO users (email, password, active, role, status, token)
VALUES ('org@email.com', 'hashed_password', 1, 'NGO', 1, 0)
```

### Organization Table (Created)

```sql
INSERT INTO organizations (name, phone, website, interest_area, cac, user_id, active, is_verified)
VALUES ('NGO Name', '+234812345678', 'https://ngo.org', 'Education', 'RC12345678', 170, 1, 0)
```

### Address Table (Created if data provided)

```sql
INSERT INTO address (address, state, city_lga, user_id)
VALUES ('123 Main St', 'Lagos', 'Ikeja', 170)
```

### Bank Table (Created if data provided)

```sql
INSERT INTO banks (bankName, accountName, accountNumber, bvn, user_id)
VALUES ('First Bank', 'NGO Name', '1234567890', '11123456789', 170)
```

---

## Password Generation

Auto-generated passwords are:

- **Length:** 12 characters
- **Characters:** Uppercase, lowercase, numbers, and special characters (!@#$%^&\*)
- **Sent to:** Organization's email address via welcome email
- **Format:** `ngowelcome` email template (requires email service configuration)

---

## Error Handling

### Common Error Responses

**1. Missing Required Fields (400)**

```json
{
  "error": "Name, email, and phone are required fields"
}
```

**2. Email Already Exists (409)**

```json
{
  "error": "User with this email already exists"
}
```

**3. File Not Provided (400)**

```json
{
  "error": "File is required"
}
```

**4. No Valid Rows in File (400)**

```json
{
  "error": "No valid rows found in the file"
}
```

**5. Internal Server Error (500)**

```json
{
  "error": "An error occurred while adding the NGO"
}
```

---

## Validation Rules

### Email

- Must be unique across the system
- Required for user login and communications

### Phone

- Required field
- Accepts any format (no specific validation)

### Password (Auto-generated)

- 12 characters
- Mix of uppercase, lowercase, numbers, and special characters
- Cannot be changed by bulk upload

### Interest Area

- Optional field
- Can be comma-separated values (e.g., "Education,Healthcare,Environment")

### CAC Number

- Optional field
- Used for organization verification

### Bank Details

- All bank fields are optional
- If provided, all three (bankName, accountNumber, accountName) should ideally be provided

---

## Email Notifications

When an NGO is created (single or bulk), a welcome email is sent containing:

- Organization name
- Auto-generated password
- Login instructions
- Subject: "Your NGO Account Has Been Created"

**Note:** Email functionality requires proper Email service configuration in `utils/mail`.

---

## Transaction Handling

All operations use database transactions to ensure data consistency:

- If any step fails, all changes for that record are rolled back
- Bulk uploads continue with remaining records even if one fails
- Failed records are returned in the response with error details

---

## Rate Limiting

No specific rate limiting is implemented. Recommended to add:

- Per-IP rate limiting on bulk upload endpoint
- Authentication requirement for bulk uploads (optional)
- File size limits on uploads

---

## Security Considerations

1. **CORS:** Ensure proper CORS configuration for frontend access
2. **Authentication:** Consider requiring admin/authenticated user for bulk operations
3. **File Upload:** Implement file size limits (recommend 10MB max)
4. **Email Verification:** Consider requiring email verification before account activation
5. **Password:** Generated passwords should be unique and sent securely

---

## Frontend Integration

### Using AddNGOModal Component

The frontend `AddNGOModal.tsx` component already has:

- Manual entry form for single NGO creation
- File upload interface for bulk uploads
- Sample file download functionality

**Manual Entry Tab:**

- Step-by-step form (4 steps)
- Validates each step before proceeding
- Submits to `POST /auth/organizations`

**Upload Tab:**

- File selector with drag-and-drop
- Excel file validation
- Submits to `POST /auth/bulk/upload`

### Sample File Download Integration

The component has a "Download template" button that calls:

```javascript
GET / auth / bulk / sample;
```

---

## Testing

### Test Single NGO Creation

```bash
curl -X POST http://localhost:5000/auth/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test NGO",
    "email": "test@testngo.org",
    "phone": "+234800000000"
  }'
```

### Test Bulk Upload

1. Download sample file: `GET /auth/bulk/sample`
2. Edit the file with test data
3. Upload: `POST /auth/bulk/upload`

### Expected Results

- User created with role "NGO"
- Organization record created
- Address record created (if provided)
- Bank record created (if provided)
- Welcome email sent
- Auto-generated password included in response

---

## Troubleshooting

### Issue: "Email already exists"

**Solution:** Use a unique email address not previously registered

### Issue: Email not received

**Solution:** Check Email service configuration in `utils/mail`

### Issue: File upload fails

**Solution:** Ensure file is in Excel format (.xlsx or .xls)

### Issue: Some rows not imported

**Solution:** Check that rows have Name, Email, and Phone columns

### Issue: Transaction rollback

**Solution:** Check database error logs for constraint violations

---

## Future Enhancements

1. Add email verification step
2. Implement automatic approval workflow
3. Add CSV file support
4. Batch password reset functionality
5. NGO profile verification workflow
6. Custom field mapping for bulk uploads
7. Import history tracking
8. Duplicate detection and handling
