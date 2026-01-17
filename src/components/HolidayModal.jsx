import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, MapPin, Info } from "lucide-react";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import holidayJsonData from "../data/holiday.json";

const HolidayModal = ({ isOpen, onClose }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [holidays, setHolidays] = useState({ fixed: [], floating: [] });

  useEffect(() => {
    const yearData = holidayJsonData.holiday_data?.find(
      (item) => item.year === currentYear
    );
    if (yearData) {
      setHolidays({
        fixed: yearData.fixed_holidays || [],
        floating: yearData.restricted_holidays || [],
      });
    } else {
        setHolidays({ fixed: [], floating: [] });
    }
  }, [currentYear]);

  const HolidayCard = ({ holiday, type }) => (
    <div className="flex items-center justify-between p-4 mb-3 bg-card border border-border/50 rounded-xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 group">
      <div className="flex items-start gap-4">
        <div className={`
          flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center border 
          ${type === 'fixed' 
            ? 'bg-blue-50 border-blue-100 text-blue-700' 
            : 'bg-purple-50 border-purple-100 text-purple-700'}
        `}>
          <span className="text-[10px] font-bold uppercase tracking-wider leading-none">
            {dayjs(holiday.date).format("MMM")}
          </span>
          <span className="text-xl font-black leading-none mt-0.5">
            {dayjs(holiday.date).format("DD")}
          </span>
        </div>
        
        <div>
          <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
            {holiday.name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-[10px] font-medium h-5 px-1.5 bg-muted text-muted-foreground">
              {holiday.day}
            </Badge>
            {type === 'floating' && (
              <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                <Info className="w-3 h-3" /> Optional
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden bg-background border-border shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/50 bg-muted/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <CalendarIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-foreground">
                  Holiday Calendar
                </DialogTitle>
                <DialogDescription className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">
                  Year {currentYear} Official Schedule
                </DialogDescription>
              </div>
            </div>
            
            <div className="flex gap-1 bg-muted p-1 rounded-lg">
               {[currentYear - 1, currentYear, currentYear + 1].map(year => (
                   <button
                     key={year}
                     onClick={() => setCurrentYear(year)}
                     className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                         year === currentYear 
                         ? 'bg-background text-foreground shadow-sm' 
                         : 'text-muted-foreground hover:text-foreground'
                     }`}
                   >
                       {year}
                   </button>
               ))}
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 pt-2">
          <Tabs defaultValue="fixed" className="w-full">
            <TabsList className="w-full h-12 bg-muted/50 p-1 mb-6 rounded-xl">
              <TabsTrigger 
                value="fixed" 
                className="flex-1 h-full rounded-lg text-xs font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                Public Holidays ({holidays.fixed.length})
              </TabsTrigger>
              <TabsTrigger 
                value="floating" 
                className="flex-1 h-full rounded-lg text-xs font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-purple-600 data-[state=active]:shadow-sm transition-all"
              >
                Restricted / Floating ({holidays.floating.length})
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[400px] pr-4 -mr-4">
              <TabsContent value="fixed" className="mt-0 space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {holidays.fixed.length > 0 ? (
                    holidays.fixed.map((holiday, idx) => (
                        <HolidayCard key={idx} holiday={holiday} type="fixed" />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                        <CalendarIcon className="w-12 h-12 mb-3 opacity-20" />
                        <p className="text-sm font-medium">No fixed holidays data available</p>
                    </div>
                )}
              </TabsContent>
              
              <TabsContent value="floating" className="mt-0 space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-purple-50/50 border border-purple-100 rounded-lg p-3 mb-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-purple-800 leading-relaxed">
                        Restricted holidays are optional. Employees may choose a limited number of these days as leave according to company policy.
                    </p>
                </div>
                {holidays.floating.length > 0 ? (
                    holidays.floating.map((holiday, idx) => (
                        <HolidayCard key={idx} holiday={holiday} type="floating" />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                        <CalendarIcon className="w-12 h-12 mb-3 opacity-20" />
                        <p className="text-sm font-medium">No restricted holidays data available</p>
                    </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HolidayModal;
