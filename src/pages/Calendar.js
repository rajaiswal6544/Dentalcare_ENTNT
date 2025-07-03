"use client"

import { useState } from "react"
import { useData } from "../contexts/DataContext"
import Layout from "../components/Layout"
import { FiChevronLeft, FiChevronRight, FiCalendar, FiClock, FiUser, FiX, FiFileText } from "react-icons/fi"

const Calendar = () => {
  const { patients, incidents } = useData()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState("month")
  const [selectedDate, setSelectedDate] = useState(null)
  const [showDayModal, setShowDayModal] = useState(false)

  const today = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(currentMonth - 1)
    } else {
      newDate.setMonth(currentMonth + 1)
    }
    setCurrentDate(newDate)
  }

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setDate(currentDate.getDate() - 7)
    } else {
      newDate.setDate(currentDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  const getAppointmentsForDate = (date) => {
    const dateString = date.toDateString()
    return incidents.filter((incident) => {
      const appointmentDate = new Date(incident.appointmentDate)
      return appointmentDate.toDateString() === dateString && incident.status === "Scheduled"
    })
  }

  const getAllAppointmentsForDate = (date) => {
    const dateString = date.toDateString()
    return incidents.filter((incident) => {
      const appointmentDate = new Date(incident.appointmentDate)
      return appointmentDate.toDateString() === dateString
    })
  }

  const handleDayClick = (date) => {
    setSelectedDate(date)
    setShowDayModal(true)
  }

  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)

    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDates.push(date)
    }
    return weekDates
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderMonthView = () => {
    const days = []
    const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 bg-gray-50"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const appointments = getAppointmentsForDate(date)
      const allAppointments = getAllAppointmentsForDate(date)
      const isToday = date.toDateString() === today.toDateString()

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 p-1 overflow-y-auto cursor-pointer transition-colors ${
            isToday ? "bg-blue-50 border-blue-300" : "bg-white hover:bg-gray-50"
          } ${allAppointments.length > 0 ? "hover:shadow-md" : ""}`}
          onClick={() => handleDayClick(date)}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : "text-gray-900"}`}>{day}</div>
          <div className="space-y-1">
            {appointments.slice(0, 2).map((appointment) => {
              const patient = patients.find((p) => p.id === appointment.patientId)
              return (
                <div
                  key={appointment.id}
                  className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate"
                  title={`${patient?.name} - ${appointment.title}`}
                >
                  {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  {patient?.name}
                </div>
              )
            })}
            {appointments.length > 2 && <div className="text-xs text-gray-500">+{appointments.length - 2} more</div>}
            {allAppointments.length > appointments.length && (
              <div className="text-xs text-orange-600">+{allAppointments.length - appointments.length} other</div>
            )}
          </div>
        </div>,
      )
    }

    // Fill remaining cells
    const remainingCells = totalCells - days.length
    for (let i = 0; i < remainingCells; i++) {
      days.push(<div key={`empty-end-${i}`} className="h-24 border border-gray-200 bg-gray-50"></div>)
    }

    return days
  }

  const renderWeekView = () => {
    const weekDates = getWeekDates()

    return (
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((date, index) => {
          const appointments = getAppointmentsForDate(date)
          const allAppointments = getAllAppointmentsForDate(date)
          const isToday = date.toDateString() === today.toDateString()

          return (
            <div key={index} className="min-h-96">
              <div
                className={`text-center p-2 border-b cursor-pointer transition-colors ${
                  isToday ? "bg-blue-50 text-blue-600" : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => handleDayClick(date)}
              >
                <div className="text-sm font-medium">{dayNames[index]}</div>
                <div className="text-lg font-bold">{date.getDate()}</div>
                {allAppointments.length > 0 && (
                  <div className="text-xs text-gray-500">{allAppointments.length} appts</div>
                )}
              </div>
              <div className="p-2 space-y-2 min-h-80">
                {appointments.map((appointment) => {
                  const patient = patients.find((p) => p.id === appointment.patientId)
                  return (
                    <div
                      key={appointment.id}
                      className="bg-blue-100 text-blue-800 p-2 rounded text-sm cursor-pointer hover:bg-blue-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDayClick(date)
                      }}
                    >
                      <div className="font-medium">
                        {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="truncate">{patient?.name}</div>
                      <div className="text-xs truncate">{appointment.title}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const selectedDateAppointments = selectedDate ? getAllAppointmentsForDate(selectedDate) : []

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Calendar</h1>
              <p className="text-blue-100">View and manage appointments - Click on any day to see details</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setView("month")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === "month" ? "bg-white text-blue-600" : "bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setView("week")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === "week" ? "bg-white text-blue-600" : "bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                }`}
              >
                Week
              </button>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => (view === "month" ? navigateMonth("prev") : navigateWeek("prev"))}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <FiCalendar className="h-5 w-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  {view === "month"
                    ? `${monthNames[currentMonth]} ${currentYear}`
                    : `Week of ${getWeekDates()[0].toLocaleDateString()}`}
                </h2>
              </div>
              <button
                onClick={() => (view === "month" ? navigateMonth("next") : navigateWeek("next"))}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Today
            </button>
          </div>

          {view === "month" ? (
            <>
              {/* Month view header */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {dayNames.map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded">
                    {day}
                  </div>
                ))}
              </div>
              {/* Month view calendar */}
              <div className="grid grid-cols-7 gap-1">{renderMonthView()}</div>
            </>
          ) : (
            renderWeekView()
          )}
        </div>

        {/* Legend */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span className="text-sm text-gray-600">Scheduled Appointments</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-sm text-gray-600">Completed Treatments</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span className="text-sm text-gray-600">Cancelled Appointments</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-50 border border-blue-300 rounded"></div>
              <span className="text-sm text-gray-600">Today</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiClock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Click any day to see all appointments</span>
            </div>
          </div>
        </div>

        {/* Day Details Modal */}
        {showDayModal && selectedDate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {selectedDateAppointments.length} appointment{selectedDateAppointments.length !== 1 ? "s" : ""}{" "}
                    scheduled
                  </p>
                </div>
                <button
                  onClick={() => setShowDayModal(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {selectedDateAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <FiCalendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No appointments scheduled for this day</p>
                  </div>
                ) : (
                  selectedDateAppointments
                    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
                    .map((appointment) => {
                      const patient = patients.find((p) => p.id === appointment.patientId)
                      return (
                        <div
                          key={appointment.id}
                          className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                                <FiUser className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{appointment.title}</h3>
                                <p className="text-sm text-gray-600">{patient?.name}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center text-sm text-gray-600 mb-1">
                                <FiClock className="h-4 w-4 mr-1" />
                                {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}
                              >
                                {appointment.status}
                              </span>
                            </div>
                          </div>

                          {appointment.description && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-700">
                                <strong>Description:</strong> {appointment.description}
                              </p>
                            </div>
                          )}

                          {appointment.comments && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-700">
                                <strong>Comments:</strong> {appointment.comments}
                              </p>
                            </div>
                          )}

                          {appointment.treatment && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-700">
                                <strong>Treatment:</strong> {appointment.treatment}
                              </p>
                            </div>
                          )}

                          {appointment.cost && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-700">
                                <strong>Cost:</strong> ${appointment.cost}
                              </p>
                            </div>
                          )}

                          {appointment.nextDate && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-700">
                                <strong>Next Appointment:</strong> {new Date(appointment.nextDate).toLocaleString()}
                              </p>
                            </div>
                          )}

                          {appointment.files && appointment.files.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                              <div className="flex flex-wrap gap-2">
                                {appointment.files.map((file, index) => (
                                  <a
                                    key={index}
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-100 transition-colors"
                                  >
                                    <FiFileText className="h-3 w-3 mr-1" />
                                    {file.name}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center text-xs text-gray-500">
                              <FiUser className="h-3 w-3 mr-1" />
                              <span>Patient Contact: {patient?.contact}</span>
                              {patient?.healthInfo && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span>Health Info: {patient.healthInfo}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowDayModal(false)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Calendar
