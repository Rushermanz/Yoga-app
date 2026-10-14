// Curated free goal-oriented yoga & fitness programs per promt.docx (Sections 8, 12 & 36)
const FREE_PROGRAMS = [
  {
    id: 'core-strength-60',
    title: '60-Day Core, Abs & Functional Strength',
    subtitle: 'Progressive bodyweight isometric & dynamic power protocol',
    durationDays: 60,
    dailyMinutes: 25,
    level: 'All Levels (Progressive)',
    primaryGoal: 'Strength & Toning',
    category: 'Strength',
    image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80',
    tag: 'Trending 60-Day Challenge',
    badgeColor: 'bg-coral-100 text-coral',
    overview: 'Inspired by progressive core conditioning, this 60-day journey systematically builds abdominal endurance, transverse stability, and full-body posture support without requiring equipment.',
    benefits: [
      'Sculpt transverse abdominis and oblique stabilizers',
      'Eliminate lower back strain by strengthening the anterior core',
      'Progressive challenge from foundational planks to advanced arm-balance preps',
      'Daily 20-25 minute workouts with built-in active recovery days'
    ],
    weeks: [
      {
        weekNumber: 1,
        theme: 'Foundations & Isometric Activation',
        focus: 'Plank alignment, Navasana holds, pelvic floor connection',
        days: [
          { day: 1, title: 'Foundational Core Awakening', minutes: 20, intensity: 'Moderate', exercises: ['Cat-Cow Core Pacing (2 min)', 'Forearm Plank Hold (3x45s)', 'Bird-Dog Cross Reaches (12 reps/side)', 'Child\'s Pose Recovery (3 min)'] },
          { day: 2, title: 'Oblique & Lateral Stability', minutes: 22, intensity: 'Moderate', exercises: ['Side Plank Alignment (30s/side)', 'Thread-the-Needle (5 reps/side)', 'Supine Bicycle Twists (20 reps)', 'Supine Twist Cool-down'] },
          { day: 3, title: 'Active Recovery & Breath Reset', minutes: 15, intensity: 'Light', exercises: ['Diaphragmatic Breathing (5 min)', 'Sphinx Pose (2 min)', 'Gentle Happy Baby (3 min)', 'Savasana Rest'] },
          { day: 4, title: 'Lower Abdominal & Hip Flexor Control', minutes: 25, intensity: 'High', exercises: ['Leg Lower Progressions (12 reps)', 'Navasana / Boat Pose (4x30s)', 'Bridge Pose Glute Drive (15 reps)', 'Seated Forward Fold'] },
          { day: 5, title: 'Dynamic Vinyasa Core Flow', minutes: 25, intensity: 'High', exercises: ['Sun Salutation A (5 rounds)', 'Knee-to-Nose Plank Drives (10/side)', 'Warrior III Stability Hold (5 breaths/side)', 'Downward Dog Pedaling'] },
          { day: 6, title: 'Isometric Endurance Test', minutes: 20, intensity: 'Moderate', exercises: ['3-Minute Cumulative Plank', 'Hollow Body Hold (4x20s)', 'Cobra Spine Relief (2 min)'] },
          { day: 7, title: 'Rest & Myofascial Release', minutes: 15, intensity: 'Rest', exercises: ['Full Body Rest', 'Foam Rolling / Gentle Stretching', '5-Minute Hydration & Mobility Check'] },
        ]
      },
      {
        weekNumber: 2,
        theme: 'Transverse Abdominis & Posterior Chain',
        focus: 'Strengthening the corset muscles that pull in the waist and support lumbar spine',
        days: [
          { day: 8, title: 'Deep Core Vacuum & Pelvic Tilt', minutes: 20, intensity: 'Moderate', exercises: ['Vacuum Breathwork (4 sets)', 'Dead-Bug Cross Reaches (16 reps)', 'Forearm Plank Body Saws (12 reps)', 'Child\'s Pose'] },
          { day: 9, title: 'Rotational Strength Flow', minutes: 25, intensity: 'High', exercises: ['Revolved Low Lunge (5 breaths/side)', 'Side Plank Hip Dips (10/side)', 'Russian Twist in Boat (20 reps)', 'Corpse Pose'] },
          { day: 10, title: 'Postural Spine Decompression', minutes: 18, intensity: 'Light', exercises: ['Locust Pose (Salabhasana) (3x10s)', 'Puppy Pose Chest Opener', 'Cat-Cow Spinal Waves'] },
          { day: 11, title: 'Power Plank Circuit', minutes: 25, intensity: 'High', exercises: ['High Plank Tap-outs (20 reps)', 'Dolphin Push-ups (10 reps)', 'Forearm Plank Hold (60s)', 'Sphinx Rest'] },
          { day: 12, title: 'Balance & Core Integration', minutes: 25, intensity: 'Moderate', exercises: ['Warrior II to Reverse Warrior', 'Half Moon (Ardha Chandrasana) (30s/side)', 'Standing Knee Drives', 'Forward Fold'] },
          { day: 13, title: 'Total Abdominal Burn', minutes: 25, intensity: 'High', exercises: ['V-Up Progressions (10 reps)', 'Mountain Climbers (40s)', 'Side Plank Reach-throughs', 'Twisting Pigeon'] },
          { day: 14, title: 'Weekly Milestone Check & Rest', minutes: 15, intensity: 'Rest', exercises: ['Active Rest', 'Reflect on 2-Week Core Stability Gains', '10-Minute Relaxation Breathing'] },
        ]
      }
    ]
  },
  {
    id: 'mobility-posture-30',
    title: '30-Day Mobility & Posture Reset',
    subtitle: 'Desk-fatigue reversal, thoracic decompression & hip freedom',
    durationDays: 30,
    dailyMinutes: 20,
    level: 'Beginner to Intermediate',
    primaryGoal: 'Posture Correction',
    category: 'Posture',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
    tag: 'Desk Worker Essential',
    badgeColor: 'bg-teal-100 text-teal',
    overview: 'Engineered specifically for individuals who spend long hours sitting. Counteract forward head posture, rounded shoulders, tight hip flexors, and lower back stiffness with targeted 20-minute daily mobility protocols.',
    benefits: [
      'Decompress cervical and thoracic spine vertebrae',
      'Open tight anterior hip flexors and restore glute activation',
      'Correct rounded shoulder carriage with scapular retraction',
      'Noticeable posture improvement within 14 days'
    ],
    weeks: [
      {
        weekNumber: 1,
        theme: 'Neck, Shoulders & Upper Spine Awakening',
        focus: 'Reversing text-neck and forward head carriage',
        days: [
          { day: 1, title: 'Neck & Cervical Spine Release', minutes: 18, intensity: 'Light', exercises: ['Chin Tucks (15 reps)', 'Upper Trap Gentle Neck Stretches (1 min/side)', 'Eagle Arms Scapular Stretch', 'Corpse Pose'] },
          { day: 2, title: 'Thoracic Extension & Chest Opening', minutes: 20, intensity: 'Moderate', exercises: ['Cactus Arm Wall Slides (12 reps)', 'Puppy Pose with Blocks (2 min)', 'Thread the Needle Rotation', 'Sphinx Pose'] },
          { day: 3, title: 'Hip Flexor Freedom', minutes: 20, intensity: 'Moderate', exercises: ['Low Lunge with Psoas Reach (1 min/side)', 'Half Kneeling Quad Stretch', 'Glute Bridges (15 reps)', 'Child\'s Pose'] },
          { day: 4, title: 'Spinal Waves & Rotary Mobility', minutes: 22, intensity: 'Moderate', exercises: ['Cat-Cow Waves (15 rounds)', 'Revolved Chair Pose (5 breaths/side)', 'Supine Windshield Wipers', 'Savasana'] },
          { day: 5, title: 'Scapular Retraction & Back Strength', minutes: 20, intensity: 'Moderate', exercises: ['Prone Y-T-W Raises (10 reps each)', 'Baby Cobra Holds (3x10s)', 'Downward Facing Dog Spine Lengthening'] },
          { day: 6, title: 'Full Body Alignment Reset', minutes: 25, intensity: 'Moderate', exercises: ['Mountain Pose (Tadasana) Postural Check (3 min)', 'Triangle Pose (Trikonasana)', 'Warrior I Hip Squaring', 'Forward Fold'] },
          { day: 7, title: 'Rest & Deep Breathwork', minutes: 15, intensity: 'Rest', exercises: ['Somatic Body Scan', 'Box Breathing 4-4-4-4', 'Supported Fish Pose with Bolster'] },
        ]
      }
    ]
  },
  {
    id: 'flexibility-hamstring-21',
    title: '21-Day Flexibility & Lower Body Range',
    subtitle: 'Hip openers, deep hamstring lengthening & fascia release',
    durationDays: 21,
    dailyMinutes: 25,
    level: 'All Levels',
    primaryGoal: 'Build Flexibility & Mobility',
    category: 'Flexibility',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
    tag: 'High Demand',
    badgeColor: 'bg-blue-ai-100 text-blue-ai',
    overview: 'A scientifically structured progressive flexibility journey designed to safely unlock tight hamstrings, open stiff hips, and expand functional range of motion without overstretching ligaments.',
    benefits: [
      'Increase hamstring length by up to 25% safely',
      'Unlock stubborn hip rotators and relieve lower back tightness',
      'Master the foundational forward folds, lunges, and splits prep',
      'Yin-inspired long holds targeting connective fascia tissue'
    ],
    weeks: [
      {
        weekNumber: 1,
        theme: 'Hamstrings & Posterior Chain Opening',
        focus: 'Gentle progressive lengthening without rounding the lumbar spine',
        days: [
          { day: 1, title: 'Safe Hamstring Warmup & Alignment', minutes: 22, intensity: 'Moderate', exercises: ['Standing Calf & Hamstring Pedals', 'Half-Splits (Ardha Hanumanasana) (1 min/side)', 'Pyramid Pose Microbend (1 min/side)', 'Supine Hamstring Strap Stretch'] },
          { day: 2, title: 'Hip Capsule & Outer Rotators', minutes: 25, intensity: 'Moderate', exercises: ['Figure 4 Stretch (1.5 min/side)', 'Pigeon Pose Setup & Holds (2 min/side)', 'Lizard Pose Inner Groin Release', 'Child\'s Pose'] },
          { day: 3, title: 'Adductor & Groin Mobility', minutes: 20, intensity: 'Moderate', exercises: ['Wide-Legged Forward Fold (Prasarita)', 'Frog Pose Gentle Hold (2 min)', 'Butterfly Pose (Baddha Konasana)', 'Corpse Pose'] },
          { day: 4, title: 'Active vs Passive Flexibility', minutes: 25, intensity: 'High', exercises: ['Single-Leg Romanian Yoga RDLs (8/leg)', 'Standing Forward Fold (Uttanasana)', 'Low Lunge to Half Splits Flow', 'Downward Dog'] },
          { day: 5, title: 'Deep Fascia Yin Holds', minutes: 30, intensity: 'Light', exercises: ['Caterpillar Pose (3 min hold)', 'Dragon Pose Low Hip Sinking (2 min/side)', 'Shoelace Pose', 'Legs-up-the-wall'] },
          { day: 6, title: 'Flowing Flexibility Sequence', minutes: 25, intensity: 'Moderate', exercises: ['Sun Salutation B (4 rounds)', 'Triangle into Extended Side Angle', 'Revolved Triangle Pose', 'Seated Forward Fold'] },
          { day: 7, title: 'Weekly Range Assessment & Rest', minutes: 15, intensity: 'Rest', exercises: ['Finger-to-Toe Range Test', 'Gentle Joint Circles', 'Recovery Hydration'] },
        ]
      }
    ]
  },
  {
    id: 'stress-nervous-system-14',
    title: '14-Day Stress Relief & Breathwork Protocol',
    subtitle: 'Vagal nerve stimulation, Pranayama & restorative recovery',
    durationDays: 14,
    dailyMinutes: 18,
    level: 'All Levels',
    primaryGoal: 'Stress Relief & Mental Wellness',
    category: 'Recovery',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80',
    tag: 'Nervous System Reset',
    badgeColor: 'bg-teal-100 text-teal',
    overview: 'Down-regulate your sympathetic "fight or flight" response with proven breath pacing, parasympathetic activation, and restorative restorative postures designed for deep sleep and daily calm.',
    benefits: [
      'Lower resting cortisol and balance heart rate variability',
      'Improve sleep quality and fall asleep up to 40% faster',
      'Learn diaphragmatic box breathing and Ujjayi breath control',
      'Zero athletic fatigue — pure physical recovery'
    ],
    weeks: [
      {
        weekNumber: 1,
        theme: 'Parasympathetic Down-Regulation',
        focus: 'Exhalation lengthening to trigger the vagus nerve relaxation response',
        days: [
          { day: 1, title: '4-7-8 Breath & Diaphragmatic Awakening', minutes: 15, intensity: 'Gentle', exercises: ['Hand-on-Heart Diaphragm Breath (5 min)', 'Supported Child\'s Pose (5 min)', 'Legs-Up-The-Wall Viparita Karani (5 min)'] },
          { day: 2, title: 'Evening Unwind & Sleep Induction', minutes: 20, intensity: 'Gentle', exercises: ['Reclining Bound Angle with Bolster (5 min)', 'Supine Spinal Twists (3 min/side)', 'Progressive Muscle Relaxation (5 min)'] },
          { day: 3, title: 'Vagus Nerve Reset Routine', minutes: 18, intensity: 'Gentle', exercises: ['Gentle Neck Side Rolls with Humming Breath', 'Cat-Cow Slow Breath Synchronization', 'Child\'s Pose Extended Arm Walk'] },
          { day: 4, title: 'Shoulder & Jaw Tension Release', minutes: 18, intensity: 'Gentle', exercises: ['Jaw Release & Lion\'s Breath (3 rounds)', 'Thread the Needle Passive Hold', 'Supported Fish Pose'] },
          { day: 5, title: 'Nadi Shodhana Alternate Nostril Breath', minutes: 16, intensity: 'Gentle', exercises: ['Alternate Nostril Pacing (8 min)', 'Gentle Seated Forward Fold', 'Deep Savasana'] },
          { day: 6, title: 'Full Body Passive Yin Melt', minutes: 22, intensity: 'Gentle', exercises: ['Dragonfly Floor Hold (3 min)', 'Sphinx Restorative Hold (3 min)', 'Supported Bridge with Block'] },
          { day: 7, title: 'Reflection & Sensory Rest', minutes: 15, intensity: 'Rest', exercises: ['Digital Detox Practice', 'Silent Mindfulness Walk', 'Gratitude Check-in'] },
        ]
      }
    ]
  },
  {
    id: 'weight-conditioning-45',
    title: '45-Day Weight Management & Metabolic Flow',
    subtitle: 'High-tempo active Vinyasa, cardiovascular output & stamina',
    durationDays: 45,
    dailyMinutes: 30,
    level: 'Intermediate',
    primaryGoal: 'Weight Management',
    category: 'Strength',
    image: 'https://images.unsplash.com/photo-1552196563-55246c789077?w=600&auto=format&fit=crop&q=80',
    tag: 'High Energy',
    badgeColor: 'bg-coral-100 text-coral',
    overview: 'Turn your yoga mat into a high-efficiency metabolic conditioning studio. Continuous breath-linked movement, power transitions, and bodyweight intervals keep your heart rate elevated and burn calories effectively.',
    benefits: [
      'Elevate resting metabolic rate through continuous multi-joint compound movement',
      'Build lean muscular definition across shoulders, core, glutes, and legs',
      'Enhance cardiovascular stamina without high-impact joint wear',
      'Burn 250-400 calories per session'
    ],
    weeks: [
      {
        weekNumber: 1,
        theme: 'Metabolic Ignition & Tempo Building',
        focus: 'Seamless transitions and active core engagement',
        days: [
          { day: 1, title: 'Power Sun Salutations Tempo', minutes: 28, intensity: 'High', exercises: ['Sun Salutation A Fast Flow (5 rounds)', 'Sun Salutation B Jump-backs (4 rounds)', 'Chair Pose Pulsing Holds', 'Cool-down Twist'] },
          { day: 2, title: 'Legs, Glutes & Isometric Burn', minutes: 30, intensity: 'High', exercises: ['Warrior II to Goddess Squat Transitions (15 reps)', 'Warrior III Dynamic Airplane Pulses', 'Lunge Jump Switches (Modified)', 'Forward Fold'] },
          { day: 3, title: 'Active Recovery Flow', minutes: 20, intensity: 'Moderate', exercises: ['Gentle Slow Vinyasa', 'Down Dog Leg Swings', 'Sphinx & Cobra Stretches', 'Child\'s Pose'] },
          { day: 4, title: 'Upper Body Power & Plank Sequences', minutes: 30, intensity: 'High', exercises: ['Chaturanga Dandasana Holds & Press-ups', 'Plank to Down Dog Toe Taps (20 reps)', 'Dolphin Forearm Stand Prep', 'Puppy Pose'] },
          { day: 5, title: 'Full Body Cardiovascular Flow', minutes: 32, intensity: 'High', exercises: ['Continuous Flow: Warrior I to II to Reverse to Triangle', 'High Plank Knee Drives', 'Boat Pose Cardio Flutter Kicks', 'Savasana'] },
          { day: 6, title: 'Core & Stamina Sprint', minutes: 25, intensity: 'High', exercises: ['Mountain Climbers to Down Dog (5 min block)', 'Warrior II Hold (90s/side)', 'Side Plank Rotations', 'Seated Twist'] },
          { day: 7, title: 'Rest & Metabolic Recharge', minutes: 15, intensity: 'Rest', exercises: ['Full Body Rest', 'Hydration & Nutrition Check', 'Gentle Foam Rolling'] },
        ]
      }
    ]
  }
];

module.exports = { FREE_PROGRAMS };
