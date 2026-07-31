import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, query, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Contract } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Plus, 
  Search, 
  FileText, 
  MoreVertical, 
  Download, 
  Trash2, 
  ExternalLink,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { formatCurrency, cn } from '@/lib/utils';

export default function ContractsView() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchContracts = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, 'contracts'), orderBy('created_at', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contract));

        if (data.length > 0) {
          setContracts(data);
          localStorage.setItem('viktor_labs_contracts', JSON.stringify(data));
        } else {
          // Fallback to local storage
          const local = localStorage.getItem('viktor_labs_contracts');
          if (local) setContracts(JSON.parse(local));
        }
      } catch (err) {
        console.error("Fetch failed", err);
        handleFirestoreError(err, OperationType.LIST, 'contracts');
        const local = localStorage.getItem('viktor_labs_contracts');
        if (local) setContracts(JSON.parse(local));
      } finally {
        setIsLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.customer_company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.project_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'signed':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider"><CheckCircle2 className="w-3 h-3" /> Unterschrieben</span>;
      case 'sent':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-wider"><Clock className="w-3 h-3" /> Gesendet</span>;
      case 'draft':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/10 text-slate-400 text-[10px] font-bold uppercase tracking-wider"><FileText className="w-3 h-3" /> Entwurf</span>;
      case 'cancelled':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider"><AlertCircle className="w-3 h-3" /> Storniert</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-slate-500/10 text-slate-400 text-[10px] font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  const deleteContract = async (id: string) => {
    if (!confirm('Vertrag wirklich löschen?')) return;
    
    try {
      await deleteDoc(doc(db, 'contracts', id));
      const updated = contracts.filter(c => c.id !== id);
      setContracts(updated);
      localStorage.setItem('viktor_labs_contracts', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
      handleFirestoreError(e, OperationType.DELETE, `contracts/${id}`);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-50">Verträge</h2>
          <p className="text-slate-400">Erstellen und verwalten Sie Ihre Projektverträge.</p>
        </div>
        <Button onClick={() => navigate('/admin/contracts/new')} className="bg-cyan-500 text-dark-950 font-bold">
          <Plus className="w-4 h-4 mr-2" />
          Neuer Vertrag
        </Button>
      </div>

      <Card className="border-white/10 bg-dark-900/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                placeholder="Vertragsnummer, Kunde oder Projekt suchen..." 
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select 
                className="bg-dark-950 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="all">Alle Status</option>
                <option value="draft">Entwurf</option>
                <option value="sent">Gesendet</option>
                <option value="signed">Unterschrieben</option>
                <option value="cancelled">Storniert</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/5">
                  <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-500 px-4">Vertrag</th>
                  <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-500 px-4">Kunde & Projekt</th>
                  <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-500 px-4">Datum</th>
                  <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-500 px-4">Status</th>
                  <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-500 px-4 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : filteredContracts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-slate-500">
                      Keine Verträge gefunden.
                    </td>
                  </tr>
                ) : (
                  filteredContracts.map((contract) => (
                    <tr key={contract.id} className="group hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-mono text-cyan-500 font-bold">{contract.contract_number}</span>
                          <span className="text-xs text-slate-500">{contract.contract_type}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-200">{contract.customer_company}</span>
                          <span className="text-xs text-slate-500">{contract.project_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-400">
                        {format(parseISO(contract.contract_date), 'dd.MM.yyyy')}
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(contract.status)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/admin/contracts/edit/${contract.id}`)}
                            className="text-slate-400 hover:text-cyan-500"
                            title="Bearbeiten"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/admin/contracts/edit/${contract.id}?download=true`)}
                            className="text-slate-400 hover:text-emerald-500"
                            title="PDF Herunterladen"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteContract(contract.id)}
                            className="text-slate-400 hover:text-red-500"
                            title="Löschen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
