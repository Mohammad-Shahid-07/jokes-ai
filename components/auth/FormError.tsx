import { AlertTriangle } from 'lucide-react';

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className='bg-red-400/35 p-3 text-red-500 rounded-md flex items-center gap-x-2 text-sm text-destructive'>
      <AlertTriangle className='h-4 w-4 ' />
      <p>{message}</p>
    </div>
  );
};