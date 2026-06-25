import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import ErrorMessage from '../components/ErrorMessage'

const PROFILE_STORAGE_KEY = 'recipes-only-profile'

function readProfileFromStorage() {
  try {
    const savedValue = localStorage.getItem(PROFILE_STORAGE_KEY)

    if (!savedValue) {
      return {
        name: '',
        email: '',
        image: '',
        createdAt: '',
        updatedAt: '',
      }
    }

    const parsedValue = JSON.parse(savedValue)

    return {
      name: parsedValue.name || '',
      email: parsedValue.email || '',
      image: parsedValue.image || '',
      createdAt: parsedValue.createdAt || '',
      updatedAt: parsedValue.updatedAt || '',
    }
  } catch {
    return {
      name: '',
      email: '',
      image: '',
      createdAt: '',
      updatedAt: '',
    }
  }
}

function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(() => readProfileFromStorage())
  const [errors, setErrors] = useState({})
  const [statusMessage, setStatusMessage] = useState('')
  const [readError, setReadError] = useState('')

  const hasSavedProfile = Boolean(profile.createdAt)
  const avatarLabel = useMemo(() => {
    if (profile.name.trim()) {
      return profile.name.trim().charAt(0).toUpperCase()
    }

    return '🍓'
  }, [profile.name])

  const updateField = (field) => (event) => {
    const { value } = event.target
    setProfile((currentProfile) => ({ ...currentProfile, [field]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [field]: '' }))
    setStatusMessage('')
    setReadError('')
  }

  const validateProfile = () => {
    const nextErrors = {}

    if (!profile.name.trim()) {
      nextErrors.name = 'Name is required.'
    }

    if (!profile.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    return nextErrors
  }

  const persistProfile = (mode) => {
    const nextErrors = validateProfile()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setStatusMessage('')
      return
    }

    const timestamp = new Date().toISOString()
    const nextProfile = {
      ...profile,
      name: profile.name.trim(),
      email: profile.email.trim(),
      createdAt: profile.createdAt || timestamp,
      updatedAt: timestamp,
    }

    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile))
      setProfile(nextProfile)
      setStatusMessage(mode === 'save' ? 'Profile saved on this device.' : 'Profile updated on this device.')
      setErrors({})
      setReadError('')
    } catch {
      setReadError('We could not save your profile right now.')
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setReadError('Please upload an image file for your profile photo.')
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setProfile((currentProfile) => ({
        ...currentProfile,
        image: typeof reader.result === 'string' ? reader.result : '',
      }))
      setReadError('')
      setStatusMessage('')
    }

    reader.onerror = () => {
      setReadError('We could not read that image. Please try another one.')
    }

    reader.readAsDataURL(file)
  }

  return (
    <main className="app-screen">
      <section className="phone-shell overflow-hidden bg-[linear-gradient(180deg,#e8f8ff_0%,#fff5fb_44%,#fffceb_100%)]">
        <div className="relative px-5 pb-28 pt-5">
          <div className="pointer-events-none absolute inset-0 opacity-80">
            <div className="absolute left-4 top-8 text-2xl">☁️</div>
            <div className="absolute right-5 top-8 text-2xl">✨</div>
            <div className="absolute left-4 top-36 text-2xl">🍓</div>
            <div className="absolute right-6 top-48 text-2xl">🧁</div>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <button type="button" className="icon-bubble" onClick={() => navigate('/home')}>
              ←
            </button>
            <h1 className="text-lg font-black text-slate-800">My Profile</h1>
            <div className="icon-bubble text-xl">👤</div>
          </div>

          <section className="relative z-10 mt-5 soft-card p-5">
            <div className="flex flex-col items-center text-center">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt={profile.name || 'Profile'}
                  className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-[0_18px_35px_rgba(148,163,184,0.22)]"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-[linear-gradient(135deg,#f9a8d4,#93c5fd,#fde68a)] text-4xl font-black text-white shadow-[0_18px_35px_rgba(148,163,184,0.22)]">
                  {avatarLabel}
                </div>
              )}

              <label className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-full bg-pink-100 px-4 py-2 text-sm font-extrabold text-pink-600">
                Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              <p className="mt-2 text-xs text-slate-400">Your photo is stored only on this device.</p>
            </div>

            <div className="mt-5 space-y-4">
              {readError ? <ErrorMessage message={readError} /> : null}
              {statusMessage ? (
                <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-600">
                  {statusMessage}
                </div>
              ) : null}

              <label className="form-group">
                <span className="form-label">Name *</span>
                <input
                  type="text"
                  value={profile.name}
                  onChange={updateField('name')}
                  placeholder="Enter your name"
                  className="input-field"
                />
                {errors.name ? <span className="form-error">{errors.name}</span> : null}
              </label>

              <label className="form-group">
                <span className="form-label">Email *</span>
                <input
                  type="email"
                  value={profile.email}
                  onChange={updateField('email')}
                  placeholder="Enter your email"
                  className="input-field"
                />
                {errors.email ? <span className="form-error">{errors.email}</span> : null}
              </label>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button type="button" className="secondary-button" onClick={() => persistProfile('save')}>
                  Save Profile
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => persistProfile('update')}
                  disabled={!hasSavedProfile}
                >
                  Update Profile
                </button>
              </div>

              <div className="rounded-[22px] bg-sky-50 px-4 py-3 text-xs font-semibold text-slate-500">
                {hasSavedProfile
                  ? `Last updated: ${new Date(profile.updatedAt).toLocaleString()}`
                  : 'Save your profile once, then you can update it any time.'}
              </div>
            </div>
          </section>
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <BottomNav />
        </div>
      </section>
    </main>
  )
}

export default Profile
