function validarEntrada(entrada) {
  return /^[a-zA-Z]$/.test(entrada);
}

function calcularBitParidad(valorAscii) {
  return valorAscii % 2 === 0 ? '0' : '1';
}

function mostrarError(mensaje) {
  console.error(mensaje);
}

function codificarYMostrar() {
  const entradaLetra = document.getElementById('entradaLetra').value.trim().toUpperCase();

  if (!validarEntrada(entradaLetra)) {
    mostrarError('Por favor ingrese solo un carácter alfabético.');
    return;
  }

  const valorAscii = entradaLetra.charCodeAt(0);
  const bitParidad = calcularBitParidad(valorAscii);

  const codificaciones = {
    NRZ: codificarSeñal(valorAscii, '0'),
    AMI: codificarAMI(valorAscii),
    Manchester: codificarSeñal(valorAscii, '1'),
    ManchesterDiferencial: codificarManchesterDiferencial(valorAscii)
  };

  mostrarSalida(valorAscii, bitParidad, codificaciones);
  dibujarGraficos(valorAscii, codificaciones);
}

function codificarSeñal(valorAscii, invertir) {
  const valorBinario = valorAscii.toString(2).padStart(8, '0');
  return valorBinario.split('').map(bit => (bit === invertir ? '0' : '1')).join('');
}

function codificarAMI(valorAscii) {
  const valorBinario = valorAscii.toString(2).padStart(8, '0');
  let señalAMI = '';
  let últimoBit = '0';

  for (const bit of valorBinario) {
    señalAMI += bit === '0' ? '1' : (últimoBit = últimoBit === '0' ? '1' : '0');
  }

  return señalAMI;
}

function codificarManchesterDiferencial(valorAscii) {
  const valorBinario = valorAscii.toString(2).padStart(8, '0');
  let señalManchesterDiff = '';
  let últimoBit = '0';

  for (const bit of valorBinario) {
    señalManchesterDiff += últimoBit === bit ? '0' : '1';
    últimoBit = bit;
  }

  return señalManchesterDiff;
}

function dibujarGraficos(valorAscii, codificaciones) {
  const valoresX = Array.from({ length: 8 }, (_, i) => i);

  const trazas = Object.entries(codificaciones).map(([nombre, codificacion]) => ({
    x: valoresX,
    y: codificacion.split('').map(bit => (bit === '0' ? 0 : nombre === 'AMI' ? -1 : 1)),
    type: 'scatter',
    mode: 'lines+markers',
    name: nombre
  }));

  const diseño = {
    xaxis: { range: [0, 7], title: 'Tiempo' },
    yaxis: { range: [-1, 1], title: 'Amplitud' },
    title: 'Señales Digitales Codificadas'
  };

  Plotly.newPlot('miGrafico', trazas, diseño);
}

function mostrarSalida(valorAscii, bitParidad, codificaciones) {
  const salidaHTML = `
    <p>ASCII: ${valorAscii}</p>
    <p>Bit de Paridad: ${bitParidad}</p>
    ${Object.entries(codificaciones)
      .map(([nombre, codificacion]) => `<p>${nombre}: ${codificacion}</p>`)
      .join('')}
  `;

  document.getElementById('salida').innerHTML = salidaHTML;
}
