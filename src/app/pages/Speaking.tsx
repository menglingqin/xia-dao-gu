import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Mic, Volume2, RotateCcw, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

interface Scenario {
  id: number;
  title: string;
  level: string;
  category: string;
  dialogue: {
    role: string;
    text: string;
  }[];
  phrases: string[];
}

const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Self Introduction",
    level: "初级",
    category: "基础会话",
    dialogue: [
      { role: "Instructor", text: "Hello! Can you introduce yourself?" },
      { role: "You", text: "Hi, my name is [Your Name]. I'm from [Your City]. I'm learning English because I want to communicate with people from around the world." },
      { role: "Instructor", text: "That's great! What are your hobbies?" },
      { role: "You", text: "I enjoy reading books and watching movies. In my free time, I also like playing sports." }
    ],
    phrases: [
      "My name is...",
      "I'm from...",
      "I'm interested in...",
      "In my free time, I...",
      "Nice to meet you"
    ]
  },
  {
    id: 2,
    title: "Ordering Food at a Restaurant",
    level: "初级",
    category: "日常生活",
    dialogue: [
      { role: "Waiter", text: "Good evening! Welcome to our restaurant. Are you ready to order?" },
      { role: "You", text: "Yes, I'd like to start with a Caesar salad, please." },
      { role: "Waiter", text: "Excellent choice. And for your main course?" },
      { role: "You", text: "I'll have the grilled salmon with vegetables." },
      { role: "Waiter", text: "How would you like your salmon cooked?" },
      { role: "You", text: "Medium, please. And could I have water to drink?" },
      { role: "Waiter", text: "Of course. I'll bring that right out." }
    ],
    phrases: [
      "I'd like to order...",
      "Could I have...?",
      "I'll have the...",
      "Medium/Well-done/Rare",
      "Could you bring me...?"
    ]
  },
  {
    id: 3,
    title: "Job Interview",
    level: "中级",
    category: "职场英语",
    dialogue: [
      { role: "Interviewer", text: "Thank you for coming today. Can you tell me about your work experience?" },
      { role: "You", text: "I have three years of experience in digital marketing. In my previous role, I managed social media campaigns and increased engagement by 40%." },
      { role: "Interviewer", text: "That's impressive. What are your strengths?" },
      { role: "You", text: "I'm a creative problem-solver and work well under pressure. I'm also excellent at collaborating with team members." },
      { role: "Interviewer", text: "Why do you want to work for our company?" },
      { role: "You", text: "I admire your company's innovative approach and commitment to sustainability. I believe my skills align well with your mission." }
    ],
    phrases: [
      "I have experience in...",
      "My strengths include...",
      "I'm proficient in...",
      "I'm passionate about...",
      "I believe I would be a good fit because..."
    ]
  },
  {
    id: 4,
    title: "Making Travel Plans",
    level: "中级",
    category: "旅游",
    dialogue: [
      { role: "Travel Agent", text: "How can I help you today?" },
      { role: "You", text: "I'd like to book a trip to Paris for two weeks in July." },
      { role: "Travel Agent", text: "Wonderful! Do you have any preferences for accommodation?" },
      { role: "You", text: "I'd prefer a hotel in the city center, close to major attractions." },
      { role: "Travel Agent", text: "I can arrange that. Would you like me to book any tours or activities?" },
      { role: "You", text: "Yes, I'm interested in a museum tour and a Seine river cruise." }
    ],
    phrases: [
      "I'd like to book...",
      "I'm planning to visit...",
      "What would you recommend?",
      "How much does it cost?",
      "I'm interested in..."
    ]
  }
];

const pronunciationExercises = [
  { id: 1, word: "Comfortable", phonetic: "/ˈkʌmftəbl/", tip: "注意'm'和'f'的发音" },
  { id: 2, word: "Particularly", phonetic: "/pərˈtɪkjələrli/", tip: "注意重音在第二音节" },
  { id: 3, word: "Vocabulary", phonetic: "/vəˈkæbjəleri/", tip: "注意'v'和'b'的发音" },
  { id: 4, word: "Restaurant", phonetic: "/ˈrestərɑːnt/", tip: "美式发音最后是'nt'" },
  { id: 5, word: "Situation", phonetic: "/ˌsɪtʃuˈeɪʃn/", tip: "注意'tu'发/tʃu/音" }
];

export function Speaking() {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [completedPhrases, setCompletedPhrases] = useState<Set<number>>(new Set());

  const scenario = scenarios[selectedScenario];

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Simulate recording for 2 seconds
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
      }, 2000);
    }
  };

  const markPhraseComplete = (index: number) => {
    const newCompleted = new Set(completedPhrases);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedPhrases(newCompleted);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
          口语训练
        </h1>
        <p className="text-gray-600">练习发音和日常对话</p>
      </div>

      <Tabs defaultValue="scenarios" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scenarios">对话场景</TabsTrigger>
          <TabsTrigger value="pronunciation">发音练习</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-6">
          {/* Scenario Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {scenarios.map((s, index) => (
              <Button
                key={s.id}
                variant={selectedScenario === index ? "default" : "outline"}
                className={`h-auto flex-col gap-1 py-3 ${
                  selectedScenario === index
                    ? "bg-gradient-to-r from-red-600 to-pink-600"
                    : ""
                }`}
                onClick={() => setSelectedScenario(index)}
              >
                <span className="font-semibold">{s.title}</span>
                <span className="text-xs opacity-80">{s.category}</span>
              </Button>
            ))}
          </div>

          {/* Scenario Info */}
          <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{scenario.title}</CardTitle>
                  <CardDescription className="text-base">{scenario.category}</CardDescription>
                </div>
                <Badge variant={scenario.level === "高级" ? "destructive" : "secondary"}>
                  {scenario.level}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Dialogue */}
          <Card>
            <CardHeader>
              <CardTitle>对话练习</CardTitle>
              <CardDescription>
                点击 <Volume2 className="w-4 h-4 inline" /> 收听示范，点击 <Mic className="w-4 h-4 inline" /> 开始录音
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {scenario.dialogue.map((line, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    line.role === "You"
                      ? "bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={line.role === "You" ? "default" : "secondary"}>
                          {line.role}
                        </Badge>
                      </div>
                      <p className="text-gray-900 leading-relaxed">{line.text}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => speak(line.text)}
                        className="rounded-full hover:bg-blue-100"
                      >
                        <Volume2 className="w-4 h-4 text-blue-600" />
                      </Button>
                      {line.role === "You" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleRecording}
                          className={`rounded-full ${
                            isRecording
                              ? "bg-red-100 animate-pulse"
                              : "hover:bg-red-100"
                          }`}
                        >
                          <Mic className={`w-4 h-4 ${isRecording ? "text-red-600" : "text-red-500"}`} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Useful Phrases */}
          <Card>
            <CardHeader>
              <CardTitle>常用短语</CardTitle>
              <CardDescription>练习这些短语以提高流利度</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {scenario.phrases.map((phrase, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border-2 border-gray-200 hover:border-red-300 transition-all group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => markPhraseComplete(index)}
                      >
                        <CheckCircle
                          className={`w-5 h-5 transition-colors ${
                            completedPhrases.has(index)
                              ? "text-green-600 fill-green-600"
                              : "text-gray-300"
                          }`}
                        />
                      </Button>
                      <span className="font-medium text-gray-900">{phrase}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => speak(phrase)}
                      className="rounded-full hover:bg-blue-100"
                    >
                      <Volume2 className="w-4 h-4 text-blue-600" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-600 text-center">
                已完成 {completedPhrases.size} / {scenario.phrases.length} 个短语
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pronunciation" className="space-y-6">
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-none">
            <CardHeader>
              <CardTitle>发音练习</CardTitle>
              <CardDescription>
                练习常见的发音难点，提高口语准确度
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {pronunciationExercises.map((exercise) => (
              <Card key={exercise.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-3xl font-bold text-gray-900">{exercise.word}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => speak(exercise.word)}
                          className="rounded-full hover:bg-blue-100"
                        >
                          <Volume2 className="w-5 h-5 text-blue-600" />
                        </Button>
                      </div>
                      <p className="text-gray-600 text-lg">{exercise.phonetic}</p>
                      <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded">
                        💡 {exercise.tip}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleRecording}
                      className={`h-16 w-16 rounded-full ${
                        isRecording ? "bg-red-100 border-red-300 animate-pulse" : ""
                      }`}
                    >
                      <Mic className={`w-6 h-6 ${isRecording ? "text-red-600" : "text-red-500"}`} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tips Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none">
            <CardHeader>
              <CardTitle className="text-lg">🎯 发音技巧</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>注意元音和辅音的准确发音</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>掌握单词的重音位置</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>练习连读和语调变化</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>多听多模仿母语者的发音</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>录音对比找出差距</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
