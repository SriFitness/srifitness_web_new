'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { getUsers } from '../server/actions/users';
import { WaveSkeleton } from '@/components/ui/wave-skeleton';

// --- User Type Definition ---
type UserDetailsType = {
  firstName: string;
  secondName: string;
  email: string;
  id: string;
  location: string;
  phone: string;
  membership: string;
};

const UserTable = () => {
  const [userDetails, setUserDetails] = useState<UserDetailsType[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const data = await getUsers();
      setUserDetails(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <Table>
      <TableCaption>A list of registered users.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Membership</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          // Wave Skeleton rows displayed during loading
          Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <WaveSkeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <WaveSkeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <WaveSkeleton className="h-4 w-40" />
              </TableCell>
              <TableCell>
                <WaveSkeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <WaveSkeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <WaveSkeleton className="h-4 w-24" />
              </TableCell>
            </TableRow>
          ))
        ) : userDetails && userDetails.length > 0 ? (
          userDetails.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.secondName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.location}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.membership}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              No users found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default UserTable;

