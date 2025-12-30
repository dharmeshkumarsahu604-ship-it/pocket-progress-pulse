import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Check, Gem } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Mineral {
  id: string;
  name: string;
  chemical_formula: string | null;
  image_url: string | null;
  hardness: number;
}

interface MineralSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectMineral: (mineral: any) => void;
  excludeIds: string[];
}

export const MineralSelector = ({ 
  open, 
  onOpenChange, 
  onSelectMineral,
  excludeIds 
}: MineralSelectorProps) => {
  const [minerals, setMinerals] = useState<Mineral[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (open) {
      fetchMinerals();
    }
  }, [open]);

  const fetchMinerals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("minerals")
        .select("id, name, chemical_formula, image_url, hardness")
        .order("name");

      if (error) throw error;
      setMinerals(data || []);
    } catch (error) {
      console.error("Error fetching minerals:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMinerals = minerals.filter(mineral => 
    !excludeIds.includes(mineral.id) &&
    (mineral.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     mineral.chemical_formula?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelect = async (mineral: Mineral) => {
    // Fetch full mineral data
    const { data, error } = await supabase
      .from("minerals")
      .select("*")
      .eq("id", mineral.id)
      .single();

    if (!error && data) {
      onSelectMineral(data);
      onOpenChange(false);
      setSearchTerm("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden p-0 gap-0">
        <DialogHeader className="p-5 pb-4 border-b border-border/50">
          <DialogTitle className="text-lg font-bold text-[hsl(var(--geo-text))]">
            Select Mineral to Compare
          </DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="p-4 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--geo-text-light))]" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search minerals..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Mineral List */}
        <div className="overflow-y-auto max-h-[400px] p-2">
          {loading ? (
            <div className="space-y-2 p-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMinerals.length === 0 ? (
            <div className="text-center py-8">
              <Gem className="w-10 h-10 mx-auto text-[hsl(var(--geo-text-light))] mb-2" />
              <p className="text-sm text-[hsl(var(--geo-text-light))]">
                {searchTerm ? "No minerals match your search" : "No more minerals available"}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredMinerals.map((mineral) => (
                <button
                  key={mineral.id}
                  onClick={() => handleSelect(mineral)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[hsl(var(--geo-cream))] 
                             transition-colors text-left group"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[hsl(var(--geo-background))] shrink-0">
                    <img
                      src={mineral.image_url || "/placeholder.svg"}
                      alt={mineral.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[hsl(var(--geo-text))] truncate group-hover:text-[hsl(var(--geo-green))]">
                      {mineral.name}
                    </h4>
                    {mineral.chemical_formula && (
                      <p className="text-xs font-mono text-[hsl(var(--geo-text-light))] truncate">
                        {mineral.chemical_formula}
                      </p>
                    )}
                  </div>
                  <Badge 
                    variant="outline" 
                    className="shrink-0 font-mono text-xs bg-[hsl(var(--geo-background))]"
                  >
                    H: {mineral.hardness}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 bg-[hsl(var(--geo-background))]">
          <Button 
            variant="outline" 
            onClick={() => {
              onOpenChange(false);
              setSearchTerm("");
            }}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};