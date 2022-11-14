import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link href="/static/fonts/PolySans/style.css" rel="stylesheet" />
        <link href="/static/fonts/Lato/stylesheet.css" rel="stylesheet" />
        <link rel="shortcut icon" href="/static/favicon.png" />
        <meta property="og:title" content="Streamcel" />
        <meta property="og:url" content="https://www.streamcel.com" />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/drda29q8x/image/upload/v1668419884/Artboard_1_copy_swvwml.png"
        />
        <meta name="twitter:title" content="Streamcel " />
        <meta
          name="twitter:description"
          content="Stream more at a budget by sharing subscriptions to your favourite streaming services with other people"
        />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/drda29q8x/image/upload/v1668419884/Artboard_1_copy_swvwml.png"
        />
        <meta name="twitter:card" content="summary"></meta>
      </Head>
      <body className="dark:bg-gray-800">
        <Main />
        <NextScript />
        <script src="/static/scripts/index.js" />
      </body>
    </Html>
  );
}
