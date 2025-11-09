import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, FileText, CheckCircle2, XCircle, Eye, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient"; // Assuming this is resolved
import { formatDistanceToNow } from "date-fns";

// Define a type for the application data
interface Application {
    id: string;
    service_name: string;
    status: 'pending' | 'in_progress' | 'approved' | 'declined';
    created_at: string;
    // Add any other necessary fields like reference_id, payment_status, etc.
}

const MyApplications: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    // Helper function to render status badges
    const getStatusBadge = (status: Application['status']) => {
        const variants: Record<Application['status'], { label: string; className: string }> = {
            approved: { label: "Approved", className: "bg-green-100 text-green-700 border-green-200" },
            declined: { label: "Declined", className: "bg-red-100 text-red-700 border-red-200" },
            in_progress: { label: "In Review", className: "bg-blue-100 text-blue-700 border-blue-200" },
            pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
        };
        
        const variant = variants[status] || variants.pending;

        return (
            <Badge
                variant="outline"
                className={`font-medium ${variant.className} border`}
            >
                {variant.label}
            </Badge>
        );
    };

    const fetchApplications = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const { data, error } = await supabase
            .from("applications")
            .select("*")
            .eq("user_id", user.id) // Filter by current user
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching applications:", error);
            toast({
                title: "Error",
                description: "Failed to load application history.",
                variant: "destructive",
            });
            setApplications([]);
        } else {
            setApplications((data as Application[]) || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchApplications();
    }, [user]);

    // Function to view details (e.g., in a dialog or navigate to a detail page)
    const handleViewDetails = (app: Application) => {
        // You would typically open a dialog here or navigate
        console.log("Viewing application details for:", app.id);
        toast({
            title: `${app.service_name} Details`,
            description: `Application ID: ${app.id} - Status: ${app.status}`,
        });
        // navigate(`/application/${app.id}`); // Example navigation route
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-8">
            <div className="container mx-auto px-4 max-w-5xl">
                <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>

                <Card className="glass-card p-8 border-border/50">
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
                            <p className="text-sm text-muted-foreground">Orodha ya Maombi Yako</p>
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <p className="text-sm text-muted-foreground">
                            You have **{applications.length}** total applications.
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center p-10">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                            <p className="mt-2 text-muted-foreground">Loading your application history...</p>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="text-center p-10 border border-dashed rounded-lg bg-muted/30">
                            <p className="text-lg text-muted-foreground">No applications found.</p>
                            <p className="text-sm mt-1">Visit the <span className="font-medium text-primary cursor-pointer" onClick={() => navigate("/services")}>Services page</span> to start a new application.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-muted/50 text-left">
                                        <th className="p-3">Application ID</th>
                                        <th className="p-3">Service</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Date</th>
                                        <th className="p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((app) => (
                                        <tr key={app.id} className="border-b border-border/70 hover:bg-muted/30">
                                            <td className="p-3 font-mono text-xs">{app.id}</td>
                                            <td className="p-3 font-medium text-foreground">{app.service_name}</td>
                                            <td className="p-3">
                                                {getStatusBadge(app.status)}
                                            </td>
                                            <td className="p-3 text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <Button size="sm" variant="outline" onClick={() => handleViewDetails(app)}>
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default MyApplications;