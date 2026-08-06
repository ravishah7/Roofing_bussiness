import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'


export const DEFAULT_SETTINGS = {
  business: {
    name: 'Summit Roof Co.',
    tagline: '',
    phone: '(800) 555-1212',
    emergencyPhone: '(800) 555-9111',
    email: 'hello@summitroofco.com',
    address: { street: '4820 Roofline Avenue, Suite 200', city: 'Chicago', state: 'IL', zip: '60601', country: 'US' },
    openingHours: [],
    whatsappNumber: '18005551212',
    googleMapsUrl: '',
    calendlyUrl: '',
    licenseNumber: 'ROC-884213',
  },
  social: {},
  analytics: {},
  cookieBanner: {
    isEnabled: true,
    message: 'We use cookies to improve your browsing experience and analyze site traffic.',
    policyUrl: '/privacy-policy',
  },
  theme: { primaryColor: '#FF6B00', secondaryColor: '#1B1D22', accentColor: '#1E5AA8' },
  logo: null,
  favicon: null,
  seo: {},
}

export function useSettings() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => (await api.get('/settings')).data,
    staleTime: 5 * 60 * 1000, // business info rarely changes; avoid refetching on every page nav
  })

  const live = data?.data
  const settings = {
    ...DEFAULT_SETTINGS,
    ...live,
    business: { ...DEFAULT_SETTINGS.business, ...live?.business, address: { ...DEFAULT_SETTINGS.business.address, ...live?.business?.address } },
    social: { ...DEFAULT_SETTINGS.social, ...live?.social },
    cookieBanner: { ...DEFAULT_SETTINGS.cookieBanner, ...live?.cookieBanner },
    theme: { ...DEFAULT_SETTINGS.theme, ...live?.theme },
  }

  return { settings, isLoading, isError }
}
