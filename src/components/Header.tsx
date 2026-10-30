import React from 'react';
import { Layers, Code2, Table, BookOpen, Terminal, Sparkles } from 'lucide-react';

interface HeaderProps {
	activeTab: 'studio' | 'table' | 'fieldTypes' | 'javaSource' | 'docs';
	onSelectTab: (tab: 'studio' | 'table' | 'fieldTypes' | 'javaSource' | 'docs') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab }) => {
	interface TabItem {
		id: 'studio' | 'table' | 'fieldTypes' | 'javaSource' | 'docs';
		label: string;
		icon: React.ComponentType<{ className?: string }>;
		badge?: string;
	}

	const tabs: TabItem[] = [
		{ id: 'studio', label: 'Serializer Studio', icon: Code2, badge: '6 Languages' },
		{ id: 'table', label: 'Parent-Child Table', icon: Table, badge: 'Mapping Engine' },
		{ id: 'fieldTypes', label: 'Field Types Registry', icon: Layers, badge: 'X3D 4.0' },
		{ id: 'javaSource', label: 'Java Framework Code', icon: Terminal, badge: 'Downloadable .ZIP' },
		{ id: 'docs', label: 'Architecture & Spec', icon: BookOpen },
	];

	return (
		<header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-40 text-slate-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
							<div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center">
								<Code2 className="h-5 w-5 text-cyan-400" />
							</div>
						</div>
						<div>
							<div className="flex items-center gap-2">
								<h1 className="font-bold text-lg text-white tracking-tight">X3D DOM Serializer Framework</h1>
								<span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
									Java & X3DJSAIL
								</span>
							</div>
							<p className="text-xs text-slate-400 hidden sm:block">
								Unified framework porting Node.js serializers to Java with parent-child containerField mapping
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<span className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
							<Sparkles className="w-3.5 h-3.5 text-amber-400" />
							<span>GraalVM & Bytecode Chunking Ready</span>
						</span>
					</div>
				</div>

				{/* Navigation Tabs */}
				<nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none" aria-label="Tabs">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						const isActive = activeTab === tab.id;
						return (
							<button
								key={tab.id}
								onClick={() => onSelectTab(tab.id)}
								className={`flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium rounded-t-lg transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
									isActive
										? 'border-cyan-400 text-cyan-400 bg-slate-800/60'
										: 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
								}`}
							>
								<Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
								<span>{tab.label}</span>
								{tab.badge && (
									<span
										className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
											isActive
												? 'bg-cyan-400/20 text-cyan-300'
												: 'bg-slate-800 text-slate-400 border border-slate-700'
										}`}
									>
										{tab.badge}
									</span>
								)}
							</button>
						);
					})}
				</nav>
			</div>
		</header>
	);
};
