import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HashLoader } from 'react-spinners'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const Recommendations = () => {
  const axiosSecure = useAxiosSecure()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ completed: false, profile: null, recommendations: [] })
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        const res = await axiosSecure.get('/api/recommendations')
        setData(res.data)
      } catch (err) {
        console.error('Error fetching recommendations:', err)
        setError('Unable to load personalized recommendations.')
      } finally {
        setLoading(false)
      }
    }
    fetchRecommendations()
  }, [axiosSecure])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <HashLoader color="#12B8A6" size={45} />
        <p className="text-sm font-bold text-navy mt-4">Generating your personalized yoga recommendations...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-error rounded-card border border-red-200">
        <p className="font-bold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-1.5 bg-teal text-white text-xs font-bold rounded-btn"
        >
          Try Again
        </button>
      </div>
    )
  }

  const { completed, profile, recommendations } = data

  if (!completed || !profile) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-card border border-border-ui p-8 md:p-12 shadow-sm space-y-6">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto text-3xl">
            🧘‍♀️
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-navy">Personalized Recommendations</h2>
            <p className="text-sm text-text-secondary">
              Complete your short fitness & yoga onboarding profile to unlock customized class recommendations based on your goals, body metrics, and schedule!
            </p>
          </div>
          <Link
            to="/dashboard/onboarding"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal hover:bg-teal-600 text-white font-bold rounded-btn shadow-md transition-all"
          >
            <span>Start Onboarding Flow</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Overview Header Card */}
      <div className="bg-white rounded-card border border-border-ui p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-600">
                Personalized Profile
              </span>
              <span className="text-xs text-text-secondary">
                Updated {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'Recently'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy">Recommended Classes For You</h1>
              <p className="text-sm text-text-secondary mt-0.5">
                Curated based on your target: <strong className="text-navy font-semibold">{profile.primaryGoal} ({profile.yogaStyle || profile.goalPreference || 'Flow'})</strong>
              </p>
            </div>
          </div>

          <Link
            to="/dashboard/profile"
            className="px-4 py-2 border border-teal text-teal hover:bg-teal-100/50 text-xs font-bold rounded-btn transition-colors self-start md:self-auto inline-flex items-center gap-1.5 shadow-xs"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span>Personalise Profile</span>
          </Link>
        </div>

        {/* Profile Metrics Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-border-ui">
          <div className="bg-bg-base p-3 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-text-secondary">BMI & Category</p>
            <p className="text-base font-bold text-navy mt-0.5">
              {profile.bmi} <span className="text-xs font-semibold text-teal-600">({profile.bmiCategory || 'Normal'})</span>
            </p>
          </div>
          <div className="bg-bg-base p-3 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-text-secondary">Target Time</p>
            <p className="text-base font-bold text-navy mt-0.5">{profile.preferredDuration} mins / day</p>
          </div>
          <div className="bg-bg-base p-3 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-text-secondary">Experience & Safeguard</p>
            <p className="text-base font-bold text-navy mt-0.5">
              {profile.yogaExperience || 'Practitioner'} {profile.hasInjuries === 'yes' && profile.injuryAreas?.length > 0 ? `· 🛡️ ${profile.injuryAreas.length} Areas` : ''}
            </p>
          </div>
          <div className="bg-bg-base p-3 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-text-secondary">Diet & Hydration</p>
            <p className="text-base font-bold text-navy mt-0.5">{profile.diet || 'Balanced'} · {profile.waterIntake || '2L'}</p>
          </div>
        </div>
      </div>

      {/* Class Recommendations Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy">
            Matched Classes <span className="text-sm font-medium text-text-secondary">({recommendations.length})</span>
          </h2>
        </div>

        {recommendations.length === 0 ? (
          <div className="p-8 bg-white rounded-card border border-border-ui text-center">
            <p className="text-sm text-text-secondary">No approved classes currently available for scoring.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.map((cls) => (
              <div
                key={cls._id}
                className="bg-white rounded-card border border-border-ui overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Image & Match Badge */}
                  <div className="relative h-44 bg-surface-2 overflow-hidden">
                    <img
                      src={cls.image || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80'}
                      alt={cls.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-navy/90 backdrop-blur-sm text-teal-100 font-bold text-xs px-3 py-1 rounded-full shadow-sm flex items-center gap-1 border border-teal/40">
                      <span>⚡</span>
                      <span>{cls.matchPercentage}% Match</span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {cls.level && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-2 text-text-secondary">
                            {cls.level}
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                          ${cls.price}
                        </span>
                      </div>
                      <h3 className="font-bold text-navy text-base leading-snug line-clamp-1">{cls.name}</h3>
                      {cls.instructorName && (
                        <p className="text-xs text-text-secondary mt-0.5">by {cls.instructorName}</p>
                      )}
                    </div>

                    {/* Match Reason Pills */}
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Why it matches</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(cls.matchReasons || []).slice(0, 3).map((reason, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-semibold bg-teal-100/70 text-navy px-2.5 py-1 rounded-md leading-tight"
                          >
                            ✓ {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <Link
                    to={`/class/${cls._id}`}
                    className="block w-full text-center py-2.5 bg-teal hover:bg-teal-600 text-white text-xs font-bold rounded-btn transition-colors"
                  >
                    View Class Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Recommendations
