// Service worker mínimo: só habilita instalar o app na tela inicial.
// De propósito não guarda nada em cache: comandas e estoque precisam sempre
// vir do servidor.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
