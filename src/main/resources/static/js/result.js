document.addEventListener("DOMContentLoaded", () => {

    // Mostra o último diagnóstico
    const ultimo = JSON.parse(localStorage.getItem("ultimoDiagnostico"));

    if (ultimo) {
        document.getElementById("alturaValor").textContent = ultimo.heightCm + " cm";
        document.getElementById("pesoValor").textContent = ultimo.weightKg + " kg";
        document.getElementById("diagnosticoValor").textContent = ultimo.resultText || "—";
    }

    // Montar Histórico
    const historico = JSON.parse(localStorage.getItem("historicoDiagnosticos")) || [];

    const lista = document.getElementById("historicoLista");
    lista.innerHTML = "";

    historico.forEach((item, index) => {

        //nao repetir o último diagnóstico
        if (index === 0) return;

        const div = document.createElement("div");
        div.classList.add("hist-item");

        div.innerHTML = `
            <p><strong>Peso:</strong> ${item.weightKg} kg</p>
            <p><strong>Altura:</strong> ${item.heightCm} cm</p>
            <p><strong>Resultado:</strong> ${item.resultText}</p>
            <hr>
        `;

        lista.appendChild(div);
    });

});