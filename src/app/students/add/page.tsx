'use client';

import { useRouter } from 'next/navigation';
import { StudentForm } from '@/components/students/student-form';

export default function AddStudentPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/students');
  };

  const handleCancel = () => {
    router.push('/students');
  };

  return (
    <div className="container mx-auto py-6">
      <StudentForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
