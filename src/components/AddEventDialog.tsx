import { useState } from "react";
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
  selectedDate: string;
  timeSlots: { id: string; label: string }[];
}

export const AddEventDialog = ({
  isOpen,
  onOpenChange,
  onAddEvent,
  selectedDate,
  timeSlots,
}: AddEventDialogProps) => {
  const [formData, setFormData] = useState({
    type: '' as Event['type'] | '',
    title: '',
    timeSlot: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.title || !formData.timeSlot) {
      return;
    }

    onAddEvent({
      type: formData.type,
      title: formData.title,
      timeSlot: formData.timeSlot,
      date: selectedDate,
      description: formData.description,
    });

    // Reset form
    setFormData({
      type: '',
      title: '',
      timeSlot: '',
      description: '',
    });
    
    onOpenChange(false);
  };

  const handleClose = () => {
    setFormData({
      type: '',
      title: '',
      timeSlot: '',
      description: '',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-spiritual bg-clip-text text-transparent">
            Adicionar Novo Evento
          </DialogTitle>
          <DialogDescription>
            Preencha as informações para criar um novo evento na programação.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Evento</Label>
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
                  <SelectItem value="oferta">💰 Oferta</SelectItem>
                  <SelectItem value="louvor">🎵 Louvor</SelectItem>
                  <SelectItem value="pregacao">📖 Pregação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título do Evento</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Louvor de Abertura, Pregação sobre Fé..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeSlot">Horário</Label>
              <Select 
                value={formData.timeSlot} 
                onValueChange={(value) => 
                  setFormData({ ...formData, timeSlot: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.id} value={slot.id}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              disabled={!formData.type || !formData.title || !formData.timeSlot}
            >
              Adicionar Evento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};