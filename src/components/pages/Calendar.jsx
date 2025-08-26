import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  User,
  Package,
  DollarSign,
  Bell
} from 'lucide-react';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Sample events data
  const events = {
    '2024-01-15': [
      { type: 'expiration', title: 'Contract Expiration', customer: 'John Doe', unit: 'A-102', priority: 'high' },
      { type: 'payment', title: 'Payment Due', customer: 'Jane Smith', unit: 'A-103', amount: '$300' }
    ],
    '2024-01-20': [
      { type: 'maintenance', title: 'Scheduled Maintenance', unit: 'B-204', time: '10:00 AM' }
    ],
    '2024-01-25': [
      { type: 'expiration', title: 'Contract Expiration', customer: 'Mike Johnson', unit: 'B-202', priority: 'medium' }
    ],
    '2024-01-28': [
      { type: 'payment', title: 'Payment Due', customer: 'Sarah Wilson', unit: 'B-203', amount: '$225' },
      { type: 'inspection', title: 'Unit Inspection', unit: 'C-301', time: '2:00 PM' }
    ]
  };

  const upcomingEvents = [
    { date: '2024-01-15', type: 'expiration', title: 'Contract Expiration - A-102', customer: 'John Doe', daysLeft: 5 },
    { date: '2024-01-15', type: 'payment', title: 'Payment Due - A-103', customer: 'Jane Smith', daysLeft: 5 },
    { date: '2024-01-20', type: 'maintenance', title: 'Maintenance - B-204', time: '10:00 AM', daysLeft: 10 },
    { date: '2024-01-25', type: 'expiration', title: 'Contract Expiration - B-202', customer: 'Mike Johnson', daysLeft: 15 },
    { date: '2024-01-28', type: 'payment', title: 'Payment Due - B-203', customer: 'Sarah Wilson', daysLeft: 18 }
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getDateKey = (day) => {
    if (!day) return null;
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const hasEvents = (day) => {
    const dateKey = getDateKey(day);
    return dateKey && events[dateKey] && events[dateKey].length > 0;
  };

  const getEventType = (day) => {
    const dateKey = getDateKey(day);
    if (!dateKey || !events[dateKey]) return null;
    
    const types = events[dateKey].map(e => e.type);
    if (types.includes('expiration')) return 'danger';
    if (types.includes('payment')) return 'warning';
    if (types.includes('maintenance')) return 'info';
    return 'default';
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-500 mt-1">Track important dates and contract expirations</p>
        </div>
        <Button variant="primary">
          <CalendarIcon className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{formatMonth(currentMonth)}</CardTitle>
                <div className="flex space-x-2">
                  <button
                    onClick={previousMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date())}
                    className="px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {/* Week days header */}
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-500 py-2"
                  >
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {days.map((day, index) => (
                  <motion.div
                    key={index}
                    whileHover={day ? { scale: 1.05 } : {}}
                    className={`
                      aspect-square p-2 border rounded-lg transition-all
                      ${day ? 'cursor-pointer hover:shadow-md' : ''}
                      ${selectedDate === getDateKey(day) ? 'bg-primary-50 border-primary-500' : 'border-gray-200'}
                      ${hasEvents(day) ? 'font-semibold' : ''}
                    `}
                    onClick={() => day && setSelectedDate(getDateKey(day))}
                  >
                    {day && (
                      <div className="h-full flex flex-col">
                        <div className="flex justify-between items-start">
                          <span className="text-sm">{day}</span>
                          {hasEvents(day) && (
                            <Badge variant={getEventType(day)} size="sm">
                              {events[getDateKey(day)].length}
                            </Badge>
                          )}
                        </div>
                        {hasEvents(day) && (
                          <div className="mt-1 space-y-1">
                            {events[getDateKey(day)].slice(0, 2).map((event, i) => (
                              <div
                                key={i}
                                className={`text-xs p-1 rounded truncate ${
                                  event.type === 'expiration' ? 'bg-red-100 text-red-700' :
                                  event.type === 'payment' ? 'bg-yellow-100 text-yellow-700' :
                                  event.type === 'maintenance' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {event.title}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Upcoming Events</span>
                <Badge variant="warning">
                  <Bell className="w-3 h-3 mr-1" />
                  {upcomingEvents.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-lg border ${
                    event.type === 'expiration' ? 'bg-red-50 border-red-200' :
                    event.type === 'payment' ? 'bg-yellow-50 border-yellow-200' :
                    event.type === 'maintenance' ? 'bg-blue-50 border-blue-200' :
                    'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{event.title}</p>
                      {event.customer && (
                        <p className="text-xs text-gray-600 flex items-center mt-1">
                          <User className="w-3 h-3 mr-1" />
                          {event.customer}
                        </p>
                      )}
                      {event.time && (
                        <p className="text-xs text-gray-600 flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {event.time}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        {event.date}
                      </p>
                    </div>
                    <Badge
                      variant={event.daysLeft <= 7 ? 'danger' : 'warning'}
                      size="sm"
                      pulse={event.daysLeft <= 3}
                    >
                      {event.daysLeft}d
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Event Legend */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Event Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Contract Expiration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Payment Due</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Maintenance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Inspection</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && events[selectedDate] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Events on {selectedDate}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events[selectedDate].map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-2 h-2 rounded-full ${
                        event.type === 'expiration' ? 'bg-red-500' :
                        event.type === 'payment' ? 'bg-yellow-500' :
                        event.type === 'maintenance' ? 'bg-blue-500' :
                        'bg-gray-500'
                      }`}></div>
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          {event.customer && (
                            <span className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {event.customer}
                            </span>
                          )}
                          {event.unit && (
                            <span className="flex items-center">
                              <Package className="w-3 h-3 mr-1" />
                              {event.unit}
                            </span>
                          )}
                          {event.amount && (
                            <span className="flex items-center font-semibold text-gray-900">
                              <DollarSign className="w-3 h-3 mr-1" />
                              {event.amount}
                            </span>
                          )}
                          {event.time && (
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {event.time}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {event.priority && (
                      <Badge variant={event.priority === 'high' ? 'danger' : 'warning'}>
                        {event.priority} priority
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Calendar;