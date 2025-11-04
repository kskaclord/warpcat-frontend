import Head from "next/head";

const PUBLIC_BASE =
  process.env.NEXT_PUBLIC_SITE_BASE || "https://warpcat.xyz"; // domain bağlayınca doğru olur
const IMAGE = `${PUBLIC_BASE}/static/og.png`;
const APP_URL = `${PUBLIC_BASE}/mini/app`;

export default function Launch() {
  // Warpcast “Embed Tool” sadece meta okur; içerikte body boş kalabilir.
  const frame = {
    version: "next",
    imageUrl: IMAGE,
    button: {
      title: "Open",
      action: {
        type: "launch_frame",
        name: "WarpCat",
        url: APP_URL,
        splashImageUrl: IMAGE,
        splashBackgroundColor: "#000000"
      }
    }
  };

  return (
    <>
      <Head>
        <title>WarpCat — Open Mini App</title>
        <meta property="og:title" content="WarpCat — Open Mini App" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${PUBLIC_BASE}/mini/launch`} />
        <meta property="og:image" content={IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={IMAGE} />
        {/* frame json’u tek meta içinde gömüyoruz */}
        <meta name="fc:frame" content={JSON.stringify(frame)} />
      </Head>
      <div style={{background:"#000",minHeight:"100vh"}} />
    </>
  );
}
