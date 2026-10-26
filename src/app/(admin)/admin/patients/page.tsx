'use client'

import React, { useState } from 'react'
import { Search, UserCheck, Phone, Mail, FileText, Plus } from 'lucide-react'

export default function PatientsAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const patients = [
    {
      id: 'pat-001',
      name: 'Victoria Sterling',
      phone: '+1 (555) 234-8901',
      email: 'victoria@sterlingholdings.com',
      lastVisit: '2026-10-14',
      totalVisits: 4,
      notes: 'Prefers non-fluoride polishing paste. Upper veneers consultation mapped.',
    },
    {
      id: 'pat-002',
      name: 'Marcus Vance',
      phone: '+1 (555) 890-4321',
      email: 'marcus.vance@techcorp.io',
      lastVisit: '2026-09-18',
      totalVisits: 2,
      notes: 'Molar implant placement scheduled. CBCT scan completed with optimal bone density.',
    },
    {
      id: 'pat-003',
      name: 'Sophia Lin',
      phone: '+1 (555) 765-1234',
      email: 'sophia.lin@designstudio.ny',
      lastVisit: '2026-10-02',
      totalVisits: 6,
      notes: 'Invisalign tray #14 of 22 delivered. Excellent rotational tracking.',
    },
    {
      id: 'pat-004',
      name: 'Elena Rostova',
      phone: '+1 (555) 678-2345',
      email: 'elena.r@architects.eu',
      lastVisit: '2026-10-24',
      totalVisits: 3,
      notes: 'Periodontal pocket depth reduced to &lt;2.5mm throughout arch.',
    },
  ]

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-electric-teal">
            Patient Registry
          </span>
          <h1 className="mt-1 font-serif text-3xl font-medium text-white">
            Patients & Clinical Records
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Confidential directory adhering to minimal clinical retention standards.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by patient name, phone, or email..."
          className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-500 focus:border-electric-teal focus:outline-none"
        />
      </div>

      {/* Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((patient) => (
          <div
            key={patient.id}
            className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-xl font-medium text-white">{patient.name}</h3>
                <span className="font-mono text-[10px] text-electric-teal">{patient.id}</span>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] font-semibold text-slate-300">
                {patient.totalVisits} Completed Visits
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-electric-teal" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-electric-teal" />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Last Exam: {patient.lastVisit}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 text-xs text-slate-400">
              <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider mb-1">
                Clinical Care Notes
              </div>
              <p className="leading-relaxed text-slate-300">{patient.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
