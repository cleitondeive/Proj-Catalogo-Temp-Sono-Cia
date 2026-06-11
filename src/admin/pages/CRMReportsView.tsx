import React, { useMemo, useRef, useState } from 'react';
import { Lead, LeadStatus } from '../../types';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { 
  FileText, ArrowDownToLine, Printer, Filter, Download, User, Sparkles, 
  AlertCircle, Phone, Award, Check, X, Shield, Star, Image, Send, 
  FileCode, CheckCircle2, ArrowRight, MessageSquare, Briefcase, Zap, 
  UserCheck, RefreshCw, Plus 
} from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import { useStore } from '../../store';

const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#6B7280', '#8B5CF6', '#EC4899'];

const PRESET_AVATARS = [
  { name: "Consultora Sofia", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80" },
  { name: "Consultora Marina", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" },
  { name: "Consultor Gabriel", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" },
  { name: "Consultor Lucas", url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80" },
  { name: "Consultora Ana", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80" },
  { name: "Consultor Thiago", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80" }
];

export const CRMReportsView = ({ leads }: { leads: Lead[] }) => {
  const { data, updateLead, updateUser } = useStore();
  const [exporting, setExporting] = useState(false);
  const [dateFilter, setDateFilter] = useState<'all'|'today'|'week'|'month'|'year'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('Todos');
  const reportRef = useRef<HTMLDivElement>(null);

  // Expanded Leads sub-rows within Vendedor report table
  const [activeExpanded, setActiveExpanded] = useState<{ 
    seller: string; 
    type: 'ganhas' | 'abertas' | 'perdidas'; 
  } | null>(null);

  // New Note fast typing state per lead ID
  const [fastNotes, setFastNotes] = useState<Record<string, string>>({});

  // Local Avatars persistence overrides (when salesperson exists purely as a string string assignee)
  const [localAvatars, setLocalAvatars] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('crm_seller_avatars') || '{}');
    } catch {
      return {};
    }
  });

  const [selectedSellerForAvatar, setSelectedSellerForAvatar] = useState<string | null>(null);
  const [avatarInputUrl, setAvatarInputUrl] = useState('');

  const saveSellerAvatar = (sellerName: string, url: string) => {
    const updated = { ...localAvatars, [sellerName]: url };
    setLocalAvatars(updated);
    localStorage.setItem('crm_seller_avatars', JSON.stringify(updated));

    // Also look for matching registered users in team and update their profiles
    const registeredUser = data.users?.find(
      u => u.name.trim().toLowerCase() === sellerName.trim().toLowerCase()
    );
    if (registeredUser) {
      updateUser(registeredUser.id, { avatarUrl: url });
    }
    
    setSelectedSellerForAvatar(null);
    setAvatarInputUrl('');
    confetti({ particleCount: 30, spread: 40 });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, sellerName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          saveSellerAvatar(sellerName, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getSellerAvatarUrl = (sellerName: string) => {
    // 1. Check local storage override first
    if (localAvatars[sellerName]) {
      return localAvatars[sellerName];
    }
    // 2. Check registered user avatar
    const registeredUser = data.users?.find(
      u => u.name.trim().toLowerCase() === sellerName.trim().toLowerCase()
    );
    if (registeredUser && registeredUser.avatarUrl) {
      return registeredUser.avatarUrl;
    }
    return null;
  };

  const handlePrint = () => {
    window.print();
  };

  const getDateFilterLabel = (filter: string) => {
    switch(filter) {
      case 'today': return 'Hoje';
      case 'week': return 'Últimos 7 Dias';
      case 'month': return 'Últimos 30 Dias';
      case 'year': return 'Este Ano';
      default: return 'Todo o Período';
    }
  };

  const exportPDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    const currentScrollY = window.scrollY;
    window.scrollTo(0, 0);
    
    try {
      await new Promise(r => setTimeout(r, 800));
      const dataUrl = await toPng(reportRef.current, { 
        pixelRatio: 2.5,
        backgroundColor: '#ffffff',
        skipFonts: true
      });
      
      const pdfWidth = 210;
      const pdfPageHeight = 297;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(dataUrl);
      const imgHeightInMm = (imgProps.height * pdfWidth) / imgProps.width;
      
      if (imgHeightInMm <= pdfPageHeight) {
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, imgHeightInMm);
      } else {
        const customPdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [pdfWidth, imgHeightInMm + 10]
        });
        customPdf.addImage(dataUrl, 'PNG', 0, 5, pdfWidth, imgHeightInMm);
        customPdf.save(`relatorio-crm-${new Date().toISOString().split('T')[0]}.pdf`);
        confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 }, colors: ['#0F172A', '#34D399', '#3B82F6', '#FBBF24'] });
        return;
      }
      
      pdf.save(`relatorio-crm-${new Date().toISOString().split('T')[0]}.pdf`);
      confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 }, colors: ['#0F172A', '#34D399', '#3B82F6', '#FBBF24'] });
    } catch (error) {
      console.error('Failed to generate PDF', error);
      alert('Erro ao gerar o PDF. Tente imprimir como alternativa para salvar como PDF.');
    } finally {
      window.scrollTo(0, currentScrollY);
      setExporting(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Nome,Telefone,E-mail,Vendedor,Status,Origem,VIP,Total Gasto,Data de Atualizacao\n'];
    const rows = filteredLeads.map(l => {
      const name = l.name ? `"${l.name.replace(/"/g, '""')}"` : '""';
      const phone = l.phone ? `"${l.phone.replace(/"/g, '""')}"` : '""';
      const email = l.email ? `"${l.email.replace(/"/g, '""')}"` : '""';
      const assignee = (l as any).assignee ? `"${(l as any).assignee.replace(/"/g, '""')}"` : '"Sem Responsavel"';
      const status = l.status ? `"${l.status.replace(/"/g, '""')}"` : '""';
      const source = l.source ? `"${l.source.replace(/"/g, '""')}"` : '"Manual"';
      const vip = l.vipLevel ? `"${l.vipLevel.replace(/"/g, '""')}"` : '"Nenhum"';
      const totalSpent = `"R$ ${l.totalSpent.toFixed(2)}"`;
      const date = `"${new Date(l.updatedAt || l.createdAt).toLocaleDateString('pt-BR')}"`;
      return `${name},${phone},${email},${assignee},${status},${source},${vip},${totalSpent},${date}`;
    }).join('\n');

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads-crm-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    confetti({ particleCount: 80, spread: 60, colors: ['#3B82F6', '#60A5FA', '#10B981'] });
  };

  const allAssignees = useMemo(() => {
    const s = new Set<string>();
    leads.forEach(l => {
      const a = (l as any).assignee;
      if (a) s.add(a);
    });
    return Array.from(s);
  }, [leads]);

  const dateRanges = useMemo(() => {
    const now = new Date();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    
    const last7DaysStart = new Date(todayEnd.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30DaysStart = new Date(todayEnd.getTime() - 30 * 24 * 60 * 60 * 1000);
    const thisYearStart = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);

    let start = new Date(0);
    let end = new Date(3000, 0, 1);
    
    let prevStart = new Date(0);
    let prevEnd = new Date(0);

    if (dateFilter === 'today') {
      start = todayStart;
      end = todayEnd;
      prevStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000); 
      prevEnd = new Date(todayEnd.getTime() - 24 * 60 * 60 * 1000);
    } else if (dateFilter === 'week') {
      start = last7DaysStart;
      end = todayEnd;
      prevStart = new Date(last7DaysStart.getTime() - 7 * 24 * 60 * 60 * 1000);
      prevEnd = last7DaysStart; 
    } else if (dateFilter === 'month') {
      start = last30DaysStart;
      end = todayEnd;
      prevStart = new Date(last30DaysStart.getTime() - 30 * 24 * 60 * 60 * 1000);
      prevEnd = last30DaysStart;
    } else if (dateFilter === 'year') {
      start = thisYearStart;
      end = todayEnd;
      prevStart = new Date(thisYearStart.getFullYear() - 1, 0, 1);
      prevEnd = new Date(thisYearStart.getFullYear() - 1, 11, 31, 23, 59, 59);
    }

    return { start, end, prevStart, prevEnd };
  }, [dateFilter]);

  const { filteredLeads, prevFilteredLeads } = useMemo(() => {
    const { start, end, prevStart, prevEnd } = dateRanges;

    const current = leads.filter(l => {
      const assigneeMatch = assigneeFilter === 'Todos' || ((l as any).assignee || 'Sem Responsável') === assigneeFilter;
      if (!assigneeMatch) return false;
      const d = new Date(l.updatedAt || l.createdAt);
      const lDate = isNaN(d.getTime()) ? new Date(0) : d;
      return lDate >= start && lDate <= end;
    });

    const prev = leads.filter(l => {
      const assigneeMatch = assigneeFilter === 'Todos' || ((l as any).assignee || 'Sem Responsável') === assigneeFilter;
      if (!assigneeMatch) return false;
      const d = new Date(l.updatedAt || l.createdAt);
      const lDate = isNaN(d.getTime()) ? new Date(0) : d;
      return lDate >= prevStart && lDate <= prevEnd;
    });

    return { filteredLeads: current, prevFilteredLeads: prev };
  }, [leads, dateRanges, assigneeFilter]);

  // Metrics Logic
  const totalLeads = filteredLeads.length;
  const wonLeads = filteredLeads.filter(l => l.status === 'Venda Ganha');
  const lostLeads = filteredLeads.filter(l => l.status === 'Venda Perdida' || l.status === 'Cancelado');
  const openLeads = filteredLeads.filter(l => !['Venda Ganha', 'Venda Perdida', 'Cancelado'].includes(l.status));
  
  const totalWonValue = wonLeads.reduce((acc, l) => acc + (l.totalSpent || 0), 0);
  const totalPipelineValue = openLeads.reduce((acc, l) => acc + (l.estimatedValue || l.totalSpent || 0), 0);
  
  const conversionRate = totalLeads > 0 ? ((wonLeads.length / totalLeads) * 100).toFixed(1) : '0.0';

  // Compare with prev
  const prevTotalLeads = prevFilteredLeads.length;
  const prevWonLeads = prevFilteredLeads.filter(l => l.status === 'Venda Ganha');
  const prevTotalWonValue = prevWonLeads.reduce((acc, l) => acc + (l.totalSpent || 0), 0);
  const prevConversionRate = prevTotalLeads > 0 ? ((prevWonLeads.length / prevTotalLeads) * 100) : 0;

  const calcTrend = (current: number, prev: number) => {
    if (prev === 0) return current > 0 ? { val: 100, up: true, valid: true } : { val: 0, up: true, valid: false };
    const diff = current - prev;
    const perc = (diff / prev) * 100;
    return { val: Math.abs(perc).toFixed(1), up: perc >= 0, valid: true };
  };

  const leadsTrend = calcTrend(totalLeads, prevTotalLeads);
  const wonValueTrend = calcTrend(totalWonValue, prevTotalWonValue);
  const convTrend = calcTrend(Number(conversionRate), prevConversionRate);

  const TrendBadge = ({ trend, suffix = '%' }: { trend: any, suffix?: string }) => {
    if (!trend.valid && dateFilter === 'all') return null;
    if (!trend.valid) return <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded ml-2">Sem histórico</span>;
    return (
      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ml-2 flex items-center inline-flex ${trend.up ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
        {trend.up ? '↑' : '↓'} {trend.val}{suffix}
      </span>
    );
  };

  // Format data for charts
  const statusData = filteredLeads.reduce((acc: any, lead) => {
    const existing = acc.find((a: any) => a.name === lead.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: lead.status, value: 1 });
    }
    return acc;
  }, []).sort((a: any, b: any) => b.value - a.value);

  const sourceData = filteredLeads.reduce((acc: any, lead) => {
    const src = lead.source || 'Desconhecida';
    const existing = acc.find((a: any) => a.name === src);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: src, value: 1 });
    }
    return acc;
  }, []).sort((a: any, b: any) => b.value - a.value);

  // Users Performance
  const assigneeData = filteredLeads.reduce((acc: any, lead) => {
    const assignee = (lead as any).assignee || 'Sem Responsável';
    if (!acc[assignee]) {
      acc[assignee] = { name: assignee, ganhas: 0, abertas: 0, perdidas: 0, valor: 0 };
    }
    if (lead.status === 'Venda Ganha') {
       acc[assignee].ganhas += 1;
       acc[assignee].valor += (lead.totalSpent || 0);
    } else if (lead.status === 'Venda Perdida' || lead.status === 'Cancelado') {
       acc[assignee].perdidas += 1;
    } else {
       acc[assignee].abertas += 1;
    }
    return acc;
  }, {});
  const performanceData = Object.values(assigneeData).sort((a: any, b: any) => b.ganhas - a.ganhas) as any[];

  const DateFilterBadge = ({ value, label }: { value: string, label: string }) => (
    <button 
       onClick={() => setDateFilter(value as any)}
       className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${dateFilter === value ? 'bg-[#0F172A] text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
    >
       {label}
    </button>
  );

  // Expand status leads lists sub-rows
  const toggleExpandedMetric = (sellerName: string, type: 'ganhas' | 'abertas' | 'perdidas') => {
    if (activeExpanded && activeExpanded.seller === sellerName && activeExpanded.type === type) {
      setActiveExpanded(null);
    } else {
      setActiveExpanded({ seller: sellerName, type });
    }
  };

  // Get matching list of leads for active expanded seller and metric status type
  const getSubRowLeads = (sellerName: string, type: 'ganhas' | 'abertas' | 'perdidas') => {
    return filteredLeads.filter(lead => {
      const isAssigned = ((lead as any).assignee || 'Sem Responsável') === sellerName;
      if (!isAssigned) return false;
      
      if (type === 'ganhas') {
        return lead.status === 'Venda Ganha';
      } else if (type === 'perdidas') {
        return lead.status === 'Venda Perdida' || lead.status === 'Cancelado';
      } else {
        return !['Venda Ganha', 'Venda Perdida', 'Cancelado'].includes(lead.status);
      }
    });
  };

  // Quick Inline Note attachment action
  const handleAddFastNote = (leadId: string, currentNotes: any[]) => {
    const text = fastNotes[leadId]?.trim();
    if (!text) return;

    const newNoteObj = {
      id: Date.now().toString(),
      content: text,
      date: new Date().toISOString()
    };

    updateLead(leadId, {
      notes: [newNoteObj, ...currentNotes]
    });

    setFastNotes(prev => ({ ...prev, [leadId]: '' }));
    confetti({ particleCount: 30, spread: 30, origin: { y: 0.9 } });
  };

  // Premium interactive Individual Performance generator (PDF layout standard standard)
  const exportIndividualSellerPDF = (dev: any) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      doc.setDrawColor(226, 232, 240);
      doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
      
      doc.setFillColor(245, 158, 11);
      doc.rect(5, 5, pageWidth - 10, 3, 'F');
      
      doc.setFillColor(15, 23, 42); 
      doc.rect(10, 15, pageWidth - 20, 35, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text("SONO & CIA PREMIUM", 18, 28);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(156, 163, 175);
      doc.text("SISTEMA DE AUDITORIA E INTELIGENCIA DE VENDAS", 18, 34);
      doc.text("EMISSAO OFICIAL DE DESEMPENHO INDIVIDUAL", 18, 39);
      
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text("RELATORIO COMERCIAL", pageWidth - 65, 25);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(156, 163, 175);
      const todayStr = new Date().toLocaleDateString('pt-BR');
      doc.text(`Data: ${todayStr}`, pageWidth - 65, 30);
      doc.text(`Identificador: #SHA-${Math.floor(100000 + Math.random() * 900000)}`, pageWidth - 65, 34);
      doc.text("Status do Vendedor: ATIVO", pageWidth - 65, 38);

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text("CERTIFICADO DE PERFORMANCE E EFICIENCIA", 15, 65);
      
      doc.setDrawColor(241, 245, 249);
      doc.line(15, 68, pageWidth - 15, 68);

      doc.setFillColor(248, 250, 252);
      doc.rect(15, 74, pageWidth - 30, 22, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(15, 74, pageWidth - 30, 22, 'S');

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text("Consultor de Vendas Certificado:", 20, 81);
      
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(dev.name.toUpperCase(), 20, 89);
      
      const totalTreated = dev.ganhas + dev.abertas + dev.perdidas;
      const individualCxRate = totalTreated > 0 ? Math.round((dev.ganhas / totalTreated) * 100) : 0;
      let level = 'NIVEL BRONZE';
      let levelColor = [148, 163, 184];
      if (individualCxRate >= 35 || dev.ganhas >= 15) {
        level = 'NIVEL DIAMANTE COMERCIAL';
        levelColor = [16, 185, 129];
      } else if (individualCxRate >= 20 || dev.ganhas >= 5) {
        level = 'NIVEL OURO PREMIUM';
        levelColor = [245, 158, 11];
      } else if (individualCxRate >= 10) {
        level = 'NIVEL PRATA';
        levelColor = [59, 130, 246];
      }
      
      doc.setFillColor(levelColor[0], levelColor[1], levelColor[2]);
      doc.rect(pageWidth - 65, 80, 45, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(level, pageWidth - 63, 86);

      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("METRICAS DO PERIODO ANALISADO", 15, 110);
      doc.line(15, 112, pageWidth - 15, 112);

      const gridY = 118;
      const colWidth = 43;
      
      doc.setFillColor(240, 253, 250);
      doc.rect(15, gridY, colWidth, 24, 'F');
      doc.setDrawColor(204, 251, 241);
      doc.rect(15, gridY, colWidth, 24, 'S');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(13, 148, 136);
      doc.text("VALOR GANHO / LTV", 20, gridY + 7);
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(`R$ ${dev.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, 20, gridY + 16);

      doc.setFillColor(240, 253, 244);
      doc.rect(15 + colWidth + 4, gridY, colWidth, 24, 'F');
      doc.setDrawColor(220, 252, 231);
      doc.rect(15 + colWidth + 4, gridY, colWidth, 24, 'S');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(22, 163, 74);
      doc.text("VENDAS GANHAS", 15 + colWidth + 9, gridY + 7);
      doc.setFontSize(14);
      doc.setTextColor(21, 128, 61);
      doc.text(`${dev.ganhas}`, 15 + colWidth + 9, gridY + 16);

      doc.setFillColor(254, 243, 199);
      doc.rect(15 + (colWidth * 2) + 8, gridY, colWidth, 24, 'F');
      doc.setDrawColor(253, 230, 138);
      doc.rect(15 + (colWidth * 2) + 8, gridY, colWidth, 24, 'S');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(217, 119, 6);
      doc.text("NEGOCIACOES ATIVAS", 15 + (colWidth * 2) + 13, gridY + 7);
      doc.setFontSize(14);
      doc.setTextColor(180, 83, 9);
      doc.text(`${dev.abertas}`, 15 + (colWidth * 2) + 13, gridY + 16);

      doc.setFillColor(239, 246, 255);
      doc.rect(15 + (colWidth * 3) + 12, gridY, colWidth, 24, 'F');
      doc.setDrawColor(191, 219, 254);
      doc.rect(15 + (colWidth * 3) + 12, gridY, colWidth, 24, 'S');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text("TAXA CONVERSAO", 15 + (colWidth * 3) + 17, gridY + 7);
      doc.setFontSize(14);
      doc.setTextColor(29, 78, 216);
      doc.text(`${individualCxRate}%`, 15 + (colWidth * 3) + 17, gridY + 16);

      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("COACHING DE METAS & ANALISE PROFISSIONAL (AI)", 15, 155);
      doc.line(15, 157, pageWidth - 15, 157);

      doc.setFillColor(248, 250, 252);
      doc.rect(15, 162, pageWidth - 30, 48, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(15, 162, pageWidth - 30, 48, 'S');

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text("1. Diagnostico Comercial e Desempenho:", 20, 169);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      
      const diagnosisText = dev.ganhas > 0 
        ? `${dev.name} demonstra uma taxa de conversao solida de ${individualCxRate}%, conduzindo de forma ativa as negociacoes com os clientes da Sono & Cia baseados no funil.`
        : `Atualmente este vendedor foca no preenchimento de pipeline em aberto (totalizando ${dev.abertas} leads ativos). Recomenda-se acao imediata de follow-up para impulsionar.`;
      
      const linesDiagnosis = doc.splitTextToSize(diagnosisText, pageWidth - 40);
      doc.text(linesDiagnosis, 20, 174);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text("2. Diretriz Pratica de Vendas Recomendada:", 20, 187);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      
      const coachingText = dev.abertas > 0 
        ? `Adote o script de reengajamento rapido via WhatsApp para os ${dev.abertas} leads em aberto. Oferecer um gatilho de urgencia garantira uma elevacao nas tabelas de conversao comercial.`
        : `Pipeline sem pendencias! Recomendamos focar em solicitar novo lote de leads cadastrados na plataforma e reengajar clientes antigos com cupons especiais.`;
      
      const linesCoaching = doc.splitTextToSize(coachingText, pageWidth - 40);
      doc.text(linesCoaching, 20, 192);

      doc.setDrawColor(241, 245, 249);
      doc.line(15, 230, pageWidth - 15, 230);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text("CEDULA DE EXCELENCIA COMERCIAL", 15, 242);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Documento oficial gerado de forma automatica", 15, 247);
      doc.text("para auditorias internas de vendas e bonus.", 15, 251);

      doc.line(pageWidth - 75, 242, pageWidth - 15, 242);
      doc.setFont('helvetica', 'bold');
      doc.text("Diretoria Sono & Cia", pageWidth - 58, 247);
      doc.setFont('helvetica', 'normal');
      doc.text("Registro de Atividades Integrado", pageWidth - 65, 251);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(156, 163, 175);
      doc.text("||| | ||| || |||| | |||| ||| ||| | ||| |||| || ||| |||", 15, 270);
      doc.text(`HASH DE SEGURANÇA: ${Math.random().toString(36).substring(2, 12).toUpperCase()}`, 15, 274);

      doc.save(`DesempenhoVendedor_${dev.name}_${todayStr}.pdf`);
      confetti({ particleCount: 120, spread: 70, colors: ['#FAF5FF', '#10B981', '#3B82F6', '#FBBF24'] });
    } catch (e) {
      console.error(e);
      alert('Erro ao exportar PDF individual do vendedor.');
    }
  };

  return (
    <div className="flex-1 px-5 sm:px-8 pb-8 overflow-y-auto">
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between mb-6 gap-4 font-sans">
        <div>
           <h2 className="text-xl font-bold text-[#0F172A]">Relatórios & Dashboards</h2>
           <p className="text-sm text-gray-500 mt-1">Visão global e comparativo com o período anterior.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl shadow-sm border border-gray-200/60 overflow-x-auto hide-scrollbar sm:flex-nowrap min-w-0">
             <DateFilterBadge value="all" label="Todo o Período" />
             <DateFilterBadge value="today" label="Hoje" />
             <DateFilterBadge value="week" label="Últimos 7 Dias" />
             <DateFilterBadge value="month" label="Últimos 30 Dias" />
             <DateFilterBadge value="year" label="Este Ano" />
          </div>
          
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm text-sm">
             <select 
               value={assigneeFilter} 
               onChange={(e: any) => setAssigneeFilter(e.target.value)}
               className="bg-transparent border-none outline-none text-gray-700 font-medium cursor-pointer"
             >
               <option value="Todos">Todos os Vendedores</option>
               {allAssignees.map(a => (
                 <option key={a} value={a}>{a}</option>
               ))}
               <option value="Sem Responsável">Sem Responsável</option>
             </select>
          </div>

          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-55 hover:bg-emerald-100/80 text-emerald-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-emerald-100"
            title="Exportar base completa para Excel/Planilha"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Planilha</span>
          </button>

          <button 
            onClick={handlePrint} 
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm border border-slate-200/60"
            title="Imprimir relatório comercial"
          >
            <Printer className="w-4 h-4" /> 
            <span className="hidden sm:inline">Imprimir</span>
          </button>
          
          <button 
            onClick={exportPDF} 
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm disabled:opacity-50"
            title="Exportar PDF de alta resolução"
          >
            {exporting ? <ArrowDownToLine className="w-4 h-4 animate-bounce text-blue-400" /> : <FileText className="w-4 h-4" />}
            <span className="hidden sm:inline">{exporting ? 'Gerando...' : 'Exportar PDF'}</span>
          </button>
        </div>
      </div>

      <div ref={reportRef} id="printable-report" className="bg-white p-4 sm:p-6 print:p-0 print:bg-white rounded-2xl border border-gray-100/40">
        
        {/* Printable & Premium PDF Corporate Header */}
        <div className={`mb-8 pb-6 border-b-2 border-slate-100/90 text-left ${exporting ? 'block' : 'hidden print:block'}`}>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-white font-black text-xs shadow-md">
                  Σ
                </div>
                <div>
                  <h1 className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none">Sono & Cia</h1>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Inteligência Comercial</span>
                </div>
              </div>
              <h2 className="text-xl font-black text-slate-950 tracking-tight">Relatório de Desempenho CRM</h2>
              <p className="text-[11px] text-slate-500 font-medium">Análise consolidada de leads, conversões e performance da equipe de vendas.</p>
            </div>
            
            <div className="text-right space-y-1.5 min-w-[200px]">
              <span className="inline-block bg-slate-100 px-2.5 py-0.5 rounded-full text-[8.5px] font-black text-slate-700 uppercase tracking-wider border border-slate-200/50">
                Documento de Análise
              </span>
              <p className="text-[10px] text-slate-500 font-medium mb-0">
                Geração: <span className="font-extrabold text-slate-800">{new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
              </p>
              <p className="text-[10px] text-slate-500 font-medium mb-0">
                Filtro Período: <span className="font-extrabold text-slate-800">{getDateFilterLabel(dateFilter)}</span>
              </p>
              <p className="text-[10px] text-slate-500 font-medium mb-0">
                Filtro Vendedor: <span className="font-extrabold text-slate-800">{assigneeFilter}</span>
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-3 mt-6">
            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]">
              <span className="block text-[8px] uppercase font-bold tracking-wider text-slate-400 mb-0.5">Leads Atendidos</span>
              <span className="text-base font-black text-slate-900">{totalLeads}</span>
            </div>
            <div className="bg-emerald-50/30 p-3 rounded-xl border border-emerald-100/40 text-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]">
              <span className="block text-[8px] uppercase font-bold tracking-wider text-emerald-600 mb-0.5">Vendas Ganhas (Faturamento)</span>
              <span className="text-base font-black text-emerald-700">R$ {totalWonValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
            </div>
            <div className="bg-blue-50/30 p-3 rounded-xl border border-blue-100/40 text-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]">
              <span className="block text-[8px] uppercase font-bold tracking-wider text-blue-600 mb-0.5">Taxa de Conversão</span>
              <span className="text-base font-black text-blue-700">{conversionRate}%</span>
            </div>
            <div className="bg-amber-50/20 p-3 rounded-xl border border-amber-100/30 text-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]">
              <span className="block text-[8px] uppercase font-bold tracking-wider text-amber-600 mb-0.5">Pipeline em Aberto</span>
              <span className="text-base font-black text-amber-700">R$ {totalPipelineValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
            </div>
          </div>
        </div>

        {/* KPI Row (Screen Dashboard Grid) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 relative z-10 flex items-center justify-between">Total de Leads {dateFilter !== 'all' && <TrendBadge trend={leadsTrend} />}</p>
            <p className="text-3xl font-black text-[#0F172A] relative z-10">{totalLeads}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex flex-col justify-between relative overflow-hidden">
             <div className="absolute -right-4 -bottom-4 opacity-5 text-emerald-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2 relative z-10 flex items-center justify-between">Vendas Ganhas {dateFilter !== 'all' && <TrendBadge trend={wonValueTrend} />}</p>
            <p className="text-2xl font-black text-emerald-600 relative z-10">R$ {totalWonValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/></svg>
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 relative z-10">Negociações Abertas</p>
            <div className="flex items-end gap-2 relative z-10">
              <p className="text-3xl font-black text-[#0F172A]">{openLeads.length}</p>
              <span className="text-xs font-bold text-gray-400 mb-1.5 bg-gray-100 px-2 rounded">Leads</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 relative z-10 flex items-center justify-between">Taxa de Conversão {dateFilter !== 'all' && <TrendBadge trend={convTrend} />}</p>
            <p className="text-3xl font-black text-[#0F172A] relative z-10">{conversionRate}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Status Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <h3 className="w-full text-sm font-bold text-[#0F172A] mb-4">Distribuição de Status (Funil)</h3>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                    {statusData.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip formatter={(value: number) => [`${value} leads`, 'Quantidade']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Source Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <h3 className="w-full text-sm font-bold text-[#0F172A] mb-4">Origem de Aquisição</h3>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                  <XAxis dataKey="name" tick={{fontSize: 10}} />
                  <YAxis tick={{fontSize: 10}} />
                  <RechartsTooltip formatter={(value: number) => [`${value} leads`, 'Quantidade']} cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4,4,0,0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Insight Row */}
        {totalLeads > 0 && (
           <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 mb-8 shadow-lg shadow-emerald-500/20 text-white flex flex-col sm:flex-row items-start sm:items-center gap-5 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 opacity-20 transform rotate-12 pointer-events-none">
                 <svg xmlns="http://www.w3.org/2000/svg" width="250" height="250" viewBox="0 0 24 24" fill="currentColor"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white/20 flex shrink-0 items-center justify-center text-white backdrop-blur-md shadow-inner relative z-10 border border-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </div>
              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.2em] bg-black/20 px-2.5 py-0.5 rounded-full inline-block backdrop-blur-md border border-white/10">Análise Inteligente de Metas (Cereja do Bolo)</p>
                </div>
                <p className="text-[15px] font-medium text-emerald-50 leading-relaxed md:pr-10 font-sans">
                  {performanceData.length > 0 && performanceData[0].ganhas > 0 ? (
                    <>
                      O vendedor <span className="font-bold text-white underline decoration-emerald-300 underline-offset-4">{performanceData[0].name}</span> está liderando as conversões com <span className="font-bold text-white">{performanceData[0].ganhas} negócios fechados</span>. 
                      A taxa geral de conversão é de <span className="font-bold text-white">{conversionRate}%</span>, indicando {Number(conversionRate) > 15 ? 'alta eficiência no ciclo de vendas da equipe' : 'oportunidades de melhoria no follow-up da equipe'}.
                    </>
                  ) : (
                    <>Ainda não há vendas ganhas neste filtro. Foco total em pipeline: <span className="font-bold text-white tracking-wide bg-black/20 px-2 py-0.5 rounded">R$ {totalPipelineValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span> de oportunidades quentes em aberto para converter.</>
                  )}
                </p>
              </div>
           </div>
        )}
        
        {/* Performance by Assignee (Highly Premium Interactive Version) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-slate-800" />
                Performance por Consultor Comercial
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Clique nos números para abrir os leads. Toque no avatar do vendedor para carregar imagem personalizada.
              </p>
            </div>
            <span className="self-start text-[10px] font-black text-[#0F172A] uppercase tracking-wider bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
              Equipes de Alto Padrão
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[800px] lg:min-w-full text-left border-collapse font-sans">
              <thead>
                <tr className="bg-slate-50/80 border-b border-gray-100 text-[10px] uppercase font-extrabold text-[#0F172A] tracking-wider">
                  <th className="p-4 pl-4 rounded-tl-xl border-r border-white">Responsável</th>
                  <th className="p-4 text-center border-r border-white">Vendas Ganhas</th>
                  <th className="p-4 text-center border-r border-white">Abertas (Ativas)</th>
                  <th className="p-4 text-center border-r border-white">Perdidas / Canceladas</th>
                  <th className="p-4 text-right border-r border-white">Valor Ganho</th>
                  <th className="p-4 text-center border-r border-white">Conversão %</th>
                  <th className="p-4 pr-4 text-center rounded-tr-xl">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {performanceData.map((dev: any) => {
                   const totalTreated = dev.ganhas + dev.abertas + dev.perdidas;
                   const cxRate = totalTreated > 0 ? Math.round((dev.ganhas / totalTreated) * 100) : 0;
                   const customAvatar = getSellerAvatarUrl(dev.name);

                   return (
                    <React.Fragment key={dev.name}>
                      <tr className="hover:bg-slate-50/45 transition-all group duration-150">
                        
                        {/* Avatar & Name */}
                        <td className="p-4 pl-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setSelectedSellerForAvatar(dev.name)}
                              className="relative group/avatar cursor-pointer focus:outline-none"
                              title="Clique para carregar foto do vendedor"
                            >
                              {customAvatar ? (
                                <img 
                                  src={customAvatar} 
                                  alt={dev.name} 
                                  className="w-9 h-9 rounded-full object-cover shadow-sm border-2 border-slate-200 group-hover/avatar:border-brand-blue/50 transition-all shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-extrabold text-xs uppercase shadow-inner border border-slate-200 group-hover/avatar:border-brand-blue/50 group-hover/avatar:bg-brand-blue/[0.04] transition-all shrink-0">
                                  {dev.name.substring(0,2)}
                                </div>
                              )}
                              {/* Edit indicator */}
                              <div className="absolute -bottom-1 -right-1 bg-[#0F172A] text-white p-0.5 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity border border-white">
                                <Image className="w-2.5 h-2.5" />
                              </div>
                            </button>
                            
                            <div>
                              <span className="font-extrabold text-sm text-[#0F172A] group-hover:text-brand-blue transition-colors">
                                {dev.name}
                              </span>
                              <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-wider flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                Ativo na Sono & Cia
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Vendas Ganhas Badge */}
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => toggleExpandedMetric(dev.name, 'ganhas')}
                            className={`inline-flex items-center justify-center gap-1 min-w-[2.4rem] px-2.5 py-1.5 rounded-xl font-black text-xs border cursor-pointer hover:ring-2 hover:ring-emerald-200 transition-all ${
                              activeExpanded?.seller === dev.name && activeExpanded?.type === 'ganhas'
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                            }`}
                            title="Clique para listar leads ganhos"
                          >
                             {dev.ganhas}
                             <Award className="w-3 h-3 text-current" />
                          </button>
                        </td>

                        {/* Abertas Badge */}
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => toggleExpandedMetric(dev.name, 'abertas')}
                            className={`inline-flex items-center justify-center gap-1 min-w-[2.4rem] px-2.5 py-1.5 rounded-xl font-bold text-xs border cursor-pointer hover:ring-2 hover:ring-indigo-150 transition-all ${
                              activeExpanded?.seller === dev.name && activeExpanded?.type === 'abertas'
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10'
                                : 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-[#EEF2FF]'
                            }`}
                            title="Clique para gerenciar leads ativos em aberto"
                          >
                             {dev.abertas}
                             <RefreshCw className="w-3 h-3 text-current" />
                          </button>
                        </td>

                        {/* Perdidas Badge */}
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => toggleExpandedMetric(dev.name, 'perdidas')}
                            className={`inline-flex items-center justify-center gap-1 min-w-[2.4rem] px-2.5 py-1.5 rounded-xl font-bold text-xs border cursor-pointer hover:ring-2 hover:ring-rose-200 transition-all ${
                              activeExpanded?.seller === dev.name && activeExpanded?.type === 'perdidas'
                                ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/10'
                                : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100'
                            }`}
                            title="Clique para ver oportunidades perdidas e reengajar"
                          >
                             {dev.perdidas}
                             <AlertCircle className="w-3 h-3 text-current" />
                          </button>
                        </td>

                        {/* Valor Gasto / Ganho */}
                        <td className="p-4 text-right">
                          <span className="font-extrabold text-[#0F172A] text-xs font-mono block">
                            R$ {dev.valor.toLocaleString('pt-BR', {minimumFractionDigits:2})}
                          </span>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 block">
                            Faturamento Realizado
                          </span>
                        </td>

                        {/* Conversion Rate column */}
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-black border tracking-wider ${
                              cxRate >= 30 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-[0_1px_5px_rgba(16,185,129,0.06)]' 
                                : cxRate >= 15 
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-150' 
                                : 'bg-slate-50 text-gray-500 border-slate-200'
                            }`}>
                              {cxRate}%
                            </span>
                          </div>
                        </td>

                        {/* Action buttons (relatorio certificate + spark AI tip) */}
                        <td className="p-4 pr-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => exportIndividualSellerPDF(dev)}
                              className="p-2 bg-slate-50 text-slate-700 hover:bg-slate-900 hover:text-white border border-slate-200 hover:border-slate-900 rounded-xl transition-all shadow-sm shrink-0"
                              title="Gerar Cédula de Excelência & Desempenho (PDF)"
                            >
                              <Award className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                const leadsOfSeller = getSubRowLeads(dev.name, 'abertas');
                                toggleExpandedMetric(dev.name, 'abertas');
                                confetti({ particleCount: 30, spread: 40 });
                              }}
                              className="p-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl transition-all shadow-sm shrink-0 border border-indigo-100/50"
                              title="Ver Inteligência de Metas das Negociações"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Leads detailed section inside Reports view (Cereja do Bolo) */}
                      {activeExpanded?.seller === dev.name && (
                        <tr className="bg-slate-50/60 shadow-inner">
                          <td colSpan={7} className="p-5 pl-8 pr-8 rounded-b-2xl border-l-4 border-[#0F172A]">
                            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                                  <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse inline-block"></span>
                                  Dossiê Comercial: {dev.name} — Leads do tipo "{activeExpanded.type.toUpperCase()}" 
                                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md ml-2">
                                    {getSubRowLeads(dev.name, activeExpanded.type).length} Oportunidades encontradas
                                  </span>
                                </h4>
                                <p className="text-[11px] text-gray-500 mt-0.5">
                                  Ações imediatas de reengajamento WhatsApp, alteração rápida de status comercial e gravação direta de Notas de followup.
                                </p>
                              </div>
                              <button 
                                onClick={() => setActiveExpanded(null)}
                                className="p-1 px-2.5 text-[10px] bg-slate-200/50 text-slate-700 hover:bg-slate-300 font-extrabold rounded-lg uppercase tracking-wider transition-all"
                              >
                                Fechar Painel <X className="w-3 h-3 inline ml-1" />
                              </button>
                            </div>

                            {getSubRowLeads(dev.name, activeExpanded.type).length === 0 ? (
                              <div className="bg-white p-6 rounded-2xl border border-dashed border-gray-200 text-center">
                                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-xs font-bold text-gray-500">Nenhum lead com este status registrado para este vendedor neste filtro de período.</p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                {getSubRowLeads(dev.name, activeExpanded.type).map((lead: Lead) => {
                                  const lastUpdate = new Date(lead.updatedAt || lead.createdAt).toLocaleDateString('pt-BR');
                                  
                                  // Pre-built WhatsApp re-engagement texts depending on current view
                                  const rawText = activeExpanded.type === 'abertas' 
                                    ? `Olá, ${lead.name}! Sou o ${dev.name} da Sono & Cia. Estou verificando suas preferências da Coleção Premium e gostaria de saber se ficou alguma dúvida com seu pedido. Posso lhe liberar o Cupom ESPECIALVIP com Frete Gratuito e 10% OFF para fecharmos hoje?`
                                    : `Olá, ${lead.name}! Aqui é o ${dev.name} da Sono & Cia. Notamos que sua última negociação foi encerrada recentemente. Gostaríamos muito de entender a sua experiência e oferecer uma condição extraordinária de reativação com 10% de cashback se você ainda tiver interesse! O que acha?`;
                                  
                                  const whatsappUrl = `https://api.whatsapp.com/send?phone=${lead.phone.replace(/\D/g, '')}&text=${encodeURIComponent(rawText)}`;

                                  return (
                                    <div key={lead.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow group/card">
                                      {/* Lead Header Info */}
                                      <div>
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
                                            <span className="font-extrabold text-xs text-slate-800">
                                              {lead.name}
                                            </span>
                                            {lead.vipLevel && lead.vipLevel !== 'Nenhum' && (
                                              <span className="text-[8px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded tracking-widest uppercase">
                                                {lead.vipLevel}
                                              </span>
                                            )}
                                          </div>
                                          <span className="text-[10px] font-mono text-gray-400 font-bold">
                                            Ref: {lastUpdate}
                                          </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 mb-3 border-b border-slate-50 pb-2">
                                          <div>
                                            <span className="font-bold block">Origem de Entrada:</span>
                                            {lead.source || 'Manual/Tráfego Orgânico'}
                                          </div>
                                          <div>
                                            <span className="font-bold block">Faturamento Previsto:</span>
                                            <span className="font-extrabold text-slate-800 font-mono">
                                              R$ {(lead.estimatedValue || lead.totalSpent || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Dynamic Lead Notes History Log */}
                                        <div className="mb-3">
                                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                                            Histórico de Anotações Recentes ({lead.notes?.length || 0})
                                          </span>
                                          {lead.notes && lead.notes.length > 0 ? (
                                            <div className="max-h-[65px] overflow-y-auto space-y-1.5 border border-slate-100 rounded-lg p-2 bg-slate-50 border-dashed scrollbar-thin">
                                              {lead.notes.slice(0, 3).map((no) => (
                                                <div key={no.id} className="text-[10px] text-slate-600 border-b border-white last:border-b-0 pb-1">
                                                  <span className="font-bold text-slate-800">({new Date(no.date).toLocaleDateString('pt-BR')})</span>: {no.content}
                                                </div>
                                              ))}
                                            </div>
                                          ) : (
                                            <p className="text-[10px] text-gray-400 italic">Sem anotações de follow-up nesta oportunidade.</p>
                                          )}
                                        </div>
                                      </div>

                                      {/* Sub Actions Area */}
                                      <div className="space-y-2.5 pt-2 border-t border-slate-50">
                                        {/* Adding fast note */}
                                        <div className="flex items-center gap-1.5">
                                          <input 
                                            type="text" 
                                            placeholder="Anotar novo followup rápido..." 
                                            value={fastNotes[lead.id] || ''} 
                                            onChange={(e) => setFastNotes({...fastNotes, [lead.id]: e.target.value})}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') handleAddFastNote(lead.id, lead.notes || []);
                                            }}
                                            className="flex-1 text-[11px] px-2.5 py-1.5 border border-slate-200 focus:border-brand-blue outline-none rounded-lg"
                                          />
                                          <button
                                            onClick={() => handleAddFastNote(lead.id, lead.notes || [])}
                                            className="p-1 px-2.5 bg-slate-900 text-white rounded-lg text-[10px] font-extrabold uppercase hover:bg-black transition-all shadow-sm flex items-center gap-1"
                                          >
                                            <Plus className="w-3 h-3" /> Salvar
                                          </button>
                                        </div>

                                        {/* Change Status Direct Actions and WhatsApp trigger */}
                                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                                          <div className="flex items-center gap-1">
                                            <span className="text-[10px] text-gray-400 font-bold mr-1">Status Rápido:</span>
                                            {lead.status !== 'Venda Ganha' && (
                                              <button
                                                onClick={() => {
                                                  updateLead(lead.id, { status: 'Venda Ganha' });
                                                  confetti({ particleCount: 50, spread: 40 });
                                                }}
                                                className="px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md border border-emerald-100"
                                              >
                                                Marcar Ganha
                                              </button>
                                            )}
                                            {lead.status !== 'Venda Perdida' && lead.status !== 'Cancelado' && (
                                              <button
                                                onClick={() => updateLead(lead.id, { status: 'Venda Perdida' })}
                                                className="px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-md border border-rose-100"
                                              >
                                                Marcar Perdido
                                              </button>
                                            )}
                                            {(lead.status === 'Venda Ganha' || lead.status === 'Venda Perdida' || lead.status === 'Cancelado') && (
                                              <button
                                                onClick={() => updateLead(lead.id, { status: 'Em Negociação' })}
                                                className="px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md border border-indigo-150"
                                              >
                                                Reabrir Negociação
                                              </button>
                                            )}
                                          </div>

                                          <a 
                                            href={whatsappUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-sm"
                                          >
                                            <Phone className="w-3 h-3 fill-current" />
                                            WhatsApp
                                          </a>
                                        </div>
                                      </div>

                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                   );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Printable & Premium PDF Footer */}
        <div className={`mt-8 pt-4 border-t border-slate-100/80 flex items-center justify-between text-slate-400 font-medium ${exporting ? 'flex' : 'hidden print:flex'}`}>
          <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-extrabold">
            <span>Sono & Cia Inteligência Comercial</span>
            <span>•</span>
            <span>Relatório Analítico de Conversões</span>
          </div>
          <p className="text-[9px] uppercase tracking-wider font-extrabold">
            Página 1 de 1
          </p>
        </div>
      </div>

      {/* Upload Seller Avatar Modal */}
      {selectedSellerForAvatar && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-xs font-sans p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-scaleUp">
            
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Image className="w-5 h-5 text-indigo-600" />
                Carregar Imagem do Vendedor
              </h3>
              <button 
                onClick={() => setSelectedSellerForAvatar(null)}
                className="p-1 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Defina a foto do consultor(a) <span className="font-bold text-slate-800">{selectedSellerForAvatar}</span>. Você pode selecionar um avatar executivo pronto de alta resolução, carregar um arquivo de imagem local do computador ou colar um link público.
            </p>

            {/* Premium preset avatars list */}
            <div className="mb-5 bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2.5">
                Escolha um Avatar Executivo Premium:
              </span>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.url}
                    onClick={() => saveSellerAvatar(selectedSellerForAvatar, av.url)}
                    className="group relative focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full cursor-pointer overflow-hidden p-0.5"
                    title={av.name}
                  >
                    <img 
                      src={av.url} 
                      alt={av.name} 
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 group-hover:scale-110 transition-transform shadow-xs"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL Option */}
            <div className="mb-4">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                Opção 2 — Link da Imagem Direct (HTTP/HTTPS):
              </span>
              <div className="flex items-center gap-2">
                <input 
                  type="url" 
                  placeholder="Cole o endereço da imagem..." 
                  value={avatarInputUrl}
                  onChange={(e) => setAvatarInputUrl(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 focus:border-brand-blue rounded-xl outline-none"
                />
                <button
                  onClick={() => {
                    if (avatarInputUrl.trim()) {
                      saveSellerAvatar(selectedSellerForAvatar, avatarInputUrl.trim());
                    }
                  }}
                  className="px-4 py-2 bg-slate-900 text-white font-bold text-xs hover:bg-black rounded-xl uppercase tracking-wider transition-all"
                >
                  Confirmar
                </button>
              </div>
            </div>

            {/* Local file selection option */}
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                Opção 3 — Carregar do seu computador:
              </span>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-brand-blue rounded-2xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
                <ArrowDownToLine className="w-6 h-6 text-gray-400 group-hover:text-brand-blue group-hover:scale-110 transition-all mb-1" />
                <span className="text-[11px] font-black text-slate-700 tracking-tight group-hover:text-brand-blue uppercase">Selecionar arquivo de imagem</span>
                <span className="text-[10px] text-gray-400 mt-0.5">Formatos suportados: PNG, JPG ou WEBP. Max 2MB</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleFileUpload(e, selectedSellerForAvatar)}
                  className="hidden" 
                />
              </label>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
