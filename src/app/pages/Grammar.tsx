import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { CheckCircle2, XCircle, Lightbulb, BookOpen } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
}

const grammarQuestions: Question[] = [
  {
    id: 1,
    question: "She _____ to the gym every morning.",
    options: ["go", "goes", "going", "gone"],
    correctAnswer: 1,
    explanation: "第三人称单数现在时态需要在动词后加-s或-es。She是第三人称单数，因此使用goes。",
    topic: "一般现在时"
  },
  {
    id: 2,
    question: "I have _____ finished my homework.",
    options: ["yet", "already", "still", "ever"],
    correctAnswer: 1,
    explanation: "already用于肯定句中表示'已经'，通常位于have和过去分词之间。yet用于否定句和疑问句。",
    topic: "现在完成时"
  },
  {
    id: 3,
    question: "If I _____ rich, I would travel around the world.",
    options: ["am", "was", "were", "be"],
    correctAnswer: 2,
    explanation: "这是虚拟语气，表示与现在事实相反的假设。在if从句中，be动词用were（所有人称）。",
    topic: "虚拟语气"
  },
  {
    id: 4,
    question: "The book _____ by millions of people.",
    options: ["reads", "is read", "was reading", "has reading"],
    correctAnswer: 1,
    explanation: "这里需要被动语态，因为书是'被读'的。一般现在时的被动语态结构是 is/am/are + 过去分词。",
    topic: "被动语态"
  },
  {
    id: 5,
    question: "She asked me _____ I had seen her keys.",
    options: ["that", "if", "what", "which"],
    correctAnswer: 1,
    explanation: "在间接疑问句中，当原问句是一般疑问句时，用if或whether引导。",
    topic: "间接引语"
  }
];

const grammarTopics = [
  { name: "时态", description: "掌握各种时态的用法", icon: "⏰" },
  { name: "语态", description: "主动语态和被动语态", icon: "🔄" },
  { name: "虚拟语气", description: "表达假设和愿望", icon: "💭" },
  { name: "从句", description: "各种从句的运用", icon: "🔗" },
  { name: "非谓语动词", description: "不定式、动名词、分词", icon: "📝" },
  { name: "介词", description: "常用介词的用法", icon: "➡️" }
];

export function Grammar() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  const question = grammarQuestions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    if (isCorrect && !answeredQuestions.has(currentQuestion)) {
      setScore(score + 1);
      setAnsweredQuestions(new Set(answeredQuestions).add(currentQuestion));
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    if (currentQuestion < grammarQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentQuestion(0);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Set());
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          语法练习
        </h1>
        <p className="text-gray-600">系统学习英语语法，配有详细解释</p>
      </div>

      {/* Score Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-none">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">当前得分</p>
              <p className="text-3xl font-bold text-purple-600">
                {score} / {grammarQuestions.length}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">正确率</p>
              <p className="text-3xl font-bold text-pink-600">
                {answeredQuestions.size > 0 ? Math.round((score / answeredQuestions.size) * 100) : 0}%
              </p>
            </div>
            <Button variant="outline" onClick={handleReset}>
              重新开始
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary">{question.topic}</Badge>
            <span className="text-sm text-gray-500">
              题目 {currentQuestion + 1} / {grammarQuestions.length}
            </span>
          </div>
          <CardTitle className="text-2xl">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => {
              setSelectedAnswer(parseInt(value));
              setShowResult(false);
            }}
            disabled={showResult}
          >
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                    showResult
                      ? index === question.correctAnswer
                        ? "border-green-500 bg-green-50"
                        : index === selectedAnswer
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                      : selectedAnswer === index
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
                  }`}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer font-medium"
                  >
                    {option}
                  </Label>
                  {showResult && index === question.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                  {showResult && index === selectedAnswer && index !== question.correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              ))}
            </div>
          </RadioGroup>

          {showResult && (
            <Alert className={isCorrect ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}>
              <Lightbulb className={`h-4 w-4 ${isCorrect ? "text-green-600" : "text-blue-600"}`} />
              <AlertDescription className="ml-2">
                <p className="font-semibold mb-2">
                  {isCorrect ? "✅ 回答正确！" : "💡 解析"}
                </p>
                <p className="text-gray-700">{question.explanation}</p>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            {!showResult ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                提交答案
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                下一题 →
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grammar Topics */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <h2 className="text-2xl font-semibold">语法知识点</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {grammarTopics.map((topic, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{topic.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{topic.name}</CardTitle>
                    <CardDescription className="text-sm">{topic.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
