"use client";

import {
  Users,
  UserCheck,
  BookOpen,
  FileText,
  Target,
  GraduationCap,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/auth-context";

export function UnauthenticatedHome() {
  const { signIn } = useAuth();
  const features = [
    {
      title: "Teacher Management",
      description: "Comprehensive tools for managing teaching staff, schedules, and professional development",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      iconColor: "text-blue-400",
    },
    {
      title: "Student Tracking",
      description: "Monitor student progress, learning support needs, and academic performance",
      icon: UserCheck,
      color: "from-purple-500 to-purple-600",
      iconColor: "text-purple-400",
    },
    {
      title: "Class Organization",
      description: "Organize students into classes, manage assignments, and track attendance",
      icon: BookOpen,
      color: "from-green-500 to-green-600",
      iconColor: "text-green-400",
    },
    {
      title: "Progress Notes",
      description: "Record detailed observations, behavior tracking, and learning milestones",
      icon: FileText,
      color: "from-orange-500 to-orange-600",
      iconColor: "text-orange-400",
    },
    {
      title: "Goal Setting",
      description: "Set and track learning objectives, IEP goals, and academic targets",
      icon: Target,
      color: "from-pink-500 to-pink-600",
      iconColor: "text-pink-400",
    },
    {
      title: "Analytics & Reports",
      description: "Generate comprehensive reports and insights for data-driven decisions",
      icon: BarChart3,
      color: "from-indigo-500 to-indigo-600",
      iconColor: "text-indigo-400",
    },
  ];


  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="mb-6 text-5xl font-bold text-white">
          NorthPark Learning Support
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-gray-300">
          A comprehensive platform designed specifically for educational institutions to manage students, 
          track learning support needs, and ensure every student reaches their full potential.
        </p>
      </div>


      {/* Features Section */}
      <div>
        <h2 className="mb-8 text-center text-3xl font-bold text-white">
          Everything You Need to Support Student Learning
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group border-gray-700 bg-gray-800 transition-all duration-200 hover:scale-105"
              >
                <CardHeader>
                  <div
                    className={`mb-4 h-12 w-12 bg-gradient-to-br ${feature.color} flex items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110`}
                  >
                    <IconComponent className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <CardTitle className="text-xl text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="rounded-lg border border-gray-600 bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-8 text-center">
        <h3 className="mb-4 text-2xl font-bold text-white">
          Ready to Transform Your Learning Support?
        </h3>
        <p className="mb-6 text-lg text-gray-300">
          Join educational institutions already using NorthPark Learning Support to provide 
          better outcomes for their students.
        </p>
        <Button onClick={signIn} size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
          Sign In to Get Started
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 text-center">
          <div className="text-3xl font-bold text-white">100%</div>
          <div className="text-sm text-gray-400">Secure</div>
          <Badge className="mt-2 bg-green-600 text-white">Encrypted</Badge>
        </div>
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 text-center">
          <div className="text-3xl font-bold text-white">24/7</div>
          <div className="text-sm text-gray-400">Available</div>
          <Badge className="mt-2 bg-blue-600 text-white">Cloud</Badge>
        </div>
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 text-center">
          <div className="text-3xl font-bold text-white">Real-time</div>
          <div className="text-sm text-gray-400">Updates</div>
          <Badge className="mt-2 bg-purple-600 text-white">Live</Badge>
        </div>
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 text-center">
          <div className="text-3xl font-bold text-white">Modern</div>
          <div className="text-sm text-gray-400">Technology</div>
          <Badge className="mt-2 bg-orange-600 text-white">Latest</Badge>
        </div>
      </div>
    </div>
  );
}
