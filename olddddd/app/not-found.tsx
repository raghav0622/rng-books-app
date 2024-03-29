'use client';
import { Button } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { HTMLAttributes } from 'react';

function MicroscopeIcon(props: HTMLAttributes<SVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 18h8" />
      <path d="M3 22h18" />
      <path d="M14 22a7 7 0 1 0 0-14h-1" />
      <path d="M9 14h2" />
      <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
      <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
    </svg>
  );
}

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center flex-grow px-4 text-center sm:px-6 lg:px-8">
      <MicroscopeIcon className="w-24 h-24 mx-auto mb-8 text-gray-400 dark:text-gray-500" />
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
        404 - Page Not Found
      </h1>
      <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
        Oops! The page you&apos;re looking for does not exist. You might have
        followed an incorrect link or the page might have been moved.
      </p>
      <div className="flex gap-4 mt-6">
        <Button
          onClick={() => {
            router.back();
          }}
        >
          Go Back
        </Button>
        <Button
          onClick={() => {
            router.push('/');
          }}
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
