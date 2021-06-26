var arrayAnimesAssistidos = []
var arrayFilmesAssistidos = []
var arrayAnimesSugestoes = []
var arrayFilmesSugestoes = []
$( document ).ready(function() {

    $('#nav-filmes').on('click', function(){
        $("#nav-filmes").addClass("active");
	    $("#nav-animes").removeClass("active");
	    $("#nav-sugestoes").removeClass("active");
        $("#Filmes").removeClass("hide");
	    $("#Animes").addClass("hide");
	    $("#Sugestoes").addClass("hide");
    })
    $('#nav-animes').on('click', function(){
        $("#nav-filmes").removeClass("active");
	    $("#nav-animes").addClass("active");
	    $("#nav-sugestoes").removeClass("active");
        $("#Filmes").addClass("hide");
	    $("#Animes").removeClass("hide");
	    $("#Sugestoes").addClass("hide");
    })
    $('#nav-sugestoes').on('click', function(){
        $("#nav-filmes").removeClass("active");
	    $("#nav-animes").removeClass("active");
	    $("#nav-sugestoes").addClass("active");
        $("#Filmes").addClass("hide");
	    $("#Animes").addClass("hide");
	    $("#Sugestoes").removeClass("hide");
    })	

    getAnimes();
    getFilmes();
    getSugestoesAnimes();
    getSugestoesFilmes();

    // Estilos diferentes NotifyJs
    $.notify.addStyle('success', {
		html: 
		"<div style='user-select: none; background-color:#2F3136; border: 1px solid #28A745'>" + 
		"<div style='background-color: rgba(40, 167, 69, 0.2); padding: 10px; '>" +
			"<img style='width: 25px; float:left;' src='./img/icn-success.svg'>" +
			"<div style='margin-left: 30px; line-height: 25px; font-weight: bold; color: #28A745;' class='title' data-notify-text>TESTE DE TEXTO</div>" +
		"</div>" +
		"</div>"
	});
	$.notify.addStyle('error', {
		html: 
		"<div style='user-select: none; background-color:#2F3136; border: 1px solid #DC3545'>" + 
		"<div style='background-color: rgba(220, 53, 69, 0.2); padding: 10px; '>" +
			"<img style='width: 25px; float:left;' src='./img/icn-error.svg'>" +
			"<div style='margin-left: 30px; line-height: 25px; font-weight: bold; color: #DC3545;' class='title' data-notify-text>TESTE DE TEXTO</div>" +
		"</div>" +
		"</div>"
	});
});

function getAnimes(){
    arrayAnimesAssistidos = []
    $.getJSON({
        dataType: "json",
        url: "http://localhost:3000/animes",
        success: function(result) {
           arrayAnimesAssistidos = result;
           render()
        },
         error: function(event, jqxhr, exception) {
            console.log(event.responseText);
        }
    });

    function render(){
        $("#Animes .row").html("");
        for(anime of arrayAnimesAssistidos){
            $("#Animes .row").append(`<div class="card-filme">
                <img src="${anime.info.image_url}">
                <p>${anime.nome}</p>
            </div>`);
            
        }
        $("#Animes .row").append(`<div id="addAnime"  class="card card-filme">
        <img src="./img/icn-add.svg">
        <input id="animeInput" type="text" placeholder="Nome do Anime">
        <button type="button" onClick='addAnimeAssistido()' class="btn btn-secondary">Adicionar Anime</button>
    </div>`);
        
    }
}

function getFilmes(){
    arrayFilmesAssistidos = []
    $.getJSON({
        dataType: "json",
        url: "http://localhost:3001/filmes",
        success: function(result) {
           arrayFilmesAssistidos = result;
           console.log(arrayFilmesAssistidos)
           render()
        },
         error: function(event, jqxhr, exception) {
            console.log(event);
        }
    });

    function render(){
        $("#Filmes .row").html("");
        for(filme of arrayFilmesAssistidos){
            $("#Filmes .row").append(`<div class="card-filme">
                <img src="${filme.i.imageUrl}">
                <p>${filme.l}</p>
            </div>`);
            
        }
        $("#Filmes .row").append(`<div id="addFilme"  class="card card-filme">
        <img src="./img/icn-add.svg">
        <input id="filmeInput" type="text" placeholder="Nome do Filme">
        <button type="button" onClick='addFilmeAssistido()' class="btn btn-secondary">Adicionar Filme</button>
    </div>`);
        
    }
}

function getSugestoesAnimes(){
    arrayAnimesSugestoes = []
    $.getJSON({
        dataType: "json",
        url: "http://localhost:3002/animesSugestoes",
        success: function(result) {
            arrayAnimesSugestoes = result;
           console.log(arrayAnimesSugestoes)
           renderAnime(result)
        },
         error: function(event, jqxhr, exception) {
            console.log(event.responseText);
        }
    });

    function renderAnime(){
        $("#AnimesSugestoes").html();
        for(animeSug of arrayAnimesSugestoes){
            console.log(animeSug)
            $("#AnimesSugestoes").append(`<div class="card-filme">
                <img src="${animeSug.image_url}">
                <p>${animeSug.title}</p>
            </div>`);
            
        }
        
    }
}
function getSugestoesFilmes(){
    arrayFilmesSugestoes = []
    $.getJSON({
        dataType: "json",
        url: "http://localhost:3002/filmesSugestoes",
        success: function(result) {
           arrayFilmesSugestoes = result;
           console.log(arrayFilmesSugestoes)
           renderFilme(result)
        },
         error: function(event, jqxhr, exception) {
            console.log(event.responseText);
        }
    });

    function renderFilme(){
        $("#FilmesSugestoes").html();
        for(filmesug of arrayFilmesSugestoes){
            if(filmesug){
                // console.log(filmesug)
                $("#FilmesSugestoes").append(`<div class="card-filme">
                    <img src="${filmesug.i.imageUrl}">
                    <p>${filmesug.l}</p>
                </div>`);
            }
            
        }
        
    }
}


function NotificationUI(text, type, autoHide){
	$.notify(text, {
		style:type,
		globalPosition:"bottom right",
		autoHide: autoHide,
	});

}

function addAnimeAssistido(){
    $('#animeInput').val();

    $.ajax({
        type: 'PUT',
        url: 'http://localhost:3000/animes',
        data: JSON.stringify({"nome": $('#animeInput').val()}),
        success: function(result){
            NotificationUI("Anime adicionado com Sucesso", 'success', true)
            getAnimes()
        },
        error: function(event, jqxhr, exception) {
            console.log(event)
            if (event.status == 0){
                NotificationUI("Erro ao comunicar com servidor", 'error', true)
            } else {
                NotificationUI(event.responseText, 'error', true)
            }
        },
        contentType: "application/json",
        dataType: 'json'
    });
}

function addFilmeAssistido(){
    $('#filmeInput').val();

    $.ajax({
        type: 'PUT',
        url: 'http://localhost:3001/filmes/' + $('#filmeInput').val(),
        data: "",
        success: function(result){
            NotificationUI("Filme adicionado com Sucesso", 'success', true)
            getFilmes();
        },
        error: function(event, jqxhr, exception) {
            console.log(event)
            if (event.status == 0){
                NotificationUI("Erro ao comunicar com servidor", 'error', true)
            } else {
                NotificationUI(event.responseText, 'error', true)
            }
        },
        contentType: "application/json",
        dataType: 'json'
    });
}