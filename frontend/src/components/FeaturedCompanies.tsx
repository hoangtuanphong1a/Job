"use client";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Building2, MapPin, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const companies = [
  {
    id: 1,
    name: "FPT Software",
    industry: "Công nghệ thông tin",
    location: "Hà Nội",
    jobs: 127,
    featured: true,
  },
  {
    id: 2,
    name: "VNG Corporation",
    industry: "Game & Entertainment",
    location: "Hồ Chí Minh",
    jobs: 89,
    featured: true,
  },
  {
    id: 3,
    name: "Tiki",
    industry: "E-commerce",
    location: "Hồ Chí Minh",
    jobs: 54,
    featured: false,
  },
  {
    id: 4,
    name: "Grab Vietnam",
    industry: "Technology",
    location: "Hà Nội",
    jobs: 76,
    featured: true,
  },
  {
    id: 5,
    name: "Sendo",
    industry: "E-commerce",
    location: "Hà Nội",
    jobs: 43,
    featured: false,
  },
  {
    id: 6,
    name: "MoMo",
    industry: "FinTech",
    location: "Hồ Chí Minh",
    jobs: 62,
    featured: true,
  },
];

export function FeaturedCompanies() {
  const router = useRouter();

  const handleViewJobs = (companyId: number) => {
    router.push(`/companies/companydetail?id=${companyId}`);
  };

  const handleViewAllCompanies = () => {
    router.push('/companies');
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl mb-2">
              Công ty hàng đầu
            </h2>
            <p className="text-lg text-gray-600">
              Khám phá các nhà tuyển dụng uy tín và cơ hội phát triển sự nghiệp
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex" onClick={handleViewAllCompanies}>
            Xem tất cả
          </Button>
        </div>

        {/* Companies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className="group relative bg-white rounded-xl p-6 border border-gray-200 hover:border-[#f26b38] hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Featured Badge */}
              {company.featured && (
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-orange-100 text-[#f26b38]">
                    Top
                  </Badge>
                </div>
              )}

              {/* Company Logo Placeholder */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#f26b38] to-[#e05a27] flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-white" />
              </div>

              {/* Company Info */}
              <div className="space-y-3 mb-4">
                <h3 className="text-xl group-hover:text-[#f26b38] transition-colors">
                  {company.name}
                </h3>
                <p className="text-sm text-gray-600">{company.industry}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{company.location}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-gray-600">
                  {company.jobs} việc làm
                </span>
                <Button
                  onClick={() => handleViewJobs(company.id)}
                  size="sm"
                  variant="ghost"
                  className="text-[#f26b38] hover:text-[#e05a27] hover:bg-orange-50 group/btn"
                >
                  Xem việc làm
                  <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="text-center mt-8 md:hidden">
          <Button variant="outline" className="w-full" onClick={handleViewAllCompanies}>
            Xem tất cả công ty
          </Button>
        </div>
      </div>
    </section>
  );
}
