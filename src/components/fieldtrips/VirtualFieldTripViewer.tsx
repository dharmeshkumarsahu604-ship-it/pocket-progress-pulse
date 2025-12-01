import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Award,
} from "lucide-react";
import { QuizOverlay } from "./QuizOverlay";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Waypoint {
  id: string;
  sequence_number: number;
  camera_position: { lon: number; lat: number };
  narration_text: string;
  narration_audio_url: string | null;
  duration_seconds: number;
  auto_advance: boolean;
}

interface Quiz {
  id: string;
  waypoint_id: string | null;
  question: string;
  question_type: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string | null;
  points: number;
}

interface FieldTrip {
  id: string;
  title: string;
  description: string;
  panorama_url: string;
  duration_minutes: number;
}

interface VirtualFieldTripViewerProps {
  fieldTrip: FieldTrip;
  waypoints: Waypoint[];
  quizzes: Quiz[];
}

export function VirtualFieldTripViewer({
  fieldTrip,
  waypoints,
  quizzes,
}: VirtualFieldTripViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    sphere: THREE.Mesh;
  } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);

  const currentWaypoint = waypoints[currentWaypointIndex];
  const progress = ((currentWaypointIndex + 1) / waypoints.length) * 100;

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 0.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);

    // Create sphere for panorama
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(fieldTrip.panorama_url);
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    sceneRef.current = { scene, camera, renderer, sphere };

    let lon = currentWaypoint.camera_position.lon;
    let lat = currentWaypoint.camera_position.lat;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon);

      camera.position.x = 100 * Math.sin(phi) * Math.cos(theta);
      camera.position.y = 100 * Math.cos(phi);
      camera.position.z = 100 * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // Timer for time tracking
    const timer = window.setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    timerRef.current = timer;

    // Calculate total points
    const total = quizzes.reduce((sum, q) => sum + q.points, 0);
    setTotalPoints(total);

    return () => {
      containerRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [fieldTrip.panorama_url]);

  useEffect(() => {
    // Smooth camera transition to new waypoint
    if (!sceneRef.current || !currentWaypoint) return;

    const targetLon = currentWaypoint.camera_position.lon;
    const targetLat = currentWaypoint.camera_position.lat;

    // Animate camera movement (simplified)
    // In production, use GSAP or Three.js animation mixer
    console.log(`Moving to waypoint ${currentWaypointIndex + 1}:`, {
      lon: targetLon,
      lat: targetLat,
    });

    // Load and play narration
    loadNarration();

    // Check for quiz at this waypoint
    const quiz = quizzes.find((q) => q.waypoint_id === currentWaypoint.id);
    if (quiz) {
      setTimeout(() => {
        setCurrentQuiz(quiz);
        setShowQuiz(true);
        setIsPlaying(false);
      }, currentWaypoint.duration_seconds * 500);
    }
  }, [currentWaypointIndex]);

  const loadNarration = async () => {
    if (!currentWaypoint.narration_text) return;

    try {
      // Generate narration audio on-the-fly
      const { data, error } = await supabase.functions.invoke("generate-narration", {
        body: { text: currentWaypoint.narration_text, voice: "alloy" },
      });

      if (error) throw error;

      // Create audio from response
      const audioBlob = new Blob([data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        if (isPlaying && !isMuted) {
          audioRef.current.play();
        }
      }
    } catch (error) {
      console.error("Error loading narration:", error);
      toast.error("Failed to load narration");
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (currentWaypointIndex < waypoints.length - 1) {
      setCurrentWaypointIndex(currentWaypointIndex + 1);
    } else {
      // Field trip completed
      completeFieldTrip();
    }
  };

  const handleQuizSubmit = async (answer: string, isCorrect: boolean) => {
    if (!currentQuiz) return;

    const pointsEarned = isCorrect ? currentQuiz.points : 0;
    setScore(score + pointsEarned);

    // Save quiz submission
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("quiz_submissions").insert({
          user_id: user.id,
          quiz_id: currentQuiz.id,
          field_trip_id: fieldTrip.id,
          answer,
          is_correct: isCorrect,
          points_earned: pointsEarned,
        });
      }
    } catch (error) {
      console.error("Error saving quiz submission:", error);
    }

    setShowQuiz(false);
    setCurrentQuiz(null);
    if (currentWaypoint.auto_advance) {
      setTimeout(handleNext, 1000);
    } else {
      setIsPlaying(true);
    }
  };

  const completeFieldTrip = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("field_trip_progress").upsert({
          user_id: user.id,
          field_trip_id: fieldTrip.id,
          completed: true,
          score,
          total_possible_points: totalPoints,
          time_spent_seconds: timeSpent,
          completed_at: new Date().toISOString(),
        });

        toast.success(`Field trip completed! Score: ${score}/${totalPoints}`);
      }
    } catch (error) {
      console.error("Error completing field trip:", error);
      toast.error("Failed to save progress");
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle>{fieldTrip.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Waypoint {currentWaypointIndex + 1} of {waypoints.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <Badge variant="secondary">
                {score}/{totalPoints} pts
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          <div
            ref={containerRef}
            className="relative w-full h-[500px] bg-muted rounded-lg overflow-hidden"
          />

          <div className="mt-4 space-y-4">
            <Card className="bg-background/95 backdrop-blur">
              <CardContent className="pt-6">
                <p className="text-sm leading-relaxed">
                  {currentWaypoint.narration_text}
                </p>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>

              <div className="flex gap-2">
                <Button onClick={handlePlayPause} size="lg">
                  {isPlaying ? (
                    <Pause className="h-5 w-5 mr-2" />
                  ) : (
                    <Play className="h-5 w-5 mr-2" />
                  )}
                  {isPlaying ? "Pause" : "Play"}
                </Button>

                <Button onClick={handleNext} variant="outline" size="lg">
                  <SkipForward className="h-5 w-5 mr-2" />
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showQuiz && currentQuiz && (
        <QuizOverlay quiz={currentQuiz} onSubmit={handleQuizSubmit} />
      )}

      <audio
        ref={audioRef}
        muted={isMuted}
        onEnded={() => {
          setIsPlaying(false);
          if (currentWaypoint.auto_advance && !showQuiz) {
            handleNext();
          }
        }}
      />
    </div>
  );
}
