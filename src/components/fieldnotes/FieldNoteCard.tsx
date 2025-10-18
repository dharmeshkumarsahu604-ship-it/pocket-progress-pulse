import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Image, Trash2, Edit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { FieldNote } from "./FieldNoteEditor";

interface FieldNoteCardProps {
  note: FieldNote;
  onDelete: (id: string) => void;
  onEdit: (note: FieldNote) => void;
}

export const FieldNoteCard = ({ note, onDelete, onEdit }: FieldNoteCardProps) => {
  return (
    <Card className="overflow-hidden">
      {note.photos.length > 0 && (
        <div className="aspect-video bg-muted relative">
          <img
            src={note.photos[0]}
            alt={note.title}
            className="w-full h-full object-cover"
          />
          {note.photos.length > 1 && (
            <Badge className="absolute bottom-2 right-2">
              <Image className="mr-1 h-3 w-3" />
              {note.photos.length}
            </Badge>
          )}
        </div>
      )}

      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg flex-1">{note.title}</h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(note)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(note.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {note.content && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {note.content}
          </p>
        )}

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDistanceToNow(note.date, { addSuffix: true })}
          </div>
          {note.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Location saved
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
