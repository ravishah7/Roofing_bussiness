import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Siren, CheckCircle2, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import Seo from '@/components/Seo'
import PageHero from '@/components/ui/PageHero'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { useSettings } from '@/hooks/useSettings'

export default function Contact() {
  const { settings } = useSettings()
  const { phone, emergencyPhone, email, address, openingHours } = settings.business
  const cleanPhone = phone.replace(/[^\d+]/g, '')
  const cleanEmergencyPhone = emergencyPhone.replace(/[^\d+]/g, '')
  const addressStr = [address.street, [address.city, address.state, address.zip].filter(Boolean).join(', ')].filter(Boolean).join(', ')
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [status, setStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')

  const onSubmit = async (data) => {
    setStatus('loading')
    setSubmitError('')
    try {
      await api.post('/contact', data)
      setStatus('success')
      reset()
    } catch (err) {
      setStatus('idle')
      setSubmitError(err.response?.data?.message || 'Something went wrong — please try again.')
    }
  }

  return (
    <>
      <Seo title="Contact Us" description="Request a free roofing inspection or get in touch with our team." path="/contact" />
      <PageHero eyebrow="Get In Touch" title="Let's talk about your roof." crumb="Contact" description="Request a free inspection, ask a question, or reach our emergency line — we respond fast." floatingShapes />

      <section className="bg-white py-20 dark:bg-ink-950 md:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-ink-100 p-8 dark:border-ink-800 md:p-10">
              {status === 'success' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center py-12 text-center">
                  <CheckCircle2 className="h-14 w-14 text-ember-500" />
                  <h3 className="mt-4 font-display text-2xl font-semibold text-ink-900 dark:text-white">Message sent</h3>
                  <p className="mt-2 max-w-sm text-ink-600 dark:text-ink-400">
                    Thanks for reaching out — a member of our team will contact you within one business day.
                  </p>
                  <Button variant="outline" className="mt-6" onClick={() => setStatus('idle')}>Send another message</Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-ink-700 dark:text-ink-300">Full Name</label>
                    <input {...register('name', { required: true })} className="mt-2 w-full rounded-xl border border-ink-200 bg-transparent px-4 py-3 text-sm focus:border-ember-500 focus:outline-none dark:border-ink-700" placeholder="Jane Doe" />
                    {errors.name && <p className="mt-1 text-xs text-red-500">Name is required</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-ink-700 dark:text-ink-300">Phone</label>
                    <input {...register('phone', { required: true })} className="mt-2 w-full rounded-xl border border-ink-200 bg-transparent px-4 py-3 text-sm focus:border-ember-500 focus:outline-none dark:border-ink-700" placeholder="(555) 123-4567" />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">Phone is required</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-ink-700 dark:text-ink-300">Email</label>
                    <input type="email" {...register('email', { required: true })} className="mt-2 w-full rounded-xl border border-ink-200 bg-transparent px-4 py-3 text-sm focus:border-ember-500 focus:outline-none dark:border-ink-700" placeholder="jane@email.com" />
                    {errors.email && <p className="mt-1 text-xs text-red-500">Email is required</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-ink-700 dark:text-ink-300">Service Needed</label>
                    <select
                      {...register('service')}
                      className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 focus:border-ember-500 focus:outline-none dark:border-ink-700 dark:bg-ink-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                    >
                      <option>Free Roof Inspection</option>
                      <option>Roof Repair</option>
                      <option>Roof Replacement</option>
                      <option>Emergency Service</option>
                      <option>Commercial Roofing</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-ink-700 dark:text-ink-300">Message</label>
                    <textarea {...register('message')} rows={4} className="mt-2 w-full rounded-xl border border-ink-200 bg-transparent px-4 py-3 text-sm focus:border-ember-500 focus:outline-none dark:border-ink-700" placeholder="Tell us about your project..." />
                  </div>
                  <Button type="submit" size="lg" className="sm:col-span-2 justify-center" disabled={status === 'loading'}>
                    {status === 'loading' ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-5">
              {[
                { icon: Phone, label: 'Call Us', value: phone, href: `tel:${cleanPhone}` },
                { icon: Mail, label: 'Email Us', value: email, href: `mailto:${email}` },
                { icon: MapPin, label: 'Visit Us', value: addressStr },
                { icon: Clock, label: 'Business Hours', value: 'Mon–Sat: 7am – 7pm · Emergency line 24/7' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 rounded-2xl border border-ink-100 p-5 dark:border-ink-800">
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-ember-500" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="mt-1 block font-medium text-ink-900 hover:text-ember-600 dark:text-white">{item.value}</a>
                    ) : (
                      <p className="mt-1 font-medium text-ink-900 dark:text-white">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-4 rounded-2xl border border-ember-200 bg-ember-50 p-5 dark:border-ember-900 dark:bg-ember-500/10">
                <Siren className="mt-0.5 h-5 w-5 shrink-0 text-ember-600" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ember-600 dark:text-ember-400">Emergency Line</p>
                  <a href={`tel:${cleanEmergencyPhone}`} className="mt-1 block font-semibold text-ink-900 dark:text-white">{emergencyPhone}</a>
                </div>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl">
              <iframe
                title="Office location map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2971.3!2d-87.6298!3d41.8781!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDUyJzQxLjIiTiA4N8KwMzcnNDcuMyJX!5e0!3m2!1sen!2sus!4v1600000000000"
                className="h-64 w-full border-0"
                loading="lazy"
              />
            </div>
          </div>

        </Container>
      </section>
    </>
  )
}
