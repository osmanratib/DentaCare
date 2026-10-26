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

    // 2. Anti-bot honeypot check
    if (validated.websiteUrl && validated.websiteUrl.length > 0) {
      return {
        success: false,
        message: 'Bot submission detected.',
      }
    }

    const referenceId = `DNT-${Math.floor(100000 + Math.random() * 900000)}`

    // 3. Supabase Database Write
    const db = createAdminClient()

    // Find the matching service by UUID or by slug
    let serviceUUID: string | null = null
    const { data: matchedServices } = await db
      .from('services')
      .select('id, slug')

    if (matchedServices && matchedServices.length > 0) {
      const match = matchedServices.find(
        (s) => s.id === validated.serviceId || s.slug === validated.serviceId
      )
      serviceUUID = match ? match.id : matchedServices[0].id
    }

    // Upsert Patient by phone number
    const { data: patient, error: patientError } = await db
      .from('patients')
      .upsert(
        {
          full_name: validated.name.trim(),
          phone: validated.phone.trim(),
          email: validated.email.trim(),
          notes: validated.message ? `Booking request notes: ${validated.message}` : null,
        },
        { onConflict: 'phone' }
      )
      .select('id')
      .single()

    if (patientError) {
      console.error('Supabase patient upsert error:', patientError)
      return {
        success: false,
        message: `Database error saving patient: ${patientError.message}`,
      }
    }

    // Insert Appointment record
    const requestedDateTime = new Date(`${validated.date}T10:00:00Z`).toISOString()

    const { error: aptError } = await db.from('appointments').insert({
      patient_id: patient.id,
      service_id: serviceUUID,
      requested_at: requestedDateTime,
      status: 'pending',
      message: `${validated.timeSlot} | Doctor: ${validated.doctorId || 'Any'} | Notes: ${validated.message || 'None'}`,
      source: 'website',
    })

    if (aptError) {
      console.error('Supabase appointment insert error:', aptError)
      return {
        success: false,
        message: `Database error booking appointment: ${aptError.message}`,
      }
    }

    // 4. Return confirmed success
    return {
      success: true,
      message: 'Your appointment reservation request has been confirmed and saved to our clinic database.',
      referenceId,
    }
  } catch (err: unknown) {
    console.error('Booking server action error:', err)
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Validation or network failure',
      error: String(err),
    }
  }
}
