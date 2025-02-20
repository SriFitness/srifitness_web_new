'use client'

import React from 'react';
import styles from '@/app/admin/users/[userId]/User.module.css';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CircleIcon } from 'lucide-react'; // Import CircleIcon from lucide-react

interface WorkoutPlan {
  workoutNumber: number;
  createdDate: string;
  status: 'ok' | 'attention' | 'expired' | 'old';
  id: string;
}

interface WorkoutTableProps {
  workoutPlans: WorkoutPlan[];
}

const getStatusConfig = (status: WorkoutPlan['status']) => {
  const configs = {
    ok: {
      label: 'Active',
      classes: 'bg-green-50 text-green-700 border border-green-200 ring-green-600/20',
      dotColor: 'text-green-500'
    },
    attention: {
      label: 'Needs Attention',
      classes: 'bg-yellow-50 text-yellow-800 border border-yellow-200 ring-yellow-600/20',
      dotColor: 'text-yellow-500'
    },
    expired: {
      label: 'Expired',
      classes: 'bg-red-50 text-red-700 border border-red-200 ring-red-600/20',
      dotColor: 'text-red-500'
    },
    old: {
      label: 'Archived',
      classes: 'bg-gray-50 text-gray-700 border border-gray-200 ring-gray-600/20',
      dotColor: 'text-gray-500'
    }
  };
  return configs[status];
};

export function WorkoutTable({ workoutPlans }: WorkoutTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Workout Number</TableHead>
          <TableHead>Created Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workoutPlans.map((plan) => {
          const statusConfig = getStatusConfig(plan.status);
          return (
            <TableRow key={plan.id}>
              <TableCell>Workout {plan.workoutNumber}</TableCell>
              <TableCell>{plan.createdDate}</TableCell>
              <TableCell>
                <Badge 
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.classes}`}
                >
                  <CircleIcon className={`h-2 w-2 ${statusConfig.dotColor}`} />
                  {statusConfig.label}
                </Badge>
              </TableCell>
              <TableCell>
                <Button asChild size="sm">
                  <Link href={`/admin/workout/${plan.id}`}>View Details</Link>
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}