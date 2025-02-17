'use client';

import { useState } from 'react';
import styles from '@/app/admin/users/[userId]/User.module.css';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

export function CollapsibleSection({ title, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`${styles['futuristic-card']}`}>
      <div
        className="collapsible-header cursor-pointer flex justify-between items-center p-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-bold">{title}</h2>
        <span
          className={`${styles['arrow-icon']} ${isOpen ? styles['open'] : ''}`}
        >
          &#8250;
        </span>
      </div>
      <div
        className={`${styles['collapsible-content']} ${
          isOpen ? styles['show'] : styles['hide']
        }`}
      >
        {children}
      </div>
    </div>
  );
}
