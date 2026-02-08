import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Play, Pause, RotateCcw, Volume2, CheckCircle2, XCircle } from "lucide-react";
import { Slider } from "../components/ui/slider";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";

interface ListeningExercise {
  id: number;
  title: string;
  level: string;
  type: string;
  transcript: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

const exercises: ListeningExercise[] = [
  {
    id: 1,
    title: "Daily Conversation: At the Coffee Shop",
    level: "初级",
    type: "日常对话",
    transcript: `Customer: Hi, I'd like to order a large cappuccino, please.
Barista: Sure! Would you like that hot or iced?
Customer: Hot, please. And do you have any pastries?
Barista: Yes, we have croissants, muffins, and cookies.
Customer: I'll take a chocolate croissant.
Barista: Great choice! That'll be $8.50. Is this for here or to go?
Customer: To go, please.
Barista: Perfect. Your order will be ready in just a minute.`,
    questions: [
      {
        question: "What drink did the customer order?",
        options: ["Latte", "Cappuccino", "Espresso", "Americano"],
        correctAnswer: 1
      },
      {
        question: "What food did the customer choose?",
        options: ["Muffin", "Cookie", "Chocolate croissant", "Plain croissant"],
        correctAnswer: 2
      },
      {
        question: "How much was the total order?",
        options: ["$6.50", "$7.50", "$8.50", "$9.50"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 2,
    title: "Workplace Discussion: Team Meeting",
    level: "中级",
    type: "职场英语",
    transcript: `Manager: Good morning, everyone. Let's start today's meeting. Sarah, could you update us on the marketing campaign?
Sarah: Of course. We've launched the social media campaign last Monday, and the engagement has been excellent. We've gained 5,000 new followers in just one week.
Manager: That's impressive! What about the budget?
Sarah: We're actually under budget by 15%. We found more cost-effective advertising channels than initially planned.
Manager: Excellent work. Tom, how's the product development going?
Tom: We're on schedule. The beta testing will begin next week, and we expect to launch by the end of the month.`,
    questions: [
      {
        question: "When was the social media campaign launched?",
        options: ["Last Monday", "Last Tuesday", "This Monday", "This Tuesday"],
        correctAnswer: 0
      },
      {
        question: "How many new followers did they gain?",
        options: ["3,000", "4,000", "5,000", "6,000"],
        correctAnswer: 2
      },
      {
        question: "What is Tom's role?",
        options: ["Marketing", "Product development", "Budget planning", "Social media"],
        correctAnswer: 1
      }
    ]
  }
];

export function Listening() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const exercise = exercises[currentExercise];

  // Simulate audio playback
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }
  };

  const handleReset = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleResetAnswers = () => {
    setAnswers({});
    setShowResults(false);
  };

  const calculateScore = () => {
    let correct = 0;
    exercise.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const score = showResults ? calculateScore() : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          听力练习
        </h1>
        <p className="text-gray-600">通过真实场景对话提高听力水平</p>
      </div>

      {/* Exercise Selection */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {exercises.map((ex, index) => (
          <Button
            key={ex.id}
            variant={currentExercise === index ? "default" : "outline"}
            className={`whitespace-nowrap ${
              currentExercise === index
                ? "bg-gradient-to-r from-orange-600 to-red-600"
                : ""
            }`}
            onClick={() => {
              setCurrentExercise(index);
              setProgress(0);
              setIsPlaying(false);
              setShowTranscript(false);
              setAnswers({});
              setShowResults(false);
            }}
          >
            练习 {index + 1}
          </Button>
        ))}
      </div>

      {/* Audio Player Card */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-none shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{exercise.title}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant={exercise.level === "高级" ? "destructive" : "secondary"}>
                  {exercise.level}
                </Badge>
                <Badge variant="outline">{exercise.type}</Badge>
              </div>
            </div>
            <Volume2 className="w-8 h-8 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Audio Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                onClick={handlePlayPause}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </Button>
              <div className="flex-1 space-y-2">
                <Slider
                  value={[progress]}
                  onValueChange={([value]) => setProgress(value)}
                  max={100}
                  step={1}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{Math.floor(progress / 100 * 60)}s</span>
                  <span>60s</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleReset}
                className="rounded-full"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Playback Speed */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">播放速度:</span>
              <div className="flex gap-2">
                {[0.75, 1, 1.25, 1.5].map((speed) => (
                  <Button
                    key={speed}
                    variant={playbackSpeed === speed ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPlaybackSpeed(speed)}
                    className={
                      playbackSpeed === speed
                        ? "bg-gradient-to-r from-orange-600 to-red-600"
                        : ""
                    }
                  >
                    {speed}x
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Transcript Toggle */}
          <div className="pt-4 border-t border-orange-200">
            <Button
              variant="outline"
              onClick={() => setShowTranscript(!showTranscript)}
              className="w-full"
            >
              {showTranscript ? "隐藏" : "显示"}听力原文
            </Button>
            {showTranscript && (
              <div className="mt-4 p-4 bg-white rounded-lg">
                <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {exercise.transcript}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Questions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>听力理解题</span>
            {showResults && (
              <Badge className="bg-orange-600 text-lg px-4 py-1">
                得分: {score} / {exercise.questions.length}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            根据听力内容回答以下问题
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {exercise.questions.map((q, qIndex) => (
            <div key={qIndex} className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center font-semibold text-orange-700">
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
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
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
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                      {showResults && oIndex === answers[qIndex] && oIndex !== q.correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-600" />
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
                disabled={Object.keys(answers).length !== exercise.questions.length}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                提交答案
              </Button>
            ) : (
              <Button
                onClick={handleResetAnswers}
                variant="outline"
                className="flex-1"
              >
                重新作答
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none">
        <CardHeader>
          <CardTitle className="text-lg">💡 听力练习小贴士</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">•</span>
              <span>第一遍听时不要看原文，专注于理解整体意思</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">•</span>
              <span>可以调整播放速度，从慢速开始逐渐提高</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">•</span>
              <span>反复听不理解的部分，然后对照原文学习</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">•</span>
              <span>注意语音语调和连读现象</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
