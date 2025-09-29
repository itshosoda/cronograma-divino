import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { CalendarDays, Clock, Plus, Edit, Trash2 } from "lucide-react";
import { AddEventDialog } from "@/components/AddEventDialog";
import logoIgreja from "@/assets/logo-igreja.png";

export interface Event {
  id: string;
  type: 'abertura' | 'louvor' | 'oferta' | 'conexao' | 'pregacao' | 'apelo' | 'bencao';
  title: string;
  timeSlot: string;
  date: string;
  description?: string;
  vocacionados?: string;
  cultoDay?: 'quinta' | 'domingo_manha' | 'domingo_noite';
}

const timeSlots = {
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

const eventTypes = {
  abertura: { label: 'Abertura', color: 'bg-spiritual-blue text-white' },
  louvor: { label: 'Louvor', color: 'bg-holy-purple text-white' },
  oferta: { label: 'Oferta', color: 'bg-divine-gold text-white' },
  conexao: { label: 'Conexão', color: 'bg-gradient-spiritual text-white' },
  pregacao: { label: 'Pregação', color: 'bg-gradient-divine text-white' },
  apelo: { label: 'Apelo+Ministração Final', color: 'bg-spiritual-blue text-white' },
  bencao: { label: 'Benção Apostólica', color: 'bg-holy-purple text-white' },
};

const ScheduleTable = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  // Generate 30 days starting from selected month and year, organized by weeks (Monday to Sunday)
  const generateDates = () => {
    const dates = [];
    
    // Get first day of the selected month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    
    // Find the Monday of the week that contains the first day of the month
    const dayOfWeek = firstDayOfMonth.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday = 0, so we need -6
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(firstDayOfMonth.getDate() + mondayOffset);
    
    // Generate 42 days (6 weeks) from the Monday to show full calendar grid
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
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

  const updateEvent = (updatedEvent: Event) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
    setEditingEvent(null);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsAddDialogOpen(true);
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
          <CardHeader className="bg-gradient-spiritual text-white rounded-t-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-8 w-8" />
                <CardTitle className="text-3xl font-bold">
                  Programação de Cultos
                </CardTitle>
              </div>
              <div className="flex-shrink-0">
                <img 
                  src={logoIgreja} 
                  alt="Logo Igreja Metodista Wesleyana" 
                  className="h-16 w-auto"
                />
              </div>
            </div>
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
            
            {/* Month/Year Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="month" className="text-sm font-medium">Mês:</label>
                  <select 
                    id="month"
                    value={currentMonth} 
                    onChange={(e) => {
                      setCurrentMonth(Number(e.target.value));
                      setSelectedDate(0);
                    }}
                    className="px-3 py-1 border border-border rounded-md bg-card text-card-foreground"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>
                        {new Date(2024, i, 1).toLocaleDateString('pt-BR', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <label htmlFor="year" className="text-sm font-medium">Ano:</label>
                  <select 
                    id="year"
                    value={currentYear} 
                    onChange={(e) => {
                      setCurrentYear(Number(e.target.value));
                      setSelectedDate(0);
                    }}
                    className="px-3 py-1 border border-border rounded-md bg-card text-card-foreground"
                  >
                    {Array.from({ length: 11 }, (_, i) => (
                      <option key={i} value={2020 + i}>
                        {2020 + i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <Button 
                onClick={() => {
                  const today = new Date();
                  setCurrentYear(today.getFullYear());
                  setCurrentMonth(today.getMonth());
                  setSelectedDate(0);
                }}
                variant="outline"
                className="text-sm"
              >
                Hoje
              </Button>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {dates.map((date, index) => {
                const isCurrentMonth = date.getMonth() === currentMonth;
                const isToday = date.toDateString() === new Date().toDateString();
                
                return (
                  <Button
                    key={index}
                    variant={selectedDate === index ? "default" : "outline"}
                    onClick={() => setSelectedDate(index)}
                    className={`p-3 h-auto flex flex-col items-center ${
                      selectedDate === index 
                        ? 'bg-gradient-spiritual text-white shadow-holy' 
                        : isCurrentMonth 
                          ? 'hover:bg-muted' 
                          : 'text-muted-foreground/50 hover:bg-muted/50'
                    } ${isToday && selectedDate !== index ? 'ring-2 ring-primary' : ''}`}
                  >
                    <div className="text-sm font-medium">
                      {date.toLocaleDateString('pt-BR', { day: '2-digit' })}
                    </div>
                    <div className="text-xs opacity-75">
                      {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </div>
                    <div className="text-xs opacity-60 mt-1">
                      {date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })}
                    </div>
                  </Button>
                );
              })}
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
              {/* Quinta-feira */}
              <div className="border-b">
                <div className="bg-muted/30 px-4 py-2">
                  <h4 className="font-semibold text-foreground">Quinta-feira</h4>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-semibold">Horário</th>
                      <th className="text-left p-4 font-semibold">Eventos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.quinta.map((slot) => {
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
                                   <div 
                                     key={event.id} 
                                     className={`${eventTypes[event.type].color} px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2`}
                                   >
                                     <div className="flex flex-col">
                                       <span>
                                         {eventTypes[event.type].label}: {event.title}
                                       </span>
                                       {event.vocacionados && (
                                         <span className="text-xs opacity-90 mt-1">
                                           {event.vocacionados}
                                         </span>
                                       )}
                                     </div>
                                     <div className="flex items-center gap-1">
                                       <Button
                                         size="sm"
                                         variant="ghost"
                                         className="h-6 w-6 p-0 hover:bg-white/20"
                                         onClick={() => handleEditEvent(event)}
                                       >
                                         <Edit className="h-3 w-3" />
                                       </Button>
                                       <Button
                                         size="sm"
                                         variant="ghost"
                                         className="h-6 w-6 p-0 hover:bg-red-500/20"
                                         onClick={() => deleteEvent(event.id)}
                                       >
                                         <Trash2 className="h-3 w-3" />
                                       </Button>
                                     </div>
                                   </div>
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

              {/* Domingo Manhã */}
              <div className="border-b">
                <div className="bg-muted/30 px-4 py-2">
                  <h4 className="font-semibold text-foreground">Domingo - Manhã</h4>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-semibold">Horário</th>
                      <th className="text-left p-4 font-semibold">Eventos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.domingo_manha.map((slot) => {
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
                                   <div 
                                     key={event.id} 
                                     className={`${eventTypes[event.type].color} px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2`}
                                   >
                                     <div className="flex flex-col">
                                       <span>
                                         {eventTypes[event.type].label}: {event.title}
                                       </span>
                                       {event.vocacionados && (
                                         <span className="text-xs opacity-90 mt-1">
                                           {event.vocacionados}
                                         </span>
                                       )}
                                     </div>
                                     <div className="flex items-center gap-1">
                                       <Button
                                         size="sm"
                                         variant="ghost"
                                         className="h-6 w-6 p-0 hover:bg-white/20"
                                         onClick={() => handleEditEvent(event)}
                                       >
                                         <Edit className="h-3 w-3" />
                                       </Button>
                                       <Button
                                         size="sm"
                                         variant="ghost"
                                         className="h-6 w-6 p-0 hover:bg-red-500/20"
                                         onClick={() => deleteEvent(event.id)}
                                       >
                                         <Trash2 className="h-3 w-3" />
                                       </Button>
                                     </div>
                                   </div>
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

              {/* Domingo Noite */}
              <div>
                <div className="bg-muted/30 px-4 py-2">
                  <h4 className="font-semibold text-foreground">Domingo - Noite</h4>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-semibold">Horário</th>
                      <th className="text-left p-4 font-semibold">Eventos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.domingo_noite.map((slot) => {
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
                                   <div 
                                     key={event.id} 
                                     className={`${eventTypes[event.type].color} px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2`}
                                   >
                                     <div className="flex flex-col">
                                       <span>
                                         {eventTypes[event.type].label}: {event.title}
                                       </span>
                                       {event.vocacionados && (
                                         <span className="text-xs opacity-90 mt-1">
                                           {event.vocacionados}
                                         </span>
                                       )}
                                     </div>
                                     <div className="flex items-center gap-1">
                                       <Button
                                         size="sm"
                                         variant="ghost"
                                         className="h-6 w-6 p-0 hover:bg-white/20"
                                         onClick={() => handleEditEvent(event)}
                                       >
                                         <Edit className="h-3 w-3" />
                                       </Button>
                                       <Button
                                         size="sm"
                                         variant="ghost"
                                         className="h-6 w-6 p-0 hover:bg-red-500/20"
                                         onClick={() => deleteEvent(event.id)}
                                       >
                                         <Trash2 className="h-3 w-3" />
                                       </Button>
                                     </div>
                                   </div>
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
            </div>
          </CardContent>
        </Card>
      </div>

      <AddEventDialog
        isOpen={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setEditingEvent(null);
        }}
        onAddEvent={addEvent}
        onUpdateEvent={updateEvent}
        editingEvent={editingEvent}
        selectedDate={currentDate.toISOString().split('T')[0]}
      />
    </div>
  );
};

export default ScheduleTable;
