export const removerSpacesChars = (data) => {

  // Remove espaços em branco extras antes e depois da string
  const trimmedData = data.trim();

  // Reduz espaços em branco extras entre palavras para um único espaço
  const singleSpaceData = trimmedData.replace(/\s+/g, ' ');

  return singleSpaceData
};

export const formatSpaceObject = (obj) => {
  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = removerSpacesChars(obj[key]);
    } else if (typeof obj[key] === 'object') {
      formatSpaceObject(obj[key]); // chama recursivamente para objetos aninhados
    }
  }
  return obj
}
