import React from 'react'
import useUser from '../../../hooks/useUser'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const todayClass = {
  title: 'Mobility Reset',
  duration: 25,
  level: 'Beginner',
  progress: 0,
  instructor: 'Rohan Kumar',
}

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const weekActivity = [true, false, true, false, false, false, false] // done days

const upcomingAppointment = {
  type: '1-to-1 Mobility Session',
  instructor: 'Rohan Kumar',
  time: 'Thursday · 6:30 PM',
  initials: 'RK',
}

const StudentCP = () => {
  const { currentUser } = useUser()
  const firstName = currentUser?.name?.split(' ')[0] || 'there'

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            You're 2 sessions away from this week's target.
          </p>
        </div>
      </div>

      {/* Top row */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Today's Plan */}
        <div className="md:col-span-2 bg-white rounded-card border border-border-ui p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">Today's Plan</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 3l14 9-14 9V3z" fill="#12B8A6"/></svg>
            </div>
            <div className="flex-1">
              <p className="font-bold text-text-primary">{todayClass.title}</p>
              <p className="text-sm text-text-secondary">{todayClass.duration} min · {todayClass.level} · with {todayClass.instructor}</p>
            </div>
            <Link to="/dashboard/enrolled-class">
              <button className="px-4 py-2 bg-teal text-white text-xs font-bold rounded-btn hover:bg-teal-600 transition-colors flex-shrink-0">
                {todayClass.progress > 0 ? 'Resume' : 'Start'}
              </button>
            </Link>
          </div>
          <div className="mt-4 bg-surface-2 rounded-full h-1.5">
            <div className="bg-teal h-1.5 rounded-full transition-all duration-500" style={{ width: `${todayClass.progress}%` }}></div>
          </div>
          {todayClass.progress === 0 ? (
            <p className="text-xs text-text-secondary mt-1.5">Not started yet</p>
          ) : (
            <p className="text-xs text-text-secondary mt-1.5">{todayClass.progress}% complete</p>
          )}
        </div>

        {/* Weekly Goal */}
        <div className="bg-white rounded-card border border-border-ui p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">Weekly Goal</p>
          <p className="text-3xl font-bold text-navy">3 <span className="text-text-secondary text-xl font-medium">/ 5</span></p>
          <p className="text-xs text-text-secondary mb-3">sessions this week</p>
          <div className="flex gap-1.5">
            {weekDays.map((d, i) => (
              <div key={d} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-full h-1.5 rounded-full ${weekActivity[i] ? 'bg-teal' : 'bg-surface-2'}`}></div>
                <span className="text-[9px] text-text-secondary">{d[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Training Stats */}
        <div className="md:col-span-2 bg-white rounded-card border border-border-ui p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-4">Training Stats</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Minutes trained', value: '147', color: 'text-teal' },
              { label: 'Classes done',    value: '12',  color: 'text-navy' },
              { label: 'Day streak',      value: '5',   color: 'text-coral' },
              { label: 'Plan progress',   value: '60%', color: 'text-blue-ai' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-bg-base rounded-xl p-3">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-text-secondary mt-0.5 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Appointment */}
        <div className="bg-white rounded-card border border-border-ui p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">Next Appointment</p>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal font-bold flex-shrink-0">
              {upcomingAppointment.initials}
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary leading-tight">{upcomingAppointment.type}</p>
              <p className="text-xs text-text-secondary mt-0.5">{upcomingAppointment.time}</p>
              <p className="text-xs text-teal font-semibold mt-0.5">with {upcomingAppointment.instructor}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="flex-1 py-1.5 bg-teal text-white text-xs font-bold rounded-btn hover:bg-teal-600 transition-colors">Join</button>
            <button className="flex-1 py-1.5 border border-border-ui text-xs font-bold rounded-btn hover:border-teal text-text-secondary hover:text-teal transition-colors">Reschedule</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentCP