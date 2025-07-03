

import { createContext, useContext, useState, useEffect } from "react"

const DataContext = createContext()

const initialPatients = [
  {
    id: "p1",
    name: "John Doe",
    dob: "1990-05-10",
    contact: "1234567890",
    healthInfo: "No allergies",
  },
  {
    id: "p2",
    name: "Jane Smith",
    dob: "1985-08-15",
    contact: "0987654321",
    healthInfo: "Allergic to penicillin",
  },
  {
    id: "p3",
    name: "Mike Johnson",
    dob: "1992-12-03",
    contact: "5551234567",
    healthInfo: "Diabetes",
  },
]

const initialIncidents = [
  {
    id: "i1",
    patientId: "p1",
    title: "Toothache",
    description: "Upper molar pain",
    comments: "Sensitive to cold",
    appointmentDate: "2025-07-15T10:00:00",
    cost: 80,
    treatment: "Root canal therapy",
    status: "Completed",
    nextDate: "2025-08-15T10:00:00",
    files: [],
  },
  {
    id: "i2",
    patientId: "p2",
    title: "Dental Cleaning",
    description: "Regular checkup and cleaning",
    comments: "Good oral hygiene",
    appointmentDate: "2025-07-20T14:00:00",
    status: "Scheduled",
    files: [],
  },
  {
    id: "i3",
    patientId: "p1",
    title: "Follow-up",
    description: "Post-treatment checkup",
    comments: "Check healing progress",
    appointmentDate: "2025-07-25T11:00:00",
    status: "Scheduled",
    files: [],
  },
  {
    id: "i4",
    patientId: "p3",
    title: "Dental Implant",
    description: "Single tooth implant",
    comments: "Left lower molar replacement",
    appointmentDate: "2025-07-30T09:00:00",
    status: "Scheduled",
    files: [],
  },
]

export function DataProvider({ children }) {
  const [patients, setPatients] = useState([])
  const [incidents, setIncidents] = useState([])

  useEffect(() => {
    const savedPatients = localStorage.getItem("patients")
    const savedIncidents = localStorage.getItem("incidents")

    if (savedPatients) {
      setPatients(JSON.parse(savedPatients))
    } else {
      setPatients(initialPatients)
      localStorage.setItem("patients", JSON.stringify(initialPatients))
    }

    if (savedIncidents) {
      setIncidents(JSON.parse(savedIncidents))
    } else {
      setIncidents(initialIncidents)
      localStorage.setItem("incidents", JSON.stringify(initialIncidents))
    }
  }, [])

  const addPatient = (patient) => {
    const newPatient = { ...patient, id: `p${Date.now()}` }
    const updatedPatients = [...patients, newPatient]
    setPatients(updatedPatients)
    localStorage.setItem("patients", JSON.stringify(updatedPatients))
  }

  const updatePatient = (id, patientUpdate) => {
    const updatedPatients = patients.map((p) => (p.id === id ? { ...p, ...patientUpdate } : p))
    setPatients(updatedPatients)
    localStorage.setItem("patients", JSON.stringify(updatedPatients))
  }

  const deletePatient = (id) => {
    const updatedPatients = patients.filter((p) => p.id !== id)
    const updatedIncidents = incidents.filter((i) => i.patientId !== id)
    setPatients(updatedPatients)
    setIncidents(updatedIncidents)
    localStorage.setItem("patients", JSON.stringify(updatedPatients))
    localStorage.setItem("incidents", JSON.stringify(updatedIncidents))
  }

  const addIncident = (incident) => {
    const newIncident = { ...incident, id: `i${Date.now()}` }
    const updatedIncidents = [...incidents, newIncident]
    setIncidents(updatedIncidents)
    localStorage.setItem("incidents", JSON.stringify(updatedIncidents))
  }

  const updateIncident = (id, incidentUpdate) => {
    const updatedIncidents = incidents.map((i) => (i.id === id ? { ...i, ...incidentUpdate } : i))
    setIncidents(updatedIncidents)
    localStorage.setItem("incidents", JSON.stringify(updatedIncidents))
  }

  const deleteIncident = (id) => {
    const updatedIncidents = incidents.filter((i) => i.id !== id)
    setIncidents(updatedIncidents)
    localStorage.setItem("incidents", JSON.stringify(updatedIncidents))
  }

  const value = {
    patients,
    incidents,
    addPatient,
    updatePatient,
    deletePatient,
    addIncident,
    updateIncident,
    deleteIncident,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
