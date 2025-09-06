# New English Model High School - Admin Portal Setup

## Prerequisites

1. Node.js (v16 or higher)
2. A Supabase account
3. Your admin email and password

## Setup Instructions

### 1. Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is ready, go to Settings > API
3. Copy your Project URL and anon public key

### 2. Environment Variables

1. Create a `.env.local` file in the root directory
2. Add your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Database Setup

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the SQL to create the students table and necessary indexes

### 4. Admin User Setup

1. In your Supabase dashboard, go to Authentication > Users
2. Click "Add user" and create an admin user with your desired email and password
3. This will be the only user who can access the admin portal

### 5. Install Dependencies

```bash
npm install
```

### 6. Run the Application

```bash
npm run dev
```

## Usage

### Login

- Use your admin email and password to log into the system
- Only the admin user can access the portal

### Excel File Upload

1. Click on "Upload Data" in the sidebar
2. Upload an Excel file (.xlsx or .xls) with the following sheets:
   - 5 boys
   - 5 girls
   - 6 boys
   - 6 girls
   - 7 boys
   - 7 girls
   - 8 boys
   - 8 girls

### Excel File Format

Each sheet should have the following columns (in order):

1. SR (Serial Number)
2. Student Name
3. Father Name
4. DOB (Date of Birth)
5. B.Form.No (Birth Certificate Number)
6. PH.NO (Phone Number)
7. Father/ID No (Father's ID Number)
8. Class
9. AD. NO (Admission Number)
10. AD pic (Admission Picture) - _ignored by system_

**Important Notes:**

- Only rows with non-empty Student Name will be processed
- Empty cells are allowed and will be stored as null/empty in the database
- Date formats are automatically parsed from Excel
- The system will show progress and error reports after upload

### Features

- **Dashboard**: View statistics and all students
- **Class Filtering**: Filter students by class and section (boys/girls)
- **Search**: Search students by name, father name, or class
- **Data Management**: View, edit, and manage student records
- **Excel Import**: Bulk upload student data from Excel files
- **Secure Access**: Admin-only authentication

## Troubleshooting

### Common Issues

1. **Login fails**: Ensure your admin user is created in Supabase Auth
2. **Data not loading**: Check your environment variables and Supabase connection
3. **Excel upload fails**: Ensure your Excel file has the correct sheet names and column structure
4. **Database errors**: Verify the SQL schema has been applied correctly in Supabase

### Support

If you encounter issues, check:

1. Browser console for error messages
2. Supabase dashboard for authentication and database issues
3. Network tab for API call failures
