import { useState, useRef, useEffect, useCallback } from "react";
import { X, Pencil, Type, Circle, Square, ArrowRight, Undo, Trash2, Download, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Tool = "pencil" | "text" | "circle" | "rectangle" | "arrow";

interface Annotation {
  id: string;
  type: Tool;
  color: string;
  startX: number;
  startY: number;
  endX?: number;
  endY?: number;
  text?: string;
  points?: { x: number; y: number }[];
}

interface ImageAnnotatorProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (dataUrl: string) => void;
}

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ffffff", "#000000"];

export function ImageAnnotator({
  src,
  alt,
  isOpen,
  onClose,
  onSave,
}: ImageAnnotatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = useState<Tool>("pencil");
  const [activeColor, setActiveColor] = useState("#ef4444");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState<Annotation | null>(null);
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState<{ x: number; y: number } | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Load image and set canvas size
  useEffect(() => {
    if (!isOpen) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      
      // Calculate canvas size to fit container while maintaining aspect ratio
      const container = containerRef.current;
      if (container) {
        const maxWidth = container.clientWidth - 32;
        const maxHeight = window.innerHeight - 200;
        
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (maxHeight / height) * width;
          height = maxHeight;
        }
        
        setCanvasSize({ width, height });
        setImageLoaded(true);
      }
    };
    img.src = src;

    return () => {
      setImageLoaded(false);
      setAnnotations([]);
    };
  }, [isOpen, src]);

  // Render canvas
  useEffect(() => {
    if (!canvasRef.current || !imageLoaded || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear and draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);

    // Draw all annotations
    annotations.forEach((ann) => drawAnnotation(ctx, ann));
    
    // Draw current annotation being created
    if (currentAnnotation) {
      drawAnnotation(ctx, currentAnnotation);
    }
  }, [annotations, currentAnnotation, imageLoaded, canvasSize]);

  const drawAnnotation = (ctx: CanvasRenderingContext2D, ann: Annotation) => {
    ctx.strokeStyle = ann.color;
    ctx.fillStyle = ann.color;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    switch (ann.type) {
      case "pencil":
        if (ann.points && ann.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(ann.points[0].x, ann.points[0].y);
          ann.points.forEach((point) => ctx.lineTo(point.x, point.y));
          ctx.stroke();
        }
        break;

      case "text":
        if (ann.text) {
          ctx.font = "bold 16px Inter, sans-serif";
          // Draw background
          const metrics = ctx.measureText(ann.text);
          ctx.fillStyle = "rgba(0,0,0,0.7)";
          ctx.fillRect(ann.startX - 4, ann.startY - 16, metrics.width + 8, 22);
          ctx.fillStyle = ann.color;
          ctx.fillText(ann.text, ann.startX, ann.startY);
        }
        break;

      case "circle":
        if (ann.endX !== undefined && ann.endY !== undefined) {
          const radius = Math.sqrt(
            Math.pow(ann.endX - ann.startX, 2) + Math.pow(ann.endY - ann.startY, 2)
          );
          ctx.beginPath();
          ctx.arc(ann.startX, ann.startY, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;

      case "rectangle":
        if (ann.endX !== undefined && ann.endY !== undefined) {
          ctx.strokeRect(
            ann.startX,
            ann.startY,
            ann.endX - ann.startX,
            ann.endY - ann.startY
          );
        }
        break;

      case "arrow":
        if (ann.endX !== undefined && ann.endY !== undefined) {
          // Draw line
          ctx.beginPath();
          ctx.moveTo(ann.startX, ann.startY);
          ctx.lineTo(ann.endX, ann.endY);
          ctx.stroke();

          // Draw arrowhead
          const angle = Math.atan2(ann.endY - ann.startY, ann.endX - ann.startX);
          const headLength = 15;
          ctx.beginPath();
          ctx.moveTo(ann.endX, ann.endY);
          ctx.lineTo(
            ann.endX - headLength * Math.cos(angle - Math.PI / 6),
            ann.endY - headLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(ann.endX, ann.endY);
          ctx.lineTo(
            ann.endX - headLength * Math.cos(angle + Math.PI / 6),
            ann.endY - headLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
        }
        break;
    }
  };

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getCanvasCoords(e);
    
    if (activeTool === "text") {
      setTextPosition({ x, y });
      return;
    }

    setIsDrawing(true);
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      type: activeTool,
      color: activeColor,
      startX: x,
      startY: y,
      points: activeTool === "pencil" ? [{ x, y }] : undefined,
    };
    setCurrentAnnotation(newAnnotation);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentAnnotation) return;
    
    const { x, y } = getCanvasCoords(e);

    if (activeTool === "pencil") {
      setCurrentAnnotation({
        ...currentAnnotation,
        points: [...(currentAnnotation.points || []), { x, y }],
      });
    } else {
      setCurrentAnnotation({
        ...currentAnnotation,
        endX: x,
        endY: y,
      });
    }
  };

  const handleEnd = () => {
    if (currentAnnotation && isDrawing) {
      setAnnotations([...annotations, currentAnnotation]);
      setCurrentAnnotation(null);
    }
    setIsDrawing(false);
  };

  const handleTextSubmit = () => {
    if (!textPosition || !textInput.trim()) {
      setTextPosition(null);
      setTextInput("");
      return;
    }

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      type: "text",
      color: activeColor,
      startX: textPosition.x,
      startY: textPosition.y,
      text: textInput.trim(),
    };
    setAnnotations([...annotations, newAnnotation]);
    setTextPosition(null);
    setTextInput("");
  };

  const handleUndo = () => {
    setAnnotations(annotations.slice(0, -1));
  };

  const handleClear = () => {
    setAnnotations([]);
  };

  const handleSave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL("image/png");
      
      // Download the image
      const link = document.createElement("a");
      link.download = `annotated-specimen-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      
      onSave?.(dataUrl);
      toast.success("Annotated image saved!");
    } catch (error) {
      toast.error("Failed to save image");
    }
  }, [onSave]);

  if (!isOpen) return null;

  const tools: { tool: Tool; icon: React.ReactNode; label: string }[] = [
    { tool: "pencil", icon: <Pencil className="h-4 w-4" />, label: "Draw" },
    { tool: "arrow", icon: <ArrowRight className="h-4 w-4" />, label: "Arrow" },
    { tool: "circle", icon: <Circle className="h-4 w-4" />, label: "Circle" },
    { tool: "rectangle", icon: <Square className="h-4 w-4" />, label: "Rectangle" },
    { tool: "text", icon: <Type className="h-4 w-4" />, label: "Text" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-white font-semibold">Annotate Specimen</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-white/10 bg-black/50">
        {/* Tools */}
        <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
          {tools.map(({ tool, icon, label }) => (
            <Button
              key={tool}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTool(tool)}
              className={`text-white hover:bg-white/20 ${
                activeTool === tool ? "bg-white/30" : ""
              }`}
              title={label}
            >
              {icon}
            </Button>
          ))}
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
          <Palette className="h-4 w-4 text-white/60 mx-1" />
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setActiveColor(color)}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                activeColor === color ? "border-white scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUndo}
            disabled={annotations.length === 0}
            className="text-white hover:bg-white/20 disabled:opacity-50"
          >
            <Undo className="h-4 w-4 mr-1" />
            Undo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={annotations.length === 0}
            className="text-white hover:bg-white/20 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
          >
            <Download className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center overflow-auto p-4"
      >
        {imageLoaded ? (
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="rounded-lg cursor-crosshair touch-none"
              onMouseDown={handleStart}
              onMouseMove={handleMove}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={handleStart}
              onTouchMove={handleMove}
              onTouchEnd={handleEnd}
            />
            
            {/* Text input overlay */}
            {textPosition && (
              <div
                className="absolute flex items-center gap-2"
                style={{ left: textPosition.x, top: textPosition.y }}
              >
                <Input
                  autoFocus
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleTextSubmit();
                    if (e.key === "Escape") {
                      setTextPosition(null);
                      setTextInput("");
                    }
                  }}
                  placeholder="Type label..."
                  className="w-40 h-8 text-sm bg-black/80 border-white/30 text-white"
                />
                <Button size="sm" onClick={handleTextSubmit} className="h-8">
                  Add
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-white/60">Loading image...</div>
        )}
      </div>

      {/* Instructions */}
      <div className="p-2 text-center border-t border-white/10">
        <p className="text-white/50 text-xs">
          {activeTool === "text"
            ? "Click to add a label"
            : "Click and drag to annotate • Use undo to remove last annotation"}
        </p>
      </div>
    </div>
  );
}
