"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import {
  Calendar,
  Clock,
  Eye,
  Share2,
  Heart,
  MessageCircle,
  ArrowLeft,
  Facebook,
  Twitter,
  Linkedin,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// Static blog posts data
const staticBlogPosts = [
  {
    id: "1",
    slug: "10-ky-nang-mem-quan-trong-giup-ban-thanh-cong-trong-cong-viec",
    title: "10 Kỹ năng mềm quan trọng giúp bạn thành công trong công việc",
    content: `
      <h2>Giới thiệu</h2>
      <p>Trong thời đại số hóa ngày nay, kỹ năng mềm đóng vai trò quan trọng không kém gì kỹ năng chuyên môn. Những kỹ năng này không chỉ giúp bạn hoàn thành công việc tốt hơn mà còn tạo nền tảng cho sự phát triển nghề nghiệp lâu dài.</p>

      <h2>1. Kỹ năng giao tiếp</h2>
      <p>Kỹ năng giao tiếp hiệu quả là nền tảng của mọi mối quan hệ trong công việc. Bạn cần biết cách truyền đạt ý tưởng rõ ràng, lắng nghe tích cực và thích ứng với phong cách giao tiếp của đồng nghiệp.</p>

      <h2>2. Tư duy phản biện</h2>
      <p>Khả năng phân tích thông tin, đánh giá các lựa chọn và đưa ra quyết định sáng suốt là yếu tố then chốt để thành công trong bất kỳ lĩnh vực nào.</p>

      <h2>3. Quản lý thời gian</h2>
      <p>Biết cách ưu tiên công việc, phân bổ thời gian hợp lý và đáp ứng deadline là kỹ năng thiết yếu trong môi trường làm việc hiện đại.</p>

      <h2>4. Làm việc nhóm</h2>
      <p>Khả năng hợp tác hiệu quả với đồng nghiệp, tôn trọng ý kiến khác nhau và đóng góp tích cực cho mục tiêu chung của nhóm.</p>

      <h2>5. Giải quyết vấn đề</h2>
      <p>Khả năng xác định vấn đề, phân tích nguyên nhân và tìm ra giải pháp phù hợp là kỹ năng quan trọng trong mọi lĩnh vực.</p>

      <h2>Kết luận</h2>
      <p>Việc phát triển kỹ năng mềm cần thời gian và sự kiên trì. Hãy bắt đầu từ những kỹ năng cơ bản và dần dần nâng cao để đạt được mục tiêu nghề nghiệp của mình.</p>
    `,
    excerpt: "Khám phá những kỹ năng thiết yếu mà mọi chuyên gia cần có để phát triển sự nghiệp trong thời đại số...",
    featuredImage: "https://images.unsplash.com/photo-1722149493669-30098ef78f9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjYXJlZXJ8ZW58MXx8fHwxNzY0MzM5NjQzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    author: {
      id: "1",
      name: "Nguyễn Văn A",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      bio: "Chuyên gia phát triển sự nghiệp với hơn 10 năm kinh nghiệm trong lĩnh vực tuyển dụng."
    },
    tags: ["Kỹ năng mềm", "Phát triển sự nghiệp", "Giao tiếp"],
    viewCount: 1250,
    likeCount: 89,
    commentCount: 24,
    publishedAt: "2024-11-25T00:00:00Z",
    readingTime: 5
  },
  {
    id: "2",
    slug: "cach-viet-cv-xin-viec-an-tuong-thu-hut-nha-tuyen-dung",
    title: "Cách viết CV xin việc ấn tượng thu hút nhà tuyển dụng",
    content: `
      <h2>Lý do CV quan trọng</h2>
      <p>CV là lá thư giới thiệu đầu tiên của bạn với nhà tuyển dụng. Một CV ấn tượng có thể tạo nên sự khác biệt giữa việc được mời phỏng vấn hay bị loại ngay từ vòng đầu.</p>

      <h2>Cấu trúc CV chuẩn</h2>
      <p>Một CV chuẩn thường bao gồm các phần: Thông tin cá nhân, Mục tiêu nghề nghiệp, Học vấn, Kinh nghiệm làm việc, Kỹ năng và Sở thích.</p>

      <h2>Lưu ý quan trọng</h2>
      <ul>
        <li>Sử dụng ngôn ngữ hành động (action verbs)</li>
        <li>Định lượng thành tích khi có thể</li>
        <li>Giữ CV ngắn gọn, súc tích</li>
        <li>Chú ý đến format và layout</li>
      </ul>

      <h2>Mẹo để CV nổi bật</h2>
      <p>Hãy tùy chỉnh CV cho từng vị trí ứng tuyển, sử dụng từ khóa phù hợp và đảm bảo CV phản ánh đúng giá trị bạn mang lại cho công ty.</p>

      <h2>Kết luận</h2>
      <p>Viết CV là nghệ thuật kể chuyện về bản thân. Hãy đầu tư thời gian để tạo ra một CV chuyên nghiệp và ấn tượng để tạo ấn tượng tốt với nhà tuyển dụng.</p>
    `,
    excerpt: "Hướng dẫn chi tiết từng bước tạo một bản CV chuyên nghiệp, nổi bật và tăng cơ hội được nhận vào làm...",
    featuredImage: "https://images.unsplash.com/photo-1598520106830-8c45c2035460?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGlubm92YXRpb258ZW58MXx8fHwxNzY0MjkzMTE4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    author: {
      id: "1",
      name: "Nguyễn Văn A",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      bio: "Chuyên gia phát triển sự nghiệp với hơn 10 năm kinh nghiệm trong lĩnh vực tuyển dụng."
    },
    tags: ["CV", "Tuyển dụng", "Phỏng vấn"],
    viewCount: 2150,
    likeCount: 156,
    commentCount: 42,
    publishedAt: "2024-11-23T00:00:00Z",
    readingTime: 7
  },
  {
    id: "3",
    slug: "xu-huong-tuyen-dung-it-nam-2024-nhung-vi-tri-hot-nhat",
    title: "Xu hướng tuyển dụng IT năm 2024: Những vị trí hot nhất",
    content: `
      <h2>Thị trường IT Việt Nam 2024</h2>
      <p>Năm 2024 chứng kiến sự bùng nổ của thị trường công nghệ thông tin với nhu cầu tuyển dụng tăng cao và mức lương cạnh tranh.</p>

      <h2>Các vị trí hot nhất</h2>
      <p>AI Engineer, Cloud Architect, Cybersecurity Specialist, Full-stack Developer và Data Scientist là những vị trí được săn đón nhất.</p>

      <h2>Kỹ năng cần thiết</h2>
      <p>Ngoài kiến thức chuyên môn, các công ty đang tìm kiếm ứng viên có khả năng làm việc nhóm, tư duy phản biện và khả năng học hỏi liên tục.</p>

      <h2>Dự báo tương lai</h2>
      <p>Xu hướng số hóa sẽ tiếp tục thúc đẩy nhu cầu tuyển dụng IT, đặc biệt trong lĩnh vực AI, Blockchain và Cloud Computing.</p>

      <h2>Lời khuyên cho ứng viên</h2>
      <p>Hãy liên tục cập nhật kiến thức, tham gia các dự án thực tế và xây dựng portfolio để tăng cơ hội việc làm trong lĩnh vực IT đầy cạnh tranh.</p>
    `,
    excerpt: "Phân tích thị trường lao động IT Việt Nam và dự báo những công nghệ, vị trí việc làm được săn đón nhất...",
    featuredImage: "https://images.unsplash.com/photo-1624555130858-7ea5b8192c49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwdGVhbSUyMHdvcmtpbmd8ZW58MXx8fHwxNzY0MjgyMzAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    author: {
      id: "1",
      name: "Nguyễn Văn A",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      bio: "Chuyên gia phát triển sự nghiệp với hơn 10 năm kinh nghiệm trong lĩnh vực tuyển dụng."
    },
    tags: ["IT", "Tuyển dụng", "Xu hướng"],
    viewCount: 1890,
    likeCount: 134,
    commentCount: 38,
    publishedAt: "2024-11-20T00:00:00Z",
    readingTime: 6
  }
];

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  tags?: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt: string;
  readingTime?: number;
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        setError(null);

        const staticPost = staticBlogPosts.find((post) => post.slug === slug);
        if (staticPost) {
          setBlogPost(staticPost);
        } else {
          throw new Error("Blog post not found");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load blog post"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Comment submitted:", commentText);
    setCommentText("");
  };

  const handleShare = (platform: string) => {
    console.log(`Sharing to ${platform}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy bài viết
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push("/blog")}>
            Quay lại trang blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={blogPost.featuredImage}
            alt={blogPost.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
        </div>

        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/blog")}
          className="absolute top-8 left-8 z-20 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-sm rounded-full px-4 py-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Quay lại</span>
        </motion.button>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium border border-white/20">
                {blogPost.tags?.[0] || "Blog"}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              {blogPost.title}
            </h1>

            {blogPost.excerpt && (
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                {blogPost.excerpt}
              </p>
            )}

            <div className="flex items-center justify-center gap-8 text-white/80 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {new Date(blogPost.publishedAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{blogPost.readingTime || 5} phút đọc</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <span>{blogPost.viewCount} lượt xem</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden">
                  {blogPost.author.avatar ? (
                    <img
                      src={blogPost.author.avatar}
                      alt={blogPost.author.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-lg">
                      {blogPost.author.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
              <div className="text-left">
                <div className="text-white font-semibold text-lg">
                  {blogPost.author.name}
                </div>
                <div className="text-white/80 text-sm">
                  {blogPost.author.bio}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-4 flex-wrap"
            >
              <Button
                variant="secondary"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
                onClick={handleLike}
              >
                <Heart
                  className={`h-5 w-5 mr-2 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {blogPost.likeCount + (isLiked ? 1 : 0)}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {blogPost.commentCount}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
                onClick={handleBookmark}
              >
                <Bookmark
                  className={`h-5 w-5 mr-2 ${
                    isBookmarked ? "fill-blue-500 text-blue-500" : ""
                  }`}
                />
                {isBookmarked ? "Đã lưu" : "Lưu bài"}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
                onClick={() => handleShare("facebook")}
              >
                <Share2 className="h-5 w-5 mr-2" />
                Chia sẻ
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center text-white/60">
            <span className="text-sm mb-2">Cuộn để đọc</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center"
            >
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative">
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 space-y-3">
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
            onClick={handleLike}
            className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg backdrop-blur-sm transition-all ${
              isLiked
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white"
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
          </motion.button>

          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.9 }}
            onClick={handleBookmark}
            className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg backdrop-blur-sm transition-all ${
              isBookmarked
                ? "bg-blue-500 text-white"
                : "bg-white/80 text-gray-700 hover:bg-blue-500 hover:text-white"
            }`}
          >
            <Bookmark
              className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
            />
          </motion.button>

          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.0 }}
            onClick={() => handleShare("facebook")}
            className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-white/80 text-gray-700 hover:bg-blue-600 hover:text-white transition-all backdrop-blur-sm"
          >
            <Share2 className="h-5 w-5" />
          </motion.button>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
              >
                <header className="mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                      {blogPost.tags?.[0] || "Blog"}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(blogPost.publishedAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {blogPost.readingTime || 5} phút đọc
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {blogPost.title}
                  </h1>

                  {blogPost.excerpt && (
                    <p className="text-xl text-gray-600 leading-relaxed">
                      {blogPost.excerpt}
                    </p>
                  )}
                </header>

                <div
                  className="prose prose-xl prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-orange-200 prose-blockquote:bg-orange-50 prose-blockquote:p-6 prose-blockquote:rounded-lg prose-ul:text-gray-700 prose-ol:text-gray-700"
                  dangerouslySetInnerHTML={{ __html: blogPost.content }}
                />

                <footer className="mt-12 pt-8 border-t border-gray-200">
                  {blogPost.tags && blogPost.tags.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Tags:
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {blogPost.tags.map((tag: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-gradient-to-r from-orange-50 to-pink-50 text-orange-700 border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                      Thích bài viết này? Hãy chia sẻ!
                    </h3>
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex items-center gap-3 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all"
                        onClick={() => handleShare("facebook")}
                      >
                        <Facebook className="h-5 w-5" />
                        Facebook
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex items-center gap-3 hover:bg-sky-50 hover:border-sky-200 hover:text-sky-700 transition-all"
                        onClick={() => handleShare("twitter")}
                      >
                        <Twitter className="h-5 w-5" />
                        Twitter
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex items-center gap-3 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all"
                        onClick={() => handleShare("linkedin")}
                      >
                        <Linkedin className="h-5 w-5" />
                        LinkedIn
                      </Button>
                    </div>
                  </div>
                </footer>
              </motion.article>

              {showComments && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Bình luận ({blogPost.commentCount})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleComment} className="mb-6">
                        <Textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Viết bình luận của bạn..."
                          rows={4}
                          className="mb-4"
                        />
                        <Button
                          type="submit"
                          className="bg-[#f26b38] hover:bg-[#e05a27]"
                        >
                          Đăng bình luận
                        </Button>
                      </form>

                      <Separator className="mb-6" />

                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm">
                            U
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">
                                Nguyễn Văn B
                              </span>
                              <span className="text-xs text-gray-500">
                                2 giờ trước
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              Bài viết rất hữu ích! Cảm ơn tác giả đã chia sẻ.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm">
                            T
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">
                                Trần Thị C
                              </span>
                              <span className="text-xs text-gray-500">
                                5 giờ trước
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              Mình đã áp dụng theo hướng dẫn này và thành công
                              lắm!
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Về tác giả</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img
                        src={blogPost.author.avatar}
                        alt={blogPost.author.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {blogPost.author.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {blogPost.author.bio}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Twitter className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Đăng ký nhận tin
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Nhận những bài viết mới nhất về tuyển dụng và phát triển
                      nghề nghiệp
                    </p>
                    <div className="space-y-3">
                      <Input placeholder="Nhập email của bạn" />
                      <Button className="w-full bg-[#f26b38] hover:bg-[#e05a27]">
                        Đăng ký
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
