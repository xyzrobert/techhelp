
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
import { useState, useEffect } from "react";
import { UserMenu } from "./components/UserMenu";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/book/:id" component={Book} />
      <Route path="/profile" component={Profile} />
      <Route path="/admin" component={Admin} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route path="/helper-signup" component={HelperSignup} />
      <Route path="/applications/:id" component={ApplicationPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [user, setUser] = useState(null);
  const [, navigate] = useLocation();

  // Fetch the current user if logged in
  const { data, error, isLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    onSuccess: (data) => {
      setUser(data.user);
    },
    onError: () => {
      setUser(null);
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="/" className="text-xl font-bold">Klarfix</a>
            <nav className="hidden md:flex gap-6">
              <a href="/helpers" className="text-sm font-medium hover:text-primary">Helfer finden</a>
              <a href="/services" className="text-sm font-medium hover:text-primary">Services</a>
              <a href="/about" className="text-sm font-medium hover:text-primary">Über uns</a>
            </nav>
          </div>

          <UserMenu user={user} />
        </div>
      </header>

      <main className="flex-1">
        <Router />
      </main>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
