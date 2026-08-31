export type Regiao = {
  nome: string;
  imagem: string;
  descricao: string;
};

export const REGIOES: Regiao[] = [
  {
    nome: "Trancoso",
    imagem: "/images/regiao-trancoso.jpg",
    descricao: "Quadrado histórico, casas de frente para o mar e alto padrão discreto.",
  },
  {
    nome: "Itacaré",
    imagem: "/images/regiao-itacare.jpg",
    descricao: "Mata atlântica encontrando praias de surf e vilas boutique.",
  },
  {
    nome: "Morro de São Paulo",
    imagem: "/images/regiao-morro.jpg",
    descricao: "Ilha de Tinharé, pousadas em operação e vista para as praias numeradas.",
  },
  {
    nome: "Praia do Forte",
    imagem: "/images/regiao-praia-do-forte.jpg",
    descricao: "Vila arborizada, piscinas naturais e infraestrutura o ano inteiro.",
  },
];

export const CIDADES = [
  "Trancoso",
  "Itacaré",
  "Morro de São Paulo",
  "Praia do Forte",
  "Caraíva",
  "Península de Maraú",
  "Arraial d'Ajuda",
  "Barra Grande",
  "Imbassaí",
  "Boipeba",
];
