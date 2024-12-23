import ReactMarkdown from 'react-markdown'
import 'katex/dist/katex.min.css'
import RemarkMath from 'remark-math'
import RemarkBreaks from 'remark-breaks'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atelierHeathLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { API_PREFIX } from '../../../config'
import { PhotoView } from 'react-photo-view'

export function Markdown(props: {
  content: string
  onImageClick?: (url: string) => void
}) {
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement
    const src = target.src
    if (props.onImageClick) {
      props.onImageClick(src)
    }
  }

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
        rehypePlugins={[RehypeKatex]}
        components={{
          code({ node, className, children, ref, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <SyntaxHighlighter
                {...props}
                children={String(children).replace(/\n$/, '')}
                style={atelierHeathLight}
                language={match[1]}
                showLineNumbers
                PreTag="div"
              />
            ) : (
              <code {...props} className={className}>
                {children}
              </code>
            )
          },

          img({ node, src, alt, title, ...props }) {
            return (
              <PhotoView src={src}>
                <img
                  {...props}
                  onClick={handleImageClick}
                  src={src}
                  alt={alt}
                  title={title}
                  className="w-full rounded-t-md"
                />
              </PhotoView>
            )
          },
        }}
        urlTransform={(url: string) => {
          if (url.startsWith('/files/tools/')) {
            return `${API_PREFIX}${url}`
          }
          return url
        }}
      >
        {props.content}
      </ReactMarkdown>
    </div>
  )
}
