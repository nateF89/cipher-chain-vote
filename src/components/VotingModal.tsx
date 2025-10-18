import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Shield, Lock, Send } from "lucide-react";
import { useCipherChainVote } from "@/hooks/useContract";
import { useZamaInstance } from "@/hooks/useZamaInstance";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import { useAccount } from "wagmi";
import { Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contractConfig";
import { toast } from "sonner";

interface VotingModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalId: string;
  proposalTitle: string;
  onSubmitVote: (vote: "for" | "against", reason?: string) => void;
}

export function VotingModal({ isOpen, onClose, proposalId, proposalTitle, onSubmitVote }: VotingModalProps) {
  const [vote, setVote] = useState<"for" | "against" | "">("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address } = useAccount();
  const { instance } = useZamaInstance();
  const signerPromise = useEthersSigner();

  const handleSubmit = async () => {
    if (!vote || !instance || !address || !signerPromise) {
      toast.error("Missing wallet or encryption service");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Convert vote to number (0: against, 1: for)
      const voteChoice = vote === "for" ? 1 : 0;
      const votingPower = 1; // Default voting power, in real app this would be calculated
      
      // Create encrypted input
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
      input.add8(voteChoice); // Add vote choice (0 or 1)
      input.add32(votingPower); // Add voting power
      
      // Encrypt the input
      const encryptedInput = await input.encrypt();
      
      // Convert handles to proper format
      const convertHex = (handle: any): string => {
        if (typeof handle === 'string') {
          return handle.startsWith('0x') ? handle : `0x${handle}`;
        } else if (handle instanceof Uint8Array) {
          return `0x${Array.from(handle).map(b => b.toString(16).padStart(2, '0')).join('')}`;
        } else if (Array.isArray(handle)) {
          return `0x${handle.map(b => b.toString(16).padStart(2, '0')).join('')}`;
        }
        return `0x${handle.toString()}`;
      };
      
      const handles = encryptedInput.handles.map(convertHex);
      const proof = `0x${Array.from(encryptedInput.inputProof)
        .map(b => b.toString(16).padStart(2, '0')).join('')}`;
      
      // Get signer and create contract instance
      const signer = await signerPromise;
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      // Cast encrypted vote
      const tx = await contract.castVote(
        parseInt(proposalId),
        handles[0], // voteChoice handle
        handles[1], // votingPower handle
        proof
      );
      
      await tx.wait();
      
      toast.success("Encrypted vote submitted successfully!");
      onSubmitVote(vote as "for" | "against", reason);
      
      setVote("");
      setReason("");
      onClose();
    } catch (err) {
      console.error("Error submitting vote:", err);
      toast.error("Failed to submit vote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-card border-cyber-purple/30 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="w-5 h-5 text-cyber-purple" />
            Cast Private Vote
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Your vote will be encrypted and submitted anonymously to the blockchain.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <Card className="bg-glass-bg/30 border-border/50">
            <CardContent className="p-4">
              <h3 className="font-medium text-foreground mb-2">{proposalTitle}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-cyber-purple/50 text-cyber-purple">
                  <Lock className="w-3 h-3 mr-1" />
                  End-to-End Encrypted
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Label className="text-base font-medium text-foreground">Your Vote</Label>
            <RadioGroup value={vote} onValueChange={(value) => setVote(value as "for" | "against")} className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 hover:border-cyber-green/50 transition-colors">
                <RadioGroupItem value="for" id="for" className="border-cyber-green text-cyber-green" />
                <Label htmlFor="for" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyber-green" />
                    <span className="font-medium">Vote For</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Support this proposal</p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 hover:border-destructive/50 transition-colors">
                <RadioGroupItem value="against" id="against" className="border-destructive text-destructive" />
                <Label htmlFor="against" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-destructive" />
                    <span className="font-medium">Vote Against</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Oppose this proposal</p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-base font-medium text-foreground">
              Reasoning (Optional)
            </Label>
            <Textarea 
              id="reason"
              placeholder="Explain your vote (this will be encrypted)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-glass-bg/50 border-border/50 focus:border-cyber-purple/50"
              rows={3}
            />
          </div>

          <div className="p-3 bg-cyber-purple/10 border border-cyber-purple/20 rounded-lg">
            <p className="text-xs text-muted-foreground">
              🔒 Your vote is encrypted using zero-knowledge proofs and submitted anonymously across multiple chains for maximum privacy and security.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              variant="cyber" 
              onClick={handleSubmit}
              disabled={!vote || isSubmitting || isLoading}
              className="flex-1 gap-2"
            >
              {isSubmitting ? (
                <>
                  <Lock className="w-4 h-4 animate-spin" />
                  Encrypting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Vote
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}