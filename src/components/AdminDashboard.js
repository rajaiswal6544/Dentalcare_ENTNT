import { useData } from "../contexts/DataContext"
import { FiUsers, FiCalendar, FiDollarSign, FiActivity, FiTrendingUp, FiClock } from "react-icons/fi"

const AdminDashboard = () => {
  const { patients, incidents } = useData()

  const upcomingAppointments = incidents
    .filter((i) => new Date(i.appointmentDate) > new Date() && i.status === "Scheduled")
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 10)

  const completedTreatments = incidents.filter((i) => i.status === "Completed").length
  const pendingTreatments = incidents.filter((i) => i.status === "Scheduled").length
  const totalRevenue = incidents
    .filter((i) => i.status === "Completed" && i.cost)
    .reduce((sum, i) => sum + (i.cost || 0), 0)

  const topPatients = patients
    .map((patient) => ({
      ...patient,
      appointmentCount: incidents.filter((i) => i.patientId === patient.id).length,
      totalSpent: incidents
        .filter((i) => i.patientId === patient.id && i.status === "Completed" && i.cost)
        .reduce((sum, i) => sum + (i.cost || 0), 0),
    }))
    .sort((a, b) => b.appointmentCount - a.appointmentCount)
    .slice(0, 5)

  const stats = [
    {
      title: "Total Patients",
      value: patients.length,
      icon: FiUsers,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Pending Treatments",
      value: pendingTreatments,
      icon: FiClock,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      title: "Completed Treatments",
      value: completedTreatments,
      icon: FiActivity,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: FiDollarSign,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Doctor!</h1>
            <p className="text-blue-100">Here's what's happening at your dental center today.</p>
          </div>
          <div className="hidden lg:flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full">
            <FiTrendingUp className="h-10 w-10" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <FiCalendar className="h-6 w-6 text-gray-400" />
          </div>

          <div className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <FiCalendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming appointments</p>
              </div>
            ) : (
              upcomingAppointments.map((appointment) => {
                const patient = patients.find((p) => p.id === appointment.patientId)
                return (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{patient?.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{patient?.name}</p>
                        <p className="text-sm text-gray-600">{appointment.title}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(appointment.appointmentDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Top Patients */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top Patients</h2>
            <FiUsers className="h-6 w-6 text-gray-400" />
          </div>

          <div className="space-y-4">
            {topPatients.map((patient, index) => (
              <div
                key={patient.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.contact}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{patient.appointmentCount} appointments</p>
                  <p className="text-xs text-gray-500">${patient.totalSpent} total</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
