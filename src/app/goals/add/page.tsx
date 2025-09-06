'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { GoalForm } from '@/components/goals/goal-form';
import { Suspense } from 'react';

function AddGoalPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');

  const handleSuccess = () => {
    if (studentId) {
      router.push(`/students/${studentId}`);
    } else {
      router.push('/goals');
    }
  };

  const handleCancel = () => {
    if (studentId) {
      router.push(`/students/${studentId}`);
    } else {
      router.push('/goals');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Add New Goal</h1>
          <p className="text-gray-400 mt-1">Create a learning goal for a student</p>
        </div>
        
        <GoalForm 
          initialStudentId={studentId || undefined}
          onSuccess={handleSuccess} 
          onCancel={handleCancel} 
        />
      </div>
    </div>
  );
}

export default function AddGoalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="h-96 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <AddGoalPageContent />
    </Suspense>
  );
}
