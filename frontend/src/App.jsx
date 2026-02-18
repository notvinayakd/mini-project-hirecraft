import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import StudentDashboard from './pages/StudentDashboard'
import PlacementDrives from './pages/PlacementDrives'
import MockTests from './pages/MockTests'
import PrepMaterials from './pages/PrepMaterials'
import Profile from './pages/Profile'
import OurStatistics from './pages/OurStatistics'

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/drives" element={<PlacementDrives />} />
                <Route path="/mock-tests" element={<MockTests />} />
                <Route path="/materials" element={<PrepMaterials />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/statistics" element={<OurStatistics />} />
            </Routes>
        </Layout>
    )
}

export default App
