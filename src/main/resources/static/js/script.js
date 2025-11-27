document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("nutriForm");
  const btnSalvar = document.getElementById("btnSalvar");
  const abrirCameraBtn = document.getElementById("abrirCamera");
  const BASE_URL = "https://backend-nutri-ai-production.up.railway.app";

  function idadeParaDataNascimento(idadeAnos) {
    const hoje = new Date();
    const anoNascimento = hoje.getFullYear() - Number(idadeAnos);
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${anoNascimento}-${mes}-${dia}`;
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        const nome = document.getElementById("nome")?.value || "";
        const idade = document.getElementById("idade")?.value || "";
        const peso = document.getElementById("pesoInput")?.value || "";
        const altura = document.getElementById("alturaInput")?.value || "";
        const fotoInput = document.getElementById("foto");
        const foto = fotoInput?.files?.[0] || null;
        const genero = document.getElementById("genero")?.value || "NÃO_INFORMADO";
        const isEdema = document.getElementById("edema")?.checked || false;

        if (!nome.trim() || !idade.trim() || !peso.trim() || !altura.trim()) {
          alert("Preencha nome, idade, peso e altura antes de continuar.");
          return;
        }

        const pacientePayload = {
          name: nome,
          dateOfBirth: idadeParaDataNascimento(idade),
          gender: genero
        };

        const salvarPacienteResp = await fetch(`${BASE_URL}/api/v1/patients/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pacientePayload)
        });

        if (!salvarPacienteResp.ok) {
          const text = await salvarPacienteResp.text();
          throw new Error("Erro ao cadastrar paciente: " + text);
        }

        const paciente = await salvarPacienteResp.json();
        const pacienteId = paciente.id;

        const formDataDiag = new FormData();
        formDataDiag.append("patientId", pacienteId);
        formDataDiag.append("weightKg", String(peso));
        formDataDiag.append("heightCm", String(altura));
        formDataDiag.append("isEdema", String(isEdema));
        if (foto) formDataDiag.append("imageFile", foto, foto.name);

        const diagResp = await fetch(`${BASE_URL}/api/v1/diagnose/run-analysis`, {
          method: "POST",
          body: formDataDiag
        });

        if (!diagResp.ok) {
          const text = await diagResp.text();
          throw new Error("Erro ao gerar diagnóstico: " + text);
        }

        window.location.href = "/result.html";

      } catch (err) {
        console.error(err);
        alert("Ocorreu um erro: " + (err.message || err));
      }
    });
  }

  if (btnSalvar) {
    btnSalvar.addEventListener("click", async () => {
      try {
        const nome = document.getElementById("nome")?.value || "";
        const nascimento = document.getElementById("nascimento")?.value;
        const genero = document.getElementById("genero")?.value || "NÃO_INFORMADO";

        if (!nome) {
          alert("Preencha o nome antes de salvar.");
          return;
        }

        const pacientePayload = {
          name: nome,
          dateOfBirth: nascimento || idadeParaDataNascimento(document.getElementById("idade")?.value || 0),
          gender: genero
        };

        const resp = await fetch("/api/v1/patients/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pacientePayload)
        });

        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(text || "Erro ao salvar paciente!");
        }

        const saved = await resp.json();
        alert("Paciente salvo com sucesso! ID: " + saved.id);

      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    });
  }

if (abrirCameraBtn) {
  const modal = document.getElementById("cameraModal");
  const video = document.getElementById("camera");
  const canvas = document.getElementById("fotoCanvas");
  const inputFoto = document.getElementById("foto");

  const fecharBtn = document.getElementById("fecharCamera");
  const tirarBtn = document.getElementById("tirarFoto");

  let stream;

  abrirCameraBtn.addEventListener("click", async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });

      video.srcObject = stream;
      modal.style.display = "flex";
    } catch (err) {
      alert("Não foi possível acessar a câmera.");
    }
  });

  fecharBtn.addEventListener("click", () => {
    modal.style.display = "none";
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
    }
  });

  tirarBtn.addEventListener("click", () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(blob => {
      const file = new File([blob], "foto.jpg", { type: "image/jpeg" });

      const dt = new DataTransfer();
      dt.items.add(file);
      inputFoto.files = dt.files;

      modal.style.display = "none";
      stream.getTracks().forEach(t => t.stop());
    }, "image/jpeg", 0.95);
  });
}


});


