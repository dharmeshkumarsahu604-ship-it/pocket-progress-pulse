import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRandomQuestions, getQuestionsByCourse, getAllCourses, QuizQuestion, Difficulty, getDifficultyCounts } from "@/data/geologyQuizQuestions";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Brain, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  RefreshCw, 
  ArrowRight,
  Clock,
  BookOpen,
  Sparkles,
  Target,
  Filter,
  Shuffle,
  ChevronRight,
  Zap,
  Flame,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type QuizState = "start" | "selectCourse" | "selectDifficulty" | "playing" | "result";
type QuizMode = "random" | "course";

interface QuizResult {
  score: number;
  totalQuestions: number;
  answers: { question: QuizQuestion; selectedAnswer: number; isCorrect: boolean }[];
  timeTaken: number;
}

// Course info with question counts
const getCourseInfo = (difficulty?: Difficulty) => {
  const courses = getAllCourses();
  return courses.map(course => ({
    name: course,
    questionCount: getQuestionsByCourse(course, difficulty).length
  })).sort((a, b) => a.name.localeCompare(b.name));
};

const difficultyConfig = {
  easy: { label: "Easy", icon: Star, color: "bg-green-500", description: "Basic concepts & definitions" },
  medium: { label: "Medium", icon: Zap, color: "bg-yellow-500", description: "Application & understanding" },
  hard: { label: "Hard", icon: Flame, color: "bg-red-500", description: "Advanced & analytical" }
};

export default function Quiz() {
  const { user } = useAuth();
  const [quizState, setQuizState] = useState<QuizState>("start");
  const [quizMode, setQuizMode] = useState<QuizMode>("random");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | undefined>(undefined);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<QuizResult["answers"]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [userName, setUserName] = useState<string>("Geologist");

  const courseInfo = getCourseInfo(selectedDifficulty);
  const difficultyCounts = getDifficultyCounts();

  // Fetch user profile name
  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        
        if (profile?.full_name) {
          setUserName(profile.full_name.split(" ")[0]);
        }
      }
    };
    fetchUserName();
  }, [user]);

  const startRandomQuiz = (difficulty?: Difficulty) => {
    setQuizMode("random");
    setSelectedDifficulty(difficulty);
    const newQuestions = getRandomQuestions(10, difficulty);
    launchQuiz(newQuestions);
  };

  const startCourseQuiz = (course: string) => {
    setQuizMode("course");
    setSelectedCourse(course);
    const courseQuestions = getQuestionsByCourse(course, selectedDifficulty);
    const shuffled = [...courseQuestions].sort(() => Math.random() - 0.5);
    const quizQuestions = shuffled.slice(0, Math.min(10, shuffled.length));
    launchQuiz(quizQuestions);
  };

  const launchQuiz = (quizQuestions: QuizQuestion[]) => {
    if (quizQuestions.length === 0) {
      toast.error("No questions available for this selection");
      return;
    }
    setQuestions(quizQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setScore(0);
    setAnswers([]);
    setStartTime(Date.now());
    setQuizState("playing");
    toast.info("Quiz started! Good luck! 🎯");
  };

  const goToCoursesSelection = (difficulty?: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setQuizState("selectCourse");
  };

  const goToDifficultySelection = () => {
    setQuizState("selectDifficulty");
  };

  const goBackToStart = () => {
    setQuizState("start");
    setSelectedDifficulty(undefined);
  };

  const handleSelectAnswer = (answerIndex: number) => {
    if (showAnswer) return; // Prevent changing answer after submission
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer");
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setAnswers(prev => [...prev, {
      question: currentQuestion,
      selectedAnswer,
      isCorrect
    }]);

    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      // Quiz completed
      setQuizState("result");
    }
  };

  const getScoreMessage = (score: number): { message: string; emoji: string; color: string } => {
    if (score >= 7) {
      return {
        message: `Excellent ${userName}! 🌟`,
        emoji: "🏆",
        color: "text-green-600 dark:text-green-400"
      };
    } else if (score >= 4) {
      return {
        message: `Good effort ${userName}!`,
        emoji: "👍",
        color: "text-yellow-600 dark:text-yellow-400"
      };
    } else {
      return {
        message: `Keep learning ${userName}!`,
        emoji: "📚",
        color: "text-orange-600 dark:text-orange-400"
      };
    }
  };

  const timeTaken = quizState === "result" ? Math.round((Date.now() - startTime) / 1000) : 0;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Start Screen */}
        {quizState === "start" && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Brain className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Geology Quiz</h1>
              <p className="text-muted-foreground">
                Test your knowledge of geology! Choose your quiz mode below.
              </p>
            </div>

            {/* Quiz Mode Selection */}
            <div className="grid gap-4">
              <Card 
                className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-md"
                onClick={startRandomQuiz}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Shuffle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Random Quiz</h3>
                      <p className="text-sm text-muted-foreground">
                        10 questions from all courses - unique every time!
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-md"
                onClick={goToCoursesSelection}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                      <Filter className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Topic-Wise Quiz</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose a specific course to practice
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Scoring Guide</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500">7-10</Badge>
                    <span>Excellent! You're a geology expert!</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-500">4-6</Badge>
                    <span>Good! Keep up the great work!</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-500">0-3</Badge>
                    <span>Keep studying! You'll get there!</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Course Selection Screen */}
        {quizState === "selectCourse" && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={goBackToStart}>
                <ArrowRight className="w-5 h-5 rotate-180" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Select a Course</h1>
                <p className="text-muted-foreground text-sm">
                  Choose a topic to practice ({courseInfo.length} courses available)
                </p>
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-2 pr-4">
                {courseInfo.map((course) => (
                  <Card 
                    key={course.name}
                    className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-sm"
                    onClick={() => startCourseQuiz(course.name)}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{course.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {course.questionCount} questions available
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {Math.min(10, course.questionCount)} Q
                          </Badge>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Playing Screen */}
        {quizState === "playing" && currentQuestion && (
          <div className="space-y-6">
            {/* Progress Header */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span className="text-muted-foreground">Score: {score}/{currentQuestionIndex + (showAnswer ? 1 : 0)}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="secondary" className="mb-2">
                    {currentQuestion.course}
                  </Badge>
                  <Badge variant="outline">
                    {currentQuestion.topic}
                  </Badge>
                </div>
                <CardTitle className="text-xl leading-relaxed">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQuestion.correctAnswer;
                  const showCorrect = showAnswer && isCorrect;
                  const showWrong = showAnswer && isSelected && !isCorrect;

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectAnswer(index)}
                      disabled={showAnswer}
                      className={cn(
                        "w-full p-4 rounded-lg border-2 text-left transition-all",
                        "flex items-center gap-3",
                        !showAnswer && isSelected && "border-primary bg-primary/5",
                        !showAnswer && !isSelected && "border-border hover:border-primary/50 hover:bg-accent",
                        showCorrect && "border-green-500 bg-green-50 dark:bg-green-950",
                        showWrong && "border-red-500 bg-red-50 dark:bg-red-950",
                        showAnswer && !showCorrect && !showWrong && "opacity-50"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm",
                        !showAnswer && isSelected && "bg-primary text-primary-foreground",
                        !showAnswer && !isSelected && "bg-muted",
                        showCorrect && "bg-green-500 text-white",
                        showWrong && "bg-red-500 text-white"
                      )}>
                        {showCorrect ? <CheckCircle2 className="w-5 h-5" /> : 
                         showWrong ? <XCircle className="w-5 h-5" /> : 
                         String.fromCharCode(65 + index)}
                      </div>
                      <span className="flex-1">{option}</span>
                    </button>
                  );
                })}

                {/* Explanation */}
                {showAnswer && currentQuestion.explanation && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm">
                      <span className="font-semibold">💡 Explanation: </span>
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!showAnswer ? (
                <Button 
                  onClick={handleSubmitAnswer} 
                  disabled={selectedAnswer === null}
                  className="flex-1"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} className="flex-1">
                  {currentQuestionIndex < questions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      See Results
                      <Trophy className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Result Screen */}
        {quizState === "result" && (
          <div className="space-y-6">
            {/* Score Header */}
            <div className="text-center space-y-4">
              <div className={cn(
                "w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl",
                score >= 7 ? "bg-green-100 dark:bg-green-900" :
                score >= 4 ? "bg-yellow-100 dark:bg-yellow-900" :
                "bg-orange-100 dark:bg-orange-900"
              )}>
                {getScoreMessage(score).emoji}
              </div>
              <div>
                <h1 className={cn("text-3xl font-bold", getScoreMessage(score).color)}>
                  {getScoreMessage(score).message}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {score >= 7 ? "You have an outstanding grasp of geology!" :
                   score >= 4 ? "You're making great progress in your geology studies!" :
                   "Don't give up! Every geologist starts somewhere. Keep studying!"}
                </p>
              </div>
            </div>

            {/* Score Card */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary">
                    {score}/{questions.length}
                  </div>
                  <p className="text-muted-foreground mt-2">Correct Answers</p>
                  <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Completed in {Math.floor(timeTaken / 60)}:{String(timeTaken % 60).padStart(2, '0')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Answers Review */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review Your Answers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
                {answers.map((answer, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "p-4 rounded-lg border",
                      answer.isCorrect ? "border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800" :
                      "border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                        answer.isCorrect ? "bg-green-500" : "bg-red-500"
                      )}>
                        {answer.isCorrect ? 
                          <CheckCircle2 className="w-4 h-4 text-white" /> : 
                          <XCircle className="w-4 h-4 text-white" />
                        }
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm mb-1">Q{index + 1}: {answer.question.question}</p>
                        <p className="text-sm text-muted-foreground">
                          Your answer: <span className={answer.isCorrect ? "text-green-600" : "text-red-600"}>
                            {answer.question.options[answer.selectedAnswer]}
                          </span>
                        </p>
                        {!answer.isCorrect && (
                          <p className="text-sm text-green-600 dark:text-green-400">
                            Correct: {answer.question.options[answer.question.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={goBackToStart} variant="outline" className="flex-1">
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Menu
              </Button>
              <Button onClick={() => quizMode === "course" && selectedCourse ? startCourseQuiz(selectedCourse) : startRandomQuiz()} className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
