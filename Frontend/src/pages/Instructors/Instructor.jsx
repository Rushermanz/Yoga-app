import React, { useEffect, useState } from 'react'
import useAxiosFetch from '../../hooks/useAxiosFetch'
import { useNavigate } from 'react-router-dom'

const specialties = ['Mobility', 'Strength', 'Flexibility', 'Posture', 'Recovery', 'Core', 'Balance', 'Beginner']

const Instructor = () => {
  const [instructors, setInstructors] = useState([])
  const axiosFetch = useAxiosFetch()
  const navigate = useNavigate()

  useEffect(() => {
    axiosFetch.get('/instructors')
      .then(data => setInstructors(data.data))
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Page header */}
      <div className="pt-24 pb-10 bg-navy">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-white mb-1">Find an instructor</h1>
          <p className="text-sm text-white/60">
            Book a 1-to-1 session with a certified coach matched to your training goals.
          </p>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-10">
        {instructors.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">👤</p>
            <p className="font-semibold text-text-primary mb-1">No instructors yet</p>
            <p className="text-sm text-text-secondary">Our coaching team is growing — check back soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {instructors.map((instructor, i) => {
              const specialty = specialties[i % specialties.length]
              return (
                <div
                  key={i}
                  className="bg-white border border-border-ui rounded-card p-6 transition-card hover-lift flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    {instructor?.photoUrl ? (
                      <img
                        src={instructor.photoUrl}
                        alt={instructor.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-border-ui flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-teal font-bold text-xl flex-shrink-0">
                        {instructor?.name?.[0]?.toUpperCase() || 'I'}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-text-primary text-base">{instructor?.name}</p>
                      <p className="text-xs text-teal font-semibold">{specialty}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-warning text-xs">★★★★★</span>
                        <span className="text-xs text-text-secondary ml-1">4.9</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 text-xs text-text-secondary mb-5">
                    {instructor?.email && (
                      <div className="flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/><polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/></svg>
                        <span className="truncate">{instructor.email}</span>
                      </div>
                    )}
                    {instructor?.address && (
                      <div className="flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/></svg>
                        <span>{instructor.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-text-secondary mb-5">
                    <span className="flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/></svg>
                      Students enrolled
                    </span>
                    <span className="font-semibold text-navy">Experience: 3+ yrs</span>
                  </div>

                  <button
                    onClick={() => navigate('/classes')}
                    className="w-full py-2.5 bg-teal text-white text-xs font-bold rounded-btn hover:bg-teal-600 transition-colors mt-auto"
                  >
                    Book a session
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Instructor
