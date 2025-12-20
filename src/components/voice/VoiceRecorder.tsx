import { useState } from "react";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Square, Pause, Play, Globe } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "or", name: "Odia" },
  { code: "bn", name: "Bengali" },
  { code: "te", name: "Telugu" },
  { code: "ta", name: "Tamil" },
  { code: "mr", name: "Marathi" },
  { code: "gu", name: "Gujarati" },
  { code: "kn", name: "Kannada" },
  { code: "ml", name: "Malayalam" },
  { code: "pa", name: "Punjabi" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "auto", name: "Auto-detect" },
];

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number, language: string) => void;
}

export const VoiceRecorder = ({ onRecordingComplete }: VoiceRecorderProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  
  const {
    isRecording,
    isPaused,
    recordingTime,
    error,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    formatTime,
  } = useVoiceRecorder();

  const handleStop = async () => {
    const audioBlob = await stopRecording();
    onRecordingComplete(audioBlob, recordingTime, selectedLanguage);
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Language Selection */}
        {!isRecording && (
          <div className="space-y-2">
            <Label htmlFor="language" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Recording Language
            </Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger id="language" className="w-full bg-background">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-popover border shadow-lg z-50">
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the language you'll be speaking for better transcription accuracy
            </p>
          </div>
        )}

        {/* Recording Visualization */}
        <div className="flex flex-col items-center gap-4">
          <div
            className={`relative flex items-center justify-center w-32 h-32 rounded-full transition-all ${
              isRecording && !isPaused
                ? "bg-destructive/20 animate-pulse"
                : "bg-primary/20"
            }`}
          >
            <Mic
              className={`h-16 w-16 ${
                isRecording ? "text-destructive" : "text-primary"
              }`}
            />
          </div>

          {/* Timer */}
          <div className="text-center">
            <p className="text-4xl font-mono font-bold">
              {formatTime(recordingTime)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {isRecording
                ? isPaused
                  ? "Paused"
                  : "Recording..."
                : "Ready to record"}
            </p>
          </div>
        </div>

        {/* Waveform Visualization */}
        {isRecording && !isPaused && (
          <div className="flex items-center justify-center gap-1 h-16">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-primary rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {!isRecording ? (
            <Button
              size="lg"
              onClick={startRecording}
              className="w-full max-w-xs"
            >
              <Mic className="mr-2 h-5 w-5" />
              Start Recording
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={isPaused ? resumeRecording : pauseRecording}
                className="h-12 w-12"
              >
                {isPaused ? (
                  <Play className="h-5 w-5" />
                ) : (
                  <Pause className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={handleStop}
                className="h-12 w-12"
              >
                <Square className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
