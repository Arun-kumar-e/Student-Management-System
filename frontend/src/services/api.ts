import axios, { AxiosError } from 'axios';
import { PageResponse, StudentRequest, StudentResponse } from '../types/student';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/students';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiValidationError {
  [key: string]: string;
}

export interface ApiGeneralError {
  status: number;
  message: string;
  path: string;
  timestamp: string;
}

// Global API Services
export const studentService = {
  // Get paginated students list
  getAll: async (
    page = 0,
    size = 5,
    sortBy = 'id',
    direction = 'asc'
  ): Promise<PageResponse<StudentResponse>> => {
    const response = await apiClient.get<PageResponse<StudentResponse>>('', {
      params: { page, size, sortBy, direction },
    });
    return response.data;
  },

  // Get student by ID
  getById: async (id: number): Promise<StudentResponse> => {
    const response = await apiClient.get<StudentResponse>(`/${id}`);
    return response.data;
  },

  // Create student
  create: async (request: StudentRequest): Promise<StudentResponse> => {
    const response = await apiClient.post<StudentResponse>('', request);
    return response.data;
  },

  // Update student
  update: async (id: number, request: StudentRequest): Promise<StudentResponse> => {
    const response = await apiClient.put<StudentResponse>(`/${id}`, request);
    return response.data;
  },

  // Delete student
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/${id}`);
  },

  // Search students by name
  searchByName: async (name: string): Promise<StudentResponse[]> => {
    const response = await apiClient.get<StudentResponse[]>('/search', {
      params: { name },
    });
    return response.data;
  },

  // Filter students by department
  getByDepartment: async (dept: string): Promise<StudentResponse[]> => {
    const response = await apiClient.get<StudentResponse[]>('/department', {
      params: { dept },
    });
    return response.data;
  },
};
