function validateInput(input) {
  return /^[a-zA-Z]$/.test(input);
}

function calculateParityBit(asciiValue) {
  return asciiValue % 2 === 0 ? '0' : '1';
}

function showError(message) {
  console.error(message);
}

function encodeAndDisplay() {
  const inputLetter = document.getElementById('inputLetter').value.trim().toUpperCase();

  if (!validateInput(inputLetter)) {
    showError('Por favor ingrese solo un carácter alfabético.');
    return;
  }

  const asciiValue = inputLetter.charCodeAt(0);
  const parityBit = calculateParityBit(asciiValue);

  const nrzEncoded = encodeNRZ(asciiValue);
  const amiEncoded = encodeAMI(asciiValue);
  const manchesterEncoded = encodeManchester(asciiValue);
  const manchesterDiffEncoded = encodeManchesterDifferential(asciiValue);

  displayOutput(asciiValue, parityBit, nrzEncoded, amiEncoded, manchesterEncoded, manchesterDiffEncoded);
  drawGraphs(asciiValue, nrzEncoded, amiEncoded, manchesterEncoded, manchesterDiffEncoded);
}

function encodeNRZ(asciiValue) {
  const binaryValue = asciiValue.toString(2).padStart(8, '0');
  return binaryValue.split('').map(bit => (bit === '0' ? '1' : '0')).join('');
}

function encodeAMI(asciiValue) {
  const binaryValue = asciiValue.toString(2).padStart(8, '0');
  let amiSignal = '';
  let lastBit = '0';

  for (const bit of binaryValue) {
    if (bit === '0') {
      amiSignal += '1';
    } else {
      amiSignal += lastBit === '0' ? '-1' : '1';
      lastBit = lastBit === '0' ? '1' : '0';
    }
  }

  return amiSignal;
}

function encodeManchester(asciiValue) {
  const binaryValue = asciiValue.toString(2).padStart(8, '0');
  return binaryValue.split('').map(bit => (bit === '0' ? '1' : '0')).join('');
}

function encodeManchesterDifferential(asciiValue) {
  const binaryValue = asciiValue.toString(2).padStart(8, '0');
  let manchesterDiffSignal = '';
  let lastBit = '0';

  for (const bit of binaryValue) {
    manchesterDiffSignal += lastBit === bit ? '0' : '1';
    lastBit = bit;
  }

  return manchesterDiffSignal;
}

function drawGraphs(asciiValue, nrzEncoded, amiEncoded, manchesterEncoded, manchesterDiffEncoded) {
  const xValues = Array.from({ length: nrzEncoded.length }, (_, i) => i);

  const traceNRZ = {
    x: xValues,
    y: nrzEncoded.split('').map(bit => (bit === '0' ? 0 : 1)),
    type: 'scatter',
    mode: 'lines+markers',
    name: 'NRZ'
  };

  const traceAMI = {
    x: xValues,
    y: amiEncoded.split('').map(bit => (bit === '0' ? 0 : -1)),
    type: 'scatter',
    mode: 'lines+markers',
    name: 'AMI'
  };

  const traceManchester = {
    x: xValues,
    y: manchesterEncoded.split('').map(bit => (bit === '0' ? 0 : 1)),
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Manchester'
  };

  const traceManchesterDiff = {
    x: xValues,
    y: manchesterDiffEncoded.split('').map(bit => (bit === '0' ? 0 : -1)),
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Manchester Diferencial'
  };

  const layout = {
    xaxis: {
      range: [0, 10],
      title: 'Tiempo'
    },
    yaxis: {
      range: [-1, 1],
      title: 'Amplitud'
    },
    title: 'Señales Digitales Codificadas',
  };

  const data = [traceNRZ, traceAMI, traceManchester, traceManchesterDiff];

  Plotly.newPlot('myChart', data, layout);
}

function displayOutput(asciiValue, parityBit, nrzEncoded, amiEncoded, manchesterEncoded, manchesterDiffEncoded) {
  const outputHTML = `
    <p>ASCII: ${asciiValue}</p>
    <p>Bit de Paridad: ${parityBit}</p>
    <p>NRZ: ${nrzEncoded}</p>
    <p>AMI: ${amiEncoded}</p>
    <p>Manchester: ${manchesterEncoded}</p>
    <p>Manchester Diferencial: ${manchesterDiffEncoded}</p>
  `;

  document.getElementById('output').innerHTML = outputHTML;
}
