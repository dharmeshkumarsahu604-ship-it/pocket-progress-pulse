import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Save, Share2, Loader2, AlertTriangle, HelpCircle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface ScanResult {
  name: string;
  type: string;
  confidence: number;
  confidenceLevel?: "low" | "medium" | "high";
  description: string;
  properties: { label: string; value: string }[];
  possibleExamples?: string[];
  labelDetected?: boolean;
  labelText?: string | null;
  verification?: "match" | "mismatch" | "no_label";
  verificationNote?: string | null;
  requiresVerification?: string | null;
}

interface ScanResultsProps {
  imageData: string;
  result: ScanResult;
  onBack: () => void;
  onSave: () => void;
  onSelectAlternative?: (alternativeName: string) => void;
  isSaving?: boolean;
}

export const ScanResults = ({ imageData, result, onBack, onSave, onSelectAlternative, isSaving }: ScanResultsProps) => {
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

  const confidencePercent = Math.round(result.confidence * 100);
  const showAlternatives = confidencePercent < 80 && result.possibleExamples && result.possibleExamples.length > 0;

  const getConfidenceBadgeVariant = () => {
    if (confidencePercent >= 80) return "default";
    if (confidencePercent >= 50) return "secondary";
    return "destructive";
  };

  const getConfidenceLabel = () => {
    if (result.confidenceLevel) return result.confidenceLevel.toUpperCase();
    if (confidencePercent >= 80) return "HIGH";
    if (confidencePercent >= 50) return "MEDIUM";
    return "LOW";
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
            disabled={isSaving}
            className="hover-scale transition-all duration-200"
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSaving ? "Saving..." : "Save to Collection"}
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

      {/* Label Detection Status */}
      {result.labelDetected && (
        <Card className="animate-fade-in border-l-4 border-l-primary">
          <CardContent className="py-3">
            <div className="flex items-center gap-2">
              {result.verification === "match" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : result.verification === "mismatch" ? (
                <XCircle className="h-5 w-5 text-destructive" />
              ) : null}
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Label detected: <span className="text-primary">"{result.labelText}"</span>
                </p>
                {result.verification === "mismatch" && result.verificationNote && (
                  <p className="text-xs text-destructive mt-1">{result.verificationNote}</p>
                )}
                {result.verification === "match" && (
                  <p className="text-xs text-green-600 mt-1">Visual appearance matches the label</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{result.name}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="animate-scale-in">
                  {result.type}
                </Badge>
                <Badge variant={getConfidenceBadgeVariant()} className="animate-scale-in">
                  {getConfidenceLabel()} CONFIDENCE
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Confidence</p>
              <p className={`text-2xl font-bold animate-scale-in ${
                confidencePercent >= 80 ? 'text-primary' : 
                confidencePercent >= 50 ? 'text-warning' : 'text-destructive'
              }`}>
                {confidencePercent}%
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress 
            value={confidencePercent} 
            className={`h-2 transition-all duration-1000 ${
              confidencePercent < 50 ? '[&>div]:bg-destructive' : 
              confidencePercent < 80 ? '[&>div]:bg-warning' : ''
            }`}
          />
          <p className="text-muted-foreground">{result.description}</p>
          
          {/* Verification Warning */}
          {result.requiresVerification && (
            <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <HelpCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <p className="text-sm text-warning">{result.requiresVerification}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alternative Identifications - Show when confidence < 80% */}
      {showAlternatives && (
        <Card className="animate-fade-in border-warning/50" style={{ animationDelay: '150ms' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-warning" />
              Possible Alternatives
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {onSelectAlternative 
                ? "Tap an alternative to update the identification:" 
                : "Due to lower confidence, consider these alternatives:"}
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.possibleExamples.map((example, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className={`animate-scale-in transition-colors ${
                    onSelectAlternative 
                      ? 'cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary' 
                      : 'cursor-default hover:bg-accent'
                  }`}
                  style={{ animationDelay: `${200 + index * 50}ms` }}
                  onClick={() => onSelectAlternative?.(example)}
                >
                  {example}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {onSelectAlternative 
                ? "Select an alternative above, or perform hardness/streak/acid tests to confirm."
                : "Perform hardness tests, streak tests, or acid tests to narrow down the identification."}
            </p>
          </CardContent>
        </Card>
      )}

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

      {/* AI Disclaimer */}
      <p className="text-xs text-warning text-center flex items-center justify-center gap-1 animate-fade-in" style={{ animationDelay: '400ms' }}>
        <AlertTriangle className="h-3 w-3" />
        AI identification is visual-based. Field & lab tests recommended for confirmation.
      </p>
    </div>
  );
};
