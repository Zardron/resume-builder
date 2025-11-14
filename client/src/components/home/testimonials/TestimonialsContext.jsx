import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { generateAvatarUrl } from '../../../utils/generateAvatarUrl'

const TestimonialsContext = createContext(null)

const initialTestimonials = [
  {
    image: generateAvatarUrl('Briar Martin Marketing Strategist'),
    name: 'Briar Martin',
    role: 'Marketing Strategist',
    date: 'March 5, 2024',
    testimonial:
      'Got my dream job within 2 weeks! This ResumeIQ made my application stand out from the crowd.',
    rating: 4,
  },
  {
    image: generateAvatarUrl('Avery Johnson Content Designer'),
    name: 'Avery Johnson',
    role: 'Content Designer',
    date: 'April 12, 2024',
    testimonial: 'The AI suggestions are incredible..',
    rating: 4,
  },
  {
    image: generateAvatarUrl('John Doe Product Manager'),
    name: 'John Doe',
    role: 'Product Manager',
    date: 'February 18, 2024',
    testimonial: "Finally, a resume tool that doesn't require hours of tweaking. ",
    rating: 5,
  },
  {
    image: generateAvatarUrl('Avery Johnson UX Researcher'),
    name: 'Avery Johnson',
    role: 'UX Researcher',
    date: 'May 9, 2024',
    testimonial:
      'Switched 3 different templates and exported to PDF in minutes. Highly recommend!',
    rating: 3,
  },
  {
    image: generateAvatarUrl('Priya Desai Data Analyst'),
    name: 'Priya Desai',
    role: 'Data Analyst',
    date: 'June 22, 2024',
    testimonial:
      'The keyword optimizer helped me beat the ATS filters, and recruiters finally started reaching out.',
    rating: 5,
  },
  {
    image: generateAvatarUrl('Luca Moretti Software Engineer'),
    name: 'Luca Moretti',
    role: 'Software Engineer',
    date: 'July 14, 2024',
    testimonial:
      'Loved how quickly I could tailor different versions for each role without losing consistency.',
    rating: 4,
  },
  {
    image: generateAvatarUrl('Harper Lee Creative Director'),
    name: 'Harper Lee',
    role: 'Creative Director',
    date: 'August 3, 2024',
    testimonial:
      'The templates feel premium and the collaborative feedback mode saved me hours with my mentor.',
    rating: 5,
  },
  {
    image: generateAvatarUrl('Miguel Alvarez Operations Manager'),
    name: 'Miguel Alvarez',
    role: 'Operations Manager',
    date: 'September 27, 2024',
    testimonial:
      'Exporting directly to LinkedIn-ready formats is a life saver. Onboarding my new team was effortless.',
    rating: 4,
  },
]

export const TestimonialsProvider = ({ children }) => {
  const [testimonials, setTestimonials] = useState(initialTestimonials)

  const addTestimonial = useCallback((testimonial) => {
    setTestimonials((previous) => [testimonial, ...previous])
  }, [])

  const value = useMemo(
    () => ({
      testimonials,
      addTestimonial,
    }),
    [testimonials, addTestimonial],
  )

  return <TestimonialsContext.Provider value={value}>{children}</TestimonialsContext.Provider>
}

export const useTestimonials = () => {
  const context = useContext(TestimonialsContext)

  if (!context) {
    throw new Error('useTestimonials must be used within a TestimonialsProvider')
  }

  return context
}


