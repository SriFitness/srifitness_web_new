/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subMonths, subYears, addYears, eachWeekOfInterval, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, getMonth, getYear, startOfYear, endOfYear } from 'date-fns';
import Cookies from "js-cookie";

interface AttendanceGridProps {
  userId: string;
  initialAttendance?: Array<string>; // ISO date strings of days attended
}

export function AttendanceGrid({ userId, initialAttendance = [] }: AttendanceGridProps) {
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [attendance, setAttendance] = useState<string[]>(initialAttendance);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch attendance data for the selected year
  useEffect(() => {
    const fetchAttendance = async () => {
      setIsLoading(true);
      try {
        const start = format(startOfYear(selectedYear), 'yyyy-MM-dd');
        const end = format(endOfYear(selectedYear), 'yyyy-MM-dd');
        
        const response = await fetch(`/api/user-details/get-attendance/${userId}?start=${start}&end=${end}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("firebaseIdToken")}`,
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setAttendance(data.attendance || []);
        } else {
          console.error('Failed to fetch attendance data');
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, [userId, selectedYear]);

  // Generate weeks for the year
  const generateYearGrid = () => {
    const start = startOfYear(selectedYear);
    const end = endOfYear(selectedYear);
    
    // Get all weeks in the year
    const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 0 });
    
    // For each week, get the days
    return weeks.map(weekStart => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    });
  };

  const yearGrid = generateYearGrid();
  
  // Check if a date is in the attendance array
  const isAttended = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return attendance.includes(dateString);
  };

  // Navigate to previous year
  const goToPreviousYear = () => {
    setSelectedYear(prevYear => subYears(prevYear, 1));
  };

  // Navigate to next year
  const goToNextYear = () => {
    setSelectedYear(prevYear => addYears(prevYear, 1));
  };

  // Generate year options for the dropdown (last 3 years)
  const yearOptions = Array.from({ length: 3 }, (_, i) => {
    const date = subYears(new Date(), i);
    return {
      value: format(date, 'yyyy'),
      label: format(date, 'yyyy')
    };
  });

  // Get month labels for the top of the grid
  interface MonthLabel {
    month: number;
    index: number;
    label: string;
  }
  
  const getMonthLabels = () => {
    const months: MonthLabel[] = [];
    let currentMonth = -1;
  
    yearGrid.forEach(week => {
      const firstDayOfWeek = week[0];
      const month = getMonth(firstDayOfWeek);
      
      if (month !== currentMonth) {
        months.push({
          month,
          index: months.length,
          label: format(firstDayOfWeek, 'MMM')
        });
        currentMonth = month;
      }
    });
    
    return months;
  };

  const monthLabels = getMonthLabels();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Attendance</CardTitle>
        <div className="flex items-center space-x-2">
          <button 
            onClick={goToPreviousYear}
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Previous year"
          >
            ←
          </button>
          
          <Select
            value={format(selectedYear, 'yyyy')}
            onValueChange={(value) => {
              setSelectedYear(new Date(parseInt(value), 0, 1));
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue>{format(selectedYear, 'yyyy')}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <button 
            onClick={goToNextYear}
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Next year"
          >
            →
          </button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <p>Loading attendance data...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Month labels at the top */}
            <div className="flex text-xs text-gray-500 pl-8 mb-1">
              {monthLabels.map(month => (
                <div 
                  key={month.index} 
                  className="flex-1 text-center"
                  style={{ 
                    marginLeft: month.index === 0 ? 0 : '-8px'
                  }}
                >
                  {month.label}
                </div>
              ))}
            </div>
            
            {/* GitHub-style contribution grid */}
            <div className="flex">
              {/* Day labels on the left */}
              <div className="flex flex-col justify-between pr-2 text-xs text-gray-500 h-[104px]">
                <div>Mon</div>
                <div>Wed</div>
                <div>Fri</div>
              </div>
              
              {/* Year grid */}
              <div className="flex gap-1 overflow-x-auto pb-2">
                {yearGrid.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <div 
                        key={`${weekIndex}-${dayIndex}`}
                        className={`
                          w-3 h-3 rounded-sm
                          ${isAttended(day) 
                            ? 'bg-green-500' 
                            : 'bg-gray-100 border border-gray-200'
                          }
                        `}
                        title={format(day, 'EEEE, MMMM d, yyyy')}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end items-center text-xs text-gray-500 mt-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
                <span>Present</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}