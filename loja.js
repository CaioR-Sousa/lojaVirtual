const produtos = document.querySelector("#produtos")
const itensCarrinho = document.querySelector("#itensCarrinho")
const totalCarrinho = document.querySelector("#totalCarrinho")

let dados = []

let carrinho = []

async function carregarProdutos() {

    try {
        const url = "https://fakestoreapi.com/products"

        const resposta = await fetch(url)

        if (!resposta.ok) {
            throw new Error("Erro ao carregar os produtos")
        }

        dados = await resposta.json()

        const html = dados
            .map((produto) => `
         <div class="produto">         
            <img src="${produto.image}" alt="${produto.title}"/> 
            <h2>${produto.title}</h2> 
            <p> R$ ${produto.price}</p> 
            <span> ${produto.category} </span>
            </br>
            
            <button onClick="comprar(${produto.id})"> Comprar </button>
            
        </div>`)
            .join("")

        produtos.innerHTML = html

    }
    catch (erro) {
        produtos.textContent = `Não foi possível carregar os produtos.`
        console.error(erro)
    }

}

function comprar(id) {

    const mesmoProduto = dados.find((produto) => produto.id === id)

    const itemCarrinho = carrinho.find((item) => item.id === mesmoProduto.id)

    if (!itemCarrinho) {
        carrinho.push({
            id: mesmoProduto.id,
            titulo: mesmoProduto.title,
            preco: mesmoProduto.price,
            quantidade: 1
        })
    } else {

        itemCarrinho.quantidade++

    }

    salvar()

}

carregarProdutos()

const setar = localStorage.getItem("carrinho")

if (setar) {
    carrinho = JSON.parse(setar)
    atualizarCarrinho()
}


function atualizarCarrinho() {

    if (carrinho.length === 0) {
        itensCarrinho.innerText = `Não há nenhum item no seu carrinho.`
        totalCarrinho.textContent = ""
        return
    }

    const itens = carrinho
        .map((item) => `<div>
                            <p>${item.titulo}</p> 
                            <p>${item.preco}</p> 
                            <p>${item.quantidade}
                            <button onclick="aumentarQuantidade(${item.id})">+</button>
                            <button onclick="diminuirQuantidade(${item.id})">-</button></p>

                            <button onClick="excluir(${item.id})"> Excluir </button>
                        </div>`)
        .join("")

    itensCarrinho.innerHTML = itens

    total()
}

function excluir(id) {

    if (!confirm("Excluir item do carrinho?")) {
        return
    }

    carrinho = carrinho.filter((item) => item.id !== id)

    salvar()

}

function aumentarQuantidade(id) {
    const produtoEncontrado = carrinho.find((item) => item.id === id)

    if (!produtoEncontrado) {
        return
    }

    produtoEncontrado.quantidade++

    salvar()
}

function diminuirQuantidade(id) {
    const produtoEncontrado = carrinho.find((item) => item.id === id)

    if (!produtoEncontrado) {
        return
    }

    if (produtoEncontrado.quantidade > 1) {
        produtoEncontrado.quantidade--
    }

    salvar()
}

function total() {
    const somaTotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0)

    totalCarrinho.textContent = `Valor total: R$ ${somaTotal.toFixed(2)}`
}

function salvar() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho))
    atualizarCarrinho()
}






