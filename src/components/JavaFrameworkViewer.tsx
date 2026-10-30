import React, { useState } from 'react';
import { javaFrameworkFiles, JavaSourceFile } from '../services/javaSourcesData';
import { FileCode, Download, Copy, Check, Terminal, FolderTree, Package, Search } from 'lucide-react';
import JSZip from 'jszip';

export const JavaFrameworkViewer: React.FC = () => {
	const [selectedFile, setSelectedFile] = useState<JavaSourceFile>(javaFrameworkFiles[1]); // default to X3DSerializerFramework.java
	const [copied, setCopied] = useState<boolean>(false);
	const [isZipping, setIsZipping] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState<string>('');

	const handleCopy = () => {
		navigator.clipboard.writeText(selectedFile.content);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleDownloadZip = async () => {
		setIsZipping(true);
		try {
			const zip = new JSZip();

			// Add all Java source files and pom.xml
			for (const file of javaFrameworkFiles) {
				zip.file(file.path, file.content);
			}

			// Add a README.md to the zip
			const readme = `# X3D Polyglot Serializer Framework in Java

A single unified Framework in Java, ported over from Node.js, to serialize X3D XML DOM to polyglot source code apps conforming to X3DJSAIL.

## Supported Target Languages:
1. **Java (X3DJSAIL)** with method chunking to prevent JVM 64KB bytecode overflow
2. **JavaScript (GraalJS)** using Java.type and Java.to host interop
3. **Python (GraalPy)** using x3dpsail bindings
4. **Clojure** using doto macros and Java interop
5. **JRuby** using Java::OrgWeb3dX3dJsail
6. **TruffleRuby** using GraalVM Truffle array interop

## Quick Build & Run
\`\`\`bash
mvn clean package
java -jar target/x3d-polyglot-serializer-framework-1.0.0.jar input.x3d java Output.java
\`\`\`
`;
			zip.file('README.md', readme);

			const blob = await zip.generateAsync({ type: 'blob' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'X3D-Polyglot-Serializer-Java-Framework.zip';
			a.click();
			URL.revokeObjectURL(url);
		} catch (err) {
			console.error('Failed to generate ZIP', err);
		} finally {
			setIsZipping(false);
		}
	};

	const filteredFiles = javaFrameworkFiles.filter(
		(f) =>
			f.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			f.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
			f.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="space-y-6">
			{/* Top Banner */}
			<div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2">
							<Terminal className="w-5 h-5 text-cyan-400" />
							<h2 className="text-base font-bold text-white tracking-tight">Java Framework Codebase Repository</h2>
							<span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
								Java 17+ • X3DJSAIL
							</span>
						</div>
						<p className="text-xs text-slate-400 mt-1 max-w-3xl">
							Complete Java implementation of the single Framework, ready to be incorporated into Maven, Gradle, or GraalVM projects.
						</p>
					</div>

					<button
						onClick={handleDownloadZip}
						disabled={isZipping}
						className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition cursor-pointer"
					>
						<Download className="w-4 h-4" />
						<span>{isZipping ? 'Generating ZIP...' : 'Download Java Project (.ZIP)'}</span>
					</button>
				</div>
			</div>

			{/* Source Explorer Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
				{/* Sidebar: File list */}
				<div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col h-[640px]">
					<div className="relative mb-3">
						<Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder="Filter classes..."
							className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
						/>
					</div>

					<div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
						<FolderTree className="w-3.5 h-3.5 text-cyan-400" />
						<span>Package Structure</span>
					</div>

					<div className="flex-1 overflow-y-auto space-y-1 pr-1 mt-1">
						{filteredFiles.map((file) => {
							const isSelected = selectedFile.path === file.path;
							const isPom = file.fileName.endsWith('.xml');
							return (
								<button
									key={file.path}
									onClick={() => setSelectedFile(file)}
									className={`w-full text-left p-2.5 rounded-lg text-xs transition cursor-pointer flex flex-col gap-0.5 border ${
										isSelected
											? 'bg-slate-800 text-cyan-300 border-cyan-500/40 shadow-sm'
											: 'bg-slate-950/40 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border-transparent'
									}`}
								>
									<div className="flex items-center gap-2">
										<FileCode className={`w-3.5 h-3.5 ${isPom ? 'text-amber-400' : 'text-cyan-400'}`} />
										<span className="font-mono font-medium truncate">{file.fileName}</span>
									</div>
									<span className="text-[10px] text-slate-500 truncate pl-5">{file.description}</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* Main Code View */}
				<div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[640px]">
					{/* File Header */}
					<div className="bg-slate-800/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
						<div>
							<span className="text-xs font-mono font-semibold text-slate-200">{selectedFile.path}</span>
							<p className="text-[11px] text-slate-400">{selectedFile.description}</p>
						</div>

						<button
							onClick={handleCopy}
							className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition cursor-pointer"
						>
							{copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
							<span>{copied ? 'Copied' : 'Copy Class'}</span>
						</button>
					</div>

					{/* Source code preview */}
					<div className="flex-1 p-3 overflow-auto bg-slate-950">
						<pre className="font-mono text-xs text-slate-200 leading-relaxed select-all">
							<code>{selectedFile.content}</code>
						</pre>
					</div>
				</div>
			</div>
		</div>
	);
};
