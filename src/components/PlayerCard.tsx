import { useState } from 'react';
import {
  User,
  Trophy,
  Crosshair,
  Target,
  MapPin,
  Phone,
  Shield,
  CheckCircle,
  LoaderCircle,
} from "lucide-react";import { Player } from '@/types/player';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PlayerForm from './PlayerForm';
import { usePlayer } from '@/context/PlayerContext';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import PlayerService from '@/service/PlayerService';

interface PlayerCardProps {
  player: Player;
}

const PlayerCard = ({ player }: PlayerCardProps) => {
  const { deletePlayer } = usePlayer();
    const { isLoggedIn } = useAuth();
    const { players, setPlayers } = usePlayer();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [approvingPlayerId, setApprovingPlayerId] = useState<number | null>(null);
  

  const handleDelete = () => {
    deletePlayer(player.id);
    toast.success('Player deleted successfully!');
    setShowDeleteDialog(false);
  };

   const handleApprove = (playerId : any)=>{
        setApprovingPlayerId(playerId);
        PlayerService().approvePlayer(playerId).then((response:any)=>{
          console.log("response=== ", response)
          setApprovingPlayerId(null);
  
          let updatedPlayer = response.data.players;
  
          setPlayers((prev) =>
            prev.map((player) =>
              player.id === updatedPlayer.id
                ? { ...player, ...updatedPlayer }
                : player
            )
          );
  
          toast.success('Player approved successfully!');
  
        })
        
      }


  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Batsman':
        return 'bg-secondary text-secondary-foreground';
      case 'Bowler':
        return 'bg-primary text-primary-foreground';
      case 'All-Rounder':
        return 'bg-pitch-dark text-primary-foreground';
      case 'Wicket-Keeper':
      case 'Wicket-Keeper Batsman':
        return 'bg-gold-dark text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>
      




<div className="group relative overflow-hidden rounded-2xl border-2 border-yellow-400 bg-white p-1 shadow-lg shadow-blue-950/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

  <div className="overflow-hidden rounded-xl border border-blue-200">

    {/* Player Image */}
   <div className="relative h-100 overflow-hidden bg-[#06152f] sm:h-100">

      {player.profile_image ? (
        <img
          src={`https://storage.googleapis.com/rajas_pl/${player.profile_image}`}
          alt={player.fullname}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-950 to-sky-800">
          <User className="h-20 w-20 text-white/40" />
        </div>
      )}

      {/* Image Gradient */}
      {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04132f] via-[#04132f]/10 to-black/10" /> */}

      {/* Player ID */}
      <div className="absolute left-3 top-3 rounded-lg border border-yellow-400 bg-[#06152f]/90 px-3 py-1.5 shadow-lg">
        
        <p className="text-lg font-black leading-tight text-white">
          #{player.id}
        </p>
      </div>
     
      {/* Role, Batting & Bowling Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-2.5">

        <div className="grid grid-cols-3 gap-1 rounded-xl border border-yellow-400/70 bg-[#06152f]/95 p-2.5 shadow-xl backdrop-blur-sm">

          {/* Role */}
          <div className="min-w-0 border-r border-white/20 pr-1.5">
            <div className="mb-1 flex items-center gap-1 text-yellow-400">
              <Trophy className="h-3.5 w-3.5 shrink-0" />
              <span className="text-[9px] font-bold uppercase">
                Role
              </span>
            </div>
            <p className="break-words text-xs font-extrabold leading-snug text-white">
              {player.player_role || "Player"}
            </p>
          </div>

          {/* Batting Style */}
          <div className="min-w-0 border-r border-white/20 px-1">
            <div className="mb-1 flex items-center gap-1 text-yellow-400">
              <Crosshair className="h-3.5 w-3.5 shrink-0" />
              <span className="text-[9px] font-bold uppercase">
                Batting
              </span>
            </div>
            <p className="break-words text-xs font-extrabold leading-snug text-white">
              {player.batting_style || "N/A"}
            </p>
          </div>

          {/* Bowling Style */}
          <div className="min-w-0 pl-1">
            <div className="mb-1 flex items-center gap-1 text-yellow-400">
              <Target className="h-3.5 w-3.5 shrink-0" />
              <span className="text-[9px] font-bold uppercase">
                Bowling
              </span>
            </div>
            <p className="break-words text-xs font-extrabold leading-snug text-white">
              {player.bowling_style &&
              player.bowling_style !== "None"
                ? player.bowling_style
                : "N/A"}
            </p>
          </div>

        </div>
      </div>
    </div>

    {/* Player Name & Team */}
    <div className="bg-white p-3 sm:p-4">

      <h3 className="break-words text-lg font-black uppercase leading-tight tracking-tight text-blue-950 sm:text-xl">
        {player.fullname}
      </h3>

      <div className="mt-2 flex min-w-0 items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-950 text-yellow-400">
          <Shield className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
            Current Team
          </p>
          <p className="break-words text-sm font-extrabold text-blue-900">
            {player.location || "Not Assigned"}
          </p>
        </div>
      </div>

      {/* Contact + Approve Button */}
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5">

        {/* Contact Number */}
        <a
          href={
            player.contact_no
              ? `tel:${player.contact_no}`
              : undefined
          }
          className="flex min-w-0 flex-1 items-center gap-2"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
            <Phone className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
              Contact Number
            </p>
            <p className="break-all text-xs font-extrabold text-blue-950 sm:text-sm">
              {player.contact_no || "N/A"}
            </p>
          </div>
        </a>

        {/* Approve Button - Admin Only */}
        {isLoggedIn && player.status == 1 && (
          <div className="shrink-0">
            {approvingPlayerId === player.id ? (
              <button
                type="button"
                disabled
                className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2.5 text-xs font-bold text-white opacity-80"
              >
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Approving</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleApprove(player.id)}
                className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2.5 text-xs font-black text-white shadow-md transition hover:bg-green-500 active:scale-95"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Approve</span>
              </button>
            )}
          </div>
        )}

      </div>

     
    </div>
  </div>
</div>






      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card border-2 border-border max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">Delete Player?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{player.fullname}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="border-2">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-card border-2 border-border max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg sm:text-xl">Edit Player</DialogTitle>
          </DialogHeader>
          <PlayerForm editPlayer={player} onCancel={() => setShowEditDialog(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlayerCard;