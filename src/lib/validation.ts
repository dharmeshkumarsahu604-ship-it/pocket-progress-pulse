import { z } from "zod";

// Field note validation schema
export const fieldNoteSchema = z.object({
  title: z.string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z.string()
    .trim()
    .min(1, "Content is required")
    .max(10000, "Content must be less than 10,000 characters"),
  locationName: z.string()
    .trim()
    .max(200, "Location name must be less than 200 characters")
    .optional(),
  latitude: z.number()
    .min(-90, "Invalid latitude")
    .max(90, "Invalid latitude")
    .optional(),
  longitude: z.number()
    .min(-180, "Invalid longitude")
    .max(180, "Invalid longitude")
    .optional(),
  weatherConditions: z.string()
    .trim()
    .max(500, "Weather conditions must be less than 500 characters")
    .optional(),
  tags: z.array(z.string().trim().max(50)).max(20, "Maximum 20 tags allowed").optional(),
});

// Voice note validation schema
export const voiceNoteSchema = z.object({
  title: z.string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  transcription: z.string()
    .trim()
    .max(50000, "Transcription must be less than 50,000 characters")
    .optional(),
  language: z.string()
    .trim()
    .length(2, "Language must be a 2-character code")
    .optional(),
  duration: z.number()
    .int()
    .min(0, "Duration must be positive")
    .optional(),
});

// Profile validation schema
export const profileSchema = z.object({
  fullName: z.string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  institute: z.string()
    .trim()
    .max(200, "Institute name must be less than 200 characters")
    .optional(),
  bio: z.string()
    .trim()
    .max(1000, "Bio must be less than 1,000 characters")
    .optional(),
});

// Chat message validation
export const chatMessageSchema = z.object({
  content: z.string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(2000, "Message must be less than 2,000 characters"),
});

// Image file validation
export const imageFileSchema = z.instanceof(File)
  .refine(file => file.size <= 10 * 1024 * 1024, "Image must be less than 10MB")
  .refine(
    file => ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type),
    "Only JPEG, PNG, WebP, and GIF images are allowed"
  );

// Coordinate validation
export const coordinateSchema = z.object({
  latitude: z.number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: z.number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
});

// Sanitize HTML to prevent XSS
export const sanitizeHtml = (html: string): string => {
  const div = document.createElement("div");
  div.textContent = html;
  return div.innerHTML;
};

// Validate and sanitize user input
export const sanitizeInput = (input: string, maxLength: number = 1000): string => {
  return input.trim().slice(0, maxLength);
};
