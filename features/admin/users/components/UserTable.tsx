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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type UserDetailsType = {
  firstName: string;
  secondName: string;
  email: string;
  id: string;
  location: string;
  phone: string;
  membership: string;
  status: 'new' | 'attention' | 'ok';
};

interface UserTableProps {
  users: UserDetailsType[];
}

const UserTable = ({ users }: UserTableProps) => {
  const getStatusLabel = (status: UserDetailsType['status']) => {
    const baseClasses = "px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit";
    
    switch (status) {
      case 'new':
        return (
          <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`}>
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            New
          </Badge>
        );
      case 'attention':
        return (
          <Badge className={`${baseClasses} bg-red-100 text-red-800 border border-red-200`}>
            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
            Attention Required
          </Badge>
        );
      case 'ok':
        return (
          <Badge className={`${baseClasses} bg-green-100 text-green-800 border border-green-200`}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Complete
          </Badge>
        );
      default:
        return (
          <Badge className={`${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`}>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Unknown
          </Badge>
        );
    }
  };

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
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length > 0 ? (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.secondName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.location}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.membership}</TableCell>
              <TableCell>{getStatusLabel(user.status)}</TableCell>
              <TableCell>
                <Button asChild size="sm">
                  <Link href={`/admin/users/${user.id}`}>View Profile</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              No users found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default UserTable;