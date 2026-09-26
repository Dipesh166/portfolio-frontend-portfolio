import { motion } from 'framer-motion'
import { LoaderCircle, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Section } from '../components/Section'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { usePortfolio } from '../hooks/usePortfolio'
import { submitContact } from '../lib/api'
import { containerStagger, itemFadeUp, viewportOnce } from '../lib/motion'

const EMPTY_FORM = { name: '', email: '', subject: '', message: '' }

export function Contact() {
  const { data } = usePortfolio()
  const profile = data?.profile
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  const set = (field: keyof typeof EMPTY_FORM) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const result = await submitContact(form)
      toast.success(`Thanks, ${result.name}! Your message has been sent.`)
      setForm(EMPTY_FORM)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Section id="contact" index="08" title="Contact" subtitle="// have a project in mind? or just want to say hi?">
      <motion.div
        variants={containerStagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-2"
      >
        <motion.div variants={itemFadeUp} className="flex flex-col gap-6">
          <div>
            <h3 className="font-mono text-lg font-bold text-foreground">
              <span className="text-primary">&gt;</span> let&apos;s_talk()
            </h3>
            <p className="mt-2 font-mono text-sm text-muted-foreground">
              i&apos;m always open to discussing new projects, creative ideas, or
              opportunities to be part of your vision.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
            <ul className="flex flex-col gap-4 font-mono text-sm">
              {profile?.email ? (
                <li>
                  <span className="mb-0.5 block text-[10px] tracking-widest text-muted-foreground uppercase">
                    email
                  </span>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-foreground/85 transition-colors hover:text-primary"
                  >
                    {profile.email}
                  </a>
                </li>
              ) : null}
              {profile?.phone ? (
                <li>
                  <span className="mb-0.5 block text-[10px] tracking-widest text-muted-foreground uppercase">
                    phone
                  </span>
                  <span className="text-foreground/85">{profile.phone}</span>
                </li>
              ) : null}
              {profile?.location ? (
                <li>
                  <span className="mb-0.5 block text-[10px] tracking-widest text-muted-foreground uppercase">
                    location
                  </span>
                  <span className="text-foreground/85">{profile.location}</span>
                </li>
              ) : null}
            </ul>
          </div>

          <a
            href="#top"
            className="inline-flex w-fit items-center gap-2 font-mono text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            back_to_top
          </a>
        </motion.div>

        <motion.form
          variants={itemFadeUp}
          onSubmit={onSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-name" className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                name
              </Label>
              <Input
                id="contact-name"
                name="name"
                required
                minLength={1}
                maxLength={100}
                placeholder="your_name"
                value={form.name}
                onChange={(e) => set('name')(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-email" className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                email
              </Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => set('email')(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-subject" className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              subject
            </Label>
            <Input
              id="contact-subject"
              name="subject"
              maxLength={200}
              placeholder="what_is_this_about?"
              value={form.subject}
              onChange={(e) => set('subject')(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-message" className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              message
            </Label>
            <Textarea
              id="contact-message"
              name="message"
              required
              minLength={10}
              maxLength={5000}
              rows={5}
              placeholder="tell_me_about_your_project..."
              value={form.message}
              onChange={(e) => set('message')(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <Button type="submit" disabled={submitting} className="gap-2 self-start rounded-xl font-mono">
            <span className="text-primary-foreground/80">&gt;</span>
            {submitting ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : (
              <Send aria-hidden="true" />
            )}
            {submitting ? 'sending...' : 'send_message'}
          </Button>
        </motion.form>
      </motion.div>
    </Section>
  )
}