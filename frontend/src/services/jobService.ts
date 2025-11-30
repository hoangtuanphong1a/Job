import { api } from './api';

export interface JobFormData {
  title: string;
  industry: string; // This will map to categoryId
  level: string; // This will map to experienceLevel
  type: string; // This will map to jobType
  quantity: string;
  salaryMin: string;
  salaryMax: string;
  location: string; // This will map to city
  description: string;
  requirements: string;
  benefits: string;
  skills: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  deadline: string;
  companyId?: string; // This will be determined from user companies
}

export interface CreateJobData {
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  jobType?: string;
  experienceLevel?: string;
  minSalary?: number;
  maxSalary?: number;
  city?: string;
  country?: string;
  skillIds?: string[];
  categoryId?: string;
  companyId: string;
  expiresAt?: string;
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
}

export interface JobCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

class JobService {
  async createJob(jobData: CreateJobData): Promise<Job> {
    const response = await api.post('/jobs', jobData);
    return response.data;
  }

  async getUserCompanies(): Promise<Company[]> {
    const response = await api.get('/companies/user/my-companies');
    return response.data;
  }

  async getJobCategories(): Promise<JobCategory[]> {
    const response = await api.get('/job-categories');
    return response.data;
  }

  async searchSkills(name: string): Promise<Skill[]> {
    const response = await api.get(`/skills/search?name=${encodeURIComponent(name)}`);
    return response.data;
  }

  async getSkillByName(name: string): Promise<Skill | null> {
    try {
      const skills = await this.searchSkills(name);
      return skills.find(skill =>
        skill.name.toLowerCase() === name.toLowerCase()
      ) || null;
    } catch (error) {
      console.error('Error searching for skill:', error);
      return null;
    }
  }

  async convertSkillNamesToIds(skillNames: string[]): Promise<string[]> {
    const skillIds: string[] = [];

    for (const skillName of skillNames) {
      const trimmedName = skillName.trim();
      if (trimmedName) {
        const skill = await this.getSkillByName(trimmedName);
        if (skill) {
          skillIds.push(skill.id);
        } else {
          console.warn(`Skill "${trimmedName}" not found, skipping`);
        }
      }
    }

    return skillIds;
  }
}

export const jobService = new JobService();
