
export interface ExamResultModel {
    id?: string;
    examinationId: string;
    studentId: string;
    marks: {
        subjectId: string;
        mark: number;
    }[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
