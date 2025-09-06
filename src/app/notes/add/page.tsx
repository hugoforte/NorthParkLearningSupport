'use client';

import { useRouter } from 'next/navigation';
import { NoteForm } from '@/components/notes/note-form';

export default function AddNotePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/notes');
  };

  const handleCancel = () => {
    router.push('/notes');
  };

  return (
    <div className="container mx-auto py-6">
      <NoteForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
