import React, { Fragment } from 'react'
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import rehypeHighlight from 'rehype-highlight';
// import { Card } from 'antd'
// import './ChatContent.css'

import { Typography, Divider, Space } from 'antd';

const { Title, Paragraph, Text } = Typography;
function ChatContent(props) {
  const { message } = props

  const renderers = {
    code: ({ language, value }) => {
      return <SyntaxHighlighter style={dark} language={language} children={value} />
    }
  }

  const handleContent = (message) => {
  //   return  <Typography>
  //   <Divider />
  //     <Paragraph>{message}</Paragraph>
  //   <Divider />
  //   <Paragraph>
  //     <Text code>{message}</Text>
  //   </Paragraph>
  // </Typography>
   return <ReactMarkdown renderers={renderers} children={message}></ReactMarkdown>
  }

  return (
    <Fragment>
      {handleContent(message)}
      {/* <Card className="content-card">
        <h2>其它内容</h2>
        <p>这里是其它内容的描述。</p>
      </Card>
      <Card className="code-card">
        <h2>代码</h2>
        <pre><code>{data}</code></pre>
      </Card> */}
    </Fragment>
  )
}

export default ChatContent