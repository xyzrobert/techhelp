import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Nav } from "@/components/ui/nav";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Search from "@/pages/search";
import Book from "@/pages/book";
import Profile from "@/pages/profile";
import Admin from "@/pages/admin";
import Signup from "@/pages/signup";
import Login from "@/pages/login";
import HelperSignup from "@/pages/helper-signup";
import ApplicationPage from "@/pages/application";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/search" component={Search} />
          <Route path="/book/:id" component={Book} />
          <Route path="/profile" component={Profile} />
          <Route path="/admin" component={Admin} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/helper-signup" component={HelperSignup} />
          <Route path="/application" component={ApplicationPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
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