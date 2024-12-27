import React from 'react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  itemsPerPage: number
  totalItems: number
  paginate: (pageNumber: number) => void
  currentPage: number
}

export const Pagination: React.FC<PaginationProps> = ({
  itemsPerPage,
  totalItems,
  paginate,
  currentPage,
}) => {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <nav>
      <ul className="flex justify-center space-x-2">
        {pageNumbers.map(number => (
          <li key={number}>
            <Button
              variant={currentPage === number ? 'default' : 'outline'}
              size="sm"
              onClick={() => paginate(number)}
            >
              {number}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

