/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";

const RED   = "#C8102E";
const DRED  = "#9B0020";
const AMB   = "#D97706";
const ADDR1 = "56 Abdul Hameed Street, Colombo 01200";
const TEL   = "+94 77 303 7029";

const BASE_MENU = {
  "Beverages":    [
    {id:"bv1",name:"Coca Cola",price:200},{id:"bv2",name:"Sprite",price:200},
    {id:"bv3",name:"Fanta",price:200},{id:"bv4",name:"Water Bottle",price:100},
    {id:"bv5",name:"Orange Juice",price:350},{id:"bv6",name:"Mango Juice",price:350},
    {id:"bv7",name:"Tea",price:150},{id:"bv8",name:"Coffee",price:200},
    {id:"bv9",name:"Ginger Beer",price:250},{id:"bv10",name:"Milk Shake",price:400},
  ],
  "Mini Eats":    [{id:"me1",name:"Chicken Mini Sub",price:500},{id:"me2",name:"Tandoori Mini Sub",price:550},{id:"me3",name:"Beef Mini Sub",price:650},{id:"me4",name:"Mini Chicken Burger",price:450},{id:"me5",name:"Jumbo Hot Dog",price:450},{id:"me6",name:"Mini Beef Burger",price:600}],
  "Roast Chicken":[{id:"rc1",name:"Quarter Chicken",price:600},{id:"rc2",name:"Half Chicken",price:1200},{id:"rc3",name:"Full Chicken",price:2200},{id:"rc4",name:"Rotti",price:120}],
  "Shawarma":     [{id:"sw1",name:"Devilled Chicken",price:1000},{id:"sw2",name:"Tandoori Chicken",price:1000},{id:"sw3",name:"Crispy Chicken",price:1000},{id:"sw4",name:"Beef",price:1100},{id:"sw5",name:"Mix (Chicken/Beef)",price:1200},{id:"sw6",name:"Fish",price:1000},{id:"sw7",name:"Veggie",price:850}],
  "Submarine":    [{id:"sub1",name:"Devilled Chicken Sub",price:1000},{id:"sub2",name:"Tandoori Chicken Sub",price:1000},{id:"sub3",name:"Crispy Chicken Sub",price:1000},{id:"sub4",name:"Beef Sub",price:1100},{id:"sub5",name:"Mix Sub",price:1200},{id:"sub6",name:"Fish Sub",price:1000},{id:"sub7",name:"Veggie Sub",price:850}],
  "Burgers":      [{id:"bu1",name:"Crispy Chicken",price:800},{id:"bu2",name:"Tandoori",price:850},{id:"bu3",name:"Masala Beef",price:950},{id:"bu4",name:"Double Chicken Patty",price:900},{id:"bu5",name:"Double Beef Patty",price:1100},{id:"bu6",name:"Kochi Chicken",price:800},{id:"bu7",name:"Fish Burger",price:750},{id:"bu8",name:"Veggie Burger",price:600}],
  "Specials":     [{id:"sp1",name:"Special Burger",price:950},{id:"sp2",name:"Special Sub",price:1050},{id:"sp3",name:"Garlic Devilled Qtr",price:1200},{id:"sp4",name:"Pepper Devilled Qtr",price:1200},{id:"sp5",name:"Chillie Devilled Qtr",price:1200}],
  "Rotti Kottu":  [{id:"rk1",name:"Grilled Chicken",price:1300},{id:"rk2",name:"Tandoori",price:1400},{id:"rk3",name:"Beef",price:1500},{id:"rk4",name:"Mix",price:1500},{id:"rk5",name:"Sausages",price:1150}],
  "Cheese Kottu": [{id:"ck1",name:"Grilled Chicken",price:1450},{id:"ck2",name:"Tandoori",price:1500},{id:"ck3",name:"Beef",price:1600},{id:"ck4",name:"Mix",price:1600},{id:"ck5",name:"Sausages",price:1300}],
  "String Kottu": [{id:"sk1",name:"Grilled Chicken",price:1350},{id:"sk2",name:"Tandoori",price:1500},{id:"sk3",name:"Beef",price:1500},{id:"sk4",name:"Mix",price:1500},{id:"sk5",name:"Sausages",price:1200}],
  "Kottu":        [{id:"ko1",name:"Rotti Kottu",price:1300},{id:"ko2",name:"Nasi Kottu",price:1400},{id:"ko3",name:"Cheese Kottu",price:1600},{id:"ko4",name:"String Kottu",price:1350},{id:"ko5",name:"Dolpin Kottu",price:1450}],
  "Starters":     [{id:"st1",name:"French Fries",price:900},{id:"st2",name:"Veg Salad",price:350}],
  "Fried Rice":   [{id:"fr1",name:"Veg Fried Rice",price:700},{id:"fr2",name:"Chicken Fried Rice",price:1200},{id:"fr3",name:"Seafood Fried Rice",price:1500},{id:"fr4",name:"Mix Fried Rice",price:1700}],
};

const CICONS = {
  "Beverages":"🥤","Mini Eats":"🥖","Roast Chicken":"🍗","Shawarma":"🌯",
  "Submarine":"🥙","Burgers":"🍔","Specials":"⭐","Rotti Kottu":"🫕",
  "Cheese Kottu":"🧀","String Kottu":"🍝","Kottu":"🥘","Starters":"🥗","Fried Rice":"🍚",
};

const SCRIPT_CODE =
`function doPost(e) {
  try {
    var ss = SpreadsheetApp.openById(
      '1xX0kn1l3hj4MnG0MUDqYn0lZnhJKak_SLra5IlkRyzY');
    var sh = ss.getSheetByName('Sales') || ss.insertSheet('Sales');
    if(sh.getLastRow()===0){
      sh.appendRow(['Order#','Type','Ref','Date','Time','Items',
        'Subtotal','Discount','Total','Payment','Cash Rcvd','Change']);
    }
    var d = JSON.parse(e.postData.contents);
    d.orders.forEach(function(o){
      var items = o.items.map(function(i){ return i.name+' x'+i.qty; }).join(', ');
      sh.appendRow([o.orderNum,o.type,o.ref,o.date,o.time,items,
        o.subtotal,o.discountAmount||0,o.total,
        o.paymentMethod,o.amountPaid,o.change||0]);
    });
    return ContentService
      .createTextOutput(JSON.stringify({success:true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({success:false,error:err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
function doGet(e){
  return ContentService
    .createTextOutput(JSON.stringify({status:'ok'}))
    .setMimeType(ContentService.MimeType.JSON);
}`;

const NUM_TABLES = 15;
const Rs       = n => "Rs. " + Number(n).toLocaleString();
const mkTables = () => Array.from({length:NUM_TABLES},(_,i)=>({id:i+1,cart:[],openedAt:null}));
const taLabel  = n => "TA-" + String(n).padStart(3,"0");
const elapsed  = iso => {
  if(!iso) return null;
  const m = Math.floor((Date.now()-new Date(iso).getTime())/60000);
  return m<60 ? m+"m" : Math.floor(m/60)+"h "+(m%60)+"m";
};

// ── Logo component (uses /logo.png, falls back to emoji) ──
function Logo({size=36, round=false}) {
  const [err, setErr] = useState(false);
  if(err) return <span style={{fontSize:size*0.8, lineHeight:1}}>🐓</span>;
  return (
    <img
      src="/logo.png"
      alt="Chef Rooster"
      onError={()=>setErr(true)}
      style={{width:size, height:size, objectFit:"contain", borderRadius: round?"50%":"8px", display:"block"}}
    />
  );
}

// ── Styles ────────────────────────────────────────────────
const P = {
  page:   {display:"flex",flexDirection:"column",height:"100vh",background:"#f4f4f4",fontFamily:"'Segoe UI',system-ui,sans-serif",overflow:"hidden"},
  topbar: {background:"linear-gradient(135deg,#C8102E,#9B0020)",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0},
  card:   {background:"#fff",borderRadius:14,padding:20,boxShadow:"0 2px 14px rgba(0,0,0,0.07)"},
  btn:    {background:"#C8102E",border:"none",borderRadius:10,color:"#fff",cursor:"pointer",fontWeight:700,fontSize:14,padding:"12px 20px"},
  ghost:  {background:"none",border:"none",color:"#aaa",cursor:"pointer",fontSize:13,marginTop:10,width:"100%",textAlign:"center",display:"block"},
  tbBtn:  {background:"rgba(255,255,255,0.18)",border:"none",borderRadius:9,padding:"6px 12px",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600},
};

function TopBar({children,onBack,right}) {
  return (
    <div style={P.topbar}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={onBack} style={{...P.tbBtn,padding:"6px 10px",fontSize:16}}>←</button>
        {children}
      </div>
      {right}
    </div>
  );
}

function Numpad({value,onChange}) {
  const keys=["1","2","3","4","5","6","7","8","9",".","0","⌫"];
  const tap=k=>{
    if(k==="⌫"){onChange(p=>p.slice(0,-1));return;}
    if(k==="."&&value.includes("."))return;
    onChange(p=>p+k);
  };
  return (
    <div>
      <div style={{background:"#f5f5f5",borderRadius:10,padding:"11px 14px",fontSize:26,fontWeight:700,textAlign:"right",minHeight:52,marginBottom:10}}>
        {value||<span style={{color:"#d0d0d0"}}>0</span>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7}}>
        {keys.map(k=>(
          <button key={k} onClick={()=>tap(k)}
            style={{padding:"14px 0",borderRadius:9,border:"1px solid #eee",background:k==="⌫"?"#fee2e2":"#fff",cursor:"pointer",fontSize:17,fontWeight:700,color:k==="⌫"?"#dc2626":"#1a1a1a"}}>
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────
export default function App() {

  const [screen,    setScreen]    = useState("home");
  const [homeTab,   setHomeTab]   = useState("tables");
  const [tables,    setTables]    = useState(mkTables());
  const [takeaways, setTakeaways] = useState([]);
  const [taCounter, setTaCounter] = useState(1);
  const [selTbl,    setSelTbl]    = useState(null);
  const [selTA,     setSelTA]     = useState(null);
  const [mode,      setMode]      = useState(null);
  const [cat,       setCat]       = useState(Object.keys(BASE_MENU)[0]);
  const [orders,    setOrders]    = useState([]);
  const [counter,   setCounter]   = useState(1);
  const [lastOrder, setLast]      = useState(null);
  const [payStep,   setPayStep]   = useState("choose");
  const [cashAmt,   setCashAmt]   = useState("");
  const [sheetUrl,  setSheetUrl]  = useState("");
  const [syncMsg,   setSyncMsg]   = useState("");
  const [loaded,    setLoaded]    = useState(false);
  const [rptTab,    setRptTab]    = useState("summary");
  const [tillSess,  setTillSess]  = useState(null);
  const [tillHist,  setTillHist]  = useState([]);
  const [dayEnd,    setDayEnd]    = useState(null);
  const [showDE,    setShowDE]    = useState(false);
  const [tcModal,   setTcModal]   = useState(false);
  const [tcPass,    setTcPass]    = useState("");
  const [tcErr,     setTcErr]     = useState("");
  const [loggedIn,  setLoggedIn]  = useState(false);
  const [lUser,     setLUser]     = useState("");
  const [lPass,     setLPass]     = useState("");
  const [lErr,      setLErr]      = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [clrModal,  setClrModal]  = useState(false);
  const [clrPass,   setClrPass]   = useState("");
  const [clrErr,    setClrErr]    = useState("");
  const [clrFn,     setClrFn]     = useState(null);
  const [clrLabel,  setClrLabel]  = useState("");
  const [rptLocked, setRptLocked] = useState(true);
  const [rptPin,    setRptPin]    = useState("");
  const [rptPinErr, setRptPinErr] = useState("");
  const [customPrices, setCustomPrices] = useState({});
  const [priceEdits,   setPriceEdits]   = useState({});
  const [priceCat,     setPriceCat]     = useState(Object.keys(BASE_MENU)[0]);
  const [priceSaved,   setPriceSaved]   = useState(false);
  // Discount states
  const [discType,  setDiscType]  = useState("percent"); // "percent" | "fixed"
  const [discValue, setDiscValue] = useState("");
  const [showDisc,  setShowDisc]  = useState(false);

  // ── Load ──────────────────────────────────────────────
  useEffect(()=>{
    const t=localStorage.getItem("cr_tables");
    if(t){const p=JSON.parse(t);if(Array.isArray(p)&&p.length===NUM_TABLES)setTables(p);}
    const ta=localStorage.getItem("cr_takeaways"); if(ta)setTakeaways(JSON.parse(ta));
    const tc=localStorage.getItem("cr_tacounter"); if(tc)setTaCounter(+tc);
    const o =localStorage.getItem("cr_orders");    if(o) setOrders(JSON.parse(o));
    const c =localStorage.getItem("cr_counter");   if(c) setCounter(+c);
    const u =localStorage.getItem("cr_url");       if(u) setSheetUrl(u);
    const th=localStorage.getItem("cr_till_hist"); if(th)setTillHist(JSON.parse(th));
    const cp=localStorage.getItem("cr_prices");    if(cp){const p=JSON.parse(cp);setCustomPrices(p);setPriceEdits(p);}
    const tod=new Date().toLocaleDateString("en-GB");
    const ts=localStorage.getItem("cr_till_sess");
    const openNew=()=>{
      const s={date:tod,openedAt:new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),status:"open",closedAt:null,openingBalance:0};
      setTillSess(s); localStorage.setItem("cr_till_sess",JSON.stringify(s));
    };
    if(ts){const s=JSON.parse(ts);if(s.date===tod)setTillSess(s);else openNew();}
    else openNew();
    setLoaded(true);
  },[]);

  // ── Save helpers ────────────────────────────────────────
  const saveTbls     = t  => localStorage.setItem("cr_tables",    JSON.stringify(t));
  const saveTAs      = ta => localStorage.setItem("cr_takeaways", JSON.stringify(ta));
  const saveOrd      = (o,c)=>{ localStorage.setItem("cr_orders",JSON.stringify(o)); localStorage.setItem("cr_counter",String(c)); };
  const saveTillSess = s  => localStorage.setItem("cr_till_sess", JSON.stringify(s));
  const saveTillHist = h  => localStorage.setItem("cr_till_hist", JSON.stringify(h));

  // ── Price helpers ────────────────────────────────────────
  const getPrice = item => customPrices[item.id]!==undefined ? customPrices[item.id] : item.price;

  const savePrices=()=>{
    const merged={...customPrices,...priceEdits};
    setCustomPrices(merged); localStorage.setItem("cr_prices",JSON.stringify(merged));
    setPriceSaved(true); setTimeout(()=>setPriceSaved(false),2000);
  };
  const resetPrices=()=>{setCustomPrices({});setPriceEdits({});localStorage.removeItem("cr_prices");};

  // ── Discount calc ────────────────────────────────────────
  const cartSubtotal = useCallback((c)=>c.reduce((s,i)=>s+i.price*i.qty,0),[]);

  // ── Reports lock ─────────────────────────────────────────
  const doRptUnlock=()=>{
    if(rptPin==="2222"){setRptLocked(false);setRptPin("");setRptPinErr("");}
    else setRptPinErr("Incorrect password.");
  };
  const goReports=()=>{setSyncMsg("");setRptLocked(true);setRptPin("");setRptPinErr("");setScreen("reports");};
  const leaveReports=()=>{setRptLocked(true);setScreen("home");};

  // ── Auth-protected clear ─────────────────────────────────
  const askClear=(label,fn)=>{setClrLabel(label);setClrFn(()=>fn);setClrPass("");setClrErr("");setClrModal(true);};
  const doClr=()=>{
    if(clrPass==="2222"){clrFn&&clrFn();setClrModal(false);setClrPass("");setClrErr("");setClrFn(null);}
    else setClrErr("Incorrect password. Access denied.");
  };
  const closeClearModal=()=>{setClrModal(false);setClrPass("");setClrErr("");setClrFn(null);};

  // ── Cart ─────────────────────────────────────────────────
  const cart  = mode==="table"    ? (tables.find(t=>t.id===selTbl)?.cart||[])
              : mode==="takeaway" ? (takeaways.find(t=>t.id===selTA)?.cart||[])
              : [];
  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);

  // Compute discount amount
  const discountAmount = (() => {
    const v = parseFloat(discValue)||0;
    if(!showDisc || v<=0) return 0;
    if(discType==="percent") return Math.round(subtotal * v / 100);
    return Math.min(v, subtotal);
  })();
  const total = subtotal - discountAmount;
  const count = cart.reduce((s,i)=>s+i.qty,0);

  const updTbl=(id,fn)=>setTables(p=>{const n=p.map(t=>t.id===id?fn(t):t);saveTbls(n);return n;});
  const updTA =(id,fn)=>setTakeaways(p=>{const n=p.map(t=>t.id===id?fn(t):t);saveTAs(n);return n;});

  const addItem=item=>{
    const dp=customPrices[item.id]!==undefined?customPrices[item.id]:item.price;
    const priced={...item,price:dp};
    const ex=cart.find(i=>i.id===item.id);
    if(mode==="table"){
      updTbl(selTbl,t=>{
        const c=ex?t.cart.map(i=>i.id===item.id?{...i,qty:i.qty+1}:i):[...t.cart,{...priced,qty:1}];
        return {...t,cart:c,openedAt:t.openedAt||new Date().toISOString()};
      });
    } else {
      updTA(selTA,t=>{
        const c=ex?t.cart.map(i=>i.id===item.id?{...i,qty:i.qty+1}:i):[...t.cart,{...priced,qty:1}];
        return {...t,cart:c};
      });
    }
  };

  const adj=(id,d)=>{
    if(mode==="table") updTbl(selTbl,t=>{const c=t.cart.map(i=>i.id===id?{...i,qty:i.qty+d}:i).filter(i=>i.qty>0);return {...t,cart:c,openedAt:c.length?t.openedAt:null};});
    else updTA(selTA,t=>({...t,cart:t.cart.map(i=>i.id===id?{...i,qty:i.qty+d}:i).filter(i=>i.qty>0)}));
  };

  const clearCart=()=>{
    if(mode==="table") updTbl(selTbl,t=>({...t,cart:[],openedAt:null}));
    else updTA(selTA,t=>({...t,cart:[]}));
  };
  const clearTableFromHome=id=>{const n=tables.map(t=>t.id===id?{...t,cart:[],openedAt:null}:t);setTables(n);saveTbls(n);};
  const removeTAFromHome=id=>{const n=takeaways.filter(t=>t.id!==id);setTakeaways(n);saveTAs(n);};

  const newTakeaway=()=>{
    const id=taCounter,newTA={id,taNum:taLabel(id),cart:[],createdAt:new Date().toISOString()};
    const nl=[...takeaways,newTA];setTakeaways(nl);saveTAs(nl);
    const nc=taCounter+1;setTaCounter(nc);localStorage.setItem("cr_tacounter",String(nc));
    setSelTA(id);setMode("takeaway");setCat(Object.keys(BASE_MENU)[0]);setScreen("pos");
  };

  const finalize=(method,paid)=>{
    const d=new Date(),isTbl=mode==="table";
    const ta=!isTbl?takeaways.find(t=>t.id===selTA):null;
    const order={
      orderNum:counter,type:isTbl?"Dine In":"Takeaway",
      ref:isTbl?"Table "+selTbl:(ta?ta.taNum:"TA"),
      tableId:isTbl?selTbl:null,taId:!isTbl?selTA:null,
      date:d.toLocaleDateString("en-GB"),
      time:d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),
      items:cart.map(i=>({...i})),
      subtotal,
      discountType: discountAmount>0 ? discType : null,
      discountValue: discountAmount>0 ? parseFloat(discValue)||0 : 0,
      discountAmount,
      total,
      paymentMethod:method,amountPaid:paid,
      change:method==="cash"?paid-total:0,
      synced:false,
    };
    const no=[...orders,order],nc=counter+1;
    setOrders(no);setCounter(nc);setLast(order);saveOrd(no,nc);
    if(isTbl) updTbl(selTbl,t=>({...t,cart:[],openedAt:null}));
    else {const nTA=takeaways.filter(t=>t.id!==selTA);setTakeaways(nTA);saveTAs(nTA);}
    // Reset discount
    setDiscValue("");setShowDisc(false);setDiscType("percent");
    setScreen("receipt");
  };

  // ── Till close ────────────────────────────────────────────
  const doCloseTill=()=>{
    if(tcPass!=="2222"){setTcErr("Incorrect password. Access denied.");return;}
    const now=new Date(),tod=now.toLocaleDateString("en-GB");
    const closedAt=now.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});
    const closed={...tillSess,closedAt,status:"closed"};
    const dayOrders=orders.filter(o=>o.date===tod);
    const cashO=dayOrders.filter(o=>o.paymentMethod==="cash");
    const cardO=dayOrders.filter(o=>o.paymentMethod==="card");
    const dineO=dayOrders.filter(o=>o.type==="Dine In");
    const taO  =dayOrders.filter(o=>o.type==="Takeaway");
    const iMap={};dayOrders.forEach(o=>o.items.forEach(i=>{iMap[i.name]=(iMap[i.name]||0)+i.qty;}));
    const gross=dayOrders.reduce((s,o)=>s+o.total,0);
    const cashRv=cashO.reduce((s,o)=>s+o.total,0);
    const report={date:tod,openedAt:closed.openedAt,closedAt,openingBalance:0,
      totalOrders:dayOrders.length,dineInCount:dineO.length,dineInRev:dineO.reduce((s,o)=>s+o.total,0),
      takeawayCount:taO.length,takeawayRev:taO.reduce((s,o)=>s+o.total,0),grossSales:gross,
      cashCount:cashO.length,cashRev:cashRv,cardCount:cardO.length,cardRev:cardO.reduce((s,o)=>s+o.total,0),
      closingCashBalance:cashRv,topItems:Object.entries(iMap).sort((a,b)=>b[1]-a[1]).slice(0,5),
    };
    setTillSess(closed);saveTillSess(closed);
    const nh=[...tillHist,{...closed,report}];setTillHist(nh);saveTillHist(nh);
    setDayEnd(report);setShowDE(true);
    setTcModal(false);setTcPass("");setTcErr("");
  };

  // ── Print helpers ────────────────────────────────────────
  const printWin=html=>{
    const w=window.open("","_blank","width=380,height=600");
    if(!w)return;
    w.document.write(
      "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Chef Rooster Receipt</title>"
      +"<style>*{box-sizing:border-box;margin:0;padding:0}"
      +"body{font-family:'Courier New',monospace;padding:12px;font-size:12px;color:#000;width:300px}"
      +"h1{font-size:15px;font-weight:900;letter-spacing:2px;color:#000;text-align:center}"
      +".sub{font-size:10px;color:#555;text-align:center;margin-top:2px}"
      +".dash{border-top:1px dashed #999;margin:8px 0}"
      +".row{display:flex;justify-content:space-between;padding:3px 0}"
      +".muted{color:#666;font-size:10px}"
      +"@media print{body{width:100%;padding:4px}}</style>"
      +"</head><body>"+html+"</body></html>"
    );
    w.document.close();
    w.focus();
    // auto-print immediately
    setTimeout(()=>{ w.print(); setTimeout(()=>w.close(),2000); },600);
  };

  const buildReceiptHTML=(o)=>{
    const isTbl=o.type==="Dine In";
    const badge=isTbl?"TABLE "+o.tableId+" — DINE IN":"TAKEAWAY — "+o.ref;
    const rows=o.items.map(it=>
      "<div class='row'><span>"+it.name+" x"+it.qty+"</span><span>Rs."+((it.price||0)*it.qty).toLocaleString()+"</span></div>"
    ).join("");
    const discLine= (o.discountAmount>0)
      ? "<div class='row' style='color:green'><span>Discount"+(o.discountType==="percent"?" ("+o.discountValue+"%)":"")+"</span><span>- Rs."+Number(o.discountAmount).toLocaleString()+"</span></div>"
      : "";
    const changeLine=o.paymentMethod==="cash"
      ?"<div class='row'><span class='muted'>Cash Received</span><span>Rs."+Number(o.amountPaid).toLocaleString()+"</span></div>"
       +"<div class='row'><span class='muted'>Change</span><span>Rs."+Number(o.change||0).toLocaleString()+"</span></div>"
      :"";
    return (
      "<div style='text-align:center;padding-bottom:8px;border-bottom:1px dashed #999;margin-bottom:8px'>"
      +"<h1>CHEF ROOSTER</h1>"
      +"<div class='sub'>"+ADDR1+"</div>"
      +"<div class='sub'>Tel: "+TEL+"</div>"
      +"<div style='font-size:10px;font-weight:700;margin-top:5px;border:1px solid #000;padding:2px 8px;display:inline-block'>"+badge+"</div>"
      +"<div style='font-size:10px;color:#666;margin-top:4px'>Order #"+o.orderNum+" | "+o.date+" "+o.time+"</div></div>"
      +rows
      +"<div class='dash'></div>"
      +(o.subtotal!==o.total?"<div class='row'><span class='muted'>Subtotal</span><span>Rs."+Number(o.subtotal||o.total).toLocaleString()+"</span></div>":"")
      +discLine
      +"<div class='row' style='font-size:14px;font-weight:900;border-top:1px solid #000;margin-top:4px;padding-top:6px'><span>TOTAL</span><span>Rs."+Number(o.total).toLocaleString()+"</span></div>"
      +"<div class='dash'></div>"
      +"<div class='row'><span class='muted'>Payment</span><span>"+(o.paymentMethod==="cash"?"Cash":"Card / NFC")+"</span></div>"
      +changeLine
      +"<div style='text-align:center;margin-top:10px;font-size:10px;color:#666;border-top:1px dashed #999;padding-top:8px'>Thank you for visiting!<br>Chef Rooster · Sri Lanka</div>"
    );
  };

  const printOrder=o=>printWin(buildReceiptHTML(o));

  // ── Auto-print when receipt screen loads ─────────────────
  useEffect(()=>{
    if(screen==="receipt"&&lastOrder){
      const t=setTimeout(()=>printOrder(lastOrder),800);
      return ()=>clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[screen,lastOrder]);

  const printDailyReport=()=>{
    const tod=new Date().toLocaleDateString("en-GB");
    const dayO=orders.filter(o=>o.date===tod);
    const cashO=dayO.filter(o=>o.paymentMethod==="cash"),cardO=dayO.filter(o=>o.paymentMethod==="card");
    const dineO=dayO.filter(o=>o.type==="Dine In"),taO=dayO.filter(o=>o.type==="Takeaway");
    const gross=dayO.reduce((s,o)=>s+o.total,0);
    const cashRv=cashO.reduce((s,o)=>s+o.total,0),cardRv=cardO.reduce((s,o)=>s+o.total,0);
    const iMap={};dayO.forEach(o=>o.items.forEach(i=>{iMap[i.name]=(iMap[i.name]||0)+i.qty;}));
    const top5=Object.entries(iMap).sort((a,b)=>b[1]-a[1]).slice(0,5);
    const topRows=top5.map(([nm,qty],i)=>"<div class='row'><span>"+(i+1)+". "+nm+"</span><span>"+qty+" sold</span></div>").join("");
    const orderRows=dayO.slice().reverse().map(o=>"<div class='row'><span><b>#"+o.orderNum+"</b> "+o.ref+" "+o.time+"</span><span>Rs."+o.total.toLocaleString()+"</span></div>").join("");
    printWin(
      "<div style='text-align:center;padding-bottom:8px;border-bottom:1px dashed #999;margin-bottom:10px'>"
      +"<h1>CHEF ROOSTER</h1><div class='sub'>"+ADDR1+"</div><div class='sub'>Tel: "+TEL+"</div>"
      +"<div style='font-size:11px;font-weight:700;margin-top:5px'>DAILY SALES REPORT</div>"
      +"<div style='font-size:10px;color:#666'>"+tod+"</div></div>"
      +"<div class='row'><span>Total Orders</span><span>"+dayO.length+"</span></div>"
      +"<div class='row'><span>Dine-In ("+dineO.length+")</span><span>Rs."+dineO.reduce((s,o)=>s+o.total,0).toLocaleString()+"</span></div>"
      +"<div class='row'><span>Takeaway ("+taO.length+")</span><span>Rs."+taO.reduce((s,o)=>s+o.total,0).toLocaleString()+"</span></div>"
      +"<div class='dash'></div>"
      +"<div class='row'><span>Cash ("+cashO.length+")</span><span>Rs."+cashRv.toLocaleString()+"</span></div>"
      +"<div class='row'><span>Card ("+cardO.length+")</span><span>Rs."+cardRv.toLocaleString()+"</span></div>"
      +"<div class='dash'></div>"
      +"<div class='row' style='font-size:14px;font-weight:900'><span>GROSS SALES</span><span>Rs."+gross.toLocaleString()+"</span></div>"
      +"<div class='dash'></div>"
      +(top5.length?"<div style='font-weight:700;font-size:10px;margin-bottom:4px'>TOP ITEMS</div>"+topRows+"<div class='dash'></div>":"")
      +"<div style='font-weight:700;font-size:10px;margin-bottom:4px'>ALL ORDERS</div>"
      +(orderRows||"<div style='color:#aaa;text-align:center'>No orders today</div>")
      +"<div style='text-align:center;margin-top:10px;font-size:10px;color:#666;border-top:1px dashed #999;padding-top:8px'>"
      +"Printed: "+new Date().toLocaleString("en-GB")+"<br>Chef Rooster</div>"
    );
  };

  // ── Sync ─────────────────────────────────────────────────
  const sync=async()=>{
    if(!sheetUrl){setSyncMsg("⚠️ No endpoint — add it in Settings");return;}
    const q=orders.filter(o=>!o.synced);
    if(!q.length){setSyncMsg("✅ All orders already synced");return;}
    setSyncMsg("⏳ Syncing to Google Sheets…");
    try {
      const r=await fetch(sheetUrl,{method:"POST",redirect:"follow",body:JSON.stringify({orders:q})});
      const text=await r.text();
      let j={success:false};
      try{j=JSON.parse(text);}catch(_){if(r.ok)j={success:true};}
      if(j.success){
        const up=orders.map(o=>({...o,synced:true}));
        setOrders(up);localStorage.setItem("cr_orders",JSON.stringify(up));
        setSyncMsg("✅ "+q.length+" order"+(q.length>1?"s":"")+" synced");
      } else setSyncMsg("❌ Sync failed: "+(j.error||"Check your Apps Script URL"));
    }catch(e){setSyncMsg("❌ Network error: "+e.message);}
  };

  // ── Derived ───────────────────────────────────────────────
  const today    = new Date().toLocaleDateString("en-GB");
  const todayO   = orders.filter(o=>o.date===today);
  const todayRev = todayO.reduce((s,o)=>s+o.total,0);
  const totalRev = orders.reduce((s,o)=>s+o.total,0);
  const dineRev  = todayO.filter(o=>o.type==="Dine In").reduce((s,o)=>s+o.total,0);
  const taRev    = todayO.filter(o=>o.type==="Takeaway").reduce((s,o)=>s+o.total,0);
  const taCount  = todayO.filter(o=>o.type==="Takeaway").length;

  const doLogin=()=>{
    if(lUser.trim()==="Admin"&&lPass==="2222"){setLoggedIn(true);setLErr("");}
    else setLErr("Incorrect username or password. Please try again.");
  };

  const ClearModal=()=>!clrModal?null:(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}>
      <div style={{background:"#fff",borderRadius:22,padding:"34px 28px",maxWidth:320,width:"100%",margin:16,textAlign:"center",boxShadow:"0 24px 60px rgba(0,0,0,0.3)"}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:"#fef2f2",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 16px"}}>🔐</div>
        <div style={{fontWeight:800,fontSize:17,color:"#1a1a1a",marginBottom:6}}>Manager Authorisation</div>
        <div style={{fontSize:12,color:"#999",marginBottom:6}}>Removing order from</div>
        <div style={{fontWeight:700,fontSize:14,color:RED,marginBottom:18,background:"#fff3f5",borderRadius:8,padding:"6px 12px",display:"inline-block"}}>{clrLabel}</div>
        <input type="password" value={clrPass} onChange={e=>{setClrPass(e.target.value);setClrErr("");}} onKeyDown={e=>e.key==="Enter"&&doClr()} placeholder="Enter manager password" autoFocus
          style={{width:"100%",padding:"13px 14px",borderRadius:10,border:"1.5px solid "+(clrErr?"#fca5a5":"#e5e5e5"),fontSize:16,boxSizing:"border-box",outline:"none",textAlign:"center",letterSpacing:6,marginBottom:10}}/>
        {clrErr&&<div style={{color:"#dc2626",fontSize:12,marginBottom:12,background:"#fef2f2",padding:"8px 12px",borderRadius:8}}>{clrErr}</div>}
        <div style={{display:"flex",gap:10,marginTop:4}}>
          <button onClick={closeClearModal} style={{flex:1,padding:13,border:"1.5px solid #e5e5e5",borderRadius:10,background:"#fff",cursor:"pointer",fontWeight:700,fontSize:14,color:"#666"}}>Cancel</button>
          <button onClick={doClr} style={{flex:1,padding:13,border:"none",borderRadius:10,background:RED,cursor:"pointer",fontWeight:800,fontSize:14,color:"#fff"}}>Confirm Clear</button>
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════
  // LOGIN
  // ══════════════════════════════════════════════════════
  if(!loggedIn) return (
    <div style={{minHeight:"100vh",background:"linear-gradient(145deg,#9B0020,#C8102E,#e63950)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',system-ui,sans-serif",padding:20}}>
      <div style={{background:"#fff",borderRadius:24,padding:"40px 36px",width:"100%",maxWidth:380,boxShadow:"0 24px 60px rgba(0,0,0,0.25)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:90,height:90,margin:"0 auto 14px",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Logo size={90} round={true}/>
          </div>
          <div style={{fontSize:22,fontWeight:800,letterSpacing:2,color:RED}}>CHEF ROOSTER</div>
          <div style={{fontSize:11,color:"#aaa",marginTop:3,letterSpacing:1}}>POINT OF SALE SYSTEM</div>
          <div style={{fontSize:11,color:"#bbb",marginTop:4}}>{ADDR1}</div>
        </div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Username</div>
          <input value={lUser} onChange={e=>{setLUser(e.target.value);setLErr("");}} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="Enter username" autoComplete="off"
            style={{width:"100%",padding:"12px 14px",borderRadius:10,border:"1.5px solid "+(lErr?"#fca5a5":"#e5e5e5"),fontSize:14,boxSizing:"border-box",outline:"none"}}/>
        </div>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:700,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Password</div>
          <div style={{position:"relative"}}>
            <input value={lPass} onChange={e=>{setLPass(e.target.value);setLErr("");}} onKeyDown={e=>e.key==="Enter"&&doLogin()} type={showPw?"text":"password"} placeholder="Enter password"
              style={{width:"100%",padding:"12px 44px 12px 14px",borderRadius:10,border:"1.5px solid "+(lErr?"#fca5a5":"#e5e5e5"),fontSize:14,boxSizing:"border-box",outline:"none"}}/>
            <button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#aaa",padding:0}}>
              {showPw?"🙈":"👁"}
            </button>
          </div>
        </div>
        {lErr&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#dc2626",marginBottom:16,textAlign:"center"}}>{lErr}</div>}
        <button onClick={doLogin} style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#C8102E,#9B0020)",border:"none",borderRadius:12,color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer"}}>
          Sign In →
        </button>
        <div style={{textAlign:"center",marginTop:16,paddingTop:14,borderTop:"1px solid #f0f0f0",fontSize:11,color:"#d0d0d0"}}>CHEF ROOSTER · SRI LANKA</div>
      </div>
    </div>
  );

  if(!loaded) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"'Segoe UI',sans-serif",color:"#aaa",fontSize:14}}>Loading…</div>;

  // ══════════════════════════════════════════════════════
  // PAYMENT
  // ══════════════════════════════════════════════════════
  if(screen==="payment"){
    const paid=parseFloat(cashAmt)||0, change=paid-total;
    const ref=mode==="table"?"Table "+selTbl:(takeaways.find(t=>t.id===selTA)?.taNum||"TA");
    const cardFlow=()=>{
      setPayStep("card-proc");
      setTimeout(()=>{setPayStep("card-done");setTimeout(()=>finalize("card",total),1600);},2600);
    };
    return (
      <div style={P.page}>
        <TopBar onBack={()=>setScreen("pos")} right={<span style={{color:"rgba(255,255,255,0.85)",fontSize:13}}>{ref} · Due: <b style={{color:"#fff"}}>{Rs(total)}</b></span>}>
          <span style={{color:"#fff",fontWeight:700,fontSize:16}}>🐓 Payment</span>
        </TopBar>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"16px",gap:14,overflowY:"auto"}}>

          {/* Discount Panel */}
          <div style={{width:"100%",maxWidth:440}}>
            <button onClick={()=>setShowDisc(p=>!p)}
              style={{width:"100%",padding:"11px 16px",background:showDisc?"#fff3f5":"#f9f9f9",border:"1.5px solid "+(showDisc?RED:"#e5e5e5"),borderRadius:12,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontWeight:700,fontSize:13,color:showDisc?RED:"#555"}}>
              <span>🏷️ Apply Discount</span>
              <span style={{fontSize:11,fontWeight:400,color:showDisc?RED:"#aaa"}}>{showDisc?"▲ hide":"▼ expand"}</span>
            </button>
            {showDisc&&(
              <div style={{background:"#fff",border:"1.5px solid "+RED,borderTop:"none",borderRadius:"0 0 12px 12px",padding:"14px 16px"}}>
                <div style={{display:"flex",gap:8,marginBottom:12}}>
                  {[["percent","%"],["fixed","Rs"]].map(([t,lb])=>(
                    <button key={t} onClick={()=>{setDiscType(t);setDiscValue("");}}
                      style={{flex:1,padding:"8px 0",border:"1.5px solid "+(discType===t?RED:"#ddd"),borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13,background:discType===t?RED:"#fff",color:discType===t?"#fff":"#555"}}>
                      {lb} {t==="percent"?"Percentage":"Fixed Amount"}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={discValue}
                  onChange={e=>setDiscValue(e.target.value)}
                  placeholder={discType==="percent"?"Enter % (e.g. 10)":"Enter amount (e.g. 500)"}
                  style={{width:"100%",padding:"11px 14px",borderRadius:10,border:"1.5px solid #ddd",fontSize:15,boxSizing:"border-box",outline:"none",textAlign:"center",fontWeight:700}}
                />
                {discountAmount>0&&(
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:10,padding:"8px 12px",background:"#f0fdf4",borderRadius:8,fontSize:13}}>
                    <span style={{color:"#166534"}}>Discount Applied</span>
                    <span style={{fontWeight:800,color:"#16a34a"}}>- {Rs(discountAmount)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order total summary */}
          {discountAmount>0&&(
            <div style={{width:"100%",maxWidth:440,background:"#fff",borderRadius:12,padding:"12px 16px",border:"1px solid #e5e5e5"}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}>
                <span style={{color:"#888"}}>Subtotal</span>
                <span style={{fontWeight:600}}>{Rs(subtotal)}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}>
                <span style={{color:"#16a34a"}}>Discount {discType==="percent"?"("+discValue+"%)":""}</span>
                <span style={{fontWeight:700,color:"#16a34a"}}>- {Rs(discountAmount)}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:800,borderTop:"1.5px solid #eee",paddingTop:8}}>
                <span>Total to Pay</span>
                <span style={{color:RED}}>{Rs(total)}</span>
              </div>
            </div>
          )}

          {payStep==="choose"&&<>
            <p style={{margin:0,fontWeight:700,fontSize:15,color:"#333"}}>Select payment method</p>
            <div style={{display:"flex",gap:14,width:"100%",maxWidth:440}}>
              {[["💵","Cash","cash"],["💳","Card / NFC","card-tap"]].map(([ic,lb,st])=>(
                <button key={st} onClick={()=>setPayStep(st)} style={{flex:1,padding:"24px 12px",background:"#fff",border:"1.5px solid #e5e5e5",borderRadius:18,cursor:"pointer",textAlign:"center",boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}>
                  <div style={{fontSize:36,marginBottom:10}}>{ic}</div>
                  <div style={{fontSize:15,fontWeight:700,color:"#1a1a1a"}}>{lb}</div>
                </button>
              ))}
            </div>
          </>}
          {payStep==="cash"&&(
            <div style={{...P.card,width:"100%",maxWidth:380,padding:22}}>
              <p style={{margin:"0 0 4px",fontWeight:700,fontSize:14}}>💵 Cash Payment — {ref}</p>
              <p style={{margin:"0 0 14px",fontSize:12,color:"#999"}}>Amount due: <b style={{color:RED}}>{Rs(total)}</b></p>
              <Numpad value={cashAmt} onChange={setCashAmt}/>
              {paid>=total&&paid>0&&(
                <div style={{background:"#f0fdf4",borderRadius:10,padding:"12px 16px",marginTop:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:13,color:"#166534"}}>Change Due</span>
                  <span style={{fontSize:22,fontWeight:800,color:"#16a34a"}}>{Rs(change)}</span>
                </div>
              )}
              <button onClick={()=>paid>=total&&finalize("cash",paid)} disabled={paid<total} style={{...P.btn,width:"100%",marginTop:14,padding:14,opacity:paid<total?0.4:1}}>Complete Payment</button>
              <button onClick={()=>setPayStep("choose")} style={P.ghost}>← Change method</button>
            </div>
          )}
          {payStep==="card-tap"&&(
            <div style={{...P.card,width:"100%",maxWidth:380,padding:36,textAlign:"center"}}>
              <div style={{width:88,height:88,borderRadius:"50%",background:"#eff6ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,margin:"0 auto 18px"}}>💳</div>
              <p style={{fontWeight:700,fontSize:18,margin:"0 0 8px"}}>Tap, Insert or Swipe Card</p>
              <p style={{color:"#999",fontSize:13,margin:"0 0 26px"}}>Present card to the reader when ready</p>
              <button onClick={cardFlow} style={{...P.btn,width:"100%",padding:15,fontSize:15}}>Card Presented ✓</button>
              <button onClick={()=>setPayStep("choose")} style={P.ghost}>← Change method</button>
            </div>
          )}
          {payStep==="card-proc"&&(
            <div style={{...P.card,width:"100%",maxWidth:380,padding:48,textAlign:"center"}}>
              <div style={{fontSize:50,marginBottom:16}}>⏳</div>
              <p style={{fontWeight:700,fontSize:18,margin:"0 0 6px"}}>Processing Payment…</p>
              <p style={{color:"#999",fontSize:13,margin:0}}>Please do not remove card</p>
            </div>
          )}
          {payStep==="card-done"&&(
            <div style={{...P.card,width:"100%",maxWidth:380,padding:48,textAlign:"center"}}>
              <div style={{width:78,height:78,borderRadius:"50%",background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,margin:"0 auto 16px"}}>✅</div>
              <p style={{fontWeight:800,fontSize:20,color:"#16a34a",margin:"0 0 6px"}}>Payment Approved!</p>
              <p style={{color:"#999",fontSize:13,margin:0}}>Printing receipt…</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // RECEIPT
  // ══════════════════════════════════════════════════════
  if(screen==="receipt"&&lastOrder){
    const isTbl=lastOrder.type==="Dine In", ac=isTbl?RED:AMB;
    const badge=isTbl?"TABLE "+lastOrder.tableId+" — DINE IN":"TAKEAWAY — "+lastOrder.ref;
    return (
      <div style={P.page}>
        <style>{`@media print{.np{display:none!important}.pa{box-shadow:none!important}}`}</style>
        <div className="np" style={{...P.topbar,background:"linear-gradient(135deg,"+ac+","+(isTbl?DRED:"#b45309")+")",justifyContent:"space-between"}}>
          <span style={{color:"#fff",fontWeight:700,fontSize:13}}>Receipt — Order #{lastOrder.orderNum} · {lastOrder.ref}</span>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>printOrder(lastOrder)} style={{...P.tbBtn,background:"#fff",color:ac}}>🖨️ Reprint</button>
            <button onClick={()=>{setPayStep("choose");setCashAmt("");setMode(null);setScreen("home");}} style={P.tbBtn}>⬅ Home</button>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",background:"#f4f4f4",display:"flex",justifyContent:"center",padding:20,alignItems:"flex-start"}}>
          <div className="pa" style={{...P.card,maxWidth:420,width:"100%",padding:28}}>
            <div style={{textAlign:"center",borderBottom:"2px dashed #e0e0e0",paddingBottom:18,marginBottom:18}}>
              <div style={{width:72,height:72,margin:"0 auto 10px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Logo size={72} round={true}/>
              </div>
              <div style={{fontSize:20,fontWeight:800,letterSpacing:2,color:RED}}>CHEF ROOSTER</div>
              <div style={{fontSize:11,color:"#aaa",marginTop:4}}>{ADDR1}</div>
              <div style={{fontSize:11,color:"#aaa"}}>Tel: {TEL}</div>
              <div style={{display:"inline-block",background:isTbl?"#fff3f5":"#fffbeb",border:"1px solid "+ac+"40",borderRadius:8,padding:"3px 14px",fontSize:11,color:ac,fontWeight:800,marginTop:8,letterSpacing:1}}>{badge}</div>
              <div style={{fontSize:11,color:"#aaa",marginTop:6}}>Order #{lastOrder.orderNum} · {lastOrder.date} {lastOrder.time}</div>
            </div>
            {lastOrder.items.map((it,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f5f5f5",fontSize:13}}>
                <span style={{color:"#333"}}>{it.name} <span style={{color:"#bbb"}}>x{it.qty}</span></span>
                <span style={{fontWeight:700}}>{Rs((it.price||0)*it.qty)}</span>
              </div>
            ))}
            <div style={{borderTop:"2px dashed #e0e0e0",marginTop:16,paddingTop:16}}>
              {lastOrder.discountAmount>0&&<>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:13}}>
                  <span style={{color:"#888"}}>Subtotal</span>
                  <span style={{fontWeight:600}}>{Rs(lastOrder.subtotal)}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:13}}>
                  <span style={{color:"#16a34a"}}>Discount{lastOrder.discountType==="percent"?" ("+lastOrder.discountValue+"%)":""}</span>
                  <span style={{fontWeight:700,color:"#16a34a"}}>- {Rs(lastOrder.discountAmount)}</span>
                </div>
              </>}
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:13}}>
                <span style={{color:"#888"}}>Payment</span>
                <span style={{fontWeight:600}}>{lastOrder.paymentMethod==="cash"?"Cash":"Card / NFC"}</span>
              </div>
              {lastOrder.paymentMethod==="cash"&&<>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:13}}>
                  <span style={{color:"#888"}}>Cash Received</span><span style={{fontWeight:600}}>{Rs(lastOrder.amountPaid)}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:13}}>
                  <span style={{color:"#888"}}>Change Due</span><span style={{fontWeight:600,color:"#16a34a"}}>{Rs(lastOrder.change)}</span>
                </div>
              </>}
              <div style={{display:"flex",justifyContent:"space-between",marginTop:14,paddingTop:14,borderTop:"2px solid #1a1a1a"}}>
                <span style={{fontWeight:700,fontSize:16}}>TOTAL</span>
                <span style={{fontWeight:800,fontSize:22,color:ac}}>{Rs(lastOrder.total)}</span>
              </div>
            </div>
            <div style={{textAlign:"center",marginTop:20,paddingTop:16,borderTop:"2px dashed #e0e0e0",fontSize:11,color:"#ccc",lineHeight:2.2}}>
              ★ {isTbl?"Enjoy your meal!":"Your order is being prepared!"} ★<br/>
              Chef Rooster · {ADDR1}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // REPORTS — password gate
  // ══════════════════════════════════════════════════════
  if(screen==="reports"&&rptLocked) return (
    <div style={P.page}>
      <TopBar onBack={()=>setScreen("home")}><span style={{color:"#fff",fontWeight:700,fontSize:16}}>🐓 Reports</span></TopBar>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
        <div style={{...P.card,maxWidth:340,width:"100%",padding:36,textAlign:"center"}}>
          <div style={{width:68,height:68,borderRadius:"50%",background:"#fff3f5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 18px"}}>🔒</div>
          <div style={{fontWeight:800,fontSize:18,marginBottom:6}}>Reports Access</div>
          <div style={{fontSize:13,color:"#aaa",marginBottom:22}}>Enter your admin password to view reports</div>
          <input type="password" value={rptPin} onChange={e=>{setRptPin(e.target.value);setRptPinErr("");}} onKeyDown={e=>e.key==="Enter"&&doRptUnlock()} placeholder="Enter password" autoFocus
            style={{width:"100%",padding:"13px 14px",borderRadius:10,border:"1.5px solid "+(rptPinErr?"#fca5a5":"#e5e5e5"),fontSize:16,boxSizing:"border-box",outline:"none",textAlign:"center",letterSpacing:6,marginBottom:10}}/>
          {rptPinErr&&<div style={{color:"#dc2626",fontSize:12,marginBottom:10,background:"#fef2f2",padding:"8px 12px",borderRadius:8}}>{rptPinErr}</div>}
          <button onClick={doRptUnlock} style={{...P.btn,width:"100%",padding:14,fontSize:15}}>Unlock Reports →</button>
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════
  // REPORTS — main
  // ══════════════════════════════════════════════════════
  if(screen==="reports"){
    const itemMap={};
    todayO.forEach(o=>o.items.forEach(i=>{itemMap[i.name]=(itemMap[i.name]||0)+i.qty;}));
    const top5=Object.entries(itemMap).sort((a,b)=>b[1]-a[1]).slice(0,5);
    const unsynced=orders.filter(o=>!o.synced).length;
    const tillOpen=tillSess?.status==="open";
    const liveCash=todayO.filter(o=>o.paymentMethod==="cash").reduce((s,o)=>s+o.total,0);
    return (
      <div style={P.page}>
        {tcModal&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}>
            <div style={{background:"#fff",borderRadius:22,padding:"34px 28px",maxWidth:340,width:"100%",margin:16,textAlign:"center",boxShadow:"0 24px 60px rgba(0,0,0,0.3)"}}>
              <div style={{width:66,height:66,borderRadius:"50%",background:"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 16px"}}>🔒</div>
              <div style={{fontWeight:800,fontSize:17,marginBottom:4}}>Close Till — {tillSess?.date}</div>
              <div style={{fontSize:12,color:"#999",marginBottom:20}}>This will lock the till and generate the Day End Report.</div>
              <input type="password" value={tcPass} onChange={e=>{setTcPass(e.target.value);setTcErr("");}} onKeyDown={e=>e.key==="Enter"&&doCloseTill()} placeholder="Manager password" autoFocus
                style={{width:"100%",padding:"13px 14px",borderRadius:10,border:"1.5px solid "+(tcErr?"#fca5a5":"#e5e5e5"),fontSize:16,boxSizing:"border-box",outline:"none",textAlign:"center",letterSpacing:6,marginBottom:10}}/>
              {tcErr&&<div style={{color:"#dc2626",fontSize:12,marginBottom:12,background:"#fef2f2",padding:"8px 12px",borderRadius:8}}>{tcErr}</div>}
              <div style={{background:"#f0fdf4",borderRadius:10,padding:"10px 14px",marginBottom:16,display:"flex",justifyContent:"space-between",fontSize:13}}>
                <span style={{color:"#166534"}}>Cash in Till</span>
                <span style={{fontWeight:800,color:"#16a34a"}}>{Rs(liveCash)}</span>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>{setTcModal(false);setTcPass("");setTcErr("");}} style={{flex:1,padding:13,border:"1.5px solid #e5e5e5",borderRadius:10,background:"#fff",cursor:"pointer",fontWeight:700,fontSize:14,color:"#666"}}>Cancel</button>
                <button onClick={doCloseTill} style={{flex:1,padding:13,border:"none",borderRadius:10,background:"#d97706",cursor:"pointer",fontWeight:800,fontSize:14,color:"#fff"}}>Close Till</button>
              </div>
            </div>
          </div>
        )}
        {showDE&&dayEnd&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:16,overflowY:"auto"}}>
            <div style={{background:"#fff",borderRadius:20,maxWidth:440,width:"100%",overflow:"hidden",boxShadow:"0 24px 60px rgba(0,0,0,0.3)"}}>
              <style>{`@media print{.no-p{display:none!important}}`}</style>
              <div className="no-p" style={{background:"linear-gradient(135deg,#C8102E,#9B0020)",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:"#fff",fontWeight:700,fontSize:14}}>📋 Day End Report</span>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>printDailyReport()} style={{...P.tbBtn,background:"#fff",color:RED,fontSize:12}}>🖨️ Print</button>
                  <button onClick={()=>setShowDE(false)} style={{...P.tbBtn,fontSize:12}}>✕ Close</button>
                </div>
              </div>
              <div style={{padding:"24px 28px",maxHeight:"75vh",overflowY:"auto"}}>
                <div style={{textAlign:"center",borderBottom:"2px dashed #e0e0e0",paddingBottom:18,marginBottom:18}}>
                  <div style={{width:56,height:56,margin:"0 auto 10px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Logo size={56} round={true}/>
                  </div>
                  <div style={{fontSize:17,fontWeight:800,letterSpacing:2,color:RED}}>CHEF ROOSTER</div>
                  <div style={{fontSize:11,color:"#aaa",marginTop:3}}>{ADDR1} · {TEL}</div>
                  <div style={{fontSize:13,fontWeight:700,color:"#555",marginTop:6,letterSpacing:1}}>DAY END REPORT</div>
                  <div style={{fontSize:12,color:"#aaa",marginTop:4}}>{dayEnd.date}</div>
                </div>
                <div style={{background:"#f9f9f9",borderRadius:10,padding:"12px 16px",marginBottom:16}}>
                  {[["Till Opened",dayEnd.openedAt],["Till Closed",dayEnd.closedAt],["Opening Balance","Rs. 0.00"]].map(([l,v])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:13}}>
                      <span style={{color:"#888"}}>{l}</span><span style={{fontWeight:700}}>{v}</span>
                    </div>
                  ))}
                </div>
                {[["Dine-In Orders ("+dayEnd.dineInCount+")",Rs(dayEnd.dineInRev),RED],["Takeaway Orders ("+dayEnd.takeawayCount+")",Rs(dayEnd.takeawayRev),"#d97706"],["Total Orders ("+dayEnd.totalOrders+")",Rs(dayEnd.grossSales),"#1a1a1a"]].map(([l,v,col])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f5f5f5",fontSize:13}}>
                    <span style={{color:"#555"}}>{l}</span><span style={{fontWeight:700,color:col}}>{v}</span>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",marginBottom:16,borderBottom:"2px solid #1a1a1a"}}>
                  <span style={{fontWeight:800,fontSize:15}}>GROSS SALES</span>
                  <span style={{fontWeight:800,fontSize:18,color:RED}}>{Rs(dayEnd.grossSales)}</span>
                </div>
                {[["💵 Cash ("+dayEnd.cashCount+")",Rs(dayEnd.cashRev)],["💳 Card ("+dayEnd.cardCount+")",Rs(dayEnd.cardRev)]].map(([l,v])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f5f5f5",fontSize:13}}>
                    <span style={{color:"#555"}}>{l}</span><span style={{fontWeight:700}}>{v}</span>
                  </div>
                ))}
                {dayEnd.topItems.length>0&&<>
                  <div style={{fontWeight:800,fontSize:11,color:"#aaa",textTransform:"uppercase",margin:"16px 0 8px"}}>Top Items</div>
                  {dayEnd.topItems.map(([nm,qty],i)=>(
                    <div key={nm} style={{display:"flex",alignItems:"center",padding:"5px 0",borderBottom:"1px solid #f5f5f5",fontSize:13}}>
                      <div style={{width:22,height:22,borderRadius:"50%",background:i===0?"#f59e0b":RED,color:"#fff",fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",marginRight:10,flexShrink:0}}>{i+1}</div>
                      <div style={{flex:1}}>{nm}</div><div style={{color:"#888"}}>x{qty}</div>
                    </div>
                  ))}
                </>}
                <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:12,padding:"14px 18px",marginTop:18,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:11,color:"#166534",textTransform:"uppercase",fontWeight:700}}>Closing Cash Balance</div>
                    <div style={{fontSize:10,color:"#aaa",marginTop:2}}>Opening Rs.0 + Cash Sales</div>
                  </div>
                  <div style={{fontSize:22,fontWeight:800,color:"#16a34a"}}>{Rs(dayEnd.closingCashBalance)}</div>
                </div>
                <div style={{textAlign:"center",marginTop:16,fontSize:11,color:"#ccc",paddingTop:14,borderTop:"2px dashed #e0e0e0",lineHeight:2}}>
                  Closed by: Admin · {dayEnd.closedAt}<br/>Chef Rooster · Sri Lanka
                </div>
              </div>
            </div>
          </div>
        )}
        <TopBar onBack={leaveReports} right={<button onClick={sync} style={{...P.tbBtn,background:"rgba(255,255,255,0.22)"}}>☁️ Sync</button>}>
          <span style={{color:"#fff",fontWeight:700,fontSize:16}}>🐓 Reports</span>
        </TopBar>
        <div style={{display:"flex",background:"#fff",borderBottom:"2px solid #eee",flexShrink:0}}>
          {[["📊","Summary","summary"],["💰","Till","till"]].map(([ic,lb,tab])=>(
            <button key={tab} onClick={()=>setRptTab(tab)}
              style={{flex:1,padding:"12px 0",border:"none",background:"transparent",cursor:"pointer",fontSize:13,fontWeight:700,color:rptTab===tab?RED:"#aaa",borderBottom:"3px solid "+(rptTab===tab?RED:"transparent")}}>
              {ic} {lb}
            </button>
          ))}
        </div>
        {syncMsg&&<div style={{padding:"9px 18px",background:"#fff",borderBottom:"1px solid #eee",fontSize:12,color:syncMsg.startsWith("✅")?"#16a34a":syncMsg.startsWith("❌")?"#dc2626":"#555"}}>{syncMsg}</div>}
        {unsynced>0&&!syncMsg&&<div style={{padding:"8px 18px",background:"#fffbeb",borderBottom:"1px solid #fde68a",fontSize:12,color:"#92400e"}}>⚠️ {unsynced} unsynced order{unsynced>1?"s":""}</div>}
        {rptTab==="summary"&&(
          <div style={{flex:1,overflowY:"auto",padding:14}}>
            <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
              <button onClick={printDailyReport} style={{background:"linear-gradient(135deg,#C8102E,#9B0020)",border:"none",borderRadius:10,color:"#fff",cursor:"pointer",fontWeight:700,fontSize:13,padding:"9px 18px"}}>
                🖨️ Print Daily Report
              </button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10,marginBottom:14}}>
              {[["🧾","Today Orders",todayO.length,false,RED],["💰","Today Revenue",Rs(todayRev),true,RED],["🍽️","Dine-In",Rs(dineRev),false,RED],["🛍️","Takeaway",Rs(taRev),false,AMB],["📦","TA Orders",taCount,false,AMB],["📈","All-Time",Rs(totalRev),true,RED]].map(([ic,lb,val,big,col])=>(
                <div key={lb} style={{background:"#fff",borderRadius:12,padding:12,textAlign:"center",boxShadow:"0 1px 8px rgba(0,0,0,0.06)",borderTop:"3px solid "+col}}>
                  <div style={{fontSize:20,marginBottom:5}}>{ic}</div>
                  <div style={{fontSize:big?13:18,fontWeight:800,color:col,lineHeight:1.2}}>{val}</div>
                  <div style={{fontSize:9,color:"#aaa",marginTop:4,textTransform:"uppercase",letterSpacing:0.3}}>{lb}</div>
                </div>
              ))}
            </div>
            {top5.length>0&&<div style={{...P.card,marginBottom:12}}>
              <p style={{margin:"0 0 12px",fontWeight:700,fontSize:14}}>🏆 Top Items Today</p>
              {top5.map(([nm,qty],i)=>(
                <div key={nm} style={{display:"flex",alignItems:"center",padding:"7px 0",borderBottom:"1px solid #f5f5f5"}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:RED,color:"#fff",fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",marginRight:10,flexShrink:0}}>{i+1}</div>
                  <div style={{flex:1,fontSize:13}}>{nm}</div>
                  <div style={{fontSize:12,color:"#888"}}>{qty} sold</div>
                </div>
              ))}
            </div>}
            <div style={P.card}>
              <p style={{margin:"0 0 12px",fontWeight:700,fontSize:14}}>📋 Recent Orders</p>
              {!orders.length&&<p style={{color:"#ccc",textAlign:"center",padding:"20px 0",margin:0}}>No orders yet</p>}
              {orders.slice().reverse().slice(0,30).map(o=>(
                <div key={o.orderNum} style={{padding:"9px 0",borderBottom:"1px solid #f5f5f5",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      <span style={{fontSize:13,fontWeight:700}}>Order #{o.orderNum}</span>
                      <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:6,background:o.type==="Dine In"?"#fff3f5":"#fffbeb",color:o.type==="Dine In"?RED:AMB}}>{o.type==="Dine In"?"🍽️ Dine In":"🛍️ Takeaway"}</span>
                      <span style={{fontSize:11,color:"#aaa"}}>{o.ref}</span>
                    </div>
                    <div style={{fontSize:11,color:"#aaa"}}>{o.date} {o.time} · {o.items.length} item(s) · {o.paymentMethod}{!o.synced?" · ⚠️":""}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                    <div style={{fontSize:13,fontWeight:700,color:o.type==="Dine In"?RED:AMB}}>{Rs(o.total)}</div>
                    <button onClick={()=>printOrder(o)} title="Print" style={{width:28,height:28,borderRadius:8,border:"1px solid #eee",background:"#f9f9f9",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>🖨️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {rptTab==="till"&&(
          <div style={{flex:1,overflowY:"auto",padding:14}}>
            <div style={{...P.card,marginBottom:14,borderTop:"4px solid "+(tillOpen?"#22c55e":"#94a3b8")}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <div style={{fontSize:11,color:"#aaa",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Current Till</div>
                  <div style={{fontSize:20,fontWeight:800}}>{tillSess?.date||"—"}</div>
                </div>
                <div style={{background:tillOpen?"#f0fdf4":"#f1f5f9",borderRadius:10,padding:"6px 14px",display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:tillOpen?"#22c55e":"#94a3b8"}}/>
                  <span style={{fontSize:13,fontWeight:800,color:tillOpen?"#16a34a":"#64748b"}}>{tillOpen?"OPEN":"CLOSED"}</span>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                {[["🕐 Opened",tillSess?.openedAt||"—"],["🔒 Closed",tillSess?.closedAt||"—"],["💵 Opening","Rs. 0.00"],["💰 Cash in Till",Rs(liveCash)]].map(([l,v])=>(
                  <div key={l} style={{background:"#f9f9f9",borderRadius:10,padding:"10px 12px"}}>
                    <div style={{fontSize:10,color:"#aaa",marginBottom:3}}>{l}</div>
                    <div style={{fontSize:14,fontWeight:700}}>{v}</div>
                  </div>
                ))}
              </div>
              {tillOpen?(
                <button onClick={()=>{setTcPass("");setTcErr("");setTcModal(true);}} style={{width:"100%",padding:15,background:"linear-gradient(135deg,#d97706,#b45309)",border:"none",borderRadius:12,cursor:"pointer",fontSize:15,fontWeight:800,color:"#fff"}}>
                  🔒 Close Till & Generate Day End Report
                </button>
              ):(
                <div>
                  <div style={{background:"#f1f5f9",borderRadius:10,padding:"12px 16px",textAlign:"center",marginBottom:10}}>
                    <div style={{fontSize:13,color:"#64748b",fontWeight:600}}>Till closed at {tillSess?.closedAt}</div>
                    <div style={{fontSize:11,color:"#aaa",marginTop:3}}>New till opens automatically tomorrow</div>
                  </div>
                  {dayEnd&&<button onClick={()=>setShowDE(true)} style={{...P.btn,width:"100%",padding:13,background:"#475569"}}>📋 View Last Day End Report</button>}
                </div>
              )}
            </div>
            {tillHist.length>0&&<div style={P.card}>
              <p style={{margin:"0 0 14px",fontWeight:700,fontSize:14}}>📅 Previous Sessions</p>
              {tillHist.slice().reverse().slice(0,10).map((s,i)=>(
                <div key={i} style={{padding:"10px 0",borderBottom:"1px solid #f5f5f5"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <div>
                      <span style={{fontSize:13,fontWeight:700}}>{s.date}</span>
                      <span style={{marginLeft:8,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:6,background:"#f1f5f9",color:"#64748b"}}>CLOSED</span>
                    </div>
                    <div style={{fontSize:13,fontWeight:800,color:RED}}>{s.report?Rs(s.report.grossSales):"—"}</div>
                  </div>
                  {s.report&&<div style={{fontSize:11,color:"#aaa"}}>{s.report.totalOrders} orders · {s.openedAt} – {s.closedAt} · Cash {Rs(s.report.cashRev)}</div>}
                </div>
              ))}
            </div>}
          </div>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // SETTINGS
  // ══════════════════════════════════════════════════════
  if(screen==="settings"){
    const catItems=BASE_MENU[priceCat]||[];
    return (
      <div style={P.page}>
        <TopBar onBack={()=>setScreen("home")}><span style={{color:"#fff",fontWeight:700,fontSize:16}}>🐓 Settings</span></TopBar>
        <div style={{flex:1,overflowY:"auto",padding:14}}>
          <div style={{...P.card,marginBottom:12}}>
            <p style={{margin:"0 0 4px",fontWeight:700,fontSize:14}}>💲 Admin Price Management</p>
            <p style={{margin:"0 0 14px",fontSize:12,color:"#999"}}>Edit prices. Changes apply to all new orders immediately.</p>
            <div style={{overflowX:"auto",display:"flex",gap:6,marginBottom:14,paddingBottom:4}}>
              {Object.keys(BASE_MENU).map(c=>(
                <button key={c} onClick={()=>setPriceCat(c)}
                  style={{padding:"6px 12px",border:"none",borderRadius:8,cursor:"pointer",whiteSpace:"nowrap",fontSize:11,fontWeight:700,background:priceCat===c?RED:"#f0f0f0",color:priceCat===c?"#fff":"#555",flexShrink:0}}>
                  {CICONS[c]} {c}
                </button>
              ))}
            </div>
            {catItems.map(item=>{
              const cur=priceEdits[item.id]!==undefined?priceEdits[item.id]:(customPrices[item.id]!==undefined?customPrices[item.id]:item.price);
              return (
                <div key={item.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #f5f5f5"}}>
                  <div style={{flex:1,fontSize:13,fontWeight:600}}>{item.name}</div>
                  <div style={{fontSize:10,color:"#bbb",minWidth:60,textAlign:"right"}}>Default: Rs.{item.price}</div>
                  <input type="number" value={cur}
                    onChange={e=>{const v=parseInt(e.target.value)||0;setPriceEdits(p=>({...p,[item.id]:v}));}}
                    style={{width:90,padding:"6px 8px",borderRadius:8,border:"1.5px solid "+(cur!==item.price?"#C8102E":"#ddd"),fontSize:13,fontWeight:700,outline:"none",textAlign:"right",color:cur!==item.price?RED:"#1a1a1a"}}
                  />
                </div>
              );
            })}
            <div style={{display:"flex",gap:8,marginTop:14}}>
              <button onClick={savePrices} style={{...P.btn,flex:1,padding:12,fontSize:13,background:priceSaved?"#16a34a":RED}}>{priceSaved?"✅ Saved!":"💾 Save Prices"}</button>
              <button onClick={()=>{if(window.confirm("Reset ALL prices to default?"))resetPrices();}} style={{...P.btn,padding:12,fontSize:13,background:"#64748b"}}>Reset All</button>
            </div>
          </div>
          <div style={{...P.card,marginBottom:12}}>
            <p style={{margin:"0 0 4px",fontWeight:700,fontSize:14}}>☁️ Google Sheets Sync</p>
            <p style={{margin:"0 0 14px",fontSize:12,color:"#999"}}>Paste your Apps Script Web App URL below</p>
            <input value={sheetUrl} onChange={e=>setSheetUrl(e.target.value)} placeholder="https://script.google.com/macros/s/..."
              style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1.5px solid #ddd",fontSize:13,boxSizing:"border-box",marginBottom:10,outline:"none"}}/>
            <button onClick={()=>{localStorage.setItem("cr_url",sheetUrl);setSyncMsg("✅ URL saved");setScreen("reports");}} style={{...P.btn,width:"100%",padding:13}}>Save & Go to Reports →</button>
          </div>
          <div style={{...P.card,marginBottom:12}}>
            <p style={{margin:"0 0 10px",fontWeight:700,fontSize:14}}>📋 Apps Script Setup</p>
            <div style={{fontSize:12,color:"#555",lineHeight:2,marginBottom:12}}>
              <b>Step 1:</b> Google Sheet → <b>Extensions → Apps Script</b><br/>
              <b>Step 2:</b> Delete existing code, paste the script below<br/>
              <b>Step 3:</b> <b>Deploy → New Deployment → Web App</b><br/>
              <b>Step 4:</b> Execute as: <i>Me</i> · Access: <i>Anyone</i><br/>
              <b>Step 5:</b> Copy Web App URL and paste above<br/>
              <b>Step 6:</b> Click <b>Authorize access</b> and allow
            </div>
            <div style={{background:"#0d1117",borderRadius:10,padding:14,fontSize:10.5,fontFamily:"'Courier New',monospace",color:"#7ee787",lineHeight:1.9,overflowX:"auto",whiteSpace:"pre"}}>{SCRIPT_CODE}</div>
          </div>
          <div style={{...P.card,marginBottom:12}}>
            <p style={{margin:"0 0 10px",fontWeight:700,fontSize:14}}>🖨️ Receipt Printer Setup</p>
            <div style={{fontSize:12,color:"#555",lineHeight:2}}>
              <b>Step 1:</b> Connect your thermal receipt printer to the tablet<br/>
              <b>Step 2:</b> When the print dialog opens after payment, select your printer<br/>
              <b>Step 3:</b> Tick <b>"Remember this choice"</b> or set it as default<br/>
              <b>Step 4:</b> From then on, receipts print automatically without any dialog
            </div>
          </div>
          <div style={{...P.card,marginBottom:12}}>
            <p style={{margin:"0 0 10px",fontWeight:700,fontSize:14}}>🔒 Session</p>
            <button onClick={()=>{setLoggedIn(false);setLUser("");setLPass("");setScreen("home");setHomeTab("tables");}} style={{...P.btn,background:"#475569",width:"100%",padding:13}}>Sign Out</button>
          </div>
          <div style={{...P.card,marginBottom:12}}>
            <p style={{margin:"0 0 10px",fontWeight:700,fontSize:14}}>🔄 Reset</p>
            <button onClick={()=>{if(window.confirm("Reset all tables?")){const f=mkTables();setTables(f);localStorage.setItem("cr_tables",JSON.stringify(f));}}} style={{...P.btn,background:AMB,width:"100%",padding:12,marginBottom:8}}>🪑 Reset All Tables</button>
            <button onClick={()=>{if(window.confirm("Clear all takeaway orders?")){setTakeaways([]);localStorage.setItem("cr_takeaways","[]");}}} style={{...P.btn,background:"#059669",width:"100%",padding:12}}>🛍️ Clear Active Takeaways</button>
          </div>
          <div style={P.card}>
            <p style={{margin:"0 0 10px",fontWeight:700,fontSize:14,color:"#dc2626"}}>⚠️ Danger Zone</p>
            <button onClick={()=>{if(window.confirm("Delete ALL order history?")){setOrders([]);setCounter(1);localStorage.setItem("cr_orders","[]");localStorage.setItem("cr_counter","1");}}} style={{...P.btn,background:"#dc2626",width:"100%",padding:13}}>🗑️ Clear All Order History</button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // POS
  // ══════════════════════════════════════════════════════
  if(screen==="pos"){
    const isTbl=mode==="table", ac=isTbl?RED:AMB;
    const gradBg=isTbl?"linear-gradient(135deg,#C8102E,#9B0020)":"linear-gradient(135deg,#D97706,#b45309)";
    const ref=isTbl?"Table "+selTbl:(takeaways.find(t=>t.id===selTA)?.taNum||"TA");
    const openedAt=isTbl?tables.find(t=>t.id===selTbl)?.openedAt:takeaways.find(t=>t.id===selTA)?.createdAt;
    return (
      <div style={{display:"flex",height:"100vh",background:"#f3f3f3",fontFamily:"'Segoe UI',system-ui,sans-serif",overflow:"hidden"}}>
        <ClearModal/>
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
          <div style={{...P.topbar,background:gradBg}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <button onClick={()=>setScreen("home")} style={{...P.tbBtn,padding:"6px 10px",fontSize:16}}>←</button>
              <div style={{width:36,height:36,borderRadius:8,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.15)",flexShrink:0}}>
                <Logo size={36} round={true}/>
              </div>
              <div>
                <div style={{color:"#fff",fontWeight:800,fontSize:15,letterSpacing:1}}>CHEF ROOSTER</div>
                <div style={{color:"rgba(255,255,255,0.65)",fontSize:10}}>{isTbl?"TABLE "+selTbl+" — DINE IN":"TAKEAWAY — "+ref}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{background:"rgba(255,255,255,0.15)",borderRadius:8,padding:"4px 10px",fontSize:11,color:"#fff",fontWeight:700}}>{isTbl?"🍽️":"🛍️"} {ref}</div>
              <button onClick={goReports} style={P.tbBtn}>📊</button>
            </div>
          </div>
          <div style={{background:"#fff",borderBottom:"1px solid #eee",overflowX:"auto",display:"flex",flexShrink:0,scrollbarWidth:"none"}}>
            {Object.keys(BASE_MENU).map(c=>(
              <button key={c} onClick={()=>setCat(c)}
                style={{padding:"10px 12px",border:"none",background:"transparent",cursor:"pointer",whiteSpace:"nowrap",fontSize:11,fontWeight:700,color:cat===c?ac:"#888",borderBottom:"3px solid "+(cat===c?ac:"transparent")}}>
                {CICONS[c]} {c}
              </button>
            ))}
          </div>
          <div style={{flex:1,overflowY:"auto",padding:10,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(128px,1fr))",gap:8,alignContent:"start"}}>
            {BASE_MENU[cat].map(item=>{
              const inCart=cart.find(i=>i.id===item.id);
              const dp=getPrice(item);
              return (
                <button key={item.id} onClick={()=>addItem(item)}
                  style={{border:"2px solid "+(inCart?ac:"#e8e8e8"),borderRadius:14,padding:"12px 9px 10px",background:"#fff",cursor:"pointer",textAlign:"left",position:"relative",boxShadow:inCart?"0 4px 14px "+ac+"25":"0 1px 5px rgba(0,0,0,0.05)"}}>
                  {inCart&&<div style={{position:"absolute",top:7,right:7,background:ac,color:"#fff",borderRadius:"50%",width:20,height:20,fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{inCart.qty}</div>}
                  <div style={{fontSize:9,color:"#c0c0c0",marginBottom:3,textTransform:"uppercase",letterSpacing:0.5}}>{cat}</div>
                  <div style={{fontSize:11,fontWeight:700,color:"#1a1a1a",lineHeight:1.3,marginBottom:7}}>{item.name}</div>
                  <div style={{fontSize:13,fontWeight:800,color:ac}}>Rs. {dp.toLocaleString()}</div>
                </button>
              );
            })}
          </div>
        </div>
        <div style={{width:265,background:"#fff",borderLeft:"1px solid #ececec",display:"flex",flexDirection:"column",flexShrink:0}}>
          <div style={{padding:"12px 14px 10px",borderBottom:"1px solid #f2f2f2",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontWeight:700,fontSize:14,color:"#1a1a1a"}}>{isTbl?"Table "+selTbl:ref} Order</div>
              <div style={{fontSize:11,color:"#bbb"}}>{count} item{count!==1?"s":""}{openedAt?" · "+elapsed(openedAt):""}</div>
            </div>
            {cart.length>0&&(
              <button onClick={()=>askClear((isTbl?"Table "+selTbl:ref)+" — All Items",clearCart)}
                style={{fontSize:11,color:"#e55",background:"#fff3f3",border:"1px solid #fecaca",borderRadius:7,padding:"4px 9px",cursor:"pointer",fontWeight:700}}>
                ✕ Clear
              </button>
            )}
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"8px 10px"}}>
            {!cart.length?(
              <div style={{textAlign:"center",padding:"36px 14px",color:"#e0e0e0"}}>
                <div style={{fontSize:40}}>{isTbl?"🍽️":"🛍️"}</div>
                <div style={{fontSize:12,marginTop:10}}>Tap items to add to {ref}</div>
              </div>
            ):cart.map(item=>(
              <div key={item.id} style={{display:"flex",alignItems:"center",gap:5,marginBottom:7,padding:"9px 8px",background:"#f9f9f9",borderRadius:11}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#1a1a1a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                  <div style={{fontSize:10,color:"#bbb"}}>Rs. {item.price.toLocaleString()}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                  <button onClick={()=>adj(item.id,-1)} style={{width:24,height:24,borderRadius:"50%",border:"1.5px solid "+ac,background:"#fff",color:ac,cursor:"pointer",fontSize:14,fontWeight:800,lineHeight:1,padding:0,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                  <span style={{fontSize:12,fontWeight:700,minWidth:14,textAlign:"center"}}>{item.qty}</span>
                  <button onClick={()=>adj(item.id,1)} style={{width:24,height:24,borderRadius:"50%",border:"none",background:ac,color:"#fff",cursor:"pointer",fontSize:14,fontWeight:800,lineHeight:1,padding:0,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                </div>
                <div style={{fontSize:11,fontWeight:700,color:ac,minWidth:46,textAlign:"right",flexShrink:0}}>Rs.{(item.price*item.qty).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div style={{padding:13,borderTop:"1px solid #f2f2f2"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:12}}>
              <span style={{fontSize:14,fontWeight:600,color:"#555"}}>Total</span>
              <span style={{fontSize:22,fontWeight:800,color:ac}}>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <button onClick={()=>{setPayStep("choose");setCashAmt("");setDiscValue("");setShowDisc(false);setDiscType("percent");setScreen("payment");}} disabled={!cart.length}
              style={{width:"100%",padding:14,background:cart.length?gradBg:"#e8e8e8",border:"none",borderRadius:12,cursor:cart.length?"pointer":"not-allowed",fontSize:14,fontWeight:800,color:"#fff",letterSpacing:0.4}}>
              💳 Proceed to Pay
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // HOME
  // ══════════════════════════════════════════════════════
  const occupiedTbls=tables.filter(t=>t.cart.length>0).length;
  const liveTableRev=tables.reduce((s,t)=>s+t.cart.reduce((ss,i)=>ss+i.price*i.qty,0),0);
  const liveTARev=takeaways.reduce((s,t)=>s+t.cart.reduce((ss,i)=>ss+i.price*i.qty,0),0);
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:"#f3f3f3",fontFamily:"'Segoe UI',system-ui,sans-serif",overflow:"hidden"}}>
      <ClearModal/>
      <div style={P.topbar}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:44,height:44,borderRadius:12,overflow:"hidden",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Logo size={44} round={true}/>
          </div>
          <div>
            <div style={{color:"#fff",fontWeight:800,fontSize:17,letterSpacing:2}}>CHEF ROOSTER</div>
            <div style={{color:"rgba(255,255,255,0.5)",fontSize:9,letterSpacing:0.5}}>{ADDR1}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{background:"rgba(255,255,255,0.12)",borderRadius:8,padding:"4px 10px",textAlign:"center"}}>
            <div style={{color:"rgba(255,255,255,0.6)",fontSize:9}}>LIVE</div>
            <div style={{color:"#fff",fontWeight:800,fontSize:13}}>Rs.{(liveTableRev+liveTARev).toLocaleString()}</div>
          </div>
          <button onClick={goReports} style={P.tbBtn}>📊 Reports</button>
          <button onClick={()=>setScreen("settings")} style={P.tbBtn}>⚙️</button>
        </div>
      </div>
      <div style={{display:"flex",background:"#fff",borderBottom:"2px solid #eee",flexShrink:0}}>
        {[["🍽️","Dine In","tables"],["🛍️","Takeaway","takeaway"]].map(([ic,lb,tab])=>(
          <button key={tab} onClick={()=>setHomeTab(tab)}
            style={{flex:1,padding:"13px 0",border:"none",background:"transparent",cursor:"pointer",fontSize:14,fontWeight:700,
              color:homeTab===tab?(tab==="tables"?RED:AMB):"#aaa",
              borderBottom:"3px solid "+(homeTab===tab?(tab==="tables"?RED:AMB):"transparent"),transition:"all .15s"}}>
            {ic} {lb}
            {tab==="tables"&&occupiedTbls>0&&<span style={{marginLeft:8,background:RED,color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:800}}>{occupiedTbls}</span>}
            {tab==="takeaway"&&takeaways.length>0&&<span style={{marginLeft:8,background:AMB,color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:800}}>{takeaways.length}</span>}
          </button>
        ))}
      </div>
      {homeTab==="tables"&&<>
        <div style={{display:"flex",gap:16,padding:"8px 16px",background:"#fff",borderBottom:"1px solid #eee",flexShrink:0,alignItems:"center"}}>
          {[["Available",NUM_TABLES-occupiedTbls,"#16a34a"],["Occupied",occupiedTbls,RED]].map(([lb,n,col])=>(
            <div key={lb} style={{display:"flex",alignItems:"center",gap:5,fontSize:12}}>
              <div style={{width:9,height:9,borderRadius:"50%",background:col}}/><span style={{color:"#777"}}>{lb}:</span><span style={{fontWeight:700,color:col}}>{n}</span>
            </div>
          ))}
          {liveTableRev>0&&<div style={{marginLeft:"auto",fontSize:12,color:RED,fontWeight:700}}>Live: Rs. {liveTableRev.toLocaleString()}</div>}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:12,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))",gap:10,alignContent:"start"}}>
          {tables.map(t=>{
            const occ=t.cart.length>0, tTot=t.cart.reduce((s,i)=>s+i.price*i.qty,0), tCnt=t.cart.reduce((s,i)=>s+i.qty,0), time=elapsed(t.openedAt);
            return (
              <div key={t.id} style={{background:"#fff",border:"2px solid "+(occ?RED:"#e5e5e5"),borderRadius:16,overflow:"hidden",boxShadow:occ?"0 4px 16px "+RED+"20":"0 1px 5px rgba(0,0,0,0.05)"}}>
                <button onClick={()=>{setSelTbl(t.id);setMode("table");setCat(Object.keys(BASE_MENU)[0]);setScreen("pos");}}
                  style={{width:"100%",padding:"14px 13px 10px",cursor:"pointer",textAlign:"left",background:"transparent",border:"none"}}>
                  <div style={{position:"relative"}}>
                    <div style={{position:"absolute",top:0,right:0,width:9,height:9,borderRadius:"50%",background:occ?RED:"#22c55e"}}/>
                    <div style={{fontSize:10,color:"#c0c0c0",textTransform:"uppercase",letterSpacing:1,marginBottom:4,fontWeight:600}}>Table</div>
                    <div style={{fontSize:32,fontWeight:900,color:occ?RED:"#d5d5d5",lineHeight:1,marginBottom:7,letterSpacing:-1}}>{t.id}</div>
                    {occ?<div>
                      <div style={{background:RED+"10",borderRadius:7,padding:"6px 8px",marginBottom:4}}>
                        <div style={{fontSize:13,fontWeight:800,color:RED}}>Rs. {tTot.toLocaleString()}</div>
                        <div style={{fontSize:10,color:"#e07070"}}>{tCnt} item{tCnt!==1?"s":""}</div>
                      </div>
                      {time&&<div style={{fontSize:10,color:"#bbb"}}>⏱ {time}</div>}
                    </div>:<div style={{fontSize:11,color:"#bbb",fontWeight:500}}>Available</div>}
                  </div>
                </button>
                {occ&&<button onClick={()=>askClear("Table "+t.id,()=>clearTableFromHome(t.id))}
                  style={{width:"100%",padding:"7px 0",background:"#fff3f3",border:"none",borderTop:"1px solid #fecaca",cursor:"pointer",fontSize:11,fontWeight:700,color:"#e55",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                  🔐 Remove Order
                </button>}
              </div>
            );
          })}
        </div>
      </>}
      {homeTab==="takeaway"&&<>
        <div style={{padding:"12px 14px",background:"#fff",borderBottom:"1px solid #eee",flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:12,color:"#888"}}>{takeaways.length} active order{takeaways.length!==1?"s":""}{liveTARev>0?" · Live: Rs."+liveTARev.toLocaleString():""}</div>
          <button onClick={newTakeaway} style={{background:"linear-gradient(135deg,#D97706,#b45309)",border:"none",borderRadius:10,color:"#fff",cursor:"pointer",fontWeight:700,fontSize:13,padding:"9px 16px"}}>
            + New Takeaway
          </button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:12}}>
          {!takeaways.length&&(
            <div style={{textAlign:"center",padding:"60px 20px",color:"#ddd"}}>
              <div style={{fontSize:56}}>🛍️</div>
              <div style={{fontSize:14,marginTop:14,fontWeight:600,color:"#ccc"}}>No active takeaway orders</div>
              <button onClick={newTakeaway} style={{marginTop:20,background:"linear-gradient(135deg,#D97706,#b45309)",border:"none",borderRadius:12,color:"#fff",cursor:"pointer",fontWeight:700,fontSize:14,padding:"13px 28px"}}>+ New Takeaway Order</button>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:10,alignContent:"start"}}>
            {takeaways.map(ta=>{
              const tTot=ta.cart.reduce((s,i)=>s+i.price*i.qty,0), tCnt=ta.cart.reduce((s,i)=>s+i.qty,0), time=elapsed(ta.createdAt);
              return (
                <div key={ta.id} style={{background:"#fff",border:"2px solid "+AMB,borderRadius:16,overflow:"hidden",boxShadow:"0 4px 18px "+AMB+"20"}}>
                  <button onClick={()=>{setSelTA(ta.id);setMode("takeaway");setCat(Object.keys(BASE_MENU)[0]);setScreen("pos");}}
                    style={{width:"100%",padding:"16px 14px 12px",cursor:"pointer",textAlign:"left",background:"transparent",border:"none"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div>
                        <div style={{fontSize:10,color:"#d97706",textTransform:"uppercase",letterSpacing:1,fontWeight:700,marginBottom:3}}>Takeaway</div>
                        <div style={{fontSize:22,fontWeight:900,color:AMB}}>{ta.taNum}</div>
                      </div>
                      <div style={{background:AMB+"18",borderRadius:8,padding:"4px 8px",textAlign:"right"}}>
                        <div style={{fontSize:13,fontWeight:800,color:AMB}}>Rs. {tTot.toLocaleString()}</div>
                        <div style={{fontSize:10,color:"#d97706"}}>{tCnt} item{tCnt!==1?"s":""}</div>
                      </div>
                    </div>
                    <div style={{fontSize:10,color:"#bbb"}}>⏱ {time}</div>
                  </button>
                  <button onClick={()=>askClear("Takeaway "+ta.taNum,()=>removeTAFromHome(ta.id))}
                    style={{width:"100%",padding:"8px 0",background:"#fff8ee",border:"none",borderTop:"1px solid #fde68a",cursor:"pointer",fontSize:11,fontWeight:700,color:"#b45309",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                    🔐 Cancel Order
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </>}
    </div>
  );
}