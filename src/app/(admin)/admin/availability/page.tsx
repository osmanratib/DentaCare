'use client'

import React, { useState } from 'react'
import { Clock, Calendar, Plus, Trash2, CheckCircle2 } from 'lucide-react'

export default function AvailabilityAdminPage() {
  const [slotDuration, setSlotDuration] = useState(30)
  const [bufferMin, setBufferMin] = useState(15)
  const [saved, setSaved] = useState(false)

  const [days, setDays] = useState([
    { name: 'Monday', open: '08:30', close: '18:00', active: true },
    { name: 'Tuesday', open: '08:30', close: '18:00', active: true },
    { name: 'Wednesday', open: '08:30', close: '18:00', active: true },
    { name: 'Thursday', open: '08:30', close: '18:00', active: true },
    { name: 'Friday', open: '08:30', close: '16:30', active: true },
    { name: 'Saturday', open: '09:00', close: '14:00', active: true },
    { name: 'Sunday', open: '10:00', close: '14:00', active: false },
  ])

  const [blockedDates, setBlockedDates] = useState([
    { date: '2026-11-26', reason: 'Thanksgiving Holiday Clinic Closure' },
    { date: '2026-12-25', reason: 'Winter Solstice & Christmas Day' },
  ])

  const [newBlockedDate, setNewBlockedDate] = useState('')
  const [newBlockedReason, setNewBlockedReason] = useState('')

  const handleAddBlockedDate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBlockedDate) return
    setBlockedDates([...blockedDates, { date: newBlockedDate, reason: newBlockedReason || 'Staff Training' }])
    setNewBlockedDate('')
    setNewBlockedReason('')
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-electric-teal">
            Scheduling Engine
          </span>
          <h1 className="mt-1 font-serif text-3xl font-medium text-white">
            Clinic Hours & Availability Rules
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Define daily operatory hours, appointment slot lengths, and holiday blockouts.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-electric-teal px-5 py-2 text-xs font-semibold text-slate-950 hover:bg-white transition-colors"
        >
          {saved ? <CheckCircle2 className="h-4 w-4 text-emerald-950" /> : null}
          <span>{saved ? 'Rules Applied' : 'Save Schedule Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Hours */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-950/60 p-6 sm:p-8 space-y-6">
          <h3 className="font-serif text-xl font-medium text-white">Weekly Operating Windows</h3>

          <div className="space-y-3">
            {days.map((day, idx) => (
              <div
                key={day.name}
                className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={day.active}
                    onChange={(e) => {
                      const updated = [...days]
                      updated[idx].active = e.target.checked
                      setDays(updated)
                    }}
                    className="h-4 w-4 rounded accent-electric-teal"
                  />
                  <span className={`font-semibold ${day.active ? 'text-white' : 'text-slate-500'}`}>
                    {day.name}
                  </span>
                </div>

                {day.active ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={day.open}
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
                      value={day.close}
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
        </div>

        {/* Slot Config & Blocked Dates */}
        <div className="lg:col-span-5 space-y-8">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 sm:p-8 space-y-4">
            <h3 className="font-serif text-xl font-medium text-white">Slot Calculation Rules</h3>

            <div>
              <label className="block text-xs text-slate-400 mb-2">Base Consultation Slot Length</label>
              <select
                value={slotDuration}
                onChange={(e) => setSlotDuration(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-slate-200"
              >
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes</option>
                <option value={90}>90 Minutes (Comprehensive)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-2">Private Sanitization Buffer Between Visits</label>
              <select
                value={bufferMin}
                onChange={(e) => setBufferMin(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-slate-200"
              >
                <option value={15}>15 Minutes</option>
                <option value={20}>20 Minutes</option>
                <option value={30}>30 Minutes (Surgical protocol)</option>
              </select>
            </div>
          </div>

          {/* Blocked Dates */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 sm:p-8 space-y-4">
            <h3 className="font-serif text-xl font-medium text-white">Blocked Dates & Holidays</h3>

            <div className="space-y-2">
              {blockedDates.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl bg-slate-900 p-3 text-xs border border-slate-800"
                >
                  <div>
                    <span className="font-mono text-electric-teal">{b.date}</span>
                    <p className="text-[11px] text-slate-400">{b.reason}</p>
                  </div>
                  <button
                    onClick={() => setBlockedDates(blockedDates.filter((_, idx) => idx !== i))}
                    className="text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddBlockedDate} className="space-y-2 pt-2">
              <input
                type="date"
                required
                value={newBlockedDate}
                onChange={(e) => setNewBlockedDate(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2 text-xs text-slate-200"
              />
              <input
                type="text"
                placeholder="Reason (e.g. Conference)"
                value={newBlockedReason}
                onChange={(e) => setNewBlockedReason(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2 text-xs text-slate-200"
              />
              <button
                type="submit"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                + Add Blocked Date
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
