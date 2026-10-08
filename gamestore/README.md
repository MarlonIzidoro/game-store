# GameStore — projeto inicial

## Como executar
1. Extraia o ZIP.
2. Abra `index.html` no navegador. Para desenvolvimento, você também pode usar a extensão Live Server no VS Code.
3. No arquivo `script.js`, altere `WHATSAPP_NUMBER` para o número comercial no formato internacional, apenas números (ex.: 5511999999999).
4. Personalize produtos e textos. O painel ⚙️ permite cadastrar, editar e excluir produtos neste navegador.

## O que já funciona
- Layout responsivo para computador e celular.
- Busca, categorias e filtros de produtos.
- Carrinho com quantidades e cálculo do total.
- Criação de pedido local e tentativa de abrir o WhatsApp.
- Painel administrativo demonstrativo com CRUD de produtos e atualização manual do status dos pedidos.
- Persistência local via `localStorage`.

## Limitações importantes
Esta é uma demonstração front-end, não uma loja pronta para transações reais:
- Produtos, carrinho, painel e pedidos ficam no `localStorage` do navegador; não são compartilhados entre dispositivos.
- O painel não tem autenticação e NÃO deve ser usado como painel real na internet.
- Não processa pagamentos nem confirma comprovantes automaticamente.
- Para produção, implemente backend/API, banco de dados, autenticação e permissões, validação de preços no servidor, proteção contra fraude e integração com um provedor de pagamento confiável.
- Venda apenas produtos legítimos e permitidos pelas regras das respectivas plataformas. A venda/transferência de contas e a revenda de moedas virtuais podem ser proibidas; verifique os termos oficiais e use canais autorizados.
- Use apenas imagens que você tenha direito de utilizar e publique política de privacidade, termos e informações de contato adequados.

Tecnologias: HTML, CSS e JavaScript puro.
