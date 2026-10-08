const STORE_KEY = "gamestore_products_v1";
const CART_KEY = "gamestore_cart_v1";
const ORDERS_KEY = "gamestore_orders_v1";
// Troque pelo número oficial da loja, com código do país e DDD, somente números.
const WHATSAPP_NUMBER = "5500000000000";

const initialProducts = [
  {id:"p1",name:"Gift Card PlayStation",category:"Gift cards",price:50,oldPrice:60,description:"Código digital de valor pré-pago. Confira região e condições antes de comprar.",emoji:"🎁",popular:true},
  {id:"p2",name:"Gift Card Xbox",category:"Gift cards",price:50,oldPrice:55,description:"Cartão digital para conta compatível. Consulte disponibilidade regional.",emoji:"🟩",popular:true},
  {id:"p3",name:"Gift Card Steam",category:"Gift cards",price:30,oldPrice:35,description:"Crédito digital para jogos de PC. Verifique moeda e região.",emoji:"🕹️",popular:true},
  {id:"p4",name:"Crédito de jogo autorizado",category:"Créditos",price:25,oldPrice:30,description:"Exemplo demonstrativo. Venda apenas por canal permitido pela plataforma.",emoji:"🪙",popular:false},
  {id:"p5",name:"Gift Card digital",category:"Gift cards",price:20,oldPrice:25,description:"Produto demonstrativo. Edite no painel administrativo.",emoji:"💳",popular:false},
  {id:"p6",name:"Mouse gamer",category:"Acessórios",price:79.90,oldPrice:99.90,description:"Acessório físico para seu setup gamer.",emoji:"🖱️",popular:true},
  {id:"p7",name:"Headset gamer",category:"Acessórios",price:119.90,oldPrice:139.90,description:"Acessório físico. Confirme estoque e prazo de entrega.",emoji:"🎧",popular:false},
  {id:"p8",name:"Teclado gamer",category:"Acessórios",price:149.90,oldPrice:179.90,description:"Acessório físico para seu setup.",emoji:"⌨️",popular:false}
];
const money = value => Number(value).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const load = (key, fallback) => { try { const v=JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; } };
let products = load(STORE_KEY, initialProducts);
let cart = load(CART_KEY, []);
let orders = load(ORDERS_KEY, []);
let selectedCategory = "Todos";
let selectedFilter = "Todos";

const productGrid = document.querySelector("#productGrid");
const cartDrawer = document.querySelector("#cartDrawer");
const overlay = document.querySelector("#overlay");
const adminModal = document.querySelector("#adminModal");
const $ = selector => document.querySelector(selector);
const save = () => { localStorage.setItem(STORE_KEY,JSON.stringify(products)); localStorage.setItem(CART_KEY,JSON.stringify(cart)); localStorage.setItem(ORDERS_KEY,JSON.stringify(orders)); };

function renderProducts(){
  const term=$("#searchInput").value.trim().toLowerCase();
  const filtered=products.filter(p=>(selectedCategory==="Todos"||p.category===selectedCategory)&&
    (p.name+" "+p.description+" "+p.category).toLowerCase().includes(term)&&
    (selectedFilter==="Todos"||(selectedFilter==="Popular"&&p.popular)||(selectedFilter==="Desconto"&&Number(p.oldPrice)>Number(p.price))));
  productGrid.innerHTML=filtered.map(p=>{
    const discount=p.oldPrice>p.price?Math.round((1-p.price/p.oldPrice)*100):0;
    const art=p.image?`<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" loading="lazy" onerror="this.remove()">`:`<span class="product-emoji">${p.emoji||"🎮"}</span>`;
    return `<article class="product-card"><div class="product-art">${art}${discount?`<span class="discount">-${discount}%</span>`:""}</div><div class="product-info"><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.description||"Produto digital ou gamer.")}</p><div class="price-line"><span class="price">${money(p.price)}</span>${p.oldPrice>p.price?`<span class="old-price">${money(p.oldPrice)}</span>`:""}</div><button class="button primary add-button" data-add="${p.id}">Adicionar ao carrinho +</button></div></article>`;
  }).join("");
  $("#emptyState").classList.toggle("hidden",filtered.length>0);
}
function escapeHTML(value=""){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function addToCart(id){const item=cart.find(i=>i.id===id);if(item)item.qty++;else cart.push({id,qty:1});save();renderCart();$("#cartCount").textContent=cart.reduce((n,i)=>n+i.qty,0);}
function renderCart(){
  const items=cart.map(i=>({...i,product:products.find(p=>p.id===i.id)})).filter(i=>i.product);
  $("#cartCount").textContent=items.reduce((n,i)=>n+i.qty,0);
  $("#cartItems").innerHTML=items.length?items.map(i=>`<div class="cart-item"><div><h3>${escapeHTML(i.product.name)}</h3><p>${money(i.product.price)} · ${money(i.product.price*i.qty)}</p><div class="quantity-controls"><button data-qty="-1" data-id="${i.id}" aria-label="Diminuir quantidade">−</button><span>${i.qty}</span><button data-qty="1" data-id="${i.id}" aria-label="Aumentar quantidade">+</button></div></div><button class="remove-button" data-remove="${i.id}">Remover</button></div>`).join(""):`<p class="muted">Seu carrinho está vazio. Escolha algum produto!</p>`;
  $("#cartTotal").textContent=money(items.reduce((sum,i)=>sum+i.product.price*i.qty,0));
}
function openPanel(panel){overlay.classList.remove("hidden");panel.classList.remove("hidden");}
function closePanels(){overlay.classList.add("hidden");cartDrawer.classList.add("hidden");adminModal.classList.add("hidden");}
function renderOrders(){
  $("#ordersList").innerHTML=orders.length?[...orders].reverse().map(o=>`<article class="order-card"><div><b>Pedido #${o.id}</b><p>${escapeHTML(o.name)} · ${new Date(o.date).toLocaleString("pt-BR")} · ${o.items.map(i=>escapeHTML(i.name)).join(", ")}</p></div><div><strong>${money(o.total)}</strong><p class="status">${escapeHTML(o.status)}</p></div></article>`).join(""):`<p class="muted">Seus pedidos feitos neste navegador aparecerão aqui.</p>`;
  $("#adminOrderList").innerHTML=orders.length?[...orders].reverse().map(o=>`<div class="admin-product-row"><div><b>Pedido #${o.id} · ${money(o.total)}</b><p>${escapeHTML(o.name)} · ${escapeHTML(o.status)}</p></div><div class="row-actions"><button class="small-button" data-status="${o.id}" data-value="Pagamento confirmado">Confirmar pagamento</button><button class="small-button" data-status="${o.id}" data-value="Concluído">Concluir</button></div></div>`).join(""):`<p class="muted">Nenhum pedido por enquanto.</p>`;
}
function renderAdminProducts(){
  $("#adminProductList").innerHTML=products.map(p=>`<div class="admin-product-row"><div><b>${escapeHTML(p.name)}</b><p>${escapeHTML(p.category)} · ${money(p.price)}</p></div><div class="row-actions"><button class="small-button" data-edit="${p.id}">Editar</button><button class="small-button delete" data-delete="${p.id}">Excluir</button></div></div>`).join("");
}
function resetProductForm(){ $("#productForm").reset();$("#editId").value="";$("#saveProductButton").textContent="Cadastrar produto";$("#cancelEditButton").classList.add("hidden"); }
function checkout(){
  const items=cart.map(i=>({...i,product:products.find(p=>p.id===i.id)})).filter(i=>i.product);
  if(!items.length){alert("Adicione pelo menos um produto ao carrinho.");return;}
  const name=$("#customerName").value.trim();
  if(!name){alert("Digite seu nome para identificar o pedido.");$("#customerName").focus();return;}
  const total=items.reduce((sum,i)=>sum+i.product.price*i.qty,0);
  const order={id:String(Date.now()).slice(-7),name,contact:$("#customerContact").value.trim(),date:new Date().toISOString(),status:"Aguardando confirmação",total,items:items.map(i=>({name:i.product.name,qty:i.qty,price:i.product.price}))};
  orders.push(order);cart=[];save();renderCart();renderOrders();closePanels();
  const message=`Olá! Quero consultar este pedido na GameStore:\\nPedido #${order.id}\\nNome: ${name}\\n${order.items.map(i=>`${i.qty}x ${i.name} — ${money(i.price*i.qty)}`).join("\\n")}\\nTotal: ${money(total)}\\nPor favor, informem as opções oficiais de pagamento e entrega.`;
  const validNumber=/^55\d{10,13}$/.test(WHATSAPP_NUMBER)&&!WHATSAPP_NUMBER.includes("000000");
  if(validNumber) window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");
  else {alert("Pedido salvo nesta demonstração. Configure WHATSAPP_NUMBER no arquivo script.js com o número comercial da loja para ativar o botão.");}
}
productGrid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b){addToCart(b.dataset.add);b.textContent="Adicionado ✓";setTimeout(()=>b.textContent="Adicionar ao carrinho +",900);}});
document.querySelectorAll(".category-card").forEach(b=>b.addEventListener("click",()=>{selectedCategory=b.dataset.category;document.querySelectorAll(".category-card").forEach(x=>x.classList.toggle("active",x===b));renderProducts();}));
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{selectedFilter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts();}));
$("#searchInput").addEventListener("input",renderProducts);
$("#cartButton").addEventListener("click",()=>openPanel(cartDrawer));
$("#adminButton").addEventListener("click",()=>{renderAdminProducts();renderOrders();openPanel(adminModal);});
$("#menuToggle").addEventListener("click",()=>$("#mainNav").classList.toggle("menu-open"));
$("#mainNav").addEventListener("click",e=>{if(e.target.tagName==="A")$("#mainNav").classList.remove("menu-open");});
overlay.addEventListener("click",closePanels);
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",closePanels));
$("#cartItems").addEventListener("click",e=>{
 const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");
 if(q){const item=cart.find(i=>i.id===q.dataset.id);if(item){item.qty+=Number(q.dataset.qty);if(item.qty<=0)cart=cart.filter(i=>i.id!==item.id);}}
 if(r)cart=cart.filter(i=>i.id!==r.dataset.remove);
 save();renderCart();
});
$("#checkoutButton").addEventListener("click",checkout);
$("#productForm").addEventListener("submit",e=>{
 e.preventDefault();
 const id=$("#editId").value||"p"+Date.now();
 const product={id,name:$("#productName").value.trim(),category:$("#productCategory").value,price:Number($("#productPrice").value),oldPrice:Number($("#productOldPrice").value)||0,image:$("#productImage").value.trim(),description:$("#productDescription").value.trim()||"Consulte os detalhes com o atendimento.",emoji:"🎮",popular:false};
 if(!product.name||product.price<=0){alert("Confira o nome e o preço.");return;}
 const idx=products.findIndex(p=>p.id===id);if(idx>=0)products[idx]=product;else products.push(product);
 save();resetProductForm();renderProducts();renderAdminProducts();
});
$("#cancelEditButton").addEventListener("click",resetProductForm);
$("#adminProductList").addEventListener("click",e=>{
 const edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]");
 if(edit){const p=products.find(x=>x.id===edit.dataset.edit);if(!p)return;$("#editId").value=p.id;$("#productName").value=p.name;$("#productCategory").value=p.category;$("#productPrice").value=p.price;$("#productOldPrice").value=p.oldPrice||"";$("#productImage").value=p.image||"";$("#productDescription").value=p.description||"";$("#saveProductButton").textContent="Salvar alterações";$("#cancelEditButton").classList.remove("hidden");$("#adminModal").scrollTo({top:0,behavior:"smooth"});}
 if(del&&confirm("Excluir este produto?")){products=products.filter(p=>p.id!==del.dataset.delete);cart=cart.filter(i=>i.id!==del.dataset.delete);save();renderProducts();renderCart();renderAdminProducts();}
});
$("#adminOrderList").addEventListener("click",e=>{
 const b=e.target.closest("[data-status]");if(!b)return;
 const o=orders.find(x=>x.id===b.dataset.status);if(o){o.status=b.dataset.value;save();renderOrders();}
});
$("#year").textContent=new Date().getFullYear();
renderProducts();renderCart();renderOrders();