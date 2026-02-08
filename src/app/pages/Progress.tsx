import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress as ProgressBar } from "../components/ui/progress";
import { 
  TrendingUp, 
  Award, 
  Target, 
  Calendar,
  BookOpen,
  BookText,
  Headphones,
  Mic,
  Flame,
  Star
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

const weeklyData = [
  { day: "周一", 词汇: 20, 语法: 5, 阅读: 2, 听力: 3, 口语: 4 },
  { day: "周二", 词汇: 25, 语法: 6, 阅读: 3, 听力: 4, 口语: 3 },
  { day: "周三", 词汇: 30, 语法: 4, 阅读: 2, 听力: 5, 口语: 5 },
  { day: "周四", 词汇: 15, 语法: 7, 阅读: 4, 听力: 3, 口语: 2 },
  { day: "周五", 词汇: 28, 语法: 5, 阅读: 3, 听力: 6, 口语: 4 },
  { day: "周六", 词汇: 35, 语法: 8, 阅读: 5, 听力: 4, 口语: 6 },
  { day: "周日", 词汇: 22, 语法: 6, 阅读: 3, 听力: 5, 口语: 3 }
];

const monthlyProgress = [
  { month: "1月", 总分: 65 },
  { month: "2月", 总分: 72 },
  { month: "3月", 总分: 78 },
  { month: "4月", 总分: 85 },
  { month: "5月", 总分: 88 },
  { month: "6月", 总分: 92 }
];

const achievements = [
  { id: 1, title: "初学者", description: "完成第一节课", icon: "🎓", unlocked: true },
  { id: 2, title: "词汇达人", description: "掌握100个单词", icon: "📚", unlocked: true },
  { id: 3, title: "连续学习", description: "连续学习7天", icon: "🔥", unlocked: true },
  { id: 4, title: "语法大师", description: "语法测试满分", icon: "⭐", unlocked: true },
  { id: 5, title: "阅读爱好者", description: "完成10篇阅读", icon: "📖", unlocked: true },
  { id: 6, title: "听力高手", description: "听力练习50次", icon: "🎧", unlocked: false },
  { id: 7, title: "口语流利", description: "完成20个对话场景", icon: "🗣️", unlocked: false },
  { id: 8, title: "学习狂人", description: "累计学习100小时", icon: "🏆", unlocked: false }
];

const skillLevels = [
  { skill: "词汇", level: 85, icon: BookOpen, color: "blue" },
  { skill: "语法", level: 72, icon: BookText, color: "purple" },
  { skill: "阅读", level: 78, icon: BookOpen, color: "green" },
  { skill: "听力", level: 68, icon: Headphones, color: "orange" },
  { skill: "口语", level: 65, icon: Mic, color: "red" }
];

export function Progress() {
  const totalStudyTime = 1250; // minutes
  const studyStreak = 15; // days
  const overallProgress = 76; // percentage

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          学习进度
        </h1>
        <p className="text-gray-600">追踪你的学习成果和进步</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-none">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">总学习时间</p>
                <p className="text-3xl font-bold text-blue-600">{Math.floor(totalStudyTime / 60)}h</p>
                <p className="text-xs text-gray-500 mt-1">{totalStudyTime % 60}分钟</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-none">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">连续学习</p>
                <p className="text-3xl font-bold text-orange-600">{studyStreak}</p>
                <p className="text-xs text-gray-500 mt-1">天</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-none">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">总体进度</p>
                <p className="text-3xl font-bold text-green-600">{overallProgress}%</p>
                <p className="text-xs text-gray-500 mt-1">中级水平</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-none">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">获得成就</p>
                <p className="text-3xl font-bold text-purple-600">
                  {achievements.filter(a => a.unlocked).length}
                </p>
                <p className="text-xs text-gray-500 mt-1">/ {achievements.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skill Levels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            技能水平
          </CardTitle>
          <CardDescription>各项技能的掌握程度</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {skillLevels.map((skill) => {
            const Icon = skill.icon;
            return (
              <div key={skill.skill} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-${skill.color}-100 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${skill.color}-600`} />
                    </div>
                    <span className="font-medium text-gray-900">{skill.skill}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{skill.level}%</span>
                    <Badge variant="outline">
                      {skill.level >= 80 ? "优秀" : skill.level >= 60 ? "良好" : "加油"}
                    </Badge>
                  </div>
                </div>
                <ProgressBar value={skill.level} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Weekly Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>本周学习活动</CardTitle>
          <CardDescription>过去7天的学习详情</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="词汇" fill="#3b82f6" />
              <Bar dataKey="语法" fill="#a855f7" />
              <Bar dataKey="阅读" fill="#10b981" />
              <Bar dataKey="听力" fill="#f97316" />
              <Bar dataKey="口语" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>月度进步趋势</CardTitle>
          <CardDescription>过去6个月的整体进步情况</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="总分" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            成就系统
          </CardTitle>
          <CardDescription>解锁各种学习成就</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  achievement.unlocked
                    ? "border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-md"
                    : "border-gray-200 bg-gray-50 opacity-60"
                }`}
              >
                <div className="text-5xl mb-3">{achievement.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{achievement.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
                {achievement.unlocked ? (
                  <Badge className="bg-yellow-500">
                    <Star className="w-3 h-3 mr-1" />
                    已解锁
                  </Badge>
                ) : (
                  <Badge variant="secondary">未解锁</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Study Goals */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            学习目标
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">每日学习60分钟</span>
              <span className="font-semibold text-indigo-600">25/60分钟</span>
            </div>
            <ProgressBar value={42} className="h-2" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">本周掌握50个新单词</span>
              <span className="font-semibold text-indigo-600">32/50</span>
            </div>
            <ProgressBar value={64} className="h-2" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">本月完成20篇阅读</span>
              <span className="font-semibold text-indigo-600">14/20</span>
            </div>
            <ProgressBar value={70} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}