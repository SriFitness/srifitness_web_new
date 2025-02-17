'use client'

import React from 'react';
import styles from '@/app/admin/users/[userId]/User.module.css';

interface WorkoutPlan {
  workoutNumber: number;
  createdDate: string;
  expireDate: string;
  isExpired: boolean;
}

interface WorkoutTableProps {
  workoutPlans: WorkoutPlan[];
}

export function WorkoutTable({ workoutPlans }: WorkoutTableProps) {

    function onInfoClick(plan: WorkoutPlan): void {
        console.log(plan);
    }

  return (
    <div className={styles['workout-table-container']}>
      <table className={styles['workout-table']}>
        <thead>
          <tr>
            <th>Workout Number</th>
            <th>Created Date</th>
            <th>Expire Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {workoutPlans.map((plan) => (
            <tr key={plan.workoutNumber}>
              <td>{plan.workoutNumber}</td>
              <td>{plan.createdDate}</td>
              <td>{plan.expireDate}</td>
              <td>
                <span
                  className={
                    plan.isExpired
                      ? styles['status-expired']
                      : styles['status-ok']
                  }
                >
                  {plan.isExpired ? 'Expired' : 'OK'}
                </span>
              </td>
              <td>
                <button
                  className={styles['info-button']}
                  onClick={() => onInfoClick(plan)} // Handle the button click
                >
                  Info
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
