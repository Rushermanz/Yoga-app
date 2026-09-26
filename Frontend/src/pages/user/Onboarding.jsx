import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Swal from 'sweetalert2'
import axios from 'axios'
import useAuth from '../../hooks/useAuth'
import { getOnboardingDraft, saveOnboardingDraft, clearOnboardingDraft } from '../../ultilities/onboardingSync'

// Option Card Helper Component
const OptionCard = ({ selected, onClick, title, description, icon }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left p-4 rounded-card border transition-all duration-200 flex items-center justify-between ${
      selected
        ? 'border-teal bg-teal-100/50 shadow-sm ring-2 ring-teal ring-opacity-50'
        : 'border-border-ui bg-surface hover:border-teal/50 hover:bg-surface-2/60'
    }`}
  >
    <div className="flex items-center gap-3.5">
      {icon && (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
          selected ? 'bg-teal text-white' : 'bg-surface-2 text-navy'
        }`}>
          {icon}
        </div>
      )}
      <div>
        <h3 className="font-bold text-navy text-sm md:text-base">{title}</h3>
        {description && <p className="text-xs text-text-secondary mt-0.5">{description}</p>}
      </div>
    </div>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
      selected ? 'border-teal bg-teal' : 'border-border-ui'
    }`}>
      {selected && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
  </button>
)

const Onboarding = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [profileLoaded, setProfileLoaded] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    bodyType: '',
    primaryGoal: '',
    goalPreference: '',
    bodyFat: '',
    diet: '',
    waterIntake: '',
    heightUnit: 'cm',
    heightCm: '170',
    heightFt: '5',
    heightIn: '7',
    weightUnit: 'kg',
    weight: '70',
    targetWeight: '65',
    preferredDuration: '30'
  })

  // Load existing draft or existing authenticated user profile on mount
  useEffect(() => {
    // First check for a pre-auth sessionStorage draft
    const existingDraft = getOnboardingDraft()
    if (existingDraft) {
      setFormData((prev) => ({
        ...prev,
        ...existingDraft,
        heightCm: existingDraft.heightUnit === 'cm' && typeof existingDraft.height === 'string' ? existingDraft.height : prev.heightCm,
        heightFt: existingDraft.heightUnit === 'ft' && existingDraft.height?.ft ? existingDraft.height.ft : prev.heightFt,
        heightIn: existingDraft.heightUnit === 'ft' && existingDraft.height?.in ? existingDraft.height.in : prev.heightIn
      }))
      setProfileLoaded(true)
      return
    }

    // If user is authenticated, fetch their saved onboarding profile from backend
    if (user?.email) {
      const token = localStorage.getItem('token')
      if (!token) {
        setProfileLoaded(true)
        return
      }
      axios
        .get('http://localhost:5000/api/user/onboarding', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          const p = res.data?.onboardingProfile
          if (p) {
            setFormData((prev) => ({
              ...prev,
              age: p.age || '',
              gender: p.gender || '',
              bodyType: p.bodyType || '',
              primaryGoal: p.primaryGoal || '',
              goalPreference: p.goalPreference || '',
              bodyFat: p.bodyFat || '',
              diet: p.diet || '',
              waterIntake: p.waterIntake || '',
              heightUnit: p.heightUnit || 'cm',
              heightCm: p.heightUnit === 'cm' ? String(p.height || '170') : '170',
              heightFt: p.heightUnit === 'ft' && p.height?.ft ? String(p.height.ft) : '5',
              heightIn: p.heightUnit === 'ft' && p.height?.in ? String(p.height.in) : '7',
              weightUnit: p.weightUnit || 'kg',
              weight: String(p.weight || '70'),
              targetWeight: String(p.targetWeight || '65'),
              preferredDuration: String(p.preferredDuration || '30')
            }))
          }
        })
        .catch(() => {
          // Silently ignore — user may not have an onboarding profile yet
        })
        .finally(() => setProfileLoaded(true))
    } else {
      setProfileLoaded(true)
    }
  }, [user])

  // Dynamic Goal/Body Preferences mapping
  const goalPreferencesMap = {
    'Lose Weight': [
      { id: 'Slim Body', label: 'Slim Body', desc: 'Lean, sleek silhouette with low fat percentage' },
      { id: 'Shredded Body', label: 'Shredded Body', desc: 'Defined musculature with low fat' }
    ],
    'Gain Muscle Mass': [
      { id: 'Athlete', label: 'Athlete', desc: 'Balanced functional athletic strength' },
      { id: 'Hero', label: 'Hero', desc: 'Broad shoulders and powerful build' },
      { id: 'Body Builder', label: 'Body Builder', desc: 'Maximum muscle mass and strength density' }
    ],
    'Get Shredded': [
      { id: 'Beach Body', label: 'Beach Body', desc: 'Toned abs and aesthetic proportions' },
      { id: 'Workout Body', label: 'Workout Body', desc: 'High stamina and defined tone' },
      { id: 'Cross-fit Body', label: 'Cross-fit Body', desc: 'Explosive core power and agility' }
    ]
  }

  // Handle Field Updates
  const updateField = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === 'primaryGoal' && prev.primaryGoal !== value) {
        updated.goalPreference = ''
      }
      return updated
    })
  }

  // Calculate live client-side preview of BMI
  const getLiveBMI = () => {
    let heightInM = 0
    let weightInKg = 0

    if (formData.heightUnit === 'ft') {
      const ft = Number(formData.heightFt) || 0
      const inch = Number(formData.heightIn) || 0
      heightInM = (ft * 12 + inch) * 0.0254
    } else {
      heightInM = (Number(formData.heightCm) || 0) / 100
    }

    if (formData.weightUnit === 'lbs') {
      weightInKg = (Number(formData.weight) || 0) * 0.45359237
    } else {
      weightInKg = Number(formData.weight) || 0
    }

    if (!heightInM || heightInM <= 0 || !weightInKg || weightInKg <= 0) {
      return { bmi: 0, category: 'Enter details' }
    }

    const val = weightInKg / (heightInM * heightInM)
    const bmi = Math.round(val * 10) / 10

    let category = 'Normal weight'
    if (bmi < 18.5) category = 'Underweight'
    else if (bmi < 25) category = 'Normal weight'
    else if (bmi < 30) category = 'Overweight'
    else category = 'Obese'

    return { bmi, category }
  }

  // Validate step completion
  const isStepValid = () => {
    switch (step) {
      case 1: return !!formData.age
      case 2: return !!formData.gender
      case 3: return !!formData.bodyType
      case 4: return !!formData.primaryGoal
      case 5: return !!formData.goalPreference
      case 6: return !!formData.bodyFat
      case 7: return !!formData.diet
      case 8: return !!formData.waterIntake
      case 9:
        if (formData.heightUnit === 'cm') {
          if (!formData.heightCm || Number(formData.heightCm) <= 0) return false
        } else {
          if (!formData.heightFt || Number(formData.heightFt) < 0) return false
        }
        if (!formData.weight || Number(formData.weight) <= 0) return false
        if (!formData.targetWeight || Number(formData.targetWeight) <= 0) return false
        if (!formData.preferredDuration) return false
        return true
      case 10: return true
      default: return false
    }
  }

  // Build payload
  const buildPayload = () => {
    const heightVal = formData.heightUnit === 'cm'
      ? formData.heightCm
      : { ft: formData.heightFt, in: formData.heightIn }

    return {
      age: formData.age,
      gender: formData.gender,
      bodyType: formData.bodyType,
      primaryGoal: formData.primaryGoal,
      goalPreference: formData.goalPreference,
      bodyFat: formData.bodyFat,
      diet: formData.diet,
      waterIntake: formData.waterIntake,
      height: heightVal,
      heightUnit: formData.heightUnit,
      weight: formData.weight,
      weightUnit: formData.weightUnit,
      targetWeight: formData.targetWeight,
      preferredDuration: formData.preferredDuration
    }
  }

  // Form Submit Handler
  const handleSubmit = async () => {
    const payload = buildPayload()

    // 1. If user is authenticated: save directly to backend via direct axios (avoids interceptor redirect issues)
    if (user && user.email) {
      setSubmitting(true)
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No authentication token found. Please sign in again.')
        }
        const res = await axios.post('http://localhost:5000/api/onboarding', payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.data?.success) {
          clearOnboardingDraft()
          Swal.fire({
            icon: 'success',
            title: 'Profile Saved!',
            text: 'Your personalized yoga onboarding is complete. Here are your recommendations!',
            confirmButtonColor: '#12B8A6',
            timer: 2000
          })
          navigate('/dashboard/recommendations')
        }
      } catch (err) {
        console.error('Error submitting onboarding:', err)
        const msg = err.response?.data?.message || err.message || 'Something went wrong saving your profile.'
        if (err.response?.status === 401 || err.response?.status === 403) {
          Swal.fire({
            icon: 'warning',
            title: 'Session Expired',
            text: 'Your session has expired. Please sign in again to save your profile.',
            confirmButtonColor: '#12B8A6',
            confirmButtonText: 'Sign In'
          }).then(() => navigate('/login'))
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: msg,
            confirmButtonColor: '#12B8A6'
          })
        }
      } finally {
        setSubmitting(false)
      }
    } else {
      // 2. If unauthenticated visitor: save draft to sessionStorage and direct to Register
      saveOnboardingDraft(payload)
      Swal.fire({
        icon: 'success',
        title: 'Answers Saved!',
        text: 'Please create your free account or sign in to view your personalized recommendations.',
        confirmButtonColor: '#12B8A6',
        confirmButtonText: 'Continue to Sign Up',
        timer: 2500
      }).then(() => {
        navigate('/register', { state: { fromOnboarding: true } })
      })
    }
  }

  const TOTAL_STEPS = 10
  const progressPercent = Math.round((step / TOTAL_STEPS) * 100)
  const liveBMI = getLiveBMI()

  return (
    <div className="min-h-screen bg-bg-base py-8 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-card border border-border-ui shadow-sm overflow-hidden">
        {/* Top Header Bar */}
        <div className="px-6 pt-5 pb-4 border-b border-border-ui">
          <div className="flex items-center justify-between gap-4 mb-3">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-teal flex items-center justify-center transition-transform group-hover:scale-105">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 12H8v-1c0-2.21 3.58-4 4-4s4 1.79 4 4v1z" fill="white"/>
                </svg>
              </div>
              <span className="text-navy font-bold text-sm">Yoga Master</span>
            </Link>

            {/* Clearly visible Sign In link for registered users */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-secondary hidden sm:inline">Already have an account?</span>
              <Link
                to="/login"
                className="text-xs font-bold text-teal hover:text-teal-600 transition-colors px-2 py-1 rounded hover:bg-teal-100/50"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-teal">
              Step {step} of {TOTAL_STEPS}
            </span>
            <span className="text-xs font-semibold text-text-secondary">
              {progressPercent}% Completed
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-surface-2 rounded-full h-2 overflow-hidden">
            <div
              className="bg-teal h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6 md:p-8 min-h-[380px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex-1"
            >
              {/* STEP 1: Age */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">Select your Age Group</h2>
                  <p className="text-sm text-text-secondary mb-6">Helps us tailor yoga flow intensity to your life stage.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {['18–29', '30–39', '40–49', '50+'].map((ageOpt) => (
                      <OptionCard
                        key={ageOpt}
                        title={ageOpt}
                        selected={formData.age === ageOpt}
                        onClick={() => updateField('age', ageOpt)}
                        icon="🎂"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Gender */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">What is your Gender?</h2>
                  <p className="text-sm text-text-secondary mb-6">Used to personalize physiological recommendations.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'Male', label: 'Male', icon: '👨' },
                      { id: 'Female', label: 'Female', icon: '👩' }
                    ].map((g) => (
                      <OptionCard
                        key={g.id}
                        title={g.label}
                        selected={formData.gender === g.id}
                        onClick={() => updateField('gender', g.id)}
                        icon={g.icon}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Body Type */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">Current Body Type</h2>
                  <p className="text-sm text-text-secondary mb-6">Choose the option that best reflects your current physique.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {[
                      { id: 'Slim', label: 'Slim', desc: 'Lean build with lighter frame' },
                      { id: 'Average', label: 'Average', desc: 'Balanced medium proportions' },
                      { id: 'Big', label: 'Big', desc: 'Broader frame or higher muscle density' },
                      { id: 'Heavy', label: 'Heavy', desc: 'Larger frame carrying excess weight' }
                    ].map((bt) => (
                      <OptionCard
                        key={bt.id}
                        title={bt.label}
                        description={bt.desc}
                        selected={formData.bodyType === bt.id}
                        onClick={() => updateField('bodyType', bt.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Primary Goal */}
              {step === 4 && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">What is your Primary Goal?</h2>
                  <p className="text-sm text-text-secondary mb-6">Your main focus will shape your course recommendations.</p>
                  <div className="space-y-3">
                    {[
                      { id: 'Lose Weight', label: 'Lose Weight', desc: 'Burn calories, boost metabolism & drop body fat', icon: '🔥' },
                      { id: 'Gain Muscle Mass', label: 'Gain Muscle Mass', desc: 'Build core strength, posture & body mass', icon: '💪' },
                      { id: 'Get Shredded', label: 'Get Shredded', desc: 'Carve muscle definition & peak core mobility', icon: '⚡' }
                    ].map((g) => (
                      <OptionCard
                        key={g.id}
                        title={g.label}
                        description={g.desc}
                        selected={formData.primaryGoal === g.id}
                        onClick={() => updateField('primaryGoal', g.id)}
                        icon={g.icon}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: Goal / Body Preference (Dynamic) */}
              {step === 5 && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">Desired Outcome for {formData.primaryGoal}</h2>
                  <p className="text-sm text-text-secondary mb-6">Select your target aesthetic & physique outcome.</p>
                  <div className="space-y-3">
                    {(goalPreferencesMap[formData.primaryGoal] || []).map((pref) => (
                      <OptionCard
                        key={pref.id}
                        title={pref.label}
                        description={pref.desc}
                        selected={formData.goalPreference === pref.id}
                        onClick={() => updateField('goalPreference', pref.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: Estimated Body Fat */}
              {step === 6 && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">Estimated Body Fat Range</h2>
                  <p className="text-sm text-text-secondary mb-6">Select an approximate range (no exact measurement required).</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {[
                      { id: '< 15%', label: '< 15%', desc: 'Low body fat / highly lean' },
                      { id: '15% – 22%', label: '15% – 22%', desc: 'Moderate athletic fat range' },
                      { id: '23% – 30%', label: '23% – 30%', desc: 'Slightly higher fat carrying' },
                      { id: '> 30%', label: '> 30%', desc: 'Higher body fat range' }
                    ].map((bf) => (
                      <OptionCard
                        key={bf.id}
                        title={bf.label}
                        description={bf.desc}
                        selected={formData.bodyFat === bf.id}
                        onClick={() => updateField('bodyFat', bf.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7: Diet */}
              {step === 7 && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">Dietary Lifestyle</h2>
                  <p className="text-sm text-text-secondary mb-6">Helps align holistic wellness & recovery guidance.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {[
                      { id: 'Vegetarian', label: 'Vegetarian', icon: '🥗' },
                      { id: 'Vegan', label: 'Vegan', icon: '🌱' },
                      { id: 'Keto', label: 'Keto', icon: '🥑' },
                      { id: 'Non-vegetarian', label: 'Non-vegetarian', icon: '🍗' },
                      { id: 'Other', label: 'Other / Flexible', icon: '🍽️' }
                    ].map((d) => (
                      <OptionCard
                        key={d.id}
                        title={d.label}
                        selected={formData.diet === d.id}
                        onClick={() => updateField('diet', d.id)}
                        icon={d.icon}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 8: Daily Water Intake */}
              {step === 8 && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">Daily Water Intake</h2>
                  <p className="text-sm text-text-secondary mb-6">Approximate hydration for optimal joint flex & muscle recovery.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {[
                      { id: '1 – 2 Liters', label: '1 – 2 Liters', desc: 'Mild hydration' },
                      { id: '2 – 3 Liters', label: '2 – 3 Liters', desc: 'Recommended baseline' },
                      { id: '3 – 4 Liters', label: '3 – 4 Liters', desc: 'High active hydration' },
                      { id: '4+ Liters', label: '4+ Liters', desc: 'Intense daily hydration' }
                    ].map((w) => (
                      <OptionCard
                        key={w.id}
                        title={w.label}
                        description={w.desc}
                        selected={formData.waterIntake === w.id}
                        onClick={() => updateField('waterIntake', w.id)}
                        icon="💧"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 9: Body Measurements & Live BMI */}
              {step === 9 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">Body Measurements & Daily Target</h2>
                    <p className="text-sm text-text-secondary">We will automatically calculate your Body Mass Index (BMI).</p>
                  </div>

                  {/* Height Unit Toggle & Inputs */}
                  <div className="bg-surface-2/60 p-4 rounded-card border border-border-ui space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">Height</label>
                      <div className="inline-flex rounded-lg border border-border-ui bg-white p-0.5">
                        <button
                          type="button"
                          onClick={() => updateField('heightUnit', 'cm')}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                            formData.heightUnit === 'cm' ? 'bg-teal text-white' : 'text-text-secondary hover:text-navy'
                          }`}
                        >
                          cm
                        </button>
                        <button
                          type="button"
                          onClick={() => updateField('heightUnit', 'ft')}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                            formData.heightUnit === 'ft' ? 'bg-teal text-white' : 'text-text-secondary hover:text-navy'
                          }`}
                        >
                          ft / in
                        </button>
                      </div>
                    </div>

                    {formData.heightUnit === 'cm' ? (
                      <input
                        type="number"
                        value={formData.heightCm}
                        onChange={(e) => updateField('heightCm', e.target.value)}
                        placeholder="Height in cm (e.g. 175)"
                        className="w-full px-3.5 py-2.5 rounded-btn border border-border-ui bg-white text-navy font-semibold focus:outline-none focus:border-teal"
                      />
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-text-secondary font-semibold">Feet</label>
                          <input
                            type="number"
                            value={formData.heightFt}
                            onChange={(e) => updateField('heightFt', e.target.value)}
                            placeholder="ft"
                            className="w-full px-3 py-2 rounded-btn border border-border-ui bg-white text-navy font-semibold focus:outline-none focus:border-teal"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-text-secondary font-semibold">Inches</label>
                          <input
                            type="number"
                            value={formData.heightIn}
                            onChange={(e) => updateField('heightIn', e.target.value)}
                            placeholder="in"
                            className="w-full px-3 py-2 rounded-btn border border-border-ui bg-white text-navy font-semibold focus:outline-none focus:border-teal"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Weight Inputs */}
                  <div className="bg-surface-2/60 p-4 rounded-card border border-border-ui space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">Weight & Target</label>
                      <div className="inline-flex rounded-lg border border-border-ui bg-white p-0.5">
                        <button
                          type="button"
                          onClick={() => updateField('weightUnit', 'kg')}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                            formData.weightUnit === 'kg' ? 'bg-teal text-white' : 'text-text-secondary hover:text-navy'
                          }`}
                        >
                          kg
                        </button>
                        <button
                          type="button"
                          onClick={() => updateField('weightUnit', 'lbs')}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                            formData.weightUnit === 'lbs' ? 'bg-teal text-white' : 'text-text-secondary hover:text-navy'
                          }`}
                        >
                          lbs
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-text-secondary font-semibold">Current Weight ({formData.weightUnit})</label>
                        <input
                          type="number"
                          value={formData.weight}
                          onChange={(e) => updateField('weight', e.target.value)}
                          placeholder={`Current (${formData.weightUnit})`}
                          className="w-full px-3 py-2 rounded-btn border border-border-ui bg-white text-navy font-semibold focus:outline-none focus:border-teal"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-text-secondary font-semibold">Target Weight ({formData.weightUnit})</label>
                        <input
                          type="number"
                          value={formData.targetWeight}
                          onChange={(e) => updateField('targetWeight', e.target.value)}
                          placeholder={`Target (${formData.weightUnit})`}
                          className="w-full px-3 py-2 rounded-btn border border-border-ui bg-white text-navy font-semibold focus:outline-none focus:border-teal"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferred Yoga Duration */}
                  <div className="bg-surface-2/60 p-4 rounded-card border border-border-ui space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                      Preferred Daily Yoga Session Time
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {['10', '20', '30', '45', '60'].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => updateField('preferredDuration', mins)}
                          className={`py-2 text-xs font-bold rounded-btn border transition-all ${
                            formData.preferredDuration === mins
                              ? 'bg-teal text-white border-teal shadow-sm'
                              : 'bg-white text-navy border-border-ui hover:border-teal/50'
                          }`}
                        >
                          {mins}m
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live BMI Preview Widget */}
                  {liveBMI.bmi > 0 && (
                    <div className="bg-navy text-white p-4 rounded-card flex items-center justify-between">
                      <div>
                        <p className="text-xs text-teal-100 font-semibold uppercase tracking-wider">Calculated BMI Preview</p>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-2xl font-extrabold">{liveBMI.bmi}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-teal/30 text-teal-100">
                            {liveBMI.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-[11px] text-text-secondary">
                        Standard formula calculation
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 10: Review & Summary */}
              {step === 10 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">Review & Complete Profile</h2>
                    <p className="text-sm text-text-secondary">
                      {user ? 'Confirm your details to save to your account and generate custom yoga recommendations.' : 'Confirm your details to unlock customized yoga recommendations!'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-surface-2/70 p-3 rounded-xl">
                      <p className="text-[10px] uppercase font-bold text-text-secondary">Age & Gender</p>
                      <p className="text-sm font-bold text-navy mt-0.5">{formData.age} · {formData.gender}</p>
                    </div>
                    <div className="bg-surface-2/70 p-3 rounded-xl">
                      <p className="text-[10px] uppercase font-bold text-text-secondary">Body Type</p>
                      <p className="text-sm font-bold text-navy mt-0.5">{formData.bodyType}</p>
                    </div>
                    <div className="bg-surface-2/70 p-3 rounded-xl">
                      <p className="text-[10px] uppercase font-bold text-text-secondary">Primary Goal</p>
                      <p className="text-sm font-bold text-navy mt-0.5">{formData.primaryGoal}</p>
                    </div>
                    <div className="bg-surface-2/70 p-3 rounded-xl">
                      <p className="text-[10px] uppercase font-bold text-text-secondary">Outcome Focus</p>
                      <p className="text-sm font-bold text-navy mt-0.5">{formData.goalPreference}</p>
                    </div>
                    <div className="bg-surface-2/70 p-3 rounded-xl">
                      <p className="text-[10px] uppercase font-bold text-text-secondary">Body Fat Range</p>
                      <p className="text-sm font-bold text-navy mt-0.5">{formData.bodyFat}</p>
                    </div>
                    <div className="bg-surface-2/70 p-3 rounded-xl">
                      <p className="text-[10px] uppercase font-bold text-text-secondary">Diet & Water</p>
                      <p className="text-sm font-bold text-navy mt-0.5">{formData.diet} · {formData.waterIntake}</p>
                    </div>
                  </div>

                  <div className="bg-teal-100/60 p-4 rounded-card border border-teal/30 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase font-bold text-teal-600">Calculated Body Mass Index (BMI)</p>
                      <p className="text-2xl font-black text-navy mt-0.5">
                        {liveBMI.bmi} <span className="text-sm font-bold text-teal-600">({liveBMI.category})</span>
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Daily Target: {formData.preferredDuration} mins yoga · Weight Goal: {formData.targetWeight} {formData.weightUnit}
                      </p>
                    </div>
                    <div className="text-3xl">🧘‍♂️</div>
                  </div>

                  {!user && (
                    <div className="p-3 bg-blue-ai-100/40 rounded-xl border border-blue-ai/20 text-xs text-navy flex items-center gap-2.5">
                      <span className="text-base">💡</span>
                      <span>Next, you'll be prompted to create your free account or sign in to save this profile and access your recommendations.</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-8 pt-4 border-t border-border-ui flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-5 py-2.5 border border-border-ui hover:border-teal rounded-btn text-sm font-bold text-text-secondary hover:text-teal transition-colors"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-5 py-2.5 border border-border-ui hover:border-text-secondary rounded-btn text-sm font-bold text-text-secondary transition-colors"
              >
                Back to Home
              </button>
            )}

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                disabled={!isStepValid()}
                onClick={() => setStep((s) => s + 1)}
                className={`px-6 py-2.5 rounded-btn text-sm font-bold text-white transition-all shadow-sm ${
                  isStepValid()
                    ? 'bg-teal hover:bg-teal-600'
                    : 'bg-border-ui cursor-not-allowed opacity-60'
                }`}
              >
                Next Step
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-teal hover:bg-teal-600 text-white rounded-btn text-sm font-bold transition-all shadow-md flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <span>{user ? 'Complete Onboarding & View Classes' : 'Continue to Register & Save'}</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
