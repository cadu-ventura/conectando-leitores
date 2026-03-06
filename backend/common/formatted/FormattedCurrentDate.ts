export const formattedCurrentDate = () => {

	const registrationTimestamp = Date.now();
	const registrationDate = new Date(registrationTimestamp);

  interface Options {
    weekday: 'long' | 'short' | 'narrow',
    year: 'numeric' | '2-digit',
    month: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow',
    day: 'numeric' | '2-digit',
    hour: 'numeric' | '2-digit',
    minute: 'numeric' | '2-digit',
    second: 'numeric' | '2-digit',
    timeZone: string,
    timeZoneName: 'short' | 'long'
  }

  const options: Options = {
  	weekday: 'long',
  	year: 'numeric',
  	month: 'numeric',
  	day: 'numeric',
  	hour: '2-digit',
  	minute: '2-digit',
  	second: '2-digit',
  	timeZone: 'America/Sao_Paulo',
  	timeZoneName: 'short'
  };

  const formattedDate = registrationDate.toLocaleDateString('pt-BR', options);

  return formattedDate;

};
