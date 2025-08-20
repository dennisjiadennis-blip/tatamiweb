import { redirect } from 'next/navigation'

export default function RootPage() {
  // Redirect to the localized homepage - middleware will handle geo-location detection
  redirect('/en')
}