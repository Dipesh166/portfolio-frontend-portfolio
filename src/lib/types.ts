export type MediaObject = {
  file_id: string
  url: string
  alt: string
  filename: string
  content_type: string
  size: number
}

export type Profile = {
  id: string
  name: string
  headline: string
  short_bio: string
  about: string
  profile_image: MediaObject | null
  resume: MediaObject | null
  location: string
  email: string
  phone: string
  resume_url: string
  availability: boolean
}

export type Experience = {
  id: string
  company: string
  position: string
  employment_type: string
  location: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string
  technologies: string[]
  company_url: string
  logo: Record<string, unknown> | null
  display_order: number
}

export type Education = {
  id: string
  institution: string
  degree: string
  field: string
  start_date: string
  end_date: string | null
  description: string
  grade: string
  location: string
  logo: Record<string, unknown> | null
  display_order: number
}

export type Project = {
  id: string
  title: string
  slug: string
  short_description: string
  description: string
  thumbnail: MediaObject | null
  images: MediaObject[]
  technologies: string[]
  github_url: string
  live_url: string
  featured: boolean
  status: string
  display_order: number
}

export type Skill = {
  id: string
  name: string
  category: string
  level: string
  icon: string
  image: MediaObject | null
  display_order: number
}

export type Certification = {
  id: string
  title: string
  issuer: string
  issue_date: string
  credential_id: string
  credential_url: string
  certificate_image: MediaObject | null
  display_order: number
}

export type Achievement = {
  id: string
  title: string
  description: string
  date: string
  url: string
  icon: string
  display_order: number
}

export type SocialLink = {
  id: string
  platform: string
  url: string
  icon: string
  display_order: number
  enabled: boolean
}

export type MusicTrack = {
  id: string
  title: string
  artist: string
  audio: MediaObject | null
  cover_image: MediaObject | null
  display_order: number
  enabled: boolean
}

export type SiteSettings = {
  id: string
  site_name: string
  site_tagline: string
  footer_text: string
  maintenance_mode: boolean
  seo: Record<string, unknown>
}

export type Portfolio = {
  profile: Profile | null
  experiences: Experience[]
  education: Education[]
  projects: Project[]
  skills: Skill[]
  certifications: Certification[]
  achievements: Achievement[]
  social_links: SocialLink[]
  music: MusicTrack[]
  settings: SiteSettings | null
}

export type ContactPayload = {
  name: string
  email: string
  subject: string
  message: string
}

export type ContactResponse = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}