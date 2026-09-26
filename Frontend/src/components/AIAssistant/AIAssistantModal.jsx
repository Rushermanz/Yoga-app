import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const DEFAULT_PROMPTS = [
  'What should I train today?',
  'Find a 20-minute mobility session',
  'Recommend something for beginners',
  'Breathing & stress relief routine',
  'Desk posture fix for back pain',
]

// Intelligent yoga AI response generator
const getAIResponse = (userPrompt, userName) => {
  const q = userPrompt.toLowerCase()

  if (q.includes('what should i train') || q.includes('today') || q.includes('plan')) {
    const hours = new Date().getHours()
    const timeGreeting = hours < 12 ? 'morning' : hours < 17 ? 'afternoon' : 'evening'
    return {
      text: `Good ${timeGreeting}, ${userName || 'friend'}! Based on a balanced routine for today, I recommend:

1. **Warmup (5 min):** Cat-Cow breathing & Gentle Downward Dog to wake up the spine.
2. **Main Practice (15-20 min):** Sun Salutations A & B followed by a grounding Warrior sequence for balance and hip mobility.
3. **Cool-down (5 min):** Child's Pose & Supine Spinal Twist for nervous system recovery.

Would you like to explore on-demand classes matching this routine?`,
      action: { label: 'Explore Today\'s Classes', to: '/classes' },
    }
  }

  if (q.includes('mobility') || q.includes('posture') || q.includes('desk') || q.includes('back')) {
    return {
      text: `Here is a targeted 20-minute Mobility & Posture Routine:

• **Chest Opener & Cactus Arms:** 8 deep breaths to reverse desk slouching.
• **Cat-Cow Flow:** 10 cycles linking movement with inhalation/exhalation.
• **Thread-the-Needle:** 5 breaths per side for thoracic spine rotation.
• **Low Lunge (Anjaneyasana):** 1 min per side to open tight hip flexors from prolonged sitting.
• **Sphinx Pose:** 10 breaths to strengthen the lower back.

Consistency is key! Just 15-20 minutes daily reduces stiffness by up to 60%.`,
      action: { label: 'View Mobility Classes', to: '/classes' },
    }
  }

  if (q.includes('beginner') || q.includes('start') || q.includes('new')) {
    return {
      text: `Welcome to your yoga practice! Here are 3 golden guidelines for beginners:

1. **Focus on Breath, Not Perfection:** Breathe smoothly in and out through your nose (Ujjayi breathing).
2. **Never Force a Pose:** Keep a soft micro-bend in knees and elbows to protect your joints.
3. **Start with Foundations:** Mountain Pose (Tadasana), Downward-Facing Dog, and Child's Pose form the core of every flow.

I recommend taking our quick 1-minute assessment if you haven't yet, so we can personalize every class for your body!`,
      action: { label: 'Take 1-Min Assessment', to: '/onboarding' },
    }
  }

  if (q.includes('breath') || q.includes('stress') || q.includes('anxiety') || q.includes('relax') || q.includes('calm')) {
    return {
      text: `Let's calm your nervous system right now:

• **4-7-8 Pranayama:** Inhale quietly through nose for 4s, hold gently for 7s, exhale completely through mouth for 8s. Repeat 4 rounds.
• **Balasana (Child's Pose):** Rest forehead on mat, extend arms forward, and breathe deep into the back ribs.
• **Viparita Karani (Legs-Up-The-Wall):** Spend 5-10 minutes with legs elevated to slow your heart rate and lower cortisol.

Our mind-body instructors have specialized breathwork classes designed for fast stress release.`,
      action: { label: 'Find Restorative Classes', to: '/classes' },
    }
  }

  if (q.includes('strength') || q.includes('core') || q.includes('power')) {
    return {
      text: `For functional strength and core endurance:

• **High Plank to Forearm Plank:** 3 sets of 45 seconds. Keep hips level and core engaged.
• **Navasana (Boat Pose):** 3 rounds of 30 seconds to target the transverse abdominis.
• **Warrior III (Virabhadrasana III):** 5 breaths per leg to build ankle stability and posterior chain power.
• **Side Plank (Vasisthasana):** 30 seconds per side for oblique and shoulder girdle stability.`,
      action: { label: 'Explore Power Yoga', to: '/classes' },
    }
  }

  if (q.includes('recommend') || q.includes('classes') || q.includes('custom')) {
    return {
      text: `Your personalized yoga profile is calibrated with your onboarding goals, fitness level, and preferred practice style!

Head over to your personalized Recommendations hub to view all matched courses, instructor pairings, and session schedules customized for you.`,
      action: { label: 'Go to My Recommendations', to: '/dashboard/recommendations' },
    }
  }

  // Fallback response
  return {
    text: `That's a great question regarding **"${userPrompt}"**!

As your Yoga Master AI Coach, I suggest combining mindful alignment with regular practice. Whether you want to improve flexibility, build core stability, or unwind after a busy day, our instructors provide step-by-step guidance tailored to all levels.

Explore our instructor-led classes or check your customized recommendations in your dashboard!`,
    action: { label: 'Explore Classes', to: '/classes' },
  }
}

const AIAssistantModal = ({ isOpen: controlledIsOpen, onClose: controlledOnClose, initialPrompt = '' }) => {
  const { user } = useAuth()
  const userName = user?.displayName ? user.displayName.split(' ')[0] : 'Yogi'

  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isControlled = typeof controlledIsOpen === 'boolean'
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen

  const handleClose = () => {
    if (isControlled && controlledOnClose) {
      controlledOnClose()
    }
    setInternalIsOpen(false)
  }

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hi ${userName}! 👋 I'm your Yoga Master AI Assistant. How can I guide your practice or fitness routine today?`,
      time: 'Just now',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  // Listen for global custom events to open with optional prompt
  useEffect(() => {
    const handleGlobalOpen = (e) => {
      setInternalIsOpen(true)
      const prompt = e.detail?.prompt
      if (prompt) {
        handleSendPrompt(prompt)
      }
    }
    window.addEventListener('open-ai-assistant', handleGlobalOpen)
    return () => window.removeEventListener('open-ai-assistant', handleGlobalOpen)
  }, [])

  // Auto scroll
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleSendPrompt = (promptText) => {
    const textToSend = promptText || input.trim()
    if (!textToSend) return

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking delay for natural conversational feel
    setTimeout(() => {
      const aiReply = getAIResponse(textToSend, userName)
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiReply.text,
        action: aiReply.action,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 600)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSendPrompt(input)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-navy/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-navy-800 border border-white/15 rounded-card shadow-2xl overflow-hidden flex flex-col z-10 max-h-[88vh]"
          >
            {/* Header */}
            <div className="p-4 sm:px-6 sm:py-4 bg-navy/90 border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal to-blue-ai flex items-center justify-center text-white shadow-md">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-teal border-2 border-navy-800 rounded-full animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white tracking-tight">Yoga Master AI Assistant</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-ai/20 text-blue-ai rounded-full border border-blue-ai/30">
                      Live
                    </span>
                  </div>
                  <p className="text-xs text-white/60">Instant yoga, posture & training recommendations</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard/recommendations"
                  onClick={handleClose}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-btn bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/15"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill="#12B8A6"
                    />
                  </svg>
                  My Plan
                </Link>

                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close AI Assistant"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 min-h-[260px] max-h-[50vh]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-lg bg-blue-ai/20 border border-blue-ai/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                          fill="#4385F5"
                        />
                      </svg>
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
                    <div
                      className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-teal text-white rounded-tr-xs shadow-md'
                          : 'bg-navy/90 text-white/90 border border-white/10 rounded-tl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {msg.action && (
                      <div className="pt-1">
                        <Link
                          to={msg.action.to}
                          onClick={handleClose}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-ai text-white text-xs font-bold rounded-btn hover:bg-blue-600 transition-colors shadow-sm"
                        >
                          <span>{msg.action.label}</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                      </div>
                    )}

                    <span className="block text-[10px] text-white/40 px-1">{msg.time}</span>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-lg bg-blue-ai/20 border border-blue-ai/30 flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill="#4385F5"
                      />
                    </svg>
                  </div>
                  <div className="bg-navy/90 border border-white/10 text-white text-xs px-4 py-2.5 rounded-2xl rounded-tl-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-teal rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-blue-ai rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-coral rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2.5 bg-navy/60 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-semibold text-white/50 flex-shrink-0">Quick ask:</span>
              {DEFAULT_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSendPrompt(p)}
                  className="text-xs px-3 py-1 bg-white/5 border border-white/15 text-white/80 rounded-full hover:bg-white/15 hover:text-white transition-all whitespace-nowrap cursor-pointer flex-shrink-0"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-navy border-t border-white/10">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about poses, routines, or recommendations..."
                  className="flex-1 bg-white/5 border border-white/15 rounded-btn px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-teal transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="px-4 py-2.5 bg-teal text-white font-bold text-sm rounded-btn hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center flex-shrink-0"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AIAssistantModal
