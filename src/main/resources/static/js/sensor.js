document.getElementById("connect").addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const alturaResp = await fetch("http://192.168.0.56/ALTURA");
    const altura = await alturaResp.text();

    document.getElementById("alturaInput").value = altura.trim();

    const pesoResp = await fetch("http://192.168.0.56/PESO");
    const peso = await pesoResp.text();

    document.getElementById("pesoInput").value = peso.trim();

    alert("Sensor conectado com sucesso ");

  } catch (err) {
    alert("Erro ao conectar com o sensor ");
    console.error(err);
  }
});
