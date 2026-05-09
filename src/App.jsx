/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";

const RED   = "#C8102E";
const DRED  = "#9B0020";
const AMB   = "#D97706";
const ADDR1 = "56 Abdul Hameed Street, Colombo 01200";
const TEL   = "+94 77 303 7029";
const QZ_PRINTER = "XPrinter XP-80T"; // match exactly with Control Panel name

const BASE_MENU = {
  "Beverages":    [{id:"bv1",name:"Coca Cola",price:200},{id:"bv2",name:"Sprite",price:200},{id:"bv3",name:"Fanta",price:200},{id:"bv4",name:"Water Bottle",price:100},{id:"bv5",name:"Orange Juice",price:350},{id:"bv6",name:"Mango Juice",price:350},{id:"bv7",name:"Tea",price:150},{id:"bv8",name:"Coffee",price:200},{id:"bv9",name:"Ginger Beer",price:250},{id:"bv10",name:"Milk Shake",price:400}],
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
const Rs       = function(n){ return "Rs. " + Number(n).toLocaleString(); };
const mkTables = function(){ return Array.from({length:NUM_TABLES}, function(_,i){ return {id:i+1,cart:[],openedAt:null}; }); };
const taLabel  = function(n){ return "TA-" + String(n).padStart(3,"0"); };
const elapsed  = function(iso){
  if(!iso) return null;
  var m = Math.floor((Date.now()-new Date(iso).getTime())/60000);
  return m<60 ? m+"m" : Math.floor(m/60)+"h "+(m%60)+"m";
};

// ── Logo ──────────────────────────────────────────────────
function Logo(props) {
  var size  = props.size  || 36;
  var round = props.round || false;
  var err   = useState(false);
  var setErr = err[1];
  var hasErr = err[0];
  if(hasErr) return <span style={{fontSize:size*0.8,lineHeight:1}}>🐓</span>;
  return (
    <img src="/logo.png" alt="Chef Rooster" onError={function(){setErr(true);}}
      style={{width:size,height:size,objectFit:"contain",borderRadius:round?"50%":"8px",display:"block"}}/>
  );
}

// ── Styles ────────────────────────────────────────────────
var P = {
  page:   {display:"flex",flexDirection:"column",height:"100vh",background:"#f4f4f4",fontFamily:"'Segoe UI',system-ui,sans-serif",overflow:"hidden"},
  topbar: {background:"linear-gradient(135deg,#C8102E,#9B0020)",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0},
  card:   {background:"#fff",borderRadius:14,padding:20,boxShadow:"0 2px 14px rgba(0,0,0,0.07)"},
  btn:    {background:"#C8102E",border:"none",borderRadius:10,color:"#fff",cursor:"pointer",fontWeight:700,fontSize:14,padding:"12px 20px"},
  ghost:  {background:"none",border:"none",color:"#aaa",cursor:"pointer",fontSize:13,marginTop:10,width:"100%",textAlign:"center",display:"block"},
  tbBtn:  {background:"rgba(255,255,255,0.18)",border:"none",borderRadius:9,padding:"6px 12px",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600},
};

function TopBar(props) {
  return (
    <div style={P.topbar}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={props.onBack} style={{...P.tbBtn,padding:"6px 10px",fontSize:16}}>←</button>
        {props.children}
      </div>
      {props.right}
    </div>
  );
}

function Numpad(props) {
  var keys = ["1","2","3","4","5","6","7","8","9",".","0","⌫"];
  function tap(k) {
    if(k==="⌫"){ props.onChange(function(p){ return p.slice(0,-1); }); return; }
    if(k==="." && props.value.includes(".")) return;
    props.onChange(function(p){ return p+k; });
  }
  return (
    <div>
      <div style={{background:"#f5f5f5",borderRadius:10,padding:"11px 14px",fontSize:26,fontWeight:700,textAlign:"right",minHeight:52,marginBottom:10}}>
        {props.value || <span style={{color:"#d0d0d0"}}>0</span>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7}}>
        {keys.map(function(k){
          return (
            <button key={k} onClick={function(){tap(k);}}
              style={{padding:"14px 0",borderRadius:9,border:"1px solid #eee",background:k==="⌫"?"#fee2e2":"#fff",cursor:"pointer",fontSize:17,fontWeight:700,color:k==="⌫"?"#dc2626":"#1a1a1a"}}>
              {k}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── ESC/POS builder for XPrinter XP-80T ──────────────────
function buildESCPOS(o) {
  var E = '\x1B', G = '\x1D', N = '\x0A';
  var INIT   = E+'@';
  var BOLD   = E+'E\x01';
  var UNBOLD = E+'E\x00';
  var CENTER = E+'a\x01';
  var LEFT   = E+'a\x00';
  var CUT    = G+'V\x41\x03';
  var W      = 42;
  var DASH   = new Array(W+1).join('-');

  function row(left, right) {
    var gap = W - left.length - right.length;
    if(gap < 1) gap = 1;
    return left + new Array(gap+1).join(' ') + right;
  }

  function wrapLine(text, max) {
    if(text.length <= max) return [text];
    var result = [];
    var words  = text.split(' ');
    var cur    = '';
    for(var i=0; i<words.length; i++) {
      var w = words[i];
      var next = cur ? cur+' '+w : w;
      if(next.length <= max) {
        cur = next;
      } else {
        if(cur) result.push(cur);
        cur = w;
      }
    }
    if(cur) result.push(cur);
    return result;
  }

  var badge = o.type === "Dine In"
    ? 'TABLE ' + o.tableId + ' - DINE IN'
    : 'TAKEAWAY - ' + o.ref;

  var r = INIT;
  r += CENTER;
  r += BOLD + 'CHEF ROOSTER' + UNBOLD + N;
  r += '56 Abdul Hameed St, Colombo 01200' + N;
  r += 'Tel: +94 77 303 7029' + N + N;
  r += BOLD + badge + UNBOLD + N;
  r += 'Order #' + o.orderNum + ' | ' + o.date + ' ' + o.time + N;
  r += LEFT + DASH + N;
  r += BOLD + row('ITEM','AMOUNT') + UNBOLD + N;
  r += DASH + N;

  for(var i=0; i<o.items.length; i++) {
    var it    = o.items[i];
    var price = 'Rs.' + ((it.price||0)*it.qty).toLocaleString();
    var name  = it.name + ' x' + it.qty;
    var lines = wrapLine(name, W - price.length - 1);
    for(var j=0; j<lines.length; j++) {
      r += (j===0 ? row(lines[j], price) : lines[j]) + N;
    }
  }

  r += DASH + N;

  if(o.discountAmount > 0) {
    var dlabel = 'Discount' + (o.discountType==="percent" ? ' ('+o.discountValue+'%)' : '');
    r += row('Subtotal', 'Rs.' + Number(o.subtotal||o.total).toLocaleString()) + N;
    r += row(dlabel, '-Rs.' + Number(o.discountAmount).toLocaleString()) + N;
    r += DASH + N;
  }

  r += BOLD + row('TOTAL', 'Rs.' + Number(o.total).toLocaleString()) + UNBOLD + N;
  r += DASH + N;
  r += row('Payment', o.paymentMethod==="cash" ? 'Cash' : 'Card / NFC') + N;
  r += DASH + N + N;
  r += CENTER + 'Thank you for visiting Chef Rooster!' + N;
  r += N + N + N + CUT;
  return r;
}

// ── HTML receipt (browser fallback) ──────────────────────
function buildReceiptHTML(o) {
  var isTbl = o.type === "Dine In";
  var badge = isTbl ? "TABLE "+o.tableId+" — DINE IN" : "TAKEAWAY — "+o.ref;
  var rows = o.items.map(function(it){
    return "<tr>"
      +"<td style='padding:3px 4px 3px 0;font-size:12px'>"+it.name+" x"+it.qty+"</td>"
      +"<td style='padding:3px 0;font-size:12px;text-align:right;white-space:nowrap'>Rs."+((it.price||0)*it.qty).toLocaleString()+"</td>"
      +"</tr>";
  }).join("");
  var discLine = (o.discountAmount>0)
    ? "<tr><td style='font-size:11px;color:#555'>Discount"+(o.discountType==="percent"?" ("+o.discountValue+"%)":"")+"</td>"
      +"<td style='font-size:11px;text-align:right;color:#555'>-Rs."+Number(o.discountAmount).toLocaleString()+"</td></tr>"
    : "";
  var subtotalSection = (o.discountAmount>0)
    ? "<table style='width:100%;border-collapse:collapse;margin-top:4px'>"
      +"<tr><td style='font-size:11px;padding:3px 0'>Subtotal</td><td style='font-size:11px;text-align:right'>Rs."+Number(o.subtotal||o.total).toLocaleString()+"</td></tr>"
      +discLine+"</table>"
    : "";
  return "<div style='text-align:center;padding-bottom:8px;border-bottom:1px dashed #000;margin-bottom:8px'>"
    +"<div style='font-size:16px;font-weight:900;letter-spacing:2px'>CHEF ROOSTER</div>"
    +"<div style='font-size:10px;margin-top:2px'>"+ADDR1+"</div>"
    +"<div style='font-size:10px'>Tel: "+TEL+"</div>"
    +"<div style='font-size:10px;font-weight:700;margin-top:4px'>"+badge+"</div>"
    +"<div style='font-size:10px;color:#555;margin-top:2px'>Order #"+o.orderNum+" | "+o.date+" "+o.time+"</div>"
    +"</div>"
    +"<table style='width:100%;border-collapse:collapse'>"
    +"<thead><tr>"
    +"<th style='font-size:10px;text-align:left;padding:2px 4px 4px 0;border-bottom:1px dashed #000'>ITEM</th>"
    +"<th style='font-size:10px;text-align:right;padding:2px 0 4px;border-bottom:1px dashed #000'>AMOUNT</th>"
    +"</tr></thead><tbody>"+rows+"</tbody></table>"
    +subtotalSection
    +"<div style='border-top:1px dashed #000;margin-top:6px;padding-top:6px;display:flex;justify-content:space-between'>"
    +"<span style='font-size:14px;font-weight:900'>TOTAL</span>"
    +"<span style='font-size:14px;font-weight:900'>Rs."+Number(o.total).toLocaleString()+"</span></div>"
    +"<div style='border-top:1px dashed #000;margin-top:6px;padding-top:6px;display:flex;justify-content:space-between'>"
    +"<span style='font-size:11px'>Payment</span>"
    +"<span style='font-size:11px;font-weight:700'>"+(o.paymentMethod==="cash"?"Cash":"Card / NFC")+"</span></div>"
    +"<div style='text-align:center;margin-top:10px;padding-top:6px;border-top:1px dashed #000;font-size:10px'>"
    +"Thank you for visiting Chef Rooster!</div>";
}

// ── Main App ──────────────────────────────────────────────
export default function App() {

  var s0 = useState("home");       var screen    = s0[0]; var setScreen    = s0[1];
  var s1 = useState("tables");     var homeTab   = s1[0]; var setHomeTab   = s1[1];
  var s2 = useState(mkTables());   var tables    = s2[0]; var setTables    = s2[1];
  var s3 = useState([]);           var takeaways = s3[0]; var setTakeaways = s3[1];
  var s4 = useState(1);            var taCounter = s4[0]; var setTaCounter = s4[1];
  var s5 = useState(null);         var selTbl    = s5[0]; var setSelTbl    = s5[1];
  var s6 = useState(null);         var selTA     = s6[0]; var setSelTA     = s6[1];
  var s7 = useState(null);         var mode      = s7[0]; var setMode      = s7[1];
  var s8 = useState(Object.keys(BASE_MENU)[0]); var cat = s8[0]; var setCat = s8[1];
  var s9 = useState([]);           var orders    = s9[0]; var setOrders    = s9[1];
  var s10= useState(1);            var counter   = s10[0];var setCounter   = s10[1];
  var s11= useState(null);         var lastOrder = s11[0];var setLast      = s11[1];
  var s12= useState("choose");     var payStep   = s12[0];var setPayStep   = s12[1];
  var s13= useState("");           var cashAmt   = s13[0];var setCashAmt   = s13[1];
  var s14= useState("");           var sheetUrl  = s14[0];var setSheetUrl  = s14[1];
  var s15= useState("");           var syncMsg   = s15[0];var setSyncMsg   = s15[1];
  var s16= useState(false);        var loaded    = s16[0];var setLoaded    = s16[1];
  var s17= useState("summary");    var rptTab    = s17[0];var setRptTab    = s17[1];
  var s18= useState(null);         var tillSess  = s18[0];var setTillSess  = s18[1];
  var s19= useState([]);           var tillHist  = s19[0];var setTillHist  = s19[1];
  var s20= useState(null);         var dayEnd    = s20[0];var setDayEnd    = s20[1];
  var s21= useState(false);        var showDE    = s21[0];var setShowDE    = s21[1];
  var s22= useState(false);        var tcModal   = s22[0];var setTcModal   = s22[1];
  var s23= useState("");           var tcPass    = s23[0];var setTcPass    = s23[1];
  var s24= useState("");           var tcErr     = s24[0];var setTcErr     = s24[1];
  var s25= useState(false);        var loggedIn  = s25[0];var setLoggedIn  = s25[1];
  var s26= useState("");           var lUser     = s26[0];var setLUser     = s26[1];
  var s27= useState("");           var lPass     = s27[0];var setLPass     = s27[1];
  var s28= useState("");           var lErr      = s28[0];var setLErr      = s28[1];
  var s29= useState(false);        var showPw    = s29[0];var setShowPw    = s29[1];
  var s30= useState(false);        var clrModal  = s30[0];var setClrModal  = s30[1];
  var s31= useState("");           var clrPass   = s31[0];var setClrPass   = s31[1];
  var s32= useState("");           var clrErr    = s32[0];var setClrErr    = s32[1];
  var s33= useState(null);         var clrFn     = s33[0];var setClrFn     = s33[1];
  var s34= useState("");           var clrLabel  = s34[0];var setClrLabel  = s34[1];
  var s35= useState(true);         var rptLocked = s35[0];var setRptLocked = s35[1];
  var s36= useState("");           var rptPin    = s36[0];var setRptPin    = s36[1];
  var s37= useState("");           var rptPinErr = s37[0];var setRptPinErr = s37[1];
  var s38= useState({});           var customPrices=s38[0];var setCustomPrices=s38[1];
  var s39= useState({});           var priceEdits=s39[0];var setPriceEdits=s39[1];
  var s40= useState(Object.keys(BASE_MENU)[0]); var priceCat=s40[0];var setPriceCat=s40[1];
  var s41= useState(false);        var priceSaved=s41[0];var setPriceSaved=s41[1];
  var s42= useState(true);         var menuLocked=s42[0];var setMenuLocked=s42[1];
  var s43= useState("");           var menuPin   =s43[0];var setMenuPin   =s43[1];
  var s44= useState("");           var menuPinErr=s44[0];var setMenuPinErr=s44[1];
  var s45= useState({});           var customItems=s45[0];var setCustomItems=s45[1];
  var s46= useState(Object.keys(BASE_MENU)[0]); var addItemCat=s46[0];var setAddItemCat=s46[1];
  var s47= useState("");           var newItemName=s47[0];var setNewItemName=s47[1];
  var s48= useState("");           var newItemPrice=s48[0];var setNewItemPrice=s48[1];
  var s49= useState("percent");    var discType  =s49[0];var setDiscType  =s49[1];
  var s50= useState("");           var discValue =s50[0];var setDiscValue =s50[1];
  var s51= useState(false);        var showDisc  =s51[0];var setShowDisc  =s51[1];
  // Custom categories
  var s52= useState([]);           var customCats  =s52[0];var setCustomCats  =s52[1];
  var s53= useState("");           var newCatName  =s53[0];var setNewCatName  =s53[1];
  var s54= useState("🍽️");        var newCatIcon  =s54[0];var setNewCatIcon  =s54[1];

  // ── Load ─────────────────────────────────────────────────
  useEffect(function(){
    var t=localStorage.getItem("cr_tables");
    if(t){var p=JSON.parse(t);if(Array.isArray(p)&&p.length===NUM_TABLES)setTables(p);}
    var ta=localStorage.getItem("cr_takeaways"); if(ta)setTakeaways(JSON.parse(ta));
    var tc=localStorage.getItem("cr_tacounter"); if(tc)setTaCounter(+tc);
    var o =localStorage.getItem("cr_orders");    if(o) setOrders(JSON.parse(o));
    var c =localStorage.getItem("cr_counter");   if(c) setCounter(+c);
    var u =localStorage.getItem("cr_url");       if(u) setSheetUrl(u);
    var th=localStorage.getItem("cr_till_hist"); if(th)setTillHist(JSON.parse(th));
    var cp=localStorage.getItem("cr_prices");    if(cp){var pp=JSON.parse(cp);setCustomPrices(pp);setPriceEdits(pp);}
    var ci=localStorage.getItem("cr_custom_items"); if(ci)setCustomItems(JSON.parse(ci));
    var cc=localStorage.getItem("cr_custom_cats");  if(cc)setCustomCats(JSON.parse(cc));
    var tod=new Date().toLocaleDateString("en-GB");
    var ts=localStorage.getItem("cr_till_sess");
    function openNew(){
      var s={date:tod,openedAt:new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),status:"open",closedAt:null,openingBalance:0};
      setTillSess(s); localStorage.setItem("cr_till_sess",JSON.stringify(s));
    }
    if(ts){var sv=JSON.parse(ts);if(sv.date===tod)setTillSess(sv);else openNew();}
    else openNew();
    setLoaded(true);
  }, []);

  // ── Save helpers ─────────────────────────────────────────
  function saveTbls(t)  { localStorage.setItem("cr_tables",    JSON.stringify(t)); }
  function saveTAs(ta)  { localStorage.setItem("cr_takeaways", JSON.stringify(ta)); }
  function saveOrd(o,c) { localStorage.setItem("cr_orders",JSON.stringify(o)); localStorage.setItem("cr_counter",String(c)); }
  function saveTillSess(s){ localStorage.setItem("cr_till_sess",JSON.stringify(s)); }
  function saveTillHist(h){ localStorage.setItem("cr_till_hist",JSON.stringify(h)); }

  // ── Merged menu ──────────────────────────────────────────
  var MENU = {};
  Object.keys(BASE_MENU).forEach(function(cat){
    MENU[cat] = BASE_MENU[cat].concat(customItems[cat]||[]);
  });

  // ── Price helpers ─────────────────────────────────────────
  function getPrice(item){ return customPrices[item.id]!==undefined ? customPrices[item.id] : item.price; }

  function savePrices(){
    var merged = Object.assign({}, customPrices, priceEdits);
    setCustomPrices(merged); localStorage.setItem("cr_prices",JSON.stringify(merged));
    setPriceSaved(true); setTimeout(function(){setPriceSaved(false);},2000);
  }
  function resetPrices(){ setCustomPrices({}); setPriceEdits({}); localStorage.removeItem("cr_prices"); }

  // ── Menu admin lock ──────────────────────────────────────
  function doMenuUnlock(){
    if(menuPin==="1998"){setMenuLocked(false);setMenuPin("");setMenuPinErr("");}
    else setMenuPinErr("Incorrect password.");
  }

  // ── Custom item helpers ───────────────────────────────────
  function saveCustomItems(ci){ setCustomItems(ci); localStorage.setItem("cr_custom_items",JSON.stringify(ci)); }

  function addNewItem(){
    if(!newItemName.trim()||!newItemPrice) return;
    var id="ci_"+Date.now();
    var item={id:id,name:newItemName.trim(),price:parseInt(newItemPrice)||0,custom:true};
    var updated = Object.assign({},customItems);
    updated[addItemCat] = (customItems[addItemCat]||[]).concat([item]);
    saveCustomItems(updated); setNewItemName(""); setNewItemPrice("");
  }

  function deleteCustomItem(c,id){
    var updated = Object.assign({},customItems);
    updated[c] = (customItems[c]||[]).filter(function(i){return i.id!==id;});
    saveCustomItems(updated);
  }

  // ── Reports lock ─────────────────────────────────────────
  function doRptUnlock(){
    if(rptPin==="2222"){setRptLocked(false);setRptPin("");setRptPinErr("");}
    else setRptPinErr("Incorrect password.");
  }
  function goReports(){ setSyncMsg(""); setRptLocked(true); setRptPin(""); setRptPinErr(""); setScreen("reports"); }
  function leaveReports(){ setRptLocked(true); setScreen("home"); }

  // ── Auth-protected clear ─────────────────────────────────
  function askClear(label,fn){ setClrLabel(label); setClrFn(function(){return fn;}); setClrPass(""); setClrErr(""); setClrModal(true); }
  function doClr(){
    if(clrPass==="2222"){clrFn&&clrFn()();setClrModal(false);setClrPass("");setClrErr("");setClrFn(null);}
    else setClrErr("Incorrect password. Access denied.");
  }
  function closeClearModal(){ setClrModal(false); setClrPass(""); setClrErr(""); setClrFn(null); }

  // ── Cart ─────────────────────────────────────────────────
  var cart = mode==="table"    ? ((tables.find(function(t){return t.id===selTbl;})||{}).cart||[])
           : mode==="takeaway" ? ((takeaways.find(function(t){return t.id===selTA;})||{}).cart||[])
           : [];
  var subtotal = cart.reduce(function(s,i){return s+i.price*i.qty;},0);
  var discountAmount = (function(){
    var v=parseFloat(discValue)||0;
    if(!showDisc||v<=0) return 0;
    if(discType==="percent") return Math.round(subtotal*v/100);
    return Math.min(v,subtotal);
  })();
  var total = subtotal - discountAmount;
  var count = cart.reduce(function(s,i){return s+i.qty;},0);

  function updTbl(id,fn){ setTables(function(p){var n=p.map(function(t){return t.id===id?fn(t):t;});saveTbls(n);return n;}); }
  function updTA(id,fn){ setTakeaways(function(p){var n=p.map(function(t){return t.id===id?fn(t):t;});saveTAs(n);return n;}); }

  function addItem(item){
    var dp=customPrices[item.id]!==undefined?customPrices[item.id]:item.price;
    var priced=Object.assign({},item,{price:dp});
    var ex=cart.find(function(i){return i.id===item.id;});
    if(mode==="table"){
      updTbl(selTbl,function(t){
        var c=ex?t.cart.map(function(i){return i.id===item.id?Object.assign({},i,{qty:i.qty+1}):i;}):t.cart.concat([Object.assign({},priced,{qty:1})]);
        return Object.assign({},t,{cart:c,openedAt:t.openedAt||new Date().toISOString()});
      });
    } else {
      updTA(selTA,function(t){
        var c=ex?t.cart.map(function(i){return i.id===item.id?Object.assign({},i,{qty:i.qty+1}):i;}):t.cart.concat([Object.assign({},priced,{qty:1})]);
        return Object.assign({},t,{cart:c});
      });
    }
  }

  function adj(id,d){
    if(mode==="table"){
      updTbl(selTbl,function(t){
        var c=t.cart.map(function(i){return i.id===id?Object.assign({},i,{qty:i.qty+d}):i;}).filter(function(i){return i.qty>0;});
        return Object.assign({},t,{cart:c,openedAt:c.length?t.openedAt:null});
      });
    } else {
      updTA(selTA,function(t){
        return Object.assign({},t,{cart:t.cart.map(function(i){return i.id===id?Object.assign({},i,{qty:i.qty+d}):i;}).filter(function(i){return i.qty>0;})});
      });
    }
  }

  function clearCart(){
    if(mode==="table") updTbl(selTbl,function(t){return Object.assign({},t,{cart:[],openedAt:null});});
    else updTA(selTA,function(t){return Object.assign({},t,{cart:[]});});
  }
  function clearTableFromHome(id){
    var n=tables.map(function(t){return t.id===id?Object.assign({},t,{cart:[],openedAt:null}):t;});
    setTables(n); saveTbls(n);
  }
  function removeTAFromHome(id){
    var n=takeaways.filter(function(t){return t.id!==id;});
    setTakeaways(n); saveTAs(n);
  }

  function newTakeaway(){
    var id=taCounter;
    var newTA={id:id,taNum:taLabel(id),cart:[],createdAt:new Date().toISOString()};
    var nl=takeaways.concat([newTA]); setTakeaways(nl); saveTAs(nl);
    var nc=taCounter+1; setTaCounter(nc); localStorage.setItem("cr_tacounter",String(nc));
    setSelTA(id); setMode("takeaway"); setCat(Object.keys(MENU)[0]); setScreen("pos");
  }

  function finalize(method,paid){
    var d=new Date(), isTbl=mode==="table";
    var ta=!isTbl?takeaways.find(function(t){return t.id===selTA;}):null;
    var order={
      orderNum:counter, type:isTbl?"Dine In":"Takeaway",
      ref:isTbl?"Table "+selTbl:(ta?ta.taNum:"TA"),
      tableId:isTbl?selTbl:null, taId:!isTbl?selTA:null,
      date:d.toLocaleDateString("en-GB"),
      time:d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),
      items:cart.map(function(i){return Object.assign({},i);}),
      subtotal:subtotal, discountType:discountAmount>0?discType:null,
      discountValue:discountAmount>0?parseFloat(discValue)||0:0,
      discountAmount:discountAmount, total:total,
      paymentMethod:method, amountPaid:paid,
      change:method==="cash"?paid-total:0, synced:false,
    };
    var no=orders.concat([order]), nc=counter+1;
    setOrders(no); setCounter(nc); setLast(order); saveOrd(no,nc);
    if(isTbl) updTbl(selTbl,function(t){return Object.assign({},t,{cart:[],openedAt:null});});
    else { var nTA=takeaways.filter(function(t){return t.id!==selTA;}); setTakeaways(nTA); saveTAs(nTA); }
    setDiscValue(""); setShowDisc(false); setDiscType("percent");
    setScreen("receipt");
  }

  // ── Till close ────────────────────────────────────────────
  function doCloseTill(){
    if(tcPass!=="2222"){setTcErr("Incorrect password. Access denied.");return;}
    var now=new Date(), tod=now.toLocaleDateString("en-GB");
    var closedAt=now.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});
    var closed=Object.assign({},tillSess,{closedAt:closedAt,status:"closed"});
    var dayOrders=orders.filter(function(o){return o.date===tod;});
    var cashO=dayOrders.filter(function(o){return o.paymentMethod==="cash";});
    var cardO=dayOrders.filter(function(o){return o.paymentMethod==="card";});
    var dineO=dayOrders.filter(function(o){return o.type==="Dine In";});
    var taO  =dayOrders.filter(function(o){return o.type==="Takeaway";});
    var iMap ={}; dayOrders.forEach(function(o){o.items.forEach(function(i){iMap[i.name]=(iMap[i.name]||0)+i.qty;});});
    var gross=dayOrders.reduce(function(s,o){return s+o.total;},0);
    var cashRv=cashO.reduce(function(s,o){return s+o.total;},0);
    var report={
      date:tod, openedAt:closed.openedAt, closedAt:closedAt, openingBalance:0,
      totalOrders:dayOrders.length,
      dineInCount:dineO.length,  dineInRev:dineO.reduce(function(s,o){return s+o.total;},0),
      takeawayCount:taO.length,  takeawayRev:taO.reduce(function(s,o){return s+o.total;},0),
      grossSales:gross, cashCount:cashO.length, cashRev:cashRv,
      cardCount:cardO.length, cardRev:cardO.reduce(function(s,o){return s+o.total;},0),
      closingCashBalance:cashRv,
      topItems:Object.entries(iMap).sort(function(a,b){return b[1]-a[1];}).slice(0,5),
    };
    setTillSess(closed); saveTillSess(closed);
    var nh=tillHist.concat([Object.assign({},closed,{report:report})]);
    setTillHist(nh); saveTillHist(nh);
    setDayEnd(report); setShowDE(true);
    setTcModal(false); setTcPass(""); setTcErr("");
  }

  // ── Print helpers ─────────────────────────────────────────
  function printWin(html){
    var w=window.open("","_blank","width=360,height=580");
    if(!w) return;
    w.document.write(
      "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Receipt</title>"
      +"<style>*{box-sizing:border-box;margin:0;padding:0}"
      +"body{font-family:'Courier New',monospace;padding:10px;font-size:12px;color:#000;width:280px}"
      +"table{width:100%;border-collapse:collapse}"
      +"td,th{vertical-align:top}"
      +"@media print{body{width:100%;padding:4px}}</style>"
      +"</head><body>"+html+"</body></html>"
    );
    w.document.close();
    w.focus();
    setTimeout(function(){ w.print(); setTimeout(function(){w.close();},2000); },600);
  }

  function printDailyReport(){
    var tod=new Date().toLocaleDateString("en-GB");
    var dayO=orders.filter(function(o){return o.date===tod;});
    var cashO=dayO.filter(function(o){return o.paymentMethod==="cash";});
    var cardO=dayO.filter(function(o){return o.paymentMethod==="card";});
    var dineO=dayO.filter(function(o){return o.type==="Dine In";});
    var taO  =dayO.filter(function(o){return o.type==="Takeaway";});
    var gross=dayO.reduce(function(s,o){return s+o.total;},0);
    var cashRv=cashO.reduce(function(s,o){return s+o.total;},0);
    var cardRv=cardO.reduce(function(s,o){return s+o.total;},0);
    var iMap={}; dayO.forEach(function(o){o.items.forEach(function(i){iMap[i.name]=(iMap[i.name]||0)+i.qty;});});
    var top5=Object.entries(iMap).sort(function(a,b){return b[1]-a[1];}).slice(0,5);
    var topRows=top5.map(function(e,i){return "<div style='display:flex;justify-content:space-between;padding:3px 0'><span>"+(i+1)+". "+e[0]+"</span><span>"+e[1]+" sold</span></div>";}).join("");
    var orderRows=dayO.slice().reverse().map(function(o){
      return "<div style='display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #f0f0f0;font-size:11px'>"
        +"<span><b>#"+o.orderNum+"</b> "+o.ref+" "+o.time+"</span>"
        +"<span style='font-weight:700'>Rs."+o.total.toLocaleString()+"</span></div>";
    }).join("");
    printWin(
      "<div style='text-align:center;padding-bottom:8px;border-bottom:1px dashed #000;margin-bottom:10px'>"
      +"<div style='font-size:15px;font-weight:900;letter-spacing:2px'>CHEF ROOSTER</div>"
      +"<div style='font-size:10px'>"+ADDR1+"</div><div style='font-size:10px'>Tel: "+TEL+"</div>"
      +"<div style='font-size:12px;font-weight:700;margin-top:4px'>DAILY SALES REPORT</div>"
      +"<div style='font-size:10px;color:#666'>"+tod+"</div></div>"
      +"<div style='display:flex;justify-content:space-between;padding:3px 0'><span>Total Orders</span><span>"+dayO.length+"</span></div>"
      +"<div style='display:flex;justify-content:space-between;padding:3px 0'><span>Dine-In ("+dineO.length+")</span><span>Rs."+dineO.reduce(function(s,o){return s+o.total;},0).toLocaleString()+"</span></div>"
      +"<div style='display:flex;justify-content:space-between;padding:3px 0'><span>Takeaway ("+taO.length+")</span><span>Rs."+taO.reduce(function(s,o){return s+o.total;},0).toLocaleString()+"</span></div>"
      +"<div style='border-top:1px dashed #000;margin:6px 0'></div>"
      +"<div style='display:flex;justify-content:space-between;padding:3px 0'><span>Cash ("+cashO.length+")</span><span>Rs."+cashRv.toLocaleString()+"</span></div>"
      +"<div style='display:flex;justify-content:space-between;padding:3px 0'><span>Card ("+cardO.length+")</span><span>Rs."+cardRv.toLocaleString()+"</span></div>"
      +"<div style='border-top:1px dashed #000;margin:6px 0'></div>"
      +"<div style='display:flex;justify-content:space-between;padding:3px 0;font-weight:900;font-size:14px'><span>GROSS SALES</span><span>Rs."+gross.toLocaleString()+"</span></div>"
      +"<div style='border-top:1px dashed #000;margin:6px 0'></div>"
      +(top5.length?"<div style='font-weight:700;font-size:11px;margin-bottom:4px'>TOP ITEMS</div>"+topRows+"<div style='border-top:1px dashed #000;margin:6px 0'></div>":"")
      +"<div style='font-weight:700;font-size:11px;margin-bottom:4px'>ALL ORDERS</div>"
      +(orderRows||"<div style='color:#aaa;text-align:center'>No orders today</div>")
      +"<div style='text-align:center;margin-top:10px;padding-top:6px;border-top:1px dashed #000;font-size:10px'>"
      +"Printed: "+new Date().toLocaleString("en-GB")+"</div>"
    );
  }

  // ── Sync ─────────────────────────────────────────────────
  function sync(){
    if(!sheetUrl){setSyncMsg("⚠️ No endpoint — add in Settings");return;}
    var q=orders.filter(function(o){return !o.synced;});
    if(!q.length){setSyncMsg("✅ Already synced");return;}
    setSyncMsg("⏳ Syncing…");
    fetch(sheetUrl,{method:"POST",redirect:"follow",body:JSON.stringify({orders:q})})
      .then(function(r){return r.text();})
      .then(function(text){
        var j={success:false};
        try{j=JSON.parse(text);}catch(e){j={success:true};}
        if(j.success){
          var up=orders.map(function(o){return Object.assign({},o,{synced:true});});
          setOrders(up); localStorage.setItem("cr_orders",JSON.stringify(up));
          setSyncMsg("✅ "+q.length+" order"+(q.length>1?"s":"")+" synced");
        } else setSyncMsg("❌ "+(j.error||"Check Apps Script URL"));
      })
      .catch(function(e){setSyncMsg("❌ "+e.message);});
  }

  // ── Derived ───────────────────────────────────────────────
  var today    = new Date().toLocaleDateString("en-GB");
  var todayO   = orders.filter(function(o){return o.date===today;});
  var todayRev = todayO.reduce(function(s,o){return s+o.total;},0);
  var totalRev = orders.reduce(function(s,o){return s+o.total;},0);
  var dineRev  = todayO.filter(function(o){return o.type==="Dine In";}).reduce(function(s,o){return s+o.total;},0);
  var taRev    = todayO.filter(function(o){return o.type==="Takeaway";}).reduce(function(s,o){return s+o.total;},0);
  var taCount  = todayO.filter(function(o){return o.type==="Takeaway";}).length;

  function doLogin(){
    if(lUser.trim()==="Admin"&&lPass==="2222"){setLoggedIn(true);setLErr("");}
    else setLErr("Incorrect username or password.");
  }

  // ── Clear modal ───────────────────────────────────────────
  function ClearModal(){
    if(!clrModal) return null;
    return (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}>
        <div style={{background:"#fff",borderRadius:22,padding:"34px 28px",maxWidth:320,width:"100%",margin:16,textAlign:"center",boxShadow:"0 24px 60px rgba(0,0,0,0.3)"}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:"#fef2f2",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 16px"}}>🔐</div>
          <div style={{fontWeight:800,fontSize:17,marginBottom:6}}>Manager Authorisation</div>
          <div style={{fontSize:12,color:"#999",marginBottom:6}}>Removing order from</div>
          <div style={{fontWeight:700,fontSize:14,color:RED,marginBottom:18,background:"#fff3f5",borderRadius:8,padding:"6px 12px",display:"inline-block"}}>{clrLabel}</div>
          <input type="password" value={clrPass} onChange={function(e){setClrPass(e.target.value);setClrErr("");}} onKeyDown={function(e){if(e.key==="Enter")doClr();}} placeholder="Enter manager password" autoFocus
            style={{width:"100%",padding:"13px 14px",borderRadius:10,border:"1.5px solid "+(clrErr?"#fca5a5":"#e5e5e5"),fontSize:16,boxSizing:"border-box",outline:"none",textAlign:"center",letterSpacing:6,marginBottom:10}}/>
          {clrErr&&<div style={{color:"#dc2626",fontSize:12,marginBottom:12,background:"#fef2f2",padding:"8px 12px",borderRadius:8}}>{clrErr}</div>}
          <div style={{display:"flex",gap:10,marginTop:4}}>
            <button onClick={closeClearModal} style={{flex:1,padding:13,border:"1.5px solid #e5e5e5",borderRadius:10,background:"#fff",cursor:"pointer",fontWeight:700,fontSize:14,color:"#666"}}>Cancel</button>
            <button onClick={doClr} style={{flex:1,padding:13,border:"none",borderRadius:10,background:RED,cursor:"pointer",fontWeight:800,fontSize:14,color:"#fff"}}>Confirm</button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // LOGIN
  // ══════════════════════════════════════════════════════
  if(!loggedIn) {
    return (
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
            <input value={lUser} onChange={function(e){setLUser(e.target.value);setLErr("");}} onKeyDown={function(e){if(e.key==="Enter")doLogin();}} placeholder="Enter username" autoComplete="off"
              style={{width:"100%",padding:"12px 14px",borderRadius:10,border:"1.5px solid "+(lErr?"#fca5a5":"#e5e5e5"),fontSize:14,boxSizing:"border-box",outline:"none"}}/>
          </div>
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,fontWeight:700,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Password</div>
            <div style={{position:"relative"}}>
              <input value={lPass} onChange={function(e){setLPass(e.target.value);setLErr("");}} onKeyDown={function(e){if(e.key==="Enter")doLogin();}} type={showPw?"text":"password"} placeholder="Enter password"
                style={{width:"100%",padding:"12px 44px 12px 14px",borderRadius:10,border:"1.5px solid "+(lErr?"#fca5a5":"#e5e5e5"),fontSize:14,boxSizing:"border-box",outline:"none"}}/>
              <button onClick={function(){setShowPw(function(p){return !p;});}} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#aaa",padding:0}}>
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
  }

  if(!loaded) {
    return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"'Segoe UI',sans-serif",color:"#aaa",fontSize:14}}>Loading…</div>;
  }

  // ══════════════════════════════════════════════════════
  // PAYMENT
  // ══════════════════════════════════════════════════════
  if(screen==="payment") {
    var paid = parseFloat(cashAmt)||0;
    var change = paid - total;
    var payRef = mode==="table" ? "Table "+selTbl : ((takeaways.find(function(t){return t.id===selTA;})||{}).taNum||"TA");
    function cardFlow(){
      setPayStep("card-proc");
      setTimeout(function(){
        setPayStep("card-done");
        setTimeout(function(){finalize("card",total);},1600);
      },2600);
    }
    return (
      <div style={P.page}>
        <TopBar onBack={function(){setScreen("pos");}} right={<span style={{color:"rgba(255,255,255,0.85)",fontSize:13}}>{payRef} · Due: <b style={{color:"#fff"}}>{Rs(total)}</b></span>}>
          <span style={{color:"#fff",fontWeight:700,fontSize:16}}>🐓 Payment</span>
        </TopBar>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"16px",gap:14,overflowY:"auto"}}>
          {/* Discount panel */}
          <div style={{width:"100%",maxWidth:440}}>
            <button onClick={function(){setShowDisc(function(p){return !p;});}}
              style={{width:"100%",padding:"11px 16px",background:showDisc?"#fff3f5":"#f9f9f9",border:"1.5px solid "+(showDisc?RED:"#e5e5e5"),borderRadius:12,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontWeight:700,fontSize:13,color:showDisc?RED:"#555"}}>
              <span>🏷️ Apply Discount</span>
              <span style={{fontSize:11,fontWeight:400,color:showDisc?RED:"#aaa"}}>{showDisc?"▲ hide":"▼ expand"}</span>
            </button>
            {showDisc&&(
              <div style={{background:"#fff",border:"1.5px solid "+RED,borderTop:"none",borderRadius:"0 0 12px 12px",padding:"14px 16px"}}>
                <div style={{display:"flex",gap:8,marginBottom:12}}>
                  {[["percent","% Percent"],["fixed","Rs Fixed"]].map(function(item){
                    return (
                      <button key={item[0]} onClick={function(){setDiscType(item[0]);setDiscValue("");}}
                        style={{flex:1,padding:"8px 0",border:"1.5px solid "+(discType===item[0]?RED:"#ddd"),borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13,background:discType===item[0]?RED:"#fff",color:discType===item[0]?"#fff":"#555"}}>
                        {item[1]}
                      </button>
                    );
                  })}
                </div>
                <input type="number" value={discValue} onChange={function(e){setDiscValue(e.target.value);}}
                  placeholder={discType==="percent"?"Enter % e.g. 10":"Enter amount e.g. 500"}
                  style={{width:"100%",padding:"11px 14px",borderRadius:10,border:"1.5px solid #ddd",fontSize:15,boxSizing:"border-box",outline:"none",textAlign:"center",fontWeight:700}}/>
                {discountAmount>0&&(
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:10,padding:"8px 12px",background:"#f0fdf4",borderRadius:8,fontSize:13}}>
                    <span style={{color:"#166534"}}>Discount Applied</span>
                    <span style={{fontWeight:800,color:"#16a34a"}}>- {Rs(discountAmount)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          {discountAmount>0&&(
            <div style={{width:"100%",maxWidth:440,background:"#fff",borderRadius:12,padding:"12px 16px",border:"1px solid #e5e5e5"}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}>
                <span style={{color:"#888"}}>Subtotal</span><span style={{fontWeight:600}}>{Rs(subtotal)}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}>
                <span style={{color:"#16a34a"}}>Discount {discType==="percent"?"("+discValue+"%)":""}</span>
                <span style={{fontWeight:700,color:"#16a34a"}}>- {Rs(discountAmount)}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:800,borderTop:"1.5px solid #eee",paddingTop:8}}>
                <span>Total to Pay</span><span style={{color:RED}}>{Rs(total)}</span>
              </div>
            </div>
          )}
          {payStep==="choose"&&(
            <>
              <p style={{margin:0,fontWeight:700,fontSize:15,color:"#333"}}>Select payment method</p>
              <div style={{display:"flex",gap:14,width:"100%",maxWidth:440}}>
                {[["💵","Cash","cash"],["💳","Card / NFC","card-tap"]].map(function(item){
                  return (
                    <button key={item[2]} onClick={function(){setPayStep(item[2]);}}
                      style={{flex:1,padding:"24px 12px",background:"#fff",border:"1.5px solid #e5e5e5",borderRadius:18,cursor:"pointer",textAlign:"center",boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}>
                      <div style={{fontSize:36,marginBottom:10}}>{item[0]}</div>
                      <div style={{fontSize:15,fontWeight:700,color:"#1a1a1a"}}>{item[1]}</div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
          {payStep==="cash"&&(
            <div style={{...P.card,width:"100%",maxWidth:380,padding:22}}>
              <p style={{margin:"0 0 4px",fontWeight:700,fontSize:14}}>💵 Cash Payment — {payRef}</p>
              <p style={{margin:"0 0 14px",fontSize:12,color:"#999"}}>Amount due: <b style={{color:RED}}>{Rs(total)}</b></p>
              <Numpad value={cashAmt} onChange={setCashAmt}/>
              {paid>=total&&paid>0&&(
                <div style={{background:"#f0fdf4",borderRadius:10,padding:"12px 16px",marginTop:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:13,color:"#166534"}}>Change Due</span>
                  <span style={{fontSize:22,fontWeight:800,color:"#16a34a"}}>{Rs(change)}</span>
                </div>
              )}
              <button onClick={function(){if(paid>=total)finalize("cash",paid);}} disabled={paid<total}
                style={{...P.btn,width:"100%",marginTop:14,padding:14,opacity:paid<total?0.4:1}}>Complete Payment</button>
              <button onClick={function(){setPayStep("choose");}} style={P.ghost}>← Change method</button>
            </div>
          )}
          {payStep==="card-tap"&&(
            <div style={{...P.card,width:"100%",maxWidth:380,padding:36,textAlign:"center"}}>
              <div style={{width:88,height:88,borderRadius:"50%",background:"#eff6ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,margin:"0 auto 18px"}}>💳</div>
              <p style={{fontWeight:700,fontSize:18,margin:"0 0 8px"}}>Tap, Insert or Swipe Card</p>
              <p style={{color:"#999",fontSize:13,margin:"0 0 26px"}}>Present card to the reader when ready</p>
              <button onClick={cardFlow} style={{...P.btn,width:"100%",padding:15,fontSize:15}}>Card Presented ✓</button>
              <button onClick={function(){setPayStep("choose");}} style={P.ghost}>← Change method</button>
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
  if(screen==="receipt"&&lastOrder) {
    var recIsTbl = lastOrder.type==="Dine In";
    var recAc    = recIsTbl ? RED : AMB;
    var recBadge = recIsTbl ? "TABLE "+lastOrder.tableId+" — DINE IN" : "TAKEAWAY — "+lastOrder.ref;
    return (
      <div style={P.page}>
        <style>{"@media print{.np{display:none!important}.pa{box-shadow:none!important}}"}</style>
        <div className="np" style={{...P.topbar,background:"linear-gradient(135deg,"+recAc+","+(recIsTbl?DRED:"#b45309")+")",justifyContent:"space-between"}}>
          <span style={{color:"#fff",fontWeight:700,fontSize:13}}>Receipt — Order #{lastOrder.orderNum} · {lastOrder.ref}</span>
          <div style={{display:"flex",gap:8}}>
            <button onClick={function(){printDirect(lastOrder);}} style={{...P.tbBtn,background:"#fff",color:recAc}}>🖨️ Reprint</button>
            <button onClick={function(){setPayStep("choose");setCashAmt("");setMode(null);setScreen("home");}} style={P.tbBtn}>⬅ Home</button>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",background:"#f4f4f4",display:"flex",justifyContent:"center",padding:20,alignItems:"flex-start"}}>
          <div className="pa" style={{...P.card,maxWidth:420,width:"100%",padding:28}}>
            <div style={{textAlign:"center",borderBottom:"2px dashed #e0e0e0",paddingBottom:18,marginBottom:18}}>
              <div style={{width:72,height:72,margin:"0 auto 10px",display:"flex",alignItems:"center",justifyContent:"center"}}><Logo size={72} round={true}/></div>
              <div style={{fontSize:20,fontWeight:800,letterSpacing:2,color:RED}}>CHEF ROOSTER</div>
              <div style={{fontSize:11,color:"#aaa",marginTop:4}}>{ADDR1}</div>
              <div style={{fontSize:11,color:"#aaa"}}>Tel: {TEL}</div>
              <div style={{display:"inline-block",background:recIsTbl?"#fff3f5":"#fffbeb",border:"1px solid "+recAc+"40",borderRadius:8,padding:"3px 14px",fontSize:11,color:recAc,fontWeight:800,marginTop:8,letterSpacing:1}}>{recBadge}</div>
              <div style={{fontSize:11,color:"#aaa",marginTop:6}}>Order #{lastOrder.orderNum} · {lastOrder.date} {lastOrder.time}</div>
            </div>
            {lastOrder.items.map(function(it,i){
              return (
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f5f5f5",fontSize:13}}>
                  <span style={{color:"#333"}}>{it.name} <span style={{color:"#bbb"}}>x{it.qty}</span></span>
                  <span style={{fontWeight:700}}>{Rs((it.price||0)*it.qty)}</span>
                </div>
              );
            })}
            <div style={{borderTop:"2px dashed #e0e0e0",marginTop:16,paddingTop:16}}>
              {lastOrder.discountAmount>0&&(
                <>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:13}}>
                    <span style={{color:"#888"}}>Subtotal</span><span style={{fontWeight:600}}>{Rs(lastOrder.subtotal)}</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:13}}>
                    <span style={{color:"#16a34a"}}>Discount{lastOrder.discountType==="percent"?" ("+lastOrder.discountValue+"%)":""}</span>
                    <span style={{fontWeight:700,color:"#16a34a"}}>- {Rs(lastOrder.discountAmount)}</span>
                  </div>
                </>
              )}
              <div style={{display:"flex",justifyContent:"space-between",marginTop:14,paddingTop:14,borderTop:"2px solid #1a1a1a"}}>
                <span style={{fontWeight:700,fontSize:16}}>TOTAL</span>
                <span style={{fontWeight:800,fontSize:22,color:recAc}}>{Rs(lastOrder.total)}</span>
              </div>
            </div>
            <div style={{textAlign:"center",marginTop:20,paddingTop:16,borderTop:"2px dashed #e0e0e0",fontSize:11,color:"#ccc",lineHeight:2.2}}>
              ★ {recIsTbl?"Enjoy your meal!":"Your order is being prepared!"} ★<br/>Chef Rooster · {ADDR1}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // REPORTS — lock
  // ══════════════════════════════════════════════════════
  if(screen==="reports"&&rptLocked) {
    return (
      <div style={P.page}>
        <TopBar onBack={function(){setScreen("home");}}><span style={{color:"#fff",fontWeight:700,fontSize:16}}>🐓 Reports</span></TopBar>
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{...P.card,maxWidth:340,width:"100%",padding:36,textAlign:"center"}}>
            <div style={{width:68,height:68,borderRadius:"50%",background:"#fff3f5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 18px"}}>🔒</div>
            <div style={{fontWeight:800,fontSize:18,marginBottom:6}}>Reports Access</div>
            <div style={{fontSize:13,color:"#aaa",marginBottom:22}}>Enter admin password to view reports</div>
            <input type="password" value={rptPin} onChange={function(e){setRptPin(e.target.value);setRptPinErr("");}} onKeyDown={function(e){if(e.key==="Enter")doRptUnlock();}} placeholder="Enter password" autoFocus
              style={{width:"100%",padding:"13px 14px",borderRadius:10,border:"1.5px solid "+(rptPinErr?"#fca5a5":"#e5e5e5"),fontSize:16,boxSizing:"border-box",outline:"none",textAlign:"center",letterSpacing:6,marginBottom:10}}/>
            {rptPinErr&&<div style={{color:"#dc2626",fontSize:12,marginBottom:10,background:"#fef2f2",padding:"8px 12px",borderRadius:8}}>{rptPinErr}</div>}
            <button onClick={doRptUnlock} style={{...P.btn,width:"100%",padding:14,fontSize:15}}>Unlock Reports →</button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // REPORTS — main
  // ══════════════════════════════════════════════════════
  if(screen==="reports") {
    var rptItemMap={};
    todayO.forEach(function(o){o.items.forEach(function(i){rptItemMap[i.name]=(rptItemMap[i.name]||0)+i.qty;});});
    var rptTop5=Object.entries(rptItemMap).sort(function(a,b){return b[1]-a[1];}).slice(0,5);
    var rptUnsynced=orders.filter(function(o){return !o.synced;}).length;
    var rptTillOpen=tillSess&&tillSess.status==="open";
    var rptLiveCash=todayO.filter(function(o){return o.paymentMethod==="cash";}).reduce(function(s,o){return s+o.total;},0);
    return (
      <div style={P.page}>
        {tcModal&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}>
            <div style={{background:"#fff",borderRadius:22,padding:"34px 28px",maxWidth:340,width:"100%",margin:16,textAlign:"center",boxShadow:"0 24px 60px rgba(0,0,0,0.3)"}}>
              <div style={{width:66,height:66,borderRadius:"50%",background:"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 16px"}}>🔒</div>
              <div style={{fontWeight:800,fontSize:17,marginBottom:4}}>Close Till — {tillSess&&tillSess.date}</div>
              <div style={{fontSize:12,color:"#999",marginBottom:20}}>This will lock the till and generate the Day End Report.</div>
              <input type="password" value={tcPass} onChange={function(e){setTcPass(e.target.value);setTcErr("");}} onKeyDown={function(e){if(e.key==="Enter")doCloseTill();}} placeholder="Manager password" autoFocus
                style={{width:"100%",padding:"13px 14px",borderRadius:10,border:"1.5px solid "+(tcErr?"#fca5a5":"#e5e5e5"),fontSize:16,boxSizing:"border-box",outline:"none",textAlign:"center",letterSpacing:6,marginBottom:10}}/>
              {tcErr&&<div style={{color:"#dc2626",fontSize:12,marginBottom:12,background:"#fef2f2",padding:"8px 12px",borderRadius:8}}>{tcErr}</div>}
              <div style={{background:"#f0fdf4",borderRadius:10,padding:"10px 14px",marginBottom:16,display:"flex",justifyContent:"space-between",fontSize:13}}>
                <span style={{color:"#166534"}}>Cash in Till</span>
                <span style={{fontWeight:800,color:"#16a34a"}}>{Rs(rptLiveCash)}</span>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={function(){setTcModal(false);setTcPass("");setTcErr("");}} style={{flex:1,padding:13,border:"1.5px solid #e5e5e5",borderRadius:10,background:"#fff",cursor:"pointer",fontWeight:700,fontSize:14,color:"#666"}}>Cancel</button>
                <button onClick={doCloseTill} style={{flex:1,padding:13,border:"none",borderRadius:10,background:"#d97706",cursor:"pointer",fontWeight:800,fontSize:14,color:"#fff"}}>Close Till</button>
              </div>
            </div>
          </div>
        )}
        {showDE&&dayEnd&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:16,overflowY:"auto"}}>
            <div style={{background:"#fff",borderRadius:20,maxWidth:440,width:"100%",overflow:"hidden",boxShadow:"0 24px 60px rgba(0,0,0,0.3)"}}>
              <div style={{background:"linear-gradient(135deg,#C8102E,#9B0020)",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:"#fff",fontWeight:700,fontSize:14}}>📋 Day End Report</span>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={printDailyReport} style={{...P.tbBtn,background:"#fff",color:RED,fontSize:12}}>🖨️ Print</button>
                  <button onClick={function(){setShowDE(false);}} style={{...P.tbBtn,fontSize:12}}>✕ Close</button>
                </div>
              </div>
              <div style={{padding:"24px 28px",maxHeight:"75vh",overflowY:"auto"}}>
                <div style={{textAlign:"center",borderBottom:"2px dashed #e0e0e0",paddingBottom:18,marginBottom:18}}>
                  <div style={{width:50,height:50,margin:"0 auto 8px",display:"flex",alignItems:"center",justifyContent:"center"}}><Logo size={50} round={true}/></div>
                  <div style={{fontSize:17,fontWeight:800,letterSpacing:2,color:RED}}>CHEF ROOSTER</div>
                  <div style={{fontSize:11,color:"#aaa",marginTop:3}}>{ADDR1} · {TEL}</div>
                  <div style={{fontSize:13,fontWeight:700,color:"#555",marginTop:6,letterSpacing:1}}>DAY END REPORT</div>
                  <div style={{fontSize:12,color:"#aaa",marginTop:4}}>{dayEnd.date}</div>
                </div>
                <div style={{background:"#f9f9f9",borderRadius:10,padding:"12px 16px",marginBottom:16}}>
                  {[["Till Opened",dayEnd.openedAt],["Till Closed",dayEnd.closedAt],["Opening Balance","Rs. 0.00"]].map(function(row){
                    return (
                      <div key={row[0]} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:13}}>
                        <span style={{color:"#888"}}>{row[0]}</span><span style={{fontWeight:700}}>{row[1]}</span>
                      </div>
                    );
                  })}
                </div>
                {[["Dine-In Orders ("+dayEnd.dineInCount+")",Rs(dayEnd.dineInRev),RED],["Takeaway Orders ("+dayEnd.takeawayCount+")",Rs(dayEnd.takeawayRev),"#d97706"],["Total Orders ("+dayEnd.totalOrders+")",Rs(dayEnd.grossSales),"#1a1a1a"]].map(function(row){
                  return (
                    <div key={row[0]} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f5f5f5",fontSize:13}}>
                      <span style={{color:"#555"}}>{row[0]}</span><span style={{fontWeight:700,color:row[2]}}>{row[1]}</span>
                    </div>
                  );
                })}
                <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",marginBottom:16,borderBottom:"2px solid #1a1a1a"}}>
                  <span style={{fontWeight:800,fontSize:15}}>GROSS SALES</span>
                  <span style={{fontWeight:800,fontSize:18,color:RED}}>{Rs(dayEnd.grossSales)}</span>
                </div>
                {[["💵 Cash ("+dayEnd.cashCount+")",Rs(dayEnd.cashRev)],["💳 Card ("+dayEnd.cardCount+")",Rs(dayEnd.cardRev)]].map(function(row){
                  return (
                    <div key={row[0]} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f5f5f5",fontSize:13}}>
                      <span style={{color:"#555"}}>{row[0]}</span><span style={{fontWeight:700}}>{row[1]}</span>
                    </div>
                  );
                })}
                {dayEnd.topItems.length>0&&(
                  <>
                    <div style={{fontWeight:800,fontSize:11,color:"#aaa",textTransform:"uppercase",margin:"16px 0 8px"}}>Top Items</div>
                    {dayEnd.topItems.map(function(entry,i){
                      return (
                        <div key={entry[0]} style={{display:"flex",alignItems:"center",padding:"5px 0",borderBottom:"1px solid #f5f5f5",fontSize:13}}>
                          <div style={{width:22,height:22,borderRadius:"50%",background:i===0?"#f59e0b":RED,color:"#fff",fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",marginRight:10,flexShrink:0}}>{i+1}</div>
                          <div style={{flex:1}}>{entry[0]}</div><div style={{color:"#888"}}>x{entry[1]}</div>
                        </div>
                      );
                    })}
                  </>
                )}
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
          {[["📊","Summary","summary"],["💰","Till","till"]].map(function(item){
            return (
              <button key={item[2]} onClick={function(){setRptTab(item[2]);}}
                style={{flex:1,padding:"12px 0",border:"none",background:"transparent",cursor:"pointer",fontSize:13,fontWeight:700,color:rptTab===item[2]?RED:"#aaa",borderBottom:"3px solid "+(rptTab===item[2]?RED:"transparent")}}>
                {item[0]} {item[1]}
              </button>
            );
          })}
        </div>
        {syncMsg&&<div style={{padding:"9px 18px",background:"#fff",borderBottom:"1px solid #eee",fontSize:12,color:syncMsg.startsWith("✅")?"#16a34a":syncMsg.startsWith("❌")?"#dc2626":"#555"}}>{syncMsg}</div>}
        {rptUnsynced>0&&!syncMsg&&<div style={{padding:"8px 18px",background:"#fffbeb",borderBottom:"1px solid #fde68a",fontSize:12,color:"#92400e"}}>⚠️ {rptUnsynced} unsynced order{rptUnsynced>1?"s":""}</div>}
        {rptTab==="summary"&&(
          <div style={{flex:1,overflowY:"auto",padding:14}}>
            <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
              <button onClick={printDailyReport} style={{background:"linear-gradient(135deg,#C8102E,#9B0020)",border:"none",borderRadius:10,color:"#fff",cursor:"pointer",fontWeight:700,fontSize:13,padding:"9px 18px"}}>
                🖨️ Print Daily Report
              </button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10,marginBottom:14}}>
              {[["🧾","Today Orders",todayO.length,false,RED],["💰","Today Revenue",Rs(todayRev),true,RED],["🍽️","Dine-In",Rs(dineRev),false,RED],["🛍️","Takeaway",Rs(taRev),false,AMB],["📦","TA Orders",taCount,false,AMB],["📈","All-Time",Rs(totalRev),true,RED]].map(function(item){
                return (
                  <div key={item[1]} style={{background:"#fff",borderRadius:12,padding:12,textAlign:"center",boxShadow:"0 1px 8px rgba(0,0,0,0.06)",borderTop:"3px solid "+item[4]}}>
                    <div style={{fontSize:20,marginBottom:5}}>{item[0]}</div>
                    <div style={{fontSize:item[3]?13:18,fontWeight:800,color:item[4],lineHeight:1.2}}>{item[2]}</div>
                    <div style={{fontSize:9,color:"#aaa",marginTop:4,textTransform:"uppercase",letterSpacing:0.3}}>{item[1]}</div>
                  </div>
                );
              })}
            </div>
            {rptTop5.length>0&&(
              <div style={{...P.card,marginBottom:12}}>
                <p style={{margin:"0 0 12px",fontWeight:700,fontSize:14}}>🏆 Top Items Today</p>
                {rptTop5.map(function(entry,i){
                  return (
                    <div key={entry[0]} style={{display:"flex",alignItems:"center",padding:"7px 0",borderBottom:"1px solid #f5f5f5"}}>
                      <div style={{width:24,height:24,borderRadius:"50%",background:RED,color:"#fff",fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",marginRight:10,flexShrink:0}}>{i+1}</div>
                      <div style={{flex:1,fontSize:13}}>{entry[0]}</div>
                      <div style={{fontSize:12,color:"#888"}}>{entry[1]} sold</div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={P.card}>
              <p style={{margin:"0 0 12px",fontWeight:700,fontSize:14}}>📋 Recent Orders</p>
              {!orders.length&&<p style={{color:"#ccc",textAlign:"center",padding:"20px 0",margin:0}}>No orders yet</p>}
              {orders.slice().reverse().slice(0,30).map(function(o){
                return (
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
                      <button onClick={function(){printDirect(o);}} title="Print"
                        style={{width:28,height:28,borderRadius:8,border:"1px solid #eee",background:"#f9f9f9",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>🖨️</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {rptTab==="till"&&(
          <div style={{flex:1,overflowY:"auto",padding:14}}>
            <div style={{...P.card,marginBottom:14,borderTop:"4px solid "+(rptTillOpen?"#22c55e":"#94a3b8")}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <div style={{fontSize:11,color:"#aaa",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Current Till</div>
                  <div style={{fontSize:20,fontWeight:800}}>{tillSess&&tillSess.date||"—"}</div>
                </div>
                <div style={{background:rptTillOpen?"#f0fdf4":"#f1f5f9",borderRadius:10,padding:"6px 14px",display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:rptTillOpen?"#22c55e":"#94a3b8"}}/>
                  <span style={{fontSize:13,fontWeight:800,color:rptTillOpen?"#16a34a":"#64748b"}}>{rptTillOpen?"OPEN":"CLOSED"}</span>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                {[["🕐 Opened",tillSess&&tillSess.openedAt||"—"],["🔒 Closed",tillSess&&tillSess.closedAt||"—"],["💵 Opening","Rs. 0.00"],["💰 Cash in Till",Rs(rptLiveCash)]].map(function(row){
                  return (
                    <div key={row[0]} style={{background:"#f9f9f9",borderRadius:10,padding:"10px 12px"}}>
                      <div style={{fontSize:10,color:"#aaa",marginBottom:3}}>{row[0]}</div>
                      <div style={{fontSize:14,fontWeight:700}}>{row[1]}</div>
                    </div>
                  );
                })}
              </div>
              {rptTillOpen?(
                <button onClick={function(){setTcPass("");setTcErr("");setTcModal(true);}}
                  style={{width:"100%",padding:15,background:"linear-gradient(135deg,#d97706,#b45309)",border:"none",borderRadius:12,cursor:"pointer",fontSize:15,fontWeight:800,color:"#fff"}}>
                  🔒 Close Till & Generate Day End Report
                </button>
              ):(
                <div>
                  <div style={{background:"#f1f5f9",borderRadius:10,padding:"12px 16px",textAlign:"center",marginBottom:10}}>
                    <div style={{fontSize:13,color:"#64748b",fontWeight:600}}>Till closed at {tillSess&&tillSess.closedAt}</div>
                    <div style={{fontSize:11,color:"#aaa",marginTop:3}}>New till opens automatically tomorrow</div>
                  </div>
                  {dayEnd&&<button onClick={function(){setShowDE(true);}} style={{...P.btn,width:"100%",padding:13,background:"#475569"}}>📋 View Last Day End Report</button>}
                </div>
              )}
            </div>
            {tillHist.length>0&&(
              <div style={P.card}>
                <p style={{margin:"0 0 14px",fontWeight:700,fontSize:14}}>📅 Previous Sessions</p>
                {tillHist.slice().reverse().slice(0,10).map(function(s,i){
                  return (
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
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // SETTINGS
  // ══════════════════════════════════════════════════════
  if(screen==="settings") {
    var setCatItems = MENU[priceCat]||[];
    return (
      <div style={P.page}>
        <TopBar onBack={function(){setMenuLocked(true);setScreen("home");}}><span style={{color:"#fff",fontWeight:700,fontSize:16}}>🐓 Settings</span></TopBar>
        <div style={{flex:1,overflowY:"auto",padding:14}}>
          {menuLocked ? (
            <div style={{...P.card,marginBottom:12}}>
              <p style={{margin:"0 0 4px",fontWeight:700,fontSize:14}}>🔐 Admin Menu & Price Management</p>
              <p style={{margin:"0 0 16px",fontSize:12,color:"#999"}}>Enter admin password to manage prices and menu items</p>
              <input type="password" value={menuPin} onChange={function(e){setMenuPin(e.target.value);setMenuPinErr("");}} onKeyDown={function(e){if(e.key==="Enter")doMenuUnlock();}} placeholder="Enter password" autoFocus
                style={{width:"100%",padding:"12px 14px",borderRadius:10,border:"1.5px solid "+(menuPinErr?"#fca5a5":"#ddd"),fontSize:16,boxSizing:"border-box",outline:"none",textAlign:"center",letterSpacing:6,marginBottom:10}}/>
              {menuPinErr&&<div style={{color:"#dc2626",fontSize:12,marginBottom:10,background:"#fef2f2",padding:"8px 12px",borderRadius:8,textAlign:"center"}}>{menuPinErr}</div>}
              <button onClick={doMenuUnlock} style={{...P.btn,width:"100%",padding:13}}>Unlock →</button>
            </div>
          ) : (
            <>
              <div style={{...P.card,marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <p style={{margin:0,fontWeight:700,fontSize:14}}>💲 Edit Item Prices</p>
                  <button onClick={function(){setMenuLocked(true);setMenuPin("");setMenuPinErr("");}} style={{fontSize:11,color:"#aaa",background:"none",border:"none",cursor:"pointer"}}>🔒 Lock</button>
                </div>
                <p style={{margin:"0 0 14px",fontSize:12,color:"#999"}}>Changed prices show in red.</p>
                <div style={{overflowX:"auto",display:"flex",gap:6,marginBottom:14,paddingBottom:4}}>
                  {Object.keys(BASE_MENU).map(function(c){
                    return (
                      <button key={c} onClick={function(){setPriceCat(c);}}
                        style={{padding:"6px 12px",border:"none",borderRadius:8,cursor:"pointer",whiteSpace:"nowrap",fontSize:11,fontWeight:700,background:priceCat===c?RED:"#f0f0f0",color:priceCat===c?"#fff":"#555",flexShrink:0}}>
                        {CICONS[c]} {c}
                      </button>
                    );
                  })}
                </div>
                {setCatItems.map(function(item){
                  var cur=priceEdits[item.id]!==undefined?priceEdits[item.id]:(customPrices[item.id]!==undefined?customPrices[item.id]:item.price);
                  return (
                    <div key={item.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #f5f5f5"}}>
                      <div style={{flex:1,fontSize:13,fontWeight:600}}>
                        {item.name}
                        {item.custom&&<span style={{marginLeft:5,fontSize:9,background:"#e0f2fe",color:"#0369a1",borderRadius:4,padding:"1px 5px",fontWeight:700}}>CUSTOM</span>}
                      </div>
                      <div style={{fontSize:10,color:"#bbb",minWidth:55,textAlign:"right"}}>Base: Rs.{item.price}</div>
                      <input type="number" value={cur}
                        onChange={function(e){var v=parseInt(e.target.value)||0;setPriceEdits(function(p){var np=Object.assign({},p);np[item.id]=v;return np;});}}
                        style={{width:85,padding:"6px 8px",borderRadius:8,border:"1.5px solid "+(cur!==item.price?"#C8102E":"#ddd"),fontSize:13,fontWeight:700,outline:"none",textAlign:"right",color:cur!==item.price?RED:"#1a1a1a"}}/>
                    </div>
                  );
                })}
                <div style={{display:"flex",gap:8,marginTop:14}}>
                  <button onClick={savePrices} style={{...P.btn,flex:1,padding:12,fontSize:13,background:priceSaved?"#16a34a":RED}}>{priceSaved?"✅ Saved!":"💾 Save Prices"}</button>
                  <button onClick={function(){if(window.confirm("Reset ALL prices?"))resetPrices();}} style={{...P.btn,padding:12,fontSize:13,background:"#64748b"}}>Reset</button>
                </div>
              </div>
              <div style={{...P.card,marginBottom:12}}>
                <p style={{margin:"0 0 4px",fontWeight:700,fontSize:14}}>📂 Add New Menu Category</p>
                <p style={{margin:"0 0 14px",fontSize:12,color:"#999"}}>Create a new category that appears in the POS</p>
                <div style={{display:"flex",gap:8,marginBottom:10}}>
                  <input value={newCatIcon} onChange={function(e){setNewCatIcon(e.target.value);}} placeholder="🍽️"
                    style={{width:52,padding:"10px 6px",borderRadius:10,border:"1.5px solid #ddd",fontSize:20,boxSizing:"border-box",outline:"none",textAlign:"center"}}/>
                  <input value={newCatName} onChange={function(e){setNewCatName(e.target.value);}} placeholder="e.g. Hot Dogs, Desserts, Wraps" onKeyDown={function(e){if(e.key==="Enter")addNewCat();}}
                    style={{flex:1,padding:"10px 12px",borderRadius:10,border:"1.5px solid #ddd",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
                </div>
                <button onClick={addNewCat} disabled={!newCatName.trim()}
                  style={{...P.btn,width:"100%",padding:12,fontSize:13,background:"#7c3aed",opacity:!newCatName.trim()?0.4:1}}>
                  📂 Add Category
                </button>
                {customCats.length>0&&(
                  <>
                    <p style={{margin:"16px 0 10px",fontWeight:700,fontSize:13,color:"#555"}}>Your Custom Categories</p>
                    {customCats.map(function(cc){
                      return (
                        <div key={cc.name} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"#f5f3ff",borderRadius:10,marginBottom:6}}>
                          <span style={{fontSize:18}}>{cc.icon}</span>
                          <div style={{flex:1,fontSize:13,fontWeight:600}}>{cc.name}</div>
                          <div style={{fontSize:11,color:"#7c3aed"}}>{(customItems[cc.name]||[]).length} items</div>
                          <button onClick={function(){if(window.confirm("Delete "+cc.name+" category and all its items?"))deleteCat(cc.name);}}
                            style={{width:26,height:26,borderRadius:"50%",background:"#fee2e2",border:"none",cursor:"pointer",fontSize:13,color:"#dc2626",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
              <div style={{...P.card,marginBottom:12}}>
                <p style={{margin:"0 0 4px",fontWeight:700,fontSize:14}}>➕ Add Items to a Category</p>
                <p style={{margin:"0 0 14px",fontSize:12,color:"#999"}}>Add items to any existing or custom category</p>
                <div style={{overflowX:"auto",display:"flex",gap:6,marginBottom:14,paddingBottom:4}}>
                  {Object.keys(MENU).map(function(c){
                    return (
                      <button key={c} onClick={function(){setAddItemCat(c);}}
                        style={{padding:"6px 12px",border:"none",borderRadius:8,cursor:"pointer",whiteSpace:"nowrap",fontSize:11,fontWeight:700,background:addItemCat===c?"#059669":"#f0f0f0",color:addItemCat===c?"#fff":"#555",flexShrink:0}}>
                        {getCatIcon(c)} {c}
                      </button>
                    );
                  })}
                </div>
                <div style={{display:"flex",gap:8,marginBottom:10}}>
                  <input value={newItemName} onChange={function(e){setNewItemName(e.target.value);}} placeholder="Item name e.g. Large Fries" onKeyDown={function(e){if(e.key==="Enter")addNewItem();}}
                    style={{flex:2,padding:"10px 12px",borderRadius:10,border:"1.5px solid #ddd",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
                  <input type="number" value={newItemPrice} onChange={function(e){setNewItemPrice(e.target.value);}} placeholder="Price" onKeyDown={function(e){if(e.key==="Enter")addNewItem();}}
                    style={{flex:1,padding:"10px 12px",borderRadius:10,border:"1.5px solid #ddd",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
                </div>
                <button onClick={addNewItem} disabled={!newItemName.trim()||!newItemPrice}
                  style={{...P.btn,width:"100%",padding:12,fontSize:13,background:"#059669",opacity:(!newItemName.trim()||!newItemPrice)?0.4:1}}>
                  ➕ Add to {addItemCat}
                </button>
                {Object.entries(customItems).some(function(e){return e[1]&&e[1].length>0;})&&(
                  <>
                    <p style={{margin:"16px 0 10px",fontWeight:700,fontSize:13,color:"#555"}}>All Custom Items</p>
                    {Object.entries(customItems).map(function(entry){
                      var c=entry[0]; var items=entry[1]||[];
                      return items.map(function(item){
                        return (
                          <div key={item.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"#f0fdf4",borderRadius:10,marginBottom:6}}>
                            <div style={{fontSize:11,fontWeight:600,color:"#059669",minWidth:60}}>{getCatIcon(c)} {c}</div>
                            <div style={{flex:1,fontSize:13,fontWeight:600}}>{item.name}</div>
                            <div style={{fontSize:13,fontWeight:700,color:"#059669"}}>Rs.{item.price.toLocaleString()}</div>
                            <button onClick={function(){if(window.confirm("Delete "+item.name+"?"))deleteCustomItem(c,item.id);}}
                              style={{width:26,height:26,borderRadius:"50%",background:"#fee2e2",border:"none",cursor:"pointer",fontSize:13,color:"#dc2626",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
                          </div>
                        );
                      });
                    })}
                  </>
                )}
              </div>
            </>
          )}
          <div style={{...P.card,marginBottom:12}}>
            <p style={{margin:"0 0 4px",fontWeight:700,fontSize:14}}>☁️ Google Sheets Sync</p>
            <p style={{margin:"0 0 14px",fontSize:12,color:"#999"}}>Paste your Apps Script Web App URL below</p>
            <input value={sheetUrl} onChange={function(e){setSheetUrl(e.target.value);}} placeholder="https://script.google.com/macros/s/..."
              style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1.5px solid #ddd",fontSize:13,boxSizing:"border-box",marginBottom:10,outline:"none"}}/>
            <button onClick={function(){localStorage.setItem("cr_url",sheetUrl);setSyncMsg("✅ URL saved");setScreen("reports");}} style={{...P.btn,width:"100%",padding:13}}>Save & Go to Reports →</button>
          </div>
          <div style={{...P.card,marginBottom:12}}>
            <p style={{margin:"0 0 10px",fontWeight:700,fontSize:14}}>📋 Apps Script Setup</p>
            <div style={{fontSize:12,color:"#555",lineHeight:2,marginBottom:12}}>
              <b>Step 1:</b> Google Sheet → <b>Extensions → Apps Script</b><br/>
              <b>Step 2:</b> Delete existing code, paste script below<br/>
              <b>Step 3:</b> <b>Deploy → New Deployment → Web App</b><br/>
              <b>Step 4:</b> Execute as: <i>Me</i> · Access: <i>Anyone</i><br/>
              <b>Step 5:</b> Copy Web App URL and paste above
            </div>
            <div style={{background:"#0d1117",borderRadius:10,padding:14,fontSize:10.5,fontFamily:"'Courier New',monospace",color:"#7ee787",lineHeight:1.9,overflowX:"auto",whiteSpace:"pre"}}>{SCRIPT_CODE}</div>
          </div>
          <div style={{...P.card,marginBottom:12}}>
            <p style={{margin:"0 0 10px",fontWeight:700,fontSize:14}}>🖨️ XPrinter XP-80T — QZ Tray Setup</p>
            <div style={{fontSize:12,color:"#555",lineHeight:2}}>
              <b>Step 1:</b> Download QZ Tray free from <b>qz.io</b><br/>
              <b>Step 2:</b> Install XP-80T driver from <b>xprinter.net</b><br/>
              <b>Step 3:</b> Connect USB and start QZ Tray (sits in system tray)<br/>
              <b>Step 4:</b> Open this app — allow QZ Tray when Chrome asks (once only)<br/>
              <b>Step 5:</b> Receipts print silently from then on
            </div>
            <div style={{marginTop:12,padding:"10px 14px",background:"#f9f9f9",borderRadius:10,fontSize:12}}>
              <span style={{color:"#888"}}>Printer name in code: </span>
              <span style={{fontWeight:700,color:RED}}>XPrinter XP-80T</span><br/>
              <span style={{color:"#aaa",fontSize:11}}>Run → control printers → check exact name matches</span>
            </div>
          </div>
          <div style={{...P.card,marginBottom:12}}>
            <p style={{margin:"0 0 10px",fontWeight:700,fontSize:14}}>🔒 Session</p>
            <button onClick={function(){setLoggedIn(false);setLUser("");setLPass("");setScreen("home");setHomeTab("tables");}} style={{...P.btn,background:"#475569",width:"100%",padding:13}}>Sign Out</button>
          </div>
          <div style={{...P.card,marginBottom:12}}>
            <p style={{margin:"0 0 10px",fontWeight:700,fontSize:14}}>🔄 Reset</p>
            <button onClick={function(){if(window.confirm("Reset all tables?")){var f=mkTables();setTables(f);localStorage.setItem("cr_tables",JSON.stringify(f));}}} style={{...P.btn,background:AMB,width:"100%",padding:12,marginBottom:8}}>🪑 Reset All Tables</button>
            <button onClick={function(){if(window.confirm("Clear all takeaway orders?")){setTakeaways([]);localStorage.setItem("cr_takeaways","[]");}}} style={{...P.btn,background:"#059669",width:"100%",padding:12}}>🛍️ Clear Active Takeaways</button>
          </div>
          <div style={P.card}>
            <p style={{margin:"0 0 10px",fontWeight:700,fontSize:14,color:"#dc2626"}}>⚠️ Danger Zone</p>
            <button onClick={function(){if(window.confirm("Delete ALL order history?")){setOrders([]);setCounter(1);localStorage.setItem("cr_orders","[]");localStorage.setItem("cr_counter","1");}}} style={{...P.btn,background:"#dc2626",width:"100%",padding:13}}>🗑️ Clear All Order History</button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // POS
  // ══════════════════════════════════════════════════════
  if(screen==="pos") {
    var posIsTbl = mode==="table";
    var posAc    = posIsTbl ? RED : AMB;
    var posGrad  = posIsTbl ? "linear-gradient(135deg,#C8102E,#9B0020)" : "linear-gradient(135deg,#D97706,#b45309)";
    var posRef   = posIsTbl ? "Table "+selTbl : ((takeaways.find(function(t){return t.id===selTA;})||{}).taNum||"TA");
    var posOpenedAt = posIsTbl
      ? ((tables.find(function(t){return t.id===selTbl;})||{}).openedAt||null)
      : ((takeaways.find(function(t){return t.id===selTA;})||{}).createdAt||null);
    return (
      <div style={{display:"flex",height:"100vh",background:"#f3f3f3",fontFamily:"'Segoe UI',system-ui,sans-serif",overflow:"hidden"}}>
        <ClearModal/>
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
          <div style={{...P.topbar,background:posGrad}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <button onClick={function(){setScreen("home");}} style={{...P.tbBtn,padding:"6px 10px",fontSize:16}}>←</button>
              <div style={{width:36,height:36,borderRadius:8,overflow:"hidden",background:"rgba(255,255,255,0.15)",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Logo size={36} round={true}/>
              </div>
              <div>
                <div style={{color:"#fff",fontWeight:800,fontSize:15,letterSpacing:1}}>CHEF ROOSTER</div>
                <div style={{color:"rgba(255,255,255,0.65)",fontSize:10}}>{posIsTbl?"TABLE "+selTbl+" — DINE IN":"TAKEAWAY — "+posRef}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{background:"rgba(255,255,255,0.15)",borderRadius:8,padding:"4px 10px",fontSize:11,color:"#fff",fontWeight:700}}>{posIsTbl?"🍽️":"🛍️"} {posRef}</div>
              <button onClick={goReports} style={P.tbBtn}>📊</button>
            </div>
          </div>
          <div style={{background:"#fff",borderBottom:"1px solid #eee",overflowX:"auto",display:"flex",flexShrink:0,scrollbarWidth:"none"}}>
            {Object.keys(MENU).map(function(c){
              return (
                <button key={c} onClick={function(){setCat(c);}}
                  style={{padding:"10px 12px",border:"none",background:"transparent",cursor:"pointer",whiteSpace:"nowrap",fontSize:11,fontWeight:700,color:cat===c?posAc:"#888",borderBottom:"3px solid "+(cat===c?posAc:"transparent")}}>
                  {CICONS[c]} {c}
                </button>
              );
            })}
          </div>
          <div style={{flex:1,overflowY:"auto",padding:10,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(128px,1fr))",gap:8,alignContent:"start"}}>
            {MENU[cat].map(function(item){
              var inCart=cart.find(function(i){return i.id===item.id;});
              var dp=getPrice(item);
              return (
                <button key={item.id} onClick={function(){addItem(item);}}
                  style={{border:"2px solid "+(inCart?posAc:"#e8e8e8"),borderRadius:14,padding:"12px 9px 10px",background:"#fff",cursor:"pointer",textAlign:"left",position:"relative",boxShadow:inCart?"0 4px 14px "+posAc+"25":"0 1px 5px rgba(0,0,0,0.05)"}}>
                  {inCart&&<div style={{position:"absolute",top:7,right:7,background:posAc,color:"#fff",borderRadius:"50%",width:20,height:20,fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{inCart.qty}</div>}
                  <div style={{fontSize:9,color:"#c0c0c0",marginBottom:3,textTransform:"uppercase",letterSpacing:0.5}}>{cat}</div>
                  <div style={{fontSize:11,fontWeight:700,color:"#1a1a1a",lineHeight:1.3,marginBottom:7}}>{item.name}</div>
                  <div style={{fontSize:13,fontWeight:800,color:posAc}}>Rs. {dp.toLocaleString()}</div>
                </button>
              );
            })}
          </div>
        </div>
        <div style={{width:265,background:"#fff",borderLeft:"1px solid #ececec",display:"flex",flexDirection:"column",flexShrink:0}}>
          <div style={{padding:"12px 14px 10px",borderBottom:"1px solid #f2f2f2",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontWeight:700,fontSize:14,color:"#1a1a1a"}}>{posIsTbl?"Table "+selTbl:posRef} Order</div>
              <div style={{fontSize:11,color:"#bbb"}}>{count} item{count!==1?"s":""}{posOpenedAt?" · "+elapsed(posOpenedAt):""}</div>
            </div>
            {cart.length>0&&(
              <button onClick={function(){askClear((posIsTbl?"Table "+selTbl:posRef)+" — All Items",clearCart);}}
                style={{fontSize:11,color:"#e55",background:"#fff3f3",border:"1px solid #fecaca",borderRadius:7,padding:"4px 9px",cursor:"pointer",fontWeight:700}}>
                ✕ Clear
              </button>
            )}
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"8px 10px"}}>
            {!cart.length?(
              <div style={{textAlign:"center",padding:"36px 14px",color:"#e0e0e0"}}>
                <div style={{fontSize:40}}>{posIsTbl?"🍽️":"🛍️"}</div>
                <div style={{fontSize:12,marginTop:10}}>Tap items to add to {posRef}</div>
              </div>
            ):cart.map(function(item){
              return (
                <div key={item.id} style={{display:"flex",alignItems:"center",gap:5,marginBottom:7,padding:"9px 8px",background:"#f9f9f9",borderRadius:11}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#1a1a1a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                    <div style={{fontSize:10,color:"#bbb"}}>Rs. {item.price.toLocaleString()} each</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                    <button onClick={function(){adj(item.id,-1);}} style={{width:24,height:24,borderRadius:"50%",border:"1.5px solid "+posAc,background:"#fff",color:posAc,cursor:"pointer",fontSize:14,fontWeight:800,lineHeight:1,padding:0,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                    <span style={{fontSize:12,fontWeight:700,minWidth:14,textAlign:"center"}}>{item.qty}</span>
                    <button onClick={function(){adj(item.id,1);}} style={{width:24,height:24,borderRadius:"50%",border:"none",background:posAc,color:"#fff",cursor:"pointer",fontSize:14,fontWeight:800,lineHeight:1,padding:0,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                  </div>
                  <div style={{fontSize:11,fontWeight:700,color:posAc,minWidth:46,textAlign:"right",flexShrink:0}}>Rs.{(item.price*item.qty).toLocaleString()}</div>
                </div>
              );
            })}
          </div>
          <div style={{padding:13,borderTop:"1px solid #f2f2f2"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:12}}>
              <span style={{fontSize:14,fontWeight:600,color:"#555"}}>Total</span>
              <span style={{fontSize:22,fontWeight:800,color:posAc}}>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <button onClick={function(){setPayStep("choose");setCashAmt("");setDiscValue("");setShowDisc(false);setDiscType("percent");setScreen("payment");}} disabled={!cart.length}
              style={{width:"100%",padding:14,background:cart.length?posGrad:"#e8e8e8",border:"none",borderRadius:12,cursor:cart.length?"pointer":"not-allowed",fontSize:14,fontWeight:800,color:"#fff",letterSpacing:0.4}}>
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
  var occupiedTbls = tables.filter(function(t){return t.cart.length>0;}).length;
  var liveTableRev = tables.reduce(function(s,t){return s+t.cart.reduce(function(ss,i){return ss+i.price*i.qty;},0);},0);
  var liveTARev    = takeaways.reduce(function(s,t){return s+t.cart.reduce(function(ss,i){return ss+i.price*i.qty;},0);},0);
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
          <button onClick={function(){setScreen("settings");}} style={P.tbBtn}>⚙️</button>
        </div>
      </div>
      <div style={{display:"flex",background:"#fff",borderBottom:"2px solid #eee",flexShrink:0}}>
        {[["🍽️","Dine In","tables"],["🛍️","Takeaway","takeaway"]].map(function(item){
          return (
            <button key={item[2]} onClick={function(){setHomeTab(item[2]);}}
              style={{flex:1,padding:"13px 0",border:"none",background:"transparent",cursor:"pointer",fontSize:14,fontWeight:700,
                color:homeTab===item[2]?(item[2]==="tables"?RED:AMB):"#aaa",
                borderBottom:"3px solid "+(homeTab===item[2]?(item[2]==="tables"?RED:AMB):"transparent"),transition:"all .15s"}}>
              {item[0]} {item[1]}
              {item[2]==="tables"&&occupiedTbls>0&&<span style={{marginLeft:8,background:RED,color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:800}}>{occupiedTbls}</span>}
              {item[2]==="takeaway"&&takeaways.length>0&&<span style={{marginLeft:8,background:AMB,color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:800}}>{takeaways.length}</span>}
            </button>
          );
        })}
      </div>
      {homeTab==="tables"&&(
        <>
          <div style={{display:"flex",gap:16,padding:"8px 16px",background:"#fff",borderBottom:"1px solid #eee",flexShrink:0,alignItems:"center"}}>
            {[["Available",NUM_TABLES-occupiedTbls,"#16a34a"],["Occupied",occupiedTbls,RED]].map(function(item){
              return (
                <div key={item[0]} style={{display:"flex",alignItems:"center",gap:5,fontSize:12}}>
                  <div style={{width:9,height:9,borderRadius:"50%",background:item[2]}}/>
                  <span style={{color:"#777"}}>{item[0]}:</span>
                  <span style={{fontWeight:700,color:item[2]}}>{item[1]}</span>
                </div>
              );
            })}
            {liveTableRev>0&&<div style={{marginLeft:"auto",fontSize:12,color:RED,fontWeight:700}}>Live: Rs. {liveTableRev.toLocaleString()}</div>}
          </div>
          <div style={{flex:1,overflowY:"auto",padding:12,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))",gap:10,alignContent:"start"}}>
            {tables.map(function(t){
              var occ=t.cart.length>0;
              var tTot=t.cart.reduce(function(s,i){return s+i.price*i.qty;},0);
              var tCnt=t.cart.reduce(function(s,i){return s+i.qty;},0);
              var time=elapsed(t.openedAt);
              return (
                <div key={t.id} style={{background:"#fff",border:"2px solid "+(occ?RED:"#e5e5e5"),borderRadius:16,overflow:"hidden",boxShadow:occ?"0 4px 16px "+RED+"20":"0 1px 5px rgba(0,0,0,0.05)"}}>
                  <button onClick={function(){setSelTbl(t.id);setMode("table");setCat(Object.keys(MENU)[0]);setScreen("pos");}}
                    style={{width:"100%",padding:"14px 13px 10px",cursor:"pointer",textAlign:"left",background:"transparent",border:"none"}}>
                    <div style={{position:"relative"}}>
                      <div style={{position:"absolute",top:0,right:0,width:9,height:9,borderRadius:"50%",background:occ?RED:"#22c55e"}}/>
                      <div style={{fontSize:10,color:"#c0c0c0",textTransform:"uppercase",letterSpacing:1,marginBottom:4,fontWeight:600}}>Table</div>
                      <div style={{fontSize:32,fontWeight:900,color:occ?RED:"#d5d5d5",lineHeight:1,marginBottom:7,letterSpacing:-1}}>{t.id}</div>
                      {occ?(
                        <div>
                          <div style={{background:RED+"10",borderRadius:7,padding:"6px 8px",marginBottom:4}}>
                            <div style={{fontSize:13,fontWeight:800,color:RED}}>Rs. {tTot.toLocaleString()}</div>
                            <div style={{fontSize:10,color:"#e07070"}}>{tCnt} item{tCnt!==1?"s":""}</div>
                          </div>
                          {time&&<div style={{fontSize:10,color:"#bbb"}}>⏱ {time}</div>}
                        </div>
                      ):<div style={{fontSize:11,color:"#bbb",fontWeight:500}}>Available</div>}
                    </div>
                  </button>
                  {occ&&(
                    <button onClick={function(){askClear("Table "+t.id,function(){clearTableFromHome(t.id);});}}
                      style={{width:"100%",padding:"7px 0",background:"#fff3f3",border:"none",borderTop:"1px solid #fecaca",cursor:"pointer",fontSize:11,fontWeight:700,color:"#e55",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                      🔐 Remove Order
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
      {homeTab==="takeaway"&&(
        <>
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
              {takeaways.map(function(ta){
                var tTot=ta.cart.reduce(function(s,i){return s+i.price*i.qty;},0);
                var tCnt=ta.cart.reduce(function(s,i){return s+i.qty;},0);
                var time=elapsed(ta.createdAt);
                return (
                  <div key={ta.id} style={{background:"#fff",border:"2px solid "+AMB,borderRadius:16,overflow:"hidden",boxShadow:"0 4px 18px "+AMB+"20"}}>
                    <button onClick={function(){setSelTA(ta.id);setMode("takeaway");setCat(Object.keys(MENU)[0]);setScreen("pos");}}
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
                    <button onClick={function(){askClear("Takeaway "+ta.taNum,function(){removeTAFromHome(ta.id);});}}
                      style={{width:"100%",padding:"8px 0",background:"#fff8ee",border:"none",borderTop:"1px solid #fde68a",cursor:"pointer",fontSize:11,fontWeight:700,color:"#b45309",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                      🔐 Cancel Order
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}