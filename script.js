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

    // Define o estado inicial acessível do botão.
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

    // Fecha o menu quando a tela volta ao formato desktop.
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

      // Só trata o clique quando a seção de destino existe.
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

  // Para adicionar fotos, inclua novos objetos nesta lista
  // e coloque os arquivos correspondentes dentro da pasta "images".
  const fotosKitnet = [
    {
    src: "images/kitnet1.jpg",
    alt: "Foto 1 da kitnet para locação em Jaguariúna",
  },
  {
    src: "images/kitnet2.jpg",
    alt: "Foto 2 da kitnet para locação em Jaguariúna",
  },
  {
    src: "images/kitnet3.jpg",
    alt: "Foto 3 da kitnet para locação em Jaguariúna",
  },
  {
    src: "images/kitnet4.jpg",
    alt: "Foto 4 da kitnet para locação em Jaguariúna",
  },
  {
    src: "images/kitnet5.jpg",
    alt: "Foto 5 da kitnet para locação em Jaguariúna",
  },
  {
    src: "images/kitnet6.jpg",
    alt: "Foto 6 da kitnet para locação em Jaguariúna",
  },
  {
    src: "images/kitnet7.jpg",
    alt: "Foto 7 da kitnet para locação em Jaguariúna",
  },
  {
    src: "images/kitnet8.jpg",
    alt: "Foto 8 da kitnet para locação em Jaguariúna",
  },
  {
    src: "images/kitnet9.jpg",
    alt: "Foto 9 da kitnet para locação em Jaguariúna",
  },
  {
    src: "images/kitnet10.jpg",
    alt: "Foto 10 da kitnet para locação em Jaguariúna",
  },

    // Exemplos para adicionar outras fotos:
    // {
    //   src: "images/kitnet-sala.jpg",
    //   alt: "Vista da sala da kitnet",
    // },
    // {
    //   src: "images/kitnet-cozinha.jpg",
    //   alt: "Vista da cozinha da kitnet",
    // },
    // {
    //   src: "images/kitnet-banheiro.jpg",
    //   alt: "Vista do banheiro da kitnet",
    // },
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

  // Inicia a galeria somente se todos os elementos existirem no HTML.
  if (elementosGaleria.every(Boolean)) {
    let fotoAtual = 0;
    let ultimoFoco = null;
    let overflowAnterior = "";

    // Garante que o visualizador comece fechado.
    photoViewer.hidden = true;
    photoViewer.setAttribute("aria-hidden", "true");

    // Cria automaticamente uma miniatura para cada foto cadastrada.
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

      // Oculta a miniatura caso o caminho da imagem esteja incorreto.
      imagem.addEventListener("error", () => {
        botao.hidden = true;
        console.warn(
          `Não foi possível carregar a foto: ${foto.src}`
        );
      });

      botao.appendChild(imagem);

      botao.addEventListener("click", () => {
        abrirFoto(indice);
      });

      galleryGrid.appendChild(botao);
    });

    // Exibe a foto selecionada no visualizador.
    function mostrarFoto(indice) {
      if (fotosKitnet.length === 0) {
        return;
      }

      fotoAtual =
        (indice + fotosKitnet.length) % fotosKitnet.length;

      const foto = fotosKitnet[fotoAtual];

      photoLarge.src = foto.src;
      photoLarge.alt = foto.alt;

      photoCounter.textContent =
        `Foto ${fotoAtual + 1} de ${fotosKitnet.length}`;

      // Esconde as setas quando existe somente uma foto.
      const temMaisDeUmaFoto = fotosKitnet.length > 1;

      photoPrev.hidden = !temMaisDeUmaFoto;
      photoNext.hidden = !temMaisDeUmaFoto;
    }

    // Abre o visualizador.
    function abrirFoto(indice) {
      if (fotosKitnet.length === 0) {
        return;
      }

      ultimoFoco = document.activeElement;
      overflowAnterior = document.body.style.overflow;

      mostrarFoto(indice);

      photoViewer.hidden = false;
      photoViewer.setAttribute("aria-hidden", "false");

      // Impede a página de rolar por trás da foto.
      document.body.style.overflow = "hidden";

      photoClose.focus();
    }

    // Fecha o visualizador.
    function fecharFoto() {
      if (photoViewer.hidden) {
        return;
      }

      photoViewer.hidden = true;
      photoViewer.setAttribute("aria-hidden", "true");

      // Restaura o comportamento de rolagem anterior.
      document.body.style.overflow = overflowAnterior;

      photoLarge.removeAttribute("src");
      photoLarge.alt = "";

      // Devolve o foco ao elemento que abriu a foto.
      if (ultimoFoco && typeof ultimoFoco.focus === "function") {
        ultimoFoco.focus();
      }
    }

    // Botão para fechar a foto.
    photoClose.addEventListener("click", fecharFoto);

    // Navegação entre as fotos.
    photoPrev.addEventListener("click", () => {
      mostrarFoto(fotoAtual - 1);
    });

    photoNext.addEventListener("click", () => {
      mostrarFoto(fotoAtual + 1);
    });

    // Fecha ao clicar no fundo escuro.
    // Clicar na imagem ou nos botões não fecha o visualizador.
    photoViewer.addEventListener("click", (event) => {
      if (event.target === photoViewer) {
        fecharFoto();
      }
    });

    // Atalhos de teclado do visualizador.
    document.addEventListener("keydown", (event) => {
      if (photoViewer.hidden) {
        return;
      }

      if (event.key === "Escape") {
        fecharFoto();
      } else if (
        event.key === "ArrowRight" &&
        fotosKitnet.length > 1
      ) {
        mostrarFoto(fotoAtual + 1);
      } else if (
        event.key === "ArrowLeft" &&
        fotosKitnet.length > 1
      ) {
        mostrarFoto(fotoAtual - 1);
      }
    });
  }

  /* 5. FUNCIONAMENTO INDEPENDENTE */
  // Cada recurso verifica se os elementos necessários existem no HTML.
  // Assim, a ausência de um elemento não impede os outros recursos de funcionar.
});