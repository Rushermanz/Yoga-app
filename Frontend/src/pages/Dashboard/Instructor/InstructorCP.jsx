import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiBookOpen, FiArrowRight } from 'react-icons/fi'
import useUser from '../../../hooks/useUser'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const MetricCard = ({ label, value, color, bg, icon }) => (
  <div className="bg-white rounded-card border border-border-ui p-5 flex items-center gap-4 shadow-sm">
    <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 text-xl`}>{icon}</div>
    <div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-text-secondary mt-0.5">{label}</p>
    </div>
  </div>
)

const InstructorCP = () => {
  const { currentUser, isLoading } = useUser()
  const axiosSecure = useAxiosSecure()
  const [classes, setClasses] = useState([])
  const [loadingClasses, setLoadingClasses] = useState(true)

  const firstName = currentUser?.name?.split(' ')[0] || 'Instructor'

  useEffect(() => {
    if (currentUser?.email) {
      axiosSecure
        .get(`/classes/${currentUser.email}`)
        .then((res) => {
          setClasses(Array.isArray(res.data) ? res.data : [])
          setLoadingClasses(false)
        })
        .catch(() => {
          setLoadingClasses(false)
        })
    } else if (!isLoading) {
      setLoadingClasses(false)
    }
  }, [currentUser?.email, isLoading])

  const totalEnrolled = classes.reduce((sum, c) => sum + (c.totalEnrolled || 0), 0)
  const approvedClasses = classes.filter((c) => c.status === 'approved').length

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">Here's your teaching overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/my-classes"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-border-ui bg-white hover:bg-surface-2 text-text-primary text-xs font-semibold rounded-btn transition-colors shadow-sm"
          >
            <FiBookOpen className="w-3.5 h-3.5 text-teal" />
            <span>Manage Classes</span>
          </Link>
          <Link
            to="/dashboard/add-class"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal hover:bg-teal-600 text-white text-xs font-semibold rounded-btn transition-colors shadow-sm"
          >
            <FiPlus className="w-3.5 h-3.5" />
            <span>Add Class</span>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total classes"
          value={loadingClasses ? '...' : classes.length}
          color="text-navy"
          bg="bg-teal-100"
          icon="📚"
        />
        <MetricCard
          label="Active students"
          value={loadingClasses ? '...' : totalEnrolled}
          color="text-blue-ai"
          bg="bg-blue-ai-100"
          icon="👥"
        />
        <MetricCard
          label="Approved courses"
          value={loadingClasses ? '...' : approvedClasses}
          color="text-coral"
          bg="bg-coral-100"
          icon="✅"
        />
        <MetricCard
          label="Avg rating"
          value="4.9"
          color="text-warning"
          bg="bg-surface-2"
          icon="⭐"
        />
      </div>

      {/* Manage classes callout */}
      <div className="bg-white rounded-card border border-border-ui p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-navy">Class Management & Controls</h2>
          <p className="text-xs text-text-secondary mt-1">
            Review your classes, track enrollments, update course details, or delete classes you no longer wish to offer.
          </p>
        </div>
        <Link
          to="/dashboard/my-classes"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal hover:text-teal-600 transition-colors"
        >
          <span>Go to My Classes</span>
          <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Getting started tips */}
      <div className="bg-navy rounded-card p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-teal mb-3">Teaching tips</p>
        <div className="space-y-3">
          {[
            { step: '1', title: 'Create & publish your classes', desc: 'Upload thumbnails, add descriptions, and set pricing.' },
            { step: '2', title: 'Manage or delete courses anytime', desc: 'Easily update information or remove outdated classes from My Classes.' },
            { step: '3', title: 'Track student progress', desc: 'See real-time enrollment and engagement directly from your dashboard.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-teal flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {step}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{title}</p>
                <p className="text-xs text-white/50 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InstructorCP