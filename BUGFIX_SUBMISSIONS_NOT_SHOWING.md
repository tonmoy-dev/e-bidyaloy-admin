# Bug Fix: Student Submissions Not Showing

## Problem Identified

Students submissions were not displaying in either the **Student View** or **Teacher View**, showing the message: _"No submissions yet. Students haven't submitted their work."_

## Root Causes (Two Issues)

The issue was in **`submissionApi.ts`** with **TWO problems**:

1. The query was **not passing query parameters** to the backend API
2. The response type was wrong - **expecting array but receiving paginated response**

### The Buggy Code:

```typescript
// ❌ WRONG - params are not being passed to RTK Query
getSubmissionsByAssignment: builder.query<AssignmentSubmission[], string>({
  query: (assignmentId) => ({
    url: API_ENDPOINTS.ASSIGNMENT_SUBMISSIONS.LIST({ assignment: assignmentId }).url,
    method: API_ENDPOINTS.ASSIGNMENT_SUBMISSIONS.LIST({ assignment: assignmentId }).method,
    // ❌ Missing: params field!
  }),
  providesTags: ['Assignment'],
}),
```

### What Was Happening:

1. `API_ENDPOINTS.ASSIGNMENT_SUBMISSIONS.LIST({ assignment: assignmentId })` returns:

   ```typescript
   {
     url: '/api/v1/assignment-submissions/',
     method: 'GET',
     params: { assignment: assignmentId }  // ← Query parameter
   }
   ```

2. The code was destructuring `.url` and `.method` but **dropping the `.params`**
3. RTK Query then made a request to `/api/v1/assignment-submissions/` **without the `?assignment=<id>` query string**
4. Backend returned **all submissions** (or an empty list) instead of submissions for that specific assignment
5. Since it wasn't filtered by assignment ID, **no submissions matched the current assignment**

### Issue #2: Wrong Response Type

The backend API returns a **paginated response**:

```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      /* submission object */
    },
    {
      /* submission object */
    }
  ]
}
```

But the code expected a **direct array**: `AssignmentSubmission[]`

This meant:

- The code tried to map over the paginated object instead of the `results` array
- React couldn't iterate properly, resulting in no submissions displayed
- Type checking passed but runtime failed

## Solution

Update `submissionApi.ts` with **two fixes**:

### Fix #1: Pass Query Parameters

Update to properly pass the `params` to RTK Query:

### The Fixed Code:

```typescript
// ✅ CORRECT - params are properly passed to RTK Query
getSubmissionsByAssignment: builder.query<AssignmentSubmission[], string>({
  query: (assignmentId) => {
    const listConfig = API_ENDPOINTS.ASSIGNMENT_SUBMISSIONS.LIST({ assignment: assignmentId });
    return {
      url: listConfig.url,
      method: listConfig.method,
      params: listConfig.params,  // ✅ Fix #1: Now included!
    };
  },
  providesTags: ['Assignment'],
}),
```

### Fix #2: Transform Paginated Response

Add `transformResponse` to extract the `results` array:

```typescript
// ✅ COMPLETE FIX - both issues resolved
import type { PaginatedResponse } from '../models/assignment.model';

getSubmissionsByAssignment: builder.query<AssignmentSubmission[], string>({
  query: (assignmentId) => {
    const listConfig = API_ENDPOINTS.ASSIGNMENT_SUBMISSIONS.LIST({ assignment: assignmentId });
    return {
      url: listConfig.url,
      method: listConfig.method,
      params: listConfig.params,  // ✅ Fix #1
    };
  },
  transformResponse: (response: PaginatedResponse<AssignmentSubmission>) => response.results,  // ✅ Fix #2
  providesTags: ['Assignment'],
}),
```

### How It Now Works:

1. API endpoint config returns all three properties: `url`, `method`, and `params`
2. All three are passed to RTK Query
3. RTK Query constructs the full URL: `/api/v1/assignment-submissions/?assignment=<assignment-id>`
4. Backend receives the query parameter and filters submissions correctly
5. **Backend returns paginated response**: `{ count, next, previous, results: [...] }`
6. **`transformResponse` extracts the `results` array** from the paginated response
7. Components receive clean array of submissions: `AssignmentSubmission[]`
8. **Submissions now appear** in both Student and Teacher views ✅

## Files Modified

- **`src/features/academic/assignments/api/submissionApi.ts`**
  - Added `PaginatedResponse` import from assignment model
  - Fixed `getSubmissionsByAssignment` query to include `params` (Fix #1)
  - Added `transformResponse` to extract `results` from paginated response (Fix #2)

## Why This Happened

### Issue #1 - Missing Query Parameters

The API endpoint structure returns an object with `{ url, method, params }`, but the code was destructuring only the first two properties. RTK Query requires the `params` field to be at the same level as `url` and `method` for it to automatically append them as query parameters to the request.

### Issue #2 - Wrong Response Shape

The backend follows Django REST Framework pagination pattern, returning `{ count, next, previous, results }`. However, the frontend code expected a direct array. Without the `transformResponse` function to extract `response.results`, RTK Query stored the entire paginated object in state. When components tried to `.map()` over it, they were mapping over an object instead of an array, resulting in no submissions being displayed.

## Testing

After this fix:

- ✅ Student submissions will appear in **StudentAssignmentDetailsView**
- ✅ Teacher will see all submissions in **AssignmentDetailsView**
- ✅ Filtering by assignment ID now works correctly
- ✅ Both views properly fetch and display submissions

## What to Check

1. Navigate to an assignment that has submissions
2. In **Student View**: You should see "My Submission" section with the submission details
3. In **Teacher View**: You should see "Student Submissions" section with a table of all submissions
4. If still no submissions show, verify:
   - Students have actually submitted their work (check database)
   - Backend API responds correctly when called with `?assignment=<id>` parameter
   - Network tab shows request with query parameters included
