import React from 'react';
import { Sparkles, MessageSquare, Zap, Globe, AlertTriangle } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

interface EmptyStateProps {
  onExampleClick: (example: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onExampleClick }) => {
  const examples = [
    {
      icon: MessageSquare,
      title: "Creative Writing",
      description: "Write a short story about a time traveler",
      prompt: "Write a short story about a time traveler who accidentally changes a small detail in the past and discovers how it affects the present."
    },
    {
      icon: Zap,
      title: "Problem Solving",
      description: "Help me debug this code",
      prompt: "I'm having trouble with a JavaScript function that should reverse a string but it's not working properly. Can you help me understand what might be wrong?"
    },
    {
      icon: Globe,
      title: "Learning",
      description: "Explain quantum computing simply",
      prompt: "Can you explain quantum computing in simple terms that a beginner could understand? What makes it different from regular computing?"
    }
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center">
        {!API_KEY && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">API Key Required</p>
                <p className="text-sm mt-1">
                  Please add your Gemini API key to the <code className="bg-amber-100 px-1 rounded">.env</code> file as <code className="bg-amber-100 px-1 rounded">VITE_GEMINI_API_KEY</code>
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hello! I'm Gemini
          </h1>
          <p className="text-gray-600 text-lg">
            How can I help you today?
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {examples.map((example, index) => {
            const Icon = example.icon;
            return (
              <button
                key={index}
                onClick={() => onExampleClick(example.prompt)}
                disabled={!API_KEY}
                className={`p-4 bg-white border border-gray-200 rounded-xl transition-all text-left group ${
                  API_KEY 
                    ? 'hover:border-blue-300 hover:shadow-md cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center transition-colors ${
                    API_KEY ? 'group-hover:bg-blue-100' : ''
                  }`}>
                    <Icon className={`w-4 h-4 text-gray-600 ${
                      API_KEY ? 'group-hover:text-blue-600' : ''
                    }`} />
                  </div>
                  <h3 className="font-semibold text-gray-900">{example.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{example.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};