const API_BASE_URL = 'http://localhost:3001/api';

export interface Job {
  id: string;
  title: string;
  company: string;
  location?: string;
  applicationDate: string;
  jobUrl?: string;
  resumeUsed?: string;
  notes?: string;
  currentStage: 'SAVED' | 'APPLIED' | 'PHONE_SCREEN' | 'INTERVIEW' | 'OFFER' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  contacts: Contact[];
  interviews: Interview[];
}

export interface Contact {
  id: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  notes?: string;
  jobId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Interview {
  id: string;
  type: 'PHONE_SCREEN' | 'VIDEO_CALL' | 'ON_SITE' | 'TECHNICAL' | 'BEHAVIORAL' | 'FINAL_ROUND';
  scheduledAt: string;
  notes?: string;
  questionsAsked?: string;
  feedback?: string;
  jobId: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobStats {
  totalJobs: number;
  jobsByStage: Record<string, number>;
}

export interface CreateJobData {
  title: string;
  company: string;
  location?: string;
  applicationDate?: string;
  jobUrl?: string;
  resumeUsed?: string;
  notes?: string;
  currentStage?: Job['currentStage'];
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log(`Making API request to: ${url}`);
    console.log('Request options:', options);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        mode: 'cors', // Explicitly set CORS mode
        ...options,
      });

      console.log(`Response status: ${response.status}`);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('Network error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running on http://localhost:3001');
      }
      throw error;
    }
  }

  // Job endpoints
  async getJobs(): Promise<Job[]> {
    try {
      console.log('Fetching all jobs...');
      const jobs = await this.request<Job[]>('/jobs');
      console.log(`Successfully fetched ${jobs.length} jobs`);
      return jobs;
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      throw error;
    }
  }

  async getJob(id: string): Promise<Job> {
    return this.request<Job>(`/jobs/${id}`);
  }

  async createJob(data: CreateJobData): Promise<Job> {
    console.log('Creating job with data:', data);
    return this.request<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateJob(id: string, data: Partial<CreateJobData>): Promise<Job> {
    return this.request<Job>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJob(id: string): Promise<void> {
    await this.request<void>(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async getJobsByStage(stage: Job['currentStage']): Promise<Job[]> {
    return this.request<Job[]>(`/jobs/stage/${stage}`);
  }

  async updateJobStage(id: string, stage: Job['currentStage']): Promise<Job> {
    return this.request<Job>(`/jobs/${id}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({ stage }),
    });
  }

  async getJobStats(): Promise<JobStats> {
    try {
      console.log('Fetching job stats...');
      const stats = await this.request<JobStats>('/jobs/stats');
      console.log('Successfully fetched job stats:', stats);
      return stats;
    } catch (error) {
      console.error('Failed to fetch job stats:', error);
      throw error;
    }
  }
}

export const api = new ApiService(); 