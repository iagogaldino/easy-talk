import { Document } from '../../admin/models/widget.model';

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    orderNumber: 'PED-2024-001',
    clientName: 'João Silva',
    clientPhone: '+55 11 98765-4321',
    documentType: 'boleto',
    documentUrl: '/documents/boleto-ped-2024-001.pdf',
    sentDate: new Date('2024-11-10T10:30:00'),
    status: 'sent',
    amount: 1250.00,
    dueDate: new Date('2024-11-25T23:59:59'),
  },
  {
    id: 'doc-2',
    orderNumber: 'PED-2024-001',
    clientName: 'João Silva',
    clientPhone: '+55 11 98765-4321',
    documentType: 'nota-fiscal',
    documentUrl: '/documents/nf-ped-2024-001.pdf',
    sentDate: new Date('2024-11-10T10:35:00'),
    status: 'viewed',
    amount: 1250.00,
  },
  {
    id: 'doc-3',
    orderNumber: 'PED-2024-002',
    clientName: 'Maria Santos',
    clientPhone: '+55 11 97654-3210',
    documentType: 'nota-promissoria',
    documentUrl: '/documents/np-ped-2024-002.pdf',
    status: 'pending',
    amount: 2500.00,
    dueDate: new Date('2024-12-10T23:59:59'),
  },
  {
    id: 'doc-4',
    orderNumber: 'PED-2024-002',
    clientName: 'Maria Santos',
    clientPhone: '+55 11 97654-3210',
    documentType: 'pedido',
    documentUrl: '/documents/pedido-ped-2024-002.pdf',
    sentDate: new Date('2024-11-11T14:30:00'),
    status: 'viewed',
  },
  {
    id: 'doc-5',
    orderNumber: 'PED-2024-003',
    clientName: 'Pedro Oliveira',
    clientPhone: '+55 11 96543-2109',
    documentType: 'boleto',
    documentUrl: '/documents/boleto-ped-2024-003.pdf',
    status: 'pending',
    amount: 890.50,
    dueDate: new Date('2024-11-20T23:59:59'),
  },
  {
    id: 'doc-6',
    orderNumber: 'PED-2024-004',
    clientName: 'Ana Costa',
    clientPhone: '+55 11 95432-1098',
    documentType: 'nota-fiscal',
    documentUrl: '/documents/nf-ped-2024-004.pdf',
    sentDate: new Date('2024-11-12T16:50:00'),
    status: 'sent',
    amount: 3200.00,
  },
  {
    id: 'doc-7',
    orderNumber: 'PED-2024-005',
    clientName: 'Carlos Ferreira',
    clientPhone: '+55 11 94321-0987',
    documentType: 'pedido',
    documentUrl: '/documents/pedido-ped-2024-005.pdf',
    status: 'pending',
  },
  {
    id: 'doc-8',
    orderNumber: 'PED-2024-006',
    clientName: 'Fernanda Lima',
    clientPhone: '+55 11 93210-9876',
    documentType: 'nota-promissoria',
    documentUrl: '/documents/np-ped-2024-006.pdf',
    sentDate: new Date('2024-11-13T08:00:00'),
    status: 'sent',
    amount: 1500.00,
    dueDate: new Date('2024-12-13T23:59:59'),
  },
];

export function getDocumentsByStatus(status?: 'all' | 'pending' | 'sent' | 'viewed'): Document[] {
  if (!status || status === 'all') {
    return MOCK_DOCUMENTS;
  }
  return MOCK_DOCUMENTS.filter(doc => doc.status === status);
}

export function getDocumentsByType(type?: 'all' | 'boleto' | 'nota-promissoria' | 'nota-fiscal' | 'pedido'): Document[] {
  if (!type || type === 'all') {
    return MOCK_DOCUMENTS;
  }
  return MOCK_DOCUMENTS.filter(doc => doc.documentType === type);
}

export function getDocumentsStats() {
  return {
    total: MOCK_DOCUMENTS.length,
    pending: MOCK_DOCUMENTS.filter(d => d.status === 'pending').length,
    sent: MOCK_DOCUMENTS.filter(d => d.status === 'sent').length,
    viewed: MOCK_DOCUMENTS.filter(d => d.status === 'viewed').length,
    boleto: MOCK_DOCUMENTS.filter(d => d.documentType === 'boleto').length,
    notaPromissoria: MOCK_DOCUMENTS.filter(d => d.documentType === 'nota-promissoria').length,
    notaFiscal: MOCK_DOCUMENTS.filter(d => d.documentType === 'nota-fiscal').length,
    pedido: MOCK_DOCUMENTS.filter(d => d.documentType === 'pedido').length,
  };
}

