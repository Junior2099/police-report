// Variáveis globais
let tipoOcorrenciaSelecionado = '';

// Elementos DOM
const tipoOcorrenciaSection = document.getElementById('tipo-ocorrencia');
const ocorrenciaForm = document.getElementById('ocorrenciaForm');
const proximoBtn = document.getElementById('proximoBtn');
const gerarPdfBtn = document.getElementById('gerarPdfBtn');
const salvarJsonBtn = document.getElementById('salvarJsonBtn');
const restaurarDadosBtn = document.getElementById('restaurarDadosBtn');
const reiniciarFormBtn = document.getElementById('reiniciarFormBtn');
const arquivoJson = document.getElementById('arquivoJson');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    inicializarEventos();
    aplicarMascaras();
});

// Inicializar eventos
function inicializarEventos() {
    // Seleção do tipo de ocorrência
    const radioButtons = document.querySelectorAll('input[name="tipoOcorrencia"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                tipoOcorrenciaSelecionado = this.value;
                proximoBtn.disabled = false;
                proximoBtn.style.opacity = '1';
            }
        });
    });

    // Botão próximo
    proximoBtn.addEventListener('click', function() {
        if (tipoOcorrenciaSelecionado) {
            mostrarFormulario();
        }
    });

    // Checkboxes para celular
    document.getElementById('ehCelular').addEventListener('change', function() {
        toggleDadosCelular('dadosCelular');
    });

    document.getElementById('ehCelularRoubo').addEventListener('change', function() {
        toggleDadosCelular('dadosCelularRoubo');
    });

    document.getElementById('ehCelularPerda').addEventListener('change', function() {
        toggleDadosCelular('dadosCelularPerda');
    });

    // Botões de ação
    gerarPdfBtn.addEventListener('click', gerarPDF);
    salvarJsonBtn.addEventListener('click', salvarJSON);
    restaurarDadosBtn.addEventListener('click', () => arquivoJson.click());
    reiniciarFormBtn.addEventListener('click', reiniciarFormulario);
    arquivoJson.addEventListener('change', restaurarDados);
}

// Mostrar formulário baseado no tipo selecionado
function mostrarFormulario() {
    tipoOcorrenciaSection.style.display = 'none';
    ocorrenciaForm.style.display = 'block';
    
    // Mostrar seção específica baseada no tipo
    const secoesEspecificas = ['dadosFurto', 'dadosRoubo', 'dadosPerda', 'dadosBatida'];
    secoesEspecificas.forEach(secao => {
        document.getElementById(secao).style.display = 'none';
    });
    
    document.getElementById(`dados${tipoOcorrenciaSelecionado.charAt(0).toUpperCase() + tipoOcorrenciaSelecionado.slice(1)}`).style.display = 'block';
}

// Toggle dados do celular
function toggleDadosCelular(idElemento) {
    const elemento = document.getElementById(idElemento);
    const checkbox = event.target;
    elemento.style.display = checkbox.checked ? 'block' : 'none';
}

// Aplicar máscaras nos campos
function aplicarMascaras() {
    // Máscara para CPF
    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    });

    // Máscara para CEP
    const cepInputs = document.querySelectorAll('input[id*="cep"]');
    cepInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });
    });

    // Máscara para telefone
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
    });

    // Máscara para placa
    const placaInputs = document.querySelectorAll('input[id*="placa"]');
    placaInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
            if (value.length > 3) {
                value = value.substring(0, 3) + '-' + value.substring(3, 7);
            }
            e.target.value = value;
        });
    });
}

// Coletar dados do formulário
function coletarDados() {
    const dados = {
        tipoOcorrencia: tipoOcorrenciaSelecionado,
        dataOcorrencia: {
            data: document.getElementById('data').value,
            horario: document.getElementById('horario').value,
            cepLocal: document.getElementById('cepLocal').value,
            numeroLocal: document.getElementById('numeroLocal').value
        },
        dadosPessoais: {
            nomeCompleto: document.getElementById('nomeCompleto').value,
            sexo: document.getElementById('sexo').value,
            nascimento: document.getElementById('nascimento').value,
            naturalEstado: document.getElementById('naturalEstado').value,
            nomeMae: document.getElementById('nomeMae').value,
            cpf: document.getElementById('cpf').value,
            rgEstado: document.getElementById('rgEstado').value,
            rgNumero: document.getElementById('rgNumero').value,
            profissao: document.getElementById('profissao').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            cepRua: document.getElementById('cepRua').value,
            numeroCasa: document.getElementById('numeroCasa').value
        }
    };

    // Dados específicos por tipo
    switch (tipoOcorrenciaSelecionado) {
        case 'furto':
            dados.dadosEspecificos = {
                dadosObjeto: document.getElementById('dadosObjeto').value,
                ehCelular: document.getElementById('ehCelular').checked,
                dadosCelular: {
                    marca: document.getElementById('marcaCelular').value,
                    numeroChip: document.getElementById('numeroChip').value,
                    operadora: document.getElementById('operadora').value
                }
            };
            break;
        case 'roubo':
            dados.dadosEspecificos = {
                aparenciaBandido: document.getElementById('aparenciaBandido').value,
                quantosBandidos: document.getElementById('quantosBandidos').value,
                estavaVeiculo: document.getElementById('estavaVeiculo').value,
                dadosObjeto: document.getElementById('dadosObjetoRoubo').value,
                ehCelular: document.getElementById('ehCelularRoubo').checked,
                dadosCelular: {
                    marca: document.getElementById('marcaCelularRoubo').value,
                    numeroChip: document.getElementById('numeroChipRoubo').value,
                    operadora: document.getElementById('operadoraRoubo').value
                }
            };
            break;
        case 'perda':
            dados.dadosEspecificos = {
                dadosObjeto: document.getElementById('dadosObjetoPerda').value,
                ehCelular: document.getElementById('ehCelularPerda').checked,
                dadosCelular: {
                    marca: document.getElementById('marcaCelularPerda').value,
                    numeroChip: document.getElementById('numeroChipPerda').value,
                    operadora: document.getElementById('operadoraPerda').value
                }
            };
            break;
        case 'batida':
            dados.dadosEspecificos = {
                placaCarro: document.getElementById('placaCarro').value,
                corCarro: document.getElementById('corCarro').value,
                anoCarro: document.getElementById('anoCarro').value,
                temSeguro: document.getElementById('temSeguro').value,
                placaOutroVeiculo: document.getElementById('placaOutroVeiculo').value,
                corOutroVeiculo: document.getElementById('corOutroVeiculo').value,
                nomeEnvolvido: document.getElementById('nomeEnvolvido').value,
                relatoBatida: document.getElementById('relatoBatida').value
            };
            break;
    }

    return dados;
}

// Validar formulário
function validarFormulario() {
    const camposObrigatorios = [
        'data', 'horario', 'cepLocal', 'numeroLocal',
        'nomeCompleto', 'sexo', 'nascimento', 'naturalEstado',
        'nomeMae', 'cpf', 'rgEstado', 'rgNumero', 'profissao',
        'email', 'telefone', 'cepRua', 'numeroCasa'
    ];

    let valido = true;
    const camposInvalidos = [];

    camposObrigatorios.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (!elemento.value.trim()) {
            valido = false;
            camposInvalidos.push(campo);
            elemento.style.borderColor = '#e74c3c';
        } else {
            elemento.style.borderColor = '#27ae60';
        }
    });

    // Validações específicas por tipo
    if (tipoOcorrenciaSelecionado === 'roubo') {
        const camposRoubo = ['aparenciaBandido', 'quantosBandidos', 'estavaVeiculo', 'dadosObjetoRoubo'];
        camposRoubo.forEach(campo => {
            const elemento = document.getElementById(campo);
            if (!elemento.value.trim()) {
                valido = false;
                camposInvalidos.push(campo);
                elemento.style.borderColor = '#e74c3c';
            }
        });
    }

    if (tipoOcorrenciaSelecionado === 'batida') {
        const camposBatida = ['placaCarro', 'corCarro', 'anoCarro', 'temSeguro'];
        camposBatida.forEach(campo => {
            const elemento = document.getElementById(campo);
            if (!elemento.value.trim()) {
                valido = false;
                camposInvalidos.push(campo);
                elemento.style.borderColor = '#e74c3c';
            }
        });
    }

    if (!valido) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return false;
    }

    return true;
}

// Gerar PDF
function gerarPDF() {
    if (!validarFormulario()) return;

    const dados = coletarDados();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configurações
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('FORMULÁRIO DE OCORRÊNCIA POLICIAL', 20, 20);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Tipo de Ocorrência: ${tipoOcorrenciaSelecionado.toUpperCase()}`, 20, 35);
    doc.text(`Data: ${dados.dataOcorrencia.data}`, 20, 45);
    doc.text(`Horário: ${dados.dataOcorrencia.horario}`, 20, 55);
    doc.text(`Local: CEP ${dados.dataOcorrencia.cepLocal}, Nº ${dados.dataOcorrencia.numeroLocal}`, 20, 65);

    // Dados pessoais
    doc.setFont(undefined, 'bold');
    doc.text('DADOS PESSOAIS:', 20, 80);
    doc.setFont(undefined, 'normal');
    
    let y = 90;
    const dadosPessoais = dados.dadosPessoais;
    doc.text(`Nome: ${dadosPessoais.nomeCompleto}`, 20, y);
    y += 10;
    doc.text(`Sexo: ${dadosPessoais.sexo}`, 20, y);
    y += 10;
    doc.text(`Nascimento: ${dadosPessoais.nascimento}`, 20, y);
    y += 10;
    doc.text(`Natural de: ${dadosPessoais.naturalEstado}`, 20, y);
    y += 10;
    doc.text(`Nome da Mãe: ${dadosPessoais.nomeMae}`, 20, y);
    y += 10;
    doc.text(`CPF: ${dadosPessoais.cpf}`, 20, y);
    y += 10;
    doc.text(`RG: ${dadosPessoais.rgNumero} - ${dadosPessoais.rgEstado}`, 20, y);
    y += 10;
    doc.text(`Profissão: ${dadosPessoais.profissao}`, 20, y);
    y += 10;
    doc.text(`E-mail: ${dadosPessoais.email}`, 20, y);
    y += 10;
    doc.text(`Telefone: ${dadosPessoais.telefone}`, 20, y);
    y += 10;
    doc.text(`Endereço: CEP ${dadosPessoais.cepRua}, Nº ${dadosPessoais.numeroCasa}`, 20, y);

    // Dados específicos
    y += 20;
    doc.setFont(undefined, 'bold');
    doc.text('DADOS ESPECÍFICOS:', 20, y);
    doc.setFont(undefined, 'normal');
    y += 10;

    const especificos = dados.dadosEspecificos;
    switch (tipoOcorrenciaSelecionado) {
        case 'furto':
            doc.text(`Objeto: ${especificos.dadosObjeto}`, 20, y);
            if (especificos.ehCelular) {
                y += 10;
                doc.text(`Marca: ${especificos.dadosCelular.marca}`, 20, y);
                y += 10;
                doc.text(`Chip: ${especificos.dadosCelular.numeroChip}`, 20, y);
                y += 10;
                doc.text(`Operadora: ${especificos.dadosCelular.operadora}`, 20, y);
            }
            break;
        case 'roubo':
            doc.text(`Aparência do Bandido: ${especificos.aparenciaBandido}`, 20, y);
            y += 10;
            doc.text(`Quantos eram: ${especificos.quantosBandidos}`, 20, y);
            y += 10;
            doc.text(`Estava: ${especificos.estavaVeiculo}`, 20, y);
            y += 10;
            doc.text(`Objeto: ${especificos.dadosObjeto}`, 20, y);
            if (especificos.ehCelular) {
                y += 10;
                doc.text(`Marca: ${especificos.dadosCelular.marca}`, 20, y);
                y += 10;
                doc.text(`Chip: ${especificos.dadosCelular.numeroChip}`, 20, y);
                y += 10;
                doc.text(`Operadora: ${especificos.dadosCelular.operadora}`, 20, y);
            }
            break;
        case 'perda':
            doc.text(`Objeto: ${especificos.dadosObjeto}`, 20, y);
            if (especificos.ehCelular) {
                y += 10;
                doc.text(`Marca: ${especificos.dadosCelular.marca}`, 20, y);
                y += 10;
                doc.text(`Chip: ${especificos.dadosCelular.numeroChip}`, 20, y);
                y += 10;
                doc.text(`Operadora: ${especificos.dadosCelular.operadora}`, 20, y);
            }
            break;
        case 'batida':
            doc.text(`Placa: ${especificos.placaCarro}`, 20, y);
            y += 10;
            doc.text(`Cor: ${especificos.corCarro}`, 20, y);
            y += 10;
            doc.text(`Ano: ${especificos.anoCarro}`, 20, y);
            y += 10;
            doc.text(`Seguro: ${especificos.temSeguro}`, 20, y);
            y += 10;
            doc.text(`Outro Veículo - Placa: ${especificos.placaOutroVeiculo}`, 20, y);
            y += 10;
            doc.text(`Outro Veículo - Cor: ${especificos.corOutroVeiculo}`, 20, y);
            y += 10;
            doc.text(`Nome do Envolvido: ${especificos.nomeEnvolvido}`, 20, y);
            y += 10;
            doc.text(`Relato: ${especificos.relatoBatida}`, 20, y);
            break;
    }

    // Salvar PDF
    const nomeArquivo = `ocorrencia_${tipoOcorrenciaSelecionado}_${dados.dataOcorrencia.data.replace(/-/g, '')}.pdf`;
    doc.save(nomeArquivo);
}

// Salvar JSON
function salvarJSON() {
    if (!validarFormulario()) return;

    const dados = coletarDados();
    const jsonString = JSON.stringify(dados, null, 2);
    
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `ocorrencia_${tipoOcorrenciaSelecionado}_${dados.dataOcorrencia.data.replace(/-/g, '')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Restaurar dados do JSON
function restaurarDados(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const dados = JSON.parse(e.target.result);
            preencherFormulario(dados);
            alert('Dados restaurados com sucesso!');
        } catch (error) {
            alert('Erro ao ler o arquivo JSON. Verifique se o arquivo está correto.');
        }
    };
    reader.readAsText(file);
}

// Preencher formulário com dados
function preencherFormulario(dados) {
    // Restaurar tipo de ocorrência
    tipoOcorrenciaSelecionado = dados.tipoOcorrencia;
    document.querySelector(`input[value="${dados.tipoOcorrencia}"]`).checked = true;
    mostrarFormulario();

    // Dados da ocorrência
    document.getElementById('data').value = dados.dataOcorrencia.data;
    document.getElementById('horario').value = dados.dataOcorrencia.horario;
    document.getElementById('cepLocal').value = dados.dataOcorrencia.cepLocal;
    document.getElementById('numeroLocal').value = dados.dataOcorrencia.numeroLocal;

    // Dados pessoais
    const pessoais = dados.dadosPessoais;
    document.getElementById('nomeCompleto').value = pessoais.nomeCompleto;
    document.getElementById('sexo').value = pessoais.sexo;
    document.getElementById('nascimento').value = pessoais.nascimento;
    document.getElementById('naturalEstado').value = pessoais.naturalEstado;
    document.getElementById('nomeMae').value = pessoais.nomeMae;
    document.getElementById('cpf').value = pessoais.cpf;
    document.getElementById('rgEstado').value = pessoais.rgEstado;
    document.getElementById('rgNumero').value = pessoais.rgNumero;
    document.getElementById('profissao').value = pessoais.profissao;
    document.getElementById('email').value = pessoais.email;
    document.getElementById('telefone').value = pessoais.telefone;
    document.getElementById('cepRua').value = pessoais.cepRua;
    document.getElementById('numeroCasa').value = pessoais.numeroCasa;

    // Dados específicos
    const especificos = dados.dadosEspecificos;
    switch (dados.tipoOcorrencia) {
        case 'furto':
            document.getElementById('dadosObjeto').value = especificos.dadosObjeto;
            document.getElementById('ehCelular').checked = especificos.ehCelular;
            if (especificos.ehCelular) {
                document.getElementById('marcaCelular').value = especificos.dadosCelular.marca;
                document.getElementById('numeroChip').value = especificos.dadosCelular.numeroChip;
                document.getElementById('operadora').value = especificos.dadosCelular.operadora;
                document.getElementById('dadosCelular').style.display = 'block';
            }
            break;
        case 'roubo':
            document.getElementById('aparenciaBandido').value = especificos.aparenciaBandido;
            document.getElementById('quantosBandidos').value = especificos.quantosBandidos;
            document.getElementById('estavaVeiculo').value = especificos.estavaVeiculo;
            document.getElementById('dadosObjetoRoubo').value = especificos.dadosObjeto;
            document.getElementById('ehCelularRoubo').checked = especificos.ehCelular;
            if (especificos.ehCelular) {
                document.getElementById('marcaCelularRoubo').value = especificos.dadosCelular.marca;
                document.getElementById('numeroChipRoubo').value = especificos.dadosCelular.numeroChip;
                document.getElementById('operadoraRoubo').value = especificos.dadosCelular.operadora;
                document.getElementById('dadosCelularRoubo').style.display = 'block';
            }
            break;
        case 'perda':
            document.getElementById('dadosObjetoPerda').value = especificos.dadosObjeto;
            document.getElementById('ehCelularPerda').checked = especificos.ehCelular;
            if (especificos.ehCelular) {
                document.getElementById('marcaCelularPerda').value = especificos.dadosCelular.marca;
                document.getElementById('numeroChipPerda').value = especificos.dadosCelular.numeroChip;
                document.getElementById('operadoraPerda').value = especificos.dadosCelular.operadora;
                document.getElementById('dadosCelularPerda').style.display = 'block';
            }
            break;
        case 'batida':
            document.getElementById('placaCarro').value = especificos.placaCarro;
            document.getElementById('corCarro').value = especificos.corCarro;
            document.getElementById('anoCarro').value = especificos.anoCarro;
            document.getElementById('temSeguro').value = especificos.temSeguro;
            document.getElementById('placaOutroVeiculo').value = especificos.placaOutroVeiculo;
            document.getElementById('corOutroVeiculo').value = especificos.corOutroVeiculo;
            document.getElementById('nomeEnvolvido').value = especificos.nomeEnvolvido;
            document.getElementById('relatoBatida').value = especificos.relatoBatida;
            break;
    }
}

// Reiniciar formulário
function reiniciarFormulario() {
    if (confirm('Tem certeza que deseja reiniciar o formulário? Todos os dados preenchidos serão perdidos.')) {
        // Limpar todos os campos
        const todosOsInputs = document.querySelectorAll('input, select, textarea');
        todosOsInputs.forEach(input => {
            if (input.type === 'radio' || input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }
            input.style.borderColor = '#e9ecef';
        });

        // Esconder seções específicas
        const secoesEspecificas = ['dadosFurto', 'dadosRoubo', 'dadosPerda', 'dadosBatida'];
        secoesEspecificas.forEach(secao => {
            document.getElementById(secao).style.display = 'none';
        });

        // Esconder dados do celular
        const dadosCelular = ['dadosCelular', 'dadosCelularRoubo', 'dadosCelularPerda'];
        dadosCelular.forEach(id => {
            document.getElementById(id).style.display = 'none';
        });

        // Voltar para a seleção de tipo de ocorrência
        tipoOcorrenciaSelecionado = '';
        tipoOcorrenciaSection.style.display = 'block';
        ocorrenciaForm.style.display = 'none';

        // Resetar botão próximo
        proximoBtn.disabled = true;
        proximoBtn.style.opacity = '0.6';

        // Limpar arquivo JSON selecionado
        arquivoJson.value = '';

        alert('Formulário reiniciado com sucesso!');
    }
}
