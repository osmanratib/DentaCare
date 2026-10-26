import { z } from 'zod'

export const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Please select a treatment'),
  doctorId: z.string().optional(),
  date: z.string().min(1, 'Please choose an appointment date'),
  timeSlot: z.string().min(1, 'Please select a preferred time slot'),
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(7, 'Please provide a valid telephone number'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().max(500, 'Notes must be under 500 characters').optional(),
  // Anti-bot honeypot field (must stay empty)
  websiteUrl: z.string().max(0, 'Bot detected').optional().or(z.literal('')),
})

export type BookingInput = z.infer<typeof bookingSchema>
