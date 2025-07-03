
import { useAuth } from "../contexts/AuthContext"
import Layout from "../components/Layout"
import AdminDashboard from "../components/AdminDashboard"
import PatientDashboard from "../components/PatientDashboard"

const Dashboard = () => {
  const { user } = useAuth()

  return <Layout>{user?.role === "Admin" ? <AdminDashboard /> : <PatientDashboard />}</Layout>
}

export default Dashboard
