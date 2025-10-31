import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useShallow } from 'zustand/react/shallow';
import { useChromaWheelStore } from '@/hooks/useChromaWheelStore';
import { LAYOUTS, getNoteName, getIntervalName } from '@/lib/music';
import { getChordNotes } from '@/lib/music';
import { audioEngine } from '@/lib/audio';
const ChromaWheel: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dimensions = { width: 600, height: 600 };
  const { width, height } = dimensions;
  const radius = Math.min(width, height) / 2 - 40;
  const {
    layoutMode, accidentalMode, rootNote, chordType, selectedNotes, showIntervals, activeNotes,
    setRootNote, setChordType
  } = useChromaWheelStore(
    useShallow((state) => ({
      layoutMode: state.layoutMode,
      accidentalMode: state.accidentalMode,
      rootNote: state.rootNote,
      chordType: state.chordType,
      selectedNotes: state.selectedNotes,
      showIntervals: state.showIntervals,
      activeNotes: state.activeNotes,
      setRootNote: state.setRootNote,
      setChordType: state.setChordType,
    }))
  );
  const handleSegmentClick = React.useCallback((note: number) => {
    setRootNote(note);
  }, [setRootNote]);
  useEffect(() => {
    const chordNotes = getChordNotes(rootNote, chordType);
    const midiNotes = chordNotes.map(n => n + 60); // Play in 4th octave
    audioEngine.playChord(midiNotes, 0.5);
  }, [rootNote, chordType]); // Play chord when root or type changes
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    const g = svg.selectAll<SVGGElement, unknown>('g.main-group').data([null]);
    const gEnter = g.enter().append('g').attr('class', 'main-group')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
    const gUpdate = g.merge(gEnter);
    const useSharps = accidentalMode === 'sharps';
    const noteLayout = LAYOUTS[layoutMode];
    const pie = d3.pie<number>().value(() => 1).sort(null);
    const arc = d3.arc<d3.PieArcDatum<number>>()
      .innerRadius(radius * 0.7)
      .outerRadius(radius);
    const data = pie(noteLayout);
    // Main wheel segments
    const segments = gUpdate.selectAll<SVGGElement, d3.PieArcDatum<number>>('.arc-group')
      .data(data, d => d.data);
    const segmentsEnter = segments.enter()
      .append('g')
      .attr('class', 'arc-group cursor-pointer')
      .on('click', (_, d) => handleSegmentClick(d.data));
    segmentsEnter.append('path')
      .attr('class', 'chord-arc')
      .attr('d', arc)
      .style('stroke', 'hsl(var(--border))')
      .style('stroke-width', 2)
      .style('fill', d => d.data === rootNote ? 'hsl(var(--primary))' : 'hsl(var(--secondary))');
    segmentsEnter.append('text')
      .attr('class', 'note-label')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em')
      .text(d => getNoteName(d.data, useSharps));
    segments.merge(segmentsEnter).select<SVGPathElement>('path.chord-arc')
      .transition().duration(350)
      .style('fill', d => d.data === rootNote ? 'hsl(var(--primary))' : 'hsl(var(--secondary))');
    segments.merge(segmentsEnter).select<SVGTextElement>('text.note-label')
      .text(d => getNoteName(d.data, useSharps));
    // Note highlight dots
    const noteDotsRadius = radius * 0.825;
    const noteData = d3.range(12);
    const noteDots = gUpdate.selectAll<SVGCircleElement, number>('.note-dot')
      .data(noteData, d => d);
    noteDots.enter()
      .append('circle')
      .attr('class', 'note-dot')
      .attr('cx', d => noteDotsRadius * Math.sin((d * 30 - 90) * (Math.PI / 180)))
      .attr('cy', d => -noteDotsRadius * Math.cos((d * 30 - 90) * (Math.PI / 180)))
      .attr('r', 0)
      .style('fill', 'hsl(var(--primary))')
      .style('stroke', 'hsl(var(--background))')
      .style('stroke-width', 2)
      .merge(noteDots)
      .classed('active-note', d => {
        // Check across multiple octaves for active notes from keyboard/MIDI
        for (let octave = 0; octave < 8; octave++) {
          if (activeNotes.has(d + octave * 12)) {
            return true;
          }
        }
        return false;
      })
      .transition()
      .duration(250)
      .delay((d) => (selectedNotes.has(d) ? Array.from(selectedNotes).indexOf(d) * 50 : 0))
      .attr('r', d => selectedNotes.has(d) ? 12 : 0);
    // Center text
    gEnter.append('text').attr('class', 'center-label-root');
    gUpdate.select<SVGTextElement>('.center-label-root').text(getNoteName(rootNote, useSharps));
    gEnter.append('text').attr('class', 'center-label-chord').attr('dy', '1.2em');
    gUpdate.select<SVGTextElement>('.center-label-chord').text(chordType);
    // Interval/Note labels on outer ring
    const outerLabelRadius = radius * 1.25;
    const outerLabels = gUpdate.selectAll<SVGTextElement, number>('.outer-label')
      .data(noteData, d => d);
    outerLabels.enter()
      .append('text')
      .attr('class', 'outer-label')
      .attr('x', d => outerLabelRadius * Math.sin((d * 30 - 90) * (Math.PI / 180)))
      .attr('y', d => -outerLabelRadius * Math.cos((d * 30 - 90) * (Math.PI / 180)))
      .attr('dy', '0.35em')
      .style('opacity', 0)
      .merge(outerLabels)
      .text(d => {
        if (showIntervals) {
          const interval = (d - rootNote + 12) % 12;
          return getIntervalName(interval);
        }
        return getNoteName(d, useSharps);
      })
      .transition()
      .duration(350)
      .style('opacity', d => selectedNotes.has(d) ? 1 : 0.3);
  }, [layoutMode, accidentalMode, rootNote, chordType, selectedNotes, showIntervals, activeNotes, width, height, radius, setRootNote]);
  return <svg ref={svgRef} className="w-full h-full max-w-2xl mx-auto" />;
};
export default ChromaWheel;