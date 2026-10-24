/* =========================================
   KITNET JAGUARIÚNA
   Desenvolvido por DevWebLuis
========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* 1. MENU RESPONSIVO */
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (menuToggle && navMenu) {
    const fecharMenu = () => {
      navMenu.classList.remove("open");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
    };

    const alternarMenu = () => {
      const aberto = !navMenu.classList.contains("open");

      navMenu.classList.toggle("open", aberto);
      menuToggle.classList.toggle("active", aberto);
      menuToggle.setAttribute("aria-expanded", String(aberto));
      menuToggle.setAttribute(
        "aria-label",
        aberto ? "Fechar menu" : "Abrir menu"
      );
    };

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    menuToggle.setAttribute("aria-controls", "nav-menu");

    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      alternarMenu();
    });

    // Fecha o menu ao selecionar um link.
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", fecharMenu);
    });

    // Fecha o menu ao pressionar Escape.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        fecharMenu();
      }
    });

    // Fecha o menu ao clicar fora dele.
    document.addEventListener("click", (event) => {
      const clicouNoMenu = navMenu.contains(event.target);
      const clicouNoBotao = menuToggle.contains(event.target);

      if (
        navMenu.classList.contains("open") &&
        !clicouNoMenu &&
        !clicouNoBotao
      ) {
        fecharMenu();
      }
    });

    // Fecha o menu ao voltar para o layout desktop.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        fecharMenu();
      }
    });
  }

  /* 2. ANO AUTOMÁTICO NO RODAPÉ */
  const currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }

  /* 3. ROLAGEM SUAVE PARA LINKS INTERNOS */
  const movimentoReduzido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const destino = link.getAttribute("href");

      // Ignora links vazios ou apenas com #.
      if (!destino || destino === "#") {
        return;
      }

      let secao;

      // Evita erros caso o endereço do link não seja um seletor válido.
      try {
        secao = document.querySelector(destino);
      } catch (_erro) {
        return;
      }

      if (!secao) {
        return;
      }

      event.preventDefault();

      secao.scrollIntoView({
        behavior: movimentoReduzido ? "auto" : "smooth",
        block: "start",
      });

      // Atualiza o fragmento da URL sem recarregar a página.
      if (window.location.hash !== destino) {
        history.replaceState(null, "", destino);
      }
    });
  });

  /* 4. GALERIA DE FOTOS DA KITNET */
  // As dez imagens estão na pasta images/.
  // Para adicionar outras no futuro, acrescente novos objetos a esta lista.
  const fotosKitnet = [
    {
      src: "images/kitnet1.jpg",
      alt: "Foto 1 da kitnet para alugar em Jaguariúna, São Paulo",
    },
    {
      src: "images/kitnet2.jpg",
      alt: "Foto 2 da kitnet para alugar em Jaguariúna, São Paulo",
    },
    {
      src: "images/kitnet3.jpg",
      alt: "Foto 3 da kitnet para alugar em Jaguariúna, São Paulo",
    },
    {
      src: "images/kitnet4.jpg",
      alt: "Foto 4 da kitnet para alugar em Jaguariúna, São Paulo",
    },
    {
      src: "images/kitnet5.jpg",
      alt: "Foto 5 da kitnet para alugar em Jaguariúna, São Paulo",
    },
    {
      src: "images/kitnet6.jpg",
      alt: "Foto 6 da kitnet para alugar em Jaguariúna, São Paulo",
    },
    {
      src: "images/kitnet7.jpg",
      alt: "Foto 7 da kitnet para alugar em Jaguariúna, São Paulo",
    },
    {
      src: "images/kitnet8.jpg",
      alt: "Foto 8 da kitnet para alugar em Jaguariúna, São Paulo",
    },
    {
      src: "images/kitnet9.jpg",
      alt: "Foto 9 da kitnet para alugar em Jaguariúna, São Paulo",
    },
    {
      src: "images/kitnet10.jpg",
      alt: "Foto 10 da kitnet para alugar em Jaguariúna, São Paulo",
    },
  ];

  const galleryGrid = document.getElementById("gallery-grid");
  const photoViewer = document.getElementById("photo-viewer");
  const photoLarge = document.getElementById("photo-large");
  const photoCounter = document.getElementById("photo-counter");
  const photoClose = document.getElementById("photo-close");
  const photoPrev = document.getElementById("photo-prev");
  const photoNext = document.getElementById("photo-next");

  const elementosGaleria = [
    galleryGrid,
    photoViewer,
    photoLarge,
    photoCounter,
    photoClose,
    photoPrev,
    photoNext,
  ];

  // Inicia a galeria somente se todos os elementos necessários existirem no HTML.
  if (elementosGaleria.every(Boolean)) {
    let fotoAtual = 0;
    let ultimoFoco = null;
    let overflowAnterior = "";

    photoViewer.hidden = true;
    photoViewer.setAttribute("aria-hidden", "true");

    // Cria automaticamente uma miniatura para cada foto.
    fotosKitnet.forEach((foto, indice) => {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "gallery-item";
      botao.setAttribute(
        "aria-label",
        `Ampliar foto ${indice + 1} de ${fotosKitnet.length}`
      );

      const imagem = document.createElement("img");
      imagem.src = foto.src;
      imagem.alt = foto.alt;
      imagem.loading = "lazy";
      imagem.decoding = "async";

      // Oculta uma miniatura se o arquivo não puder ser carregado.
      imagem.addEventListener("error", () => {
        botao.hidden = true;
        console.warn(`Não foi possível carregar a foto: ${foto.src}`);
      });

      botao.appendChild(imagem);
      botao.addEventListener("click", () => abrirFoto(indice));
      galleryGrid.appendChild(botao);
    });

    function mostrarFoto(indice) {
      if (fotosKitnet.length === 0) {
        return;
      }

      // Permite avançar da última foto para a primeira e vice-versa.
      fotoAtual = (indice + fotosKitnet.length) % fotosKitnet.length;
      const foto = fotosKitnet[fotoAtual];

      photoLarge.src = foto.src;
      photoLarge.alt = foto.alt;
      photoCounter.textContent = `Foto ${fotoAtual + 1} de ${fotosKitnet.length}`;

      const temMaisDeUmaFoto = fotosKitnet.length > 1;
      photoPrev.hidden = !temMaisDeUmaFoto;
      photoNext.hidden = !temMaisDeUmaFoto;
    }

    function abrirFoto(indice) {
      if (fotosKitnet.length === 0) {
        return;
      }

      ultimoFoco = document.activeElement;
      overflowAnterior = document.body.style.overflow;

      mostrarFoto(indice);
      photoViewer.hidden = false;
      photoViewer.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      photoClose.focus();
    }

    function fecharFoto() {
      if (photoViewer.hidden) {
        return;
      }

      photoViewer.hidden = true;
      photoViewer.setAttribute("aria-hidden", "true");
      document.body.style.overflow = overflowAnterior;
      photoLarge.removeAttribute("src");
      photoLarge.alt = "";

      if (ultimoFoco && typeof ultimoFoco.focus === "function") {
        ultimoFoco.focus();
      }
    }

    photoClose.addEventListener("click", fecharFoto);
    photoPrev.addEventListener("click", () => mostrarFoto(fotoAtual - 1));
    photoNext.addEventListener("click", () => mostrarFoto(fotoAtual + 1));

    // Fecha ao clicar no fundo escuro, não na imagem ou nos botões.
    photoViewer.addEventListener("click", (event) => {
      if (event.target === photoViewer) {
        fecharFoto();
      }
    });

    // Atalhos do visualizador: Escape fecha; setas navegam pelas fotos.
    document.addEventListener("keydown", (event) => {
      if (photoViewer.hidden) {
        return;
      }

      if (event.key === "Escape") {
        fecharFoto();
      } else if (event.key === "ArrowRight" && fotosKitnet.length > 1) {
        mostrarFoto(fotoAtual + 1);
      } else if (event.key === "ArrowLeft" && fotosKitnet.length > 1) {
        mostrarFoto(fotoAtual - 1);
      }
    });
  }

  /* 5. FUNCIONAMENTO INDEPENDENTE */
  // Cada recurso verifica se os elementos necessários existem no HTML.
  // Assim, a ausência de um elemento não impede os demais recursos de funcionar.
});
