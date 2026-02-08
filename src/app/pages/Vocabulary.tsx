import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Volume2, Star, Check, X, RotateCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

interface Word {
  id: number;
  word: string;
  phonetic: string;
  translation: string;
  example: string;
  exampleTranslation: string;
  level: string;
  mastered: boolean;
}

const vocabularyData: Word[] = [
  {
    id: 1,
    word: "accomplish",
    phonetic: "/əˈkʌmplɪʃ/",
    translation: "完成，实现",
    example: "She accomplished her goal of learning 50 new words this week.",
    exampleTranslation: "她完成了本周学习50个新单词的目标。",
    level: "中级",
    mastered: false
  },
  {
    id: 2,
    word: "determine",
    phonetic: "/dɪˈtɜːmɪn/",
    translation: "决定，确定",
    example: "Your attitude will determine your success in learning English.",
    exampleTranslation: "你的态度将决定你学习英语的成功。",
    level: "中级",
    mastered: false
  },
  {
    id: 3,
    word: "significant",
    phonetic: "/sɪɡˈnɪfɪkənt/",
    translation: "重要的，显著的",
    example: "Practice makes a significant difference in language learning.",
    exampleTranslation: "练习在语言学习中起着重要作用。",
    level: "中级",
    mastered: false
  },
  {
    id: 4,
    word: "perspective",
    phonetic: "/pərˈspektɪv/",
    translation: "观点，视角",
    example: "Learning a new language gives you a different perspective on the world.",
    exampleTranslation: "学习一门新语言让你对世界有不同的视角。",
    level: "高级",
    mastered: false
  },
  {
    id: 5,
    word: "efficient",
    phonetic: "/ɪˈfɪʃnt/",
    translation: "高效的",
    example: "Using flashcards is an efficient way to memorize vocabulary.",
    exampleTranslation: "使用单词卡是记忆词汇的高效方法。",
    level: "中级",
    mastered: false
  }
];

export function Vocabulary() {
  const [words, setWords] = useState<Word[]>(vocabularyData);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  const currentWord = words[currentCardIndex];
  const masteredCount = words.filter(w => w.mastered).length;
  const progressPercentage = (masteredCount / words.length) * 100;

  const handleKnow = () => {
    const updatedWords = [...words];
    updatedWords[currentCardIndex].mastered = true;
    setWords(updatedWords);
    nextCard();
  };

  const handleDontKnow = () => {
    nextCard();
  };

  const nextCard = () => {
    setShowTranslation(false);
    if (currentCardIndex < words.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const resetProgress = () => {
    setWords(words.map(w => ({ ...w, mastered: false })));
    setCurrentCardIndex(0);
    setShowTranslation(false);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          词汇学习
        </h1>
        <p className="text-gray-600">通过卡片记忆法快速掌握英语词汇</p>
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>学习进度</span>
            <Button
              variant="outline"
              size="sm"
              onClick={resetProgress}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              重置
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>已掌握 {masteredCount} / {words.length} 个单词</span>
              <span className="font-semibold">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{words.length}</div>
              <div className="text-sm text-gray-600">总词汇</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{masteredCount}</div>
              <div className="text-sm text-gray-600">已掌握</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{words.length - masteredCount}</div>
              <div className="text-sm text-gray-600">待学习</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="flashcard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="flashcard">闪卡模式</TabsTrigger>
          <TabsTrigger value="list">列表模式</TabsTrigger>
        </TabsList>

        <TabsContent value="flashcard" className="space-y-6">
          {/* Flashcard */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-4 right-4 z-10">
              <Badge variant={currentWord.level === "高级" ? "destructive" : "secondary"}>
                {currentWord.level}
              </Badge>
            </div>
            <CardHeader className="pb-8 pt-12">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <h2 className="text-5xl font-bold text-gray-900">{currentWord.word}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => speak(currentWord.word)}
                    className="rounded-full hover:bg-blue-100"
                  >
                    <Volume2 className="w-5 h-5 text-blue-600" />
                  </Button>
                </div>
                <p className="text-gray-500 text-lg">{currentWord.phonetic}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pb-8">
              <div 
                className="min-h-[200px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 cursor-pointer transition-all hover:shadow-md"
                onClick={() => setShowTranslation(!showTranslation)}
              >
                {!showTranslation ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-center">点击查看释义和例句</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">释义</p>
                      <p className="text-xl font-semibold text-gray-900">{currentWord.translation}</p>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-600 mb-2">例句</p>
                      <p className="text-gray-900 mb-2 italic">"{currentWord.example}"</p>
                      <p className="text-gray-600">{currentWord.exampleTranslation}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {currentCardIndex + 1} / {words.length}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                    onClick={handleDontKnow}
                  >
                    <X className="w-4 h-4" />
                    不认识
                  </Button>
                  <Button
                    className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    onClick={handleKnow}
                  >
                    <Check className="w-4 h-4" />
                    认识
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500">
            提示：点击卡片查看释义，使用下方按钮标记掌握程度
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {words.map((word) => (
            <Card key={word.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-gray-900">{word.word}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => speak(word.word)}
                      >
                        <Volume2 className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Badge variant={word.level === "高级" ? "destructive" : "secondary"}>
                        {word.level}
                      </Badge>
                      {word.mastered && (
                        <Badge variant="default" className="bg-green-600 gap-1">
                          <Star className="w-3 h-3" />
                          已掌握
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-500">{word.phonetic}</p>
                    <p className="text-lg font-semibold text-gray-900">{word.translation}</p>
                    <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                      <p className="text-gray-900 italic">"{word.example}"</p>
                      <p className="text-gray-600 text-sm">{word.exampleTranslation}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
