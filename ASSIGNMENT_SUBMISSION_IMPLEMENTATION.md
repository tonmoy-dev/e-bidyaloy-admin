# Assignment Submission Feature Implementation

## Overview

Implemented a complete student assignment submission feature with a two-step process:

1. **Step 1**: Student enters submission message/text
2. **Step 2**: Student uploads submission attachments

## Files Created/Modified

### New Files Created

1. **`src/features/academic/assignments/models/submission.model.ts`**

   - Defines TypeScript interfaces for submissions
   - `AssignmentSubmission`: Main submission data structure
   - `CreateSubmissionRequest`: Payload for creating submissions
   - `CreateSubmissionResponse`: API response structure
   - `SubmissionAttachment`: Submission attachment structure
   - `CreateSubmissionAttachmentRequest`: Attachment upload payload

2. **`src/features/academic/assignments/api/submissionApi.ts`**

   - RTK Query API endpoints for submissions
   - `createSubmission`: Creates a new submission
   - `getSubmissionsByAssignment`: Fetches all submissions for an assignment
   - `getSubmissionById`: Fetches a specific submission
   - Uses Redux tags for cache invalidation

3. **`src/features/academic/assignments/components/SubmissionForm.tsx`**
   - Two-step submission form component
   - **Step 1**: Text area for submission message
   - **Step 2**: File upload with drag-and-drop support
   - Features:
     - Progress indicator showing current step
     - File validation (size, type, count)
     - Upload progress tracking
     - Preview for image files
     - Error handling and user feedback
     - Responsive design with mobile support

### Modified Files

4. **`src/features/academic/assignments/components/StudentAssignmentDetailsView.tsx`**

   - Added submission button (shows only if not yet submitted)
   - Integrated `SubmissionForm` component
   - Displays already submitted message if student has submitted
   - Shows student's submitted files section
   - Fetches and displays submission status
   - Shows submission message and timestamp
   - Separates assignment attachments from submission attachments

5. **`src/features/academic/assignments/models/attachment.model.ts`**

   - Updated `attachment_type` to support both `'assignment'` and `'submission'`
   - Allows proper typing for submission attachments

6. **`src/features/academic/assignments/models/assignment.model.ts`**
   - Updated `AssignmentAttachment` interface
   - Added `'submission'` to `attachment_type` union type

## API Structure

### Backend APIs Required

#### 1. Assignment Submissions API

**Endpoint**: `/api/v1/assignment-submissions/`

**CREATE (POST)**

```json
{
  "assignment": "uuid",
  "student": "uuid",
  "submission_text": "string",
  "submitted_at": "2025-11-05T10:46:57.482Z",
  "status": "submitted"
}
```

**Response**:

```json
{
  "id": "uuid",
  "assignment": "uuid",
  "student": "uuid",
  "submission_text": "string",
  "submitted_at": "2025-11-05T10:46:57.482Z",
  "marks_obtained": null,
  "feedback": null,
  "graded_by": null,
  "graded_at": null,
  "status": "submitted"
}
```

**LIST (GET)** - Query params: `?assignment=uuid`
Returns array of submissions for the assignment

**DETAILS (GET)** - `/api/v1/assignment-submissions/{id}/`
Returns single submission details

#### 2. Assignment Attachments API (Extended)

**Endpoint**: `/api/v1/assignment-attachments/`

**CREATE (POST)** - FormData

```
assignment: "uuid"
submission: "uuid" (optional - only for submission attachments)
attachment_type: "submission" (or "assignment")
file_name: "string"
file: File
file_size: number
```

**Response**:

```json
{
  "id": "uuid",
  "assignment": "uuid",
  "submission": "uuid",
  "attachment_type": "submission",
  "file_name": "example.pdf",
  "file": "https://storage.../file.pdf",
  "file_url": "https://storage.../file.pdf",
  "file_size": 1024,
  "created_at": "2025-11-05T10:46:57.482Z"
}
```

## User Flow

### Student Submission Process

1. **View Assignment**

   - Student opens assignment details
   - Sees assignment instructions, due date, and teacher's attachments
   - If not yet submitted, sees "Submit Assignment" button

2. **Step 1: Enter Submission Message**

   - Click "Submit Assignment" button
   - Form appears with text area
   - Enter submission message/notes/comments
   - Click "Next: Upload Files"
   - API call to `POST /api/v1/assignment-submissions/`
   - Submission record created with `status: "submitted"`

3. **Step 2: Upload Files**

   - Drag and drop or click to select files
   - Supported formats: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG, GIF
   - Max file size: 10MB per file
   - Max files: 5 files
   - Each file uploaded via `POST /api/v1/assignment-attachments/`
   - Files linked to submission via `submission` field
   - Shows upload progress for each file

4. **Final Submit**

   - Click "Submit Assignment" button
   - Success message displayed
   - Form closes
   - "Already submitted" message appears

5. **View Submission**
   - Student can see their submitted files
   - Shows submission status, timestamp, and message
   - Can download submitted files
   - Cannot submit again (button hidden)

## Features

### Submission Form Features

- ✅ Two-step wizard interface with visual progress
- ✅ Submission message text area (required)
- ✅ File upload with drag-and-drop
- ✅ File type validation
- ✅ File size validation (10MB max)
- ✅ Multiple file upload (5 files max)
- ✅ Upload progress indication
- ✅ Image preview for image files
- ✅ Error handling and user feedback
- ✅ Mobile responsive design
- ✅ Back button between steps
- ✅ Cancel functionality

### Student Assignment View Features

- ✅ Submit button (conditional rendering)
- ✅ Already submitted indicator
- ✅ Separate sections for:
  - Assignment files (from teacher)
  - Student submitted files
- ✅ Submission status display
- ✅ Submission timestamp
- ✅ Submission message display
- ✅ File download functionality
- ✅ Responsive grid layout

## Validation Rules

### File Upload Validation

- **Accepted types**: .pdf, .doc, .docx, .txt, .jpg, .jpeg, .png, .gif
- **Max file size**: 10MB per file
- **Max files**: 5 files per submission
- **Duplicate check**: Prevents uploading same file twice
- **Error messages**: Clear user feedback for validation failures

### Submission Validation

- **Submission text**: Required, cannot be empty
- **Student ID**: Retrieved from authentication token
- **Assignment ID**: Passed from parent component
- **Submission timestamp**: Auto-generated on client

## State Management

### Redux/RTK Query

- Submission API integrated with Redux store
- Uses `Assignment` tag for cache invalidation
- Automatic cache updates on submission creation
- Optimistic updates for better UX

### Local State

- `showSubmissionForm`: Toggle submission form visibility
- `mySubmission`: Current student's submission data
- `uploadStates`: Track upload progress for each file
- `uploadedFiles`: List of successfully uploaded files
- `step`: Current wizard step (1 or 2)

## Security Considerations

1. **Authentication**: Student ID retrieved from JWT token
2. **Authorization**: Backend should verify:
   - Student belongs to the assigned class/section
   - Assignment is published and not closed
   - Student hasn't already submitted (or allow resubmission based on rules)
3. **File Upload**: Backend should validate:
   - File types (whitelist only safe types)
   - File sizes (enforce limits)
   - Scan for malware
   - Sanitize file names

## Future Enhancements

### Recommended Features

1. **Resubmission**: Allow students to edit/resubmit before deadline
2. **Draft Submissions**: Save submission as draft before final submit
3. **Deadline Validation**: Prevent submission after due date
4. **Submission History**: Track all submission attempts
5. **File Preview**: Preview documents without downloading
6. **Submission Comments**: Allow teacher-student communication
7. **Grade Display**: Show marks and feedback once graded
8. **Notifications**: Email/push notifications on submission status changes
9. **Bulk Download**: Download all submission files as ZIP
10. **Plagiarism Check**: Integration with plagiarism detection tools

## Testing Checklist

- [ ] Student can submit assignment with text only
- [ ] Student can submit assignment with files only
- [ ] Student can submit with both text and files
- [ ] File validation works correctly
- [ ] Upload progress displays properly
- [ ] Already submitted state displays correctly
- [ ] Submission button hidden after submit
- [ ] Submitted files display in separate section
- [ ] Student can download their submitted files
- [ ] Responsive design works on mobile devices
- [ ] Error handling works for network failures
- [ ] Form can be cancelled at any step

## Dependencies

- React 18+
- Redux Toolkit (RTK Query)
- React Router (for navigation)
- React Toastify (for notifications)
- Bootstrap 5 (for styling)
- Font Awesome (for icons)

## Notes

- The backend API endpoints are already defined in `src/core/constants/api.ts`
- Student ID is retrieved from localStorage `user` object
- Attachments are stored with `attachment_type: 'submission'` to differentiate from assignment attachments
- The implementation follows the existing patterns in the codebase
- All TypeScript types are properly defined for type safety
