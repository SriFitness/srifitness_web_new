//features/(root)/indoor/components/BookingCalendar.tsx

import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer, View } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const localizer = momentLocalizer(moment)

interface Event {
    id: number | string;
    title: string;
    start: Date;
    end: Date;
}

interface BookingCalendarProps {
    events: Event[];
}

export function BookingCalendar({ events }: BookingCalendarProps) {
    const [view, setView] = useState<View>('week')
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const eventStyleGetter = (event: Event) => {
        return {
            style: {
                backgroundColor: '#EF4444',
                borderRadius: '4px',
                opacity: 0.8,
                color: '#fff',
                border: '0px',
                display: 'block'
            }
        }
    }

    const minTime = new Date()
    minTime.setHours(6, 0, 0)
    const maxTime = new Date()
    maxTime.setHours(22, 0, 0)

    const handleViewChange = (newView: string) => {
        setView(newView as View)
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
        >
            <Card className="shadow-lg">
                <CardContent className="p-2 sm:p-6">
                    {isMobile && (
                        <div className="mb-4">
                            <Select onValueChange={handleViewChange} value={view}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select view" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="day">Day</SelectItem>
                                    <SelectItem value="week">Week</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div className="h-[500px] md:h-[600px]">
                        <Calendar
                            localizer={localizer}
                            events={events.map(event => ({
                                ...event,
                                start: new Date(event.start),
                                end: new Date(event.end)
                            }))}
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
                        />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

