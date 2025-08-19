import { useState, useEffect } from 'react';
import { useAuth as useAuthContext } from '@/context/AuthContext';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  requireAuth?: boolean;
  immediate?: boolean;
}

// Enhanced API hook with authentication and manual triggering
export function useApi<T = any>(options: UseApiOptions = {}) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { user, token } = useAuthContext();

  const request = async (
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    customHeaders?: Record<string, string>
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Check auth requirement
      if (options.requireAuth && !user) {
        throw new Error('Authentication required');
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...customHeaders,
      };

      // Add auth token if available
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const config: RequestInit = {
        method,
        headers,
      };

      if (body) {
        config.body = JSON.stringify(body);
      }

      const response = await fetch(endpoint, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      setState({
        data,
        loading: false,
        error: null,
      });

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  };

  const reset = () => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  };

  return {
    ...state,
    request,
    reset,
  };
}

// Form submission hook
export function useFormSubmission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitForm = async (url: string, data: any, options?: RequestInit) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      setSuccess(true);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Submission failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitForm,
    loading,
    error,
    success,
    reset: () => {
      setError(null);
      setSuccess(false);
    },
  };
}

// Authentication hook
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored token
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const { user } = await response.json();
        setUser(user);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setToken(result.token);
        setUser(result.user);
        localStorage.setItem('token', result.token);
        return result;
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        return result;
      } else {
        throw new Error(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}

// File upload hook
export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (
    file: File,
    applicationId: string,
    applicationType: string,
    documentType: string,
    token: string
  ) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('applicationId', applicationId);
      formData.append('applicationType', applicationType);
      formData.append('documentType', documentType);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploading,
    error,
    reset: () => setError(null),
  };
}

// Specific hooks for common operations
export function useContactForm() {
  const api = useApi();

  const submitContact = async (contactData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    service?: string;
  }) => {
    return api.request('/api/contact', 'POST', contactData);
  };

  return {
    ...api,
    submitContact,
  };
}

export function useTravelBooking() {
  const api = useApi({ requireAuth: true });

  const submitBooking = async (bookingData: {
    bookingType: string;
    departure: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    passengers: number;
    classType?: string;
    specialRequests?: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
  }) => {
    return api.request('/api/travel', 'POST', bookingData);
  };

  const getBookings = async () => {
    return api.request('/api/travel', 'GET');
  };

  return {
    ...api,
    submitBooking,
    getBookings,
  };
}

export function useVisaApplication() {
  const api = useApi({ requireAuth: true });

  const submitApplication = async (visaData: {
    visaType: string;
    nationality: string;
    passportNumber: string;
    passportExpiry: string;
    purposeOfVisit: string;
    travelDate?: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
  }) => {
    return api.request('/api/visa', 'POST', visaData);
  };

  const getApplications = async () => {
    return api.request('/api/visa', 'GET');
  };

  return {
    ...api,
    submitApplication,
    getApplications,
  };
}

export function useWorkPermit() {
  const api = useApi({ requireAuth: true });

  const submitApplication = async (workData: {
    country: string;
    jobTitle: string;
    company: string;
    salary?: number;
    location?: string;
    experience?: string;
    education?: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
  }) => {
    return api.request('/api/work-permits', 'POST', workData);
  };

  const getApplications = async () => {
    return api.request('/api/work-permits', 'GET');
  };

  return {
    ...api,
    submitApplication,
    getApplications,
  };
}

export function useUAEJobs() {
  const api = useApi({ requireAuth: true });

  const submitApplication = async (jobData: {
    industry: string;
    jobTitle: string;
    experience: string;
    expectedSalary?: number;
    currentLocation?: string;
    visaStatus: string;
    availability?: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
  }) => {
    return api.request('/api/uae-jobs', 'POST', jobData);
  };

  const getApplications = async () => {
    return api.request('/api/uae-jobs', 'GET');
  };

  return {
    ...api,
    submitApplication,
    getApplications,
  };
}

export function useDocumentService() {
  const api = useApi({ requireAuth: true });

  const submitRequest = async (serviceData: {
    serviceType: string;
    documentType: string;
    language?: string;
    urgency?: string;
    quantity?: number;
    specialInstructions?: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
  }) => {
    return api.request('/api/documents', 'POST', serviceData);
  };

  const getRequests = async () => {
    return api.request('/api/documents', 'GET');
  };

  return {
    ...api,
    submitRequest,
    getRequests,
  };
}
