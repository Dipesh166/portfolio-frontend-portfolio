import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, FolderGit2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Skeleton } from '../components/ui/skeleton'
import { getProject, resolveUrl } from '../lib/api'
import { containerStagger, fadeIn, itemFadeUp, viewportOnce } from '../lib/motion'
import type { Project } from '../lib/types'

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()

  if (!slug) {
    return (
      <NotFoundState error="Project not found" />
    )
  }

  return <ProjectDetailContent key={slug} slug={slug} />
}

function NotFoundState({ error }: { error: string }) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-4 py-24 text-center"
    >
      <h2 className="text-xl font-bold text-foreground">Project not found</h2>
      <p className="text-sm text-muted-foreground">{error ?? 'This project does not exist.'}</p>
      <Button asChild variant="outline">
        <Link to="/">Back to home</Link>
      </Button>
    </motion.div>
  )
}

function ProjectDetailContent({ slug }: { slug: string }) {
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    getProject(slug)
      .then((data) => {
        if (active) setProject(data)
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Failed to load project')
      })

    return () => {
      active = false
    }
  }, [slug])

  if (!project && !error) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
        <Skeleton className="mb-8 h-5 w-24" />
        <Skeleton className="mb-4 h-10 w-2/3" />
        <Skeleton className="aspect-video w-full rounded-xl" />
      </div>
    )
  }

  if (error || !project) {
    return <NotFoundState error={error ?? 'This project does not exist.'} />
  }

  const gallery = project.images.length > 0 ? project.images : project.thumbnail ? [project.thumbnail] : []

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <motion.div variants={fadeIn} initial="hidden" animate="visible" className="mb-8">
        <Button asChild variant="ghost" className="-ml-3 mb-6 h-7 gap-1.5 font-mono text-xs">
          <Link to="/">
            <ArrowLeft aria-hidden="true" />
            &lt;- back to home
          </Link>
        </Button>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {project.featured ? (
            <Badge className="bg-primary font-mono text-primary-foreground">// featured</Badge>
          ) : null}
          <Badge variant="outline" className="font-mono">
            {project.status}
          </Badge>
        </div>
        <h1 className="font-mono text-3xl font-black tracking-tight text-foreground uppercase sm:text-5xl">
          {project.title}
        </h1>
        {project.short_description ? (
          <p className="mt-3 max-w-2xl font-mono text-lg text-muted-foreground">
            {project.short_description}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          {project.live_url ? (
            <Button asChild className="gap-2">
              <a href={project.live_url} target="_blank" rel="noreferrer">
                <ExternalLink aria-hidden="true" />
                View live
              </a>
            </Button>
          ) : null}
          {project.github_url ? (
            <Button asChild variant="outline" className="gap-2">
              <a href={project.github_url} target="_blank" rel="noreferrer">
                <FolderGit2 aria-hidden="true" />
                View code
              </a>
            </Button>
          ) : null}
        </div>
      </motion.div>

      {gallery.length > 0 ? (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-10 grid gap-4"
        >
          {gallery.length === 1 ? (
            <img
              src={resolveUrl(gallery[0].url)}
              alt={gallery[0].alt || project.title}
              className="w-full rounded-xl border border-border object-cover"
            />
          ) : (
            gallery.map((image) => (
              <img
                key={image.file_id}
                src={resolveUrl(image.url)}
                alt={image.alt || project.title}
                loading="lazy"
                className="w-full rounded-xl border border-border object-cover"
              />
            ))
          )}
        </motion.div>
      ) : null}

      <motion.div
        variants={containerStagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid gap-8 md:grid-cols-3"
      >
        <motion.div variants={itemFadeUp} className="md:col-span-2">
          <h2 className="mb-4 font-mono text-xl font-bold text-foreground">
            <span className="text-primary">&gt;</span> about_this_project
          </h2>
          <div className="space-y-4 leading-relaxed text-foreground/85">
            {project.description ? (
              project.description.split('\n').filter(Boolean).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <p>{project.short_description}</p>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemFadeUp}>
          <div className="dot-dense relative overflow-hidden rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 font-mono text-xs font-bold tracking-widest text-muted-foreground uppercase">
              // tech stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="outline" className="px-2.5 py-1 font-mono hover:border-primary hover:text-primary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  )
}