import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Network } from "lucide-react";

const chains = [
  { 
    id: "ethereum", 
    name: "Ethereum", 
    icon: "Ξ", 
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    proposals: 12 
  },
  { 
    id: "polygon", 
    name: "Polygon", 
    icon: "◇", 
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    proposals: 8 
  },
  { 
    id: "arbitrum", 
    name: "Arbitrum", 
    icon: "▲", 
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    proposals: 5 
  },
  { 
    id: "optimism", 
    name: "Optimism", 
    icon: "●", 
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    proposals: 3 
  },
];

interface ChainSelectorProps {
  selectedChain: string;
  onChainSelect: (chainId: string) => void;
}

export function ChainSelector({ selectedChain, onChainSelect }: ChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = chains.find(chain => chain.id === selectedChain) || chains[0];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="glow" className="gap-2 min-w-[140px]">
          <span className={`text-lg ${selected.color}`}>{selected.icon}</span>
          <span>{selected.name}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 bg-gradient-card border-cyber-purple/30 backdrop-blur-xl">
        <div className="p-3 border-b border-border/50">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Network className="w-4 h-4 text-cyber-cyan" />
            Select Network
          </div>
        </div>
        <div className="p-2 space-y-2">
          {chains.map((chain) => (
            <Card 
              key={chain.id}
              className={`cursor-pointer transition-all duration-200 ${
                chain.id === selectedChain 
                  ? 'bg-cyber-purple/20 border-cyber-purple/50' 
                  : 'bg-glass-bg/30 border-border/30 hover:border-cyber-purple/40'
              }`}
              onClick={() => {
                onChainSelect(chain.id);
                setIsOpen(false);
              }}
            >
              <CardContent className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${chain.bgColor} flex items-center justify-center`}>
                    <span className={`text-sm font-bold ${chain.color}`}>{chain.icon}</span>
                  </div>
                  <span className="font-medium text-foreground">{chain.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {chain.proposals} proposals
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="p-3 border-t border-border/50 bg-glass-bg/30">
          <p className="text-xs text-muted-foreground text-center">
            🔄 Cross-chain governance enabled
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}