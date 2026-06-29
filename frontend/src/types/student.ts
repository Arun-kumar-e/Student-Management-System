export interface StudentRequest {
  name: string;
  email: string;
  department: string;
  rollNumber: string;
  cgpa: number;
}

export interface StudentResponse {
  id: number;
  name: string;
  email: string;
  department: string;
  rollNumber: string;
  cgpa: number;
  enrolledAt: string; // ISO date string (YYYY-MM-DD)
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // 0-based page number from Spring Boot
  size: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
