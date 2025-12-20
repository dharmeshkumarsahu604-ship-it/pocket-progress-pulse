import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Play, 
  Pause, 
  Trash2, 
  Download, 
  Loader2, 
  RefreshCw, 
  Globe, 
  Pencil, 
  Check, 
  X, 
  Copy, 
  FileText 
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  or: "Odia",
  bn: "Bengali",
  te: "Telugu",
  ta: "Tamil",
  mr: "Marathi",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  pa: "Punjabi",
  es: "Spanish",
  fr: "French",
  de: "German",
  auto: "Auto",
};

interface VoiceNoteCardProps {
  id: string;
  name: string;
  date: Date;
  duration: number;
  audioUrl: string;
  transcript?: string;
  language?: string;
  onDelete: (id: string) => void;
  onUpdateTitle?: (id: string, newTitle: string) => void;
  onRetryTranscription?: (id: string) => void;
  isRetrying?: boolean;
}

export const VoiceNoteCard = ({
  id,
  name,
  date,
  duration,
  audioUrl,
  transcript,
  language,
  onDelete,
  onUpdateTitle,
  onRetryTranscription,
  isRetrying,
}: VoiceNoteCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(name);
  const audioRef = useRef<HTMLAudioElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleDownloadAudio = () => {
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `${name}.webm`;
    a.click();
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim() && onUpdateTitle) {
      onUpdateTitle(id, editedTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleCopyTranscript = async () => {
    if (!transcript) return;
    try {
      await navigator.clipboard.writeText(transcript);
      toast.success("Transcript copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy transcript");
    }
  };

  const handleSaveTranscript = () => {
    if (!transcript) return;
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}-transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Transcript saved");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isTranscriptReady = transcript && 
    transcript !== "Transcribing..." && 
    !transcript.toLowerCase().includes("failed") &&
    !transcript.toLowerCase().includes("unavailable") &&
    !transcript.toLowerCase().includes("error");

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <audio ref={audioRef} src={audioUrl} />

        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-8 text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={handleSaveTitle}
                >
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={handleCancelEdit}
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold truncate">{name}</h3>
                {onUpdateTitle && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                )}
                {language && (
                  <Badge variant="secondary" className="text-xs shrink-0">
                    <Globe className="h-3 w-3 mr-1" />
                    {LANGUAGE_NAMES[language] || language}
                  </Badge>
                )}
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(date, { addSuffix: true })}
            </p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={handleDownloadAudio} title="Download audio">
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(id)}
              title="Delete recording"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={togglePlayPause}
              className="shrink-0"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <div className="flex-1 space-y-1">
              <Slider
                value={[currentTime]}
                max={duration}
                step={0.1}
                onValueChange={handleSeek}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>

        {transcript && (
          <div className="p-3 bg-muted rounded-lg space-y-2">
            {transcript === "Transcribing..." || isRetrying ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Transcribing audio...</span>
              </div>
            ) : transcript.toLowerCase().includes("failed") || 
               transcript.toLowerCase().includes("unavailable") ||
               transcript.toLowerCase().includes("error") ? (
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-destructive">{transcript}</p>
                {onRetryTranscription && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRetryTranscription(id)}
                    className="shrink-0"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Retry
                  </Button>
                )}
              </div>
            ) : (
              <>
                <p className="text-sm">{transcript}</p>
                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyTranscript}
                    className="text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveTranscript}
                    className="text-xs"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Save as Text
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
