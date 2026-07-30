export type User = {
  id: number
  email: string
  username: string
  phone?: string | null
  birthDate?: string | null
}

export type UpdateProfileDTO = {
  email?: string
  username?: string
  phone?: string
  birthDate?: string
}

export type ChangePasswordDTO = {
  currentPassword: string
  newPassword: string
}

