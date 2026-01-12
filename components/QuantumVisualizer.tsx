
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { QuantumStats } from '../types';

interface Props {
  stats: QuantumStats | null;
}

const QuantumVisualizer: React.FC<Props> = ({ stats }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 400;
    const height = 400;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Draw Bloch Sphere circles
    g.append("circle")
      .attr("r", 150)
      .attr("fill", "none")
      .attr("stroke", "#1e293b")
      .attr("stroke-width", 1);

    g.append("ellipse")
      .attr("rx", 150)
      .attr("ry", 40)
      .attr("fill", "none")
      .attr("stroke", "#1e293b")
      .attr("stroke-width", 1);

    // Grid lines
    g.append("line")
      .attr("x1", 0).attr("y1", -150)
      .attr("x2", 0).attr("y2", 150)
      .attr("stroke", "#1e293b")
      .attr("stroke-dasharray", "4,4");

    if (stats) {
      const { x, y, z } = stats.semanticVector;
      const targetX = x * 150;
      const targetZ = z * 150;

      // Draw the State Vector
      const line = g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", 0)
        .attr("stroke", "#22d3ee")
        .attr("stroke-width", 3)
        .attr("stroke-linecap", "round");

      line.transition()
        .duration(1000)
        .attr("x2", targetX)
        .attr("y2", -targetZ);

      // Draw particle cluster
      const particles = g.selectAll(".particle")
        .data(d3.range(20))
        .enter()
        .append("circle")
        .attr("class", "particle")
        .attr("r", 2)
        .attr("fill", "#22d3ee")
        .attr("opacity", 0.6);

      // Recursive transition function to fix the .repeat() error
      function animateParticle(selection: d3.Selection<SVGCircleElement, number, SVGGElement, unknown>) {
        selection
          .transition()
          .duration(2000 + Math.random() * 2000)
          .attrTween("transform", () => {
            const ix = d3.interpolate(0, targetX + (Math.random() - 0.5) * 60);
            const iy = d3.interpolate(0, -targetZ + (Math.random() - 0.5) * 60);
            return (t) => `translate(${ix(t)}, ${iy(t)})`;
          })
          .on("end", function() {
            d3.select(this).call(animateParticle as any);
          });
      }

      particles.each(function() {
        d3.select(this).call(animateParticle as any);
      });

      // Glow effect
      g.append("circle")
        .attr("cx", targetX)
        .attr("cy", -targetZ)
        .attr("r", 10)
        .attr("fill", "#22d3ee")
        .attr("filter", "blur(4px)")
        .attr("opacity", 0.5);
    }
  }, [stats]);

  return (
    <div className="flex flex-col items-center justify-center bg-slate-900/50 rounded-2xl border border-slate-800 p-6 backdrop-blur-xl h-full min-h-[450px]">
      <h3 className="text-xs uppercase tracking-[0.2em] text-cyan-400 mb-4 font-bold">Bloch Sphere Projection</h3>
      <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" className="max-w-[400px]" />
      <div className="mt-4 grid grid-cols-2 gap-4 w-full">
         <Metric label="Entanglement" value={stats?.entanglement || 0} color="text-purple-400" />
         <Metric label="Superposition" value={stats?.superposition || 0} color="text-cyan-400" />
      </div>
    </div>
  );
};

const Metric = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="bg-black/40 p-3 rounded-lg border border-slate-800">
    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{label}</div>
    <div className={`text-lg font-bold mono ${color}`}>{(value * 100).toFixed(1)}%</div>
    <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
      <div 
        className={`h-full bg-current ${color.replace('text-', 'bg-')}`} 
        style={{ width: `${value * 100}%`, transition: 'width 1s ease-out' }} 
      />
    </div>
  </div>
);

export default QuantumVisualizer;
