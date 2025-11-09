import { useCallback, useMemo, useState } from 'react'
import { generateAvatarUrl } from '../../../utils/generateAvatarUrl'
import { useTestimonials } from '../testimonials/TestimonialsContext'

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  role: '',
  message: '',
  rating: 0,
}

export const useTestimonialForm = () => {
  const { addTestimonial } = useTestimonials()

  const [formData, setFormData] = useState(INITIAL_FORM_STATE)
  const [status, setStatus] = useState('idle')
  const [ratingHover, setRatingHover] = useState(0)

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE)
    setRatingHover(0)
  }, [])

  const setIdleIfNeeded = useCallback(() => {
    setStatus((current) => (current === 'idle' ? current : 'idle'))
  }, [])

  const handleFieldChange = useCallback(
    (field) => (value) => {
      setFormData((previous) => ({
        ...previous,
        [field]: value,
      }))
      setIdleIfNeeded()
    },
    [setIdleIfNeeded],
  )

  const handleMessageChange = useCallback(
    (event) => {
      const { value } = event.target
      setFormData((previous) => ({
        ...previous,
        message: value,
      }))
      setIdleIfNeeded()
    },
    [setIdleIfNeeded],
  )

  const handleRatingSelect = useCallback(
    (value) => {
      setFormData((previous) => ({
        ...previous,
        rating: value,
      }))
      setIdleIfNeeded()
    },
    [setIdleIfNeeded],
  )

  const handleRatingHover = useCallback((value) => {
    setRatingHover(value)
  }, [])

  const handleRatingLeave = useCallback(() => {
    setRatingHover(0)
  }, [])

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()

      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.message.trim() ||
        !formData.rating
      ) {
        setStatus('error')
        return
      }

      const sanitizedName = formData.name.trim()
      const sanitizedRole = formData.role.trim()
      const displayDate = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date())

      const newTestimonial = {
        image: generateAvatarUrl(`${sanitizedName || 'Guest'} ${displayDate}`),
        name: sanitizedName,
        role: sanitizedRole || undefined,
        date: displayDate,
        testimonial: formData.message.trim(),
        rating: formData.rating,
      }

      addTestimonial(newTestimonial)
      setStatus('success')
      resetForm()
    },
    [addTestimonial, formData, resetForm],
  )

  const displayedRating = useMemo(() => ratingHover || formData.rating, [formData.rating, ratingHover])
  const ratingError = useMemo(
    () => status === 'error' && !formData.rating,
    [status, formData.rating],
  )

  return {
    formData,
    status,
    displayedRating,
    ratingError,
    handleFieldChange,
    handleMessageChange,
    handleRatingSelect,
    handleRatingHover,
    handleRatingLeave,
    handleSubmit,
  }
}


