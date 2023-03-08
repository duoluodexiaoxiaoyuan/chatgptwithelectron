import React, { Fragment } from 'react'
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
//高亮的主题，还有很多别的主题，可以自行选择
import { tomorrow, dark } from 'react-syntax-highlighter/dist/esm/styles/prism'

function ChatContent(props) {
  const { message } = props

  const handleContent = (message) => {
    return   <ReactMarkdown
    children={message}
    components={{
      code({node, inline, className, children, ...props}) {
        const match = /language-(\w+)/.exec(className || '')
        return !inline && match ? (
          <SyntaxHighlighter
            children={String(children).replace(/\n$/, '')}
            style={tomorrow}
            language={match[1]}
            PreTag="div"
            {...props}
          />
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        )
      }
    }}
  />
  }

  return (
    <Fragment>
      {handleContent(message)}
    </Fragment>
  )
}

export default ChatContent