import React, { useState, useMemo } from 'react';
import { generateParentChildTable, resolveParentChildMethod, ParentChildRule } from '../services/parentChildTable';
import { Search, Filter, Download, Copy, Check, Sparkles, HelpCircle, ArrowRight, Table as TableIcon } from 'lucide-react';

export const ParentChildTableView: React.FC = () => {
	const allRules = useMemo(() => generateParentChildTable(), []);

	const [searchTerm, setSearchTerm] = useState('');
	const [typeFilter, setTypeFilter] = useState<'all' | 'add' | 'set'>('all');
	const [sourceFilter, setSourceFilter] = useState<string>('all');
	const [copied, setCopied] = useState<string | null>(null);

	// Interactive Query Tool States
	const [testParent, setTestParent] = useState<string>('HAnimHumanoid');
	const [testChild, setTestChild] = useState<string>('HAnimJoint');
	const [testContainerField, setTestContainerField] = useState<string>('skeleton');
	const [testChildIndex, setTestChildIndex] = useState<number>(0);

	const liveResolution = useMemo(() => {
		return resolveParentChildMethod(testParent, testChild, testContainerField || undefined, testChildIndex);
	}, [testParent, testChild, testContainerField, testChildIndex]);

	// Filtered rules
	const filteredRules = useMemo(() => {
		return allRules.filter((rule) => {
			if (typeFilter !== 'all' && rule.methodType !== typeFilter) return false;
			if (sourceFilter !== 'all' && rule.ruleSource !== sourceFilter) return false;
			if (searchTerm) {
				const term = searchTerm.toLowerCase();
				return (
					rule.parentNode.toLowerCase().includes(term) ||
					rule.childNode.toLowerCase().includes(term) ||
					rule.containerField.toLowerCase().includes(term) ||
					rule.methodName.toLowerCase().includes(term) ||
					(rule.notes && rule.notes.toLowerCase().includes(term))
				);
			}
			return true;
		});
	}, [allRules, searchTerm, typeFilter, sourceFilter]);

	// Export functions
	const exportCSV = () => {
		const headers = ['Parent Node', 'Child Node', 'ContainerField', 'Is Default CF', 'Method Name', 'Method Type', 'Rule Source', 'Notes'];
		const rows = filteredRules.map((r) => [
			`"${r.parentNode}"`,
			`"${r.childNode}"`,
			`"${r.containerField}"`,
			r.isDefaultContainerField ? 'true' : 'false',
			`"${r.methodName}"`,
			r.methodType,
			r.ruleSource,
			`"${r.notes || ''}"`
		]);
		const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'X3D_ParentChild_ContainerField_Table.csv';
		link.click();
		URL.revokeObjectURL(url);
	};

	const exportMarkdown = () => {
		let md = '| Parent Node | Child Node | ContainerField | Method Name | Rule Source |\n';
		md += '| :--- | :--- | :--- | :--- | :--- |\n';
		filteredRules.slice(0, 100).forEach((r) => {
			md += `| \`${r.parentNode}\` | \`${r.childNode}\` | \`${r.containerField}\` | \`${r.methodName}()\` | ${r.ruleSource} |\n`;
		});
		navigator.clipboard.writeText(md);
		setCopied('markdown');
		setTimeout(() => setCopied(null), 2000);
	};

	return (
		<div className="space-y-6">
			{/* Top Explanation & Live Tester Card */}
			<div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-xl p-5 shadow-lg">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
					<div>
						<div className="flex items-center gap-2">
							<TableIcon className="w-5 h-5 text-cyan-400" />
							<h2 className="text-base font-bold text-white tracking-tight">Parent-Child & ContainerField Mapping Table</h2>
							<span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
								{allRules.length} Defined Rules
							</span>
						</div>
						<p className="text-xs text-slate-300 mt-1 max-w-3xl">
							Table correlating each Parent Node, Child Node, and ContainerField (defaulted or explicitly specified) to the corresponding X3DJSAIL method name or enum.
						</p>
					</div>

					<div className="flex items-center gap-2">
						<button
							onClick={exportCSV}
							className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition cursor-pointer"
						>
							<Download className="w-3.5 h-3.5" />
							<span>Export CSV</span>
						</button>
						<button
							onClick={exportMarkdown}
							className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition cursor-pointer"
						>
							{copied === 'markdown' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
							<span>Copy Markdown Table</span>
						</button>
					</div>
				</div>

				{/* Interactive Live Query Tester */}
				<div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800">
					<div className="flex items-center gap-2 mb-3">
						<Sparkles className="w-4 h-4 text-amber-400" />
						<span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Live Resolution Tester</span>
						<span className="text-[11px] text-slate-400">— Test how any Parent + Child + containerField resolves in the Framework</span>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
						<div>
							<label className="text-slate-400 block mb-1 font-medium">Parent Node:</label>
							<input
								type="text"
								value={testParent}
								onChange={(e) => setTestParent(e.target.value)}
								className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:ring-1 focus:ring-cyan-500"
								placeholder="e.g. HAnimHumanoid, Transform"
							/>
						</div>
						<div>
							<label className="text-slate-400 block mb-1 font-medium">Child Node:</label>
							<input
								type="text"
								value={testChild}
								onChange={(e) => setTestChild(e.target.value)}
								className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:ring-1 focus:ring-cyan-500"
								placeholder="e.g. HAnimJoint, Shape"
							/>
						</div>
						<div>
							<label className="text-slate-400 block mb-1 font-medium">ContainerField (optional):</label>
							<input
								type="text"
								value={testContainerField}
								onChange={(e) => setTestContainerField(e.target.value)}
								className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:ring-1 focus:ring-cyan-500"
								placeholder="e.g. skeleton, joints, proxy"
							/>
						</div>
						<div>
							<label className="text-slate-400 block mb-1 font-medium">Child Sibling Index:</label>
							<select
								value={testChildIndex}
								onChange={(e) => setTestChildIndex(parseInt(e.target.value, 10))}
								className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-medium focus:ring-1 focus:ring-cyan-500 cursor-pointer"
							>
								<option value={0}>0 (First Child - set/add default)</option>
								<option value={1}>&gt;0 (Sibling - favors add*)</option>
							</select>
						</div>
					</div>

					{/* Tester Output Banner */}
					<div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
						<div className="flex items-center gap-2">
							<span className="text-slate-400">Resolved Method:</span>
							<span className="font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 px-2.5 py-0.5 rounded text-sm">
								.{liveResolution.methodName}()
							</span>
							<span className="text-[11px] px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700">
								Source: {liveResolution.ruleSource}
							</span>
						</div>
						<div className="text-slate-400 text-xs italic">
							{liveResolution.notes || 'Resolved via standard X3D container hierarchy'}
						</div>
					</div>
				</div>
			</div>

			{/* Filter & Search Bar */}
			<div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
				<div className="relative flex-1 w-full">
					<Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search by Parent (e.g. Appearance), Child (e.g. Material), containerField (e.g. skeleton), or method..."
						className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
					/>
				</div>

				<div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
					{/* Type Filter */}
					<div className="flex items-center gap-1 text-xs">
						<span className="text-slate-400">Prefix:</span>
						<div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
							{(['all', 'add', 'set'] as const).map((t) => (
								<button
									key={t}
									onClick={() => setTypeFilter(t)}
									className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition ${
										typeFilter === t ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
									}`}
								>
									{t.toUpperCase()}
								</button>
							))}
						</div>
					</div>

					{/* Source Filter */}
					<select
						value={sourceFilter}
						onChange={(e) => setSourceFilter(e.target.value)}
						className="bg-slate-950 text-slate-300 text-xs border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
					>
						<option value="all">All Rule Sources</option>
						<option value="special_override">Disambiguated Overrides (mapToMethod2)</option>
						<option value="container_field">ContainerField Rules</option>
						<option value="map_to_method">Standard Mappings (mapToMethod)</option>
					</select>
				</div>
			</div>

			{/* The Table */}
			<div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
				<div className="overflow-x-auto">
					<table className="w-full text-left text-xs border-collapse">
						<thead>
							<tr className="bg-slate-800/90 text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-800">
								<th className="py-3 px-4">Parent Node</th>
								<th className="py-3 px-4">Child Node</th>
								<th className="py-3 px-4">containerField</th>
								<th className="py-3 px-4">Resolved Method Name</th>
								<th className="py-3 px-4">Type</th>
								<th className="py-3 px-4">Rule Category</th>
								<th className="py-3 px-4">Notes / Rationale</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
							{filteredRules.length > 0 ? (
								filteredRules.map((rule) => (
									<tr key={rule.id} className="hover:bg-slate-800/40 transition-colors">
										<td className="py-2.5 px-4 font-semibold text-slate-100">{rule.parentNode}</td>
										<td className="py-2.5 px-4 text-cyan-300">{rule.childNode}</td>
										<td className="py-2.5 px-4 text-amber-300">
											<span className="bg-amber-950/40 border border-amber-800/40 px-1.5 py-0.5 rounded">
												{rule.containerField}
											</span>
											{rule.isDefaultContainerField && (
												<span className="ml-1.5 text-[10px] text-slate-400 font-sans">(default)</span>
											)}
										</td>
										<td className="py-2.5 px-4 font-bold text-emerald-400">
											.{rule.methodName}()
										</td>
										<td className="py-2.5 px-4">
											<span
												className={`text-[10px] px-1.5 py-0.5 rounded font-sans uppercase font-bold ${
													rule.methodType === 'add'
														? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
														: 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
												}`}
											>
												{rule.methodType}
											</span>
										</td>
										<td className="py-2.5 px-4 font-sans text-xs">
											<span
												className={`text-[11px] px-2 py-0.5 rounded-full ${
													rule.ruleSource === 'special_override'
														? 'bg-rose-500/10 text-rose-300 border border-rose-500/30 font-semibold'
														: rule.ruleSource === 'container_field'
														? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
														: 'bg-slate-800 text-slate-300 border border-slate-700'
												}`}
											>
												{rule.ruleSource}
											</span>
										</td>
										<td className="py-2.5 px-4 font-sans text-xs text-slate-400 max-w-xs truncate" title={rule.notes}>
											{rule.notes || '—'}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
										No mapping rules found matching the filters.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				<div className="bg-slate-950/60 px-4 py-2.5 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
					<span>Showing {filteredRules.length} of {allRules.length} relationship entries</span>
					<span className="text-[11px] text-slate-400">Conforming to Web3D ISO/IEC 19777-2 X3DJSAIL binding standard</span>
				</div>
			</div>
		</div>
	);
};
