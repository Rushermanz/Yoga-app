import React from 'react'
import useUser from '../../../hooks/useUser'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const MetricCard = ({ label, value, color, bg, icon }) => (
  <div className="bg-white rounded-card border border-border-ui p-5 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 text-xl`}>{icon}</div>
    <div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-text-secondary mt-0.5">{label}</p>
    </div>
  </div>
)

const InstructorCP = () => {
  const { currentUser } = useUser()
  const firstName = currentUser?.name?.split(' ')[0] || 'Instructor'

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">Here's your teaching overview.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total classes"    value="—" color="text-navy"    bg="bg-teal-100"    icon="📚" />
        <MetricCard label="Active students"  value="—" color="text-blue-ai" bg="bg-blue-ai-100" icon="👥" />
        <MetricCard label="Upcoming sessions" value="—" color="text-coral"  bg="bg-coral-100"   icon="📅" />
        <MetricCard label="Avg rating"       value="—" color="text-warning" bg="bg-surface-2"   icon="⭐" />
      </div>

      {/* Getting started tips */}
      <div className="bg-navy rounded-card p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-teal mb-3">Getting started</p>
        <div className="space-y-3">
          {[
            { step: '1', title: 'Create your first class', desc: 'Upload content, set pricing, and publish.' },
            { step: '2', title: 'Set your availability',   desc: 'Let students book 1-to-1 sessions with you.' },
            { step: '3', title: 'Track student progress',  desc: 'See engagement and completion from your dashboard.' },
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