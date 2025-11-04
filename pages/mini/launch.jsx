// pages/mini/launch.jsx
import Head from "next/head";

const PUBLIC_BASE = process.env.NEXT_PUBLIC_SITE_BASE || "https://warpcat.xyz";

export default function LaunchFrame() {
  const frame = {
    version: "next",
    imageUrl: `${PUBLIC_BASE}/static/og.png`,
    button: {
      title: "Open",
      action: {
        type: "launch_frame",
        name: "WarpCat",
        url: `${PUBLIC_BASE}/mini/app`,              // Mini App webview
        splashImageUrl: `${PUBLIC_BASE}/static/og.png`,
        splashBackgroundColor: "#000000",
      },
    },
  };

  return (
    <>
      <Head>
        <meta name="fc:frame" content={JSON.stringify(frame)} />
        <meta property="og:image" content={`${PUBLIC_BASE}/static/og.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <title>WarpCat — Open Mini App</title>
      </Head>
      <div style={{background:"#000",minHeight:"100vh"}} />
    </>
  );
}
