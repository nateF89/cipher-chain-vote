import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Shield, Users, Vote } from "lucide-react";

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: "active" | "passed" | "failed" | "pending";
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  timeLeft: string;
  privacy: "private" | "public";
  chain: string;
}

interface ProposalCardProps {
  proposal: Proposal;
  onVote: (proposalId: string) => void;
  isConnected: boolean;
}

export function ProposalCard({ proposal, onVote, isConnected }: ProposalCardProps) {
  const votePercentage = proposal.totalVotes > 0 
    ? (proposal.votesFor / proposal.totalVotes) * 100 
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-cyber-green/20 text-cyber-green border-cyber-green/30";
      case "passed": return "bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan/30";
      case "failed": return "bg-destructive/20 text-destructive border-destructive/30";
      case "pending": return "bg-cyber-purple/20 text-cyber-purple border-cyber-purple/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="bg-gradient-card border-cyber-purple/20 hover:border-cyber-purple/40 transition-all duration-300 group backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(proposal.status)}>
                {proposal.status.toUpperCase()}
              </Badge>
              {proposal.privacy === "private" && (
                <Badge variant="outline" className="border-cyber-purple/50 text-cyber-purple">
                  <Shield className="w-3 h-3 mr-1" />
                  Private
                </Badge>
              )}
            </div>
            <CardTitle className="text-foreground group-hover:text-cyber-purple transition-colors">
              {proposal.title}
            </CardTitle>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {proposal.timeLeft}
            </div>
            <div className="text-xs text-cyber-cyan mt-1">{proposal.chain}</div>
          </div>
        </div>
        <CardDescription className="text-muted-foreground">
          {proposal.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Voting Progress</span>
            <span className="text-foreground">{proposal.totalVotes} votes</span>
          </div>
          <Progress value={votePercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>For: {proposal.votesFor}</span>
            <span>Against: {proposal.votesAgainst}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            {proposal.totalVotes} participants
          </div>
          <Button 
            variant="neon" 
            size="sm"
            onClick={() => onVote(proposal.id)}
            disabled={!isConnected || proposal.status !== "active"}
            className="gap-2"
          >
            <Vote className="w-4 h-4" />
            Vote
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}