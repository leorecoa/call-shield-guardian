
import { AppHeader } from "@/components/AppHeader";
import { BlockSettings } from "@/components/BlockSettings";
import { CallHistory } from "@/components/CallHistory";
import { CustomListManager } from "@/components/CustomListManager";
import { Shield } from "@/components/Shield";
import { StatsCard } from "@/components/StatsCard";
import { TestControls } from "@/components/TestControls";
import { useCallBlocker } from "@/hooks/useCallBlocker";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { Settings, ShieldAlert, ListFilter, BarChart2 } from "lucide-react";
import { ConfigGuide } from "@/components/ConfigGuide";

const Index = () => {
  const {
    blockedCalls,
    stats,
    settings,
    customList,
    isActive,
    hasPermissions,
    updateSettings,
    toggleActive,
    addCustomEntry,
    removeCustomEntry,
    clearBlockedCalls,
    simulateIncomingCall
  } = useCallBlocker();
  
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <div className="container max-w-md mx-auto px-4 pb-16 pt-4">
        <AppHeader isActive={isActive} onToggleActive={toggleActive} />
        
        <div className="flex flex-col items-center justify-center my-5">
          <Shield active={isActive} size="xl" />
          <div className="mt-6 flex items-center gap-3 justify-center">
            <span className="text-sm text-muted-foreground">OFF</span>
            <Switch 
              checked={isActive}
              onCheckedChange={toggleActive}
              className={isActive ? "bg-neonBlue" : ""}
            />
            <span className="text-sm text-muted-foreground">ON</span>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-4">
            {isActive
              ? `${stats.totalBlocked} chamadas bloqueadas`
              : "Ative para bloquear chamadas indesejadas"}
          </p>
          <div className="mt-3">
            <ConfigGuide />
          </div>
        </div>
        
        <Tabs defaultValue="history">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="history" className="text-xs">
              <BarChart2 className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Histórico</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              <Settings className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Config.</span>
            </TabsTrigger>
            <TabsTrigger value="lists" className="text-xs">
              <ListFilter className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Listas</span>
            </TabsTrigger>
            <TabsTrigger value="test" className="text-xs">
              <ShieldAlert className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Teste</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="history" className="space-y-4 mt-3">
            <StatsCard stats={stats} />
            <CallHistory 
              calls={blockedCalls}
              onClearHistory={clearBlockedCalls}
            />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4 mt-3">
            <BlockSettings
              settings={settings}
              onUpdateSettings={updateSettings}
              isActive={isActive}
              onToggleActive={toggleActive}
              hasPermissions={hasPermissions}
            />
          </TabsContent>
          
          <TabsContent value="lists" className="space-y-4 mt-3">
            <CustomListManager
              entries={customList}
              onAddEntry={addCustomEntry}
              onRemoveEntry={removeCustomEntry}
            />
          </TabsContent>
          
          <TabsContent value="test" className="space-y-4 mt-3">
            <TestControls onSimulateCall={simulateIncomingCall} />
          </TabsContent>
        </Tabs>
      </div>
    );
  }
  
  return (
    <div className="container max-w-6xl mx-auto px-4 pb-16 pt-6">
      <AppHeader isActive={isActive} onToggleActive={toggleActive} />
      
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-5 lg:col-span-4">
          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center">
            <Shield active={isActive} size="xl" />
            <div className="mt-6 flex items-center gap-4 justify-center">
              <span className="text-muted-foreground">OFF</span>
              <Switch 
                checked={isActive}
                onCheckedChange={toggleActive}
                className={isActive ? "bg-neonBlue" : ""}
              />
              <span className="text-muted-foreground">ON</span>
            </div>
            <p className="text-muted-foreground text-center mt-4">
              {isActive
                ? `${stats.totalBlocked} chamadas indesejadas bloqueadas`
                : "Ative para bloquear chamadas VoIP indesejadas"}
            </p>
            <div className="mt-4">
              <ConfigGuide />
            </div>
          </div>
          
          <div className="mt-6 space-y-6">
            <StatsCard stats={stats} />
            <BlockSettings
              settings={settings}
              onUpdateSettings={updateSettings}
              isActive={isActive}
              onToggleActive={toggleActive}
              hasPermissions={hasPermissions}
            />
            <TestControls onSimulateCall={simulateIncomingCall} />
          </div>
        </div>
        
        <div className="md:col-span-7 lg:col-span-8 space-y-6">
          <CallHistory 
            calls={blockedCalls}
            onClearHistory={clearBlockedCalls}
          />
          <CustomListManager
            entries={customList}
            onAddEntry={addCustomEntry}
            onRemoveEntry={removeCustomEntry}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
