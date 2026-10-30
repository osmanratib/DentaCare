import Swal, { SweetAlertOptions } from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

/**
 * Luxury Editorial Styled SweetAlert2 instance for DentaCare
 * Matches the warm linen / obsidian navy / emerald aesthetic.
 */
export const luxurySwal = Swal.mixin({
  customClass: {
    popup: 'dentacare-swal-popup',
    title: 'dentacare-swal-title',
    htmlContainer: 'dentacare-swal-html',
    confirmButton: 'dentacare-swal-confirm',
    cancelButton: 'dentacare-swal-cancel',
    denyButton: 'dentacare-swal-deny',
  },
  buttonsStyling: false,
})

/**
 * Toast notifications with auto-dismiss
 */
export const luxuryToast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  customClass: {
    popup: 'dentacare-toast-popup',
    title: 'dentacare-toast-title',
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer
    toast.onmouseleave = Swal.resumeTimer
  },
})

export const toastSuccess = (title: string, text?: string) => {
  return luxuryToast.fire({
    icon: 'success',
    title,
    text,
    iconColor: '#12B5A6',
  })
}

export const toastError = (title: string, text?: string) => {
  return luxuryToast.fire({
    icon: 'error',
    title,
    text,
    iconColor: '#E11D48',
  })
}

export const toastInfo = (title: string, text?: string) => {
  return luxuryToast.fire({
    icon: 'info',
    title,
    text,
    iconColor: '#0E1A24',
  })
}

/**
 * High-touch confirm dialog for deletions or sensitive mutations
 */
export const confirmDelete = async (
  itemName: string,
  extraDetails?: string
): Promise<boolean> => {
  const result = await luxurySwal.fire({
    title: `Remove ${itemName}?`,
    text:
      extraDetails ||
      'This entry will be permanently removed from the Supabase database and public website.',
    icon: 'warning',
    iconColor: '#C29864',
    showCancelButton: true,
    confirmButtonText: 'Yes, Delete Permanently',
    cancelButtonText: 'Cancel & Retain',
    reverseButtons: true,
    focusCancel: true,
  })

  return result.isConfirmed
}

/**
 * General confirm dialog
 */
export const confirmAction = async (options: {
  title: string
  text?: string
  confirmButtonText?: string
  cancelButtonText?: string
  icon?: 'warning' | 'question' | 'info' | 'success'
}): Promise<boolean> => {
  const result = await luxurySwal.fire({
    title: options.title,
    text: options.text,
    icon: options.icon || 'question',
    iconColor: '#12B5A6',
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText || 'Confirm',
    cancelButtonText: options.cancelButtonText || 'Cancel',
    reverseButtons: true,
  })

  return result.isConfirmed
}

export const alertSuccess = (title: string, text?: string) => {
  return luxurySwal.fire({
    title,
    text,
    icon: 'success',
    iconColor: '#12B5A6',
    confirmButtonText: 'Acknowledge',
  })
}

export const alertError = (title: string, text?: string) => {
  return luxurySwal.fire({
    title,
    text,
    icon: 'error',
    iconColor: '#E11D48',
    confirmButtonText: 'Dismiss',
  })
}

export default luxurySwal
