import React from 'react'
import HeroContainer from './Hero/HeroContainer'
import Programs from './Programs/Programs'
import SmartPlanning from './SmartPlanning/SmartPlanning'
import PopularClasses from './PopularClasses/PopularClasses'
import PopularTeacher from './PopularTeacher/PopularTeacher'
import AICoachSection from './AICoach/AICoachSection'
import StatsSection from './PopularTeacher/StatsSection'

const Home = () => {
  return (
    <main>
      <HeroContainer />
      <Programs />
      <PopularClasses />
      <SmartPlanning />
      <PopularTeacher />
      <AICoachSection />
      <StatsSection />
    </main>
  )
}

export default Home
