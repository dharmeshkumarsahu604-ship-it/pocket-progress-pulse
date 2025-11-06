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
      <div className="flex items-center justify-between animate-fade-in">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="hover-scale transition-all duration-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Scan Again
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleShare}
            className="hover-scale transition-all duration-200"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <Button 
            onClick={onSave}
            className="hover-scale transition-all duration-200"
          >
            <Save className="mr-2 h-4 w-4" />
            Save to Collection
          </Button>
        </div>
      </div>

      <div className="aspect-video bg-muted rounded-lg overflow-hidden animate-scale-in">
        <img
          src={imageData}
          alt="Scanned specimen"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{result.name}</CardTitle>
              <Badge variant="secondary" className="mt-2 animate-scale-in">
                {result.type}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Confidence</p>
              <p className="text-2xl font-bold text-primary animate-scale-in">
                {Math.round(result.confidence * 100)}%
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress 
            value={result.confidence * 100} 
            className="h-2 transition-all duration-1000"
          />
          <p className="text-muted-foreground">{result.description}</p>
        </CardContent>
      </Card>

      <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.properties.map((prop, index) => (
            <div 
              key={index} 
              className="flex justify-between py-2 border-b border-border last:border-0 animate-fade-in hover:bg-accent/50 transition-colors duration-200 px-2 -mx-2 rounded"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
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
