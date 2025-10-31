import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useChromaWheelStore } from '@/hooks/useChromaWheelStore';
import { getRecommendedChords, getNoteName, getChordNotes } from '@/lib/music';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
const RecommendationMatrix: React.FC = () => {
  const {
    isRecommendationMatrixOpen,
    rootNote,
    accidentalMode,
    toggleRecommendationMatrix,
    setRootNote,
    setChordType,
  } = useChromaWheelStore(
    useShallow((state) => ({
      isRecommendationMatrixOpen: state.isRecommendationMatrixOpen,
      rootNote: state.rootNote,
      accidentalMode: state.accidentalMode,
      toggleRecommendationMatrix: state.toggleRecommendationMatrix,
      setRootNote: state.setRootNote,
      setChordType: state.setChordType,
    }))
  );
  const useSharps = accidentalMode === 'sharps';
  const recommendedChords = getRecommendedChords(rootNote, 'major', useSharps);
  const keyName = getNoteName(rootNote, useSharps);
  const handleChordSelect = (chordRoot: number, chordQuality: string) => {
    setRootNote(chordRoot);
    setChordType(chordQuality);
    toggleRecommendationMatrix(); // Close modal on selection
  };
  return (
    <Dialog open={isRecommendationMatrixOpen} onOpenChange={toggleRecommendationMatrix}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Chord Recommendations</DialogTitle>
          <DialogDescription>
            Diatonic chords in the key of {keyName} Major. Click a chord to select it.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Degree</TableHead>
                <TableHead>Chord</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recommendedChords.length > 0 ? (
                recommendedChords.map(({ degree, root, quality, name }) => {
                  const notes = getChordNotes(root, quality);
                  return (
                    <TableRow
                      key={degree}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => handleChordSelect(root, quality)}
                    >
                      <TableCell className="font-medium">{degree}</TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {notes.map((note) => (
                            <Badge key={note} variant="secondary">
                              {getNoteName(note, useSharps)}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No recommendations available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default RecommendationMatrix;