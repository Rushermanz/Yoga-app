import React from 'react'
import { Link } from 'react-router-dom'

const difficultyColor = {
  Beginner:     'bg-teal-100 text-teal',
  Intermediate: 'bg-coral-100 text-coral',
  Advanced:     'bg-blue-ai-100 text-blue-ai',
}

const Card = ({ item }) => {
  const { _id, name, image, availableSeats, price, totalEnrolled, level, duration } = item

  const diff = level || 'Beginner'

  return (
    <div className="flex flex-col bg-white border border-border-ui rounded-card overflow-hidden transition-card hover-lift group">
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden bg-surface-2">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🧘</div>
        )}
        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${difficultyColor[diff] || difficultyColor.Beginner}`}>
          {diff}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-text-primary mb-1 line-clamp-2">{name}</h3>

        <div className="flex items-center gap-3 text-xs text-text-secondary mt-1 mb-3">
          {duration && (
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {duration} min
            </span>
          )}
          <span>{totalEnrolled || 0} enrolled</span>
          {price !== undefined && (
            <span className="ml-auto font-bold text-text-primary">
              {price === 0 ? 'Free' : `$${price}`}
            </span>
          )}
        </div>

        <Link to={`class/${_id}`} className="mt-auto">
          <button className="w-full py-2.5 bg-teal text-white text-xs font-bold rounded-btn hover:bg-teal-600 transition-colors duration-200">
            View Class
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Card