import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Square, Pause, Play } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
}

export const VoiceRecorder = ({ onRecordingComplete }: VoiceRecorderProps) => {
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
    onRecordingComplete(audioBlob, recordingTime);
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
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
