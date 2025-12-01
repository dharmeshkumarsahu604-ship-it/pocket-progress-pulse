import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

interface Quiz {
  id: string;
  question: string;
  question_type: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string | null;
  points: number;
}

interface QuizOverlayProps {
  quiz: Quiz;
  onSubmit: (answer: string, isCorrect: boolean) => void;
}

export function QuizOverlay({ quiz, onSubmit }: QuizOverlayProps) {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    const correct = selectedAnswer.toLowerCase().trim() === quiz.correct_answer.toLowerCase().trim();
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleContinue = () => {
    onSubmit(selectedAnswer, isCorrect);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle>Knowledge Check</CardTitle>
              <CardDescription>Test your understanding</CardDescription>
            </div>
            <Badge variant="secondary">{quiz.points} points</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-4">{quiz.question}</h3>

            {!showResult ? (
              <>
                {quiz.question_type === "multiple_choice" && quiz.options && (
                  <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                    <div className="space-y-3">
                      {quiz.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted cursor-pointer transition-colors"
                        >
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <Label
                            htmlFor={`option-${index}`}
                            className="flex-1 cursor-pointer"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {quiz.question_type === "true_false" && (
                  <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                    <div className="space-y-3">
                      {["True", "False"].map((option) => (
                        <div
                          key={option}
                          className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted cursor-pointer transition-colors"
                        >
                          <RadioGroupItem value={option} id={option} />
                          <Label htmlFor={option} className="flex-1 cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {quiz.question_type === "short_answer" && (
                  <Input
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    placeholder="Type your answer..."
                    className="text-lg"
                  />
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  className="w-full mt-6"
                  size="lg"
                >
                  Submit Answer
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-lg flex items-center gap-3 ${
                    isCorrect
                      ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-green-900 dark:text-green-100">
                          Correct! +{quiz.points} points
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Great job! Your answer was correct.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-8 w-8 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-red-900 dark:text-red-100">
                          Incorrect
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          The correct answer was: <strong>{quiz.correct_answer}</strong>
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {quiz.explanation && (
                  <Card className="bg-muted">
                    <CardContent className="pt-4">
                      <p className="text-sm leading-relaxed">{quiz.explanation}</p>
                    </CardContent>
                  </Card>
                )}

                <Button onClick={handleContinue} className="w-full" size="lg">
                  Continue Field Trip
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
