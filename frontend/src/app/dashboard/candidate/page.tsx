"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Bookmark,
  Send,
  Eye,
  TrendingUp,
  Calendar,
  MapPin,
  Briefcase,
  User,
  Settings,
  LogOut,
  Plus,
  Home,
  ArrowLeft
} from "lucide-react";

interface DashboardStats {
  applicationsCount: number;
  viewsCount: number;
  savedJobsCount: number;
  cvsCount: number;
  profileCompletion: number;
}

interface RecentApplication {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'interviewed' | 'rejected' | 'accepted';
}

interface RecommendedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
}

export default function CandidateDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    applicationsCount: 0,
    viewsCount: 0,
    savedJobsCount: 0,
    cvsCount: 0,
    profileCompletion: 0
  });
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Fetch dashboard stats
      const statsResponse = await fetch('/api/dashboard/candidate/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch recent applications
      const applicationsResponse = await fetch('/api/dashboard/candidate/applications?limit=3', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (applicationsResponse.ok) {
        const applicationsData = await applicationsResponse.json();
        setRecentApplications(applicationsData);
      }

      // Fetch recommended jobs
      const jobsResponse = await fetch('/api/jobs/recommended?limit=3', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        setRecommendedJobs(jobsData);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Đã gửi', color: 'bg-blue-100 text-blue-700' },
      reviewed: { label: 'Đang xét duyệt', color: 'bg-yellow-100 text-yellow-700' },
      interviewed: { label: 'Phỏng vấn', color: 'bg-purple-100 text-purple-700' },
      rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-700' },
      accepted: { label: 'Chấp nhận', color: 'bg-green-100 text-green-700' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="py-8">
        <div className="container mx-auto px-4">
          {/* Header with user actions */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Ứng viên</h1>
              <p className="text-gray-600 mt-1">Chào mừng bạn trở lại! Theo dõi tiến trình ứng tuyển của bạn.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="outline" size="sm" className="text-[#f26b38] border-[#f26b38] hover:bg-[#f26b38] hover:text-white">
                  <Home className="h-4 w-4 mr-2" />
                  Trang chủ
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Cài đặt
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Send className="h-6 w-6 text-[#f26b38]" />
                </div>
                <Badge className="bg-green-100 text-green-700">+12%</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.applicationsCount}</div>
              <div className="text-sm text-gray-600">Đơn ứng tuyển</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.viewsCount}</div>
              <div className="text-sm text-gray-600">Lượt xem CV</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Bookmark className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.savedJobsCount}</div>
              <div className="text-sm text-gray-600">Việc làm đã lưu</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.cvsCount}</div>
              <div className="text-sm text-gray-600">CV đã tạo</div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Applications */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Đơn ứng tuyển gần đây</h2>
                  <Link href="/dashboard/candidate/applications">
                    <Button variant="ghost" size="sm" className="text-[#f26b38]">
                      Xem tất cả
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentApplications.length > 0 ? recentApplications.map((application) => (
                    <div key={application.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#f26b38] transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{application.jobTitle}</h3>
                          <p className="text-sm text-gray-600 mb-2">{application.companyName}</p>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{application.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Ứng tuyển {application.appliedDate}</span>
                            </div>
                          </div>
                        </div>
                        {getStatusBadge(application.status)}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <Send className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Chưa có đơn ứng tuyển nào</p>
                      <Link href="/jobs">
                        <Button className="mt-4 bg-[#f26b38] hover:bg-[#e05a27]">
                          Tìm việc làm ngay
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </Card>

              {/* Recommended Jobs */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Việc làm phù hợp với bạn</h2>
                <div className="space-y-4">
                  {recommendedJobs.length > 0 ? recommendedJobs.map((job) => (
                    <div key={job.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#f26b38] transition-colors cursor-pointer group">
                      <h3 className="font-medium mb-2 group-hover:text-[#f26b38] transition-colors">{job.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{job.company}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {job.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-[#f26b38]">{job.salary}</span>
                          <p className="text-xs text-gray-500">{job.location}</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Đang tìm việc làm phù hợp...</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Completion */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Hoàn thiện hồ sơ</h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Độ hoàn thiện</span>
                    <span className="text-[#f26b38] font-medium">{stats.profileCompletion}%</span>
                  </div>
                  <Progress value={stats.profileCompletion} className="h-2" />
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Thêm ảnh đại diện</span>
                  </li>
                  <li className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Tạo CV</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Thêm kỹ năng</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Cập nhật kinh nghiệm</span>
                  </li>
                </ul>
                <Link href="/dashboard/candidate/profile">
                  <Button className="w-full mt-4 bg-[#f26b38] hover:bg-[#e05a27]" size="sm">
                    Hoàn thiện hồ sơ
                  </Button>
                </Link>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Hành động nhanh</h3>
                <div className="space-y-3">
                  <Link href="/cv-builder">
                    <Button className="w-full bg-[#f26b38] hover:bg-[#e05a27]" size="lg">
                      <Plus className="h-5 w-5 mr-2" />
                      Tạo CV mới
                    </Button>
                  </Link>
                  <Link href="/jobs">
                    <Button variant="outline" className="w-full" size="lg">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Tìm việc làm
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
