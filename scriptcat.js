$(document).ready(function() {
    // 1. Inicializa o Isotope
    // Usamos imagesLoaded para evitar que os cards fiquem um sobre o outro
    var $grid = $('.grid').imagesLoaded(function() {
        $grid.isotope({
            itemSelector: '.grid-item',
            layoutMode: 'fitRows',
            transitionDuration: '0.6s'
        });
    });

    // 2. Lógica Unificada de Filtro e Busca
    // Filtragem por botões
    $('.filter-button-group').on('click', 'button', function() {
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });

        // Ajuste visual dos botões
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

    // 3. Inicializa o Fancybox (Zoom e Galeria)
    Fancybox.bind("[data-fancybox]", {
        infinite: true,
        keyboard: true,
        Toolbar: {
            display: {
                right: ["zoom", "slideshow", "fullScreen", "close"],
            },
        }
    });
});

// 4. Função para o WhatsApp (Fora do ready para o HTML encontrar)
function enviarInteresse(produto) {
    const telefone = "5562981111011"; 
    const texto = encodeURIComponent(`Olá! Vi o produto "${produto}" no site da FC Móveis e gostaria de mais informações.`);
    window.open(`https://wa.me/${telefone}?text=${texto}`, '_blank');
}