//features/root/indoor/components/BookingModal.tsx

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (date: Date, startTime: string, endTime: string) => void;
    bookedSlots: { startTime: Date; endTime: Date }[];
    unavailablePeriods: { startTime: Date; endTime: Date }[];
}

export function BookingModal({ isOpen, onClose, onSubmit, bookedSlots, unavailablePeriods }: BookingModalProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setSelectedDate(null);
            setStartTime(null);
            setEndTime(null);
            setError(null);
        }
    }, [isOpen]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 7);

    const isDateDisabled = (date: Date) => {
        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);
        return normalizedDate < today || normalizedDate > maxDate;
    };

    const filterStartTime = (time: Date) => {
        if (!selectedDate) return false;

        const selectedDateTime = new Date(selectedDate);
        selectedDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);

        // Disable times in the past
        if (selectedDateTime < new Date()) return false;

        // Disable times that conflict with booked slots or unavailable periods
        return ![...bookedSlots, ...unavailablePeriods].some(
            (slot) => selectedDateTime >= new Date(slot.startTime) && selectedDateTime < new Date(slot.endTime)
        );
    };

    const filterEndTime = (time: Date) => {
        if (!selectedDate || !startTime) return false;
    
        const startDateTime = new Date(selectedDate);
        startDateTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
    
        const endDateTime = new Date(selectedDate);
        endDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
    
        // Ensure the end time is after the start time
        if (endDateTime <= startDateTime) return false;
    
        // Ensure booking duration is not more than 4 hours
        const maxEndTime = new Date(startDateTime);
        maxEndTime.setHours(maxEndTime.getHours() + 4);
        if (endDateTime > maxEndTime) return false;
    
        // Disable times that conflict with booked slots or unavailable periods
        return ![...bookedSlots, ...unavailablePeriods].some(
            (slot) =>
                endDateTime > new Date(slot.startTime) && endDateTime <= new Date(slot.endTime)
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate) {
            setError("Please select a date.");
            return;
        }
        if (!startTime) {
            setError("Please select a start time.");
            return;
        }
        if (!endTime) {
            setError("Please select an end time.");
            return;
        }

        // Clear error and submit
        setError(null);
        onSubmit(
            selectedDate,
            moment(startTime).format("HH:mm"),
            moment(endTime).format("HH:mm")
        );
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Book Facility</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="date">Date</Label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date: Date | null) => setSelectedDate(date)} // Handle null here
                            minDate={today}
                            maxDate={maxDate}
                            filterDate={(date) => !isDateDisabled(date)}
                            dateFormat="MMMM d, yyyy"
                            className="w-full p-2 border rounded"
                            wrapperClassName="w-full"
                            id="date"
                            placeholderText="Select a date"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="startTime">Start Time</Label>
                        <DatePicker
                            selected={startTime}
                            onChange={(time: Date | null) => setStartTime(time)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={10}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            className="w-full p-2 border rounded"
                            wrapperClassName="w-full"
                            id="startTime"
                            placeholderText="Select start time"
                            filterTime={filterStartTime}
                            required
                            disabled={!selectedDate}
                        />
                    </div>
                    <div>
                        <Label htmlFor="endTime">End Time</Label>
                        <DatePicker
                            selected={endTime}
                            onChange={(time: Date | null) => setEndTime(time)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={10}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            className="w-full p-2 border rounded"
                            wrapperClassName="w-full"
                            id="endTime"
                            placeholderText="Select end time"
                            filterTime={filterEndTime}
                            required
                            disabled={!startTime}
                        />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <Button type="submit" className="w-full">
                        Confirm Booking
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
