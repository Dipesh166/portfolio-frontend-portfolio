import { motion } from 'framer-motion'
import { ArrowUpRight, FolderGit2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Section } from '../components/Section'
import { SmartImage } from '../components/SmartImage'
import { Button } from '../components/ui/button'
import { usePortfolio } from '../hooks/usePortfolio'
import { resolveUrl } from '../lib/api'
import { containerStagger, itemFadeUp, viewportOnce } from '../lib/motion'

export function Projects() {
  const { data } = usePortfolio()
  const projects = data?.projects ?? []

  if (projects.length === 0) return null

  const featured = [...projects].sort(
    (a, b) =>
      Number(b.featured) - Number(a.featured) || a.display_order - b.display_order,
  )

  return (
    <Section id="projects" index="03" title="Projects" subtitle="// a selection of things i've built">
      <motion.div
        variants={containerStagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {featured.map((project, position) => (
          <motion.div key={project.id} variants={itemFadeUp} className="flex">
            <Link to={`/projects/${project.slug}`} className="group flex h-full w-full flex-col">
              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 group-hover:border-primary/50">
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  {project.thumbnail?.url ? (
                    <SmartImage
                      src={resolveUrl(project.thumbnail.url)}
                      alt={project.thumbnail.alt || project.title}
                      containerClassName="h-full w-full"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center font-mono text-6xl font-black text-foreground/15">
                      {project.title.charAt(0)}
                    </div>
                  )}
                  <div className="dot-dense absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-30" aria-hidden="true" />

                  {project.featured ? (
                    <span className="absolute top-3 left-3 rounded-md bg-background/85 px-2 py-1 font-mono text-[9px] font-bold tracking-widest text-primary uppercase backdrop-blur">
                      // featured
                    </span>
                  ) : null}

                  <span className="absolute right-3 bottom-3 font-mono text-xs font-black text-foreground/50">
                    {String(position + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-mono text-base leading-snug font-bold text-foreground">
                      {project.title}
                    </h3>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </div>

                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    {project.short_description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-accent/60 px-2 py-0.5 font-mono text-[10px] font-semibold text-foreground/70"
                      >
                        {'{'} {tech} {'}'}
                      </span>
                    ))}
                    {project.technologies.length > 3 ? (
                      <span className="px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
                        +{project.technologies.length - 3}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {project.live_url ? (
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 rounded-lg font-mono"
                      >
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ArrowUpRight aria-hidden="true" />
                          live
                        </a>
                      </Button>
                    ) : null}
                    {project.github_url ? (
                      <Button asChild size="sm" variant="ghost" className="h-7 gap-1 rounded-lg font-mono">
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FolderGit2 aria-hidden="true" />
                          code
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}