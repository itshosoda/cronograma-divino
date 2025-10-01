import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event } from "@/components/ScheduleTable";

interface AddEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onUpdateEvent?: (event: Event) => void;
  editingEvent?: Event | null;
  selectedDate: string;
  timeSlots?: { id: string; label: string }[];
}

const timeSlotsByDay = {
  quinta: [
    { id: '19:30-19:45', label: '19:30 - 19:45' },
    { id: '19:45-19:55', label: '19:45 - 19:55' },
    { id: '19:55-20:05', label: '19:55 - 20:05' },
    { id: '20:05-20:30', label: '20:05 - 20:30' },
    { id: '20:30-20:40', label: '20:30 - 20:40' },
    { id: '20:40', label: '20:40' },
  ],
  domingo_manha: [
    { id: '09:15-09:20', label: '09:15 - 09:20' },
    { id: '09:20-09:45', label: '09:20 - 09:45' },
    { id: '09:45-09:50', label: '09:45 - 09:50' },
    { id: '09:50-09:55', label: '09:50 - 09:55' },
    { id: '09:55-10:30', label: '09:55 - 10:30' },
    { id: '10:30-10:45', label: '10:30 - 10:45' },
    { id: '10:45', label: '10:45' },
  ],
  domingo_noite: [
    { id: '18:30-18:35', label: '18:30 - 18:35' },
    { id: '18:35-19:05', label: '18:35 - 19:05' },
    { id: '19:05-19:10', label: '19:05 - 19:10' },
    { id: '19:10-19:15', label: '19:10 - 19:15' },
    { id: '19:15-20:10', label: '19:15 - 20:10' },
    { id: '20:10-20:30', label: '20:10 - 20:30' },
    { id: '20:30', label: '20:30' },
  ]
};

export const AddEventDialog = ({
  isOpen,
  onOpenChange,
  onAddEvent,
  onUpdateEvent,
  editingEvent,
  selectedDate,
}: AddEventDialogProps) => {
  const [formData, setFormData] = useState({
    type: '' as Event['type'] | '',
    title: '',
    timeSlot: '',
    description: '',
    vocacionados: '',
    cultoDay: '' as 'quinta' | 'domingo_manha' | 'domingo_noite' | '',
  });

  // Populate form when editing
  useEffect(() => {
    if (editingEvent) {
      setFormData({
        type: editingEvent.type,
        title: editingEvent.title,
        timeSlot: editingEvent.timeSlot,
        description: editingEvent.description || '',
        vocacionados: editingEvent.vocacionados || '',
        cultoDay: editingEvent.cultoDay || '',
      });
    } else {
      setFormData({
        type: '',
        title: '',
        timeSlot: '',
        description: '',
        vocacionados: '',
        cultoDay: '',
      });
    }
  }, [editingEvent, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // timeSlot is not required for 'escala' type
    const isTimeSlotRequired = formData.type !== 'escala';
    if (!formData.type || !formData.cultoDay || (isTimeSlotRequired && !formData.timeSlot)) {
      return;
    }

    if (editingEvent && onUpdateEvent) {
      // Update existing event
      onUpdateEvent({
        ...editingEvent,
        type: formData.type,
        title: formData.title,
        timeSlot: formData.timeSlot,
        description: formData.description,
        vocacionados: formData.vocacionados,
        cultoDay: formData.cultoDay,
      });
    } else {
      // Add new event
      onAddEvent({
        type: formData.type,
        title: formData.title,
        timeSlot: formData.timeSlot,
        date: selectedDate,
        description: formData.description,
        vocacionados: formData.vocacionados,
        cultoDay: formData.cultoDay,
      });
    }

    // Reset form
    setFormData({
      type: '',
      title: '',
      timeSlot: '',
      description: '',
      vocacionados: '',
      cultoDay: '',
    });
    
    onOpenChange(false);
  };

  const handleClose = () => {
    setFormData({
      type: '',
      title: '',
      timeSlot: '',
      description: '',
      vocacionados: '',
      cultoDay: '',
    });
    onOpenChange(false);
  };

  const availableTimeSlots = formData.cultoDay ? timeSlotsByDay[formData.cultoDay] : [];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {editingEvent ? 'Editar Evento' : 'Adicionar Novo Evento'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cultoDay">Dia do Culto</Label>
              <Select 
                value={formData.cultoDay} 
                onValueChange={(value: 'quinta' | 'domingo_manha' | 'domingo_noite') => {
                  setFormData({ ...formData, cultoDay: value, timeSlot: '' });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o dia do culto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quinta">Quinta-feira</SelectItem>
                  <SelectItem value="domingo_manha">Domingo - Manhã</SelectItem>
                  <SelectItem value="domingo_noite">Domingo - Noite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Cronograma</Label>
              <Select
                value={formData.type} 
                onValueChange={(value: Event['type']) => 
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abertura">🙏 Abertura</SelectItem>
                  <SelectItem value="louvor">🎵 Louvor</SelectItem>
                  <SelectItem value="oferta">💰 Oferta</SelectItem>
                  <SelectItem value="conexao">🤝 Conexão</SelectItem>
                  <SelectItem value="pregacao">📖 Pregação</SelectItem>
                  <SelectItem value="apelo">🙌 Apelo+Ministração Final</SelectItem>
                  <SelectItem value="bencao">✨ Benção Apostólica</SelectItem>
                  <SelectItem value="escala">👥 Escala de Vocacionados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type !== 'escala' && (
              <div className="space-y-2">
                <Label htmlFor="timeSlot">Horário</Label>
                <Select 
                  value={formData.timeSlot} 
                  onValueChange={(value) => 
                    setFormData({ ...formData, timeSlot: value })
                  }
                  disabled={!formData.cultoDay}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.cultoDay ? "Selecione o horário" : "Selecione primeiro o dia do culto"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeSlots.map((slot) => (
                      <SelectItem key={slot.id} value={slot.id}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="vocacionados">Vocacionados</Label>
              <Input
                id="vocacionados"
                value={formData.vocacionados}
                onChange={(e) => setFormData({ ...formData, vocacionados: e.target.value })}
                placeholder="Ex: João Silva, Maria Santos..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (Opcional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Adicione detalhes sobre o evento..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-spiritual hover:bg-gradient-divine"
              disabled={!formData.type || !formData.cultoDay || (formData.type !== 'escala' && !formData.timeSlot)}
            >
              {editingEvent ? 'Salvar Alterações' : 'Adicionar Evento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};