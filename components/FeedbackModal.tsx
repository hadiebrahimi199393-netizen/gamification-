import React, { useState, useEffect } from 'react';
import { FeedbackMessage } from '../types';
import { SOCRATIC_DIALOGUE } from '../constants';
import { BookOpen, MessageSquare, ArrowRight, Bot } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConceptCardOpen: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onConceptCardOpen }) => {
  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [responseFeedback, setResponseFeedback] = useState<string | null>(null);

  const dialogue = SOCRATIC_DIALOGUE.metal_blockage;
  const currentStep = dialogue[step];

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setSelectedOption(null);
      setResponseFeedback(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOptionClick = (index: number, isCorrect: boolean, response: string) => {
    setSelectedOption(index);
    setResponseFeedback(response);
    
    if (isCorrect) {
       setTimeout(() => {
           if (step < dialogue.length - 1) {
               setStep(s => s + 1);
               setSelectedOption(null);
               setResponseFeedback(null);
           }
       }, 2500);
    }
  };

  const isLastStep = step === dialogue.length - 1;
  const isFinished = isLastStep && selectedOption !== null && dialogue[step].options![selectedOption].isCorrect;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-tech-800 border border-tech-600 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-tech-900 p-4 border-b border-tech-700 flex items-center gap-3">
          <div className="bg-tech-accent/20 p-2 rounded-full">
            <Bot className="w-6 h-6 text-tech-accent" />
          </div>
          <div>
             <h2 className="text-xl font-bold text-white">Dr. Wave (AI Tutor)</h2>
             <p className="text-xs text-slate-400">Analyzing failure pattern: 6G_SHADOWING_DETECTED</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* AI Question */}
          <div className="mb-6">
            <div className="bg-tech-700/50 p-4 rounded-tl-xl rounded-tr-xl rounded-br-xl mb-2 inline-block max-w-[90%]">
              <p className="text-lg text-slate-100 leading-relaxed">{currentStep.text}</p>
            </div>
            <div className="text-xs text-slate-500 ml-1">AI Assistant • Just now</div>
          </div>

          {/* User Options */}
          <div className="space-y-3 pl-4">
            {currentStep.options?.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => !selectedOption && handleOptionClick(idx, opt.isCorrect, opt.response)}
                disabled={selectedOption !== null}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex justify-between items-center
                  ${selectedOption === idx 
                    ? opt.isCorrect 
                        ? 'bg-tech-success/20 border-tech-success text-tech-success' 
                        : 'bg-tech-danger/20 border-tech-danger text-tech-danger'
                    : 'bg-tech-900 border-tech-700 hover:border-slate-500 text-slate-300'
                  }
                  ${selectedOption !== null && selectedOption !== idx ? 'opacity-50' : ''}
                `}
              >
                <span>{opt.label}</span>
                {selectedOption === idx && (
                    <span className="font-bold">{opt.isCorrect ? '✓' : '✗'}</span>
                )}
              </button>
            ))}
          </div>

          {/* Feedback Response */}
          {responseFeedback && (
              <div className={`mt-4 p-3 rounded border text-sm animate-fade-in ${selectedOption !== null && currentStep.options![selectedOption].isCorrect ? 'bg-tech-success/10 border-tech-success/30 text-slate-200' : 'bg-tech-danger/10 border-tech-danger/30 text-slate-200'}`}>
                  <span className="font-bold mr-2">{selectedOption !== null && currentStep.options![selectedOption].isCorrect ? 'Correct:' : 'Note:'}</span>
                  {responseFeedback}
              </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-tech-900 p-4 border-t border-tech-700 flex justify-between items-center">
          <button 
            onClick={onConceptCardOpen}
            className="flex items-center gap-2 text-tech-accent hover:text-white transition-colors"
          >
            <BookOpen size={18} />
            <span>View Concept Card</span>
          </button>

          {isFinished ? (
             <button 
                onClick={onClose}
                className="bg-tech-success text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-600 transition-colors flex items-center gap-2"
              >
                Return to Design <ArrowRight size={18} />
             </button>
          ) : (
             <div className="text-xs text-slate-500">Answer to continue...</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FeedbackModal;
