

import { useState } from "react"
import { useData } from "../contexts/DataContext"
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiCalendar,
  FiUser,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiX,
  FiUpload,
} from "react-icons/fi"
import Layout from "../components/Layout"

const Appointments = () => {
  const { patients, incidents, addIncident, updateIncident, deleteIncident } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIncident, setEditingIncident] = useState(null)
  const [formData, setFormData] = useState({
    patientId: "",
    title: "",
    description: "",
    comments: "",
    appointmentDate: "",
    cost: "",
    treatment: "",
    status: "Scheduled",
    nextDate: "",
  })
  const [uploadedFiles, setUploadedFiles] = useState([])

  const filteredIncidents = incidents.filter((incident) => {
    const patient = patients.find((p) => p.id === incident.patientId)
    const matchesSearch =
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const resetForm = () => {
    setFormData({
      patientId: "",
      title: "",
      description: "",
      comments: "",
      appointmentDate: "",
      cost: "",
      treatment: "",
      status: "Scheduled",
      nextDate: "",
    })
    setUploadedFiles([])
    setEditingIncident(null)
  }

  const handleFileUpload = (e) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const fileData = {
          name: file.name,
          url: event.target.result,
        }
        setUploadedFiles((prev) => [...prev, fileData])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.patientId || !formData.title || !formData.appointmentDate) return

    const incidentData = {
      ...formData,
      cost: formData.cost ? Number.parseFloat(formData.cost) : undefined,
      files: uploadedFiles,
    }

    if (editingIncident) {
      updateIncident(editingIncident.id, incidentData)
    } else {
      addIncident(incidentData)
    }

    resetForm()
    setIsModalOpen(false)
  }

  const handleEdit = (incident) => {
    setEditingIncident(incident)
    setFormData({
      patientId: incident.patientId,
      title: incident.title,
      description: incident.description,
      comments: incident.comments,
      appointmentDate: incident.appointmentDate,
      cost: incident.cost?.toString() || "",
      treatment: incident.treatment || "",
      status: incident.status,
      nextDate: incident.nextDate || "",
    })
    setUploadedFiles(incident.files || [])
    setIsModalOpen(true)
  }

  const handleDelete = (incidentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      deleteIncident(incidentId)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "status-completed"
      case "Scheduled":
        return "status-scheduled"
      case "Cancelled":
        return "status-cancelled"
      default:
        return "status-scheduled"
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Appointment Management</h1>
              <p className="text-blue-100">Manage patient appointments and treatments</p>
            </div>
            <button
              onClick={() => {
                resetForm()
                setIsModalOpen(true)
              }}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center"
            >
              <FiPlus className="h-5 w-5 mr-2" />
              Add Appointment
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by patient name or appointment title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select w-full sm:w-48"
          >
            <option value="all">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredIncidents.map((incident) => {
            const patient = patients.find((p) => p.id === incident.patientId)
            return (
              <div
                key={incident.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                      <FiCalendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
                      <p className="text-sm text-gray-600">
                        Patient: {patient?.name} | {new Date(incident.appointmentDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={getStatusColor(incident.status)}>{incident.status}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(incident)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(incident.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FiFileText className="h-4 w-4 mr-2" />
                      <span className="font-medium">Description:</span>
                    </div>
                    <p className="text-sm text-gray-700">{incident.description || "No description"}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FiUser className="h-4 w-4 mr-2" />
                      <span className="font-medium">Comments:</span>
                    </div>
                    <p className="text-sm text-gray-700">{incident.comments || "No comments"}</p>
                  </div>
                  {incident.cost && (
                    <div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <FiDollarSign className="h-4 w-4 mr-2" />
                        <span className="font-medium">Cost:</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">${incident.cost}</p>
                    </div>
                  )}
                  {incident.treatment && (
                    <div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <FiFileText className="h-4 w-4 mr-2" />
                        <span className="font-medium">Treatment:</span>
                      </div>
                      <p className="text-sm text-gray-700">{incident.treatment}</p>
                    </div>
                  )}
                  {incident.nextDate && (
                    <div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <FiClock className="h-4 w-4 mr-2" />
                        <span className="font-medium">Next Appointment:</span>
                      </div>
                      <p className="text-sm text-gray-700">{new Date(incident.nextDate).toLocaleString()}</p>
                    </div>
                  )}
                  {incident.files && incident.files.length > 0 && (
                    <div className="md:col-span-2">
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <FiUpload className="h-4 w-4 mr-2" />
                        <span className="font-medium">Attachments:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {incident.files.map((file, index) => (
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
                </div>
              </div>
            )
          })}
        </div>

        {filteredIncidents.length === 0 && (
          <div className="text-center py-12">
            <FiCalendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No appointments found.</p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingIncident ? "Edit Appointment" : "Add New Appointment"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                  <select
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    className="form-select"
                    required
                  >
                    <option value="">Select a patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-textarea"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                  <textarea
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    className="form-textarea"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="form-select"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {formData.status === "Completed" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cost ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.cost}
                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Treatment</label>
                      <textarea
                        value={formData.treatment}
                        onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                        className="form-textarea"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Next Appointment Date</label>
                      <input
                        type="datetime-local"
                        value={formData.nextDate}
                        onChange={(e) => setFormData({ ...formData, nextDate: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files</label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="form-input"
                  />
                  {uploadedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center bg-gray-100 rounded px-2 py-1 text-sm">
                          <span className="mr-2">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiX className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                    {editingIncident ? "Update" : "Add"} Appointment
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

export default Appointments
