"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Target,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Circle,
  X,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import type { Id } from "../../../convex/_generated/dataModel";

interface StudentGoalsSectionProps {
  studentId: Id<"students">;
  goals?: Array<{
    _id: Id<"goals">;
    studentId: Id<"students">;
    authorId: Id<"teachers">;
    subjectIds: Id<"subjects">[];
    note: string;
    isCompleted: boolean;
    status:
      | "NOT_STARTED"
      | "IN_PROGRESS"
      | "COMPLETED"
      | "ON_HOLD"
      | "CANCELLED";
    targetDate?: number;
    _creationTime: number;
  }>;
}

const statusOptions = [
  {
    value: "NOT_STARTED",
    label: "Not Started",
    color: "bg-gray-600",
    icon: Circle,
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    color: "bg-blue-600",
    icon: Target,
  },
  {
    value: "COMPLETED",
    label: "Completed",
    color: "bg-green-600",
    icon: CheckCircle,
  },
  { value: "ON_HOLD", label: "On Hold", color: "bg-yellow-600", icon: Circle },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-600", icon: X },
] as const;

export const StudentGoalsSection = ({
  studentId,
  goals,
}: StudentGoalsSectionProps) => {
  const teachers = useQuery(api.teachers.getActive);
  const subjects = useQuery(api.subjects.getActive);
  const removeGoal = useMutation(api.goals.remove);

  const getTeacherName = (teacherId: Id<"teachers">) => {
    const teacher = teachers?.find((t) => t._id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : "Unknown";
  };

  const getSubjectNames = (subjectIds: Id<"subjects">[]) => {
    if (!subjects) return "Loading...";
    const subjectNames = subjectIds
      .map((id) => subjects.find((s) => s._id === id)?.name)
      .filter(Boolean);
    return subjectNames.length > 0 ? subjectNames.join(", ") : "No subjects";
  };

  const getStatusInfo = (status: string) => {
    return (
      statusOptions.find((opt) => opt.value === status) || statusOptions[0]
    );
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "No target date";
    return new Date(timestamp).toLocaleDateString();
  };

  const handleDeleteGoal = async (goalId: Id<"goals">) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      try {
        await removeGoal({ id: goalId });
      } catch (error) {
        console.error("Failed to delete goal:", error);
        alert("Failed to delete goal. Please try again.");
      }
    }
  };

  if (!goals) {
    return (
      <Card className="border-gray-700 bg-gray-800">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="mb-4 h-4 w-1/4 rounded bg-gray-700"></div>
            <div className="space-y-3">
              <div className="h-16 rounded bg-gray-700"></div>
              <div className="h-16 rounded bg-gray-700"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeGoals = goals.filter(
    (goal) => goal.status !== "COMPLETED" && goal.status !== "CANCELLED",
  );
  const completedGoals = goals.filter((goal) => goal.status === "COMPLETED");

  return (
    <Card className="border-gray-700 bg-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-white">
                Learning Goals
              </CardTitle>
              <p className="text-sm text-gray-400">
                {goals.length} total • {activeGoals.length} active •{" "}
                {completedGoals.length} completed
              </p>
            </div>
          </div>
          <Link href={`/goals/add?studentId=${studentId}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Goal
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <div className="py-8 text-center">
            <Target className="mx-auto mb-4 h-12 w-12 text-gray-600" />
            <p className="mb-4 text-gray-400">
              No goals set for this student yet.
            </p>
            <Link href={`/goals/add?studentId=${studentId}`}>
              <Button
                variant="outline"
                className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create First Goal
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Active Goals */}
            {activeGoals.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-medium text-gray-300">
                  Active Goals
                </h4>
                <div className="space-y-3">
                  {activeGoals.map((goal) => {
                    const statusInfo = getStatusInfo(goal.status);
                    const StatusIcon = statusInfo.icon;

                    return (
                      <div
                        key={goal._id}
                        className="rounded-lg bg-gray-700 p-4"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <StatusIcon className="h-4 w-4 text-white" />
                            <Badge className={`${statusInfo.color} text-white`}>
                              {statusInfo.label}
                            </Badge>
                          </div>
                          <div className="flex space-x-1">
                            <Link href={`/goals/edit/${goal._id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                              onClick={() => handleDeleteGoal(goal._id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="mb-2 text-sm text-white">{goal.note}</p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>
                            Subjects: {getSubjectNames(goal.subjectIds)}
                          </span>
                          <span>Target: {formatDate(goal.targetDate)}</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          By {getTeacherName(goal.authorId)} •{" "}
                          {new Date(goal._creationTime).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed Goals */}
            {completedGoals.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-medium text-gray-300">
                  Completed Goals
                </h4>
                <div className="space-y-3">
                  {completedGoals.map((goal) => (
                    <div
                      key={goal._id}
                      className="rounded-lg bg-gray-700 p-4 opacity-75"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <Badge className="bg-green-600 text-white">
                            Completed
                          </Badge>
                        </div>
                        <div className="flex space-x-1">
                          <Link href={`/goals/edit/${goal._id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                            onClick={() => handleDeleteGoal(goal._id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="mb-2 text-sm text-white line-through">
                        {goal.note}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>
                          Subjects: {getSubjectNames(goal.subjectIds)}
                        </span>
                        <span>Completed: {formatDate(goal.targetDate)}</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        By {getTeacherName(goal.authorId)} •{" "}
                        {new Date(goal._creationTime).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
