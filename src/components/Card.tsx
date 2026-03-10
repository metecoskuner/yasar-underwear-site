import React from 'react';

type Props = {
  title: React.ReactNode;
  desc?: React.ReactNode;
  className?: string;
};

export default function Card({ title, desc, className = '' }: Props) {
  return (
    <article className={`block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition ${className}`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      {desc ? <p className="mt-2 text-gray-600">{desc}</p> : null}
    </article>
  );
}
