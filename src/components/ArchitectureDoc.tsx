import React from 'react';
import { BookOpen, Layers, Zap, Code, ShieldCheck, Terminal, Cpu } from 'lucide-react';

export const ArchitectureDoc: React.FC = () => {
	return (
		<div className="space-y-6 max-w-5xl mx-auto text-slate-300 text-xs sm:text-sm leading-relaxed">
			{/* Hero summary */}
			<div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 rounded-xl p-6 shadow-sm">
				<div className="flex items-center gap-2 mb-2">
					<BookOpen className="w-5 h-5 text-cyan-400" />
					<h2 className="text-lg font-bold text-white tracking-tight">X3D DOM Polyglot Serializer Architecture & Specification</h2>
				</div>
				<p className="text-slate-300">
					This framework is the Java port of the Node.js X3D serializer suite. It unifies the conversion of X3D XML Document Object Model (DOM) trees into high-performance source code applications adhering to the Web3D ISO/IEC 19777-2 X3D Java Scene Access Interface Library (X3DJSAIL) specification.
				</p>
			</div>

			{/* Core Pillar Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
					<div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
						<Layers className="w-4 h-4" />
						<h3>Unified Table Resolution</h3>
					</div>
					<p className="text-xs text-slate-400">
						Replaces fragmented Node.js conditional statements with a single lookup and resolution table correlating Parent Node, Child Node, and ContainerField (defaulted or explicitly specified) to method names.
					</p>
				</div>

				<div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
					<div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
						<ShieldCheck className="w-4 h-4" />
						<h3>64KB Bytecode Chunking</h3>
					</div>
					<p className="text-xs text-slate-400">
						Solves the infamous JVM 65,535-byte method size limit ("code too large") on massive scenes by breaking up children chains into modular helper methods (<code className="text-amber-300">getTransform_1()</code>) and chunked array classes.
					</p>
				</div>

				<div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
					<div className="flex items-center gap-2 text-purple-400 font-bold mb-2">
						<Cpu className="w-4 h-4" />
						<h3>GraalVM Polyglot Interop</h3>
					</div>
					<p className="text-xs text-slate-400">
						JavaScript output utilizes GraalJS (<code className="text-purple-300">Java.type</code>, <code className="text-purple-300">Java.to</code>), Python utilizes GraalPy with <code className="text-purple-300">x3dpsail</code>, and Ruby utilizes JRuby/TruffleRuby for zero-overhead host execution.
					</p>
				</div>
			</div>

			{/* Detailed Sections */}
			<div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
				<section>
					<h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
						<Code className="w-4 h-4 text-cyan-400" />
						1. Parent-Child & ContainerField Resolution Algorithm
					</h3>
					<p className="text-xs text-slate-300 mb-3">
						In X3D XML, an element's parent-child relationship determines whether a child is appended as a collection element (<code className="text-cyan-300 font-mono">addChildren</code>, <code className="text-cyan-300 font-mono">addJoints</code>) or set as a single property (<code className="text-cyan-300 font-mono">setAppearance</code>, <code className="text-cyan-300 font-mono">setGeometry</code>). The resolution algorithm processes:
					</p>
					<ol className="list-decimal list-inside space-y-2 text-xs text-slate-400 pl-2">
						<li>
							<strong className="text-slate-200">Disambiguated Overrides (mapToMethod2):</strong> Specific node pairs have custom mapping rules (e.g. <code className="text-slate-200">Shape -&gt; ProtoInstance</code> invokes <code className="text-emerald-400 font-mono">setGeometry</code>, whereas <code className="text-slate-200">Appearance -&gt; ProtoInstance</code> invokes <code className="text-emerald-400 font-mono">addShaders</code>).
						</li>
						<li>
							<strong className="text-slate-200">Standard Class Mappings (mapToMethod):</strong> Standard X3D node-to-node relationships look up the type signature in the central table.
						</li>
						<li>
							<strong className="text-slate-200">ContainerField Override Heuristic:</strong> If a child node specifies an explicit <code className="text-amber-300 font-mono">containerField</code> (such as <code className="text-amber-300">joints</code>, <code className="text-amber-300">skeleton</code>, <code className="text-amber-300">skin</code>, <code className="text-amber-300">sites</code>, <code className="text-amber-300">viewpoints</code>), it overrides the default method and resolves to <code className="text-emerald-400 font-mono">add[ContainerField]()</code> or <code className="text-emerald-400 font-mono">set[ContainerField]()</code>.
						</li>
						<li>
							<strong className="text-slate-200">Sibling Index Discrimination:</strong> When a child is not the first sibling of its type, the framework automatically uses <code className="text-blue-300 font-mono">add*</code> rather than <code className="text-blue-300 font-mono">set*</code>.
						</li>
					</ol>
				</section>

				<section className="border-t border-slate-800 pt-6">
					<h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
						<Zap className="w-4 h-4 text-amber-400" />
						2. Overcoming the JVM 64KB Bytecode Limit (Tufani8 Problem)
					</h3>
					<p className="text-xs text-slate-300 mb-3">
						Large X3D scenes with hundreds of nodes or dense mesh coordinates (such as character models like Tufani8) previously generated a single monolithic method chaining thousands of setter invocations. The Java Virtual Machine specification limits any single method's compiled bytecode to 65,535 bytes, resulting in compiler failures.
					</p>
					<div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
						<p className="text-slate-400">// Modular Helper Method Pattern generated by JavaSerializer:</p>
						<p className="text-cyan-300">public Transform getTransform_1() &#123;</p>
						<p className="pl-4">return new Transform()</p>
						<p className="pl-6">.setTranslation(new float[] &#123;0.0f, 1.5f, 0.0f&#125;)</p>
						<p className="pl-6">.addChild(getShape_2())</p>
						<p className="pl-6">.addChild(getHAnimHumanoid_3());</p>
						<p className="text-cyan-300">&#125;</p>
					</div>
					<p className="text-xs text-slate-400 mt-2">
						When children exceed <code className="text-slate-200">maxChildrenPerMethod</code>, intermediate adder routines (<code className="text-slate-200">addTransformChildren_1(Transform parent)</code>) are automatically generated. In addition, floating-point array constants are partitioned into static nested classes with <code className="text-slate-200">.append()</code> combiners.
					</p>
				</section>

				<section className="border-t border-slate-800 pt-6">
					<h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
						<Terminal className="w-4 h-4 text-emerald-400" />
						3. GraalVM & Polyglot Runtime Interop
					</h3>
					<p className="text-xs text-slate-300 mb-2">
						Because X3DJSAIL is an established Java standard, target languages run on the GraalVM Polyglot engine with zero JNI overhead:
					</p>
					<ul className="list-disc list-inside space-y-1 text-xs text-slate-400 pl-2">
						<li><strong className="text-slate-200">GraalJS:</strong> Direct calls to <code className="text-slate-200">Java.type("float[]")</code> and <code className="text-slate-200">Java.to(...)</code> seamlessly pass typed arrays into Java methods without boxing.</li>
						<li><strong className="text-slate-200">GraalPy:</strong> Uses <code className="text-slate-200">import x3dpsail as x3d</code> with <code className="text-slate-200">x3d.doubleToFloat([...])</code>.</li>
						<li><strong className="text-slate-200">Clojure:</strong> Utilizes Clojure's native <code className="text-slate-200">(doto ...)</code> macro and <code className="text-slate-200">(float-array [...])</code> for functional pipeline generation.</li>
						<li><strong className="text-slate-200">JRuby & TruffleRuby:</strong> Emits clean Ruby objects with <code className="text-slate-200">.to_java</code> array coercions.</li>
					</ul>
				</section>
			</div>
		</div>
	);
};
