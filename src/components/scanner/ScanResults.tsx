import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Save, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ScanResult {
  name: string;
  type: string;
  confidence: number;
  description: string;
  properties: { label: string; value: string }[];
}

interface ScanResultsProps {
  imageData: string;
  result: ScanResult;
  onBack: () => void;
  onSave: () => void;
}

export const ScanResults = ({ imageData, result, onBack, onSave }: ScanResultsProps) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: result.name,
          text: result.description,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Scan Again
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-5 w-5" />
          </Button>
          <Button onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Save to Collection
          </Button>
        </div>
      </div>

      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
        <img
          src={imageData}
          alt="Scanned specimen"
          className="w-full h-full object-cover"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{result.name}</CardTitle>
              <Badge variant="secondary" className="mt-2">
                {result.type}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Confidence</p>
              <p className="text-2xl font-bold text-primary">
                {Math.round(result.confidence * 100)}%
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={result.confidence * 100} className="h-2" />
          <p className="text-muted-foreground">{result.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.properties.map((prop, index) => (
            <div key={index} className="flex justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm font-medium text-muted-foreground">
                {prop.label}
              </span>
              <span className="text-sm font-medium">{prop.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
