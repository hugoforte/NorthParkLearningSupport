"use client";

import Link from "next/link";
import {
  Users,
  UserCheck,
  BookOpen,
  FileText,
  Target,
  GraduationCap,
  BarChart3,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const features = [
    {
      title: "Teachers",
      description: "Manage your teaching staff and their information",
      icon: Users,
      href: "/teachers",
      color: "from-blue-500 to-blue-600",
      iconColor: "text-blue-400",
      buttonColor:
        "border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white",
      quickAction: "Add Teacher",
      quickActionHref: "/teachers/add",
    },
    {
      title: "Students",
      description: "Track student progress and learning support needs",
      icon: UserCheck,
      href: "/students",
      color: "from-purple-500 to-purple-600",
      iconColor: "text-purple-400",
      buttonColor:
        "border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white",
      quickAction: "Add Student",
      quickActionHref: "/students/add",
    },
    {
      title: "Classes",
      description: "Organize students into classes and manage assignments",
      icon: BookOpen,
      href: "/classes",
      color: "from-green-500 to-green-600",
      iconColor: "text-green-400",
      buttonColor:
        "border-green-600 text-green-400 hover:bg-green-600 hover:text-white",
      quickAction: "Add Class",
      quickActionHref: "/classes/add",
    },
    {
      title: "Notes",
      description: "Record observations and track student behavior",
      icon: FileText,
      href: "/notes",
      color: "from-orange-500 to-orange-600",
      iconColor: "text-orange-400",
      buttonColor:
        "border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white",
      quickAction: "Add Note",
      quickActionHref: "/notes/add",
    },
    {
      title: "Goals",
      description: "Set and track learning objectives for students",
      icon: Target,
      href: "/goals",
      color: "from-pink-500 to-pink-600",
      iconColor: "text-pink-400",
      buttonColor:
        "border-pink-600 text-pink-400 hover:bg-pink-600 hover:text-white",
      quickAction: "Add Goal",
      quickActionHref: "/goals/add",
    },
    {
      title: "Analytics",
      description: "Generate insights and analytics for your institution",
      icon: BarChart3,
      href: "/analytics",
      color: "from-indigo-500 to-indigo-600",
      iconColor: "text-indigo-400",
      buttonColor:
        "border-indigo-600 text-indigo-400 hover:bg-indigo-600 hover:text-white",
      quickAction: "View Reports",
      quickActionHref: "/analytics",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <div className="mb-4 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="mb-4 text-4xl font-bold text-white">
          Welcome to NorthPark Learning Support
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-400">
          A comprehensive platform for managing your educational institution,
          tracking student progress, and supporting learning outcomes.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-white">Active</div>
          <div className="text-sm text-gray-400">System Status</div>
          <Badge className="mt-2 bg-green-600 text-white">Online</Badge>
        </div>
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-white">Real-time</div>
          <div className="text-sm text-gray-400">Data Sync</div>
          <Badge className="mt-2 bg-blue-600 text-white">Live</Badge>
        </div>
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-white">Secure</div>
          <div className="text-sm text-gray-400">Data Protection</div>
          <Badge className="mt-2 bg-purple-600 text-white">Protected</Badge>
        </div>
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-white">Modern</div>
          <div className="text-sm text-gray-400">Technology</div>
          <Badge className="mt-2 bg-orange-600 text-white">Latest</Badge>
        </div>
      </div>

      {/* Feature Cards */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-white">System Features</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={feature.title}
                className="hover:bg-gray-750 group border-gray-700 bg-gray-800 transition-all duration-200 hover:scale-105"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`h-12 w-12 bg-gradient-to-br ${feature.color} flex items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110`}
                    >
                      <IconComponent
                        className={`h-6 w-6 ${feature.iconColor}`}
                      />
                    </div>
                    <Link href={feature.href}>
                      <Button
                        variant="outline"
                        size="sm"
                        className={feature.buttonColor}
                      >
                        View
                      </Button>
                    </Link>
                  </div>
                  <CardTitle className="text-xl text-white transition-colors group-hover:text-gray-100">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="mb-4 text-gray-400 transition-colors group-hover:text-gray-300">
                    {feature.description}
                  </p>
                  <div className="flex space-x-2">
                    <Link href={feature.href} className="flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        Browse
                      </Button>
                    </Link>
                    <Link href={feature.quickActionHref}>
                      <Button
                        variant="outline"
                        size="sm"
                        className={feature.buttonColor}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        {feature.quickAction}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="rounded-lg border border-gray-600 bg-gradient-to-r from-gray-800 to-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              Getting Started
            </h3>
            <p className="text-gray-400">
              New to the system? Start by adding your first teacher or class to
              get organized.
            </p>
          </div>
          <div className="flex space-x-3">
            <Link href="/teachers/add">
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                <Users className="mr-2 h-4 w-4" />
                Add Teacher
              </Button>
            </Link>
            <Link href="/classes/add">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Add Class
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
