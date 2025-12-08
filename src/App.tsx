import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import PostDetail from "./pages/PostDetail";
import Explore from "./pages/Explore";
import AuthorProfile from "./pages/AuthorProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WritePost from "./pages/WritePost";
import NotFound from "./pages/NotFound";

// 🔽 NEW pages
import MyPosts from "./pages/MyPosts";
import Followers from "./pages/Followers";
import Following from "./pages/Following";
import FollowRequests from "./pages/FollowRequests";
import NotificationsPage from "./pages/Notifications";
import ProfilePage from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/author/:username" element={<AuthorProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/write" element={<WritePost />} />

          {/* 🔽 NEW ROUTES */}
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/followers" element={<Followers />} />
          <Route path="/following" element={<Following />} />
          <Route path="/follow-requests" element={<FollowRequests />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
