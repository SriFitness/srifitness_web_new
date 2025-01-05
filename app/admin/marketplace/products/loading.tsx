//root/app/admin/dashboard/loading.tsx

import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { WaveSkeleton } from "@/components/ui/wave-skeleton"

export default function Loading() {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Search products..."
        className="max-w-sm"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <WaveSkeleton className="w-12 h-12 rounded-md" />
              </TableCell>
              <TableCell>
                <WaveSkeleton className="w-32 h-6" />
              </TableCell>
              <TableCell>
                <WaveSkeleton className="w-24 h-6" />
              </TableCell>
              <TableCell>
                <WaveSkeleton className="w-12 h-6" />
              </TableCell>
              <TableCell>
                <WaveSkeleton className="w-16 h-6" />
              </TableCell>
              <TableCell>
                <WaveSkeleton className="w-32 h-8" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

