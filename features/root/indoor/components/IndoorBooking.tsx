'use client'

import { useState, useMemo } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle } from 'lucide-react'

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment)

// Mock data for facilities
const facilities = [
  { 
    id: 1, 
    name: 'Cricket Arena', 
    image: '/placeholder.svg?height=100&width=200',
    location: 'Main Building, 2nd Floor',
    operatingHours: '6:00 AM - 10:00 PM',
    pricePerHour: 20
  },
  { 
    id: 2, 
    name: 'Dance Studio', 
    image: '/placeholder.svg?height=100&width=200',
    location: 'East Wing, 1st Floor',
    operatingHours: '8:00 AM - 9:00 PM',
    pricePerHour: 15
  },
  { 
    id: 3, 
    name: 'MMA Gym', 
    image: '/placeholder.svg?height=100&width=200',
    location: 'West Wing, Ground Floor',
    operatingHours: '7:00 AM - 11:00 PM',
    pricePerHour: 25
  },
]

// Mock data for bookings
const mockBookings = [
  { id: 1, facilityId: 1, title: 'Booked', start: new Date(2023, 5, 15, 10, 0), end: new Date(2023, 5, 15, 12, 0), status: 'confirmed' },
  { id: 2, facilityId: 1, title: 'Pending', start: new Date(2023, 5, 15, 14, 0), end: new Date(2023, 5, 15, 16, 0), status: 'pending' },
  { id: 3, facilityId: 2, title: 'Booked', start: new Date(2023, 5, 16, 9, 0), end: new Date(2023, 5, 16, 11, 0), status: 'confirmed' },
]

// Mock data for user's upcoming bookings
const userUpcomingBookings = [
  { id: 1, facilityName: 'Cricket Arena', date: '2023-06-20', startTime: '14:00', endTime: '16:00' },
  { id: 2, facilityName: 'Dance Studio', date: '2023-06-22', startTime: '10:00', endTime: '12:00' },
]

export default function IndoorBookingPage() {
  const [selectedFacility, setSelectedFacility] = useState(facilities[0])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [bookingTime, setBookingTime] = useState('09:00')
  const [bookingDuration, setBookingDuration] = useState(1)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const handleFacilityChange = (facilityId: string) => {
    const facility = facilities.find(f => f.id.toString() === facilityId)
    if (facility) setSelectedFacility(facility)
  }

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedDate(slotInfo.start)
    setBookingTime(moment(slotInfo.start).format('HH:mm'))
    setIsBookingModalOpen(true)
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the booking data to your backend
    console.log('Booking submitted:', { 
      facility: selectedFacility.name, 
      date: selectedDate, 
      time: bookingTime, 
      duration: bookingDuration 
    })
    setIsBookingModalOpen(false)
  }

  const eventStyleGetter = (event: any) => {
    let backgroundColor = '#10B981' // default green for available
    if (event.status === 'confirmed') {
      backgroundColor = '#EF4444' // red for confirmed
    } else if (event.status === 'pending') {
      backgroundColor = '#F59E0B' // yellow for pending
    }
    return { style: { backgroundColor } }
  }

  const filteredEvents = useMemo(() => 
    mockBookings.filter(booking => booking.facilityId === selectedFacility.id),
    [selectedFacility]
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Indoor Facility Booking</h1>

      {/* Facility Selection */}
      <div className="mb-6">
        <Select onValueChange={handleFacilityChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a facility" />
          </SelectTrigger>
          <SelectContent>
            {facilities.map((facility) => (
              <SelectItem key={facility.id} value={facility.id.toString()}>
                {facility.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Timetable / Calendar */}
        <div className="md:col-span-2">
          <Card>
            <CardContent>
              <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onSelectSlot={handleSelectSlot}
                selectable
                eventPropGetter={eventStyleGetter}
                views={['day', 'week', 'month']}
              />
            </CardContent>
          </Card>
        </div>

        {/* Facility Information */}
        <div>
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">{selectedFacility.name}</h2>
              <img
                src={selectedFacility.image}
                alt={selectedFacility.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <p className="text-sm text-gray-600 mb-4">
                Location: {selectedFacility.location}
                <br />
                Operating Hours: {selectedFacility.operatingHours}
                <br />
                Price: ${selectedFacility.pricePerHour} per hour
              </p>
              <Button onClick={() => setIsBookingModalOpen(true)} className="w-full">
                Book Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <Card className="mt-6">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Your Upcoming Bookings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userUpcomingBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{booking.facilityName}</h3>
                  <p>{booking.date}</p>
                  <p>{booking.startTime} - {booking.endTime}</p>
                  <div className="mt-2">
                    <Button variant="outline" size="sm" className="mr-2">Reschedule</Button>
                    <Button variant="outline" size="sm">Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book {selectedFacility.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={moment(selectedDate).format('YYYY-MM-DD')} readOnly />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input 
                id="time" 
                type="time" 
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input 
                id="duration" 
                type="number" 
                min="1" 
                max="4" 
                value={bookingDuration}
                onChange={(e) => setBookingDuration(parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label>Total Cost</Label>
              <p className="text-lg font-semibold">${selectedFacility.pricePerHour * bookingDuration}</p>
            </div>
            <Button type="submit" className="w-full">
              Confirm Booking
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Support Chat Widget */}
      <div className="fixed bottom-4 right-4">
        <Button onClick={() => setIsChatOpen(!isChatOpen)} className="rounded-full w-12 h-12">
          <MessageCircle className="h-6 w-6" />
        </Button>
        {isChatOpen && (
          <Card className="absolute bottom-16 right-0 w-80">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Support Chat</h3>
              <ScrollArea className="h-60 w-full rounded-md border p-4">
                <p>Welcome to our support chat! How can we help you today?</p>
              </ScrollArea>
              <div className="mt-2 flex">
                <Input placeholder="Type your message..." className="flex-grow" />
                <Button className="ml-2">Send</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

