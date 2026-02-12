import React, { useState, useEffect } from 'react';
import { NavigationProps, Crop, InputProduct, Technician, AgroIndustry, CommitteeMember, DocumentRequirement, MasterStage } from '../types';
import { useMasterData } from '../context/MasterDataContext';
import { useProducers } from '../context/ProducerContext';
import { 
    Sprout, User, Building, Plus, Edit2, MapPin, Truck, CheckSquare, ChevronRight, 
    FileText, Save, X, ToggleLeft, ToggleRight, Package, DollarSign, Layers, 
    Warehouse, Trash2, Check, Users, UserCheck, Shield, List, Clock, 
    AlertTriangle, ShoppingCart, Zap, Store, Handshake, Target, BarChart3, Globe,
    LayoutGrid, Briefcase, UserPlus, FileSearch, ArrowUpRight, MessageSquare,
    Smartphone
} from 'lucide-react';

interface MastersProps extends NavigationProps {
    tab: 'crops' | 'inputs' | 'techs' | 'partners' | 'committee' | 'docs' | 'stages';
}

const DesktopMasters: React.FC<MastersProps> = ({ onNavigate, tab }) => {
    const { 
        crops, addCrop, updateCrop, 
        inputs, addInput, updateInput,
        partners, addPartner, updatePartner,
        documents, addDocument, updateDocument,
        technicians, addTechnician, updateTechnician,
        stages, addStage, updateStage,
        committee, addCommitteeMember, updateCommitteeMember
    } = useMasterData();
    const { producers } = useProducers();
    
    const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showArchComercial, setShowArchComercial] = useState(tab === 'partners');
    
    // Form States
    const [cropForm, setCropForm] = useState({ name: '', variety: '', type: 'Consumo' as 'Consumo' | 'Semilla', cycle: '' });
    const [inputForm, setInputForm] = useState({ 
        name: '', category: 'Fertilizante', presentation: '', 
        unit: '', price: '', stock: '', warehouseId: '', status: 'Activo' 
    });
    const [docForm, setDocForm] = useState({ 
        name: '', description: '', requiredFor: 'Ambos' as 'Natural' | 'Juridica' | 'Ambos', stage: 'Solicitud' as 'Solicitud' | 'Contrato' | 'Cierre'
    });
    const [partnerForm, setPartnerForm] = useState<{
        name: string; type: 'Aproscello' | 'Aliado'; vat: string; isComercioAgro: boolean; warehouses: { id: string; name: string; location: string }[]
    }>({ 
        name: '', type: 'Aliado', vat: '', isComercioAgro: false, warehouses: [] 
    });
    const [techForm, setTechForm] = useState({
        name: '', phone: '', zone: '', radius: '', vehicle: '', 
        role: 'Tecnico' as 'Jefe' | 'Tecnico', supervisorId: '', subordinateIds: [] as string[], odooUser: '',
        assignedFarms: [] as string[]
    });
    const [stageForm, setStageForm] = useState({
        name: '', description: '', duration: '', requiresVisit: false
    });
    const [committeeForm, setCommitteeForm] = useState({
        name: '', role: '', agroIndustry: ''
    });

    const getTitle = () => {
        switch(tab) {
            case 'crops': return 'Gestión de Cultivos y Rubros';
            case 'inputs': return 'Catálogo de Insumos';
            case 'techs': return 'Directorio de Técnicos';
            case 'partners': return 'Agroindustrias y Aliados';
            case 'committee': return 'Comité de Crédito';
            case 'docs': return 'Documentos y Recaudos';
            case 'stages': return 'Etapas de Apoyo';
            default: return 'Datos Maestros';
        }
    };

    const getDescription = () => {
        switch(tab) {
            case 'crops': return 'Defina los rubros, variedades y tiempos de ciclo.';
            case 'inputs': return 'Gestiona productos, categorías, presentaciones y costos.';
            case 'techs': return 'Administra el personal de campo y asignación de zonas.';
            case 'partners': return 'Ecosistema comercial: Canales de venta, alianzas B2B2C y red Comercio Agro.';
            case 'committee': return 'Miembros autorizados para aprobar financiamientos.';
            case 'docs': return 'Configuración de documentos requeridos por etapa.';
            case 'stages': return 'Definición de etapas maestras para los patrones de apoyo.';
            default: return '';
        }
    };

    const handleCreateNew = () => {
        setEditingId(null);
        setViewMode('form');
        // Reset forms would go here but for brevity we'll assume they're handled
    };

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setViewMode('form');
        // Populate specific form based on tab
        if (tab === 'crops') setCropForm({ name: item.name, variety: item.variety, type: item.type, cycle: item.cycleDurationDays.toString() });
        if (tab === 'inputs') setInputForm({ name: item.name, category: item.category, presentation: item.presentation, unit: item.unit, price: item.price?.toString() || '', stock: item.stockLevel.toString(), warehouseId: item.warehouseId || '', status: item.status });
    };

    const handleSave = () => {
        if (tab === 'crops') {
            const cropData: Crop = { 
                id: editingId || `c-${Date.now()}`, 
                name: cropForm.name, 
                variety: cropForm.variety, 
                type: cropForm.type, 
                cycleDurationDays: parseInt(cropForm.cycle) || 0, 
                status: 'Activo' 
            };
            editingId ? updateCrop(editingId, cropData) : addCrop(cropData);
        }
        if (tab === 'inputs') {
            const inputData: InputProduct = {
                id: editingId || `i-${Date.now()}`,
                name: inputForm.name,
                category: inputForm.category,
                presentation: inputForm.presentation,
                unit: inputForm.unit,
                price: parseFloat(inputForm.price) || 0,
                stockLevel: parseInt(inputForm.stock) || 0,
                warehouseId: inputForm.warehouseId,
                status: inputForm.status as any
            };
            editingId ? updateInput(editingId, inputData) : addInput(inputData);
        }
        setViewMode('list');
        setEditingId(null);
    };

    // RENDER: ARQUITECTURA COMERCIAL
    const renderComercialArchitecture = () => (
        <div className="space-y-8 animate-in fade-in duration-700 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border-l-4 border-l-emerald-600 border border-slate-200 shadow-sm">
                    <div className="bg-emerald-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                        <Target className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-2">Canal Venta Directa</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">Fuerza de campo (ATCs) realizando pre-calificación in-situ mediante Sales Enablement.</p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase"><UserCheck className="h-3.5 w-3.5" /> Asesores Técnicos</div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase"><Smartphone className="h-3.5 w-3.5" /> Scoring en Campo</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border-l-4 border-l-blue-600 border border-slate-200 shadow-sm">
                    <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                        <Handshake className="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-2">Alianzas B2B2C</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">Crédito originado en mostrador de Agro-comercios al comprar insumos.</p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase"><Store className="h-3.5 w-3.5" /> Punto de Venta Agro</div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase"><Users className="h-3.5 w-3.5" /> Cooperativas</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border-l-4 border-l-amber-600 border border-slate-200 shadow-sm">
                    <div className="bg-amber-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                        <Globe className="h-5 w-5 text-amber-600" />
                    </div>
                    <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-2">Red Comercio Agro</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">Integración con bodegas rurales y puntos de cercanía para el productor.</p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase"><Warehouse className="h-3.5 w-3.5" /> Bodegas Rurales</div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase"><MapPin className="h-3.5 w-3.5" /> Capilaridad Local</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border-l-4 border-l-purple-600 border border-slate-200 shadow-sm">
                    <div className="bg-purple-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                    </div>
                    <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-2">Scoring Centralizado</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">Unificación de riesgos basada en comportamiento histórico de pagos y cosechas.</p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase"><Shield className="h-3.5 w-3.5" /> Validación Digital</div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase"><Zap className="h-3.5 w-3.5" /> Motor de Riesgo</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCropsList = () => (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b font-bold text-slate-500 text-xs uppercase">
                    <tr>
                        <th className="p-4">Rubro</th>
                        <th className="p-4">Variedad</th>
                        <th className="p-4">Tipo</th>
                        <th className="p-4 text-right">Días Ciclo</th>
                        <th className="p-4 text-center">Estado</th>
                        <th className="p-4 text-center">Acción</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {crops.map(crop => (
                        <tr key={crop.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-bold text-slate-800">{crop.name}</td>
                            <td className="p-4 text-slate-600">{crop.variety}</td>
                            <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${crop.type === 'Semilla' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {crop.type}
                                </span>
                            </td>
                            <td className="p-4 text-right font-mono">{crop.cycleDurationDays}</td>
                            <td className="p-4 text-center">
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">Activo</span>
                            </td>
                            <td className="p-4 text-center">
                                <button onClick={() => handleEdit(crop)} className="text-slate-400 hover:text-emerald-600"><Edit2 className="h-4 w-4" /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderInputsList = () => (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b font-bold text-slate-500 text-xs uppercase">
                    <tr>
                        <th className="p-4">Insumo</th>
                        <th className="p-4">Categoría</th>
                        <th className="p-4 text-right">Precio Ref.</th>
                        <th className="p-4 text-right">Stock</th>
                        <th className="p-4 text-center">Estado</th>
                        <th className="p-4 text-center">Acción</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {inputs.map(input => (
                        <tr key={input.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                                <div className="font-bold text-slate-800">{input.name}</div>
                                <div className="text-[10px] text-slate-400 font-medium uppercase">{input.presentation}</div>
                            </td>
                            <td className="p-4 text-slate-600">{input.category}</td>
                            <td className="p-4 text-right font-mono text-emerald-600 font-bold">${input.price}</td>
                            <td className="p-4 text-right font-mono">{input.stockLevel} {input.unit}</td>
                            <td className="p-4 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${input.status === 'Activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                                    {input.status}
                                </span>
                            </td>
                            <td className="p-4 text-center">
                                <button onClick={() => handleEdit(input)} className="text-slate-400 hover:text-emerald-600"><Edit2 className="h-4 w-4" /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{getTitle()}</h1>
                    <p className="text-sm text-slate-500 font-medium">{getDescription()}</p>
                </div>
                {viewMode === 'list' && (
                    <div className="flex gap-2">
                        {tab === 'partners' && (
                            <button 
                                onClick={() => setShowArchComercial(!showArchComercial)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all flex items-center gap-2 ${showArchComercial ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-300'}`}
                            >
                                <LayoutGrid className="h-4 w-4" /> Arquitectura Comercial
                            </button>
                        )}
                        <button 
                            onClick={handleCreateNew}
                            className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-emerald-700 flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                        >
                            <Plus className="h-4 w-4" /> Nuevo Registro
                        </button>
                    </div>
                )}
            </div>

            {viewMode === 'list' ? (
                <>
                    {tab === 'partners' && showArchComercial && renderComercialArchitecture()}
                    {tab === 'crops' && renderCropsList()}
                    {tab === 'inputs' && renderInputsList()}
                    {/* Placeholder for other lists to keep it clean */}
                    {['techs', 'partners', 'committee', 'docs', 'stages'].includes(tab) && (
                        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400 italic">
                            Listado de {getTitle()} en proceso de carga desde Odoo...
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-2xl mx-auto animate-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b">
                        <h2 className="text-xl font-bold text-slate-800">{editingId ? 'Editar' : 'Crear'} {getTitle().slice(0, -1)}</h2>
                        <button onClick={() => setViewMode('list')} className="text-slate-400 hover:text-slate-600"><X className="h-6 w-6" /></button>
                    </div>

                    <div className="space-y-6">
                        {tab === 'crops' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2"><label className="text-xs font-bold text-slate-500 uppercase">Nombre del Rubro</label><input type="text" className="w-full p-3 border rounded-lg" value={cropForm.name} onChange={e => setCropForm({...cropForm, name: e.target.value})} /></div>
                                <div><label className="text-xs font-bold text-slate-500 uppercase">Variedad</label><input type="text" className="w-full p-3 border rounded-lg" value={cropForm.variety} onChange={e => setCropForm({...cropForm, variety: e.target.value})} /></div>
                                <div><label className="text-xs font-bold text-slate-500 uppercase">Días Ciclo</label><input type="number" className="w-full p-3 border rounded-lg" value={cropForm.cycle} onChange={e => setCropForm({...cropForm, cycle: e.target.value})} /></div>
                            </div>
                        )}
                        {tab === 'inputs' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2"><label className="text-xs font-bold text-slate-500 uppercase">Nombre Comercial</label><input type="text" className="w-full p-3 border rounded-lg" value={inputForm.name} onChange={e => setInputForm({...inputForm, name: e.target.value})} /></div>
                                <div><label className="text-xs font-bold text-slate-500 uppercase">Categoría</label><select className="w-full p-3 border rounded-lg bg-white" value={inputForm.category} onChange={e => setInputForm({...inputForm, category: e.target.value})}><option>Fertilizante</option><option>Herbicida</option><option>Fungicida</option><option>Semilla</option></select></div>
                                <div><label className="text-xs font-bold text-slate-500 uppercase">Precio Ref. ($)</label><input type="number" className="w-full p-3 border rounded-lg font-mono" value={inputForm.price} onChange={e => setInputForm({...inputForm, price: e.target.value})} /></div>
                                <div><label className="text-xs font-bold text-slate-500 uppercase">Existencia inicial</label><input type="number" className="w-full p-3 border rounded-lg" value={inputForm.stock} onChange={e => setInputForm({...inputForm, stock: e.target.value})} /></div>
                                <div><label className="text-xs font-bold text-slate-500 uppercase">Unidad</label><input type="text" className="w-full p-3 border rounded-lg" value={inputForm.unit} onChange={e => setInputForm({...inputForm, unit: e.target.value})} placeholder="kg, lt, saco..." /></div>
                            </div>
                        )}
                        
                        <div className="flex justify-end gap-3 pt-6 border-t">
                            <button onClick={() => setViewMode('list')} className="px-6 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-50">Cancelar</button>
                            <button onClick={handleSave} className="bg-emerald-600 text-white px-8 py-2 rounded-lg font-black uppercase text-xs tracking-widest hover:bg-emerald-700 shadow-lg flex items-center gap-2"><Save className="h-4 w-4" /> Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DesktopMasters;