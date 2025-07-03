

import { useState } from "react"
import { useData } from "../contexts/DataContext"
import Layout from "../components/Layout"
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiUser, FiPhone, FiCalendar, FiFileText } from "react-icons/fi"

const Patients = () => {
  const { patients, incidents, addPatient, updatePatient, deletePatient } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    contact: "",
    healthInfo: "",
  })

  const filteredPatients = patients.filter(
    (patient) => patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || patient.contact.includes(searchTerm),
  )

  const resetForm = () => {
    setFormData({
      name: "",
      dob: "",
      contact: "",
      healthInfo: "",
    })
    setEditingPatient(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.dob || !formData.contact) return

    if (editingPatient) {
      updatePatient(editingPatient.id, formData)
    } else {
      addPatient(formData)
    }

    resetForm()
    setIsModalOpen(false)
  }

  const handleEdit = (patient) => {
    setEditingPatient(patient)
    setFormData({
      name: patient.name,
      dob: patient.dob,
      contact: patient.contact,
      healthInfo: patient.healthInfo,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (patientId) => {
    if (window.confirm("Are you sure you want to delete this patient? This will also delete all their appointments.")) {
      deletePatient(patientId)
    }
  }

  const getPatientStats = (patientId) => {
    const patientIncidents = incidents.filter((incident) => incident.patientId === patientId)
    const totalAppointments = patientIncidents.length
    const completedAppointments = patientIncidents.filter((i) => i.status === "Completed").length
    const totalSpent = patientIncidents
      .filter((i) => i.status === "Completed" && i.cost)
      .reduce((sum, i) => sum + (i.cost || 0), 0)

    return { totalAppointments, completedAppointments, totalSpent }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Patient Management</h1>
              <p className="text-blue-100">Manage your dental center patients</p>
            </div>
            <button
              onClick={() => {
                resetForm()
                setIsModalOpen(true)
              }}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center"
            >
              <FiPlus className="h-5 w-5 mr-2" />
              Add Patient
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search patients by name or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => {
            const stats = getPatientStats(patient.id)
            return (
              <div
                key={patient.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <FiUser className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-600">{stats.totalAppointments} appointments</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(patient)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FiEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(patient.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiCalendar className="h-4 w-4 mr-2" />
                    <span>DOB: {new Date(patient.dob).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiPhone className="h-4 w-4 mr-2" />
                    <span>{patient.contact}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiFileText className="h-4 w-4 mr-2" />
                    <span>{patient.healthInfo || "No health information"}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">{stats.completedAppointments}</p>
                      <p className="text-xs text-gray-500">Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">${stats.totalSpent}</p>
                      <p className="text-xs text-gray-500">Total Spent</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <FiUser className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No patients found.</p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingPatient ? "Edit Patient" : "Add New Patient"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                  <input
                    type="tel"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Health Information</label>
                  <textarea
                    value={formData.healthInfo}
                    onChange={(e) => setFormData({ ...formData, healthInfo: e.target.value })}
                    className="form-textarea"
                    rows="3"
                    placeholder="Allergies, medical conditions, etc."
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false)
                      resetForm()
                    }}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
                    {editingPatient ? "Update" : "Add"} Patient
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Patients
