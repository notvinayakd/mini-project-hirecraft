import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
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
import TestInterface from './pages/TestInterface'
import TestAnalysis from './pages/TestAnalysis'
import CodePractice from './pages/CodePractice'
import ProtectedRoute from './components/ProtectedRoute'

import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageCodePractice from './pages/admin/ManageCodePractice'
import ManageDrives from './pages/admin/ManageDrives'
import StudentList from './pages/admin/StudentList'
import ManageTests from './pages/admin/ManageTests'
import ManageMaterials from './pages/admin/ManageMaterials'
import AdminSettings from './pages/admin/AdminSettings'

function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Public & Student Routes */}
                <Route element={<Layout />}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<StudentDashboard />} />
                    <Route path="/drives" element={<PlacementDrives />} />
                    <Route path="/mock-tests" element={<MockTests />} />
                    <Route path="/materials" element={<PrepMaterials />} />
                    <Route path="/code-practice" element={<CodePractice />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/statistics" element={<OurStatistics />} />
                    <Route path="/student/test/:testId" element={<TestInterface />} />
                    <Route path="/student/test/analysis/:attemptId" element={<TestAnalysis />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={
                    <ProtectedRoute role="admin">
                        <AdminLayout />
                    </ProtectedRoute>
                }>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="code-practice" element={<ManageCodePractice />} />
                    <Route path="drives" element={<ManageDrives />} />
                    <Route path="tests" element={<ManageTests />} />
                    <Route path="materials" element={<ManageMaterials />} />
                    <Route path="students" element={<StudentList />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Route>
            </Routes>
        </AuthProvider>
    )
}

export default App
