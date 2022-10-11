import { Html, Head, Main, NextScript } from 'next/document'


export default function Document() {
    return (
        <Html>
            <Head >

                <link href="/static/fonts/PolySans/style.css" rel="stylesheet" />
                <link href="/static/fonts/Lato/stylesheet.css" rel="stylesheet" />
                <link rel="shortcut icon" href="/static/favicon.png" />
            </Head>
            <body className="dark:bg-gray-800">
                <Main />
                <NextScript />
                <script src="/static/scripts/index.js" />
            </body>
        </Html>
    )
}