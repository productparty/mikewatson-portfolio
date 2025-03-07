import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { GithubUpdate } from "@shared/schema";

export function GithubUpdates() {
  const { data: updates, isLoading, refetch, error } = useQuery<GithubUpdate[]>({
    queryKey: ["/api/github-updates"],
  });

  // Separate query for refresh endpoint
  const { mutate: refreshData, isPending: isRefreshing } = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/github-updates/refresh");
    },
    onSuccess: () => {
      refetch();
    },
  });

  // Fetch GitHub data on component mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My GitHub Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse bg-muted rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My GitHub Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Failed to load GitHub projects. Please try refreshing.</p>
          <Button onClick={() => refreshData()} variant="outline" className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My GitHub Projects</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refreshData()}
          disabled={isRefreshing}
        >
          {isRefreshing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {!updates || updates.length === 0 ? (
          <p className="text-muted-foreground">No projects found. Please try refreshing.</p>
        ) : (
          updates.map((project) => (
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{project.repoName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.description || "No description available"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        <Star className="mr-1 h-3 w-3" />
                        {project.stars}
                      </Badge>
                      {project.language && (
                        <Badge variant="outline">{project.language}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Last updated {format(new Date(project.lastUpdated), "MMM d, yyyy")}
                  </div>
                </CardContent>
              </Card>
            </a>
          ))
        )}
      </CardContent>
    </Card>
  );
}