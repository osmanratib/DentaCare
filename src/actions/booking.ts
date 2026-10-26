'use server'

import { bookingSchema, type BookingInput } from '@/lib/validators/booking'
import { createAdminClient } from '@/lib/supabase/admin'

export interface BookingResponse {
  success: boolean
  message: string
  referenceId?: string
  error?: string
}

export async function requestAppointment(
  data: BookingInput,
  botToken?: string
): Promise<BookingResponse> {
  try {
    // 1. Zod Validation
    const validated = bookingSchema.parse(data)

    // 2. Honeypot check
    if (validated.websiteUrl && validated.websiteUrl.length > 0) {
      return {
        success: false,
        message: 'Invalid submission request.',
      }
    }

    const referenceId = `DNT-${Math.floor(100000 + Math.random() * 900000)}`

    // 3. Try writing to Supabase if configured, otherwise succeed gracefully
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('placeholder')
    ) {
      const db = createAdminClient()

      // Upsert patient by phone
      const { data: patient, error: patientError } = await db
        .from('patients')
        .upsert(
          {
            full_name: validated.name,
            phone: validated.phone,
            email: validated.email,
          },
          { onConflict: 'phone' }
        )
        .select()
        .single()

      if (patientError) {
        console.error('Error upserting patient:', patientError)
      } else if (patient) {
        // Insert appointment
        await db.from('appointments').insert({
          patient_id: patient.id,
          service_id: validated.serviceId,
          requested_at: new Date(`${validated.date}T10:00:00Z`).toISOString(),
          status: 'pending',
          message: validated.message || null,
          source: 'website',
        })
      }
    }

    // 4. Return success response
    return {
      success: true,
      message: 'Your appointment reservation request has been submitted for priority confirmation.',
      referenceId,
    }
  } catch (err: unknown) {
    console.error('Booking server action error:', err)
    return {
      success: false,
      message: 'Failed to process appointment. Please verify your entries.',
      error: err instanceof Error ? err.message : 'Unknown validation error',
    }
  }
}
