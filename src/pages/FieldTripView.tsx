import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { VirtualFieldTripViewer } from "@/components/fieldtrips/VirtualFieldTripViewer";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

export default function FieldTripView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fieldTrip, setFieldTrip] = useState<any>(null);
  const [waypoints, setWaypoints] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchFieldTrip();
    }
  }, [id]);

  const fetchFieldTrip = async () => {
    try {
      // Fetch field trip
      const { data: tripData, error: tripError } = await supabase
        .from("field_trips")
        .select("*")
        .eq("id", id)
        .single();

      if (tripError) throw tripError;
      if (!tripData) {
        toast.error("Field trip not found");
        navigate("/field-trips");
        return;
      }

      setFieldTrip(tripData);

      // Fetch waypoints
      const { data: waypointsData, error: waypointsError } = await supabase
        .from("field_trip_waypoints")
        .select("*")
        .eq("field_trip_id", id)
        .order("sequence_number", { ascending: true });

      if (waypointsError) throw waypointsError;
      setWaypoints(waypointsData || []);

      // Fetch quizzes
      const { data: quizzesData, error: quizzesError } = await supabase
        .from("field_trip_quizzes")
        .select("*")
        .eq("field_trip_id", id);

      if (quizzesError) throw quizzesError;
      setQuizzes(quizzesData || []);
    } catch (error) {
      console.error("Error fetching field trip:", error);
      toast.error("Failed to load field trip");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <LoadingSkeleton />
      </AppLayout>
    );
  }

  if (!fieldTrip || waypoints.length === 0) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Field trip not available</h1>
          <Button onClick={() => navigate("/field-trips")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Field Trips
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-4">
        <Button variant="ghost" onClick={() => navigate("/field-trips")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Field Trips
        </Button>

        <VirtualFieldTripViewer
          fieldTrip={fieldTrip}
          waypoints={waypoints}
          quizzes={quizzes}
        />
      </div>
    </AppLayout>
  );
}
