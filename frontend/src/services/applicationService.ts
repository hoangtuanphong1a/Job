import { api } from './api';

export interface CreateApplicationDto {
  jobId: string;
  coverLetter?: string;
  resumeUrl?: string;
  source?: 'WEBSITE' | 'MOBILE' | 'EMAIL' | 'REFERRAL';
}

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  coverLetter?: string;
  resumeUrl?: string;
  status: 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'INTERVIEWED' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  source?: string;
  appliedAt: string;
  updatedAt: string;
  job?: {
    id: string;
    title: string;
    company: {
      id: string;
      name: string;
      logo?: string;
    };
  };
}

export class ApplicationService {
  static async createApplication(data: CreateApplicationDto): Promise<Application> {
    const response = await api.post('/applications', data);
    return response.data;
  }

  static async getMyApplications(): Promise<Application[]> {
    const response = await api.get('/applications/user/my-applications');
    return response.data;
  }

  static async getApplicationStats(userId: string) {
    const response = await api.get('/applications/user/my-stats');
    return response.data;
  }

  static async withdrawApplication(applicationId: string): Promise<void> {
    await api.delete(`/applications/${applicationId}`);
  }

  static async getJobApplications(jobId: string): Promise<Application[]> {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  }

  static async updateApplicationStatus(
    applicationId: string,
    status: string,
    notes?: string
  ): Promise<Application> {
    const response = await api.post(`/applications/${applicationId}/status`, {
      status,
      notes,
    });
    return response.data;
  }
}

export default ApplicationService;
