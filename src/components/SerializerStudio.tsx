import React, { useState, useMemo } from 'react';
import { TargetLanguage, SerializerOptions, SerializationResult } from '../services/serializerTypes';
import { serializeX3D, defaultSerializerOptions, serializers } from '../services/serializers';
import { sampleScenes } from '../services/sampleScenes';
import {
	Play,
	Copy,
	Check,
	Download,
	Upload,
	Settings2,
	Columns2,
	Square,
	RefreshCw,
	FileCode,
	Zap,
	AlertCircle,
	Sparkles,
	SlidersHorizontal,
	FileText
} from 'lucide-react';

export const SerializerStudio: React.FC = () => {
	const [selectedSceneId, setSelectedSceneId] = useState<string>(sampleScenes[0].id);
	const [xmlInput, setXmlInput] = useState<string>(sampleScenes[0].xml);
	const [primaryLang, setPrimaryLang] = useState<TargetLanguage>('java');
	const [secondaryLang, setSecondaryLang] = useState<TargetLanguage>('graaljs');
	const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [copied, setCopied] = useState<string | null>(null);

	const [options, setOptions] = useState<SerializerOptions>({
		...defaultSerializerOptions,
		className: 'HelloWorldModel',
	});

	// Serialization execution
	const primaryResult: { success: boolean; data?: SerializationResult; error?: string } = useMemo(() => {
		try {
			const res = serializeX3D(xmlInput, primaryLang, options);
			return { success: true, data: res };
		} catch (err: any) {
			return { success: false, error: err.message || 'Serialization failed' };
		}
	}, [xmlInput, primaryLang, options]);

	const secondaryResult: { success: boolean; data?: SerializationResult; error?: string } = useMemo(() => {
		if (!isCompareMode) return { success: false };
		try {
			const res = serializeX3D(xmlInput, secondaryLang, options);
			return { success: true, data: res };
		} catch (err: any) {
			return { success: false, error: err.message || 'Serialization failed' };
		}
	}, [xmlInput, secondaryLang, options, isCompareMode]);

	const handleSceneChange = (id: string) => {
		setSelectedSceneId(id);
		const scene = sampleScenes.find((s) => s.id === id);
		if (scene) {
			setXmlInput(scene.xml);
			const cleanName = scene.title.replace(/[^a-zA-Z0-9]/g, '');
			setOptions((prev: SerializerOptions) => ({ ...prev, className: cleanName || 'Model' }));
		}
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (event) => {
			const content = event.target?.result as string;
			if (content) {
				setXmlInput(content);
				let name = file.name.replace(/\.[^/.]+$/, '');
				name = name.replace(/[^a-zA-Z0-9_]/g, '');
				setOptions((prev: SerializerOptions) => ({ ...prev, className: name || 'UploadedModel' }));
			}
		};
		reader.readAsText(file);
	};

	const copyCode = (code: string, id: string) => {
		navigator.clipboard.writeText(code);
		setCopied(id);
		setTimeout(() => setCopied(null), 2000);
	};

	const downloadCode = (code: string, lang: TargetLanguage) => {
		const serializer = serializers[lang as TargetLanguage];
		const ext = serializer ? serializer.fileExtension : '.txt';
		const filename = `${options.className}${ext}`;
		const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		link.click();
		URL.revokeObjectURL(url);
	};

	const languageList: { id: TargetLanguage; label: string; badge: string; color: string }[] = [
		{ id: 'java', label: 'Java (X3DJSAIL)', badge: 'Official Binding', color: 'from-orange-500/20 to-amber-500/20 text-amber-400 border-amber-500/30' },
		{ id: 'graaljs', label: 'GraalJS', badge: 'Polyglot JS', color: 'from-yellow-500/20 to-lime-500/20 text-yellow-400 border-yellow-500/30' },
		{ id: 'graalpy', label: 'GraalPy', badge: 'x3dpsail Python', color: 'from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30' },
		{ id: 'clojure', label: 'Clojure', badge: 'JVM doto Interop', color: 'from-emerald-500/20 to-teal-500/20 text-teal-400 border-teal-500/30' },
		{ id: 'jruby', label: 'JRuby', badge: 'JVM Ruby', color: 'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30' },
		{ id: 'truffleruby', label: 'TruffleRuby', badge: 'GraalVM Native', color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30' },
	];

	return (
		<div className="space-y-4">
			{/* Top Control Bar */}
			<div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
				<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
					{/* Sample Preset Selector */}
					<div className="flex flex-wrap items-center gap-3">
						<label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
							<FileText className="w-3.5 h-3.5 text-cyan-400" />
							Sample Scene:
						</label>
						<select
							value={selectedSceneId}
							onChange={(e) => handleSceneChange(e.target.value)}
							className="bg-slate-800 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
						>
							{sampleScenes.map((s) => (
								<option key={s.id} value={s.id}>
									[{s.category}] {s.title}
								</option>
							))}
						</select>

						<label className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition">
							<Upload className="w-3.5 h-3.5 text-slate-400" />
							<span>Upload .x3d</span>
							<input type="file" accept=".x3d,.xml" onChange={handleFileUpload} className="hidden" />
						</label>
					</div>

					{/* View Modes & Settings Button */}
					<div className="flex items-center gap-2">
						<button
							onClick={() => setIsCompareMode(!isCompareMode)}
							className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition cursor-pointer ${
								isCompareMode
									? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
									: 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
							}`}
							title="Side-by-side multi-language comparison"
						>
							<Columns2 className="w-3.5 h-3.5" />
							<span>{isCompareMode ? 'Side-by-Side: Active' : 'Compare 2 Languages'}</span>
						</button>

						<button
							onClick={() => setShowOptions(!showOptions)}
							className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition cursor-pointer ${
								showOptions
									? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
									: 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
							}`}
						>
							<SlidersHorizontal className="w-3.5 h-3.5" />
							<span>Serializer Options</span>
						</button>
					</div>
				</div>

				{/* Options Expansion Drawer */}
				{showOptions && (
					<div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs animate-in fade-in duration-200">
						<div>
							<label className="text-slate-400 block mb-1 font-medium">Class / Model Name:</label>
							<input
								type="text"
								value={options.className}
								onChange={(e) => setOptions({ ...options, className: e.target.value })}
								className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-slate-200 font-mono text-xs focus:ring-1 focus:ring-cyan-500"
							/>
						</div>
						<div>
							<label className="text-slate-400 block mb-1 font-medium">Java Package Name:</label>
							<input
								type="text"
								value={options.packageName}
								onChange={(e) => setOptions({ ...options, packageName: e.target.value })}
								className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-slate-200 font-mono text-xs focus:ring-1 focus:ring-cyan-500"
							/>
						</div>
						<div className="flex flex-col justify-center space-y-1.5">
							<label className="flex items-center gap-2 cursor-pointer text-slate-300">
								<input
									type="checkbox"
									checked={options.breakUpMethods}
									onChange={(e) => setOptions({ ...options, breakUpMethods: e.target.checked })}
									className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500"
								/>
								<span>Method Chunking (64KB Safeguard)</span>
							</label>
							<label className="flex items-center gap-2 cursor-pointer text-slate-300">
								<input
									type="checkbox"
									checked={options.stripDefaultAttributes}
									onChange={(e) => setOptions({ ...options, stripDefaultAttributes: e.target.checked })}
									className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500"
								/>
								<span>Strip Default Attributes</span>
							</label>
						</div>
						<div className="flex flex-col justify-center space-y-1.5">
							<label className="flex items-center gap-2 cursor-pointer text-slate-300">
								<input
									type="checkbox"
									checked={options.stripTrailingZeroes}
									onChange={(e) => setOptions({ ...options, stripTrailingZeroes: e.target.checked })}
									className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500"
								/>
								<span>Strip Trailing Zeroes</span>
							</label>
							<label className="flex items-center gap-2 cursor-pointer text-slate-300">
								<input
									type="checkbox"
									checked={options.nativeXsltEngine}
									onChange={(e) => setOptions({ ...options, nativeXsltEngine: e.target.checked })}
									className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500"
								/>
								<span>Native Java XSLT Engine</span>
							</label>
						</div>
					</div>
				)}
			</div>

			{/* Main Studio Workspace */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
				{/* Input Column (XML DOM) */}
				<div className={`${isCompareMode ? 'lg:col-span-4' : 'lg:col-span-5'} flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm`}>
					<div className="bg-slate-800/80 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<FileCode className="w-4 h-4 text-cyan-400" />
							<span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">X3D XML Input (DOM Source)</span>
						</div>
						<span className="text-[11px] text-slate-400 font-mono">
							{xmlInput.length} chars
						</span>
					</div>
					<div className="p-2 flex-1 flex flex-col">
						<textarea
							value={xmlInput}
							onChange={(e) => setXmlInput(e.target.value)}
							spellCheck={false}
							className="w-full h-[540px] bg-slate-950 text-slate-200 font-mono text-xs p-3 rounded-lg border border-slate-800/80 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none overflow-auto leading-relaxed"
						/>
					</div>
				</div>

				{/* Output Primary Column */}
				<div className={`${isCompareMode ? 'lg:col-span-4' : 'lg:col-span-7'} flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm`}>
					{/* Language Selector Header */}
					<div className="bg-slate-800/80 px-3 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
						<div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
							{languageList.map((lang) => (
								<button
									key={lang.id}
									onClick={() => setPrimaryLang(lang.id)}
									className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
										primaryLang === lang.id
											? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
											: 'bg-slate-800/90 text-slate-400 hover:text-slate-200 border border-slate-700/60'
									}`}
								>
									<span>{lang.label}</span>
								</button>
							))}
						</div>

						<div className="flex items-center gap-1.5">
							{primaryResult.success && primaryResult.data && (
								<>
									<button
										onClick={() => copyCode(primaryResult.data!.code, 'primary')}
										className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition"
										title="Copy to clipboard"
									>
										{copied === 'primary' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
									</button>
									<button
										onClick={() => downloadCode(primaryResult.data!.code, primaryLang)}
										className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition"
										title="Download file"
									>
										<Download className="w-3.5 h-3.5" />
									</button>
								</>
							)}
						</div>
					</div>

					{/* Metrics banner */}
					{primaryResult.success && primaryResult.data && (
						<div className="bg-slate-950/60 px-4 py-1.5 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
							<div className="flex items-center gap-3">
								<span>Nodes: <strong className="text-slate-300 font-mono">{primaryResult.data.stats.nodeCount}</strong></span>
								<span>Attrs: <strong className="text-slate-300 font-mono">{primaryResult.data.stats.attributeCount}</strong></span>
								<span>Lines: <strong className="text-slate-300 font-mono">{primaryResult.data.stats.lineCount}</strong></span>
								{primaryResult.data.stats.generatedClassesCount > 0 && (
									<span>Chunked Classes: <strong className="text-amber-400 font-mono">{primaryResult.data.stats.generatedClassesCount}</strong></span>
								)}
							</div>
							<div className="flex items-center gap-1 text-cyan-400">
								<Zap className="w-3 h-3" />
								<span>{primaryResult.data.executionTimeMs} ms</span>
							</div>
						</div>
					)}

					{/* Code output or error view */}
					<div className="p-2 flex-1 flex flex-col">
						{primaryResult.success && primaryResult.data ? (
							<pre className="w-full h-[540px] bg-slate-950 text-slate-200 font-mono text-xs p-3 rounded-lg border border-slate-800/80 overflow-auto leading-relaxed select-all">
								<code>{primaryResult.data.code}</code>
							</pre>
						) : (
							<div className="h-[540px] bg-slate-950 rounded-lg border border-red-500/30 p-6 flex flex-col items-center justify-center text-center">
								<AlertCircle className="w-8 h-8 text-rose-500 mb-2" />
								<h3 className="text-rose-400 font-semibold text-sm">Serialization Error</h3>
								<p className="text-slate-400 text-xs mt-1 max-w-md">{primaryResult.error}</p>
							</div>
						)}
					</div>
				</div>

				{/* Output Secondary Column (in compare mode) */}
				{isCompareMode && (
					<div className="lg:col-span-4 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm animate-in fade-in duration-200">
						<div className="bg-slate-800/80 px-3 py-2 border-b border-slate-800 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Compare Target:</span>
								<select
									value={secondaryLang}
									onChange={(e) => setSecondaryLang(e.target.value as TargetLanguage)}
									className="bg-slate-800 text-cyan-400 text-xs font-semibold border border-slate-700 rounded px-2 py-1 focus:outline-none cursor-pointer"
								>
									{languageList.map((lang) => (
										<option key={lang.id} value={lang.id}>
											{lang.label}
										</option>
									))}
								</select>
							</div>

							<div className="flex items-center gap-1.5">
								{secondaryResult.success && secondaryResult.data && (
									<>
										<button
											onClick={() => copyCode(secondaryResult.data!.code, 'secondary')}
											className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition"
											title="Copy comparison code"
										>
											{copied === 'secondary' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
										</button>
										<button
											onClick={() => downloadCode(secondaryResult.data!.code, secondaryLang)}
											className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition"
											title="Download comparison file"
										>
											<Download className="w-3.5 h-3.5" />
										</button>
									</>
								)}
							</div>
						</div>

						{/* Secondary metrics */}
						{secondaryResult.success && secondaryResult.data && (
							<div className="bg-slate-950/60 px-4 py-1.5 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
								<span>Lines: <strong className="text-slate-300 font-mono">{secondaryResult.data.stats.lineCount}</strong></span>
								<span className="text-cyan-400">{secondaryResult.data.executionTimeMs} ms</span>
							</div>
						)}

						<div className="p-2 flex-1 flex flex-col">
							{secondaryResult.success && secondaryResult.data ? (
								<pre className="w-full h-[540px] bg-slate-950 text-slate-200 font-mono text-xs p-3 rounded-lg border border-slate-800/80 overflow-auto leading-relaxed select-all">
									<code>{secondaryResult.data.code}</code>
								</pre>
							) : (
								<div className="h-[540px] bg-slate-950 rounded-lg border border-red-500/30 p-6 flex flex-col items-center justify-center text-center">
									<AlertCircle className="w-8 h-8 text-rose-500 mb-2" />
									<h3 className="text-rose-400 font-semibold text-sm">Serialization Error</h3>
									<p className="text-slate-400 text-xs mt-1">{secondaryResult.error}</p>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
