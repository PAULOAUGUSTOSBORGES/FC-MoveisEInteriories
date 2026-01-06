/* ==========================================================================
   1. INICIALIZAÇÃO E FILTROS (ISOTOPE & FANCYBOX)
   ========================================================================== */
   $(document).ready(function() {
    // Inicializa o Isotope
    var $grid = $('.grid').imagesLoaded(function() {
        $grid.isotope({
            itemSelector: '.grid-item',
            layoutMode: 'fitRows',
            transitionDuration: '0.6s'
        });
    });

    // Lógica de Filtro por Botões
    $('.filter-button-group').on('click', 'button', function() {
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
        $('.filter-button-group .btn').removeClass('active btn-dark').addClass('btn-outline-dark');
        $(this).addClass('active btn-dark').removeClass('btn-outline-dark');
    });

    // Filtro por Barra de Busca
    $('#search-input').on('keyup', function() {
        var searchText = $(this).val().toLowerCase();
        $grid.isotope({
            filter: function() {
                var name = $(this).find('.card-title').text().toLowerCase();
                return name.indexOf(searchText) > -1;
            }
        });
    });

    // Fancybox Zoom
    Fancybox.bind("[data-fancybox]", {
        infinite: true,
        keyboard: true,
        Toolbar: { display: { right: ["zoom", "slideshow", "fullScreen", "close"] } }
    });

    atualizarInterface();
});

/* ==========================================================================
   2. SISTEMA DE CARRINHO (ORÇAMENTO)
   ========================================================================== */
let carrinho = [];

function adicionarAoCarrinho(nome) {
    carrinho.push(nome);
    atualizarInterface();
    alert(nome + " adicionado ao orçamento!");
}

function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarInterface();
}

function atualizarInterface() {
    const lista = $('#lista-carrinho');
    const contador = $('#itens-total');
    lista.empty();

    if (carrinho.length > 0) {
        carrinho.forEach((item, index) => {
            lista.append(`
                <div class="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                    <span style="font-size: 0.9rem;">${item}</span>
                    <button onclick="removerItem(${index})" class="btn btn-sm text-danger">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>`);
        });
    } else {
        lista.html('<p class="text-center text-muted my-3">Seu orçamento está vazio.</p>');
    }
    contador.text(carrinho.length);
}

/* ==========================================================================
   3. FINALIZAÇÃO (WHATSAPP + E-MAIL FORMSPREE)
   ========================================================================== */

async function finalizarOrcamentoWPP() {
    const nomeCliente = $('#cliente-nome').val();
    const foneCliente = $('#cliente-fone').val();
    const urlFormspree = $('#formspree-url').val();

    // Validações
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    if (!nomeCliente || !foneCliente) {
        alert("Por favor, preencha seu nome e WhatsApp para continuar.");
        return;
    }

    // Prepara dados para o e-mail
    const listaProdutosText = carrinho.join(", ");
    $('#produtos-hidden').val(listaProdutosText);

    // Envio para o E-mail (Formspree)
    try {
        fetch(urlFormspree, {
            method: 'POST',
            body: new FormData(document.getElementById('form-orcamento')),
            headers: { 'Accept': 'application/json' }
        });
    } catch (e) {
        console.error("Erro ao registrar no e-mail");
    }

    // Envio para o WhatsApp
    const meuTelefone = "5562981111011";
    let mensagemWpp = `*NOVO ORÇAMENTO - FC MÓVEIS*\n\n`;
    mensagemWpp += `*Cliente:* ${nomeCliente}\n`;
    mensagemWpp += `*Contato:* ${foneCliente}\n\n`;
    mensagemWpp += `*Produtos Solicitados:*\n`;
    
    carrinho.forEach((item, index) => {
        mensagemWpp += `${index + 1}. ${item}\n`;
    });

    window.open(`https://wa.me/${meuTelefone}?text=${encodeURIComponent(mensagemWpp)}`, '_blank');
}

/* ==========================================================================
   4. GERAÇÃO DE PDF
   ========================================================================== */
function gerarPDF() {
    const nomeCliente = $('#cliente-nome').val() || "Cliente";
    const foneCliente = $('#cliente-fone').val() || "Não informado";

    if (carrinho.length === 0) {
        alert("Adicione itens ao carrinho para gerar o PDF!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Cabeçalho
    doc.setFontSize(18);
    doc.text("Orçamento - FC Móveis E Interiores", 10, 20);
    
    // Dados do Cliente
    doc.setFontSize(12);
    doc.text(`Cliente: ${nomeCliente}`, 10, 35);
    doc.text(`Contato: ${foneCliente}`, 10, 42);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 10, 49);
    
    doc.line(10, 55, 200, 55); // Linha divisória
    
    // Lista de Produtos
    doc.text("Itens solicitados:", 10, 65);
    carrinho.forEach((item, index) => {
        doc.text(`${index + 1}. ${item}`, 15, 75 + (index * 10));
    });
    
    // Rodapé
    doc.setFontSize(10);
    doc.text("Goiânia - GO", 10, 280);
    
    // Salva o arquivo com o nome do cliente
    doc.save(`Orcamento_FC_${nomeCliente.replace(/\s+/g, '_')}.pdf`);
}