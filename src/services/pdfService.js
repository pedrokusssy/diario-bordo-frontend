import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ENSINAR_CAMOES_LOGO, ENSINAR_SAUDE_LOGO } from '../assets/logos-pdfs';
import { DM_SERIF_BASE64 } from "../assets/DMSerifDisplayRegular";

export const gerarDiarioBordoPDF = (dadosFormacao, listaAtividades) => {
  const doc = new jsPDF();
  
  // 1. REGISTAR A FONTE (Usamos apenas 'normal' para evitar erro de falta de Bold)
  doc.addFileToVFS("DMSerifDisplay-Regular.ttf", DM_SERIF_BASE64);
  doc.addFont("DMSerifDisplay-Regular.ttf", "DMSerif", "normal");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 2. ORDENAÇÃO CRONOLÓGICA (Mais antiga -> Mais recente)
  // Criamos uma cópia para não afetar o estado original da aplicação
  const atividadesOrdenadas = [...listaAtividades].sort((a, b) => {
    // Converte a string de data (DD/MM/YYYY) para um objeto Date comparável
    const [diaA, mesA, anoA] = a.data.split('/');
    const [diaB, mesB, anoB] = b.data.split('/');
    return new Date(anoA, mesA - 1, diaA) - new Date(anoB, mesB - 1, diaB);
  });

  // 3. LÓGICA DE DISTRIBUIÇÃO POR SLOTS (MAX 5 POR PÁGINA)
  const paginasDeAtividades = [];
  let paginaAtual = [];
  let slotsUsados = 0;

  atividadesOrdenadas.forEach((act) => {
    const peso = (act.descricao && act.descricao.length > 280) ? 2 : 1;

    if (slotsUsados + peso > 5) {
      while (slotsUsados < 5) {
        paginaAtual.push({ data: '', atividade: '', descricao: '', peso: 1 });
        slotsUsados++;
      }
      paginasDeAtividades.push(paginaAtual);
      paginaAtual = [];
      slotsUsados = 0;
    }
    paginaAtual.push({ ...act, peso });
    slotsUsados += peso;
  });

  while (slotsUsados < 5 && slotsUsados > 0) {
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

    // Título Principal
    doc.setFont("DMSerif", "normal");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("DIÁRIO DE BORDO – FORMAÇÃO ESPECIALIZADA", pageWidth / 2, 62, { align: "center" });

    // 4. TABELA DE IDENTIFICAÇÃO (Rótulos em DM Serif, Dados em Helvetica)
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
          { content: `Horário: ${dadosFormacao.horario || ''}` }
        ],
        [{ content: 'LOCAL FORMAÇÃO' }, { content: dadosFormacao.local || '', colSpan: 2 }],
        [{ content: 'UNIDADE' }, { content: dadosFormacao.unidade || '', colSpan: 2 }],
      ],
      // Colunas: 30 + 55 + 75 = 160 (Perfeito para A4 com margens 25)
      columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 55 }, 2: { cellWidth: 75 } },
      margin: { left: 25, right: 25 },
      didParseCell: function (data) {
        if (data.section === 'body') {
          // APLICA DM SERIF APENAS NOS TÍTULOS (Coluna 0 ou texto que contém ":")
          if (data.column.index === 0 || (data.cell.text[0] && data.cell.text[0].includes(':'))) {
            data.cell.styles.font = "DMSerif";
            data.cell.styles.fontStyle = "normal"; // Evita erro de bold
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

    // Rodapé
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
        minCellHeight: 23,
        valign: 'middle',
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        textColor: [60, 60, 60]
      },
      headStyles: {
        font: "DMSerif",
        fontStyle: "normal", // CORREÇÃO: Força normal para não dar erro de Bold
        fontSize: 10,
        fillColor: [210, 210, 210],
        textColor: [0, 0, 0],
        halign: 'center',
        cellPadding: 1.5
      },
      // CORREÇÃO LARGURA: 25+35+75+25 = 160 (Antes somava 162, o que causava o erro de "fit page")
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
          if (item && item.peso === 2) {
            data.row.height = 46;
          }
        }
      }
    });
  });
  
  // doc.save("Diario_Bordo_Final.pdf");

  // Gera o PDF como um "Blob" (um ficheiro em memória)
  const pdfBlob = doc.output('blob');
  
  // Cria um URL temporário para esse ficheiro
  const blobUrl = URL.createObjectURL(pdfBlob);
  
  // Abre o PDF num novo separador do browser
  window.open(blobUrl, '_blank');
};