import Head from "next/head";

const PUBLIC_BASE =
  process.env.NEXT_PUBLIC_SITE_BASE || "https://warpcat.xyz";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://api.warpcat.xyz";

export default function MiniApp() {
  const moduleScript = `
    import { createConfig, connect, getAccount, sendTransaction } from 'https://esm.sh/@wagmi/core@2.13.4';
    import { http } from 'https://esm.sh/viem@2.13.7';
    import { base } from 'https://esm.sh/viem@2.13.7/chains';
    import { FarcasterMiniAppConnector } from 'https://esm.sh/@farcaster/miniapp-wagmi-connector@0.1.7';
    import { sdk } from 'https://esm.sh/@farcaster/miniapp-sdk@0.2.1';

    const statusEl   = document.getElementById('status');
    const resultEl   = document.getElementById('result');
    const okDot      = document.getElementById('ok');
    const mintBtn    = document.getElementById('mint');
    const refreshBtn = document.getElementById('refresh');

    const qs  = new URLSearchParams(location.search);
    const fid = qs.get('fid') || '0';
    const txUrl = '${API_BASE}/mini/tx?fid=' + encodeURIComponent(fid);
    const frameMintUrl = '${PUBLIC_BASE}/frame/mint?fid=' + encodeURIComponent(fid);

    function setStatus(t){ statusEl.textContent = t; }
    function setBusy(b){ mintBtn.disabled = refreshBtn.disabled = b; }

    const fcConnector = new FarcasterMiniAppConnector({ chains: [base] });
    const config = createConfig({
      chains: [base],
      transports: { [base.id]: http() },
      connectors: [fcConnector],
    });

    async function init(){
      try{
        await sdk.actions.ready();                 // READY EN BAŞTA
        okDot.style.background = '#0bd30b';
        setStatus('Ready.');
      }catch(e){
        console.warn('sdk.ready warning:', e);
        setStatus('Ready.');
      }

      refreshBtn.onclick = ()=> location.reload();

      mintBtn.onclick = async ()=>{
        setBusy(true);
        resultEl.textContent = '';
        try{
          const r = await fetch(txUrl, { headers: { 'accept':'application/json', 'cache-control':'no-cache' }});
          if(!r.ok) throw new Error('Tx payload failed: ' + r.status);
          const tx = await r.json();

          let acc = getAccount(config);
          if(!acc.isConnected){
            await connect(config, { connector: fcConnector });
            acc = getAccount(config);
          }
          if(!acc.isConnected) throw new Error('Wallet provider missing');

          const chainIdNum = Number(String(tx.chainId).split(':').pop() || 8453);

          setStatus('Opening wallet…');
          const hash = await sendTransaction(config, {
            chainId: chainIdNum,
            to: tx.params.to,
            data: tx.params.data,
            value: BigInt(tx.params.value),
          });

          setStatus('Mint submitted. Waiting for confirmation…');
          const link = 'https://basescan.org/tx/' + hash;
          resultEl.innerHTML = 'Tx: <a class="link" href="' + link + '" target="_blank" rel="noopener">view on BaseScan</a>';
        }catch(err){
          console.error(err);
          const msg = String(err && (err.message || err)).toLowerCase();
          if(msg.includes('wallet provider')){
            setStatus('No wallet in this preview. Opening Frame mint…');
            try{ await sdk.actions.openUrl(frameMintUrl); }catch{ location.href = frameMintUrl; }
          }else{
            setStatus('Mint failed: ' + (err && err.message ? err.message : String(err)));
          }
        }finally{
          setBusy(false);
        }
      };
    }

    init();
  `;

  return (
    <>
      <Head>
        <title>WarpCat — Mint</title>
        <meta property="og:image" content={`${PUBLIC_BASE}/static/og.png`} />
      </Head>

      <div className="wrap">
        <div className="card">
          <img className="logo" src={`${PUBLIC_BASE}/static/og.png`} alt="WarpCat" />
          <h2 style={{margin:"16px 0 4px"}}>WarpCat — Mint <span id="ok"/></h2>
          <div style={{opacity:.8, marginBottom:12}}>1 FID = 1 NFT • Base</div>

          <div className="row">
            <button id="mint" className="btn btn-primary">✨ Mint</button>
            <button id="refresh" className="btn" style={{background:"#1a1a1a", color:"#ddd"}}>Refresh</button>
          </div>

          <div id="status" className="muted">Loading…</div>
          <div id="result" className="muted" style={{marginTop:8}} />
        </div>
      </div>

      <style jsx global>{`
        :root { color-scheme: dark; }
        html,body{margin:0;background:#000;color:#fff;font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial}
        .wrap{min-height:100dvh;display:grid;place-items:center;padding:24px}
        .card{width:min(560px,90vw);background:#0b0b0b;border:1px solid #222;border-radius:16px;padding:24px;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,.5)}
        .btn{appearance:none;border:0;border-radius:12px;padding:14px 18px;font-weight:700;cursor:pointer}
        .btn-primary{background:linear-gradient(90deg,#5b34ff,#8b5cf6);color:#fff}
        .row{display:flex;gap:12px;justify-content:center;margin-top:16px;flex-wrap:wrap}
        .muted{opacity:.75;font-size:13px;margin-top:12px}
        img.logo{width:96px;height:96px;border-radius:20px;border:1px solid #222;background:#111}
        #ok{display:inline-block;width:8px;height:8px;border-radius:50%;background:#f00;vertical-align:middle;margin-left:6px}
        a.link{color:#8ab4ff;text-decoration:none}
      `}</style>

      <script type="module" dangerouslySetInnerHTML={{ __html: moduleScript }} />
    </>
  );
}
