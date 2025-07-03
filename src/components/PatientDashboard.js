
import { useAuth } from "../contexts/AuthContext"
import { useData } from "../contexts/DataContext"
import { FiCalendar, FiFileText, FiDollarSign, FiClock, FiCheckCircle, FiDownload } from "react-icons/fi"

const PatientDashboard = () => {
  const { user } = useAuth()
  const { patients, incidents } = useData()

  const patient = patients.find((p) => p.id === user?.patientId)
  const patientIncidents = incidents.filter((i) => i.patientId === user?.patientId)

  const upcomingAppointments = patientIncidents
    .filter((i) => new Date(i.appointmentDate) > new Date() && i.status === "Scheduled")
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))

  const pastAppointments = patientIncidents
    .filter((i) => i.status === "Completed")
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))

  const totalCost = pastAppointments.filter((i) => i.cost).reduce((sum, i) => sum + (i.cost || 0), 0)

  const stats = [
    {
      title: "Upcoming Appointments",
      value: upcomingAppointments.length,
      icon: FiCalendar,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Completed Treatments",
      value: pastAppointments.length,
      icon: FiCheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Total Spent",
      value: `$${totalCost.toLocaleString()}`,
      icon: FiDollarSign,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ]

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FiFileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Patient information not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {patient.name}!</h1>
            <p className="text-blue-100">Here's your dental care overview</p>
          </div>
          <div className="hidden lg:flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full">
            <FiFileText className="h-10 w-10" />
          </div>
        </div>
      </div>

      {/* Patient Info Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Your Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <FiCalendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-500">Date of Birth</p>
            <p className="text-lg font-semibold text-gray-900">{new Date(patient.dob).toLocaleDateString()}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <FiFileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-500">Contact</p>
            <p className="text-lg font-semibold text-gray-900">{patient.contact}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <FiCheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-500">Health Info</p>
            <p className="text-lg font-semibold text-gray-900">{patient.healthInfo}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`flex items-center justify-center w-12 h-12 ${stat.bgColor} rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
            <FiClock className="h-6 w-6 text-gray-400" />
          </div>

          <div className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <FiCalendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming appointments</p>
              </div>
            ) : (
              upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{appointment.title}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {appointment.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{appointment.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(appointment.appointmentDate).toLocaleString()}
                    </p>
                  </div>
                  {appointment.comments && (
                    <p className="text-sm text-gray-500 mt-2 italic">Note: {appointment.comments}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Treatment History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Treatment History</h2>
            <FiFileText className="h-6 w-6 text-gray-400" />
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {pastAppointments.length === 0 ? (
              <div className="text-center py-8">
                <FiCheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No treatment history</p>
              </div>
            ) : (
              pastAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{appointment.title}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {appointment.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{appointment.description}</p>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">
                      {new Date(appointment.appointmentDate).toLocaleDateString()}
                    </span>
                    {appointment.cost && (
                      <span className="text-sm font-semibold text-gray-900">${appointment.cost}</span>
                    )}
                  </div>

                  {appointment.treatment && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Treatment:</strong> {appointment.treatment}
                    </p>
                  )}

                  {appointment.files && appointment.files.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
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
                            <FiDownload className="h-3 w-3 mr-1" />
                            {file.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard
