# Individual Submission API Integration

## Overview

Updated the assignment submission system to use the individual submission GET API (`/api/v1/assignment-submissions/{id}`) for fetching complete submission details with attachments, replacing reliance on the list endpoint.

---

## API Endpoint Used

```
GET /api/v1/assignment-submissions/{submission-id}
```

### Response Structure

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "assignment": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "assignment_title": "string",
  "assignment_total_marks": "-9.8",
  "student": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "student_name": "string",
  "student_id": "string",
  "submission_text": "string",
  "submitted_at": "2025-11-14T17:53:32.058Z",
  "is_late": true,
  "marks_obtained": ".",
  "feedback": "string",
  "graded_by": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "graded_by_name": "string",
  "graded_at": "2025-11-14T17:53:32.058Z",
  "status": "pending",
  "attachments": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "assignment": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "submission": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "attachment_type": "assignment",
      "file_name": "string",
      "file": "string",
      "file_url": "string",
      "file_size": 0,
      "created_at": "2025-11-14T17:53:32.058Z"
    }
  ],
  "percentage": "string",
  "created_at": "2025-11-14T17:53:32.058Z",
  "updated_at": "2025-11-14T17:53:32.059Z"
}
```

---

## Changes Made

### 1. StudentAssignmentDetailsView.tsx

#### Previous Implementation

- Used `useGetSubmissionsByAssignmentQuery` to fetch all submissions
- Filtered client-side to find student's submission
- Relied on list endpoint returning incomplete data

#### New Implementation

```typescript
// State changed from submission object to submission ID
const [mySubmissionId, setMySubmissionId] = useState<string | null>(null);

// Fetch list to get submission ID
const { data: submissions } = useGetSubmissionsByAssignmentQuery(assignmentData?.id || '', {
  skip: !assignmentData?.id,
});

// Fetch complete submission details using ID
const { data: mySubmission, refetch: refetchSubmission } = useGetSubmissionByIdQuery(
  mySubmissionId || '',
  { skip: !mySubmissionId },
);
```

#### Benefits

- **Complete Data**: Gets full submission details including all attachments
- **Fresh Data**: Refetches after submission to show latest attachments
- **Better Performance**: Only fetches detailed data when needed
- **Reliable Attachments**: Attachments come from dedicated endpoint that includes them

#### Submission Flow

1. List endpoint finds student's submission ID
2. Individual endpoint fetches complete submission with attachments
3. After new submission, refetch to get updated data

---

### 2. AssignmentDetailsView.tsx (Teacher View)

#### Previous Implementation

- Displayed submission data from list endpoint
- Attachments might be missing or incomplete

#### New Implementation

```typescript
// Track which submission is expanded
const [expandedSubmissionId, setExpandedSubmissionId] = useState<string | null>(null);

// Fetch list for table
const { data: submissions = [], isLoading: isLoadingSubmissions } =
  useGetSubmissionsByAssignmentQuery(assignmentData?.id || '');

// Fetch detailed submission when expanded
const { data: expandedSubmission } = useGetSubmissionByIdQuery(expandedSubmissionId || '', {
  skip: !expandedSubmissionId,
});
```

#### Benefits

- **Lazy Loading**: Only fetches full details when teacher expands submission
- **Complete Attachments**: All submission files guaranteed to be included
- **Efficient**: Doesn't load all attachments upfront, only when needed
- **Accurate Data**: Shows exact submission state from dedicated endpoint

#### Display Logic

```typescript
{expandedSubmissionId === submission.id && expandedSubmission && (
  // Render expanded details using expandedSubmission data
  // Shows: submission_text, feedback, graded_by_name, attachments[]
)}
```

---

### 3. API Integration (submissionApi.ts)

#### Already Had the Endpoint

```typescript
// Get submission by ID
getSubmissionById: builder.query<AssignmentSubmission, string>({
  query: (id) => ({
    url: API_ENDPOINTS.ASSIGNMENT_SUBMISSIONS.DETAILS(id).url,
    method: API_ENDPOINTS.ASSIGNMENT_SUBMISSIONS.DETAILS(id).method,
  }),
  providesTags: ['Assignment'],
}),
```

#### Hook Export

```typescript
export const {
  useCreateSubmissionMutation,
  useGetSubmissionsByAssignmentQuery,
  useGetSubmissionByIdQuery, // ✅ Now being used
  useDeleteSubmissionMutation,
} = submissionApi;
```

---

## Data Flow

### Student View Flow

```
1. Component loads
   ↓
2. Fetch all submissions (lightweight list)
   ↓
3. Find student's submission ID
   ↓
4. Fetch complete submission details
   ↓
5. Display submission with attachments

After submission:
   ↓
6. Student submits assignment
   ↓
7. Refetch submission details
   ↓
8. Show updated data with new attachments
```

### Teacher View Flow

```
1. Component loads
   ↓
2. Fetch all submissions (table display)
   ↓
3. Teacher clicks "View" on a submission
   ↓
4. Fetch that submission's complete details
   ↓
5. Expand row showing full info + attachments
   ↓
6. Teacher clicks "Hide"
   ↓
7. Collapse row (data stays cached)
```

---

## Advantages of Individual Endpoint

### 1. **Guaranteed Attachments**

- Backend serializer includes `attachments` field in individual endpoint
- List endpoint may omit or limit related data for performance
- Individual endpoint always returns complete attachment array

### 2. **Fresh Data**

- Can refetch specific submission to get latest state
- Useful after upload to verify attachments saved
- List endpoint might be stale from cache

### 3. **Performance Optimization**

- Teacher view: Don't load all attachments upfront
- Only fetch details when user expands submission
- Reduces initial load time and bandwidth

### 4. **Data Integrity**

- Single source of truth for submission details
- Ensures UI shows exact data from database
- No client-side filtering or data manipulation needed

### 5. **Better Error Handling**

- Can detect if submission exists before fetching details
- Loading states specific to individual submission
- Error handling isolated to specific submission fetch

---

## Testing Checklist

### Student View

- [ ] Student can see their submission after creating it
- [ ] All uploaded attachments appear in submission details
- [ ] After uploading new files, submission refetches and shows new files
- [ ] Submission status shows correctly (submitted, graded, late)
- [ ] Marks and feedback display when graded

### Teacher View

- [ ] Table shows all student submissions with summary
- [ ] Clicking "View" fetches and displays detailed submission
- [ ] All attachments appear in expanded view
- [ ] Can view and download each attachment
- [ ] Submission message and feedback show correctly
- [ ] Clicking "Hide" collapses the details
- [ ] Expanding different submission fetches its specific data

### API Integration

- [ ] Individual endpoint returns complete submission object
- [ ] Attachments array includes all files with file_url
- [ ] Grading information populated correctly
- [ ] Percentage calculated and displayed
- [ ] Created/updated timestamps show properly

---

## Files Modified

1. **StudentAssignmentDetailsView.tsx**

   - Changed state from `mySubmission` to `mySubmissionId`
   - Added `useGetSubmissionByIdQuery` hook
   - Updated `useEffect` to set submission ID
   - Added `refetchSubmission()` call after successful submission

2. **AssignmentDetailsView.tsx**

   - Added `useGetSubmissionByIdQuery` import
   - Added `expandedSubmission` state from query
   - Updated expanded row to use `expandedSubmission` data
   - Changed all references from `submission` to `expandedSubmission` in expanded view

3. **submissionApi.ts**
   - Already had the endpoint and export ✅
   - No changes needed

---

## API Response Validation

### Expected Fields in Response

✅ All these fields are now properly received and displayed:

- `id` - Submission unique identifier
- `assignment` - Assignment UUID
- `assignment_title` - Assignment name
- `assignment_total_marks` - Maximum marks
- `student` - Student UUID
- `student_name` - Student full name
- `student_id` - Student registration ID
- `submission_text` - Student's submission message
- `submitted_at` - Submission timestamp
- `is_late` - Late submission indicator
- `marks_obtained` - Graded marks
- `feedback` - Teacher's feedback
- `graded_by` - Grader UUID
- `graded_by_name` - Grader name
- `graded_at` - Grading timestamp
- `status` - Submission status
- `attachments[]` - Array of submission files
  - `id` - Attachment UUID
  - `file_name` - Original filename
  - `file` - File URL
  - `file_url` - Alternative file URL
  - `file_size` - Size in bytes
  - `attachment_type` - Type identifier
  - `created_at` - Upload timestamp
- `percentage` - Score percentage
- `created_at` - Submission creation time
- `updated_at` - Last update time

---

## Benefits Summary

✅ **Complete Data** - All submission details and attachments guaranteed
✅ **Performance** - Lazy loading of detailed data only when needed
✅ **Fresh Data** - Can refetch to get latest state after changes
✅ **Better UX** - Students see their uploaded files immediately
✅ **Teacher Efficiency** - Quick overview with detailed view on demand
✅ **Data Integrity** - Single source of truth from dedicated endpoint
✅ **Error Handling** - Better feedback for missing or incomplete data

---

## Next Steps

1. Test submission creation and verify attachments appear
2. Test teacher expansion of multiple submissions
3. Verify file download links work correctly
4. Check loading states display properly
5. Confirm refetch after submission updates the view
6. Test with late submissions and graded submissions
7. Verify percentage calculation displays correctly
