import React from 'react'
import { Link } from 'react-router-dom'
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
  const isInstructor = currentUser?.role === 'instructor'

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-navy">
              {getGreeting()}, {firstName}
            </h1>
            {isInstructor && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-ai-100 text-blue-ai uppercase tracking-wider">
                Instructor (Practice Mode)
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary mt-0.5">
            {isInstructor
              ? 'Your personal practice space. Track your mat sessions, recommendations, and goals alongside your teaching.'
              : "You're 2 sessions away from this week's target."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {isInstructor && (
            <Link
              to="/dashboard/instructor-cp"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-ai-100 hover:bg-blue-ai/20 text-blue-ai text-xs font-bold rounded-btn transition-colors border border-blue-ai/30 shadow-sm"
            >
              <span>🎓</span>
              <span>Teaching Overview</span>
            </Link>
          )}
          <Link
            to="/dashboard/explore-classes"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal hover:bg-teal-600 text-white text-xs font-semibold rounded-btn transition-colors shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" />
            </svg>
            <span>Explore Classes</span>
          </Link>
        </div>
      </div>

      {/* Onboarding Banner / Summary Card */}
      {!currentUser?.onboardingCompleted ? (
        <div className="bg-gradient-to-r from-navy via-navy-800 to-teal/90 text-white rounded-card p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-teal/30">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal/20 text-teal-100 text-[11px] font-bold uppercase tracking-wider">
              ✨ Personalize Your Experience
            </div>
            <h2 className="text-lg font-bold text-white">Complete Your Yoga Onboarding</h2>
            <p className="text-xs text-surface-2 max-w-xl">
              Tell us your fitness goals, body type, and daily schedule to get personalized class recommendations and automatic BMI calculations.
            </p>
          </div>
          <Link
            to="/dashboard/onboarding"
            className="px-4 py-2.5 bg-teal hover:bg-teal-600 text-white text-xs font-bold rounded-btn transition-all shadow-md flex-shrink-0 text-center self-start sm:self-auto"
          >
            Start Onboarding
          </Link>
        </div>
      ) : (
        <div className="bg-teal-100/40 border border-teal/30 rounded-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal text-white flex items-center justify-center font-bold text-base shadow-xs">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-600">Personalized Training Active</p>
                {currentUser.onboardingProfile?.hasInjuries === 'yes' && currentUser.onboardingProfile?.injuryAreas?.length > 0 && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-coral-100 text-coral">
                    Safeguards ({currentUser.onboardingProfile.injuryAreas.length})
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-navy">
                Goal: {currentUser.onboardingProfile?.primaryGoal || 'Movement & Mobility'} · {currentUser.onboardingProfile?.yogaExperience || 'Beginner'} ({currentUser.onboardingProfile?.yogaStyle || 'Flow'})
                {currentUser.onboardingProfile?.bmi ? ` · BMI: ${currentUser.onboardingProfile.bmi} (${currentUser.onboardingProfile.bmiCategory || 'Normal'})` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/recommendations"
              className="px-3.5 py-1.5 bg-teal hover:bg-teal-600 text-white text-xs font-bold rounded-btn transition-colors shadow-xs"
            >
              Recommended Classes
            </Link>
            <Link
              to="/dashboard/profile"
              className="px-3 py-1.5 border border-border-ui hover:border-teal text-xs font-bold text-navy hover:text-teal bg-white rounded-btn transition-colors shadow-xs"
            >
              Profile & Settings
            </Link>
          </div>
        </div>
      )}

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
            <Link
              to="/dashboard/enrolled-class"
              className="px-4 py-2 bg-teal text-white text-xs font-bold rounded-btn hover:bg-teal-600 transition-colors flex-shrink-0 inline-block"
            >
              {todayClass.progress > 0 ? 'Resume' : 'Start'}
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