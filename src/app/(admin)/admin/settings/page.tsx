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
      timestamp: '2026-10-26 18:42:10 UTC',
      status: 'VERIFIED_AAL2',
    },
    {
      id: 2,
      admin: 'Dr. Osman Ratib',
      email: 'osmanratib14@gmail.com',
      action: 'CONFIRM_APPOINTMENT',
      entity: 'appointments (apt-101)',
      timestamp: '2026-10-25 14:22:30 UTC',
      status: 'VERIFIED_AAL2',
    },
    {
      id: 3,
      admin: 'System Security Hook',
      email: 'system@auth',
      action: 'ENFORCE_TOTP_MFA_CHALLENGE',
      entity: 'auth.mfa_factors',
      timestamp: '2026-10-25 10:05:00 UTC',
      status: 'ENFORCED',
    },
    {
      id: 4,
      admin: 'Dr. Osman Ratib',
      email: 'osmanratib14@gmail.com',
      action: 'PUBLISH_SMILE_CASE',
      entity: 'gallery_cases (case-01)',
      timestamp: '2026-10-24 16:11:45 UTC',
      status: 'VERIFIED_AAL2',
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
      <div className="border-b border-slate-800 pb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-electric-teal">
          Governance & Security
        </span>
        <h1 className="mt-1 font-serif text-3xl font-medium text-white">
          Clinic Settings & Access Control
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Supervised by Owner Administrator: <strong className="text-slate-200">osmanratib14@gmail.com</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Admin Roles & Security */}
        <div className="lg:col-span-6 space-y-8">
          {/* Owner Box */}
          <div className="rounded-3xl border border-emerald-800/40 bg-emerald-950/20 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
              <h3 className="font-serif text-xl font-medium text-white">Designated Owner Account</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In compliance with Section 14 of the Architecture Blueprint, this account holds master RLS execution bypass and staff promotion rights.
            </p>

            <div className="rounded-2xl bg-slate-900/90 p-4 border border-emerald-900/50 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Owner Email:</span>
                <span className="font-mono font-bold text-white">osmanratib14@gmail.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Access Level:</span>
                <span className="text-emerald-400 font-semibold">Master (role = &apos;owner&apos;)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">MFA Policy:</span>
                <span className="text-emerald-400 font-semibold">AAL2 Enforced (Hardware/TOTP)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Public Sign-Ups:</span>
                <span className="text-red-400 font-semibold">Disabled (Locked)</span>
              </div>
            </div>
          </div>

          {/* Invite Staff Server Action Form */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <UserCheck className="h-5 w-5 text-electric-teal" />
              <h3 className="font-serif text-xl font-medium">Invite Associate Doctor / Staff</h3>
            </div>
            <p className="text-xs text-slate-400">
              Dispatches an encrypted invite link. Staff accounts can manage daily appointment logs without settings or audit log write authority.
            </p>

            <form onSubmit={handleSendInvite} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Staff Member Email</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="doctor.name@dentacare.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white focus:border-electric-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white"
                >
                  <option value="staff">Staff (Appointments, Patients & Gallery)</option>
                  <option value="owner">Co-Owner (Full Infrastructure Control)</option>
                </select>
              </div>

              {inviteSent && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-950/60 p-3 text-xs text-emerald-300 border border-emerald-800">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Invitation dispatched with service role authorization.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-electric-teal py-2.5 text-xs font-semibold text-slate-950 hover:bg-white transition-colors"
              >
                Send Authorized Invitation
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Immutable Audit Trail */}
        <div className="lg:col-span-6 rounded-3xl border border-slate-800 bg-slate-950/60 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-electric-teal" />
              <h3 className="font-serif text-xl font-medium text-white">Immutable Audit Log</h3>
            </div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Owner Only</span>
          </div>
          <p className="text-xs text-slate-400">
            Cryptographic ledger tracking all staff writes, status toggles, and security state modifications.
          </p>

          <div className="space-y-3">
            {auditEvents.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-electric-teal text-[11px] font-semibold">
                    {log.action}
                  </span>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-semibold text-emerald-400">
                    {log.status}
                  </span>
                </div>
                <div className="text-slate-300 text-xs">
                  Target: <span className="font-mono text-slate-400">{log.entity}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                  <span>Actor: {log.admin} ({log.email})</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
