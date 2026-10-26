'use client'

import React, { useState, useEffect } from 'react'
import {
  Clock,
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Shield,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface BlockedDate {
  date: string
  reason: string
}

export default function AvailabilityAdminPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [slotDuration, setSlotDuration] = useState(30)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const [days, setDays] = useState([
    { weekday: 1, name: 'Monday', open: '08:30:00', close: '18:00:00', active: true },
    { weekday: 2, name: 'Tuesday', open: '08:30:00', close: '18:00:00', active: true },
    { weekday: 3, name: 'Wednesday', open: '08:30:00', close: '18:00:00', active: true },
    { weekday: 4, name: 'Thursday', open: '08:30:00', close: '18:00:00', active: true },
    { weekday: 5, name: 'Friday', open: '08:30:00', close: '16:30:00', active: true },
    { weekday: 6, name: 'Saturday', open: '09:00:00', close: '14:00:00', active: true },
    { weekday: 0, name: 'Sunday', open: '10:00:00', close: '14:00:00', active: false },
  ])

  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [newBlockedDate, setNewBlockedDate] = useState('')
  const [newBlockedReason, setNewBlockedReason] = useState('')

  const fetchAvailability = async () => {
    setLoading(true)

    const { data: rulesData } = await supabase.from('availability_rules').select('*')
    if (rulesData && rulesData.length > 0) {
      setDays((prev) =>
        prev.map((day) => {
          const match = rulesData.find((r) => r.weekday === day.weekday)
          if (match) {
            return {
              ...day,
              open: match.start_time,
              close: match.end_time,
              active: true,
            }
          }
          return { ...day, active: false }
        })
      )
      setSlotDuration(rulesData[0].slot_min || 30)
    }

    const { data: blockedData } = await supabase.from('blocked_dates').select('*').order('date', { ascending: true })
    if (blockedData) {
      setBlockedDates(blockedData)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchAvailability()
  }, [])

  const handleSaveWeeklyRules = async () => {
    setLoading(true)

    await supabase.from('availability_rules').delete().neq('weekday', 99)

    const activeRules = days
      .filter((d) => d.active)
      .map((d) => ({
        weekday: d.weekday,
        start_time: d.open.length === 5 ? `${d.open}:00` : d.open,
        end_time: d.close.length === 5 ? `${d.close}:00` : d.close,
        slot_min: slotDuration,
      }))

    const { error } = await supabase.from('availability_rules').insert(activeRules)

    if (error) {
      setMessage({ text: `Failed to save: ${error.message}`, type: 'error' })
    } else {
      setMessage({ text: 'Weekly operatory hours saved into database.', type: 'success' })
    }
    setLoading(false)
    setTimeout(() => setMessage(null), 3000)
  }

  const handleAddBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBlockedDate) return

    const { error } = await supabase.from('blocked_dates').upsert([
      {
        date: newBlockedDate,
        reason: newBlockedReason || 'Clinic Closed',
      },
    ])

    if (error) {
      setMessage({ text: `Error blocking date: ${error.message}`, type: 'error' })
    } else {
      setMessage({ text: `Date ${newBlockedDate} added to blocked schedule.`, type: 'success' })
      setBlockedDates((prev) => [
        ...prev.filter((b) => b.date !== newBlockedDate),
        { date: newBlockedDate, reason: newBlockedReason || 'Clinic Closed' },
      ])
      setNewBlockedDate('')
      setNewBlockedReason('')
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDeleteBlockedDate = async (dateStr: string) => {
    const { error } = await supabase.from('blocked_dates').delete().eq('date', dateStr)

    if (error) {
      setMessage({ text: `Error deleting: ${error.message}`, type: 'error' })
    } else {
      setMessage({ text: `Date ${dateStr} unblocked in database.`, type: 'success' })
      setBlockedDates((prev) => prev.filter((b) => b.date !== dateStr))
    }
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D5] pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#12B5A6]">
            Clinical Rhythm & Calendars
          </span>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-medium text-[#0E1A24]">
            Operatory Windows & Time Slots
          </h1>
          <p className="mt-1 text-xs text-[#0E1A24]/60">
            Define daily operating hours, patient chair-time buffers, and holiday closures.
          </p>
        </div>

        <button
          onClick={handleSaveWeeklyRules}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-full bg-[#0E1A24] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-[#12B5A6] transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4 text-[#12B5A6]" />
          <span>Save Schedule</span>
        </button>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-2xl p-4 text-xs ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Hours */}
        <div className="lg:col-span-7 rounded-4xl border border-[#E5E0D5] bg-white p-6 sm:p-8 space-y-6 shadow-[0_2px_16px_rgba(14,26,36,0.02)]">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#0E1A24]">Weekly Practice Hours</h2>
            <p className="text-xs text-[#0E1A24]/60 mt-1">
              Active days will generate selectable consultation slots in the public booking engine.
            </p>
          </div>

          <div className="space-y-3">
            {days.map((day, idx) => (
              <div
                key={day.name}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] p-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`day-${day.weekday}`}
                    checked={day.active}
                    onChange={(e) => {
                      const updated = [...days]
                      updated[idx].active = e.target.checked
                      setDays(updated)
                    }}
                    className="h-4 w-4 rounded accent-[#12B5A6]"
                  />
                  <label htmlFor={`day-${day.weekday}`} className="font-serif font-bold text-sm text-[#0E1A24] cursor-pointer">
                    {day.name}
                  </label>
                </div>

                {day.active ? (
                  <div className="flex items-center gap-2 text-xs">
                    <input
                      type="time"
                      value={day.open.slice(0, 5)}
                      onChange={(e) => {
                        const updated = [...days]
                        updated[idx].open = e.target.value
                        setDays(updated)
                      }}
                      className="rounded-xl border border-[#DAC7AD] bg-white px-2.5 py-1 text-xs text-[#0E1A24]"
                    />
                    <span className="text-[#0E1A24]/40">to</span>
                    <input
                      type="time"
                      value={day.close.slice(0, 5)}
                      onChange={(e) => {
                        const updated = [...days]
                        updated[idx].close = e.target.value
                        setDays(updated)
                      }}
                      className="rounded-xl border border-[#DAC7AD] bg-white px-2.5 py-1 text-xs text-[#0E1A24]"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-[#0E1A24]/40 italic">Closed for VIP / Private Care</span>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#F0ECE1]">
            <label className="block text-xs font-semibold text-[#0E1A24]/70 mb-2">
              Default Appointment Slot Buffer
            </label>
            <select
              value={slotDuration}
              onChange={(e) => setSlotDuration(Number(e.target.value))}
              className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-xs text-[#0E1A24]"
            >
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes (Recommended for Veneers)</option>
              <option value={60}>60 Minutes (Full Mouth Rehabilitation)</option>
              <option value={90}>90 Minutes (Surgical Implant Placement)</option>
            </select>
          </div>
        </div>

        {/* Blocked Dates */}
        <div className="lg:col-span-5 rounded-4xl border border-[#E5E0D5] bg-white p-6 sm:p-8 space-y-6 shadow-[0_2px_16px_rgba(14,26,36,0.02)]">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#0E1A24]">Blocked Dates & Solstices</h2>
            <p className="text-xs text-[#0E1A24]/60 mt-1">
              Dates marked here are locked out across all public scheduling touchpoints.
            </p>
          </div>

          <form onSubmit={handleAddBlockedDate} className="space-y-3 rounded-3xl bg-[#FAF8F5] p-4 border border-[#E5E0D5]">
            <span className="text-xs font-semibold text-[#0E1A24] block">Block a Specific Date</span>
            <input
              type="date"
              required
              value={newBlockedDate}
              onChange={(e) => setNewBlockedDate(e.target.value)}
              className="w-full rounded-2xl border border-[#DAC7AD] bg-white p-2.5 text-xs text-[#0E1A24]"
            />
            <input
              type="text"
              placeholder="Reason (e.g. European Dental Conference)"
              value={newBlockedReason}
              onChange={(e) => setNewBlockedReason(e.target.value)}
              className="w-full rounded-2xl border border-[#DAC7AD] bg-white p-2.5 text-xs text-[#0E1A24]"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-[#0E1A24] py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#12B5A6] transition-colors"
            >
              + Block Date in Database
            </button>
          </form>

          <div className="space-y-2 max-h-72 overflow-y-auto">
            {blockedDates.length === 0 ? (
              <div className="text-[#0E1A24]/40 text-xs italic py-4 text-center">
                No dates currently blocked.
              </div>
            ) : (
              blockedDates.map((b) => (
                <div
                  key={b.date}
                  className="flex items-center justify-between rounded-2xl bg-[#FAF8F5] p-3 text-xs border border-[#E5E0D5]"
                >
                  <div>
                    <span className="font-mono font-bold text-[#0E1A24]">{b.date}</span>
                    <p className="text-[11px] text-[#0E1A24]/60 mt-0.5">{b.reason}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteBlockedDate(b.date)}
                    className="p-1.5 text-[#0E1A24]/40 hover:text-rose-600 rounded-full hover:bg-rose-50"
                    title="Unblock date"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
