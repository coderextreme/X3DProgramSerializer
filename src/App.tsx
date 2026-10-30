import React, { useState } from 'react';
import { Header } from './components/Header';
import { SerializerStudio } from './components/SerializerStudio';
import { ParentChildTableView } from './components/ParentChildTableView';
import { FieldTypesView } from './components/FieldTypesView';
import { JavaFrameworkViewer } from './components/JavaFrameworkViewer';
import { ArchitectureDoc } from './components/ArchitectureDoc';

export default function App() {
	const [activeTab, setActiveTab] = useState<'studio' | 'table' | 'fieldTypes' | 'javaSource' | 'docs'>('studio');

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
			<Header activeTab={activeTab} onSelectTab={setActiveTab} />

			<main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
				{activeTab === 'studio' && <SerializerStudio />}
				{activeTab === 'table' && <ParentChildTableView />}
				{activeTab === 'fieldTypes' && <FieldTypesView />}
				{activeTab === 'javaSource' && <JavaFrameworkViewer />}
				{activeTab === 'docs' && <ArchitectureDoc />}
			</main>

			<footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
				<div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
					<div className="flex items-center gap-2">
						<span className="font-semibold text-slate-400">X3D DOM Polyglot Serializer Framework</span>
						<span>•</span>
						<span>ISO/IEC 19777-2 X3DJSAIL Conformance</span>
					</div>
					<div className="flex items-center gap-4 text-slate-400">
						<span>Java (X3DJSAIL)</span>
						<span>GraalJS</span>
						<span>GraalPy</span>
						<span>Clojure</span>
						<span>JRuby</span>
						<span>TruffleRuby</span>
					</div>
				</div>
			</footer>
		</div>
	);
}
