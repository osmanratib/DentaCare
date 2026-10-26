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
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AvailabilityRule {
  id?: string
  weekday: number
  start_time: string
  end_time: string
  slot_min: number
}

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

    // Fetch rules from Supabase
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

    // Fetch blocked dates from Supabase
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

    // Delete existing rules then insert updated active days
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
      setMessage({ text: 'Weekly availability schedule saved to Supabase.', type: 'success' })
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
        reason: newBlockedReason || 'Clinic Closed / Staff Training',
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-electric-teal">
            Scheduling Matrix
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-white">
            Clinic Hours & Time Slots
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            CRUD operations connected directly to Supabase <code className="text-slate-300">availability_rules</code> and <code className="text-slate-300">blocked_dates</code>.
          </p>
        </div>

        <button
          onClick={handleSaveWeeklyRules}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-electric-teal px-5 py-2.5 text-xs font-semibold text-slate-950 shadow-glow-teal hover:bg-white transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>Save Operating Rules</span>
        </button>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-2xl p-4 text-xs ${
            message.type === 'success'
              ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800'
              : 'bg-red-950/70 text-red-300 border border-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Hours Editor */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
          <h3 className="font-serif text-xl font-medium text-white">Weekly Operating Windows</h3>
          <p className="text-xs text-slate-400">
            Toggle days and adjust open/close hours. Appointments on the public site reflect these active windows.
          </p>

          <div className="space-y-3">
            {days.map((day, idx) => (
              <div
                key={day.name}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs"
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
                    className="h-4 w-4 rounded accent-electric-teal"
                  />
                  <label htmlFor={`day-${day.weekday}`} className="font-semibold text-white cursor-pointer">
                    {day.name}
                  </label>
                </div>

                {day.active ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={day.open.slice(0, 5)}
                      onChange={(e) => {
                        const updated = [...days]
                        updated[idx].open = e.target.value
                        setDays(updated)
                      }}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200"
                    />
                    <span className="text-slate-500">to</span>
                    <input
                      type="time"
                      value={day.close.slice(0, 5)}
                      onChange={(e) => {
                        const updated = [...days]
                        updated[idx].close = e.target.value
                        setDays(updated)
                      }}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200"
                    />
                  </div>
                ) : (
                  <span className="text-slate-500 italic">Operatories Closed</span>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <label className="block text-slate-400 mb-2 font-medium text-xs">
              Default Consultation Slot Length
            </label>
            <select
              value={slotDuration}
              onChange={(e) => setSlotDuration(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white"
            >
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes</option>
              <option value={60}>60 Minutes (Comprehensive)</option>
              <option value={90}>90 Minutes (Surgical suite)</option>
            </select>
          </div>
        </div>

        {/* Blocked Dates Editor */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
          <h3 className="font-serif text-xl font-medium text-white">Blocked Dates & Holidays</h3>
          <p className="text-xs text-slate-400">
            Dates added here prevent patients from reserving appointments on the public site.
          </p>

          <form onSubmit={handleAddBlockedDate} className="space-y-3 rounded-2xl bg-slate-950 p-4 border border-slate-800">
            <span className="text-xs font-semibold text-white block">Block a Specific Date</span>
            <input
              type="date"
              required
              value={newBlockedDate}
              onChange={(e) => setNewBlockedDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2 text-xs text-white"
            />
            <input
              type="text"
              placeholder="Reason (e.g. Renovation / Holiday)"
              value={newBlockedReason}
              onChange={(e) => setNewBlockedReason(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2 text-xs text-white"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-electric-teal py-2 text-xs font-semibold text-slate-950 hover:bg-white transition-colors"
            >
              + Add to Blocked List
            </button>
          </form>

          <div className="space-y-2 max-h-72 overflow-y-auto">
            {blockedDates.length === 0 ? (
              <div className="text-slate-500 text-xs italic py-4 text-center">
                No dates currently blocked.
              </div>
            ) : (
              blockedDates.map((b) => (
                <div
                  key={b.date}
                  className="flex items-center justify-between rounded-xl bg-slate-950 p-3 text-xs border border-slate-800"
                >
                  <div>
                    <span className="font-mono text-electric-teal font-semibold">{b.date}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{b.reason}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteBlockedDate(b.date)}
                    className="p-1 text-slate-400 hover:text-red-400"
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
