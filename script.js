/* Gusto Pizzeria - script.js
   Implements menu rendering, cart, quests, dark-mode secret, and verification tracking.
*/
const LS_QUESTS = 'gusto.quests.v1'
const LS_ORDERS = 'gusto.orders'
const LS_LAST_CHALLENGE = 'gusto.last_challenge_order'
const QUEST_LIMITS = {toggles:3,orders:15,badgeClicks:3}
const SECRET_CONSOLE_PASSWORD = 'Gusto_Group'
const LS_LANGUAGE = 'gusto.language'
const USD_TO_UAH = 20
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80'

// Sample data
const data = {
  categories: [
    {id:'classics', title:'Classics', items:[
      {id:'marg',title:'Margherita',price:7,desc:'San Marzano tomatoes simmered with garlic, creamy fresh mozzarella, torn basil, extra-virgin olive oil and sea salt.',img:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80'},
      {id:'pep',title:'Pepperoni',price:8.5,desc:'Crisp-edged pepperoni layered over house tomato sauce with whole-milk mozzarella, oregano and chili oil.',img:'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80'},
      {id:'four-cheese',title:'Four Cheese',price:9,desc:'A rich blend of mozzarella, gorgonzola, provolone and aged parmesan finished with cracked black pepper.',img:'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80'},
      {id:'stagioni',title:'Quattro Stagioni',price:10,desc:'Four quarters with marinated artichokes, roasted mushrooms, prosciutto cotto, olives and mozzarella.',img:'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80'},
      {id:'calzone',title:'Calzone',price:8.5,desc:'Folded pizza dough filled with ricotta, mozzarella, ham, basil and tomato sauce, baked until golden.',img:'https://images.unsplash.com/photo-1593560708920-61dd98c8c8c7?auto=format&fit=crop&w=900&q=80'},
      {id:'marinara',title:'Marinara',price:6.5,desc:'A simple Neapolitan classic with San Marzano tomato, roasted garlic, oregano, basil and olive oil.',img:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80'}
    ]},
    {id:'special', title:'Specialties', items:[
      {id:'truf',title:'Truffle Mushroom',price:10,desc:'Roasted wild mushrooms, ricotta, mozzarella, thyme and fragrant white truffle oil over a thin, blistered crust.',img:'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80'},
      {id:'bbq',title:'BBQ Chicken',price:9,desc:'Smoky barbecue sauce, grilled chicken, red onion, mozzarella, cilantro and a bright lime finish.',img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80'},
      {id:'diavola',title:'Diavola',price:9.5,desc:'Spicy Calabrian salami, roasted peppers, mozzarella, chili flakes and a drizzle of hot honey.',img:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80'},
      {id:'prosciutto',title:'Prosciutto & Rocket',price:10.5,desc:'Silky prosciutto, peppery rocket, shaved parmesan and balsamic glaze over warm mozzarella.',img:'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80'},
      {id:'pesto-chicken',title:'Pesto Chicken',price:10,desc:'Basil pesto, roast chicken, mozzarella, cherry tomatoes and parmesan with a lemony finish.',img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80'},
      {id:'fiorentina',title:'Fiorentina',price:9.5,desc:'Spinach, egg, garlic, mozzarella and pecorino on a bright tomato base with cracked pepper.',img:'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80'}
    ]},
    {id:'sides', title:'Sides & Drinks', items:[
      {id:'garlic',title:'Garlic Knots (6)',price:3.5,desc:'Six pillowy knots baked with parmesan, parsley and roasted garlic butter, served with warm marinara for dipping.',img:'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?auto=format&fit=crop&w=900&q=80'},
      {id:'cola',title:'House Cola',price:1.5,desc:'A chilled glass bottle of crisp house cola with caramel notes and a clean citrus finish.',img:'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=900&q=80'},
      {id:'mozzarella',title:'Mozzarella Sticks',price:4,desc:'Hand-cut mozzarella breaded with seasoned crumbs, fried until crisp and paired with warm tomato dipping sauce.',img:'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?auto=format&fit=crop&w=900&q=80'},
      {id:'soda',title:'Italian Soda',price:2.5,desc:'Refreshing sparkling water mixed with house citrus syrup, ice and a twist of fresh lemon.',img:'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80'},
      {id:'tiramisu',title:'Tiramisu',price:3.5,desc:'Espresso-soaked ladyfingers layered with whipped mascarpone cream and dusted generously with cocoa.',img:'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80'},
      {id:'focaccia',title:'Garlic Focaccia',price:3.5,desc:'Warm, airy focaccia brushed with roasted garlic oil, rosemary, flaky salt and grated parmesan.',img:'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80'},
      {id:'san-pellegrino',title:'San Pellegrino Sparkling Water',price:2,desc:'Chilled Italian sparkling mineral water with fine bubbles and a clean, refreshing finish.',img:'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80'}
    ]},
    {id:'pastas', title:'Pastas & Lasagna', items:[
      {id:'lasagna',title:'Lasagna Bolognese',price:10,desc:'Layered pasta, slow-simmered beef and pork ragù, ricotta, mozzarella and parmesan baked until bubbling.',img:'https://images.unsplash.com/photo-1574869878975-9f5c2b9f6b6b?auto=format&fit=crop&w=900&q=80'},
      {id:'baked-penne',title:'Baked Penne',price:9,desc:'Penne tossed in tomato sauce with Italian sausage, basil, ricotta and mozzarella, then baked golden.',img:'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?auto=format&fit=crop&w=900&q=80'},
      {id:'alfredo',title:'Fettuccine Alfredo',price:9,desc:'Fresh fettuccine coated in parmesan cream sauce with butter, cracked pepper and parsley.',img:'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=900&q=80'},
      {id:'carbonara',title:'Carbonara',price:9.5,desc:'Silky egg and pecorino sauce with crisp pancetta, black pepper and bronze-cut spaghetti.',img:'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=900&q=80'}
    ]},
    {id:'paninis', title:'Gourmet Sandwiches / Paninis', items:[
      {id:'chicken-parm-sub',title:'Chicken Parm Sub',price:7.5,desc:'Crispy chicken cutlet, marinara, melted mozzarella and parmesan in a toasted Italian roll.',img:'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=80'},
      {id:'italian-combo',title:'Italian Combo Panini',price:8,desc:'Prosciutto, salami, mortadella, provolone, tomato and shredded lettuce pressed with oregano.',img:'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80'},
      {id:'meatball-hero',title:'Meatball Hero',price:7,desc:'House beef and pork meatballs, marinara, melted provolone and basil in a toasted hero roll.',img:'https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&w=900&q=80'}
    ]},
    {id:'salads', title:'Salads & Starters', items:[
      {id:'caesar',title:'Caesar Salad',price:5.5,desc:'Crisp romaine, parmesan, toasted garlic croutons and creamy house Caesar dressing.',img:'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=900&q=80'},
      {id:'caprese',title:'Caprese Salad',price:6,desc:'Fresh mozzarella, ripe tomatoes, basil leaves, extra-virgin olive oil and aged balsamic.',img:'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=900&q=80'},
      {id:'wings',title:'Buffalo Wings (10pcs)',price:7,desc:'Ten crispy chicken wings tossed in spicy buffalo sauce with cool blue cheese dressing.',img:'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=900&q=80'},
      {id:'calamari',title:'Calamari Fritti',price:7.5,desc:'Tender calamari lightly coated and fried crisp, served with lemon, parsley and marinara.',img:'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=80'}
    ]},
    {id:'desserts', title:'Desserts', items:[
      {id:'cannoli',title:'Cannoli (2pcs)',price:3.5,desc:'Two crisp pastry shells filled with sweet ricotta cream, chocolate chips and candied orange.',img:'https://images.unsplash.com/photo-1607920592519-7c6e4c5a2a69?auto=format&fit=crop&w=900&q=80'},
      {id:'nutella-pizza',title:'Nutella Pizza',price:6,desc:'Warm, wood-fired pizza dough spread with Nutella, hazelnuts, powdered sugar and strawberries.',img:'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80'},
      {id:'gelato',title:'Italian Gelato',price:3,desc:'A generous scoop of dense Italian gelato, with rotating flavors from pistachio to stracciatella.',img:'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80'}
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

const ukItemText = {
  marg:['Маргарита','Помідори Сан-Марцано, свіжа моцарела, базилік, оливкова олія та морська сіль.'],pep:['Пепероні','Хрусткий пепероні, томатний соус, моцарела, орегано та олія з чилі.'],'four-cheese':['Чотири сири','Моцарела, горгонзола, проволоне та витриманий пармезан із чорним перцем.'],stagioni:['Кватро стаджоні','Артишоки, гриби, прошуто котто, оливки та моцарела.'],calzone:['Кальцоне','Тісто з рикотою, моцарелою, шинкою, базиліком і томатним соусом.'],marinara:['Маринара','Томат Сан-Марцано, запечений часник, орегано, базилік та оливкова олія.'],
  truf:['Грибний трюфель','Лісові гриби, рикота, моцарела, чебрець і ароматна біла трюфельна олія.'],bbq:['Курка барбекю','Копчений соус барбекю, курка, червона цибуля, моцарела, кінза та лайм.'],diavola:['Діавола','Гостра салямі, печений перець, моцарела, пластівці чилі та гострий мед.'],prosciutto:['Прошуто та рукола','Прошуто, рукола, пармезан і бальзамічна глазур на теплій моцарелі.'],'pesto-chicken':['Курка з песто','Песто з базиліку, запечена курка, моцарела, помідори чері та пармезан.'],fiorentina:['Фіорентина','Шпинат, яйце, часник, моцарела та пекоріно з чорним перцем.'],
  garlic:['Часникові вузлики (6)','Шість вузликів із пармезаном, петрушкою та часниковим маслом із маринарою.'],cola:['Домашня кола','Охолоджена кола з карамельними нотами та легким цитрусовим післясмаком.'],mozzarella:['Палички моцарели','Хрусткі паніровані палички моцарели з теплим томатним соусом.'],soda:['Італійська газована вода','Газована вода з домашнім цитрусовим сиропом, льодом і лимоном.'],tiramisu:['Тірамісу','Печиво, просочене еспресо, крем із маскарпоне та какао.'],focaccia:['Часникова фокача','Тепла пухка фокача з часниковою олією, розмарином, сіллю та пармезаном.'],'san-pellegrino':['Газована вода San Pellegrino','Охолоджена італійська мінеральна вода з дрібними бульбашками.'],
  lasagna:['Лазанья болоньєзе','Шари пасти, рагу з яловичини та свинини, рикота, моцарела й пармезан.'],'baked-penne':['Запечене пенне','Пенне з томатним соусом, італійською ковбаскою, базиліком, рикотою та моцарелою.'],alfredo:['Фетучіні альфредо','Свіжа паста у вершково-пармезановому соусі з маслом і перцем.'],carbonara:['Карбонара','Шовковистий соус із яйця та пекоріно, хрустка панчета й чорний перець.'],
  'chicken-parm-sub':['Саб із куркою пармезан','Хрустка курка, маринара, розплавлена моцарела та пармезан у підсмаженій булці.'],'italian-combo':['Італійський паніні','Прошуто, салямі, мортадела, проволоне, помідор і салат з орегано.'],'meatball-hero':['Герой із мітболами','Домашні мітболи, маринара, проволоне та базилік у підсмаженій булці.'],
  caesar:['Салат Цезар','Хрусткий ромейн, пармезан, часникові крутони та фірмова заправка Цезар.'],caprese:['Салат капрезе','Свіжа моцарела, стиглі помідори, базилік, оливкова олія та бальзамік.'],wings:['Крильця баффало (10 шт.)','Десять хрустких крилець у гострому соусі баффало з сирною заправкою.'],calamari:['Кальмари фрітті','Ніжні хрусткі кальмари з лимоном, петрушкою та маринарою.'],
  cannoli:['Канолі (2 шт.)','Дві хрусткі трубочки з солодким кремом рикота, шоколадом і цукатами апельсина.'],'nutella-pizza':['Піца з нутелою','Тепле тісто з нутелою, фундуком, цукровою пудрою та полуницею.'],gelato:['Італійське джелато','Щедра кулька густого італійського джелато зі змінними смаками.'],
  'godfather-xl':['Велика піца «Хрещений батько»','Величезна піца з томатами, моцарелою, пепероні, ковбаскою, перцем, цибулею та грибами.'],'inferno-reaper':['Пекельне кальцоне Reaper','Велике кальцоне з гострою салямі, моцарелою, перцем і соусом Carolina Reaper.'],'monster-meatball':['Гігантський герой із мітболом','П’ять фунтів мітболів, маринари, проволоне та пармезану.'],'titanic-wings':['Титанічна рулетка зі 100 крилець','Сто крилець із класичним баффало, гострим перцем і соусом Carolina Reaper.'],'diablo-sicilian':['Гостра сицилійська піца Diablo','Товсте тісто з гострою салямі, калабрійським чилі, перцем, ковбаскою та моцарелою.']
}
const isUkrainian = ()=>document.documentElement.lang === 'uk'
const localizedItem = item=>isUkrainian() && ukItemText[item.id] ? {...item,title:ukItemText[item.id][0],desc:ukItemText[item.id][1]} : item
const formatMoney = amount=>isUkrainian() ? `₴${(amount * USD_TO_UAH).toFixed(2)}` : `$${amount.toFixed(2)}`
const formatThreshold = amount=>formatMoney(amount)
const ukChallenges = {'big-spender':['Великий марнотрат'],'order-count':['Постійний гість','Зробіть 15 замовлень загалом.'],'theme-lover':['Нічна сова','Перемкніть темний режим 3 рази та натисніть на герб.']}

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
  expandedItemIds.clear()
  data.categories.forEach(cat=>cat.items.forEach(item=>expandedItemIds.add(item.id)))
  data.categories.forEach(cat=>{
    const container = document.querySelector(`.menu-list[data-cat="${cat.id}"]`)
    if(!container) return
    container.innerHTML=''
    cat.items.forEach(item=>{
      const displayItem = localizedItem(item)
      let selectedSize = 'S'
      const priceBadge = el('span',{class:'price-badge'},formatMoney(priceForSize(item.price,selectedSize)))
      const addSelectedItem = ()=>addToCart({...displayItem,price:priceForSize(item.price,selectedSize),category:cat.id},selectedSize)
      const sizeButtons = ['S','M','L'].map(size=>el('button',{class:size === selectedSize ? 'active' : '',ariaPressed:size === selectedSize,on:{click:(e)=>{
        e.stopPropagation()
        selectedSize = size
        priceBadge.textContent = formatMoney(priceForSize(item.price,size))
        sizeButtons.forEach(button=>{const isSelected = button.textContent === size;button.classList.toggle('active',isSelected);button.setAttribute('aria-pressed',String(isSelected))})
      }}},size))
      const header = el('div',{class:'accordion-header'},el('div',{},el('strong',{},displayItem.title),priceBadge),el('div',{class:'size-select'},sizeButtons))
      const body = el('div',{class:'accordion-body'},
        el('div',{class:'desc'},displayItem.desc),
        createFoodImage(displayItem)
      )
      const actions = el('div',{class:'actions'},el('button',{class:'add-btn',on:{click:(e)=>{e.stopPropagation();addSelectedItem()} }},isUkrainian() ? 'Додати до замовлення' : 'Add to Order'),el('button',{class:'card-chevron',ariaLabel:`Expand ${displayItem.title}`,ariaExpanded:false,on:{click:(e)=>{e.stopPropagation();toggleExpandedItem(item.id)} }},'▾'))
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
  syncExpandedCards()
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
  const undergroundOpen = visible && undergroundUnlocked
  underground.classList.toggle('is-open',undergroundOpen)
  const undergroundToggle = underground.querySelector('.category-toggle')
  const undergroundIcon = underground.querySelector('.underground-status-icon')
  const undergroundProgress = document.getElementById('underground-progress')
  undergroundToggle.disabled = !undergroundUnlocked
  undergroundToggle.setAttribute('aria-disabled',String(!undergroundUnlocked))
  undergroundToggle.setAttribute('aria-expanded',String(undergroundOpen))
  underground.querySelector('.menu-list').setAttribute('aria-hidden',String(!undergroundOpen))
  undergroundIcon.textContent = undergroundUnlocked ? '✅' : '🔒'
  undergroundProgress.textContent = undergroundUnlocked
    ? (isUkrainian() ? 'Залишилось завдань: 0 (Розблоковано!)' : '0 challenge quests remaining (Unlocked!)')
    : (isUkrainian() ? `Залишилось завдань: ${remainingQuests}` : `${remainingQuests} challenge quests remaining`)
  // populate cards (hidden via overlay until unlocked)
  challenges.forEach(c=>{
    const complete = isChallengeUnlocked(c.id)
    const status = getChallengeStatus(c.id,complete,maxOrder)
    const challengeText = isUkrainian() && ukChallenges[c.id] ? [ukChallenges[c.id][0], c.id === 'big-spender' ? `Зробіть замовлення від ${formatThreshold(100)} за одну оплату.` : ukChallenges[c.id][1]] : [c.title,c.desc]
    const spoiler = el('div',{class:'spoiler-mask',role:'button',tabindex:'0',on:{click:event=>event.currentTarget.classList.add('revealed'),keydown:event=>{
      if(event.key==='Enter' || event.key===' '){event.preventDefault();event.currentTarget.classList.add('revealed')}
    }}},el('p',{},challengeText[1]),el('div',{class:'status-footer'},status))
    spoiler.setAttribute('aria-label',`${isUkrainian() ? 'Показати деталі завдання' : 'Reveal challenge details'}: ${challengeText[0]}`)
    const card = el('div',{class:`challenge ${complete?'complete':'locked'}`},el('h3',{},challengeText[0]),spoiler)
    grid.appendChild(card)
  })

  // show only in Dark Mode
  section.style.display = visible ? 'block' : 'none'
  section.setAttribute('aria-hidden', String(!visible))

  section.classList.remove('locked')
}

function getChallengeStatus(id,complete,maxOrder){
  if(isUkrainian()){
    if(id==='big-spender') return complete ? `СТАТУС: ВИКОНАНО ✅ (${formatMoney(maxOrder)} досягнуто)` : `СТАТУС: ОЧІКУЄТЬСЯ 🔒 (МАКСИМАЛЬНЕ: ${formatMoney(maxOrder)} / ${formatThreshold(100)})`
    if(id==='order-count') return complete ? 'СТАТУС: ВИКОНАНО ✅ (ЗАМОВЛЕННЯ: 15 / 15)' : `СТАТУС: ОЧІКУЄТЬСЯ 🔒 (ЗАМОВЛЕННЯ: ${quests.orders} / 15)`
    if(id==='theme-lover') return complete ? 'СТАТУС: ВИКОНАНО ✅ (ПЕРЕМИКАНЬ: 3 / 3 • НАТИСКАНЬ: 3 / 3)' : `СТАТУС: ОЧІКУЄТЬСЯ 🔒 (ПЕРЕМИКАНЬ: ${quests.toggles} / 3 • НАТИСКАНЬ: ${quests.badgeClicks} / 3)`
  }
  if(id==='big-spender') return complete ? `STATUS: COMPLETE ✅ (${formatMoney(maxOrder)} Reached)` : `STATUS: PENDING 🔒 (MAX ORDER: ${formatMoney(maxOrder)} / ${formatThreshold(100)})`
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
  if(cart.length===0) itemsEl.textContent=isUkrainian() ? 'Кошик порожній' : 'Cart is empty'
  else{
    itemsEl.innerHTML=''
    cart.forEach((it,idx)=>{
      const row = el('div',{class:'cart-row'}, `${it.title} (${it.size}) - ${formatMoney(it.price)} `, el('button',{on:{click:()=>{cart.splice(idx,1);updateCartUI()}},class:'icon cart-remove',title:`Remove ${it.title}`,ariaLabel:`Remove ${it.title}`},'🗑️'))
      itemsEl.appendChild(row)
    })
  }
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0)
  document.getElementById('cart-total').textContent=formatMoney(total)
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
  if(!last){document.getElementById('track-info').textContent=isUkrainian() ? 'Немає активного замовлення' : 'No active order';return}
  const order = orders.find(o=>o.id===last.orderId)
  document.getElementById('track-info').textContent = order ? `${isUkrainian() ? 'Замовлення' : 'Order'} #${order.id} • ${formatMoney(order.total)}` : (isUkrainian() ? 'Дані замовлення відсутні' : 'Order data missing')
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

function setupSecretConsole(){
  const panel = document.getElementById('secret-console')
  const auth = document.getElementById('secret-console-auth')
  const password = document.getElementById('secret-console-password')
  const form = document.getElementById('secret-console-form')
  const input = document.getElementById('secret-console-input')
  const output = document.getElementById('secret-console-output')
  let authenticated = false
  const show = ()=>{
    panel.classList.remove('hidden')
    panel.hidden = false
    panel.setAttribute('aria-hidden','false')
    authenticated = false
    auth.classList.remove('hidden')
    auth.hidden = false
    form.classList.add('hidden')
    form.hidden = true
    output.textContent = document.documentElement.lang === 'uk' ? 'Потрібен пароль.' : 'Password required.'
    password.focus()
  }
  const hide = ()=>{
    panel.classList.add('hidden')
    panel.hidden = true
    panel.setAttribute('aria-hidden','true')
    authenticated = false
    auth.classList.remove('hidden')
    auth.hidden = false
    form.classList.add('hidden')
    form.hidden = true
    password.value = ''
  }
  const write = message=>{output.textContent=message}
  const parseTime = value=>{
    const match = value.trim().match(/^(\d{1,2}):(\d{2})$/)
    if(!match || Number(match[2]) > 59) return null
    return Number(match[1]) * 60 + Number(match[2])
  }
  const run = command=>{
    const normalized = command.trim().toLowerCase()
    if(normalized === 'help'){
      write('Commands: unlock.underground | reset.underground | reset.console | order-tracking-time: MM:SS | test.tracking | debug.state | debug.cards | debug.tracking | status | close-tracking | clear')
      return
    }
    if(normalized === 'unlock.underground'){
      quests.orders = QUEST_LIMITS.orders
      quests.toggles = QUEST_LIMITS.toggles
      quests.badgeClicks = QUEST_LIMITS.badgeClicks
      quests.bigOrder = true
      saveQuests()
      document.documentElement.classList.add('dark')
      updateThemeIcons(true)
      renderChallenges()
      write('Underground unlocked.')
      return
    }
    if(normalized === 'reset.underground'){
      quests.orders = 0
      quests.toggles = 0
      quests.badgeClicks = 0
      quests.bigOrder = false
      saveQuests()
      localStorage.removeItem(LS_LAST_CHALLENGE)
      closeOrderTracking()
      renderChallenges()
      write('Underground progress reset.')
      return
    }
    if(normalized === 'reset.console' || normalized === 'lock.console'){
      hide()
      return
    }
    if(normalized.startsWith('order-tracking-time:')){
      const seconds = parseTime(normalized.slice('order-tracking-time:'.length).trim().replace(/^set\s+/,''))
      if(seconds === null){write('Use order-tracking-time: MM:SS');return}
      const panel = document.getElementById('order-tracking')
      panel.classList.remove('hidden')
      panel.setAttribute('aria-hidden','false')
      localStorage.removeItem(LS_LAST_CHALLENGE)
      document.getElementById('track-info').textContent = 'Console timer'
      startCountdown(Date.now() + seconds * 1000)
      write(`Order tracking timer set to ${normalized.slice(-5)}.`)
      return
    }
    if(normalized === 'test.tracking'){
      localStorage.removeItem(LS_LAST_CHALLENGE)
      const trackingPanel = document.getElementById('order-tracking')
      trackingPanel.classList.remove('hidden')
      trackingPanel.setAttribute('aria-hidden','false')
      document.getElementById('track-info').textContent = 'Test tracking order'
      startCountdown(Date.now() + 30 * 1000)
      write('Tracking test started for 00:30.')
      return
    }
    if(normalized === 'debug.state'){
      write(`Theme: ${isSecretVisible() ? 'dark' : 'light'} | Underground: ${checkIsUnlocked(getQuestState(quests)) ? 'unlocked' : 'locked'} | Orders: ${orders.length} | Cart: ${cart.length}`)
      return
    }
    if(normalized === 'debug.cards'){
      const cards = [...document.querySelectorAll('.accordion')]
      const expanded = cards.filter(card=>card.classList.contains('expanded')).length
      write(`Cards: ${expanded}/${cards.length} expanded | Sections: ${document.querySelectorAll('.category-section-block.is-open').length} open`)
      return
    }
    if(normalized === 'debug.tracking'){
      const trackingPanel = document.getElementById('order-tracking')
      write(`Tracking: ${trackingPanel.classList.contains('hidden') ? 'closed' : 'open'} | Timer: ${document.getElementById('countdown').textContent}`)
      return
    }
    if(normalized === 'status'){
      write(`Underground: ${checkIsUnlocked(getQuestState(quests)) ? 'unlocked' : 'locked'} | Orders: ${orders.length} | Cart items: ${cart.length}`)
      return
    }
    if(normalized === 'close-tracking'){
      closeOrderTracking()
      write('Order tracking closed.')
      return
    }
    if(normalized === 'close'){hide();return}
    if(normalized === 'clear'){write('');return}
    write(`Unknown command: ${command.trim() || '(empty)'}`)
  }
  document.getElementById('secret-console-btn').addEventListener('click',show)
  document.getElementById('secret-console-close').addEventListener('click',hide)
  document.getElementById('password-visibility').addEventListener('click',()=>{
    const visible = password.type === 'text'
    password.type = visible ? 'password' : 'text'
    const button = document.getElementById('password-visibility')
    button.textContent = visible ? '◉' : '◌'
    button.title = visible ? 'Show password' : 'Hide password'
    button.setAttribute('aria-label',button.title)
  })
  auth.addEventListener('submit',event=>{
    event.preventDefault()
    if(password.value !== SECRET_CONSOLE_PASSWORD){
      write('Incorrect password.')
      password.select()
      return
    }
    authenticated = true
    auth.classList.add('hidden')
    auth.hidden = true
    form.classList.remove('hidden')
    form.hidden = false
    write('Console unlocked. Type help for commands.')
    input.focus()
  })
  form.addEventListener('submit',event=>{
    event.preventDefault()
    if(!authenticated) return
    run(input.value)
    input.select()
  })
}

function setupLanguage(){
  const translations = {
    en:{search:'Search menu...',cart:'Open cart',theme:'Toggle theme',language:'Switch to Ukrainian',categories:{classics:'Classics',special:'Specialties',sides:'Sides & Drinks',pastas:'Pastas & Lasagna',paninis:'Gourmet Sandwiches / Paninis',salads:'Salads & Starters',desserts:'Desserts',underground:'Underground'},quick:'Quick Links',menu:'Menu',locations:'Locations',careers:'Careers',follow:'Follow',join:'Join the Family',email:'Your email',joinButton:'Join',themeLabel:'Theme:',close:'Close',tracking:'Order Tracking',noOrder:'No active order',photo:'Submit Photo Evidence',time:'Time left:',console:'Secret Console',password:'Enter password',unlock:'Unlock',passwordRequired:'Password required.',languageButton:'UA'},
    uk:{search:'Пошук у меню...',cart:'Відкрити кошик',theme:'Змінити тему',language:'Перемкнути на англійську',categories:{classics:'Класика',special:'Фірмові страви',sides:'Закуски та напої',pastas:'Паста та лазанья',paninis:'Гурме-сендвічі / паніні',salads:'Салати та закуски',desserts:'Десерти',underground:'Підпілля'},quick:'Швидкі посилання',menu:'Меню',locations:'Локації',careers:'Вакансії',follow:'Стежте за нами',join:'Приєднуйтесь до родини',email:'Ваша електронна пошта',joinButton:'Приєднатися',themeLabel:'Тема:',close:'Закрити',tracking:'Відстеження замовлення',noOrder:'Немає активного замовлення',photo:'Надіслати фото-доказ',time:'Залишилось часу:',console:'Секретна консоль',password:'Введіть пароль',unlock:'Розблокувати',passwordRequired:'Потрібен пароль.',languageButton:'EN'}
  }
  let language = localStorage.getItem(LS_LANGUAGE) === 'uk' ? 'uk' : 'en'
  const apply = ()=>{
    const t = translations[language]
    document.documentElement.lang = language === 'uk' ? 'uk' : 'en'
    document.getElementById('search-input').placeholder = t.search
    document.getElementById('search-input').setAttribute('aria-label',t.search)
    document.getElementById('cart-btn').setAttribute('aria-label',t.cart)
    document.querySelectorAll('.theme-toggle').forEach(button=>button.setAttribute('aria-label',t.theme))
    const button = document.getElementById('language-toggle')
    button.textContent = t.languageButton
    button.setAttribute('aria-label',t.language)
    const categoryIds = Object.keys(t.categories)
    categoryIds.forEach(id=>{
      const toggle = document.querySelector(`#${id} .category-toggle`)
      if(toggle) toggle.childNodes.forEach(node=>{if(node.nodeType === Node.TEXT_NODE && node.textContent.trim()) node.textContent = ` ${t.categories[id]}`})
    })
    const headings = document.querySelectorAll('.links-col h4,.social-col h4,.news-col h4')
    if(headings[0]) headings[0].textContent=t.quick
    if(headings[1]) headings[1].textContent=t.follow
    if(headings[2]) headings[2].textContent=t.join
    const links = document.querySelectorAll('.links-col a')
    ;[t.menu,t.locations,t.careers].forEach((text,index)=>{if(links[index]) links[index].textContent=text})
    document.getElementById('news-email').placeholder=t.email
    document.querySelector('#newsletter-form button').textContent=t.joinButton
    document.querySelector('.theme-inline').firstChild.textContent=`${t.themeLabel} `
    document.querySelector('#challenges-section h2').textContent=language === 'uk' ? 'Таємні завдання' : 'Confidential / Challenges'
    document.querySelector('.underground-timed-note').textContent=language === 'uk' ? 'ВИПРОБУВАННЯ НА ЧАС: Надішліть фото завершеної страви протягом 30 хвилин після доставки, щоб отримати повне повернення коштів.' : '30-MINUTE TIMED CHALLENGE: Send us a photo of you finishing the meal within 30 minutes of delivery to get 100% refunded / free.'
    document.querySelector('#cart-close').setAttribute('aria-label',t.close)
    document.querySelector('#track-close').setAttribute('aria-label',t.close)
    document.querySelector('#order-tracking h3').textContent=t.tracking
    document.querySelector('#track-info').textContent=document.querySelector('#track-info').textContent === 'No active order' || document.querySelector('#track-info').textContent === 'Немає активного замовлення' ? t.noOrder : document.querySelector('#track-info').textContent
    document.querySelector('.upload-btn').textContent=t.photo
    document.querySelector('.timer').firstChild.textContent=`${t.time} `
    document.querySelector('#secret-console strong').textContent=t.console
    document.querySelector('.secret-console-auth-label').textContent=t.password
    document.querySelector('#secret-console-password').placeholder=t.password
    document.querySelector('#secret-console-auth .primary').textContent=t.unlock
    const visibilityButton = document.getElementById('password-visibility')
    const passwordVisible = document.getElementById('secret-console-password').type === 'text'
    visibilityButton.textContent = passwordVisible ? '◉' : '◌'
    visibilityButton.title = passwordVisible ? (language === 'uk' ? 'Сховати пароль' : 'Hide password') : (language === 'uk' ? 'Показати пароль' : 'Show password')
    visibilityButton.setAttribute('aria-label',visibilityButton.title)
    renderProducts()
    renderChallenges()
    updateCartUI()
    if(!authenticatedConsoleState()) document.querySelector('#secret-console-output').textContent=t.passwordRequired
  }
  const authenticatedConsoleState = ()=>!document.getElementById('secret-console-form').hidden
  document.getElementById('language-toggle').addEventListener('click',()=>{language=language === 'en' ? 'uk' : 'en';localStorage.setItem(LS_LANGUAGE,language);apply()})
  apply()
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
        }}},el('span',{class:'search-result-copy'},el('span',{class:'search-result-title'},localizedItem(item).title),el('span',{class:'search-result-category'},isUkrainian() && ukItemText[item.id] ? 'Меню' : item.categoryTitle)),el('span',{class:'search-result-price'},formatMoney(priceForSize(item.price,'S'))))
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
  setupSecretConsole()
  setupLanguage()
}

window.addEventListener('DOMContentLoaded',()=>{bootstrap()})
