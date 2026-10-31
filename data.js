// Todos os dados da Paris ficam aqui. O que não foi confirmado com a loja está com confirmed: false.
// Fontes (30/10/2026): Google Maps, Harvey e o site atual parismoveisplanejados.com.
// Fotos: ilustrativas (Unsplash), até chegarem as fotos dos projetos entregues.
window.PARIS = {
  empresa: {
    nome: 'Paris Móveis Planejados',
    desde: 2011,                       // site atual: "Fundada no início de 2011"
    material: '100% MDF',
    marcas: ['Berneck', 'Arauco', 'Guararapes', 'Sudati'],
    notaGoogle: '4,8',
    avaliacoes: 649,
    elogios: ['Projeto', 'Prazo cumprido', 'Atendimento', 'Negociação'], // temas que mais aparecem nas avaliações
    instagram: 'paris_moveis_planejados',
    confirmed: true,
  },
  whatsapp: { numero: '5541988705015', exibicao: '(41) 98870-5015', confirmed: true }, // botão do site atual
  lojas: [
    { id: 'sjp', nome: 'São José dos Pinhais', endereco: 'Av. Rui Barbosa, 9025', bairro: 'Centro, São José dos Pinhais - PR',
      cep: '83005-340', telefone: '(41) 3081-8070', tel: '+554130818070',
      horario: [['Segunda a sexta', '9h às 18h'], ['Sábado', '9h às 16h'], ['Domingo', 'Fechado']], confirmed: true },
    { id: 'cwb', nome: 'Curitiba', endereco: 'Av. Presidente Kennedy, 2999', bairro: 'Água Verde, Curitiba - PR',
      cep: '', telefone: '(41) 3057-5151', tel: '+554130575151',
      horario: [['Horário', 'Consulte a loja']], confirmed: true },
  ],
  pagamento: [ // site atual; sujeito a aprovação de cadastro e da operadora
    ['Boleto', 'até 36x'], ['Cartão de crédito', 'até 18x'], ['Construcard', 'aceito'], ['Primeira parcela', 'em até 120 dias'],
  ],
  prazo: { texto: 'Consulte o prazo do seu projeto', confirmed: false },
  garantia: { texto: 'Consulte a equipe', confirmed: false },
  // Ambientes citados no site atual. Fotos ilustrativas.
  ambientes: [
    { id: 'cozinha', nome: 'Cozinha', texto: 'Armários até o teto, torre quente e ilha: cada centímetro pensado para a sua rotina.',
      fotos: ['1512916194211-3f2b7f5f7de3', '1600122272511-c85c3a0209f9', '1631048835473-73c7aaf86096'] },
    { id: 'closet', nome: 'Closet', texto: 'Cabideiros, gavetas e nichos na medida do que você tem, com luz onde precisa.',
      fotos: ['1708397016786-8916880649b8', '1672137233327-37b0c1049e77', '1640357154220-9775b0f31dec'] },
    { id: 'dormitorio', nome: 'Dormitório', texto: 'Guarda-roupa, cabeceira e criados no mesmo desenho, do casal ao quarto das crianças.',
      fotos: ['1631889993877-71e193bf79b8', '1784653549472-d04445c406c3'] },
    { id: 'sala', nome: 'Sala', texto: 'Painel, rack e estante para a TV, os livros e o que vale mostrar.',
      fotos: ['1760155089939-1c9d2a45c0e8', '1774716925888-190de2471de2'] },
    { id: 'lavanderia', nome: 'Lavanderia', texto: 'Máquinas embutidas e armário para os produtos, mesmo no espaço pequeno.',
      fotos: ['1778731660248-044f78e8c1fb'] },
  ],
};
