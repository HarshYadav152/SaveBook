import React from 'react';
import { ShieldCheck, FileText, Copyright, CheckCircle2 } from 'lucide-react';

export default function MITLicensePage() {
  const sections = [
    {
      icon: Copyright,
      title: 'Copyright',
      text: 'Copyright (c) 2026 SaveBook'
    },
    {
      icon: ShieldCheck,
      title: 'Permission Granted',
      text: 'Permission is granted free of charge to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.'
    },
    {
      icon: CheckCircle2,
      title: 'Condition',
      text: 'The copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.'
    },
    {
      icon: FileText,
      title: 'Disclaimer',
      text: 'The software is provided "AS IS", without warranty of any kind, express or implied. Authors are not liable for any claim, damages or other liability.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">MIT License</h1>
          <p className="text-slate-300 text-lg">Open source license for SaveBook</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={section.title}>
                <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl shadow-xl h-full p-6 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-semibold">{section.title}</h2>
                    <p className="text-slate-300 leading-relaxed">{section.text}</p>
                  </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8">
            <h3 className="text-2xl font-semibold mb-4">Full License Text</h3>
            <div className="text-sm md:text-base text-slate-300 whitespace-pre-line leading-7 font-mono">
{`MIT License

Copyright (c) 2026 SaveBook

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the \"Software\"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
            </div>
          </div>
      </div>
    </div>
  );
}
