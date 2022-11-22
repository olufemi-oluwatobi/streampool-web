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
          content="https://res.cloudinary.com/drda29q8x/image/upload/v1669149826/metas/WhatsApp_Image_2022-11-22_at_8.46.56_PM_lmdlhf.jpg"
        />
        <meta property="twitter:title" content="Streamcel " />
        <meta
          property="twitter:description"
          content="Stream more at a budget by sharing subscriptions to your favourite streaming services with other people"
        />
        <meta
          property="twitter:image"
          content="https://res.cloudinary.com/drda29q8x/image/upload/v1669149826/metas/WhatsApp_Image_2022-11-22_at_8.46.56_PM_lmdlhf.jpg"
        />
        <meta property="twitter:card" content="summary"></meta>
        <script
          type="text/javascript"
          id="hs-script-loader"
          async
          defer
          src="//js-na1.hs-scripts.com/23176902.js"
        ></script>

        <script src="/static/scripts/index.js" />
      </Head>
      <body className="dark:bg-gray-800">
        <Main />
        <NextScript />
        <script
          type="text/javascript"
          id="hs-script-loader"
          async
          defer
          src="//js-na1.hs-scripts.com/23176902.js"
        ></script>
      </body>
    </Html>
  );
}
