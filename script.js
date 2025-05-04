// Estado global do pedido
let pedidoAtual = {
    tipo: '',
    tamanho: '',
    preco: 0,
    complementos: [],
    entrega: {
        cidade: '',
        rua: '',
        numero: '',
        referencia: '',
        nomeCliente: ''
    }
};

// Elementos DOM
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const copoSizes = document.getElementById('copo-sizes');
const barcaSizes = document.getElementById('barca-sizes');
const resumoConteudo = document.getElementById('resumo-conteudo');
const precoTotal = document.getElementById('preco-total');

// Eventos para seleção de tipo (Copo ou Barca)
document.querySelectorAll('.option-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Resetar seleções anteriores
        document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');

        // Atualizar tipo selecionado
        pedidoAtual.tipo = button.dataset.type;
        pedidoAtual.tamanho = '';
        pedidoAtual.preco = 0;
        pedidoAtual.complementos = [];

        // Mostrar tamanhos correspondentes
        step2.style.display = 'block';
        if (pedidoAtual.tipo === 'copo') {
            copoSizes.style.display = 'flex';
            barcaSizes.style.display = 'none';
        } else {
            copoSizes.style.display = 'none';
            barcaSizes.style.display = 'flex';
        }

        // Esconder passo 3 até selecionar tamanho
        step3.style.display = 'none';
        atualizarResumo();
    });
});

// Eventos para seleção de tamanho
document.querySelectorAll('.size-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Resetar seleções anteriores do mesmo grupo
        const parent = button.parentElement;
        parent.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');

        // Atualizar tamanho e preço base
        pedidoAtual.tamanho = button.dataset.size;
        pedidoAtual.preco = parseFloat(button.dataset.price);

        // Mostrar complementos
        step3.style.display = 'block';
        atualizarResumo();
    });
});

// Eventos para seleção de complementos
document.querySelectorAll('.complemento-btn').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('selected');

        const complemento = {
            tipo: button.dataset.tipo,
            nome: button.dataset.nome,
            preco: parseFloat(button.dataset.price)
        };

        if (button.classList.contains('selected')) {
            pedidoAtual.complementos.push(complemento);
        } else {
            pedidoAtual.complementos = pedidoAtual.complementos.filter(
                item => !(item.nome === complemento.nome && item.tipo === complemento.tipo)
            );
        }

        atualizarResumo();
    });
});

// Eventos para campos de entrega
document.getElementById('cidade').addEventListener('change', (e) => {
    pedidoAtual.entrega.cidade = e.target.value;
    atualizarResumo();
});

document.getElementById('rua').addEventListener('input', (e) => {
    pedidoAtual.entrega.rua = e.target.value;
    atualizarResumo();
});

document.getElementById('numero').addEventListener('input', (e) => {
    pedidoAtual.entrega.numero = e.target.value;
    atualizarResumo();
});

document.getElementById('referencia').addEventListener('input', (e) => {
    pedidoAtual.entrega.referencia = e.target.value;
    atualizarResumo();
});

document.getElementById('nome-cliente').addEventListener('input', (e) => {
    pedidoAtual.entrega.nomeCliente = e.target.value;
    atualizarResumo();
});

// Função para atualizar o resumo do pedido
function atualizarResumo() {
    if (!pedidoAtual.tipo) {
        resumoConteudo.innerHTML = '<p>Selecione os itens para montar seu pedido</p>';
        precoTotal.textContent = 'R$0,00';
        return;
    }

    let resumoHTML = `<p><strong>${pedidoAtual.tipo === 'copo' ? 'Copo' : 'Barca'} de Açaí ${pedidoAtual.tamanho}</strong></p>`;

    if (pedidoAtual.complementos.length > 0) {
        resumoHTML += '<p><strong>Complementos:</strong></p><ul>';
        pedidoAtual.complementos.forEach(complemento => {
            resumoHTML += `<li>${complemento.nome}</li>`;
        });
        resumoHTML += '</ul>';
    }

    if (pedidoAtual.entrega.cidade) {
        resumoHTML += '<p><strong>Dados de Entrega:</strong></p>';
        resumoHTML += `<p>Cidade: ${pedidoAtual.entrega.cidade}</p>`;
        if (pedidoAtual.entrega.rua) resumoHTML += `<p>Rua: ${pedidoAtual.entrega.rua}</p>`;
        if (pedidoAtual.entrega.numero) resumoHTML += `<p>Número: ${pedidoAtual.entrega.numero}</p>`;
        if (pedidoAtual.entrega.referencia) resumoHTML += `<p>Referência: ${pedidoAtual.entrega.referencia}</p>`;
        if (pedidoAtual.entrega.nomeCliente) resumoHTML += `<p>Cliente: ${pedidoAtual.entrega.nomeCliente}</p>`;
    }

    resumoConteudo.innerHTML = resumoHTML;

    // Mostrar apenas o preço base
    precoTotal.textContent = `R$${pedidoAtual.preco.toFixed(2)}`;
}

// Variáveis para o modal de pagamento
const modalPix = document.getElementById('modal-pix');
const inputComprovante = document.getElementById('comprovante');
const previewArea = document.getElementById('preview-area');
let comprovanteFile = null;

// Função para mostrar o modal
function mostrarModal() {
    modalPix.style.display = 'block';
}

// Função para fechar o modal
function fecharModal() {
    modalPix.style.display = 'none';
}

// Fechar modal ao clicar fora dele
modalPix.addEventListener('click', (e) => {
    if (e.target === modalPix) {
        fecharModal();
    }
});

// Manipular upload do comprovante
inputComprovante.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        comprovanteFile = file;
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewArea.innerHTML = `<img src="${e.target.result}" alt="Comprovante">`;
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'application/pdf') {
            previewArea.innerHTML = `<p>PDF selecionado: ${file.name}</p>`;
        }
    }
});

// Evento para enviar pedido no WhatsApp
document.getElementById('enviar-whatsapp').addEventListener('click', () => {
    if (!pedidoAtual.tipo || !pedidoAtual.tamanho) {
        alert('Por favor, selecione o tipo e tamanho do seu açaí!');
        return;
    }

    if (!pedidoAtual.entrega.cidade || !pedidoAtual.entrega.rua || !pedidoAtual.entrega.numero || !pedidoAtual.entrega.nomeCliente) {
        alert('Por favor, preencha todos os dados de entrega!');
        return;
    }

    mostrarModal();
});

// Evento para confirmar pagamento
document.getElementById('confirmar-pagamento').addEventListener('click', () => {
    if (!comprovanteFile) {
        alert('Por favor, envie o comprovante de pagamento!');
        return;
    }

    const tipoFormatado = pedidoAtual.tipo === 'copo' ? 'Copo' : 'Barca';
    let mensagem = `Olá! Quero um pedido de:\n\n*${tipoFormatado} de Açaí ${pedidoAtual.tamanho}* (R$${pedidoAtual.preco.toFixed(2)})`;

    if (pedidoAtual.complementos.length > 0) {
        mensagem += '\nCom os complementos:';
        pedidoAtual.complementos.forEach(complemento => {
            mensagem += `\n- ${complemento.nome}`;
        });
    }

    mensagem += `\n\nTotal: R$${pedidoAtual.preco.toFixed(2)}`;
    
    mensagem += '\n\n*Dados para Entrega:*';
    mensagem += `\nCidade: ${pedidoAtual.entrega.cidade}`;
    mensagem += `\nEndereço: ${pedidoAtual.entrega.rua}, ${pedidoAtual.entrega.numero}`;
    if (pedidoAtual.entrega.referencia) {
        mensagem += `\nReferência: ${pedidoAtual.entrega.referencia}`;
    }
    mensagem += `\nCliente: ${pedidoAtual.entrega.nomeCliente}`;
    mensagem += '\n\n*Pagamento via PIX realizado*';

    // Encode a mensagem para URL
    const mensagemEncoded = encodeURIComponent(mensagem);
    // Substitua pelo número do WhatsApp real da loja
    window.open(`https://wa.me/5524981128510?text=${mensagemEncoded}`);
    fecharModal();
});