"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Bookmark,
  DollarSign,
  Briefcase,
  Clock,
  ChevronDown,
  Home,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { JobsHero } from "@/components/JobsHero";

interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  jobType?: string;
  experienceLevel?: string;
  salaryType?: string;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  city?: string;
  state?: string;
  country?: string;
  remoteWork?: boolean;
  status: string;
  viewCount: number;
  applicationCount: number;
  createdAt: string;
  expiresAt?: string;
  company: {
    id: string;
    name: string;
    industry?: string;
  };
  skills: Array<{
    id: string;
    name: string;
  }>;
  tags: Array<{
    id: string;
    name: string;
  }>;
}

const jobTypes = ["Full-time", "Part-time", "Remote", "Contract", "Internship"];
const experienceLevels = ["Intern", "Junior", "Middle", "Senior", "Lead"];

export default function JobsPage() {
  const [showFilters, setShowFilters] = useState(true);
  const [salaryRange, setSalaryRange] = useState([10, 50]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<
    string[]
  >([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set()); // Use string IDs
  const [sortBy, setSortBy] = useState<"newest" | "salary" | "relevant">(
    "newest"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const jobsPerPage = 6;

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      // Try to get token for authenticated requests
      const token = localStorage.getItem('access_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/jobs`, {
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        // API returns paginated response: {data: [...], total, page, limit, totalPages}
        setJobs(data.data || []);
      } else {
        console.error('Failed to fetch jobs:', response.status, response.statusText);
        setJobs([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const getJobSalaryDisplay = (job: Job): string => {
    if (job.salaryType === 'negotiable') {
      return 'Thương lượng';
    }
    if (job.minSalary && job.maxSalary) {
      return `${job.currency || 'VNĐ'} ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}`;
    }
    if (job.minSalary) {
      return `Từ ${job.currency || 'VNĐ'} ${job.minSalary.toLocaleString()}`;
    }
    if (job.maxSalary) {
      return `Đến ${job.currency || 'VNĐ'} ${job.maxSalary.toLocaleString()}`;
    }
    return 'Không công bố';
  };

  const getJobLocation = (job: Job): string => {
    const parts = [job.city, job.state, job.country].filter(Boolean);
    if (parts.length === 0) return 'Không xác định';
    return parts.join(', ');
  };

  const getJobTypeDisplay = (jobType?: string): string => {
    const typeMap: { [key: string]: string } = {
      'full_time': 'Toàn thời gian',
      'part_time': 'Bán thời gian',
      'contract': 'Hợp đồng',
      'freelance': 'Freelance',
      'internship': 'Thực tập',
    };
    return typeMap[jobType || ''] || 'Không xác định';
  };

  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Vừa đăng';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} ngày trước`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} tháng trước`;
  };

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    const filtered = jobs.filter((job) => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(searchLower);
        const matchesCompany = job.company.name.toLowerCase().includes(searchLower);
        const matchesDescription = job.description.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesCompany && !matchesDescription) return false;
      }

      // Location filter
      if (locationQuery) {
        const locationLower = locationQuery.toLowerCase();
        const locationString = getJobLocation(job).toLowerCase();
        if (!locationString.includes(locationLower)) return false;
      }

      // Salary filter (convert to millions for comparison)
      let jobMinSalary = 0;
      let jobMaxSalary = 0;
      if (job.minSalary) jobMinSalary = job.minSalary / 1000000; // Convert to millions
      if (job.maxSalary) jobMaxSalary = job.maxSalary / 1000000;
      else if (job.minSalary) jobMaxSalary = job.minSalary / 1000000;

      const salaryInRange = jobMaxSalary >= salaryRange[0] && jobMinSalary <= salaryRange[1];
      if (!salaryInRange) return false;

      // Job type filter
      const jobTypeMatch =
        selectedJobTypes.length === 0 ||
        selectedJobTypes.some(type => job.jobType?.toLowerCase().includes(type.toLowerCase()));

      // Experience level filter
      const experienceMatch =
        selectedExperienceLevels.length === 0 ||
        selectedExperienceLevels.some(level => job.experienceLevel?.toLowerCase().includes(level.toLowerCase()));

      // Skills filter
      const skillsMatch =
        selectedSkills.length === 0 ||
        selectedSkills.some(skillName =>
          job.skills.some(skill => skill.name.toLowerCase().includes(skillName.toLowerCase()))
        );

      return jobTypeMatch && experienceMatch && skillsMatch;
    });

    // Sort jobs
    filtered.sort((a: Job, b: Job) => {
      switch (sortBy) {
        case "salary":
          const aSalary = Math.max(a.minSalary || 0, a.maxSalary || 0);
          const bSalary = Math.max(b.minSalary || 0, b.maxSalary || 0);
          return bSalary - aSalary;
        case "relevant":
          // Relevance based on skills and tags matching selected filters
          const aRelevance = (selectedSkills.length > 0 ?
            a.skills.filter(skill => selectedSkills.some(s => skill.name.includes(s))).length : 0) +
            (selectedSkills.length > 0 ?
            a.tags.filter(tag => selectedSkills.some(s => tag.name.includes(s))).length : 0);
          const bRelevance = (selectedSkills.length > 0 ?
            b.skills.filter(skill => selectedSkills.some(s => skill.name.includes(s))).length : 0) +
            (selectedSkills.length > 0 ?
            b.tags.filter(tag => selectedSkills.some(s => tag.name.includes(s))).length : 0);
          return bRelevance - aRelevance;
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [
    jobs,
    searchQuery,
    locationQuery,
    salaryRange,
    selectedJobTypes,
    selectedExperienceLevels,
    selectedSkills,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedJobs.length / jobsPerPage);
  const paginatedJobs = filteredAndSortedJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const handleJobTypeChange = (jobType: string, checked: boolean) => {
    setSelectedJobTypes((prev) =>
      checked ? [...prev, jobType] : prev.filter((type) => type !== jobType)
    );
  };

  const handleExperienceLevelChange = (level: string, checked: boolean) => {
    setSelectedExperienceLevels((prev) =>
      checked ? [...prev, level] : prev.filter((l) => l !== level)
    );
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const clearAllFilters = () => {
    setSelectedJobTypes([]);
    setSelectedExperienceLevels([]);
    setSelectedSkills([]);
    setSalaryRange([10, 50]);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <JobsHero />
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Search Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl lg:text-4xl">Tìm việc làm</h1>
              </div>

              {/* Search Bar */}
              <div className="bg-white rounded-xl p-4 lg:p-6 border border-gray-200 shadow-sm">
                <div className="grid lg:grid-cols-[1fr_auto_1fr_auto] gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Vị trí công việc..."
                      className="pl-10"
                    />
                  </div>

                  <div className="hidden lg:block w-px bg-gray-200"></div>

                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input placeholder="Địa điểm..." className="pl-10" />
                  </div>

                  <Button className="bg-[#f26b38] hover:bg-[#e05a27]">
                    Tìm kiếm
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-[280px_1fr] gap-6">
              {/* Sidebar Filters */}
              <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm sticky top-20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg">Bộ lọc</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#f26b38] hover:text-[#e05a27]"
                      onClick={clearAllFilters}
                    >
                      Xóa tất cả
                    </Button>
                  </div>

                  {/* Job Type */}
                  <div className="mb-6">
                    <h3 className="text-sm text-gray-600 mb-3">
                      Loại công việc
                    </h3>
                    <div className="space-y-2">
                      {jobTypes.map((type) => (
                        <label
                          key={type}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <Checkbox
                            checked={selectedJobTypes.includes(type)}
                            onCheckedChange={(checked) =>
                              handleJobTypeChange(type, checked as boolean)
                            }
                            className="data-[state=checked]:bg-[#f26b38] data-[state=checked]:border-[#f26b38]"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-[#f26b38]">
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div className="mb-6">
                    <h3 className="text-sm text-gray-600 mb-3">Cấp bậc</h3>
                    <div className="space-y-2">
                      {experienceLevels.map((level) => (
                        <label
                          key={level}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <Checkbox
                            checked={selectedExperienceLevels.includes(level)}
                            onCheckedChange={(checked) =>
                              handleExperienceLevelChange(
                                level,
                                checked as boolean
                              )
                            }
                            className="data-[state=checked]:bg-[#f26b38] data-[state=checked]:border-[#f26b38]"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-[#f26b38]">
                            {level}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Salary Range */}
                  <div className="mb-6">
                    <h3 className="text-sm text-gray-600 mb-3">
                      Mức lương (triệu VNĐ)
                    </h3>
                    <div className="px-2">
                      <Slider
                        value={salaryRange}
                        onValueChange={setSalaryRange}
                        min={0}
                        max={100}
                        step={5}
                        className="mb-4"
                      />
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{salaryRange[0]} triệu</span>
                        <span>{salaryRange[1]} triệu</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills - Note: Skills filter will be implemented when skills data is available */}
                  <div>
                    <h3 className="text-sm text-gray-600 mb-3">Kỹ năng</h3>
                    <p className="text-xs text-gray-500">Tính năng lọc theo kỹ năng sẽ được cập nhật sau.</p>
                  </div>
                </div>
              </aside>

              {/* Job Listings */}
              <div>
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-gray-600">
                    Tìm thấy{" "}
                    <span className="text-gray-900">
                      {filteredAndSortedJobs.length}
                    </span>{" "}
                    việc làm
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="lg:hidden text-[#f26b38]"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Bộ lọc
                    </Button>
                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(
                          e.target.value as "newest" | "salary" | "relevant"
                        )
                      }
                      className="bg-white border border-gray-200 text-gray-700 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="salary">Lương cao nhất</option>
                      <option value="relevant">Liên quan nhất</option>
                    </select>
                  </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[#f26b38]" />
                    <span className="ml-2 text-gray-600">Đang tải danh sách việc làm...</span>
                  </div>
                ) : (
                  <>
                    {/* Job Cards */}
                    <div className="space-y-4">
                      {paginatedJobs.map((job) => (
                        <Card
                          key={job.id}
                          className="p-6 bg-white hover:border-[#f26b38] hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                        >
                          {/* Save Job Button - Top Right Corner */}
                          <button
                            onClick={() => handleSaveJob(job.id)}
                            className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-200 ${
                              savedJobs.has(job.id)
                                ? "text-[#f26b38] bg-orange-50 hover:bg-orange-100"
                                : "text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-[#f26b38]"
                            }`}
                            title={savedJobs.has(job.id) ? "Bỏ lưu" : "Lưu việc làm"}
                          >
                            <Bookmark
                              className={`h-5 w-5 ${
                                savedJobs.has(job.id) ? "fill-current" : ""
                              }`}
                            />
                          </button>

                          <div className="flex gap-4">
                            {/* Company Logo */}
                            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 border border-gray-200 flex-shrink-0 mt-1"></div>

                            {/* Job Content */}
                            <div className="flex-1 min-w-0 space-y-3">
                              {/* Job Title & Company */}
                              <div className="space-y-1">
                                <Link href={`/jobs/${job.id}`}>
                                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#f26b38] transition-colors leading-tight cursor-pointer">
                                    {job.title}
                                  </h3>
                                </Link>
                                <p className="text-sm text-gray-600 font-medium">
                                  {job.company.name}
                                </p>
                              </div>

                              {/* Job Details - 3 columns */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 text-sm">
                                <div className="flex items-center gap-0.5 text-gray-600">
                                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                  <span className="truncate">{getJobLocation(job)}</span>
                                </div>
                                <div className="flex items-center gap-0.5 text-gray-600">
                                  <DollarSign className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                  <span className="truncate">{getJobSalaryDisplay(job)}</span>
                                </div>
                                <div className="flex items-center gap-0.5 text-gray-600">
                                  <Briefcase className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                  <span className="truncate">{getJobTypeDisplay(job.jobType)}</span>
                                </div>
                              </div>

                              {/* Tags & Timestamp */}
                              <div className="flex items-center justify-between gap-4 pt-1">
                                <div className="flex flex-wrap gap-2 flex-1 min-w-0">
                                  {job.skills.slice(0, 3).map((skill) => (
                                    <Badge
                                      key={skill.id}
                                      variant="secondary"
                                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                    >
                                      {skill.name}
                                    </Badge>
                                  ))}
                                  {job.tags.slice(0, 3).map((tag) => (
                                    <Badge
                                      key={tag.id}
                                      variant="secondary"
                                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                                    >
                                      {tag.name}
                                    </Badge>
                                  ))}
                                  {(job.skills.length + job.tags.length) > 3 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs px-2 py-1 bg-gray-100 text-gray-500"
                                    >
                                      +{(job.skills.length + job.tags.length) - 3}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Clock className="h-3 w-3" />
                                    <span>{getTimeAgo(job.createdAt)}</span>
                                  </div>
                                  {/* Apply Button - Inline */}
                                  <div className="hidden md:block">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-[#f26b38] text-[#f26b38] hover:bg-orange-50 shadow-sm hover:shadow-md transition-all duration-200 h-7 px-3 text-xs"
                                    >
                                      Ứng tuyển
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Mobile Apply Button */}
                          <div className="md:hidden mt-4 pt-4 border-t border-gray-100">
                            <Button className="w-full bg-[#f26b38] hover:bg-[#e05a27] text-white font-medium py-3">
                              Ứng tuyển ngay
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* No jobs found */}
                    {paginatedJobs.length === 0 && !isLoading && (
                      <div className="text-center py-12">
                        <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy việc làm nào</h3>
                        <p className="text-gray-600">Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác.</p>
                      </div>
                    )}
                  </>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Trước
                    </Button>

                    {getPageNumbers().map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={
                          page === currentPage
                            ? "bg-[#f26b38] hover:bg-[#e05a27]"
                            : ""
                        }
                      >
                        {page}
                      </Button>
                    ))}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="text-gray-500">...</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
