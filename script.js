/* Gusto Pizzeria - script.js
   Implements menu rendering, cart, quests, dark-mode secret, and verification tracking.
*/
const LS_QUESTS = 'gusto.quests.v1'
const LS_ORDERS = 'gusto.orders'
const LS_LAST_CHALLENGE = 'gusto.last_challenge_order'
const QUEST_LIMITS = {toggles:3,orders:15,badgeClicks:3}
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80'

// Sample data
const data = {
  categories: [
    {id:'classics', title:'Classics', items:[
      {id:'marg',title:'Margherita',price:9.5,desc:'San Marzano tomatoes simmered with garlic, creamy fresh mozzarella, torn basil, extra-virgin olive oil and sea salt.',img:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80'},
      {id:'pep',title:'Pepperoni',price:11,desc:'Crisp-edged pepperoni layered over house tomato sauce with whole-milk mozzarella, oregano and chili oil.',img:'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80'},
      {id:'four-cheese',title:'Four Cheese',price:12,desc:'A rich blend of mozzarella, gorgonzola, provolone and aged parmesan finished with cracked black pepper.',img:'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80'},
      {id:'stagioni',title:'Quattro Stagioni',price:14,desc:'Four quarters with marinated artichokes, roasted mushrooms, prosciutto cotto, olives and mozzarella.',img:'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80'},
      {id:'calzone',title:'Calzone',price:12,desc:'Folded pizza dough filled with ricotta, mozzarella, ham, basil and tomato sauce, baked until golden.',img:'https://images.unsplash.com/photo-1593560708920-61dd98c8c8c7?auto=format&fit=crop&w=900&q=80'},
      {id:'marinara',title:'Marinara',price:8.5,desc:'A simple Neapolitan classic with San Marzano tomato, roasted garlic, oregano, basil and olive oil.',img:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80'}
    ]},
    {id:'special', title:'Specialties', items:[
      {id:'truf',title:'Truffle Mushroom',price:15,desc:'Roasted wild mushrooms, ricotta, mozzarella, thyme and fragrant white truffle oil over a thin, blistered crust.',img:'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80'},
      {id:'bbq',title:'BBQ Chicken',price:13,desc:'Smoky barbecue sauce, grilled chicken, red onion, mozzarella, cilantro and a bright lime finish.',img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80'},
      {id:'diavola',title:'Diavola',price:13.5,desc:'Spicy Calabrian salami, roasted peppers, mozzarella, chili flakes and a drizzle of hot honey.',img:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80'},
      {id:'prosciutto',title:'Prosciutto & Rocket',price:15,desc:'Silky prosciutto, peppery rocket, shaved parmesan and balsamic glaze over warm mozzarella.',img:'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80'},
      {id:'pesto-chicken',title:'Pesto Chicken',price:14.5,desc:'Basil pesto, roast chicken, mozzarella, cherry tomatoes and parmesan with a lemony finish.',img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80'},
      {id:'fiorentina',title:'Fiorentina',price:13.5,desc:'Spinach, egg, garlic, mozzarella and pecorino on a bright tomato base with cracked pepper.',img:'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80'}
    ]},
    {id:'sides', title:'Sides & Drinks', items:[
      {id:'garlic',title:'Garlic Knots (6)',price:5,desc:'Six pillowy knots baked with parmesan, parsley and roasted garlic butter, served with warm marinara for dipping.',img:'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?auto=format&fit=crop&w=900&q=80'},
      {id:'cola',title:'House Cola',price:2.5,desc:'A chilled glass bottle of crisp house cola with caramel notes and a clean citrus finish.',img:'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=900&q=80'},
      {id:'mozzarella',title:'Mozzarella Sticks',price:7,desc:'Hand-cut mozzarella breaded with seasoned crumbs, fried until crisp and paired with warm tomato dipping sauce.',img:'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?auto=format&fit=crop&w=900&q=80'},
      {id:'soda',title:'Italian Soda',price:4,desc:'Refreshing sparkling water mixed with house citrus syrup, ice and a twist of fresh lemon.',img:'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80'},
      {id:'tiramisu',title:'Tiramisu',price:6,desc:'Espresso-soaked ladyfingers layered with whipped mascarpone cream and dusted generously with cocoa.',img:'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80'},
      {id:'focaccia',title:'Garlic Focaccia',price:6.5,desc:'Warm, airy focaccia brushed with roasted garlic oil, rosemary, flaky salt and grated parmesan.',img:'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80'},
      {id:'san-pellegrino',title:'San Pellegrino Sparkling Water',price:3.5,desc:'Chilled Italian sparkling mineral water with fine bubbles and a clean, refreshing finish.',img:'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80'}
    ]},
    {id:'pastas', title:'Pastas & Lasagna', items:[
      {id:'lasagna',title:'Lasagna Bolognese',price:15,desc:'Layered pasta, slow-simmered beef and pork ragù, ricotta, mozzarella and parmesan baked until bubbling.',img:'https://images.unsplash.com/photo-1574869878975-9f5c2b9f6b6b?auto=format&fit=crop&w=900&q=80'},
      {id:'baked-penne',title:'Baked Penne',price:13.5,desc:'Penne tossed in tomato sauce with Italian sausage, basil, ricotta and mozzarella, then baked golden.',img:'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?auto=format&fit=crop&w=900&q=80'},
      {id:'alfredo',title:'Fettuccine Alfredo',price:14,desc:'Fresh fettuccine coated in parmesan cream sauce with butter, cracked pepper and parsley.',img:'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=900&q=80'},
      {id:'carbonara',title:'Carbonara',price:14.5,desc:'Silky egg and pecorino sauce with crisp pancetta, black pepper and bronze-cut spaghetti.',img:'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=900&q=80'}
    ]},
    {id:'paninis', title:'Gourmet Sandwiches / Paninis', items:[
      {id:'chicken-parm-sub',title:'Chicken Parm Sub',price:11.5,desc:'Crispy chicken cutlet, marinara, melted mozzarella and parmesan in a toasted Italian roll.',img:'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=80'},
      {id:'italian-combo',title:'Italian Combo Panini',price:12,desc:'Prosciutto, salami, mortadella, provolone, tomato and shredded lettuce pressed with oregano.',img:'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80'},
      {id:'meatball-hero',title:'Meatball Hero',price:11,desc:'House beef and pork meatballs, marinara, melted provolone and basil in a toasted hero roll.',img:'https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&w=900&q=80'}
    ]},
    {id:'salads', title:'Salads & Starters', items:[
      {id:'caesar',title:'Caesar Salad',price:8.5,desc:'Crisp romaine, parmesan, toasted garlic croutons and creamy house Caesar dressing.',img:'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=900&q=80'},
      {id:'caprese',title:'Caprese Salad',price:9.5,desc:'Fresh mozzarella, ripe tomatoes, basil leaves, extra-virgin olive oil and aged balsamic.',img:'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=900&q=80'},
      {id:'wings',title:'Buffalo Wings (10pcs)',price:11,desc:'Ten crispy chicken wings tossed in spicy buffalo sauce with cool blue cheese dressing.',img:'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=900&q=80'},
      {id:'calamari',title:'Calamari Fritti',price:12.5,desc:'Tender calamari lightly coated and fried crisp, served with lemon, parsley and marinara.',img:'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=80'}
    ]},
    {id:'desserts', title:'Desserts', items:[
      {id:'cannoli',title:'Cannoli (2pcs)',price:5.5,desc:'Two crisp pastry shells filled with sweet ricotta cream, chocolate chips and candied orange.',img:'https://images.unsplash.com/photo-1607920592519-7c6e4c5a2a69?auto=format&fit=crop&w=900&q=80'},
      {id:'nutella-pizza',title:'Nutella Pizza',price:10,desc:'Warm, wood-fired pizza dough spread with Nutella, hazelnuts, powdered sugar and strawberries.',img:'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80'},
      {id:'gelato',title:'Italian Gelato',price:4.5,desc:'A generous scoop of dense Italian gelato, with rotating flavors from pistachio to stracciatella.',img:'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80'}
    ]},
    {id:'underground', title:'Underground', items:[
      {id:'godfather-xl',title:'The Godfather 28-Inch XL Sheet Pizza',price:45,desc:'A massive sheet pizza layered with tomato, mozzarella, pepperoni, sausage, peppers, onions and mushrooms for the ultimate table challenge.',img:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80'},
      {id:'inferno-reaper',title:'Inferno Reaper Calzone Challenge',price:28,desc:'A giant folded calzone packed with spicy salami, mozzarella, roasted peppers and Carolina Reaper sauce.',img:'https://images.unsplash.com/photo-1593560708920-61dd98c8c8c7?auto=format&fit=crop&w=900&q=80'},
      {id:'monster-meatball',title:'Monster 5lb Meatball Hero',price:32,desc:'A five-pound hero filled with oversized beef and pork meatballs, marinara, melted provolone and parmesan.',img:'https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&w=900&q=80'},
      {id:'titanic-wings',title:'The Titanic 100-Wing Reaper Roulette',price:40,desc:'One hundred crispy wings in a roulette of classic buffalo, ghost pepper and Carolina Reaper sauces.',img:'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=900&q=80'},
      {id:'diablo-sicilian',title:'Spicy Diablo Sicilian Sheet Challenge',price:38,desc:'A thick Sicilian sheet loaded with spicy salami, Calabrian chili, roasted peppers, hot sausage and mozzarella.',img:'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80'}
    ]}
  ]
}

const challenges = [
  {id:'big-spender',title:'Big Spender',desc:'Place an order ≥ $100 in a single checkout.',reward:'Unlocked!'},
  {id:'order-count',title:'Frequent Fan',desc:'Place 15 total orders across sessions.',reward:'Unlocked!'},
  {id:'theme-lover',title:'Night Owl',desc:'Switch Dark mode 3 times and tap the footer crest.',reward:'Unlocked!'}
]

// Utilities
const el = (tag, props={}, ...children)=>{
  const e = document.createElement(tag)
  Object.entries(props).forEach(([k,v])=>{
    if(k==='class') e.className=v
    else if(k.startsWith('data-')) e.setAttribute(k,v)
    else if(k==='html') e.innerHTML=v
    else if(k==='on') Object.entries(v).forEach(([ev,fn])=>e.addEventListener(ev,fn))
    else e[k]=v
  })
  children.flat().filter(Boolean).forEach(c=>e.append(typeof c==='string'?document.createTextNode(c):c))
  return e
}

// State
let cart = []
let quests = loadQuests()
let orders = loadOrders()
let countdownTimer = null
const expandedItemIds = new Set()

function loadQuests(){
  try{
    const q=JSON.parse(localStorage.getItem(LS_QUESTS))||{}
    return {toggles:Math.min(QUEST_LIMITS.toggles,q.toggles||0),orders:Math.min(QUEST_LIMITS.orders,q.orders||0),bigOrder:Boolean(q.bigOrder),badgeClicks:Math.min(QUEST_LIMITS.badgeClicks,q.badgeClicks||0)}
  } catch(e){return {toggles:0,orders:0,bigOrder:false,badgeClicks:0}}
}
function saveQuests(){localStorage.setItem(LS_QUESTS,JSON.stringify(quests))}
function loadOrders(){try{return JSON.parse(localStorage.getItem(LS_ORDERS))||[]}catch(e){return[]}}
function saveOrders(){localStorage.setItem(LS_ORDERS,JSON.stringify(orders))}

// Rendering
function setupCategoryAccordions(){
  document.querySelectorAll('.category-section-block').forEach((section,index)=>{
    const toggle = section.querySelector('.category-toggle')
    const list = section.querySelector('.menu-list')
    const open = !section.classList.contains('underground-category')
    section.classList.toggle('is-open',open)
    toggle.setAttribute('aria-expanded',String(open))
    toggle.addEventListener('click',()=>{
      if(section.classList.contains('is-locked')) return
      const nextOpen = toggle.getAttribute('aria-expanded') !== 'true'
      toggle.setAttribute('aria-expanded',String(nextOpen))
      section.classList.toggle('is-open',nextOpen)
      list.setAttribute('aria-hidden',String(!nextOpen))
    })
  })
}

function createFoodImage(item){
  if(!item.img) return el('div',{class:'food-img image-fallback','aria-label':`${item.title} image unavailable`},'🍕')
  return el('img',{class:'food-img',src:item.img,alt:item.title,loading:'lazy',on:{error:(event)=>{
    event.target.onerror = null
    event.target.src = FALLBACK_IMAGE
  }}})
}

function priceForSize(basePrice,size){
  return basePrice + (size === 'M' ? 3 : size === 'L' ? 6 : 0)
}

function toggleExpandedItem(itemId){
  if(expandedItemIds.has(itemId)) expandedItemIds.delete(itemId)
  else expandedItemIds.add(itemId)
  syncExpandedCards()
}

function expandItem(itemId){
  expandedItemIds.add(itemId)
  syncExpandedCards()
}

function syncExpandedCards(){
  document.querySelectorAll('.accordion').forEach(card=>{
    const isExpanded = expandedItemIds.has(card.dataset.itemId)
    card.classList.toggle('expanded',isExpanded)
    card.querySelector('.accordion-header').setAttribute('aria-expanded',String(isExpanded))
    card.querySelector('.desc').classList.toggle('expanded',isExpanded)
    card.querySelector('.card-chevron').setAttribute('aria-expanded',String(isExpanded))
  })
}

function renderProducts(){
  // populate each category section container
  data.categories.forEach(cat=>{
    const container = document.querySelector(`.menu-list[data-cat="${cat.id}"]`)
    if(!container) return
    container.innerHTML=''
    cat.items.forEach(item=>{
      let selectedSize = 'S'
      const priceBadge = el('span',{class:'price-badge'},`$${priceForSize(item.price,selectedSize).toFixed(2)}`)
      const addSelectedItem = ()=>addToCart({...item,price:priceForSize(item.price,selectedSize),category:cat.id},selectedSize)
      const sizeButtons = ['S','M','L'].map(size=>el('button',{class:size === selectedSize ? 'active' : '',ariaPressed:size === selectedSize,on:{click:(e)=>{
        e.stopPropagation()
        selectedSize = size
        priceBadge.textContent = `$${priceForSize(item.price,size).toFixed(2)}`
        sizeButtons.forEach(button=>{const isSelected = button.textContent === size;button.classList.toggle('active',isSelected);button.setAttribute('aria-pressed',String(isSelected))})
      }}},size))
      const header = el('div',{class:'accordion-header'},el('div',{},el('strong',{},item.title),priceBadge),el('div',{class:'size-select'},sizeButtons))
      const body = el('div',{class:'accordion-body'},
        el('div',{class:'desc'},item.desc),
        createFoodImage(item)
      )
      const actions = el('div',{class:'actions'},el('button',{class:'add-btn',on:{click:(e)=>{e.stopPropagation();addSelectedItem()} }},'Add to Order'),el('button',{class:'card-chevron',ariaLabel:`Expand ${item.title}`,ariaExpanded:false,on:{click:(e)=>{e.stopPropagation();toggleExpandedItem(item.id)} }},'▾'))
      const acc = el('div',{class:'accordion'},header,body,actions)
      // toggle
      header.setAttribute('role','button')
      header.setAttribute('tabindex','0')
      header.setAttribute('aria-expanded','false')
      acc.dataset.itemId = item.id
      header.addEventListener('click',()=>{
        toggleExpandedItem(item.id)
      })
      body.addEventListener('click',()=>toggleExpandedItem(item.id))
      header.addEventListener('keydown',(e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); header.click() } })
      container.appendChild(acc)
    })
  })
}

function renderChallenges(){
  const section = document.getElementById('challenges-section')
  const grid = document.getElementById('challenges-grid')
  grid.innerHTML=''
  const visible = isSecretVisible()
  const underground = document.getElementById('underground')
  const questState = getQuestState(quests)
  const undergroundUnlocked = checkIsUnlocked(questState)
  const remainingQuests = getRemainingQuestCount(questState)
  const maxOrder = getMaxOrderTotal()
  underground.style.display = visible ? 'block' : 'none'
  underground.setAttribute('aria-hidden',String(!visible))
  underground.classList.toggle('is-locked',!undergroundUnlocked)
  underground.classList.toggle('is-unlocked',undergroundUnlocked)
  const undergroundToggle = underground.querySelector('.category-toggle')
  const undergroundIcon = underground.querySelector('.underground-status-icon')
  const undergroundProgress = document.getElementById('underground-progress')
  undergroundToggle.disabled = !undergroundUnlocked
  undergroundToggle.setAttribute('aria-disabled',String(!undergroundUnlocked))
  undergroundIcon.textContent = undergroundUnlocked ? '✅' : '🔒'
  undergroundProgress.textContent = undergroundUnlocked ? '0 challenge quests remaining (Unlocked!)' : `${remainingQuests} challenge quests remaining`
  // populate cards (hidden via overlay until unlocked)
  challenges.forEach(c=>{
    const complete = isChallengeUnlocked(c.id)
    const status = getChallengeStatus(c.id,complete,maxOrder)
    const spoiler = el('div',{class:'spoiler-mask',role:'button',tabindex:'0',on:{click:event=>event.currentTarget.classList.add('revealed'),keydown:event=>{
      if(event.key==='Enter' || event.key===' '){event.preventDefault();event.currentTarget.classList.add('revealed')}
    }}},el('p',{},c.desc),el('div',{class:'status-footer'},status))
    spoiler.setAttribute('aria-label',`Reveal ${c.title} challenge details`)
    const card = el('div',{class:`challenge ${complete?'complete':'locked'}`},el('h3',{},c.title),spoiler)
    grid.appendChild(card)
  })

  // show only in Dark Mode
  section.style.display = visible ? 'block' : 'none'
  section.setAttribute('aria-hidden', String(!visible))

  section.classList.remove('locked')
}

function getChallengeStatus(id,complete,maxOrder){
  if(id==='big-spender') return complete ? `STATUS: COMPLETE ✅ ($${maxOrder.toFixed(2)} Reached)` : `STATUS: PENDING 🔒 (MAX ORDER: $${maxOrder.toFixed(2)} / $100)`
  if(id==='order-count') return complete ? 'STATUS: COMPLETE ✅ (ORDERS: 15 / 15)' : `STATUS: PENDING 🔒 (ORDERS: ${quests.orders} / 15)`
  if(id==='theme-lover') return complete ? 'STATUS: COMPLETE ✅ (TOGGLES: 3 / 3 • TAPS: 3 / 3)' : `STATUS: PENDING 🔒 (TOGGLES: ${quests.toggles} / 3 • TAPS: ${quests.badgeClicks} / 3)`
  return complete ? 'STATUS: COMPLETE ✅' : 'STATUS: PENDING 🔒'
}

function getMaxOrderTotal(){
  return orders.reduce((max,order)=>Math.max(max,Number(order.total)||0),0)
}

// Cart
function addToCart(item,size='M'){
  const entry = {...item,size,qty:1}
  cart.push(entry)
  updateCartUI()
}
function updateCartUI(){
  const itemsEl = document.getElementById('cart-items')
  const countEl = document.querySelector('.cart-count')
  if(cart.length===0) itemsEl.textContent='Cart is empty'
  else{
    itemsEl.innerHTML=''
    cart.forEach((it,idx)=>{
      const row = el('div',{class:'cart-row'}, `${it.title} (${it.size}) - $${it.price.toFixed(2)} `, el('button',{on:{click:()=>{cart.splice(idx,1);updateCartUI()}},class:'icon cart-remove',title:`Remove ${it.title}`,ariaLabel:`Remove ${it.title}`},'🗑️'))
      itemsEl.appendChild(row)
    })
  }
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0)
  document.getElementById('cart-total').textContent=`$${total.toFixed(2)}`
  countEl.textContent = String(cart.length)
}

// Checkout / Orders
function checkout(){
  if(cart.length===0){alert('Cart empty');return}
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0)
  const order = {id:Date.now(),items:cart,total,created:new Date().toISOString(),verified:false}
  orders.push(order);saveOrders()
  // update quests
  quests.orders = Math.min(QUEST_LIMITS.orders,quests.orders + 1)
  if(total>=100) quests.bigOrder = true
  checkQuestCompletion()
  if(cart.some(item=>item.category==='underground')) startChallengeWindow(order)
  cart = []
  updateCartUI()
  if(order.items.some(item=>item.category==='underground')) openOrderTracking(order.id)
}

function startChallengeWindow(order){
  localStorage.setItem(LS_LAST_CHALLENGE, JSON.stringify({orderId:order.id,deadline: Date.now()+30*60*1000}))
  openOrderTracking(order.id)
}

// Order Tracking UI
function openOrderTracking(orderId){
  const panel = document.getElementById('order-tracking')
  panel.classList.remove('hidden')
  panel.setAttribute('aria-hidden','false')
  const last = JSON.parse(localStorage.getItem(LS_LAST_CHALLENGE)||'null')
  if(!last){document.getElementById('track-info').textContent='No active order';return}
  const order = orders.find(o=>o.id===last.orderId)
  document.getElementById('track-info').textContent = order?`Order #${order.id} • $${order.total.toFixed(2)}`:'Order data missing'
  startCountdown(last.deadline)
}
function closeOrderTracking(){
  const panel = document.getElementById('order-tracking')
  panel.classList.add('hidden')
  panel.setAttribute('aria-hidden','true')
  if(countdownTimer) clearInterval(countdownTimer)
}
function startCountdown(deadline){
  const out = document.getElementById('countdown')
  function tick(){
    const left = Math.max(0, deadline - Date.now())
    const mm = String(Math.floor(left/60000)).padStart(2,'0')
    const ss = String(Math.floor((left%60000)/1000)).padStart(2,'0')
    out.textContent = `${mm}:${ss}`
    if(left<=0){clearInterval(countdownTimer);out.textContent='00:00';localStorage.removeItem(LS_LAST_CHALLENGE)}
  }
  tick(); if(countdownTimer) clearInterval(countdownTimer);countdownTimer=setInterval(tick,1000)
}

// Challenges / Quests
function isChallengeUnlocked(id){
  if(id==='big-spender') return quests.bigOrder
  if(id==='order-count') return quests.orders>=15
  if(id==='theme-lover') return (quests.toggles>=3 && quests.badgeClicks>=3)
  return false
}
function isSecretVisible(){
  return document.documentElement.classList.contains('dark')
}

function getQuestState(state){
  return {orders:state.orders,toggles:state.toggles,badgeTaps:state.badgeClicks,bigSpender:state.bigOrder}
}

function checkIsUnlocked(state){
  const metricsComplete = state.orders >= 15 && state.toggles >= 3 && state.badgeTaps >= 3
  return metricsComplete && state.bigSpender === true
}

function getRemainingQuestCount(state){
  return [
    state.orders >= 15,
    state.toggles >= 3,
    state.badgeTaps >= 3,
    state.bigSpender === true
  ].filter(complete=>!complete).length
}

function checkQuestCompletion(){
  saveQuests()
  renderChallenges()
  return checkIsUnlocked(getQuestState(quests))
}

// Theme
function toggleTheme(){
  const root = document.documentElement
  const dark = root.classList.toggle('dark')
  updateThemeIcons(dark)
  quests.toggles = Math.min(QUEST_LIMITS.toggles,(quests.toggles||0) + 1)
  checkQuestCompletion()
}

function updateThemeIcons(dark=document.documentElement.classList.contains('dark')){
  document.querySelectorAll('.theme-toggle').forEach(button=>{
    button.textContent = dark ? '☀️' : '🌙'
    button.setAttribute('aria-label',dark ? 'Switch to light mode' : 'Switch to dark mode')
  })
}

// Footer badge
function handleBadgeClick(){
  quests.badgeClicks = Math.min(QUEST_LIMITS.badgeClicks,(quests.badgeClicks||0)+1)
  checkQuestCompletion()
  // subtle feedback
  const old = document.getElementById('discreet-badge')
  old.animate([{transform:'scale(1)'},{transform:'scale(1.15)'},{transform:'scale(1)'}],{duration:250})
  if(isChallengeUnlocked('theme-lover')) setTimeout(()=>alert('Night Owl quest complete — Underground unlocked!'),120)
}

// Search
function setupSearch(){
  const s = document.getElementById('search-input')
  const dropdown = document.getElementById('search-dropdown')
  const searchableItems = ()=>data.categories.flatMap(category=>category.items.map(item=>({...item,categoryId:category.id,categoryTitle:category.title}))).filter(item=>item.categoryId !== 'underground' || (isSecretVisible() && checkIsUnlocked(getQuestState(quests))))
  const closeDropdown = ()=>{
    dropdown.classList.remove('is-visible')
    dropdown.innerHTML = ''
  }
  const renderResults = query=>{
    dropdown.innerHTML = ''
    if(!query){closeDropdown();return}
    const matches = searchableItems().filter(item=>`${item.title} ${item.desc} ${item.categoryTitle}`.toLowerCase().includes(query)).slice(0,12)
    if(!matches.length){
      dropdown.appendChild(el('div',{class:'search-empty'},'No menu items found'))
    } else {
      matches.forEach(item=>{
        const result = el('button',{class:'search-result',role:'option',on:{click:()=>{
          const section = document.getElementById(item.categoryId)
          const card = Array.from(section.querySelectorAll('.accordion')).find(candidate=>candidate.dataset.itemId===item.id)
          if(!card) return
          section.classList.add('is-open')
          section.querySelector('.category-toggle').setAttribute('aria-expanded','true')
          expandItem(item.id)
          closeDropdown()
          s.value = ''
          card.scrollIntoView({behavior:'smooth',block:'center'})
        }}},el('span',{class:'search-result-copy'},el('span',{class:'search-result-title'},item.title),el('span',{class:'search-result-category'},item.categoryTitle)),el('span',{class:'search-result-price'},`$${priceForSize(item.price,'S').toFixed(2)}`))
        dropdown.appendChild(result)
      })
    }
    dropdown.classList.add('is-visible')
  }
  s.addEventListener('input',()=>{
    renderResults(s.value.trim().toLowerCase())
  })
  s.addEventListener('keydown',event=>{if(event.key==='Escape') closeDropdown()})
  document.addEventListener('click',event=>{if(!event.target.closest('.search-wrap')) closeDropdown()})
}

// Photo upload (client-only preview & mark verified)
function setupPhotoUpload(){
  const input = document.getElementById('photo-input')
  input.addEventListener('change',(ev)=>{
    const f = ev.target.files && ev.target.files[0]
    if(!f) return
    const reader = new FileReader()
    reader.onload = ()=>{
      document.getElementById('upload-status').innerHTML = `<img src="${reader.result}" style="max-width:100%;border-radius:8px" alt="upload preview"/>\nSubmitted (mock). Verification complete.`
      // mark current order verified
      const last = JSON.parse(localStorage.getItem(LS_LAST_CHALLENGE)||'null')
      if(last){
        const order = orders.find(o=>o.id===last.orderId)
        if(order){order.verified=true;saveOrders();localStorage.removeItem(LS_LAST_CHALLENGE);clearInterval(countdownTimer);document.getElementById('countdown').textContent='Verified'}
      }
    }
    reader.readAsDataURL(f)
  })
}

// Wire up UI
function bootstrap(){
  setupCategoryAccordions()
  renderProducts();
  renderChallenges();
  updateCartUI()
  setupSearch();setupPhotoUpload()
  updateThemeIcons()
  // buttons
  document.getElementById('cart-btn').addEventListener('click',()=>{const d=document.getElementById('cart-drawer');d.classList.remove('hidden');d.setAttribute('aria-hidden','false')})
  document.getElementById('cart-close').addEventListener('click',()=>{const d=document.getElementById('cart-drawer');d.classList.add('hidden');d.setAttribute('aria-hidden','true')})
  document.getElementById('checkout').addEventListener('click',checkout)
  document.getElementById('theme-toggle').addEventListener('click',toggleTheme)
  document.getElementById('footer-theme-toggle').addEventListener('click',toggleTheme)
  document.getElementById('discreet-badge').addEventListener('click',handleBadgeClick)
  document.getElementById('track-close').addEventListener('click',closeOrderTracking)
}

window.addEventListener('DOMContentLoaded',()=>{bootstrap()})
