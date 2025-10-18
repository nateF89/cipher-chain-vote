import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Network } from "lucide-react";

interface ChainSelectorProps {
  selectedChain: string;
  onChainSelect: (chainId: string) => void;
}

export function ChainSelector({ selectedChain, onChainSelect }: ChainSelectorProps) {
  // 只显示主网测试网络
  const mainnetChain = {
    id: "sepolia",
    name: "Sepolia Testnet",
    icon: "Ξ",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10"
  };

  return (
    <Button variant="glow" className="gap-2 min-w-[160px] cursor-default">
      <span className={`text-lg ${mainnetChain.color}`}>{mainnetChain.icon}</span>
      <span>{mainnetChain.name}</span>
      <Badge variant="secondary" className="text-xs bg-cyber-green/20 text-cyber-green border-cyber-green/30">
        <Network className="w-3 h-3 mr-1" />
        Main Testnet
      </Badge>
    </Button>
  );
}