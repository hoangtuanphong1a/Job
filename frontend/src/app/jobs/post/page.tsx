"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Save, Send, AlertCircle } from "lucide-react";
import {
  jobService,
  JobFormData,
  Company,
  JobCategory,
} from "@/services/jobService";
import toast, { Toaster } from "react-hot-toast";

export default function PostJobPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    industry: "",
    level: "",
    type: "",
    quantity: "1",
    salaryMin: "",
    salaryMax: "",
    location: "",
    description: "",
    requirements: "",
    benefits: "",
    skills: [],
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    deadline: "",
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      console.log("Loading initial data for job posting...");
      const [companiesData, categoriesData] = await Promise.all([
        jobService.getUserCompanies(),
        jobService.getJobCategories(),
      ]);

      console.log("Companies loaded:", companiesData);
      console.log("Categories loaded:", categoriesData);

      setCompanies(companiesData);
      setCategories(categoriesData);

      // Auto-select first company if available
      if (companiesData.length > 0) {
        setSelectedCompanyId(companiesData[0].id);
        console.log("Auto-selected company:", companiesData[0].name);
      } else {
        console.warn("No companies found for user");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error loading initial data:", error);
      // If user is not authenticated, redirect to login
      if (error?.response?.status === 401) {
        console.error("User not authenticated, redirecting to login");
        router.push("/auth/login");
      } else {
        // Set error for companies
        setErrors((prev) => ({
          ...prev,
          companies: "Không thể tải danh sách công ty. Vui lòng thử lại.",
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Check if user has companies
    if (companies.length === 0) {
      newErrors.company = "Bạn cần tạo công ty trước khi đăng tin tuyển dụng";
      setErrors(newErrors);
      return false;
    }

    // Validate required fields
    if (!formData.title.trim())
      newErrors.title = "Tiêu đề công việc là bắt buộc";
    if (!formData.industry) newErrors.industry = "Ngành nghề là bắt buộc";
    if (!formData.level) newErrors.level = "Cấp bậc là bắt buộc";
    if (!formData.type) newErrors.type = "Hình thức làm việc là bắt buộc";
    if (!formData.location.trim())
      newErrors.location = "Địa điểm là bắt buộc";
    if (!formData.description.trim())
      newErrors.description = "Mô tả công việc là bắt buộc";
    if (!formData.requirements.trim())
      newErrors.requirements = "Yêu cầu ứng viên là bắt buộc";
    if (!formData.contactName.trim())
      newErrors.contactName = "Tên người liên hệ là bắt buộc";
    if (!formData.contactEmail.trim())
      newErrors.contactEmail = "Email liên hệ là bắt buộc";
    if (!formData.deadline) newErrors.deadline = "Hạn nộp hồ sơ là bắt buộc";

    if (!selectedCompanyId) newErrors.company = "Vui lòng chọn công ty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mapFormToJobData = async () => {
    // Map frontend values to backend enums
    const jobTypeMap: { [key: string]: string } = {
      fulltime: "full_time",
      parttime: "part_time",
      remote: "contract", // Map remote to contract for now
      contract: "contract",
      internship: "internship",
    };

    const experienceLevelMap: { [key: string]: string } = {
      intern: "entry_level",
      junior: "junior",
      middle: "mid_level",
      senior: "senior",
      lead: "lead",
      manager: "executive",
    };

    // Find category ID from selected industry
    const selectedCategory = categories.find((cat) =>
      cat.name.toLowerCase().includes(formData.industry.toLowerCase())
    );
    const categoryId = selectedCategory?.id;

    // Convert skill names to skill IDs
    let skillIds: string[] | undefined = undefined;
    if (formData.skills.length > 0) {
      skillIds = await jobService.convertSkillNamesToIds(formData.skills);
    }

    return {
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements || undefined,
      benefits: formData.benefits || undefined,
      jobType: jobTypeMap[formData.type] || "full_time",
      experienceLevel: experienceLevelMap[formData.level] || "mid_level",
      minSalary: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
      maxSalary: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
      city: formData.location,
      country: "Vietnam", // Default for now
      categoryId,
      companyId: selectedCompanyId,
      expiresAt: formData.deadline || undefined,
      skillIds,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsLoading(true);

    const loadingToast = toast.loading('Đang đăng tin tuyển dụng...');

    try {
      const jobData = await mapFormToJobData();

      await jobService.createJob(jobData);

      toast.dismiss(loadingToast);

      toast.success('Đăng tin tuyển dụng thành công!');

      // Redirect to jobs page where the new job will be visible immediately
      router.push('/jobs');
    } catch (error: unknown) {
      console.error('Error posting job:', error);
      toast.dismiss(loadingToast);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any)?.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        router.push('/auth/login');
      } else {
        const errorMessage =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any)?.response?.data?.message ||
          'Có lỗi xảy ra. Vui lòng thử lại.';
        toast.error(errorMessage);
        setErrors({ general: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Đăng tin tuyển dụng</h1>
                <p className="text-gray-600">
                  Điền thông tin chi tiết để tìm kiếm ứng viên phù hợp nhất cho
                  doanh nghiệp của bạn
                </p>
              </div>

              {/* Error Display */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700">{errors.general}</p>
                </div>
              )}

              {/* Company Selector */}
              <Card className="p-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="company">Chọn công ty *</Label>
                  {companies.length > 0 ? (
                    <>
                      <Select
                        value={selectedCompanyId}
                        onValueChange={setSelectedCompanyId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn công ty" />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.company && (
                        <p className="text-red-500 text-sm">{errors.company}</p>
                      )}
                    </>
                  ) : (
                    <div className="space-y-3">
                      {errors.companies ? (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-700 text-sm">
                            {errors.companies}
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={loadInitialData}
                          >
                            Thử lại
                          </Button>
                        </div>
                      ) : (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-yellow-700 text-sm">
                            Bạn chưa có công ty nào. Vui lòng tạo công ty trước
                            khi đăng tin tuyển dụng.
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => router.push("/dashboard/employer")}
                          >
                            Đến trang quản lý công ty
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Basic Info */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">
                    Thông tin cơ bản
                  </h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Tiêu đề công việc *</Label>
                      <Input
                        id="title"
                        placeholder="Ví dụ: Senior Frontend Developer"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="industry">Ngành nghề *</Label>
                        <Select
                          value={formData.industry}
                          onValueChange={(value: string) =>
                            setFormData({ ...formData, industry: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn ngành nghề" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">
                              Công nghệ thông tin
                            </SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="design">Thiết kế</SelectItem>
                            <SelectItem value="sales">Kinh doanh</SelectItem>
                            <SelectItem value="finance">Tài chính</SelectItem>
                            <SelectItem value="hr">Nhân sự</SelectItem>
                            <SelectItem value="education">Giáo dục</SelectItem>
                            <SelectItem value="healthcare">Y tế</SelectItem>
                            {/* Note: Categories will be loaded from API when available */}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="level">Cấp bậc *</Label>
                        <Select
                          value={formData.level}
                          onValueChange={(value: string) =>
                            setFormData({ ...formData, level: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn cấp bậc" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="intern">
                              Thực tập sinh
                            </SelectItem>
                            <SelectItem value="junior">Junior</SelectItem>
                            <SelectItem value="middle">Middle</SelectItem>
                            <SelectItem value="senior">Senior</SelectItem>
                            <SelectItem value="lead">Lead</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="type">Hình thức làm việc *</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value: string) =>
                            setFormData({ ...formData, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn hình thức" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fulltime">
                              Toàn thời gian
                            </SelectItem>
                            <SelectItem value="parttime">
                              Bán thời gian
                            </SelectItem>
                            <SelectItem value="remote">
                              Làm việc từ xa
                            </SelectItem>
                            <SelectItem value="contract">Hợp đồng</SelectItem>
                            <SelectItem value="internship">Thực tập</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quantity">Số lượng tuyển</Label>
                        <Input
                          id="quantity"
                          type="number"
                          placeholder="1"
                          min="1"
                          value={formData.quantity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              quantity: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Mức lương (triệu VNĐ)</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            placeholder="Từ"
                            type="number"
                            min="0"
                            value={formData.salaryMin}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                salaryMin: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="Đến"
                            type="number"
                            min="0"
                            value={formData.salaryMax}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                salaryMax: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Địa điểm làm việc *</Label>
                        <Input
                          id="location"
                          placeholder="Ví dụ: Hà Nội, TP.HCM"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Job Description */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">
                    Mô tả công việc
                  </h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="description">Mô tả công việc *</Label>
                      <Textarea
                        id="description"
                        placeholder="Mô tả chi tiết về công việc, trách nhiệm và mục tiêu cần đạt được..."
                        rows={8}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requirements">Yêu cầu ứng viên *</Label>
                      <Textarea
                        id="requirements"
                        placeholder="Liệt kê các yêu cầu về kỹ năng, kinh nghiệm, bằng cấp..."
                        rows={6}
                        value={formData.requirements}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            requirements: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="benefits">Quyền lợi</Label>
                      <Textarea
                        id="benefits"
                        placeholder="Mô tả các quyền lợi, phúc lợi mà ứng viên sẽ nhận được..."
                        rows={6}
                        value={formData.benefits}
                        onChange={(e) =>
                          setFormData({ ...formData, benefits: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Kỹ năng yêu cầu</Label>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Nhập kỹ năng và nhấn Enter"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyPress={handleSkillKeyPress}
                          />
                          <Button
                            type="button"
                            onClick={addSkill}
                            variant="outline"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {formData.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="px-3 py-1"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => removeSkill(skill)}
                                  className="ml-2 hover:text-red-500"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Contact Info */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">
                    Thông tin liên hệ
                  </h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="contactName">Người liên hệ *</Label>
                        <Input
                          id="contactName"
                          placeholder="Tên người liên hệ"
                          value={formData.contactName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contactName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email nhận hồ sơ *</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          placeholder="hr@company.com"
                          value={formData.contactEmail}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contactEmail: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Số điện thoại</Label>
                      <Input
                        id="contactPhone"
                        placeholder="0987654321"
                        value={formData.contactPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactPhone: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deadline">Hạn nộp hồ sơ *</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) =>
                          setFormData({ ...formData, deadline: e.target.value })
                        }
                        required
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                </Card>

                {/* Actions */}
                <Button
                  type="submit"
                  className="w-full bg-[#f26b38] hover:bg-[#e05a27] py-3"
                  disabled={isLoading}
                >
                  <Send className="h-5 w-5 mr-2" />
                  {isLoading ? "Đang đăng..." : "Đăng tin tuyển dụng"}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  <p>* Các trường bắt buộc</p>
                  <p>Tin tuyển dụng sẽ được duyệt trong vòng 24 giờ</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
