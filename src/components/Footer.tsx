import { usePortfolio } from '../hooks/usePortfolio'
import { resolveUrl } from '../lib/api'

const FALLBACK_PLATFORMS: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  twitter: 'X',
  x: 'X',
  bluesky: 'Bluesky',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
}

export function Footer() {
  const { data } = usePortfolio()
  const settings = data?.settings
  const socials = data?.social_links ?? []

  return (
    <footer className="relative border-t border-border bg-background">
      <div aria-hidden="true" className="dot-grid h-4 w-full opacity-70" />
      <div className="dot-dense mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 px-4 pb-8 sm:flex-row sm:px-6">
        <p className="font-mono text-xs text-muted-foreground">
          <span className="text-primary">&gt;</span>{' '}
          {settings?.footer_text ??
            `${settings?.site_name ?? 'Portfolio'} — ${new Date().getFullYear()}. all rights reserved.`}
        </p>

        {socials.length > 0 ? (
          <div className="flex items-center gap-2">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                title={social.platform}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/70 text-muted-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-primary"
              >
                {social.icon ? (
                  <img src={resolveUrl(social.icon)} alt="" className="h-4 w-4" />
                ) : (
                  <span className="font-mono text-xs font-bold uppercase">
                    {(FALLBACK_PLATFORMS[social.platform.toLowerCase()] ?? social.platform).charAt(0)}
                  </span>
                )}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </footer>
  )
}