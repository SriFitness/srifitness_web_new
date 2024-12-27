//features/admin/indoor/components/ScheduleCalendar.tsx
'use client';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const localizer = momentLocalizer(moment);

interface Booking {
  id: string;
  title: string;
  start: string;
  end: string;
  userId: string;
  userName: string;
}

interface UnavailablePeriod {
  id: string;
  start: string;
  end: string;
  reason: string;
}

interface ScheduleCalendarProps {
  bookings: Booking[];
  unavailablePeriods: UnavailablePeriod[];
}

export function ScheduleCalendar({ bookings, unavailablePeriods }: ScheduleCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<Booking | UnavailablePeriod | null>(null);

  const events = [
    ...bookings.map((booking) => ({
      id: booking.id,
      title: booking.title,
      start: new Date(booking.start),
      end: new Date(booking.end),
      userName: booking.userName,
      type: 'booking',
    })),
    ...unavailablePeriods.map((period) => ({
      id: period.id,
      title: 'Unavailable',
      start: new Date(period.start),
      end: new Date(period.end),
      reason: period.reason,
      type: 'unavailable',
    })),
  ];

  const eventStyleGetter = (event: any) => {
    const style: React.CSSProperties = {
      backgroundColor: event.type === 'booking' ? '#3174ad' : '#ad3131',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    return { style };
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
  };

  const closeDialog = () => {
    setSelectedEvent(null);
  };

  return (
    <>
      <div className="h-[600px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          views={['day', 'week', 'month']}
        />
        {/* <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          selectable={false}
          eventPropGetter={eventStyleGetter}
          views={isMobile ? ['day', 'week'] : ['week']}
          view={view}
          onView={handleViewChange}
          min={minTime}
          max={maxTime}
          step={10}
          timeslots={6}
          toolbar={true}
          formats={{
            timeGutterFormat: (date, culture, localizer) =>
              localizer.format(date, 'HH:mm', culture),
            eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
              `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
          }}
        /> */}
      </div>
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={closeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedEvent.type === 'booking' ? 'Booking Details' : 'Unavailable Period'}
              </DialogTitle>
            </DialogHeader>
            {selectedEvent.type === 'booking' ? (
              <div>
                <p>
                  <strong>User:</strong> {selectedEvent.userName}
                </p>
                <p>
                  <strong>Start:</strong>{' '}
                  {moment(selectedEvent.start).format('MMMM Do YYYY, h:mm a')}
                </p>
                <p>
                  <strong>End:</strong>{' '}
                  {moment(selectedEvent.end).format('MMMM Do YYYY, h:mm a')}
                </p>
              </div>
            ) : (
              <div>
                <p>
                  <strong>Reason:</strong> {selectedEvent.reason}
                </p>
                <p>
                  <strong>Start:</strong>{' '}
                  {moment(selectedEvent.start).format('MMMM Do YYYY, h:mm a')}
                </p>
                <p>
                  <strong>End:</strong>{' '}
                  {moment(selectedEvent.end).format('MMMM Do YYYY, h:mm a')}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
