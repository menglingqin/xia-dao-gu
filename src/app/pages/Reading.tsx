import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { BookOpen, Clock, TrendingUp } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";

interface Article {
  id: number;
  title: string;
  level: string;
  topic: string;
  readTime: string;
  content: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

const articles: Article[] = [
  {
    id: 1,
    title: "The Benefits of Learning a Second Language",
    level: "中级",
    topic: "教育",
    readTime: "5分钟",
    content: `Learning a second language has numerous benefits that extend far beyond the ability to communicate with more people. Research has shown that bilingual individuals often demonstrate enhanced cognitive abilities, including better problem-solving skills and improved memory.

One of the most significant advantages is the delay in the onset of dementia and Alzheimer's disease. Studies suggest that speaking two or more languages can postpone these conditions by up to five years. This is because language learning keeps the brain active and builds cognitive reserve.

Furthermore, learning a new language opens doors to different cultures and perspectives. It allows you to understand foreign literature, films, and music in their original form, providing a deeper appreciation of other cultures. This cultural awareness can lead to greater empathy and understanding in our increasingly globalized world.

From a professional standpoint, being bilingual or multilingual is a valuable asset. Many employers seek candidates who can communicate with international clients and partners. In today's global economy, language skills can significantly boost your career prospects and earning potential.`,
    questions: [
      {
        question: "According to the passage, bilingual individuals often have:",
        options: [
          "Better physical health",
          "Enhanced cognitive abilities",
          "More friends",
          "Higher income"
        ],
        correctAnswer: 1
      },
      {
        question: "Learning a second language can delay dementia by:",
        options: [
          "Up to two years",
          "Up to three years",
          "Up to five years",
          "Up to ten years"
        ],
        correctAnswer: 2
      },
      {
        question: "Which is NOT mentioned as a benefit of learning languages?",
        options: [
          "Career advantages",
          "Cultural understanding",
          "Improved memory",
          "Better cooking skills"
        ],
        correctAnswer: 3
      }
    ]
  },
  {
    id: 2,
    title: "The Impact of Technology on Modern Education",
    level: "高级",
    topic: "科技",
    readTime: "6分钟",
    content: `Technology has revolutionized the educational landscape in unprecedented ways. From interactive whiteboards to online learning platforms, digital tools have transformed how students learn and teachers instruct. This shift has brought both opportunities and challenges to the educational sector.

One of the most prominent changes is the accessibility of information. Students no longer need to rely solely on textbooks and libraries. With a few clicks, they can access vast amounts of information from around the world. This democratization of knowledge has leveled the playing field, allowing students from different backgrounds to access the same high-quality educational resources.

However, this digital transformation also presents challenges. The abundance of information can be overwhelming, and not all sources are reliable. Students must develop critical thinking skills to evaluate the credibility of online content. Additionally, the digital divide remains a significant issue, with many students lacking access to necessary technology and internet connectivity.

Despite these challenges, technology offers innovative ways to engage students. Virtual reality can transport students to historical events or distant planets. Artificial intelligence can provide personalized learning experiences, adapting to each student's pace and learning style. These tools have the potential to make education more engaging and effective than ever before.`,
    questions: [
      {
        question: "What is described as one of the most prominent changes in education?",
        options: [
          "Longer school days",
          "Accessibility of information",
          "Smaller class sizes",
          "More homework"
        ],
        correctAnswer: 1
      },
      {
        question: "According to the passage, what challenge does digital transformation present?",
        options: [
          "Too many teachers",
          "Expensive textbooks",
          "Overwhelming amount of information",
          "Lack of classrooms"
        ],
        correctAnswer: 2
      },
      {
        question: "The passage suggests that AI in education can:",
        options: [
          "Replace teachers completely",
          "Provide personalized learning experiences",
          "Make education more expensive",
          "Reduce student engagement"
        ],
        correctAnswer: 1
      }
    ]
  }
];

export function Reading() {
  const [selectedArticle, setSelectedArticle] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  const article = articles[selectedArticle];

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  const calculateScore = () => {
    let correct = 0;
    article.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const score = showResults ? calculateScore() : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          阅读训练
        </h1>
        <p className="text-gray-600">提升阅读理解能力，涵盖多种题材</p>
      </div>

      <Tabs defaultValue="article" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="article">阅读文章</TabsTrigger>
          <TabsTrigger value="library">文章库</TabsTrigger>
        </TabsList>

        <TabsContent value="article" className="space-y-6">
          {/* Article Info */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-none">
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex-1">{article.title}</h2>
                <Badge variant={article.level === "高级" ? "destructive" : "secondary"}>
                  {article.level}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <BookOpen className="w-3 h-3" />
                  {article.topic}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Article Content */}
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-lg max-w-none">
                {article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comprehension Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>阅读理解题</span>
                {showResults && (
                  <Badge className="bg-green-600 text-lg px-4 py-1">
                    得分: {score} / {article.questions.length}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                根据文章内容回答以下问题
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {article.questions.map((q, qIndex) => (
                <div key={qIndex} className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center font-semibold text-green-700">
                      {qIndex + 1}
                    </div>
                    <p className="font-medium text-gray-900 flex-1 pt-1">{q.question}</p>
                  </div>
                  
                  <RadioGroup
                    value={answers[qIndex]?.toString()}
                    onValueChange={(value) => {
                      setAnswers({ ...answers, [qIndex]: parseInt(value) });
                      setShowResults(false);
                    }}
                    disabled={showResults}
                    className="ml-11"
                  >
                    <div className="space-y-2">
                      {q.options.map((option, oIndex) => (
                        <div
                          key={oIndex}
                          className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                            showResults
                              ? oIndex === q.correctAnswer
                                ? "border-green-500 bg-green-50"
                                : oIndex === answers[qIndex]
                                ? "border-red-500 bg-red-50"
                                : "border-gray-200"
                              : answers[qIndex] === oIndex
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-green-300"
                          }`}
                        >
                          <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} />
                          <Label
                            htmlFor={`q${qIndex}-o${oIndex}`}
                            className="flex-1 cursor-pointer"
                          >
                            {option}
                          </Label>
                          {showResults && oIndex === q.correctAnswer && (
                            <Badge className="bg-green-600">正确</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              ))}

              <div className="flex gap-3 pt-4">
                {!showResults ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={Object.keys(answers).length !== article.questions.length}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    提交答案
                  </Button>
                ) : (
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1"
                  >
                    重新作答
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <div className="grid gap-4">
            {articles.map((article, index) => (
              <Card
                key={article.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedArticle === index ? "ring-2 ring-green-500" : ""
                }`}
                onClick={() => {
                  setSelectedArticle(index);
                  setAnswers({});
                  setShowResults(false);
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {article.content.substring(0, 150)}...
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge variant={article.level === "高级" ? "destructive" : "secondary"}>
                        {article.level}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {article.topic}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {article.questions.length} 道题
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
