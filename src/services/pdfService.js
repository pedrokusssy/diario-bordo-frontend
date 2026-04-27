import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ENSINAR_CAMOES_LOGO, ENSINAR_SAUDE_LOGO } from '../assets/logos-pdfs';
import { DM_SERIF_BASE64 } from "../assets/DMSerifDisplayRegular";

export const gerarDiarioBordoPDF = (dadosFormacao, listaAtividades) => {
  const doc = new jsPDF();
  
  // 1. REGISTAR A FONTE
  doc.addFileToVFS("DMSerifDisplay-Regular.ttf", DM_SERIF_BASE64);
  doc.addFont("DMSerifDisplay-Regular.ttf", "DMSerif", "normal");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 2. ORDENAÇÃO CRONOLÓGICA
  const atividadesOrdenadas = [...listaAtividades].sort((a, b) => {
    const [diaA, mesA, anoA] = a.data.split('/');
    const [diaB, mesB, anoB] = b.data.split('/');
    return new Date(anoA, mesA - 1, diaA) - new Date(anoB, mesB - 1, diaB);
  });

  // --- LÓGICA DE SLOTS DINÂMICOS ---
  const CHARS_POR_SLOT = 300; // Cada slot visual aguenta ~300 caracteres
  const MAX_SLOTS_PAGINA = 5; // A folha suporta no máximo 5 slots
  const paginasDeAtividades = [];
  let paginaAtual = [];
  let slotsUsados = 0;

  atividadesOrdenadas.forEach((act) => {
    let textoPendente = act.descricao || "";
    let isFirstChunk = true;

    // O loop garante que atividades gigantes são processadas,
    // e executa pelo menos uma vez mesmo que a descrição seja vazia
    do {
      let slotsDisponiveis = MAX_SLOTS_PAGINA - slotsUsados;
      
      // Se a folha já está cheia, guardamos e passamos para uma nova
      if (slotsDisponiveis === 0) {
        paginasDeAtividades.push(paginaAtual);
        paginaAtual = [];
        slotsUsados = 0;
        slotsDisponiveis = MAX_SLOTS_PAGINA;
      }

      // Quantos slots (1 a 5) este pedaço de texto vai precisar?
      let slotsNecessarios = Math.max(1, Math.ceil(textoPendente.length / CHARS_POR_SLOT));

      if (slotsNecessarios <= slotsDisponiveis) {
        // O texto cabe inteiramente no espaço que sobra na página atual!
        paginaAtual.push({
          data: isFirstChunk ? act.data : "",
          atividade: isFirstChunk ? act.atividade : "(Cont.) " + act.atividade,
          descricao: textoPendente,
          peso: slotsNecessarios // Pode ser 1, 2, 3, 4 ou 5
        });
        slotsUsados += slotsNecessarios;
        textoPendente = ""; // Terminámos esta atividade
      } else {
        // O texto NÃO cabe no espaço restante. Temos de o cortar para a próxima página.
        let charsQueCabem = slotsDisponiveis * CHARS_POR_SLOT;
        let chunk = textoPendente.substring(0, charsQueCabem);

        // Tentar não cortar palavras ao meio
        const ultimoEspaco = chunk.lastIndexOf(" ");
        if (ultimoEspaco > charsQueCabem * 0.85) {
          chunk = chunk.substring(0, ultimoEspaco);
        }

        paginaAtual.push({
          data: isFirstChunk ? act.data : "",
          atividade: isFirstChunk ? act.atividade : "(Cont.) " + act.atividade,
          descricao: chunk.trim(),
          peso: slotsDisponiveis // Ocupa exatamente o que sobra na folha
        });

        slotsUsados += slotsDisponiveis; // Enche a página (vai forçar quebra no próximo ciclo)
        textoPendente = textoPendente.substring(chunk.length).trim();
        isFirstChunk = false;
      }
    } while (textoPendente.length > 0);
  });

  // Preencher com linhas vazias se a última página não estiver cheia (para o layout não quebrar)
  while (slotsUsados < MAX_SLOTS_PAGINA && slotsUsados > 0) {
    paginaAtual.push({ data: '', atividade: '', descricao: '', peso: 1 });
    slotsUsados++;
  }
  if (paginaAtual.length > 0) paginasDeAtividades.push(paginaAtual);
  if (paginasDeAtividades.length === 0) {
    paginasDeAtividades.push(Array(5).fill({ data: '', atividade: '', descricao: '', peso: 1 }));
  }

  const totalPaginas = paginasDeAtividades.length;

  // --- ESTRUTURA FIXA ---
  const desenharEstruturaFixa = (numeroPagina) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(150);
    doc.text("N.I.F. 515 675 836", 10, 235, { angle: 90 });

    doc.addImage(ENSINAR_SAUDE_LOGO, 'PNG', 3, 10, 60, 50);

    doc.setFont("DMSerif", "normal");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("DIÁRIO DE BORDO – FORMAÇÃO ESPECIALIZADA", pageWidth / 2, 62, { align: "center" });

    autoTable(doc, {
      startY: 68,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 1, lineColor: [0, 0, 0], lineWidth: 0.3 },
      body: [
        [{ content: 'ESPECIALIDADE' }, { content: dadosFormacao.especialidade || '', colSpan: 2 }],
        [{ content: 'TUTOR(A)' }, { content: dadosFormacao.tutor || '', colSpan: 2 }],
        [
          { content: 'FORMANDO(A)' },
          { content: dadosFormacao.formando || '' },
          { content: `Hospital de Origem: ${dadosFormacao.hospitalOrigem || ''}` }
        ],
        [
          { content: 'PERÍODO' },
          { content: `${dadosFormacao.periodo.dataInicio} - ${dadosFormacao.periodo.dataFim}` || '' },
          { content: ("Horário: ")+`${dadosFormacao.horario || ''}` }
        ],
        [{ content: 'LOCAL FORMAÇÃO' }, { content: dadosFormacao.local || '', colSpan: 2 }],
        [{ content: 'UNIDADE' }, { content: dadosFormacao.unidade || '', colSpan: 2 }],
      ],
      columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 55 }, 2: { cellWidth: 75 } },
      margin: { left: 25, right: 25 },
      didParseCell: function (data) {
        if (data.section === 'body') {
          if (data.column.index === 0) { 
            data.cell.styles.font = "DMSerif";
            data.cell.styles.fontStyle = "normal";
            data.cell.styles.fontSize = 8.5;
            data.cell.styles.textColor = [0, 0, 0];
          } else {
            data.cell.styles.font = "helvetica";
            data.cell.styles.fontSize = 9;
            data.cell.styles.textColor = [60, 60, 60];
          }
        }
      }
    });

    const footerY = pageHeight - 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Folha nº ${numeroPagina}/${totalPaginas}`, pageWidth - 40, pageHeight - 50, { align: 'right' });
    doc.addImage(ENSINAR_SAUDE_LOGO, 'PNG', 5, footerY - 25, 30, 25);
    doc.addImage(ENSINAR_CAMOES_LOGO, 'PNG', pageWidth - 47, footerY - 20, 40, 20);
    doc.setFontSize(5);
    const info = "ENSINAR SAÚDE NORTE – ASSOCIAÇÃO PARA O ENSINO, INVESTIGAÇÃO E DESENVOLVIMENTO DOS PROFISSIONAIS DE SAÚDE\nRUA DA MATA, Nº 180 | 4480-565 TOUGUINHÓ - VILA DO CONDE | TEL: (+351) 252 097 700";
    doc.text(info, pageWidth / 2, pageHeight - 40, { align: "center" });
  };

  // --- GERAÇÃO DAS PÁGINAS DE ATIVIDADES ---
  paginasDeAtividades.forEach((atividadesDaPagina, i) => {
    if (i > 0) doc.addPage();
    desenharEstruturaFixa(i + 1);

    autoTable(doc, {
      startY: 108,
      head: [['DATA', 'ATIVIDADE', 'DESCRIÇÃO/ OBSERVAÇÃO DA ATIVIDADE', 'ASSINATURA TUTOR(A)']],
      body: atividadesDaPagina.map(act => [act.data, act.atividade, act.descricao, '']),
      theme: 'grid',
      styles: {
        font: "helvetica", 
        fontSize: 8.3,
        minCellHeight: 23, // Altura base de 1 slot
        valign: 'middle',
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        textColor: [60, 60, 60]
      },
      headStyles: {
        font: "DMSerif",
        fontStyle: "normal", 
        fontSize: 10,
        fillColor: [210, 210, 210],
        textColor: [0, 0, 0],
        halign: 'center',
        minCellHeight: 10,
        cellPadding: 1.5
      },
      columnStyles: {
        0: { cellWidth: 25, halign: "center" },
        1: { cellWidth: 35, halign: "center" },
        2: { cellWidth: 75 },
        3: { cellWidth: 25 } 
      },
      margin: { left: 25, right: 25 },
      didParseCell: function (data) {
        if (data.section === 'body') {
          const rowIndex = data.row.index;
          const item = atividadesDaPagina[rowIndex];
          
          // O SEGREDO DO LAYOUT: Multiplicamos a altura pelo "peso" do slot!
          if (item && item.peso > 1) {
            data.cell.styles.minCellHeight = item.peso * 23; 
          }
        }
      }
    });
  });

  const pdfBlob = doc.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);
  window.open(blobUrl, '_blank');
};