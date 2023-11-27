function validarEntrada(entrada) {
  return /^[a-zA-Z]$/.test(entrada);
}

function validarEntrada() {
  const entradaLetra = document.getElementById('entradaLetra').value.trim().toUpperCase();

  if (!entradaLetra) {
    alert('Por favor, introduzca un valor antes de codificar y mostrar.');
    return;
  }

  if (!/^[a-zA-Z]$/.test(entradaLetra)) {
    alert('Por favor, introduzca solo letras.');
    document.getElementById('entradaLetra').value = ''; 
    return;
  }
}

function calcularBitParidad(valorAscii) {
  return valorAscii % 2 === 0 ? '0' : '1';
}

function codificarYMostrar() {
  const entradaLetra = document.getElementById('entradaLetra').value.trim().toUpperCase();

  if (!entradaLetra) {
    alert('Por favor, introduzca un valor antes de codificar y mostrar.');
    return;
  }

  if (!/^[a-zA-Z]$/.test(entradaLetra)) {
    alert('Por favor, introduzca solo letras.');
    document.getElementById('entradaLetra').value = '';
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
    text: codificacion.split(''),
    type: 'scatter',
    mode: 'lines+markers',
    name: nombre,
    line: { shape: 'hv' }  
  }));

  const diseño = {
    xaxis: { range: [-0.5, 7.5], title: 'Tiempo' },
    yaxis: { range: [-1.5, 1.5], title: 'Amplitud' },
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
