const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textarea = document.querySelector('.app__form-textarea');
let listaTarefas = JSON.parse(localStorage.getItem('listaTarefas')) || [];
const ulTarefas = document.querySelector('.app__section-task-list');
const btnCancelar = document.querySelector('.app__form-footer__button--cancel');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');
const btnRemoverConcluidos = document.getElementById('btn-remover-concluidas');
const btnRemoverTodas = document.getElementById('btn-remover-todas')

let tarefaSelecionada = null;
let liTarefaSelecionada = null;

function atualizarTarefas() {
    localStorage.setItem('listaTarefas', JSON.stringify(listaTarefas));
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item')
    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"   fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `
    const paragrafo = document.createElement('p');
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description')
    
    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');

    botao.onclick = () => {
        const novaDescricao = prompt('Qual é o novo nome da tarefa?')
        console.log('nova descricao da tarefa: ', novaDescricao);
        if (novaDescricao) {
            paragrafo.textContent = novaDescricao
            tarefa.descricao = novaDescricao
            atualizarTarefas();
        }
    }

    const imagemBotao = document.createElement('img');

    imagemBotao.setAttribute('src', 'imagens/edit.png');

    botao.append(imagemBotao);
    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete')
        botao.setAttribute('disabled', 'true')
    } else {
        li.onclick = () => {
            if (tarefaSelecionada == tarefa) {
                document.querySelectorAll('.app__section-task-list-item-active').forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active')
                })
                paragrafoDescricaoTarefa.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null
                return;
            } 
    
            tarefaSelecionada = tarefa
            paragrafoDescricaoTarefa.textContent = tarefa.descricao
            liTarefaSelecionada = li
            li.classList.add('app__section-task-list-item-active')
        }        
    }


    return li;
}

btnAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden');
})

formAdicionarTarefa.addEventListener('submit', (e) => {
    e.preventDefault()
    const tarefa = {
        descricao: textarea.value
    }
    listaTarefas.push(tarefa);
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    atualizarTarefas();
    textarea.value = '';
    formAdicionarTarefa.classList.add('hidden')
})

listaTarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
});

function cancelarForm() {
    textarea.value = ''
    formAdicionarTarefa.classList.add('hidden')
}

btnCancelar.addEventListener('click', (e) => {
    e.preventDefault()
    cancelarForm();
})

document.addEventListener('FocoFinalizado', () => {
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'true')
        tarefaSelecionada.completa = true
        atualizarTarefas()
        
    }
})

const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    listaTarefas = somenteCompletas ? listaTarefas.filter(tarefa => !tarefa.completa) : []
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })
    atualizarTarefas()
}

btnRemoverConcluidos.onclick = () => removerTarefas(true)
btnRemoverTodas.onclick = () => removerTarefas(false)