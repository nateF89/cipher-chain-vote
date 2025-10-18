import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAccount } from "wagmi";
import { useZamaInstance } from "@/hooks/useZamaInstance";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import { Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contractConfig";
import { toast } from "sonner";

interface VotingModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalId: string;
  proposalTitle: string;
  onSubmitVote: (vote: "yes" | "no" | "abstain", reason?: string) => void;
}

export function VotingModal({ isOpen, onClose, proposalId, proposalTitle, onSubmitVote }: VotingModalProps) {
  const [vote, setVote] = useState<"yes" | "no" | "abstain" | "">("");
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
      const voteChoice = vote === "yes" ? 1 : vote === "no" ? 2 : 3;

      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
      input.add32(BigInt(voteChoice));
      
      const encryptedInput = await input.encrypt();
      
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
      
      const signer = await signerPromise;
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const tx = await contract.castVote(
        parseInt(proposalId),
        handles[0], // voteChoice handle
        proof
      );
      
      await tx.wait();
      
      toast.success("Encrypted vote submitted successfully!");
      onSubmitVote(vote as "yes" | "no" | "abstain", reason);
      
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cast Your Vote</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">{proposalTitle}</h3>
            <p className="text-sm text-gray-600">Choose your vote for this proposal</p>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setVote("yes")}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  vote === "yes"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">👍</div>
                  <div className="font-semibold">Yes</div>
                  <div className="text-sm text-gray-600">Support this proposal</div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setVote("no")}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  vote === "no"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-200 hover:border-red-300"
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">👎</div>
                  <div className="font-semibold">No</div>
                  <div className="text-sm text-gray-600">Oppose this proposal</div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setVote("abstain")}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  vote === "abstain"
                    ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                    : "border-gray-200 hover:border-yellow-300"
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🤷</div>
                  <div className="font-semibold">Abstain</div>
                  <div className="text-sm text-gray-600">Neutral on this proposal</div>
                </div>
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason (Optional)
            </label>
            <Textarea
              id="reason"
              placeholder="Explain your vote..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!vote || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Submitting..." : "Submit Vote"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}