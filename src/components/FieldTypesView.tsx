import React, { useState, useMemo } from 'react';
import { fieldTypes } from '../services/fieldTypesData';
import { Search, Layers, Database, Tag } from 'lucide-react';

export const FieldTypesView: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [typeFilter, setTypeFilter] = useState('all');

	// Flatten field types into searchable entries
	const entries = useMemo(() => {
		const list: { nodeName: string; fieldName: string; fieldType: string }[] = [];
		for (const [node, fields] of Object.entries(fieldTypes)) {
			for (const [field, type] of Object.entries(fields)) {
				list.push({ nodeName: node, fieldName: field, fieldType: type });
			}
		}
		return list;
	}, []);

	// Distinct types for filter
	const distinctTypes = useMemo(() => {
		const types = new Set<string>();
		entries.forEach((e) => types.add(e.fieldType));
		return Array.from(types).sort();
	}, [entries]);

	const filteredEntries = useMemo(() => {
		return entries.filter((item) => {
			if (typeFilter !== 'all' && item.fieldType !== typeFilter) return false;
			if (searchTerm) {
				const term = searchTerm.toLowerCase();
				return (
					item.nodeName.toLowerCase().includes(term) ||
					item.fieldName.toLowerCase().includes(term) ||
					item.fieldType.toLowerCase().includes(term)
				);
			}
			return true;
		});
	}, [entries, searchTerm, typeFilter]);

	return (
		<div className="space-y-6">
			{/* Overview Banner */}
			<div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
				<div className="flex items-center gap-2 mb-1">
					<Database className="w-5 h-5 text-cyan-400" />
					<h2 className="text-base font-bold text-white tracking-tight">X3D Field Types Registry</h2>
					<span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
						{entries.length} Fields across {Object.keys(fieldTypes).length} Nodes
					</span>
				</div>
				<p className="text-xs text-slate-400 max-w-3xl">
					Lookup dictionary used by serializers to type-cast DOM attribute values into target programming types (float arrays, doubles, vectors, Booleans, or strings) matching X3DJSAIL signatures.
				</p>
			</div>

			{/* Search & Filter */}
			<div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
				<div className="relative flex-1 w-full">
					<Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search node (e.g. Transform), field (e.g. rotation), or type..."
						className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
					/>
				</div>

				<div className="flex items-center gap-2 w-full md:w-auto">
					<Tag className="w-4 h-4 text-slate-400" />
					<select
						value={typeFilter}
						onChange={(e) => setTypeFilter(e.target.value)}
						className="bg-slate-950 text-slate-300 text-xs border border-slate-800 rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
					>
						<option value="all">All Field Types ({distinctTypes.length})</option>
						{distinctTypes.map((t) => (
							<option key={t} value={t}>
								{t}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Table */}
			<div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
				<div className="max-h-[600px] overflow-auto">
					<table className="w-full text-left text-xs border-collapse">
						<thead className="sticky top-0 bg-slate-800 text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-800 z-10">
							<tr>
								<th className="py-3 px-4">Node Class / Interface</th>
								<th className="py-3 px-4">Field / Attribute Name</th>
								<th className="py-3 px-4">X3D Data Type</th>
								<th className="py-3 px-4">Java (X3DJSAIL) Type Binding</th>
								<th className="py-3 px-4">Category</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
							{filteredEntries.slice(0, 200).map((item, idx) => {
								const isMF = item.fieldType.startsWith('MF');
								const isNode = item.fieldType.endsWith('Node');
								const isVector = item.fieldType.includes('Vec') || item.fieldType.includes('Rotation') || item.fieldType.includes('Color');

								return (
									<tr key={`${item.nodeName}-${item.fieldName}-${idx}`} className="hover:bg-slate-800/40 transition-colors">
										<td className="py-2.5 px-4 font-semibold text-slate-100">{item.nodeName}</td>
										<td className="py-2.5 px-4 text-cyan-300">{item.fieldName}</td>
										<td className="py-2.5 px-4">
											<span
												className={`text-[11px] px-2 py-0.5 rounded font-semibold border ${
													isNode
														? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
														: isMF
														? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
														: isVector
														? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
														: 'bg-blue-500/10 text-blue-300 border-blue-500/30'
												}`}
											>
												{item.fieldType}
											</span>
										</td>
										<td className="py-2.5 px-4 text-slate-400 font-sans text-xs">
											{item.fieldType === 'SFString' ? 'String / SFString'
												: item.fieldType === 'SFFloat' ? 'float / SFFloat'
												: item.fieldType === 'SFDouble' ? 'double / SFDouble'
												: item.fieldType === 'SFInt32' ? 'int / SFInt32'
												: item.fieldType === 'SFBool' ? 'boolean / SFBool'
												: item.fieldType === 'SFTime' ? 'double / SFTime'
												: item.fieldType === 'SFVec3f' ? 'float[3] / SFVec3f'
												: item.fieldType === 'SFRotation' ? 'float[4] / SFRotation'
												: item.fieldType === 'SFColor' ? 'float[3] / SFColor'
												: item.fieldType === 'MFVec3f' ? 'float[] / MFVec3f'
												: item.fieldType === 'MFInt32' ? 'int[] / MFInt32'
												: item.fieldType === 'MFString' ? 'String[] / MFString'
												: item.fieldType === 'SFNode' ? 'X3DNode'
												: item.fieldType === 'MFNode' ? 'X3DNode[] / List'
												: item.fieldType}
										</td>
										<td className="py-2.5 px-4 font-sans text-xs text-slate-400">
											{isNode ? 'Scenegraph Reference' : isMF ? 'Array / List' : 'Primitive / Tuple'}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>

				<div className="bg-slate-950/60 px-4 py-2 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
					<span>
						Showing {Math.min(filteredEntries.length, 200)} of {filteredEntries.length} field mappings
					</span>
					<span className="text-[11px] text-slate-400">Extracted from X3D Unified Object Model (X3DUOM)</span>
				</div>
			</div>
		</div>
	);
};
