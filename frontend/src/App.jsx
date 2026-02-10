import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import StudentDashboard from './pages/StudentDashboard'
import OurStatistics from './pages/OurStatistics'

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/statistics" element={<OurStatistics />} />
            </Routes>
        </Layout>
    )
}

export default App
