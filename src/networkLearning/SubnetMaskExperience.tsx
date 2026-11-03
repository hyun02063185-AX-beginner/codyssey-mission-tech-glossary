import {useEffect,useId,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import {compareNetworks,exampleAddresses,ipv4Number} from './ipv4';
import './subnetMask.css';

export default function SubnetMaskExperience(){
  const [prefix,setPrefix]=useState(24),id=useId();
  const result=compareNetworks(prefix);
  return <section className="subnet-experience" aria-labelledby={`${id}-title`}>
    <h3 id={`${id}-title`}>서브넷 마스크 체험</h3>
    <p>IP 주소와 서브넷 마스크를 비트 AND로 계산하면 네트워크 주소가 됩니다. 같은 CIDR을 두 컴퓨터에 적용해 비교해 보세요.</p>
    <label className="sm-control" htmlFor={`${id}-prefix`}>CIDR 선택 <select id={`${id}-prefix`} value={prefix} onChange={event=>setPrefix(Number(event.target.value))}>{[16,24,26].map(n=><option value={n} key={n}>/{n} · 네트워크 {n}비트</option>)}</select></label>
    <p className="sm-mask">서브넷 마스크 <strong><code data-subnet-mask>{result.mask}</code></strong></p>
    <p className="sm-legend"><span className="sm-network">앞 {prefix}비트: 네트워크 부분</span><span className="sm-host">뒤 {32-prefix}비트: 호스트 부분</span></p>
    <div className="sm-computers">{exampleAddresses.map((ip,index)=>{
      const bits=ipv4Number(ip).toString(2).padStart(32,'0');
      return <section key={ip} className="sm-computer" aria-label={`컴퓨터 ${index===0?'A':'B'}`}>
        <h4>컴퓨터 {index===0?'A':'B'}</h4><p className="sm-ip"><code>{ip}</code></p>
        <div className="sm-binary" aria-label={`${ip}의 32비트. 앞 ${prefix}비트는 네트워크, 뒤 ${32-prefix}비트는 호스트 부분.`}>{[0,1,2,3].map(octet=><span className="sm-octet" key={octet} aria-hidden="true">{Array.from({length:8},(_,bit)=>{const position=octet*8+bit;return <span key={bit} data-part={position<prefix?'network':'host'}>{bits[position]}</span>})}</span>)}</div>
        <p className="sm-network-result">IP AND 마스크 → 네트워크 주소<br/><strong><code data-network-address={index===0?'A':'B'}>{result.networks[index]}/{prefix}</code></strong></p>
      </section>;
    })}</div>
    <p className="sm-verdict" role="status" aria-live="polite" aria-atomic="true" data-same-network={result.same}>{result.same?'같은 네트워크':'다른 네트워크'} · {result.same?'계산한 네트워크 주소가 같습니다.':'계산한 네트워크 주소가 다릅니다.'}</p>
    <details className="sm-reference"><summary>선택 없이 결과 비교하기</summary><div className="sm-table-scroll"><table><thead><tr><th>CIDR</th><th>마스크</th><th>A / B 네트워크 주소</th><th>판정</th></tr></thead><tbody>{[16,24,26].map(n=>{const row=compareNetworks(n);return <tr key={n}><th scope="row">/{n}</th><td>{row.mask}</td><td>{row.networks[0]}<br/>{row.networks[1]}</td><td>{row.same?'같은 네트워크':'다른 네트워크'}</td></tr>})}</tbody></table></div></details>
    <p className="sm-boundary">같은 네트워크 주소인지는 주소 범위의 비교입니다. 실제 통신에는 연결과 경로·방화벽 정책 등도 맞아야 합니다. 이 체험은 IPv4 예시이며 VPC나 서브넷 설정을 변경하지 않습니다.</p>
  </section>;
}

// Reuses the story's native dialog + close/Escape/focus-return pattern.
export function SubnetMaskDialog(){
  const [open,setOpen]=useState(false),dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement>(null),id=useId();
  useEffect(()=>{
    if(!open)return;
    dialog.current?.showModal();
    const overflow=document.body.style.overflow;document.body.style.overflow='hidden';
    return()=>{document.body.style.overflow=overflow};
  },[open]);
  function close(){dialog.current?.close();setOpen(false);trigger.current?.focus()}
  return <><button className="sm-open" type="button" ref={trigger} onClick={()=>setOpen(true)}>서브넷 마스크 체험하기</button>{open&&<dialog ref={dialog} className="sm-dialog" aria-labelledby={`${id}-dialog-title`} onCancel={event=>{event.preventDefault();close()}}>
    <header><h2 id={`${id}-dialog-title`}>서브넷 마스크 체험하기</h2><button type="button" autoFocus onClick={close}>닫고 슬라이드로 돌아가기</button></header>
    <p className="sm-glossary-note">용어사전 CIDR 항목의 체험입니다. <Link to="/terms/cidr">용어사전에서 자세히 보기</Link></p>
    <SubnetMaskExperience/>
  </dialog>}</>;
}
