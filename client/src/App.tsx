import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Consulting from "@/pages/consulting";
import About from "@/pages/about";
import Chat from "@/pages/chat";
import Analytics from "@/pages/analytics";
import PromptFramework from "@/pages/prompt-framework";
import PromptEvaluator from "@/pages/prompt-evaluator";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Consulting} />
      <Route path="/about" component={About} />
      <Route path="/chat" component={Chat} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/prompt-framework" component={PromptFramework} />
      <Route path="/prompt-evaluator" component={PromptEvaluator} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;