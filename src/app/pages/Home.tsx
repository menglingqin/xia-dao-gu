import { Link } from "react-router";
import { 
  BookOpen, 
  BookText, 
  Headphones, 
  Mic, 
  TrendingUp,
  Target,
  Clock,
  Award
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";

export function Home() {
  const learningModules = [
    {
      title: "词汇学习",
      description: "通过卡片记忆法快速掌握英语词汇",
      icon: BookOpen,
      path: "/vocabulary",
      color: "from-blue-500 to-blue-600",
      stats: "2000+ 词汇"
    },
    {
      title: "语法练习",
      description: "系统学习英语语法，配有详细解释",
      icon: BookText,
      path: "/grammar",
      color: "from-purple-500 to-purple-600",
      stats: "50+ 语法点"
    },
    {
      title: "阅读训练",
      description: "提升阅读理解能力，涵盖多种题材",
      icon: BookOpen,
      path: "/reading",
      color: "from-green-500 to-green-600",
      stats: "100+ 文章"
    },
    {
      title: "听力练习",
      description: "通过真实场景对话提高听力水平",
      icon: Headphones,
      path: "/listening",
      color: "from-orange-500 to-orange-600",
      stats: "200+ 音频"
    },
    {
      title: "口语训练",
      description: "练习发音和日常对话",
      icon: Mic,
      path: "/speaking",
      color: "from-red-500 to-red-600",
      stats: "150+ 场景"
    },
    {
      title: "学习进度",
      description: "追踪你的学习成果和进步",
      icon: TrendingUp,
      path: "/progress",
      color: "from-cyan-500 to-cyan-600",
      stats: "实时统计"
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          欢迎来到英语学习平台
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          通过系统化、互动式的学习方式，让英语学习变得更简单、更有趣
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link to="/vocabulary">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
              开始学习
            </Button>
          </Link>
          <Link to="/progress">
            <Button size="lg" variant="outline">
              查看进度
            </Button>
          </Link>
        </div>
      </section>

      {/* Today's Goal */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-none shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              <CardTitle>今日学习目标</CardTitle>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>已学习 25 分钟</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>每日目标：60分钟</span>
              <span className="font-semibold">42%</span>
            </div>
            <Progress value={42} className="h-2" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">15</div>
              <div className="text-sm text-gray-600">新词汇</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-gray-600">语法练习</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">2</div>
              <div className="text-sm text-gray-600">阅读文章</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-orange-600">5</div>
              <div className="text-sm text-gray-600">听力练习</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Modules */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-center">学习模块</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.path} to={module.path}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{module.stats}</span>
                      <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                        开始 →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Achievements */}
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-none shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-600" />
            <CardTitle>最近成就</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-4xl mb-2">🏆</div>
              <div className="font-semibold text-sm">连续学习7天</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-4xl mb-2">📚</div>
              <div className="font-semibold text-sm">掌握100个词汇</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-4xl mb-2">⭐</div>
              <div className="font-semibold text-sm">语法测试满分</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-4xl mb-2">🎯</div>
              <div className="font-semibold text-sm">完成10篇阅读</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
