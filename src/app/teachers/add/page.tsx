'use client';

import { useRouter } from 'next/navigation';
import { TeacherForm } from '@/components/teachers/teacher-form';

export default function AddTeacherPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/teachers');
  };

  const handleCancel = () => {
    router.push('/teachers');
  };

  return (
    <div className="container mx-auto py-6">
      <TeacherForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
