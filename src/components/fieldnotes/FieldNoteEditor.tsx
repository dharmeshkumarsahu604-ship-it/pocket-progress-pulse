import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, MapPin, X } from "lucide-react";
import { toast } from "sonner";

interface FieldNoteEditorProps {
  onSave: (note: FieldNote) => void;
  onCancel: () => void;
  initialNote?: FieldNote;
}

export interface FieldNote {
  id: string;
  title: string;
  content: string;
  date: Date;
  location?: { lat: number; lng: number; name: string };
  photos: string[];
}

export const FieldNoteEditor = ({ onSave, onCancel, initialNote }: FieldNoteEditorProps) => {
  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || "");
  const [photos, setPhotos] = useState<string[]>(initialNote?.photos || []);
  const [location, setLocation] = useState<string>(
    initialNote?.location ? `${initialNote.location.lat}, ${initialNote.location.lng}` : ""
  );

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title);
      setContent(initialNote.content);
      setPhotos(initialNote.photos);
      setLocation(initialNote.location ? `${initialNote.location.lat}, ${initialNote.location.lng}` : "");
    }
  }, [initialNote]);

  const handlePhotoCapture = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.multiple = true;

    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;

      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setPhotos((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    };

    input.click();
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(
            `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          );
          toast.success("Location captured");
        },
        () => {
          toast.error("Failed to get location");
        }
      );
    } else {
      toast.error("Geolocation is not supported");
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    // Parse location string into lat/lng
    let parsedLocation: { lat: number; lng: number; name: string } | undefined;
    if (location.trim()) {
      const parts = location.split(',').map(p => p.trim());
      if (parts.length === 2) {
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        if (!isNaN(lat) && !isNaN(lng)) {
          parsedLocation = { lat, lng, name: location };
        }
      }
    }

    const note: FieldNote = {
      id: initialNote?.id || Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      date: initialNote?.date || new Date(),
      location: parsedLocation,
      photos,
    };

    onSave(note);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{initialNote ? "Edit Field Note" : "New Field Note"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Describe your observations..."
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <div className="flex gap-2">
              <Input
                placeholder="GPS coordinates"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleGetLocation}
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Photos</Label>
            <Button
              variant="outline"
              onClick={handlePhotoCapture}
              className="w-full"
            >
              <Camera className="mr-2 h-4 w-4" />
              Add Photos
            </Button>

            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex-1">
          Save Note
        </Button>
      </div>
    </div>
  );
};
