const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const checkMusica = document.getElementById('alternar-musica');
const musica = new Audio('sons/luna-rise-part-one.mp3');
const comecar = new Audio('sons/play.wav');
const pausar = new Audio('sons/pause.mp3');
const terminou = new Audio('sons/beep.mp3');
const botaoComecar = document.getElementById('start-pause');
const iniciarOuPausarBt = document.querySelector('#start-pause span')
const iniciarOuPausarImagem = document.querySelector('#start-pause img')
const timer = document.getElementById('timer');
let intervaloId = null;

let tempoDecorridoEmSegundos = 1500;

musica.loop = true;

focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1500;
    alterarContexto('foco');
    focoBt.classList.add('active');
})

curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300;
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
})

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
})

checkMusica.addEventListener('change', () =>{
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
})

function alterarContexto(contexto) {
    mostrarTempo();
    botoes.forEach((contexto) => {
        contexto.classList.remove('active');
    })
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `imagens/${contexto}.png`);
    switch (contexto) {
        case 'foco':
                titulo.innerHTML = `Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>`
            break;
        case 'descanso-curto':
            titulo.innerHTML = `Que tal dar uma respirada?<br>
            <strong class="app__title-strong">Faça uma pausa curta!</strong>`
            break;
        case 'descanso-longo':
            titulo.innerHTML = `Hora de voltar à superfície.<br>
            <strong class="app__title-strong">Faça uma pausa longa.</strong>`
            break;
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <=0){
        terminou.play()
        alert('Tempo finalizado');
        const focoAtivo = html.getAttribute('data-contexto') == 'foco'
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado')
            document.dispatchEvent(evento)
        }
        zerar()
        return;
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
}

botaoComecar.addEventListener('click', iniciarOuPausar)

function iniciarOuPausar() {
    if (intervaloId){
        pausar.play()
        zerar();
        return;
    }
    iniciarOuPausarBt.textContent = 'Pausar'
    iniciarOuPausarImagem.setAttribute('src', 'imagens/pause.png')
    comecar.play()
    intervaloId = setInterval(contagemRegressiva, 1000);
}

function zerar() {
    clearInterval(intervaloId);
    iniciarOuPausarBt.textContent = 'Começar'
    iniciarOuPausarImagem.setAttribute('src', 'imagens/play_arrow.png')
    intervaloId = null;
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'})
    timer.innerHTML = `${tempoFormatado}`
}

mostrarTempo();