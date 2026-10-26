export const mergeProps = (
  baseProps: any,
  breakPoints: Array<{ [key: number]: any }> | undefined,
  width: number,
): any => {
  let finalProps = { ...baseProps }

  if (breakPoints) {
    breakPoints.forEach((breakPoint) => {
      const [breakPointWidth, breakPointProps] = Object.entries(breakPoint)[0]
      if (width <= Number(breakPointWidth)) {
        finalProps = { ...finalProps, ...breakPointProps }
      }
    })
  }

  return finalProps
}

export function formatarDataBr(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

export const formatarNumeroCelular = (numero: string) => {
  const apenasNumeros = numero.replace(/\D/g, '');
  
  if (apenasNumeros.length > 10) {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 3)}${apenasNumeros.slice(3, 7)}-${apenasNumeros.slice(7)}`;
  }
  if (apenasNumeros.length > 6) {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7)}`;
  }
  if (apenasNumeros.length > 2) {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
  }
  return numero;
};

export const formatarCep = (cep: string) => {
  const apenasNumeros = cep.replace(/\D/g, '');
  
  if (apenasNumeros.length > 5) {
    return `${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(5, 8)}`;
  }
  return apenasNumeros;
};

export function formatarDataHrBR(dataISO) {
  const data = new Date(dataISO);

  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const ano = data.getFullYear();

  const horas = data.getHours().toString().padStart(2, '0');
  const minutos = data.getMinutes().toString().padStart(2, '0');

  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}

export const filter = (input: string): RegExp => {
  return new RegExp(input.replace(/[^A-Z0-9áàâãéèêíïóôõöúç:_./-\s]/gi, ''), 'i')
}

export const getIdUsuario = (): number | null => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      return userData.idUsuario || null;
    } catch {
      return null;
    }
  }
  return null;
};

export const getIdPerfil = (): number | null => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      return userData.idPerfil || null;
    } catch {
      return null;
    }
  }
  return null;
};

export const getEmailUsuario = (): string | null => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      return userData.email || null;
    } catch {
      return null;
    }
  }
  return null;
};

export const getNomeUsuario = (): string | null => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      return userData.nome || null;
    } catch {
      return null;
    }
  }
  return null;
};

export const getTokenAcesso = (): string | null => {
  return localStorage.getItem('access_token');
};

export const getUsuarioLogado = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  }
  return null;
};