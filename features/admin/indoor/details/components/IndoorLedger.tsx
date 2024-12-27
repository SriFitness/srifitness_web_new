//features/admin/indoor/details/components/

'use client'

import React, { useState, useEffect } from 'react'
import { LedgerEntry } from './LedgerEntry'
import { LedgerFilter } from './LedgerFilter'
import { Pagination } from './Pagination'
import { useToast } from "@/hooks/use-toast"

interface LedgerItem {
  id: string
  type: 'booking' | 'cancellation' | 'rescheduling' | 'unavailable'
  userId?: string
  userName?: string
  startTime: string
  endTime: string
  createdAt: string
  details: string
}

export const IndoorLedger: React.FC = () => {
  const [ledgerItems, setLedgerItems] = useState<LedgerItem[]>([])
  const [filteredItems, setFilteredItems] = useState<LedgerItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [filter, setFilter] = useState({ type: 'all', dateRange: 'all' })
  const { toast } = useToast()

  useEffect(() => {
    fetchLedgerItems()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [ledgerItems, filter])

  const fetchLedgerItems = async () => {
    try {
      const response = await fetch('/api/admin/indoor/ledger')
      if (!response.ok) throw new Error('Failed to fetch ledger items')
      const data = await response.json()
      setLedgerItems(data)
    } catch (error) {
      console.error('Error fetching ledger items:', error)
      toast({
        title: "Error fetching ledger items",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const applyFilters = () => {
    let filtered = [...ledgerItems]

    if (filter.type !== 'all') {
      filtered = filtered.filter(item => item.type === filter.type)
    }

    if (filter.dateRange !== 'all') {
      const now = new Date()
      const pastDate = new Date()
      switch (filter.dateRange) {
        case 'day':
          pastDate.setDate(now.getDate() - 1)
          break
        case 'week':
          pastDate.setDate(now.getDate() - 7)
          break
        case 'month':
          pastDate.setMonth(now.getMonth() - 1)
          break
      }
      filtered = filtered.filter(item => new Date(item.createdAt) >= pastDate)
    }

    setFilteredItems(filtered)
    setCurrentPage(1)
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="space-y-6">
      <LedgerFilter setFilter={setFilter} />
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {currentItems.map(item => (
          <LedgerEntry key={item.id} item={item} />
        ))}
      </div>
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredItems.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  )
}

