document.addEventListener('DOMContentLoaded', () => {
  const cnpjInput = document.getElementById('cnpj-input');
  const consultarBtn = document.getElementById('consultar-btn');
  const resultadoEl = document.getElementById('resultado');

  const campoParaRotulo = {
    "razao_social": "Razão Social",
    "nome_fantasia": "Nome Fantasia",
    "cnpj": "CNPJ",
    "uf": "UF",
    "municipio": "Município",
    "bairro": "Bairro",
    "logradouro": "Logradouro",
    "numero": "Número",
    "cep": "CEP",
    "ddd_telefone_1": "Telefone",
    "cnae_fiscal_descricao": "Atividade Principal (CNAE)",
    "descricao_situacao_cadastral": "Situação Cadastral",
    "data_situacao_cadastral": "Data da Situação",
    "capital_social": "Capital Social"
  };
  
  function formatarResultado(data) {
    let htmlResultados = '';
    
    for (const campo in campoParaRotulo) {
      if (data[campo]) {
        let valor = data[campo];
        if (campo === 'capital_social') {
          valor = parseFloat(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
        htmlResultados += `
          <div class="item">
            <strong>${campoParaRotulo[campo]}:</strong>
            <span>${valor}</span>
          </div>
        `;
      }
    }
    
    const razaoSocial = encodeURIComponent(data.razao_social);
    const googleSearchUrl = `https://www.google.com/search?q=${razaoSocial}`;
    
    const htmlBotaoBusca = `
      <div style="text-align: center;">
        <a href="${googleSearchUrl}" class="search-link" target="_blank" rel="noopener noreferrer">
          Procurar site no Google
        </a>
      </div>
    `;

    return htmlResultados + htmlBotaoBusca;
  }

  async function consultarCNPJ() {
    resultadoEl.innerHTML = ''; // Limpa resultados anteriores
    const cnpj = cnpjInput.value.replace(/\D/g, '');

    if (cnpj.length !== 14) {
      resultadoEl.innerHTML = `<p class="error-message">Erro: O CNPJ deve conter 14 números.</p>`;
      return;
    }
    
    const url = `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'CNPJ não encontrado.' : 'Falha na comunicação com a API.');
      }
      
      const data = await response.json();
      resultadoEl.innerHTML = formatarResultado(data);

    } catch (error) {
      resultadoEl.innerHTML = `<p class="error-message">Falha na consulta: ${error.message}</p>`;
    }
  }

  consultarBtn.addEventListener('click', consultarCNPJ);
  cnpjInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      consultarCNPJ();
    }
  });
});
