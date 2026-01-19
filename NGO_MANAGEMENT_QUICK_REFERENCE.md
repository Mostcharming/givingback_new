# NGO Management - Quick Reference Guide

## Overview

Three new endpoints for managing NGO organizations with auto-generated passwords and email notifications.

---

## 🚀 Quick Start

### 1. Add Single NGO

**Endpoint:** `POST /auth/organizations`

**Example:**

```bash
curl -X POST http://localhost:5000/auth/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Education First NGO",
    "email": "admin@educationfirst.org",
    "phone": "+2348012345678",
    "address": "456 Education Road",
    "state": "Abuja",
    "city_lga": "Federal Capital Territory",
    "interest_area": "Education,Mentorship",
    "cac": "RC9876543",
    "website": "https://educationfirst.org",
    "bankName": "Access Bank",
    "accountName": "Education First NGO",
    "accountNumber": "0987654321",
    "bvn": "22123456789"
  }'
```

**Required Fields:**

- `name` - Organization name
- `email` - Unique email address
- `phone` - Contact phone number

**Optional Fields:**

- `address`, `state`, `city_lga` - Location info
- `interest_area` - Comma-separated focus areas
- `cac` - Registration number
- `website` - Organization website
- `bankName`, `accountName`, `accountNumber`, `bvn` - Bank details

**Response:**

```json
{
  "status": "success",
  "message": "NGO added successfully",
  "data": {
    "userId": 170,
    "email": "admin@educationfirst.org",
    "name": "Education First NGO",
    "note": "A welcome email with login credentials has been sent to the organization"
  }
}
```

---

### 2. Download Sample Template

**Endpoint:** `GET /auth/bulk/sample`

**Example:**

```bash
# Download sample file
curl -X GET http://localhost:5000/auth/bulk/sample \
  -o ngos_template.xlsx
```

**What You Get:**

- Excel file with proper column headers
- 2 example rows showing correct format
- Column widths optimized for readability

**Columns in Template:**

```
Name | Email | Phone | Address | State | City_LGA | Interest_Area | CAC | Website | BankName | AccountName | AccountNumber | BVN
```

---

### 3. Bulk Upload NGOs

**Endpoint:** `POST /auth/bulk/upload`

**Steps:**

1. Download template from endpoint #2
2. Fill in NGO data (one row per NGO)
3. Save as Excel file
4. Upload using endpoint below

**Example:**

```bash
curl -X POST http://localhost:5000/auth/bulk/upload \
  -F "bulk=@ngos_list.xlsx"
```

**JavaScript Example:**

```javascript
const formData = new FormData();
formData.append("bulk", fileInput.files[0]);

const response = await fetch("http://localhost:5000/auth/bulk/upload", {
  method: "POST",
  body: formData,
});

const result = await response.json();
console.log(`Successfully added: ${result.summary.successful}`);
console.log(`Failed: ${result.summary.failed}`);
```

**Response:**

```json
{
  "success": true,
  "message": "Bulk upload completed",
  "summary": {
    "total": 3,
    "successful": 3,
    "failed": 0
  },
  "successData": [
    {
      "name": "Health Initiative",
      "email": "contact@healthinit.org",
      "userId": 171,
      "password": "Tr0pic@lSunset2024"
    }
  ]
}
```

---

## 📋 Excel Format Example

**File:** `ngos_list.xlsx`

| Name            | Email             | Phone          | Address      | State | City_LGA | Interest_Area    | CAC   | Website           | BankName    | AccountName     | AccountNumber | BVN         |
| --------------- | ----------------- | -------------- | ------------ | ----- | -------- | ---------------- | ----- | ----------------- | ----------- | --------------- | ------------- | ----------- |
| Help Foundation | contact@help.org  | +2348012345678 | 123 Main St  | Lagos | Ikeja    | Education,Health | RC123 | https://help.org  | First Bank  | Help Foundation | 1234567890    | 11123456789 |
| Water Project   | water@project.org | +2348087654321 | 456 River Rd | Oyo   | Ibadan   | Water,Sanitation | RC456 | https://water.org | GTBank      | Water Project   | 0987654321    | 22234567890 |
| Care NGO        | support@care.org  | +2349012345678 | 789 Care Ave | Kano  | Kano     | Healthcare       | RC789 | https://care.org  | Access Bank | Care NGO        | 5555555555    | 33345678901 |

---

## ✅ What Gets Created

When you add an NGO, the system creates:

### 1. **User Account** (auto-generated credentials)

- Email login
- Random 12-character password
- Role set to "NGO"

### 2. **Organization Profile**

- Organization details
- Contact information
- Focus areas
- Verification status (starts as unverified)

### 3. **Address Record** (if provided)

- Street address
- State
- City/LGA

### 4. **Bank Account** (if provided)

- Bank name
- Account details
- BVN

### 5. **Welcome Email**

- Subject: "Your NGO Account Has Been Created"
- Contains: Name, email, and auto-generated password
- Recipient: Organization's email address

---

## 🔐 Auto-Generated Passwords

**Characteristics:**

- Length: 12 characters
- Contains: Uppercase, lowercase, numbers, special characters
- Example: `Tr0pic@lSunset2024`
- Sent via: Welcome email to organization

**Security:**

- Never shown in browser console
- Only sent via email to registered email address
- Hashed in database using bcrypt

---

## 📊 Error Handling

### Single NGO Addition

**Error: Missing required fields**

```json
{
  "error": "Name, email, and phone are required fields"
}
```

**Error: Email already exists**

```json
{
  "error": "User with this email already exists"
}
```

**Error: Server error**

```json
{
  "error": "An error occurred while adding the NGO"
}
```

### Bulk Upload

**Error: No file provided**

```json
{
  "error": "File is required"
}
```

**Error: No valid data**

```json
{
  "error": "No valid rows found in the file"
}
```

**Response with partial failures:**

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
    { "name": "NGO 1", "email": "ngo1@org", "userId": 100, "password": "..." }
  ],
  "errors": [
    {
      "name": "NGO 2",
      "email": "duplicate@org",
      "error": "Email already exists"
    }
  ]
}
```

---

## 🎯 Using the UI (AddNGOModal)

### Manual Entry Tab

1. Fill in step 1: Organization basics
2. Fill in step 2: Contact information
3. Fill in step 3: Address and bank details
4. Review in step 4 and submit
5. System generates password and sends email

### Upload Tab

1. Click "Download template"
2. Save template file
3. Fill in NGO data
4. Drag and drop or select file
5. Click "Add NGO"
6. System processes all NGOs and sends emails

---

## 🧪 Testing

### Test Single Addition

```bash
curl -X POST http://localhost:5000/auth/organizations \
  -H "Content-Type: application/json" \
  -d '{"name":"Test NGO","email":"test@testngo.org","phone":"+2348000000000"}'
```

### Test Bulk Upload

1. Download: `GET /auth/bulk/sample`
2. Edit file with 2-3 test rows
3. Upload: `POST /auth/bulk/upload`
4. Verify response shows all NGOs created

### Verify in Database

```sql
-- Check users created
SELECT email, role, active FROM users WHERE role = 'NGO' ORDER BY id DESC LIMIT 3;

-- Check organizations created
SELECT id, name, phone, active FROM organizations ORDER BY id DESC LIMIT 3;

-- Check address records
SELECT * FROM address ORDER BY id DESC LIMIT 3;

-- Check bank records
SELECT * FROM banks ORDER BY id DESC LIMIT 3;
```

---

## 🐛 Common Issues

### "Email already exists"

✅ **Solution:** Use different email address

### Emails not received

✅ **Solutions:**

- Check email service configuration in `utils/mail.ts`
- Verify `ngowelcome` email template exists
- Check email provider logs

### File upload rejected

✅ **Solutions:**

- Ensure file is .xlsx or .xls format
- Check file size (recommended: <10MB)
- Verify required columns exist (Name, Email, Phone)

### Some rows not imported

✅ **Solutions:**

- Every row must have Name, Email, Phone
- Check for empty cells in required columns
- Look at error list in response for details

---

## 📈 Bulk Upload Performance

| File Size | Records | Estimated Time | Notes                     |
| --------- | ------- | -------------- | ------------------------- |
| 100KB     | 10      | ~2-3 sec       | Includes email sending    |
| 1MB       | 100     | ~20-30 sec     | All emails sent           |
| 5MB       | 500     | ~2-3 min       | May want progress bar     |
| 10MB      | 1000+   | ~5-10 min      | Consider batch processing |

---

## 🔄 Transaction Handling

**Bulk Upload:**

- Each NGO processed in transaction
- If one fails, that record rolled back
- Other records continue processing
- Failed records returned in response

**Data Consistency:**

- User, organization, address, and bank created atomically
- If any step fails, entire record rolled back
- No partial NGO records

---

## 📞 Support

**Quick Checks:**

1. ✅ Are all required fields filled?
2. ✅ Is email unique?
3. ✅ Is file format correct (.xlsx)?
4. ✅ Is email service configured?
5. ✅ Are database tables created?

**For More Help:**

- See: `NGO_MANAGEMENT_IMPLEMENTATION_GUIDE.md`
- See: `NGO_MANAGEMENT_API.md`

---

**Version:** 1.0  
**Last Updated:** January 19, 2026  
**Status:** ✅ Ready to Use
