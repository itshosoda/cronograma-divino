import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Plus, Edit } from "lucide-react";
import { AddEventDialog } from "@/components/AddEventDialog";

export interface Event {
  id: string;
  type: 'abertura' | 'oferta' | 'louvor' | 'pregacao';
  title: string;
  timeSlot: string;
  date: string;
  description?: string;
}

const timeSlots = [
  { id: '19:00-20:30', label: '19:00 - 20:30' },
  { id: '20:30-21:00', label: '20:30 - 21:00' },
  { id: '21:00-21:30', label: '21:00 - 21:30' },
  { id: '21:31-22:00', label: '21:31 - 22:00' },
];

const eventTypes = {
  abertura: { label: 'Abertura', color: 'bg-spiritual-blue text-white' },
  oferta: { label: 'Oferta', color: 'bg-divine-gold text-foreground' },
  louvor: { label: 'Louvor', color: 'bg-holy-purple text-white' },
  pregacao: { label: 'Pregação', color: 'bg-gradient-spiritual text-white' },
};

const ScheduleTable = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Generate 30 days starting from today
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();
  const currentDate = dates[selectedDate];

  const getEventsForSlot = (timeSlot: string, date: string) => {
    return events.filter(event => 
      event.timeSlot === timeSlot && 
      event.date === date
    );
  };

  const addEvent = (newEvent: Omit<Event, 'id'>) => {
    const event: Event = {
      ...newEvent,
      id: Date.now().toString(),
    };
    setEvents([...events, event]);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-celestial p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-holy">
          <CardHeader className="text-center bg-gradient-spiritual text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
              <CalendarDays className="h-8 w-8" />
              Programação de Cultos
            </CardTitle>
            <p className="text-white/90 text-lg">
              Organize sua agenda espiritual com facilidade
            </p>
          </CardHeader>
        </Card>

        {/* Date Navigation */}
        <Card className="shadow-divine">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-foreground">
                Selecionar Data
              </h3>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-spiritual hover:bg-gradient-divine transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Evento
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-2">
              {dates.map((date, index) => (
                <Button
                  key={index}
                  variant={selectedDate === index ? "default" : "outline"}
                  onClick={() => setSelectedDate(index)}
                  className={`p-3 h-auto flex flex-col items-center ${
                    selectedDate === index 
                      ? 'bg-gradient-spiritual text-white shadow-holy' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="text-sm font-medium">
                    {date.toLocaleDateString('pt-BR', { day: '2-digit' })}
                  </div>
                  <div className="text-xs opacity-75">
                    {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schedule Table */}
        <Card className="shadow-holy">
          <CardHeader className="bg-gradient-divine text-foreground">
            <CardTitle className="flex items-center gap-3">
              <Clock className="h-6 w-6" />
              {formatDate(currentDate)}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-semibold">Horário</th>
                    <th className="text-left p-4 font-semibold">Eventos</th>
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot) => {
                    const slotEvents = getEventsForSlot(
                      slot.id, 
                      currentDate.toISOString().split('T')[0]
                    );
                    
                    return (
                      <tr key={slot.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium text-muted-foreground">
                          {slot.label}
                        </td>
                        <td className="p-4">
                          {slotEvents.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {slotEvents.map((event) => (
                                <Badge 
                                  key={event.id} 
                                  className={`${eventTypes[event.type].color} px-3 py-2 text-sm font-medium`}
                                >
                                  <div className="flex items-center gap-1">
                                    {eventTypes[event.type].label}: {event.title}
                                    <Edit className="h-3 w-3 ml-1 opacity-70" />
                                  </div>
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">
                              Nenhum evento agendado
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddEventDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddEvent={addEvent}
        selectedDate={currentDate.toISOString().split('T')[0]}
        timeSlots={timeSlots}
      />
    </div>
  );
};

export default ScheduleTable;