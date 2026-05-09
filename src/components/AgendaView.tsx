import React from 'react';
import { motion } from 'motion/react';
import { Clock, Users, ListTodo, ChevronRight, Target } from 'lucide-react';
import type { MeetingAgenda } from '../lib/gemini';
import { cn } from '../lib/utils';

interface AgendaViewProps {
  agenda: MeetingAgenda;
  totalTime: number;
}

export function AgendaView({ agenda, totalTime }: AgendaViewProps) {
  // Normalize weights and calculate actual minutes
  const totalWeight = agenda.topics.reduce((acc, t) => acc + t.weight, 0);
  
  return (
    <div className="space-y-12 pb-20">
      <header className="space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider"
        >
          <Target size={14} />
          Meeting Objective
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight"
        >
          {agenda.title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-600 max-w-2xl leading-relaxed"
        >
          {agenda.objective}
        </motion.p>
      </header>

      <div className="grid gap-6">
        {agenda.topics.map((topic, index) => {
          const minutes = Math.round((topic.weight / totalWeight) * totalTime);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index + 0.3 }}
              className="group relative bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-32 bg-slate-50 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-100 transition-colors group-hover:bg-indigo-50/50">
                  <div className="text-2xl font-bold text-indigo-600">{minutes}</div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">MINS</div>
                  <Clock className="mt-3 text-slate-300 group-hover:text-indigo-300 transition-colors" size={20} />
                </div>

                <div className="flex-1 p-8 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {topic.summary}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-slate-50">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 uppercase tracking-wider">
                        <Users size={16} className="text-indigo-500" />
                        Stakeholders
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {topic.stakeholders.map((person, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                            {person}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 uppercase tracking-wider">
                        <ListTodo size={16} className="text-indigo-500" />
                        Action Items
                      </div>
                      <ul className="space-y-2">
                        {topic.actionItems.map((item, i) => (
                          <li key={i} className="flex gap-2 text-sm text-slate-600">
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
