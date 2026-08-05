import { useParams, Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import Seo from '@/components/Seo'
import PageHero from '@/components/ui/PageHero'
import Container from '@/components/ui/Container'
import { FacebookIcon, TwitterIcon, LinkedinIcon } from '@/components/ui/SocialIcons'
import { useResourceItem, useResourceList } from '@/hooks/useContentQueries'
import { BLOG_POSTS as FALLBACK_POSTS } from '@/data/site'
import NotFound from './NotFound'

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function BlogPost() {
  const { slug } = useParams()
  const { data, isLoading, isError } = useResourceItem('blogs', slug)
  const { data: listData } = useResourceList('blogs', { limit: 10, sort: '-publishedAt' })

  const live = data?.data
  const fallbackPost = FALLBACK_POSTS.find((p) => slugify(p.title) === slug)
  const post = live ?? (isError && fallbackPost ? fallbackPost : null)

  if (isLoading && !post) {
    return (
      <div className="bg-white py-24 dark:bg-ink-950">
        <Container className="max-w-3xl space-y-4">
          <div className="h-6 w-1/3 animate-pulse rounded bg-ink-100 dark:bg-ink-800" />
          <div className="h-10 w-2/3 animate-pulse rounded-lg bg-ink-100 dark:bg-ink-800" />
          <div className="h-64 w-full animate-pulse rounded-2xl bg-ink-100 dark:bg-ink-800" />
        </Container>
      </div>
    )
  }

  if (!post) return <NotFound />

  const category = typeof post.category === 'object' ? post.category?.name : post.category
  const readMins = post.readingTimeMinutes ?? post.readMins
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : post.date
  const image = post.featuredImage?.url

  const otherPosts = (listData?.data ?? FALLBACK_POSTS).filter((p) => (p.slug ?? slugify(p.title)) !== slug)
  const related = otherPosts.slice(0, 2)

  return (
    <>
      <Seo title={post.title} description={post.excerpt} path={`/blog/${slug}`} />
      <PageHero eyebrow={category} title={post.title} crumb={post.title} />

      <article className="bg-white py-16 dark:bg-ink-950 md:py-24">
        <Container className="max-w-3xl">
          <div className="flex items-center gap-4 text-sm text-ink-500 dark:text-ink-400">
            {date && <span>{date}</span>}
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {readMins} min read</span>
          </div>

          {image && <img src={image} alt={post.title} className="mt-8 aspect-video w-full rounded-3xl object-cover" />}

          <div className="prose prose-ink mt-8 max-w-none dark:prose-invert prose-headings:font-display">
            {post.content ? (
              // Content is authored HTML from the admin's rich-text editor.
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p className="text-lg leading-relaxed text-ink-700 dark:text-ink-300">{post.excerpt}</p>
            )}
          </div>

          <div className="mt-10 flex items-center gap-3 border-t border-ink-100 pt-8 dark:border-ink-800">
            <span className="text-sm font-medium text-ink-500 dark:text-ink-400">Share:</span>
            {[FacebookIcon, TwitterIcon, LinkedinIcon].map((Icon, i) => (
              <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-200 text-ink-500 hover:border-ember-500 hover:text-ember-500 dark:border-ink-700">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          {related.length > 0 && (
            <div className="mt-14">
              <h3 className="font-display text-xl font-semibold text-ink-900 dark:text-white">Related Articles</h3>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {related.map((r) => {
                  const rCategory = typeof r.category === 'object' ? r.category?.name : r.category
                  const rSlug = r.slug ?? slugify(r.title)
                  return (
                    <Link key={r._id || r.title} to={`/blog/${rSlug}`} className="rounded-2xl border border-ink-100 p-5 hover:border-ember-300 dark:border-ink-800">
                      {rCategory && <p className="text-xs font-medium text-ember-600 dark:text-ember-400">{rCategory}</p>}
                      <p className="mt-1 font-display font-semibold text-ink-900 dark:text-white">{r.title}</p>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </Container>
      </article>
    </>
  )
}
