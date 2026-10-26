'use client'

import React, { useState } from 'react'
import {
  ShieldCheck,
  UserCheck,
  Key,
  Database,
  Lock,
  Mail,
  CheckCircle2,
  AlertTriangle,
  History,
  Sparkles,
} from 'lucide-react'

export default function SettingsAdminPage() {
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('staff')
  const [inviteSent, setInviteSent] = useState(false)

  const auditEvents = [
    {
      id: 1,
      admin: 'Dr. Osman Ratib',
      email: 'osmanratib14@gmail.com',
      action: 'UPDATE_AVAILABILITY_RULES',
      entity: 'availability_rules',
      timestamp: '2026-10-26 19:42:10 UTC',
      status: 'VERIFIED_AAL2',
    },
    {
      id: 2,
      admin: 'Dr. Osman Ratib',
      email: 'osmanratib14@gmail.com',
      action: 'CONFIRM_APPOINTMENT',
      entity: 'appointments (apt-101)',
      timestamp: '2026-10-26 18:22:30 UTC',
      status: 'VERIFIED_AAL2',
    },
    {
      id: 3,
      admin: 'System Security Hook',
      email: 'system@auth',
      action: 'ENFORCE_TOTP_MFA_CHALLENGE',
      entity: 'auth.mfa_factors',
      timestamp: '2026-10-26 14:05:00 UTC',
      status: 'ENFORCED',
    },
  ]

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail) return
    setInviteSent(true)
    setTimeout(() => {
      setInviteEmail('')
      setInviteSent(false)
    }, 3000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#E5E0D5] pb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#12B5A6]">
          Clinic Governance & Access Control
        </span>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-medium text-[#0E1A24]">
          Settings & Security Audit
        </h1>
        <p className="mt-1 text-xs text-[#0E1A24]/60">
          Supervised by Owner Administrator: <strong className="text-[#0E1A24]">osmanratib14@gmail.com</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Admin Roles & Security */}
        <div className="lg:col-span-6 space-y-8">
          {/* Owner Box */}
          <div className="rounded-4xl border border-[#DAC7AD] bg-white p-6 sm:p-8 space-y-4 shadow-[0_2px_16px_rgba(14,26,36,0.02)]">
            <div className="flex items-center gap-2 text-emerald-700">
              <ShieldCheck className="h-5 w-5 text-[#12B5A6]" />
              <h3 className="font-serif text-xl font-bold text-[#0E1A24]">Designated Owner Account</h3>
            </div>
            <p className="text-xs text-[#0E1A24]/70 leading-relaxed font-light">
              Master account holding Row Level Security bypass authority and staff management rights.
            </p>

            <div className="rounded-3xl bg-[#FAF8F5] p-5 border border-[#E5E0D5] space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#0E1A24]/60">Owner Email:</span>
                <span className="font-mono font-bold text-[#0E1A24]">osmanratib14@gmail.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0E1A24]/60">Access Role:</span>
                <span className="text-emerald-700 font-semibold">Master (role = &apos;owner&apos;)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0E1A24]/60">MFA Policy:</span>
                <span className="text-emerald-700 font-semibold">AAL2 Enforced</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0E1A24]/60">Public Sign-Ups:</span>
                <span className="text-rose-700 font-semibold">Disabled (Locked)</span>
              </div>
            </div>
          </div>

          {/* Invite Staff Form */}
          <div className="rounded-4xl border border-[#E5E0D5] bg-white p-6 sm:p-8 space-y-4 shadow-[0_2px_16px_rgba(14,26,36,0.02)]">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-[#12B5A6]" />
              <h3 className="font-serif text-xl font-bold text-[#0E1A24]">Invite Clinical Staff Member</h3>
            </div>
            <p className="text-xs text-[#0E1A24]/70 font-light">
              Staff accounts can manage appointments and patient notes without access to sensitive settings or audit ledgers.
            </p>

            <form onSubmit={handleSendInvite} className="space-y-4 pt-2">
              <div>
                <label className="block text-[#0E1A24]/70 mb-1 font-semibold text-[11px] uppercase tracking-wider">
                  Staff Email Address
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="doctor.name@dentacare.com"
                  className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-xs text-[#0E1A24] focus:border-[#12B5A6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#0E1A24]/70 mb-1 font-semibold text-[11px] uppercase tracking-wider">
                  Assigned Privilege
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-xs text-[#0E1A24]"
                >
                  <option value="staff">Staff (Appointments, Patients & Gallery)</option>
                  <option value="owner">Co-Owner (Full Infrastructure Access)</option>
                </select>
              </div>

              {inviteSent && (
                <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-3.5 text-xs text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>Invitation dispatched with service role authorization.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-[#0E1A24] py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#12B5A6] transition-colors shadow-sm"
              >
                Send Authorized Invitation
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Immutable Audit Trail */}
        <div className="lg:col-span-6 rounded-4xl border border-[#E5E0D5] bg-white p-6 sm:p-8 space-y-6 shadow-[0_2px_16px_rgba(14,26,36,0.02)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-[#12B5A6]" />
              <h3 className="font-serif text-xl font-bold text-[#0E1A24]">Cryptographic Audit Log</h3>
            </div>
            <span className="text-[10px] uppercase font-bold text-[#12B5A6] tracking-wider bg-[#CFE8E4] px-2.5 py-0.5 rounded-full">
              Owner Only
            </span>
          </div>
          <p className="text-xs text-[#0E1A24]/60 font-light">
            Immutable database records tracking all staff actions, updates, and clinical schedule modifications.
          </p>

          <div className="space-y-3">
            {auditEvents.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] p-4 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[#0E1A24] font-bold text-[11px]">
                    {log.action}
                  </span>
                  <span className="rounded-full bg-emerald-100 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                    {log.status}
                  </span>
                </div>
                <div className="text-[#0E1A24]/75 text-xs font-light">
                  Target: <span className="font-mono text-[#0E1A24]">{log.entity}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#0E1A24]/50 pt-1.5 border-t border-[#E8E2D6]">
                  <span>Actor: {log.admin}</span>
                  <span className="font-mono">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
