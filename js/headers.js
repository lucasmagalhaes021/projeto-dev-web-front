// HeaderModule: Gerencia o carregamento de headers dinâmicos
const HeaderModule = (() => {
  async function loadHeader(url, targetId) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      document.getElementById(targetId).innerHTML = html;
    } catch (err) {
      console.error(`Erro ao carregar ${url}:`, err);
    }
  }

  function initializeHeaders() {
    loadHeader('/utils/loginHeader.html', 'login-header');
    loadHeader('/utils/homeHeader.html', 'home-header');
  }

  return {
    initializeHeaders,
  };
})();

// Main Application Initialization
(function AppInit() {
  document.addEventListener('DOMContentLoaded', () => {
    HeaderModule.initializeHeaders();
  });
})();
