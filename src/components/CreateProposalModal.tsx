import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Shield, Globe, X } from "lucide-react";
import { format } from "date-fns";
import { useContract } from "@/hooks/useContract";
import { toast } from "sonner";

interface CreateProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (proposalData: any) => void;
  selectedChain: string;
}

export function CreateProposalModal({ isOpen, onClose, onSubmit, selectedChain }: CreateProposalModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [privacy, setPrivacy] = useState("private");
  const [votingDuration, setVotingDuration] = useState("");
  const [endDate, setEndDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createProposal, isPending: isLoading, error } = useContract();

  // 只使用测试网络
  const targetChain = "sepolia";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      // Calculate duration in seconds
      const durationMap: Record<string, number> = {
        "3days": 3 * 24 * 60 * 60,
        "7days": 7 * 24 * 60 * 60,
        "14days": 14 * 24 * 60 * 60,
        "30days": 30 * 24 * 60 * 60,
      };
      
      const duration = durationMap[votingDuration] || 7 * 24 * 60 * 60; // Default to 7 days
      
      // Generate proposal hash (in real app, this would be a proper hash)
      const proposalHash = `0x${Math.random().toString(16).substr(2, 8)}${Math.random().toString(16).substr(2, 8)}`;
      
      // 使用Sepolia测试网络
      const chainId = 11155111; // Sepolia chain ID
      
      // Create proposal on blockchain
      await createProposal(title, description, proposalHash, duration, chainId);
      
      const proposalData = {
        title,
        description,
        category,
        privacy,
        votingDuration,
        endDate,
        chain: targetChain,
        createdAt: new Date(),
        proposalHash,
        chainId,
      };

      toast.success("Proposal created successfully!");
      onSubmit(proposalData);
      
      // Reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setPrivacy("private");
      setVotingDuration("");
      setEndDate(undefined);
      onClose();
    } catch (err) {
      console.error("Error creating proposal:", err);
      toast.error("Failed to create proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-card border-cyber-purple/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Globe className="w-6 h-6 text-cyber-cyan" />
            Create New Proposal
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Submit a new governance proposal for cross-chain voting with privacy protection
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground font-medium">
              Proposal Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a clear, descriptive title"
              required
              className="bg-glass-bg border-cyber-purple/30 focus:border-cyber-purple"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground font-medium">
              Description *
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of your proposal, including objectives, implementation details, and expected outcomes..."
              required
              rows={6}
              className="bg-glass-bg border-cyber-purple/30 focus:border-cyber-purple resize-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="bg-glass-bg border-cyber-purple/30">
                <SelectValue placeholder="Select proposal category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="protocol">Protocol Upgrade</SelectItem>
                <SelectItem value="treasury">Treasury Management</SelectItem>
                <SelectItem value="security">Security Enhancement</SelectItem>
                <SelectItem value="governance">Governance Change</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-3">
            <Label className="text-foreground font-medium">Privacy Settings</Label>
            <RadioGroup value={privacy} onValueChange={setPrivacy}>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-cyber-purple/30 bg-glass-bg/50">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="flex items-center gap-2 cursor-pointer">
                  <Shield className="w-4 h-4 text-cyber-purple" />
                  <span className="text-foreground">Private Voting</span>
                  <Badge variant="outline" className="border-cyber-purple/50 text-cyber-purple text-xs">
                    Recommended
                  </Badge>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-muted bg-glass-bg/30">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="flex items-center gap-2 cursor-pointer">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">Public Voting</span>
                </Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-muted-foreground">
              Private voting uses zero-knowledge proofs to ensure vote confidentiality while maintaining verifiability.
            </p>
          </div>

          {/* Target Chain - Only Sepolia Testnet */}
          <div className="space-y-3">
            <Label className="text-foreground font-medium">Target Network *</Label>
            <div className="p-4 rounded-lg border border-cyber-cyan bg-cyber-cyan/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-400/10 flex items-center justify-center">
                    <span className="text-lg text-blue-400">Ξ</span>
                  </div>
                  <div>
                    <span className="text-foreground font-medium">Sepolia Testnet</span>
                    <p className="text-sm text-muted-foreground">Ethereum Test Network</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs bg-cyber-green/20 text-cyber-green border-cyber-green/30">
                  Selected
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Proposals are created on the Sepolia testnet for secure testing and development.
            </p>
          </div>

          {/* Voting Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Voting Duration *</Label>
              <Select value={votingDuration} onValueChange={setVotingDuration} required>
                <SelectTrigger className="bg-glass-bg border-cyber-purple/30">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3days">3 Days</SelectItem>
                  <SelectItem value="7days">7 Days</SelectItem>
                  <SelectItem value="14days">14 Days</SelectItem>
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-medium">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-glass-bg border-cyber-purple/30"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>


          {/* Submit Buttons */}
          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="neon"
              className="flex-1"
              disabled={!title || !description || !category || !votingDuration || isSubmitting || isLoading}
            >
              {isSubmitting ? "Creating..." : "Create Proposal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}